import {NextResponse} from 'next/server';
const base=process.env.TRUSTDOC_API_URL;
function cookie(req){return req.cookies.get('trustdoc_staff_session')?.value}
async function roleOK(token){const me=await fetch(`${base}/api/auth/me`,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});if(!me.ok)return false;const p=await me.json();return p.roles?.includes(process.env.STAFF_ROLE)}
export async function POST(req){if(!base)return NextResponse.json({error:'Server API URL not configured'},{status:503});const b=await req.json().catch(()=>({}));const map={
 'password-start':['/api/staff-auth/password/start',false], 
'password-verify':['/api/staff-auth/password/verify',false],
'password-reset-start':['/api/staff-auth/password-reset/start',false],
'password-reset-verify':['/api/staff-auth/password-reset/verify',false],
'password-reset-complete':['/api/staff-auth/password-reset/complete',false],
 'passkey-options':['/api/staff-auth/passkey/options',false], 'passkey-verify':['/api/staff-auth/passkey/verify',false],
 'passkey-register-options':['/api/staff-auth/passkey/register/options',true], 'passkey-register-verify':['/api/staff-auth/passkey/register/verify',true]};
 const cfg=map[b.action];if(!cfg)return NextResponse.json({error:'Invalid action'},{status:400});const token=cookie(req);if(cfg[1]&&!token)return NextResponse.json({error:'Sign in first'},{status:401});
 try{const headers={'Content-Type':'application/json'};if(cfg[1])headers.Authorization=`Bearer ${token}`;const up=await fetch(`${base}${cfg[0]}`,{method:'POST',headers,body:JSON.stringify(b),cache:'no-store'});const data=await up.json();if(!up.ok)return NextResponse.json({error:data.error||'Authentication failed'},{status:up.status});
 if(['password-verify','passkey-verify'].includes(b.action)){if(!data.token||!await roleOK(data.token))return NextResponse.json({error:'This account has not been granted access to this staff portal'},{status:403});const out=NextResponse.json({success:true,roles:data.roles});out.cookies.set('trustdoc_staff_session',data.token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:12*60*60});return out}return NextResponse.json(data);
 }catch(e){return NextResponse.json({error:'Shared backend unavailable'},{status:502})}}
