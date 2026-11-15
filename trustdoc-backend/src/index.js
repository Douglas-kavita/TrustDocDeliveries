require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const casesRoutes = require('./routes/cases');
const complaintsRoutes = require('./routes/complaints');
const { agentRouter: agentsRoutes, chatRouter: chatRoutes } = require('./routes/agents');
const adminAgentsRoutes = require('./routes/admin-agents');
const ridersRoutes = require('./routes/riders');

const app = express();
const allowedOrigins=(process.env.CORS_ORIGINS || '').split(',').map(x=>x.trim()).filter(Boolean);
app.use(cors({origin:(origin,callback)=>{if(!origin || allowedOrigins.includes(origin)) return callback(null,true); return callback(new Error('Origin not allowed'));}}));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'TrustDoc API', version: '1.0.0' }));
app.get('/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error('Database health check failed:', err.message);
    res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/staff-auth', require('./routes/staff-auth'));
app.use('/api/cases', casesRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/riders', ridersRoutes);
app.use('/api/admin/agents', adminAgentsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/staff', require('./routes/staff'));
app.use('/api/staff-application', require('./routes/staff-application'));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TrustDoc API running on port ${PORT}`));