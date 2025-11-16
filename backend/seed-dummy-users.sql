-- Dummy Users for InvestIQ
-- Run this script to populate the database with test users

-- Create user_credentials table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_credentials (
  user_id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy users
INSERT OR IGNORE INTO users (id, email, name, skill_level, onboarding_complete, created_at, last_active)
VALUES
  ('user_alice_001', 'alice@example.com', 'Alice Johnson', 'beginner', true, datetime('now'), datetime('now')),
  ('user_bob_002', 'bob@example.com', 'Bob Smith', 'intermediate', true, datetime('now'), datetime('now')),
  ('user_carol_003', 'carol@example.com', 'Carol Williams', 'advanced', true, datetime('now'), datetime('now')),
  ('user_david_004', 'david@example.com', 'David Brown', 'beginner', false, datetime('now'), datetime('now')),
  ('user_eve_005', 'eve@example.com', 'Eve Davis', 'intermediate', true, datetime('now'), datetime('now')),
  ('user_frank_006', 'frank@example.com', 'Frank Miller', 'beginner', true, datetime('now'), datetime('now')),
  ('user_grace_007', 'grace@example.com', 'Grace Wilson', 'advanced', true, datetime('now'), datetime('now')),
  ('user_henry_008', 'henry@example.com', 'Henry Moore', 'intermediate', false, datetime('now'), datetime('now')),
  ('user_ivy_009', 'ivy@example.com', 'Ivy Taylor', 'beginner', true, datetime('now'), datetime('now')),
  ('user_jack_010', 'jack@example.com', 'Jack Anderson', 'advanced', true, datetime('now'), datetime('now'));

-- Insert credentials for dummy users (password: "password123" for all)
INSERT OR IGNORE INTO user_credentials (user_id, password)
VALUES
  ('user_alice_001', 'password123'),
  ('user_bob_002', 'password123'),
  ('user_carol_003', 'password123'),
  ('user_david_004', 'password123'),
  ('user_eve_005', 'password123'),
  ('user_frank_006', 'password123'),
  ('user_grace_007', 'password123'),
  ('user_henry_008', 'password123'),
  ('user_ivy_009', 'password123'),
  ('user_jack_010', 'password123');

-- Verify users were created
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as credentials_count FROM user_credentials;
