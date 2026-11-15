require('dotenv').config();
const fs=require('fs');const path=require('path');const pool=require('../src/db');
(async()=>{if(process.env.CONFIRM_STAGE35_MIGRATION!=='YES_BACKUP_TAKEN'){console.error('Refusing migration. Back up trustdoc, then set CONFIRM_STAGE35_MIGRATION=YES_BACKUP_TAKEN for this terminal only.');process.exit(2)}
const sql=fs.readFileSync(path.join(__dirname,'../src/migration_stage35_staff_auth.sql'),'utf8');try{await pool.query(sql);console.log('Stage 3.5 staff authentication migration applied.');}catch(e){console.error(e);process.exitCode=1}finally{await pool.end()}})();
