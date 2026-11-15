const express = require('express');
const router = express.Router();
const pool = require('../db');
const {requireAuth,hasRole,canAccessCase}=require('../session');
router.use(requireAuth);

// GET /api/complaints — get all complaints (admin/agent)
router.get('/', hasRole('admin','agent'), async (req, res) => {
  try {
    const { status, submitterType } = req.query;
    let query = 'SELECT * FROM complaints WHERE 1=1';
    const params = [];
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    if (submitterType) { params.push(submitterType); query += ` AND submitter_type = $${params.length}`; }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ complaints: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/complaints — submit complaint (client or rider)
router.post('/', async (req, res) => {
  try {
    const { caseId, subject, message } = req.body;
    const submittedBy=req.user.id; const submitterType=req.roles.includes('rider')?'rider':req.roles.includes('agent')?'agent':'client';
    if (caseId && !(await canAccessCase(req,caseId))) return res.status(403).json({error:'Access denied'});
    if (!submittedBy || !submitterType || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await pool.query(
      `INSERT INTO complaints (case_id, submitted_by, submitter_type, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [caseId || null, submittedBy, submitterType, subject, message]
    );
    res.status(201).json({ success: true, complaint: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/complaints/:id/resolve — resolve complaint (admin/agent)
router.patch('/:id/resolve', hasRole('admin','agent'), async (req, res) => {
  try {
    const resolvedBy=req.user.id;
    const result = await pool.query(
      `UPDATE complaints SET status = 'resolved', resolved_by = $1, resolved_at = NOW(), updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [resolvedBy, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Complaint not found' });
    res.json({ success: true, complaint: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/complaints/:id — get single complaint
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM complaints WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Complaint not found' });
    if (result.rows[0].submitted_by!==req.user.id && !req.roles.some(r=>['admin','agent'].includes(r))) return res.status(403).json({error:'Access denied'});
    res.json({ complaint: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;