const express = require('express');

const pool = require('../db');
const {requireAuth,hasRole,canAccessCase}=require('../session');
const agentRouter = express.Router();
const chatRouter = express.Router();
agentRouter.use(requireAuth); chatRouter.use(requireAuth);

// GET /api/agents — list available agents
agentRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,name,is_available FROM agents WHERE is_active = true AND is_available = true ORDER BY name ASC'
    );
    res.json({ agents: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/agents/:id/location — get agent location
agentRouter.get('/:id/location', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agents WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Agent not found' });
    const agent = result.rows[0];
    if (agent.phone !== req.user.phone && !req.roles.includes('admin')) return res.status(403).json({error:'Access denied'});
    res.json({
      agentId: req.params.id,
      latitude: agent.current_lat ?? null,
      longitude: agent.current_lng ?? null,
      updatedAt: agent.updated_at,
      etaMinutes: null,
      distanceKm: null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/agents/:id/location — update agent location
agentRouter.patch('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const actor=await pool.query('SELECT phone FROM agents WHERE id=$1',[req.params.id]);
    if (!actor.rows.length) return res.status(404).json({error:'Agent not found'});
    if (actor.rows[0].phone!==req.user.phone && !req.roles.includes('admin')) return res.status(403).json({error:'Access denied'});
    if (!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180) return res.status(400).json({error:'Invalid coordinates'});
    await pool.query(
      'UPDATE agents SET current_lat = $1, current_lng = $2, updated_at = NOW() WHERE id = $3',
      [latitude, longitude, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chat/:caseId — get messages
chatRouter.get('/:caseId', async (req, res) => {
  try {
    if (!(await canAccessCase(req,req.params.caseId))) return res.status(403).json({error:'Access denied'});
    const result = await pool.query(
      'SELECT * FROM messages WHERE case_id = $1 ORDER BY created_at ASC',
      [req.params.caseId]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/:caseId — send message
chatRouter.post('/:caseId', async (req, res) => {
  try {
    const { text } = req.body;
    if (!(await canAccessCase(req,req.params.caseId))) return res.status(403).json({error:'Access denied'});
    const senderType=req.roles.includes('admin')?'agent':req.roles.includes('rider')?'agent':'citizen'; const senderId=req.user.id;
    if (typeof text !== 'string' || !text.trim() || text.length > 4000) return res.status(400).json({ error: 'Message text required' });
    const result = await pool.query(
      `INSERT INTO messages (case_id, sender_type, sender_id, text)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.caseId, senderType, senderId, text.trim()]
    );
    res.status(201).json({ success: true, message: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { agentRouter, chatRouter };