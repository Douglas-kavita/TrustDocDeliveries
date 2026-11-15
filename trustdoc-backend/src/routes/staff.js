const express = require('express');
const pool = require('../db');
const { requireAuth, hasRole } = require('../session');

const router = express.Router();
router.use(requireAuth);

router.get('/overview', hasRole('admin'), async (req, res) => {
  try {
    const [cases, agents, users, complaints] = await Promise.all([
      pool.query(
        'SELECT id,document_type,status,collection_point,delivery_address,created_at FROM cases ORDER BY created_at DESC LIMIT 100'
      ),
      pool.query(
        'SELECT id,name,is_active,is_available,created_at FROM agents ORDER BY created_at DESC LIMIT 100'
      ),
      pool.query('SELECT COUNT(*)::int AS total FROM users'),
      pool.query(
        'SELECT id,case_id,subject,status,created_at FROM complaints ORDER BY created_at DESC LIMIT 100'
      )
    ]);

    res.json({
      cases: cases.rows,
      agents: agents.rows,
      usersCount: users.rows[0].total,
      complaints: complaints.rows
    });
  } catch (e) {
    console.error('staff overview', e);
    res.status(500).json({ error: 'Unable to load overview' });
  }
});

router.get('/my-cases', hasRole('agent', 'rider'), async (req, res) => {
  try {
    let result;

    if (req.roles.includes('rider')) {
      result = await pool.query(
        `SELECT DISTINCT
           c.*
         FROM cases c
         JOIN case_assignments ca
           ON ca.case_id = c.id
          AND ca.unassigned_at IS NULL
         JOIN riders r
           ON r.id = ca.rider_id
         WHERE r.phone = $1
         ORDER BY c.created_at DESC
         LIMIT 100`,
        [req.user.phone]
      );
    } else {
      result = await pool.query(
        `SELECT c.*
         FROM cases c
         JOIN agents a
           ON a.id = c.agent_id
         WHERE a.phone = $1
         ORDER BY c.created_at DESC
         LIMIT 100`,
        [req.user.phone]
      );
    }

    res.json({ cases: result.rows });
  } catch (e) {
    console.error('staff cases', e);
    res.status(500).json({ error: 'Unable to load assigned cases' });
  }
});

module.exports = router;
