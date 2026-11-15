const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto');
const {sign,requireAuth} = require('../session');

// Africa's Talking SMS
const AfricasTalking = require('africastalking');
const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});
const sms = at.SMS;

function generateOTP() {
  return String(crypto.randomInt(1000, 10000));
}

async function sendSMS(phone, message) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[SMS] Development delivery suppressed; configure an SMS simulator for OTP testing');
      return { success: true };
    }
    await sms.send({ to: [phone], message, from: process.env.AT_SENDER_ID });
    return { success: true };
  } catch (err) {
    console.error('SMS error:', err.message);
    return { success: false, error: err.message };
  }
}

// POST /api/auth/request-otp
router.post('/request-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (typeof phone !== 'string' || !/^\+?[0-9]{9,15}$/.test(phone)) return res.status(400).json({ error: 'Phone required' });
    const otp = (process.env.NODE_ENV === 'development' && /^\d{4}$/.test(process.env.TEST_OTP || '')) ? process.env.TEST_OTP : generateOTP();
    const expires = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);
    await pool.query(
      `INSERT INTO otp_codes (phone, code, purpose, expires_at)
       VALUES ($1, $2, 'register', $3)`,
      [phone, otp, expires]
    );
    const delivery = await sendSMS(phone, `TrustDoc OTP: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes. Do not share.`);
    if (!delivery.success) return res.status(502).json({error:'OTP delivery failed'});
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (typeof phone !== 'string' || !/^\+?[0-9]{9,15}$/.test(phone) || !/^[0-9]{4}$/.test(String(otp))) return res.status(400).json({ error: 'Phone and OTP required' });
    const result = await pool.query(
      `UPDATE otp_codes SET used=true WHERE id=(SELECT id FROM otp_codes WHERE phone=$1 AND code=$2 AND purpose='register' AND used=false AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1 FOR UPDATE SKIP LOCKED) RETURNING id`,
      [phone, otp]
    );
    if (!result.rows.length) return res.status(400).json({ error: 'Invalid or expired OTP' });
    let user = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (!user.rows.length) {
      user = await pool.query(
        'INSERT INTO users (phone, name, is_verified) VALUES ($1, $2, true) ON CONFLICT(phone) DO UPDATE SET is_verified=true RETURNING *',
        [phone, 'TrustDoc User']
      );
    }
    await pool.query('UPDATE users SET is_verified=true WHERE id=$1',[user.rows[0].id]);
    await pool.query(`INSERT INTO account_roles(account_id,role) VALUES($1,'client') ON CONFLICT DO NOTHING`,[user.rows[0].id]);
    const {id,name,is_verified}=user.rows[0];
    res.json({ success:true, token:sign(user.rows[0]), user:{id,name,phone,is_verified} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/update-profile
router.post('/update-profile', requireAuth, async (req, res) => {
  try {
    const { name, idNumber } = req.body;
    if (typeof name !== 'string' || !name.trim() || name.length > 255) return res.status(400).json({error:'Valid name required'});
    const result = await pool.query(
      'UPDATE users SET name = $1, id_number = $2, updated_at = NOW() WHERE id = $3 RETURNING id,name,phone,is_verified',
      [name.trim(), idNumber || null, req.user.id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', requireAuth, (req,res)=>res.json({user:req.user,roles:req.roles}));
module.exports = router;
module.exports.generateOTP = generateOTP;
module.exports.sendSMS = sendSMS;