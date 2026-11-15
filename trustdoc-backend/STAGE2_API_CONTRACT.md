# TrustDoc Stage 2 — integration contract and gaps

Existing base URL: configure `TRUSTDOC_API_URL` per environment; do not hardcode localhost in Android release builds.

| Route | Existing behavior | Integration status |
|---|---|---|
| GET /health | Process health, not DB health | Existing |
| GET /health/db | Database connectivity, 503 if unavailable | Added in Stage 2 |
| POST /api/auth/request-otp | `{phone}` | Existing; needs SMS delivery/error and rate-limit hardening |
| POST /api/auth/verify-otp | `{phone,otp}` -> user | Existing; must add signed session and role enforcement before production |
| POST /api/auth/update-profile | `{userId,name,idNumber}` | Existing; not safe for production until session authorization |
| GET /api/cases?userId= | Client case list | Existing; needs authenticated ownership filtering |
| GET /api/cases/:id | Case + trackingEvents | Existing; needs access checks |
| POST /api/cases | `{userId,phone,documentType,collectionPoint,deliveryAddress,riderName,riderId}` | Existing; needs authenticated user and atomic ID creation |
| PATCH /api/cases/:id/status | `{status,description}` | Existing; must restrict to authorized role and valid transitions |
| POST /api/cases/:id/cancel | Cancel case | Existing; must enforce ownership |
| GET /api/agents | Available riders (legacy table `agents`) | Existing; rider and office-agent roles must remain distinct |
| GET/PATCH /api/agents/:id/location | Rider location | Existing; currently mock fallback on GET; PATCH requires authorization |
| GET/POST /api/chat/:caseId | Case messages | Existing; sender identity currently supplied by caller, not trusted |
| GET/POST /api/complaints; GET /:id; PATCH /:id/resolve | Complaints | Existing routes; table supplied by additive migration |

## Schema notes
- Legacy `agents` table means delivery riders. New `account_roles` differentiates office agent vs rider. Do not automatically reinterpret existing `agents` rows as office agents.
- `case_assignments` is the new normalized rider assignment history. Existing `cases.agent_id` remains for backwards compatibility until the API is migrated.
- `financial_transactions` and `financial_allocations` are *schema-only* foundations. They do not initiate M-Pesa, Buy Goods, B2C or callbacks. Do not display pending amounts as settled income.
- Migration is additive, but test against a database copy and back up first. Existing `users`, `agents`, `cases`, `messages`, `tracking_events`, `otp_codes`, `auth_slips` are not dropped.

## Required before production
- Signed sessions, account role and case-level authorization on every protected endpoint.
- Hash OTPs, secure randomness, attempt limits, delivery failure handling; do not log OTP values.
- Atomic case creation and status/event writes; fix delivery OTP phone lookup by joining users rather than reading nonexistent `cases.phone`.
- Real rider coordinates only; remove random simulated location and ETA from live responses.
- Migrate client/admin/rider interfaces from mock data to real API responses with explicit demo mode.
- Run migration via your managed PostgreSQL console; no live database credentials were used here.
