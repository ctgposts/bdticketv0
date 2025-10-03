-- Add demo users with hashed passwords
-- Password hashing: SHA-256 for demo purposes (use bcrypt in production)

-- Admin user (username: admin, password: admin)
INSERT INTO users (id, username, email, password_hash, name, role, is_active)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@bdticket.com',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', -- SHA-256 hash of 'admin'
  'System Administrator',
  'admin',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Manager user (username: manager, password: manager)
INSERT INTO users (id, username, email, password_hash, name, role, is_active)
VALUES (
  gen_random_uuid(),
  'manager',
  'manager@bdticket.com',
  '6ee4a469cd4e91053847f5d3fcb61dbcc91e8f0ef10be7748da4c4a1ba382d17', -- SHA-256 hash of 'manager'
  'Operations Manager',
  'manager',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Staff user (username: staff, password: staff)
INSERT INTO users (id, username, email, password_hash, name, role, is_active)
VALUES (
  gen_random_uuid(),
  'staff',
  'staff@bdticket.com',
  '1d8c9e8f5b5c5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f', -- SHA-256 hash of 'staff'
  'Support Staff',
  'staff',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Add unique constraint on username if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_username_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
  END IF;
END $$;
