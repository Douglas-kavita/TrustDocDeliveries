const express=require('express');
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const pool=require('../db');
const {sign,requireAuth}=require('../session');
const router=express.Router();

const emailOk=e=>typeof e==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)&&e.length<=320;

const rpID=()=>process.env.WEBAUTHN_RP_ID||'localhost';

const origins=()=>String(
  process.env.WEBAUTHN_ORIGINS||'http://localhost:3000,http://localhost:3200'
).split(',').map(x=>x.trim()).filter(Boolean);

async function lib(){
  return import('@simplewebauthn/server');
}

async function sendEmailCode(to,code,subject){
  if(!process.env.GMAIL_USER||!process.env.GMAIL_APP_PASSWORD){
    return {
      success:false,
      error:'Email verification is not configured.'
    };
  }

  const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.GMAIL_USER,
      pass:process.env.GMAIL_APP_PASSWORD
    },
    connectionTimeout:15000,
    greetingTimeout:10000,
    socketTimeout:20000
  });

  try{
    await transporter.sendMail({
      from:`"TrustDocDeliveries" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text:`Your TrustDoc security code is: ${code}\n\nThis code expires in 10 minutes. Do not share it.`,
      html:`
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#7a1728">TrustDoc Verification Code</h2>
          <p>Your security code is:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#f9fafb;padding:16px;border-radius:8px;text-align:center">
            ${code}
          </div>
          <p style="color:#6b7280;font-size:13px">
            This code expires in 10 minutes. Do not share it.
          </p>
        </div>
      `
    });

    return {success:true};
  }catch(error){
    console.error('Gmail delivery error:',error);
    return {
      success:false,
      error:'Email delivery failed.'
    };
  }finally{
    transporter.close();
  }
}

async function account(email){
  const r=await pool.query(
    `SELECT
       u.id,
       u.name,
       u.phone,
       u.email,
       u.password_hash,
       array_remove(array_agg(ar.role),NULL) roles
     FROM users u
     LEFT JOIN account_roles ar ON ar.account_id=u.id
     WHERE LOWER(u.email)=LOWER($1)
     GROUP BY u.id`,
    [email]
  );

  return r.rows[0];
}

const staff=a=>a&&a.roles?.some(r=>['admin','agent','rider'].includes(r));

async function audit(req,id,event){
  await pool.query(
    'INSERT INTO staff_auth_audit(account_id,event,ip_address,user_agent) VALUES($1,$2,$3,$4)',
    [
      id,
      event,
      req.ip,
      String(req.headers['user-agent']||'').slice(0,1000)
    ]
  ).catch(()=>{});
}


/* =========================================================
   PASSWORD LOGIN - STEP 1
   Email + Password -> Gmail verification code
   ========================================================= */

router.post('/password/start',async(req,res)=>{
  try{
    const a=await account(req.body.email);

    if(
      !staff(a)||
      !a.password_hash||
      !await bcrypt.compare(
        String(req.body.password||''),
        a.password_hash
      )
    ){
      return res.status(401).json({
        error:'Invalid email or password'
      });
    }

    const code=(
      process.env.NODE_ENV==='development'&&
      /^\d{6}$/.test(process.env.TEST_OTP||'')
    )
      ?process.env.TEST_OTP
      :String(crypto.randomInt(100000,1000000));

    const hash=await bcrypt.hash(code,10);

    await pool.query(
      'UPDATE staff_login_otps SET used=true WHERE account_id=$1 AND used=false',
      [a.id]
    );

    await pool.query(
      `INSERT INTO staff_login_otps(account_id,code_hash,expires_at)
       VALUES($1,$2,NOW()+INTERVAL '10 minutes')`,
      [a.id,hash]
    );

    const d=await sendEmailCode(
      a.email,
      code,
      'Your TrustDoc verification code'
    );

    if(!d.success){
      return res.status(502).json({
        error:'Email delivery failed'
      });
    }

    await audit(
      req,
      a.id,
      'password_ok_email_sent'
    );

    return res.json({
      success:true,
      email:a.email,
      message:'Security code sent to your email'
    });

  }catch(e){
    console.error(e);

    return res.status(500).json({
      error:'Unable to start staff login'
    });
  }
});


/* =========================================================
   PASSWORD LOGIN - STEP 2
   Gmail verification code -> JWT
   ========================================================= */

router.post('/password/verify',async(req,res)=>{
  try{
    const a=await account(req.body.email);

    if(!staff(a)){
      return res.status(401).json({
        error:'Invalid verification'
      });
    }

    const q=await pool.query(
      `SELECT *
       FROM staff_login_otps
       WHERE account_id=$1
       AND used=false
       AND expires_at>NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [a.id]
    );

    if(
      !q.rows.length||
      q.rows[0].attempts>=5
    ){
      return res.status(400).json({
        error:'Invalid or expired security code'
      });
    }

    const ok=await bcrypt.compare(
      String(req.body.otp||''),
      q.rows[0].code_hash
    );

    if(!ok){
      await pool.query(
        'UPDATE staff_login_otps SET attempts=attempts+1 WHERE id=$1',
        [q.rows[0].id]
      );

      return res.status(400).json({
        error:'Invalid or expired security code'
      });
    }

    await pool.query(
      'UPDATE staff_login_otps SET used=true WHERE id=$1',
      [q.rows[0].id]
    );

    await audit(
      req,
      a.id,
      'email_verified'
    );

    return res.json({
      success:true,
      token:sign(a),
      user:{
        id:a.id,
        name:a.name,
        email:a.email
      },
      roles:a.roles
    });

  }catch(e){
    console.error(e);

    return res.status(500).json({
      error:'Unable to verify staff login'
    });
  }
});


