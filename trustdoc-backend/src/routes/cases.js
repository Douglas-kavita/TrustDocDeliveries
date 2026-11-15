const express = require('express');
const crypto = require('crypto');
const pool = require('../db');
const { requireAuth, hasRole, canAccessCase } = require('../session');
const { sendSMS } = require('./auth');

const router = express.Router();
router.use(requireAuth);

function serviceId() {
  return `TRD-${new Date().getFullYear()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
}

function handoverCode() {
  return String(crypto.randomInt(1000, 10000));
}

function hashCode(code) {
  return crypto.createHash('sha256').update(String(code)).digest('hex');
}

async function tracking(client, caseId, status, label, description = '') {
  await client.query(
    `INSERT INTO tracking_events(case_id,status,label,description)
     VALUES($1,$2,$3,$4)`,
    [caseId, status, label, description]
  );
}

async function audit(client, caseId, req, eventType, previousValue, newValue) {
  await client.query(
    `INSERT INTO case_audit_events
       (case_id,actor_id,actor_role,event_type,previous_value,new_value)
     VALUES($1,$2,$3,$4,$5,$6)`,
    [
      caseId,
      req.user.id,
      req.roles[0] || 'client',
      eventType,
      previousValue == null ? null : JSON.stringify(previousValue),
      newValue == null ? null : JSON.stringify(newValue)
    ]
  );
}

async function loadCase(client, id) {
  const result = await client.query('SELECT * FROM cases WHERE id=$1 FOR UPDATE', [id]);
  return result.rows[0] || null;
}

function requireStatus(row, allowed) {
  return allowed.includes(row.status);
}

/* -------------------------------------------------------
   LIST CLIENT CASES
------------------------------------------------------- */

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM cases
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ cases: result.rows });
  } catch (error) {
    console.error('cases list', error);
    res.status(500).json({ error: 'Unable to load cases' });
  }
});

/* -------------------------------------------------------
   SINGLE CASE + TRACKING
------------------------------------------------------- */

router.get('/:id', async (req, res) => {
  try {
    if (!(await canAccessCase(req, req.params.id))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [caseResult, eventResult, assignmentResult] = await Promise.all([
      pool.query('SELECT * FROM cases WHERE id=$1', [req.params.id]),
      pool.query(
        'SELECT * FROM tracking_events WHERE case_id=$1 ORDER BY created_at ASC',
        [req.params.id]
      ),
      pool.query(
        `SELECT ca.*,r.name AS rider_name,r.phone AS rider_phone,
                r.number_plate,r.current_lat,r.current_lng
         FROM case_assignments ca
         JOIN riders r ON r.id=ca.rider_id
         WHERE ca.case_id=$1 AND ca.unassigned_at IS NULL
         ORDER BY ca.assigned_at DESC
         LIMIT 1`,
        [req.params.id]
      )
    ]);

    if (!caseResult.rows.length) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const safeCase = { ...caseResult.rows[0] };

    if (!req.roles.includes('client')) {
      delete safeCase.handover_code_hash;
    }

    res.json({
      case: safeCase,
      trackingEvents: eventResult.rows,
      assignment: assignmentResult.rows[0] || null
    });
  } catch (error) {
    console.error('case detail', error);
    res.status(500).json({ error: 'Unable to load case' });
  }
});

/* -------------------------------------------------------
   CREATE REQUEST
------------------------------------------------------- */

router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      documentType,
      collectionPoint,
      deliveryAddress,
      office,
      tier,
      clientName,
      clientPhone,
      enteredManually
    } = req.body;

    if (!documentType || !collectionPoint || !deliveryAddress) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Missing required request details' });
    }

    const id = serviceId();

    const created = await client.query(
      `INSERT INTO cases(
         id,user_id,document_type,status,
         collection_point,delivery_address,
         office,tier,client_name,client_phone,
         entered_manually
       )
       VALUES($1,$2,$3,'submitted',$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        id,
        req.user.id,
        documentType,
        collectionPoint,
        deliveryAddress,
        office || collectionPoint,
        tier || null,
        clientName || req.user.name || null,
        clientPhone || req.user.phone || null,
        Boolean(enteredManually)
      ]
    );

    await tracking(
      client,
      id,
      'submitted',
      'Request submitted',
      'Document delivery request received'
    );

    await audit(client, id, req, 'case_created', null, {
      status: 'submitted'
    });

    await client.query('COMMIT');

    if (req.user.phone) {
      await sendSMS(
        req.user.phone,
        `TrustDoc: Request received. Reference: ${id}.`
      );
    }

    res.status(201).json({
      success: true,
      case: created.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('case create', error);
    res.status(500).json({ error: 'Unable to create request' });
  } finally {
    client.release();
  }
});

