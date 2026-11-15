const express = require('express');
const pool = require('../db');
const { requireAuth, hasRole } = require('../session');

const router = express.Router();

router.use(requireAuth);
router.use(hasRole('admin'));

// GET /api/admin/agents
// Full Agent list for TrustDoc Admin.
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.name,
        a.phone,
        a.email,
        a.id_number,
        a.mpesa_phone,
        a.location,
        a.business_type,
        a.service_area,
        a.commission_rate,
        a.bio,
        a.verification_status,
        a.account_status,
        a.is_active,
        a.is_available,
        a.current_lat,
        a.current_lng,
        a.last_active_at,
        a.created_at,
        a.updated_at,

        COUNT(DISTINCT c.id)::int AS total_jobs,

        COALESCE(
          SUM(
            DISTINCT CASE
              WHEN fa.recipient_id = a.id
              THEN fa.amount_minor
              ELSE 0
            END
          ),
          0
        )::bigint AS total_earned_minor

      FROM agents a

      LEFT JOIN cases c
        ON c.agent_id = a.id

      LEFT JOIN financial_allocations fa
        ON fa.recipient_id = a.id
       AND fa.recipient_type = 'agent'

      GROUP BY a.id
      ORDER BY a.created_at DESC
    `);

    res.json({ agents: result.rows });
  } catch (err) {
    console.error('admin agents list', err);
    res.status(500).json({ error: 'Unable to load agents' });
  }
});

// GET /api/admin/agents/:id
router.get('/:id', async (req, res) => {
  try {
    const agentResult = await pool.query(
      `SELECT * FROM agents WHERE id = $1`,
      [req.params.id]
    );

    if (!agentResult.rows.length) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const jobsResult = await pool.query(
      `SELECT
         id,
         document_type,
         status,
         collection_point,
         delivery_address,
         fee_amount,
         created_at,
         updated_at
       FROM cases
       WHERE agent_id = $1
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    const earningsResult = await pool.query(
      `SELECT
         fa.id,
         fa.transaction_id,
         fa.amount_minor,
         fa.created_at,
         ft.external_reference,
         ft.transaction_type,
         ft.currency,
         ft.status,
         ft.confirmed_at
       FROM financial_allocations fa
       JOIN financial_transactions ft
         ON ft.id = fa.transaction_id
       WHERE fa.recipient_type = 'agent'
         AND fa.recipient_id = $1
       ORDER BY fa.created_at DESC`,
      [req.params.id]
    );

    res.json({
      agent: agentResult.rows[0],
      jobs: jobsResult.rows,
      earnings: earningsResult.rows
    });
  } catch (err) {
    console.error('admin agent profile', err);
    res.status(500).json({ error: 'Unable to load agent' });
  }
});

// PATCH /api/admin/agents/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { action } = req.body;

    const allowed = {
      approve: {
        verification: 'approved',
        account: 'active',
        active: true
      },
      reject: {
        verification: 'rejected',
        account: 'inactive',
        active: false
      },
      suspend: {
        verification: null,
        account: 'suspended',
        active: false
      },
      reinstate: {
        verification: 'approved',
        account: 'active',
        active: true
      }
    };

    if (!allowed[action]) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const next = allowed[action];

    const result = await pool.query(
      `UPDATE agents
       SET
         verification_status =
           COALESCE($1, verification_status),
         account_status = $2,
         is_active = $3,
         updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [
        next.verification,
        next.account,
        next.active,
        req.params.id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({
      success: true,
      agent: result.rows[0]
    });
  } catch (err) {
    console.error('admin agent status', err);
    res.status(500).json({ error: 'Unable to update agent' });
  }
});

module.exports = router;
