require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/db');
(async () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing.');
  if (process.env.CONFIRM_STAGE2_MIGRATION !== 'YES_BACKUP_TAKEN') throw new Error('Back up your database first, then set CONFIRM_STAGE2_MIGRATION=YES_BACKUP_TAKEN for this command only.');
  const sql = fs.readFileSync(path.join(__dirname,'../src/migration_stage2.sql'),'utf8');
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Stage 2 migration committed successfully. Run npm run db:preflight to verify.');
  } finally {client.release();}
})().catch(e=>{console.error('Migration failed:',e.message);process.exitCode=1}).finally(()=>pool.end());
