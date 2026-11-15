BEGIN;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(320);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email)) WHERE email IS NOT NULL;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS email VARCHAR(320);
CREATE UNIQUE INDEX IF NOT EXISTS idx_agents_email_lower ON agents (LOWER(email)) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS staff_passkeys (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 account_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 credential_id TEXT UNIQUE NOT NULL,
 public_key BYTEA NOT NULL,
 counter BIGINT NOT NULL DEFAULT 0,
 transports TEXT[] DEFAULT '{}',
 device_type VARCHAR(50),
 backed_up BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT NOW(),
 last_used_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_staff_passkeys_account ON staff_passkeys(account_id);

CREATE TABLE IF NOT EXISTS webauthn_challenges (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 account_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 challenge TEXT NOT NULL,
 purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('register','authenticate')),
 expires_at TIMESTAMP NOT NULL,
 used BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_webauthn_challenge_account ON webauthn_challenges(account_id,purpose,used);

CREATE TABLE IF NOT EXISTS staff_login_otps (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 account_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 code_hash TEXT NOT NULL,
 expires_at TIMESTAMP NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0,
 used BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_staff_login_otp_account ON staff_login_otps(account_id,used,created_at DESC);

CREATE TABLE IF NOT EXISTS staff_auth_audit (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 account_id UUID REFERENCES users(id) ON DELETE SET NULL,
 event VARCHAR(80) NOT NULL,
 ip_address VARCHAR(100),
 user_agent TEXT,
 created_at TIMESTAMP DEFAULT NOW()
);
COMMIT;
