const fs = require('fs');

const file = 'app/api/session/route.js';
let s = fs.readFileSync(file, 'utf8');

if (s.includes("'password-reset-start'")) {
  console.log('Admin password-reset API actions already installed.');
  process.exit(0);
}

const oldText = "'password-verify':['/api/staff-auth/password/verify',false],";

const newText = `
'password-verify':['/api/staff-auth/password/verify',false],
'password-reset-start':['/api/staff-auth/password-reset/start',false],
'password-reset-verify':['/api/staff-auth/password-reset/verify',false],
'password-reset-complete':['/api/staff-auth/password-reset/complete',false],`;

if (!s.includes(oldText)) {
  throw new Error('Expected session action map was not found. File was NOT changed.');
}

s = s.replace(oldText, newText);

fs.writeFileSync(file, s, 'utf8');
console.log('Admin password-reset API actions installed.');