/* -------------------------------------------------------
   FULL WEBSITE WORKFLOW
------------------------------------------------------- */

router.patch('/:id/workflow', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const action = req.body.action;
    const row = await loadCase(client, req.params.id);

    if (!row) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Case not found' });
    }

    if (!(await canAccessCase(req, req.params.id))) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied' });
    }

    const before = { status: row.status };

    /* STORAGE PAYMENT */

    if (action === 'record_storage_payment') {
      if (!req.roles.some(r => ['agent', 'admin'].includes(r))) {
        throw Object.assign(new Error('Agent access required'), { status: 403 });
      }

      if (!requireStatus(row, ['submitted'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      const reference = String(req.body.reference || '').trim();
      const amountMinor = Number(req.body.amountMinor || 0);

      if (!reference || !Number.isInteger(amountMinor) || amountMinor <= 0) {
        throw Object.assign(new Error('Valid payment reference and amount required'), { status: 400 });
      }

      const transaction = await client.query(
        `INSERT INTO financial_transactions
           (case_id,external_reference,transaction_type,amount_minor,currency,status,confirmed_at)
         VALUES($1,$2,'storage_payment',$3,'KES','confirmed',NOW())
         RETURNING id`,
        [row.id, reference, amountMinor]
      );

      if (req.body.hudumaAmountMinor) {
        await client.query(
          `INSERT INTO financial_allocations
             (transaction_id,recipient_type,recipient_id,amount_minor)
           VALUES($1,'huduma',NULL,$2)`,
          [transaction.rows[0].id, Number(req.body.hudumaAmountMinor)]
        );
      }

      await client.query(
        `UPDATE cases
         SET status='storage_paid',
             storage_paid_at=NOW(),
             storage_payment_reference=$2,
             updated_at=NOW()
         WHERE id=$1`,
        [row.id, reference]
      );

      await tracking(client, row.id, 'storage_paid', 'Storage payment confirmed');
    }

    /* DOCUMENT READY */

    else if (action === 'mark_ready') {
      if (!req.roles.some(r => ['agent', 'admin'].includes(r))) {
        throw Object.assign(new Error('Agent access required'), { status: 403 });
      }

      if (!requireStatus(row, ['storage_paid'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      await client.query(
        `UPDATE cases
         SET status='ready',ready_at=NOW(),updated_at=NOW()
         WHERE id=$1`,
        [row.id]
      );

      await tracking(client, row.id, 'ready', 'Document ready');
    }

    /* NOTIFY CLIENT */

    else if (action === 'notify_client') {
      if (!req.roles.some(r => ['agent', 'admin'].includes(r))) {
        throw Object.assign(new Error('Agent access required'), { status: 403 });
      }

      if (!requireStatus(row, ['ready'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      await client.query(
        `UPDATE cases
         SET status='notified',client_notified_at=NOW(),updated_at=NOW()
         WHERE id=$1`,
        [row.id]
      );

      await tracking(client, row.id, 'notified', 'Client notified');

      if (row.client_phone) {
        await sendSMS(
          row.client_phone,
          `TrustDoc: Your document ${row.id} is ready. Open TrustDoc to continue delivery.`
        );
      }
    }

    /* DELIVERY PAYMENT */

    else if (action === 'record_delivery_payment') {
      if (!requireStatus(row, ['notified'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      const reference = String(req.body.reference || '').trim();
      const amountMinor = Number(req.body.amountMinor || 0);

      if (!reference || !Number.isInteger(amountMinor) || amountMinor <= 0) {
        throw Object.assign(new Error('Valid payment reference and amount required'), { status: 400 });
      }

      await client.query(
        `INSERT INTO financial_transactions
           (case_id,external_reference,transaction_type,amount_minor,currency,status,confirmed_at)
         VALUES($1,$2,'delivery_payment',$3,'KES','confirmed',NOW())`,
        [row.id, reference, amountMinor]
      );

      const code = handoverCode();

      await client.query(
        `UPDATE cases
         SET status='delivery_paid',
             delivery_paid_at=NOW(),
             delivery_payment_reference=$2,
             handover_code_hash=$3,
             updated_at=NOW()
         WHERE id=$1`,
        [row.id, reference, hashCode(code)]
      );

      await tracking(client, row.id, 'delivery_paid', 'Delivery payment confirmed');

      /*
       * The plaintext handover code is deliberately not stored.
       * SMS is sent only to the client.
       */
      if (row.client_phone) {
        await sendSMS(
          row.client_phone,
          `TrustDoc: Delivery payment confirmed for ${row.id}. Your handover code is ${code}. Give it to the rider only after receiving your document.`
        );
      }
    }

    /* ALLOCATE RIDER */

    else if (action === 'allocate') {
      if (!req.roles.some(r => ['agent', 'admin'].includes(r))) {
        throw Object.assign(new Error('Agent access required'), { status: 403 });
      }

      if (!requireStatus(row, ['delivery_paid'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      const riderId = req.body.riderId;

      const riderResult = await client.query(
        `SELECT *
         FROM riders
         WHERE id=$1
           AND verification_status='approved'
           AND account_status='active'
         FOR UPDATE`,
        [riderId]
      );

      if (!riderResult.rows.length) {
        throw Object.assign(new Error('Approved active rider not found'), { status: 404 });
      }

      const rider = riderResult.rows[0];

      await client.query(
        `UPDATE case_assignments
         SET unassigned_at=NOW()
         WHERE case_id=$1 AND unassigned_at IS NULL`,
        [row.id]
      );

      await client.query(
        `INSERT INTO case_assignments(case_id,rider_id,assigned_by,note)
         VALUES($1,$2,$3,$4)`,
        [row.id, rider.id, req.user.id, req.body.note || null]
      );

      await client.query(
        `UPDATE cases
         SET status='allocated',
             rider_name=$2,
             rider_id_number=$3,
             rider_allocated_at=NOW(),
             rider_response_deadline=NOW()+INTERVAL '5 minutes',
             updated_at=NOW()
         WHERE id=$1`,
        [row.id, rider.name, rider.id_number]
      );

      await tracking(client, row.id, 'allocated', 'Rider allocated');
    }

    /* RIDER ACCEPT */

    else if (action === 'rider_accept') {
      if (!req.roles.includes('rider')) {
        throw Object.assign(new Error('Rider access required'), { status: 403 });
      }

      if (!requireStatus(row, ['allocated'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      if (row.rider_response_deadline && new Date(row.rider_response_deadline) < new Date()) {
        throw Object.assign(new Error('Allocation response time expired'), { status: 409 });
      }

      await client.query(
        `UPDATE cases
         SET status='accepted',
             rider_accepted_at=NOW(),
             rider_cancel_deadline=NOW()+INTERVAL '5 minutes',
             updated_at=NOW()
         WHERE id=$1`,
        [row.id]
      );

      await tracking(client, row.id, 'accepted', 'Rider accepted delivery');
    }

    /* RIDER REJECT/CANCEL */

    else if (action === 'rider_reject') {
      if (!req.roles.includes('rider')) {
        throw Object.assign(new Error('Rider access required'), { status: 403 });
      }

      if (!requireStatus(row, ['allocated', 'accepted'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      if (
        row.status === 'accepted' &&
        row.rider_cancel_deadline &&
        new Date(row.rider_cancel_deadline) < new Date()
      ) {
        throw Object.assign(new Error('Rider cancellation period has expired'), { status: 409 });
      }

      await client.query(
        `UPDATE case_assignments
         SET unassigned_at=NOW()
         WHERE case_id=$1 AND unassigned_at IS NULL`,
        [row.id]
      );

      await client.query(
        `UPDATE cases
         SET status='delivery_paid',
             rider_name=NULL,
             rider_id_number=NULL,
             rider_allocated_at=NULL,
             rider_accepted_at=NULL,
             rider_response_deadline=NULL,
             rider_cancel_deadline=NULL,
             updated_at=NOW()
         WHERE id=$1`,
        [row.id]
      );

      await tracking(client, row.id, 'delivery_paid', 'Rider allocation released');
    }

    /* RIDER COMMITS / IN TRANSIT */

    else if (action === 'rider_commit') {
      if (!req.roles.includes('rider')) {
        throw Object.assign(new Error('Rider access required'), { status: 403 });
      }

      if (!requireStatus(row, ['accepted'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      await client.query(
        `UPDATE cases
         SET status='in_transit',
             in_transit_at=NOW(),
             updated_at=NOW()
         WHERE id=$1`,
        [row.id]
      );

      await tracking(client, row.id, 'in_transit', 'Document in transit');
    }

    /* PHYSICAL HANDOVER */

    else if (action === 'handover') {
      if (!req.roles.includes('rider')) {
        throw Object.assign(new Error('Rider access required'), { status: 403 });
      }

      if (!requireStatus(row, ['in_transit'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      const code = String(req.body.code || '').replace(/\D/g, '');

      if (!/^\d{4}$/.test(code) || hashCode(code) !== row.handover_code_hash) {
        throw Object.assign(new Error('Invalid handover code'), { status: 400 });
      }

      await client.query(
        `UPDATE cases
         SET status='delivered',
             handover_verified_at=NOW(),
             delivered_at=NOW(),
             updated_at=NOW()
         WHERE id=$1`,
        [row.id]
      );

      await tracking(client, row.id, 'delivered', 'Document physically delivered');
    }

    /* CLIENT CONFIRM */

    else if (action === 'client_confirm') {
      if (!req.roles.includes('client')) {
        throw Object.assign(new Error('Client access required'), { status: 403 });
      }

      if (!requireStatus(row, ['delivered'])) {
        throw Object.assign(new Error('Invalid workflow stage'), { status: 409 });
      }

      await client.query(
        `UPDATE cases
         SET client_confirmed_at=NOW(),updated_at=NOW()
         WHERE id=$1`,
        [row.id]
      );

      await tracking(client, row.id, 'delivered', 'Delivery confirmed by client');
    }

    /* DISPUTE */

    else if (action === 'dispute') {
      if (!req.roles.includes('client')) {
        throw Object.assign(new Error('Client access required'), { status: 403 });
      }

      if (!requireStatus(row, ['delivered'])) {
        throw Object.assign(new Error('Only a delivered case can be disputed'), { status: 409 });
      }

      const reason = String(req.body.reason || '').trim();

      if (!reason) {
        throw Object.assign(new Error('Dispute reason required'), { status: 400 });
      }

      await client.query(
        `UPDATE cases
         SET disputed_at=NOW(),
             dispute_reason=$2,
             updated_at=NOW()
         WHERE id=$1`,
        [row.id, reason]
      );

      await client.query(
        `INSERT INTO complaints
           (case_id,submitted_by,submitter_type,subject,message,status)
         VALUES($1,$2,'client','Delivery dispute',$3,'open')`,
        [row.id, req.user.id, reason]
      );

      await tracking(client, row.id, 'delivered', 'Delivery dispute opened');
    }

    else {
      throw Object.assign(new Error('Unknown workflow action'), { status: 400 });
    }

    const updated = await client.query('SELECT * FROM cases WHERE id=$1', [row.id]);

    await audit(
      client,
      row.id,
      req,
      action,
      before,
      { status: updated.rows[0].status }
    );

    await client.query('COMMIT');

    const safeCase = { ...updated.rows[0] };
    delete safeCase.handover_code_hash;

    res.json({
      success: true,
      case: safeCase
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('case workflow', error);

    res.status(error.status || 500).json({
      error: error.status ? error.message : 'Unable to update request'
    });
  } finally {
    client.release();
  }
});

/* -------------------------------------------------------
   LEGACY STATUS ENDPOINT
   Retained for existing clients while migration continues.
------------------------------------------------------- */

router.patch('/:id/status', hasRole('admin', 'agent', 'rider'), async (req, res) => {
  try {
    const allowed = [
      'submitted',
      'storage_paid',
      'ready',
      'notified',
      'delivery_paid',
      'allocated',
      'accepted',
      'in_transit',
      'delivered',
      'failed'
    ];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (!(await canAccessCase(req, req.params.id))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE cases
       SET status=$1,updated_at=NOW()
       WHERE id=$2
       RETURNING *`,
      [req.body.status, req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ success: true, case: result.rows[0] });
  } catch (error) {
    console.error('legacy status update', error);
    res.status(500).json({ error: 'Unable to update case' });
  }
});

/* -------------------------------------------------------
   CLIENT CANCEL
------------------------------------------------------- */

router.post('/:id/cancel', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cases WHERE id=$1',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const row = result.rows[0];

    if (row.user_id !== req.user.id && !req.roles.includes('admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!['submitted'].includes(row.status)) {
      return res.status(409).json({
        error: 'This request can no longer be cancelled automatically'
      });
    }

    const updated = await pool.query(
      `UPDATE cases
       SET status='failed',updated_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [row.id]
    );

    res.json({
      success: true,
      case: updated.rows[0]
    });
  } catch (error) {
    console.error('case cancellation', error);
    res.status(500).json({ error: 'Unable to cancel request' });
  }
});

module.exports = router;
