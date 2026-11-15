const fs = require('fs');

const file = 'src/routes/staff-auth.js';
let s = fs.readFileSync(file, 'utf8');

if (s.includes("router.post('/password-reset/start'")) {
  console.log('Password reset routes already installed.');
  process.exit(0);
}

const marker = "router.post('/passkey/options'";

if (!s.includes(marker)) {
  throw new Error('Insertion point not found. File was not changed.');
}

const resetRoutes = `
router.post('/password-reset/start',async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim();

    // Generic response prevents staff-account enumeration.
    const generic={success:true,message:'If this staff account exists, a security code has been sent to its registered phone.'};

    if(!emailOk(email))return res.json(generic);

    const a=await account(email);
    if(!staff(a)||!a.phone)return res.json(generic);

    const code=(process.env.NODE_ENV==='development'&&/^\\d{6}$/.test(process.env.TEST_OTP||''))
      ?process.env.TEST_OTP
      :String(crypto.randomInt(100000,1000000));

    const hash=await bcrypt.hash(code,10);

    await pool.query(
      'UPDATE staff_login_otps SET used=true WHERE account_id=$1 AND used=false',
      [a.id]
    );

    await pool.query(
      \`INSERT INTO staff_login_otps(account_id,code_hash,expires_at)
       VALUES($1,$2,NOW()+INTERVAL '10 minutes')\`,
      [a.id,hash]
    );

    const d=await sendSMS(
      a.phone,
      \`TrustDoc password reset code: \${code}. Valid for 10 minutes. Do not share.\`
    );

    if(d.success){
      await audit(req,a.id,'password_reset_sms_sent');
    }

    // Keep response generic even if delivery fails.
    return res.json(generic);
  }catch(e){
    console.error(e);
    return res.status(500).json({error:'Unable to start password reset'});
  }
});

router.post('/password-reset/verify',async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim();
    const otp=String(req.body.otp||'').trim();

    const a=await account(email);
    if(!staff(a)){
      return res.status(400).json({error:'Invalid or expired security code'});
    }

    const q=await pool.query(
      \`SELECT * FROM staff_login_otps
       WHERE account_id=$1
       AND used=false
       AND expires_at>NOW()
       ORDER BY created_at DESC
       LIMIT 1\`,
      [a.id]
    );

    if(!q.rows.length||q.rows[0].attempts>=5){
      return res.status(400).json({error:'Invalid or expired security code'});
    }

    const ok=await bcrypt.compare(otp,q.rows[0].code_hash);

    if(!ok){
      await pool.query(
        'UPDATE staff_login_otps SET attempts=attempts+1 WHERE id=$1',
        [q.rows[0].id]
      );
      return res.status(400).json({error:'Invalid or expired security code'});
    }

    const resetToken=crypto.randomBytes(32).toString('hex');
    const resetHash=crypto.createHash('sha256').update(resetToken).digest('hex');

    await pool.query(
      \`UPDATE staff_login_otps
       SET reset_token_hash=$1,
           reset_token_expires_at=NOW()+INTERVAL '10 minutes'
       WHERE id=$2\`,
      [resetHash,q.rows[0].id]
    );

    await audit(req,a.id,'password_reset_sms_verified');

    return res.json({
      success:true,
      resetToken
    });
  }catch(e){
    console.error(e);
    return res.status(500).json({error:'Unable to verify password reset'});
  }
});

router.post('/password-reset/complete',async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim();
    const resetToken=String(req.body.resetToken||'');
    const newPassword=String(req.body.newPassword||'');

    const a=await account(email);

    if(!staff(a)||!resetToken){
      return res.status(400).json({error:'Password reset session is invalid or expired'});
    }

    if(newPassword.length<12){
      return res.status(400).json({error:'New password must contain at least 12 characters'});
    }

    const tokenHash=crypto.createHash('sha256').update(resetToken).digest('hex');

    const q=await pool.query(
      \`SELECT * FROM staff_login_otps
       WHERE account_id=$1
       AND used=false
       AND reset_token_hash=$2
       AND reset_token_expires_at>NOW()
       ORDER BY created_at DESC
       LIMIT 1\`,
      [a.id,tokenHash]
    );

    if(!q.rows.length){
      return res.status(400).json({error:'Password reset session is invalid or expired'});
    }

    const passwordHash=await bcrypt.hash(newPassword,12);

    await pool.query('BEGIN');

    try{
      await pool.query(
        'UPDATE users SET password_hash=$1 WHERE id=$2',
        [passwordHash,a.id]
      );

      await pool.query(
        'UPDATE staff_login_otps SET used=true WHERE account_id=$1 AND used=false',
        [a.id]
      );

      await pool.query('COMMIT');
    }catch(e){
      await pool.query('ROLLBACK');
      throw e;
    }

    await audit(req,a.id,'password_reset_completed');

    return res.json({
      success:true,
      message:'Password changed successfully. Sign in with your new password.'
    });
  }catch(e){
    console.error(e);
    return res.status(500).json({error:'Unable to complete password reset'});
  }
});

`;

s = s.replace(marker, resetRoutes + marker);
fs.writeFileSync(file, s, 'utf8');

console.log('Forgot-password backend routes installed.');
