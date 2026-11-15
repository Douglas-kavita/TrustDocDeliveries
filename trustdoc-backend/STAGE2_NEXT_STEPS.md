# Stage 2 database preflight and migration

1. Keep your real `.env` locally only. Configure `DATABASE_URL` to the intended PostgreSQL database. Never send it in chat or commit it.
2. Take a verified database backup before any migration.
3. Run `npm install` then `npm run db:preflight` and review the database name and missing tables. If base tables are missing, stop and investigate rather than applying Stage 2 blindly.
4. Only after backup and preflight: in PowerShell set `$env:CONFIRM_STAGE2_MIGRATION='YES_BACKUP_TAKEN'`, run `npm run db:migrate:stage2`, then `Remove-Item Env:CONFIRM_STAGE2_MIGRATION`.
5. Run `npm run db:preflight` again. The migration is additive and wrapped in a transaction, but no production migration has been run by the assistant.

## Important API gaps to fix before connecting production apps
Existing OTP verification returns a user but no session token. `/api/cases` trusts a supplied `userId`, and case status updates lack role checks. OTPs are stored in plaintext and SMS delivery errors do not stop success responses. These endpoints must be secured before production deployment. The Stage 2 schema does not itself provide authentication or financial payouts.

## Next implementation
Secure sessions, account/role authorization, scoped cases, rider assignment endpoints, and real client/rider API adapters. B2C remains a separate final phase.