/* =========================================================
   PASSWORD RESET - STEP 1
   Email -> Gmail reset code
   ========================================================= */

router.post('/password-reset/start',async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim();

    const generic={
      success:true,
      message:'If this staff account exists, a security code has been sent to its email.'
    };

    if(!emailOk(email)){
      return res.json(generic);
    }

    const a=await account(email);

    if(!staff(a)||!a.email){
      return res.json(generic);
    }

    const code=(
      process.env.NODE_ENV==='development'&&
      /^\d{6}$/.test(process.env.TEST_OTP||'')
    )
      ?process.env.TEST_OTP
      :String(crypto.randomInt(100000,1000000));

    const hash=await bcrypt.hash(code,10);

    await pool.query(
      'UPDATE staff_password_reset_otps SET used=true WHERE account_id=$1 AND used=false',
      [a.id]
    );

    await pool.query(
      `INSERT INTO staff_password_reset_otps(account_id,code_hash,expires_at)
       VALUES($1,$2,NOW()+INTERVAL '10 minutes')`,
      [a.id,hash]
    );

    const d=await sendEmailCode(
      a.email,
      code,
      'Your TrustDoc password reset code'
    );

    if(d.success){
      await audit(
        req,
        a.id,
        'password_reset_email_sent'
      );
    }

    return res.json(generic);

  }catch(e){
    console.error(e);

    return res.status(500).json({
      error:'Unable to start password reset'
    });
  }
});


/* =========================================================
   PASSWORD RESET - STEP 2
   Gmail reset code -> reset token
   ========================================================= */

