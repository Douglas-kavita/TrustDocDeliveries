BEGIN;

-- Rider is allocated later, not required when the client creates a request.
ALTER TABLE cases
  ALTER COLUMN rider_name DROP NOT NULL,
  ALTER COLUMN rider_id_number DROP NOT NULL;

-- Website/client identity and request details.
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS client_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS client_phone VARCHAR(30),
  ADD COLUMN IF NOT EXISTS office VARCHAR(255),
  ADD COLUMN IF NOT EXISTS tier VARCHAR(30),
  ADD COLUMN IF NOT EXISTS entered_manually BOOLEAN NOT NULL DEFAULT FALSE;

-- Storage-payment workflow.
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS storage_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS storage_payment_reference VARCHAR(255),
  ADD COLUMN IF NOT EXISTS ready_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS client_notified_at TIMESTAMPTZ;

-- Delivery-payment workflow.
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS delivery_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivery_payment_reference VARCHAR(255);

-- Rider allocation/acceptance workflow.
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS rider_allocated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rider_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rider_response_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rider_cancel_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS in_transit_at TIMESTAMPTZ;

-- Secure handover.
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS handover_code_hash VARCHAR(255),
  ADD COLUMN IF NOT EXISTS handover_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS client_confirmed_at TIMESTAMPTZ;

-- Dispute/lifecycle information.
ALTER TABLE cases
  ADD COLUMN IF NOT EXISTS disputed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dispute_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_cases_user_id
  ON cases(user_id);

CREATE INDEX IF NOT EXISTS idx_cases_agent_id
  ON cases(agent_id);

CREATE INDEX IF NOT EXISTS idx_cases_status
  ON cases(status);

CREATE INDEX IF NOT EXISTS idx_case_assignments_active_rider
  ON case_assignments(rider_id)
  WHERE unassigned_at IS NULL;

COMMIT;
