-- Stage 2 additive migration. Back up your database first; run once on the existing database.
BEGIN;
CREATE TABLE IF NOT EXISTS account_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client','rider','agent','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(account_id, role)
);
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) REFERENCES cases(id),
  submitted_by UUID NOT NULL,
  submitter_type VARCHAR(20) NOT NULL CHECK (submitter_type IN ('client','rider','agent')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_review','resolved')),
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status, created_at DESC);
CREATE TABLE IF NOT EXISTS case_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) NOT NULL REFERENCES cases(id),
  rider_id UUID NOT NULL REFERENCES agents(id),
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unassigned_at TIMESTAMPTZ,
  note TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_case_one_active_assignment ON case_assignments(case_id) WHERE unassigned_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_assignment_rider ON case_assignments(rider_id, assigned_at DESC);
CREATE TABLE IF NOT EXISTS case_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) NOT NULL REFERENCES cases(id),
  actor_id UUID REFERENCES users(id),
  actor_role TEXT,
  event_type TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_case_audit_case ON case_audit_events(case_id, created_at);
-- This ledger is an accounting foundation only; no real collections or B2C disbursements are implemented.
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) REFERENCES cases(id),
  external_reference TEXT UNIQUE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('collection','refund','adjustment')),
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  currency CHAR(3) NOT NULL DEFAULT 'KES',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','failed','reversed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS financial_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES financial_transactions(id),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('agent','rider','platform','huduma')),
  recipient_id UUID,
  amount_minor BIGINT NOT NULL CHECK (amount_minor >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(transaction_id, recipient_type, recipient_id)
);
CREATE INDEX IF NOT EXISTS idx_financial_allocations_recipient ON financial_allocations(recipient_type, recipient_id);
COMMIT;
