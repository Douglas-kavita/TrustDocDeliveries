# TrustDoc Stage 3 — shared API security foundation (partial integration)

This is a backend-only development package based on Stage 2. It does not change the database schema, apply migrations, connect the existing Admin/Agent/Client/Rider UIs, or enable payments. No live PostgreSQL or SMS tests were run here. Keep your existing .env locally; it is excluded from this ZIP.

## Changes
- OTP verification returns a signed 12-hour bearer token and limited user profile; consumes the OTP atomically. Client role is inserted if absent.
- Authenticated /api/auth/me and profile update based on token identity.
- Case, chat and complaint access now requires bearer authentication and role/ownership checks. Supplied userId/senderId/submittedBy cannot impersonate other users.
- Rider location endpoint no longer fabricates coordinates, ETA or distance; absent data returns null. Location updates require an authenticated matching agent phone or admin role.
- Public agent listing excludes phone and ID number.

## Local steps
1. Extract to a NEW directory, not over your current working Stage 2 folder. Copy your existing .env into the inner trustdoc-backend folder. Never share or commit .env.
2. Set JWT_SECRET to a unique random secret of at least 32 characters (PowerShell: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`). Preserve DATABASE_URL. Ensure Africa's Talking configuration is set for actual SMS delivery before testing real OTP.
3. `npm install`; `npm run check`; `npm run db:preflight`; `npm start`.
4. Test /health, /health/db; request and verify OTP using a TEST phone, then use `Authorization: Bearer <token>` for /api/auth/me and protected routes. Existing clients must be updated to send tokens before this package can replace your live backend.
5. Do not grant admin/agent/rider roles through public signup. Assign verified roles via a separately reviewed admin procedure. Agent identity currently maps to the agent record by verified phone.

## Known gaps / DO NOT DEPLOY YET
- Rate limiting, OTP attempt lockout, hashed OTP storage, phone normalization, session revocation, audit and privacy review remain to be completed.
- Case ID generation is count-based and can collide under concurrency. Case creation/status transitions need transactional and state-machine hardening.
- Case status SMS uses `cases.phone` though the Stage 2 schema has no such column; must join users.phone and handle delivery OTP correctly.
- Agent/role mapping and access policies need end-to-end validation with the actual interfaces. Financial tables remain schema-only.
- Existing app archives require separate adaptation and device testing; this ZIP is not a finished five-app integration.

## Follow-up hardening patch
- Fixed a startup-blocking router initialization order bug.
- Removed plaintext OTP from development logs; development SMS is NOT delivered and cannot complete real OTP without a configured delivery channel.
- Enforced basic phone/OTP input shape and marked verified phone accounts verified.
- Replaced count-based case IDs with random reference suffixes; fixed missing client phone join for status/cancel SMS.
- Replaced unrestricted browser CORS with comma-separated CORS_ORIGINS.
- This remains a backend-only foundation, not five fully integrated applications. No live database, device or real SMS testing performed.
