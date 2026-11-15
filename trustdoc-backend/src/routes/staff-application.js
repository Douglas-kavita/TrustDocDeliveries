const express = require('express');
const pool = require('../db');

const router = express.Router();

function clean(value) {
  return String(value || '').trim();
}

router.post('/apply', async (req, res) => {
  const client = await pool.connect();

  try {
    const role = clean(req.body.role).toLowerCase();
    const name = clean(req.body.name);
    const phone = clean(req.body.phone);
    const email = clean(req.body.email).toLowerCase();
    const idNumber = clean(req.body.idNumber);

    if (!['agent', 'rider'].includes(role)) {
      return res.status(400).json({ error: 'Invalid staff role' });
    }

    if (!name || !phone || !email || !idNumber) {
      return res.status(400).json({
        error: 'Name, phone, email and National ID are required'
      });
    }

    const table = role === 'agent' ? 'agents' : 'riders';

    await client.query('BEGIN');

    const existing = await client.query(
      `SELECT id,email,phone,id_number,verification_status,account_status
       FROM ${table}
       WHERE LOWER(email)=LOWER($1)
          OR phone=$2
          OR id_number=$3
       LIMIT 1
       FOR UPDATE`,
      [email, phone, idNumber]
    );

    if (existing.rows.length) {
      await client.query('ROLLBACK');

      const profile = existing.rows[0];

      if (
        profile.email?.toLowerCase() === email &&
        profile.phone === phone &&
        profile.id_number === idNumber
      ) {
        return res.status(200).json({
          success: true,
          existing: true,
          application: {
            id: profile.id,
            role,
            verification_status: profile.verification_status,
            account_status: profile.account_status
          }
        });
      }

      return res.status(409).json({
        error:
          'An application already exists using this email, phone number or National ID.'
      });
    }

    const created = await client.query(
      `INSERT INTO ${table}
         (name,phone,email,id_number,verification_status,account_status)
       VALUES($1,$2,$3,$4,'pending','inactive')
       RETURNING
         id,name,phone,email,verification_status,account_status,created_at`,
      [name, phone, email, idNumber]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      existing: false,
      application: {
        ...created.rows[0],
        role
      }
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {}

    console.error('staff application', error);

    res.status(500).json({
      success: false,
      error: 'Unable to submit staff application'
    });
  } finally {
    client.release();
  }
});

/*
 * GET /api/staff-application/profile/:role/:id
 *
 * Used by the website session layer to retrieve the
 * Agent/Rider profile from the PostgreSQL backend.
 */
router.get('/profile/:role/:id', async (req, res) => {
  try {
    const role = clean(req.params.role).toLowerCase();
    const id = clean(req.params.id);

    if (!['agent', 'rider'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid staff role'
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Staff ID is required'
      });
    }

    const table = role === 'agent' ? 'agents' : 'riders';

    const result = await pool.query(
      `SELECT *
       FROM ${table}
       WHERE id = $1
       LIMIT 1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'Staff profile not found'
      });
    }

    const profile = result.rows[0];

    res.json({
      success: true,
      profile: {
        id: profile.id,
        role,
        name: profile.name || null,
        phone: profile.phone || null,
        email: profile.email || null,
        status: profile.verification_status || 'pending',
        accountStatus: profile.account_status || null,
        numberPlate:
          role === 'rider'
            ? profile.number_plate || null
            : null,
        vehicleType: null,
        serviceArea:
          role === 'agent'
            ? profile.service_area || null
            : null,
        createdAt: profile.created_at || null
      }
    });
  } catch (error) {
    console.error('staff profile lookup', error);

    res.status(500).json({
      success: false,
      error: 'Unable to load staff profile'
    });
  }
});
router.get('/admin-applications', async (req, res) => {
  try {
    const internalSecret = clean(
      req.headers['x-trustdoc-admin-secret']
    );

    if (
      !process.env.TRUSTDOC_ADMIN_INTERNAL_SECRET ||
      internalSecret !== process.env.TRUSTDOC_ADMIN_INTERNAL_SECRET
    ) {
      return res.status(403).json({
        error: 'Admin service authentication failed'
      });
    }

    const [agents, riders] = await Promise.all([
      pool.query(`
        SELECT
          id,
          name,
          phone,
          email,
          id_number,
          service_area,
          verification_status,
          account_status,
          is_active,
          created_at,
          updated_at
        FROM agents
        ORDER BY created_at DESC
      `),

      pool.query(`
        SELECT
          id,
          name,
          phone,
          email,
          id_number,
          number_plate,
          verification_status,
          account_status,
          is_active,
          created_at,
          updated_at
        FROM riders
        ORDER BY created_at DESC
      `)
    ]);

    return res.json({
      success: true,

      agents: agents.rows.map(item => ({
        ...item,
        status: item.verification_status || 'pending'
      })),

      riders: riders.rows.map(item => ({
        ...item,
        status: item.verification_status || 'pending'
      }))
    });
  } catch (error) {
    console.error('admin staff applications', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to load staff applications'
    });
  }
});
router.patch('/status', async (req, res) => {
  const client = await pool.connect();

  try {
    const internalSecret = clean(
      req.headers['x-trustdoc-admin-secret']
    );

    if (
      !process.env.TRUSTDOC_ADMIN_INTERNAL_SECRET ||
      internalSecret !== process.env.TRUSTDOC_ADMIN_INTERNAL_SECRET
    ) {
      return res.status(403).json({
        error: 'Admin service authentication failed'
      });
    }

    const role = clean(req.body.role).toLowerCase();
    const id = clean(req.body.id);
    const status = clean(req.body.status).toLowerCase();

    if (!['agent', 'rider'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid staff role'
      });
    }

    if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid staff status'
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Staff application ID is required'
      });
    }

    const table = role === 'agent' ? 'agents' : 'riders';

    await client.query('BEGIN');

    const existing = await client.query(
      `SELECT
         id,
         name,
         phone,
         email,
         id_number,
         verification_status,
         account_status,
         is_active
       FROM ${table}
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [id]
    );

    if (!existing.rows.length) {
      await client.query('ROLLBACK');

      return res.status(404).json({
        error: 'Staff application not found'
      });
    }

    const profile = existing.rows[0];

    /*
     * REJECT
     */
    if (status === 'rejected') {
      const updated = await client.query(
        `UPDATE ${table}
         SET
           verification_status = 'rejected',
           account_status = 'inactive',
           is_active = FALSE,
           updated_at = NOW()
         WHERE id = $1
         RETURNING
           id,
           name,
           phone,
           email,
           verification_status,
           account_status,
           is_active`,
        [id]
      );

      await client.query('COMMIT');

      return res.json({
        success: true,
        profile: updated.rows[0],
        accountCreated: false
      });
    }

    /*
     * SUSPEND
     */
    if (status === 'suspended') {
      const updated = await client.query(
        `UPDATE ${table}
         SET
           account_status = 'suspended',
           is_active = FALSE,
           updated_at = NOW()
         WHERE id = $1
         RETURNING
           id,
           name,
           phone,
           email,
           verification_status,
           account_status,
           is_active`,
        [id]
      );

      await client.query('COMMIT');

      return res.json({
        success: true,
        profile: updated.rows[0],
        accountCreated: false
      });
    }

    /*
     * RETURN TO PENDING
     */
    if (status === 'pending') {
      const updated = await client.query(
        `UPDATE ${table}
         SET
           verification_status = 'pending',
           account_status = 'inactive',
           is_active = FALSE,
           updated_at = NOW()
         WHERE id = $1
         RETURNING
           id,
           name,
           phone,
           email,
           verification_status,
           account_status,
           is_active`,
        [id]
      );

      await client.query('COMMIT');

      return res.json({
        success: true,
        profile: updated.rows[0],
        accountCreated: false
      });
    }

    /*
     * APPROVAL
     *
     * Approval activates the staff profile and creates the
     * actual application-login account.
     */
    const updated = await client.query(
      `UPDATE ${table}
       SET
         verification_status = 'approved',
         account_status = 'active',
         is_active = TRUE,
         updated_at = NOW()
       WHERE id = $1
       RETURNING
         id,
         name,
         phone,
         email,
         id_number,
         verification_status,
         account_status,
         is_active`,
      [id]
    );

    const approvedProfile = updated.rows[0];

    /*
     * Check whether a users account already exists.
     *
     * Phone is UNIQUE in users, so we must reuse an existing
     * account rather than blindly inserting another one.
     */
    let userResult = await client.query(
      `SELECT
         id,
         name,
         phone,
         email,
         id_number,
         is_verified
       FROM users
       WHERE phone = $1
          OR (
            $2::text IS NOT NULL
            AND LOWER(email) = LOWER($2)
          )
       ORDER BY
         CASE
           WHEN phone = $1 THEN 0
           ELSE 1
         END
       LIMIT 1
       FOR UPDATE`,
      [
        approvedProfile.phone,
        approvedProfile.email || null
      ]
    );

    let user;

    if (userResult.rows.length) {
      user = userResult.rows[0];

      /*
       * Keep the staff account's basic identity synchronized
       * with the approved application.
       *
       * Do not overwrite password_hash.
       */
      const refreshed = await client.query(
        `UPDATE users
         SET
           name = $1,
           email = $2,
           id_number = $3,
           is_verified = TRUE,
           updated_at = NOW()
         WHERE id = $4
         RETURNING
           id,
           name,
           phone,
           email,
           id_number,
           is_verified`,
        [
          approvedProfile.name,
          approvedProfile.email || null,
          approvedProfile.id_number || null,
          user.id
        ]
      );

      user = refreshed.rows[0];
    } else {
      const created = await client.query(
        `INSERT INTO users
           (
             name,
             phone,
             email,
             id_number,
             is_verified,
             password_hash
           )
         VALUES
           ($1, $2, $3, $4, TRUE, NULL)
         RETURNING
           id,
           name,
           phone,
           email,
           id_number,
           is_verified`,
        [
          approvedProfile.name,
          approvedProfile.phone,
          approvedProfile.email || null,
          approvedProfile.id_number || null
        ]
      );

      user = created.rows[0];
    }

    /*
     * Create the staff role if it does not already exist.
     */
    await client.query(
      `INSERT INTO account_roles
         (account_id, role)
       VALUES
         ($1, $2)
       ON CONFLICT (account_id, role)
       DO NOTHING`,
      [user.id, role]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      profile: approvedProfile,
      accountCreated: true,
      account: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role
      }
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {}

    console.error('admin staff status', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to update staff application'
    });
  } finally {
    client.release();
  }
});

