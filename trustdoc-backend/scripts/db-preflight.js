require('dotenv').config();
const pool = require('../src/db');
const required = ['users','agents','otp_codes','cases','tracking_events','messages','auth_slips'];
(async () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing; set it locally, never commit it.');
  const db = await pool.query('select current_database() as name, current_user as role, version() as version');
  const tables = await pool.query("select table_name from information_schema.tables where table_schema = current_schema()");
  const present = new Set(tables.rows.map(x=>x.table_name));
  console.log('Connected database:', db.rows[0].name, '| role:', db.rows[0].role);
  for (const name of required) console.log(`${present.has(name) ? 'OK' : 'MISSING'}: ${name}`);
  const stage2 = ['account_roles','complaints','case_assignments','case_audit_events','financial_transactions','financial_allocations'];
  for (const name of stage2) console.log(`${present.has(name) ? 'PRESENT' : 'NOT YET APPLIED'}: ${name}`);
  if (required.some(name=>!present.has(name))) process.exitCode = 2;
})().catch(e=>{console.error('Preflight failed:',e.message);process.exitCode=1}).finally(()=>pool.end());