router.post('/password-reset/verify',async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim();
    const otp=String(req.body.otp||'').trim();

    const a=await account(email);

    if(!staff(a)){
      return res.status(400).json({
        error:'Invalid or expired security code'
      });
    }

    const q=await pool.query(
      `SELECT *
       FROM staff_password_reset_otps
       WHERE account_id=$1
       AND used=false
       AND expires_at>NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [a.id]
    );

    if(
      !q.rows.length||
      q.rows[0].attempts>=5
    ){
      return res.status(400).json({
        error:'Invalid or expired security code'
      });
    }

    const ok=await bcrypt.compare(
      otp,
      q.rows[0].code_hash
    );

    if(!ok){
      await pool.query(
        'UPDATE staff_password_reset_otps SET attempts=attempts+1 WHERE id=$1',
        [q.rows[0].id]
      );

      return res.status(400).json({
        error:'Invalid or expired security code'
      });
    }

    const resetToken=crypto.randomBytes(32).toString('hex');

    const resetHash=crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await pool.query(
      `UPDATE staff_password_reset_otps
       SET reset_token_hash=$1,
           reset_token_expires_at=NOW()+INTERVAL '10 minutes'
       WHERE id=$2`,
      [resetHash,q.rows[0].id]
    );

    await audit(
      req,
      a.id,
      'password_reset_email_verified'
    );

    return res.json({
      success:true,
      resetToken
    });

  }catch(e){
    console.error(e);

    return res.status(500).json({
      error:'Unable to verify password reset'
    });
  }
});


/* =========================================================
   PASSWORD RESET - STEP 3
   New password
   ========================================================= */

router.post('/password-reset/complete',async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim();
    const resetToken=String(req.body.resetToken||'');
    const newPassword=String(req.body.newPassword||'');

    const a=await account(email);

    if(!staff(a)||!resetToken){
      return res.status(400).json({
        error:'Password reset session is invalid or expired'
      });
    }

    if(newPassword.length<12){
      return res.status(400).json({
        error:'New password must contain at least 12 characters'
      });
    }

    const tokenHash=crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const q=await pool.query(
      `SELECT *
       FROM staff_password_reset_otps
       WHERE account_id=$1
       AND used=false
       AND reset_token_hash=$2
       AND reset_token_expires_at>NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [a.id,tokenHash]
    );

    if(!q.rows.length){
      return res.status(400).json({
        error:'Password reset session is invalid or expired'
      });
    }

    const passwordHash=await bcrypt.hash(
      newPassword,
      12
    );

    await pool.query('BEGIN');

    try{
      await pool.query(
        'UPDATE users SET password_hash=$1 WHERE id=$2',
        [passwordHash,a.id]
      );

      await pool.query(
        'UPDATE staff_password_reset_otps SET used=true WHERE account_id=$1 AND used=false',
        [a.id]
      );

      await pool.query('COMMIT');

    }catch(e){
      await pool.query('ROLLBACK');
      throw e;
    }

    await audit(
      req,
      a.id,
      'password_reset_completed'
    );

    return res.json({
      success:true,
      message:'Password changed successfully. Sign in with your new password.'
    });

  }catch(e){
    console.error(e);

    return res.status(500).json({
      error:'Unable to complete password reset'
    });
  }
});


/* =========================================================
   PASSKEY LOGIN
   ========================================================= */

router.post('/passkey/options',async(req,res)=>{
  try{
    const a=await account(req.body.email);

    if(!staff(a)){
      return res.status(401).json({
        error:'Passkey sign-in unavailable'
      });
    }

    const keys=await pool.query(
      'SELECT credential_id,transports FROM staff_passkeys WHERE account_id=$1',
      [a.id]
    );

    if(!keys.rows.length){
      return res.status(404).json({
        error:'No passkey registered. Use password + email verification first.'
      });
    }

    const {generateAuthenticationOptions}=await lib();

    const options=await generateAuthenticationOptions({
      rpID:rpID(),
      userVerification:'required',
      allowCredentials:keys.rows.map(k=>({
        id:k.credential_id,
        transports:k.transports||[]
      }))
    });

    await pool.query(
      `INSERT INTO webauthn_challenges(account_id,challenge,purpose,expires_at)
       VALUES($1,$2,'authenticate',NOW()+INTERVAL '5 minutes')`,
      [a.id,options.challenge]
    );

    res.json(options);

  }catch(e){
    console.error(e);

    res.status(500).json({
      error:'Unable to start passkey sign-in'
    });
  }
});