/*
 * GET /api/staff-application/admin-account/:email
 *
 * Used by the website Admin OTP verification route to confirm
 * that the verified email belongs to the real PostgreSQL Admin account.
 */
router.get('/admin-account/:email', async (req, res) => {
  try {
    const internalSecret = clean(
      req.headers['x-trustdoc-admin-secret']
    );

    if (
      !process.env.TRUSTDOC_ADMIN_INTERNAL_SECRET ||
      internalSecret !== process.env.TRUSTDOC_ADMIN_INTERNAL_SECRET
    ) {
      return res.status(403).json({
        error: 'Admin service authentication failed'
      });
    }

    const email = clean(req.params.email).toLowerCase();

    if (!email) {
      return res.status(400).json({
        error: 'Admin email is required'
      });
    }

    const result = await pool.query(
      `SELECT
         u.id,
         u.name,
         u.phone,
         u.email,
         u.is_verified,
         ar.role
       FROM users u
       JOIN account_roles ar
         ON ar.account_id = u.id
       WHERE LOWER(u.email) = LOWER($1)
         AND ar.role = 'admin'
       LIMIT 1`,
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'No TrustDoc admin account exists for this email.'
      });
    }

    const admin = result.rows[0];

    return res.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name || null,
        phone: admin.phone || null,
        email: admin.email,
        isVerified: admin.is_verified === true
      }
    });
  } catch (error) {
    console.error('admin account lookup', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to verify the admin account'
    });
  }
});
module.exports = router;
