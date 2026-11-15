BEGIN;

-- ============================================================
-- TrustDoc: Separate Riders from Agents
-- Compatibility-first migration
-- ============================================================

CREATE TABLE IF NOT EXISTS riders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(320),
    id_number VARCHAR(50) NOT NULL,

    number_plate VARCHAR(50),
    mpesa_phone VARCHAR(50),
    location VARCHAR(255),

    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending','approved','rejected')),

    account_status VARCHAR(30) NOT NULL DEFAULT 'inactive'
        CHECK (account_status IN ('active','inactive','suspended')),

    is_available BOOLEAN NOT NULL DEFAULT FALSE,

    current_lat NUMERIC,
    current_lng NUMERIC,

    rating NUMERIC(3,2),
    last_active_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_riders_email_lower
ON riders (LOWER(email))
WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_riders_verification_status
ON riders (verification_status);

CREATE INDEX IF NOT EXISTS idx_riders_account_status
ON riders (account_status);

-- Agent-specific fields required by the existing detailed Admin UI.
ALTER TABLE agents
    ADD COLUMN IF NOT EXISTS mpesa_phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS service_area VARCHAR(255),
    ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS account_status VARCHAR(30) DEFAULT 'inactive',
    ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- Do NOT change case_assignments.rider_id yet.
-- Existing records currently reference agents(id).
-- We will migrate assignments only after Riders are populated and mapped.

COMMIT;
