const jwt = require('jsonwebtoken');
const pool = require('./db');
function secret() { if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('change-this')) throw new Error('Set a strong JWT_SECRET (32+ characters) in .env'); return process.env.JWT_SECRET; }
function sign(user) { return jwt.sign({sub:user.id}, secret(), {expiresIn:'12h',issuer:'trustdoc-api',audience:'trustdoc-apps'}); }
async function requireAuth(req,res,next) {
  try {
    const match = /^Bearer (\S+)$/i.exec(req.headers.authorization || '');
    if (!match) return res.status(401).json({error:'Authentication required'});
    const payload = jwt.verify(match[1],secret(),{issuer:'trustdoc-api',audience:'trustdoc-apps'});
    const user = await pool.query('SELECT id,phone,name,email,is_verified FROM users WHERE id=$1',[payload.sub]);
    if (!user.rows.length) return res.status(401).json({error:'Account not found'});
    req.user = user.rows[0];
    const roles = await pool.query('SELECT role FROM account_roles WHERE account_id=$1',[req.user.id]);
    req.roles = roles.rows.map(r=>r.role);
    next();
  } catch(e) { if (e.message.startsWith('Set a strong')) return res.status(503).json({error:'Authentication not configured'}); return res.status(401).json({error:'Invalid or expired session'}); }
}
function hasRole(...roles) { return (req,res,next)=>req.roles.some(r=>roles.includes(r)) ? next() : res.status(403).json({error:'Insufficient permissions'}); }
async function canAccessCase(req,caseId) {
  const r=await pool.query(`SELECT 1 FROM cases c WHERE c.id=$1 AND (c.user_id=$2 OR $3::boolean OR EXISTS (SELECT 1 FROM case_assignments a JOIN agents ag ON ag.id=a.rider_id WHERE a.case_id=c.id AND a.unassigned_at IS NULL AND ag.phone=$4))`,[caseId,req.user.id,req.roles.includes('admin'),req.user.phone]);
  return r.rowCount>0;
}
module.exports={sign,requireAuth,hasRole,canAccessCase};