router.post('/passkey/verify',async(req,res)=>{
  try{
    const a=await account(req.body.email);

    if(!staff(a)){
      return res.status(401).json({
        error:'Passkey verification failed'
      });
    }

    const c=await pool.query(
      `SELECT *
       FROM webauthn_challenges
       WHERE account_id=$1
       AND purpose='authenticate'
       AND used=false
       AND expires_at>NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [a.id]
    );

    if(!c.rows.length){
      return res.status(400).json({
        error:'Passkey challenge expired'
      });
    }

    const k=await pool.query(
      'SELECT * FROM staff_passkeys WHERE account_id=$1 AND credential_id=$2',
      [a.id,req.body.response?.id]
    );

    if(!k.rows.length){
      return res.status(401).json({
        error:'Unknown passkey'
      });
    }

    const {verifyAuthenticationResponse}=await lib();

    const v=await verifyAuthenticationResponse({
      response:req.body.response,
      expectedChallenge:c.rows[0].challenge,
      expectedOrigin:origins(),
      expectedRPID:rpID(),
      credential:{
        id:k.rows[0].credential_id,
        publicKey:new Uint8Array(k.rows[0].public_key),
        counter:Number(k.rows[0].counter),
        transports:k.rows[0].transports||[]
      },
      requireUserVerification:true
    });

    if(!v.verified){
      return res.status(401).json({
        error:'Passkey verification failed'
      });
    }

    await pool.query(
      'UPDATE webauthn_challenges SET used=true WHERE id=$1',
      [c.rows[0].id]
    );

    await pool.query(
      'UPDATE staff_passkeys SET counter=$1,last_used_at=NOW() WHERE id=$2',
      [v.authenticationInfo.newCounter,k.rows[0].id]
    );

    await audit(
      req,
      a.id,
      'passkey_login'
    );

    res.json({
      success:true,
      token:sign(a),
      roles:a.roles
    });

  }catch(e){
    console.error(e);

    res.status(400).json({
      error:'Passkey verification failed'
    });
  }
});


/* =========================================================
   PASSKEY REGISTRATION
   ========================================================= */

router.post('/passkey/register/options',requireAuth,async(req,res)=>{
  try{
    if(!req.roles.some(r=>['admin','agent','rider'].includes(r))){
      return res.status(403).json({
        error:'Staff only'
      });
    }

    const {generateRegistrationOptions}=await lib();

    const existing=await pool.query(
      'SELECT credential_id,transports FROM staff_passkeys WHERE account_id=$1',
      [req.user.id]
    );

    const options=await generateRegistrationOptions({
      rpName:'TrustDoc',
      rpID:rpID(),
      userName:req.user.email||req.user.phone,
      userDisplayName:req.user.name,
      attestationType:'none',
      authenticatorSelection:{
        residentKey:'preferred',
        userVerification:'required'
      },
      excludeCredentials:existing.rows.map(k=>({
        id:k.credential_id,
        transports:k.transports||[]
      }))
    });

    await pool.query(
      `INSERT INTO webauthn_challenges(account_id,challenge,purpose,expires_at)
       VALUES($1,$2,'register',NOW()+INTERVAL '5 minutes')`,
      [req.user.id,options.challenge]
    );

    res.json(options);

  }catch(e){
    console.error(e);

    res.status(500).json({
      error:'Unable to start passkey registration'
    });
  }
});


router.post('/passkey/register/verify',requireAuth,async(req,res)=>{
  try{
    if(!req.roles.some(r=>['admin','agent','rider'].includes(r))){
      return res.status(403).json({
        error:'Staff only'
      });
    }

    const c=await pool.query(
      `SELECT *
       FROM webauthn_challenges
       WHERE account_id=$1
       AND purpose='register'
       AND used=false
       AND expires_at>NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if(!c.rows.length){
      return res.status(400).json({
        error:'Registration challenge expired'
      });
    }

    const {verifyRegistrationResponse}=await lib();

    const v=await verifyRegistrationResponse({
      response:req.body.response,
      expectedChallenge:c.rows[0].challenge,
      expectedOrigin:origins(),
      expectedRPID:rpID(),
      requireUserVerification:true
    });

    if(!v.verified||!v.registrationInfo){
      return res.status(400).json({
        error:'Passkey registration failed'
      });
    }

    const x=v.registrationInfo.credential;

    await pool.query(
      `INSERT INTO staff_passkeys(
        account_id,
        credential_id,
        public_key,
        counter,
        transports,
        device_type,
        backed_up
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT(credential_id) DO NOTHING`,
      [
        req.user.id,
        x.id,
        Buffer.from(x.publicKey),
        x.counter,
        x.transports||[],
        v.registrationInfo.credentialDeviceType,
        v.registrationInfo.credentialBackedUp
      ]
    );

    await pool.query(
      'UPDATE webauthn_challenges SET used=true WHERE id=$1',
      [c.rows[0].id]
    );

    await audit(
      req,
      req.user.id,
      'passkey_registered'
    );

    res.json({
      success:true
    });

  }catch(e){
    console.error(e);

    res.status(400).json({
      error:'Passkey registration failed'
    });
  }
});


module.exports=router;