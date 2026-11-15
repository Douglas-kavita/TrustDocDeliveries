-- TrustDoc Database Schema
-- Run this in PostgreSQL to set up the database

-- Users (citizens)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  id_number VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents (riders)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- OTP codes
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50) NOT NULL, -- 'register' | 'delivery'
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Service cases
CREATE TABLE IF NOT EXISTS cases (
  id VARCHAR(20) PRIMARY KEY, -- TRD-2025-00412
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES agents(id),
  document_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted',
  collection_point VARCHAR(255) NOT NULL,
  delivery_address VARCHAR(500) NOT NULL,
  rider_name VARCHAR(255) NOT NULL,
  rider_id_number VARCHAR(50) NOT NULL,
  envelope_serial VARCHAR(50),
  delivery_otp VARCHAR(6),
  delivery_otp_expires_at TIMESTAMP,
  estimated_delivery TIMESTAMP,
  delivered_at TIMESTAMP,
  fee_amount INTEGER DEFAULT 350,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Case tracking events (audit log)
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) REFERENCES cases(id),
  status VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages (citizen <-> rider chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) REFERENCES cases(id),
  sender_type VARCHAR(20) NOT NULL, -- 'citizen' | 'agent'
  sender_id UUID NOT NULL,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Authorization slips
CREATE TABLE IF NOT EXISTS auth_slips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(20) REFERENCES cases(id),
  slip_code VARCHAR(50) UNIQUE NOT NULL,
  rider_name VARCHAR(255) NOT NULL,
  rider_id_number VARCHAR(50) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  collection_point VARCHAR(255) NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_agent_id ON cases(agent_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_tracking_case_id ON tracking_events(case_id);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);
