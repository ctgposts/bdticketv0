-- Create users table with authentication
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  password_hash text not null,
  name text not null,
  role text not null check (role in ('admin', 'manager', 'staff')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster lookups
create index if not exists idx_users_username on users(username);
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_role on users(role);

-- Enable Row Level Security
alter table users enable row level security;

-- Policy: Users can read their own data
create policy "Users can read own data"
  on users for select
  using (auth.uid()::text = id::text);

-- Policy: Admins can read all users
create policy "Admins can read all users"
  on users for select
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

-- Policy: Admins can insert users
create policy "Admins can insert users"
  on users for insert
  with check (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

-- Policy: Admins can update users
create policy "Admins can update users"
  on users for update
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

-- Insert demo users (password is same as username for demo)
insert into users (username, email, password_hash, name, role) values
  ('admin', 'admin@bdticket.com', '$2a$10$rOvHPz8VQAbeoMwD6eDHNOqVhU7pVZ5qJ5y5qJ5y5qJ5y5qJ5y5qJ', 'Admin User', 'admin'),
  ('manager', 'manager@bdticket.com', '$2a$10$rOvHPz8VQAbeoMwD6eDHNOqVhU7pVZ5qJ5y5qJ5y5qJ5y5qJ5y5qJ', 'Manager User', 'manager'),
  ('staff', 'staff@bdticket.com', '$2a$10$rOvHPz8VQAbeoMwD6eDHNOqVhU7pVZ5qJ5y5qJ5y5qJ5y5qJ5y5qJ', 'Staff User', 'staff')
on conflict (username) do nothing;
