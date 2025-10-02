-- Create airlines table
create table if not exists airlines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  logo_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster lookups
create index if not exists idx_airlines_code on airlines(code);

-- Enable Row Level Security
alter table airlines enable row level security;

-- Policy: Everyone can read airlines
create policy "Anyone can read airlines"
  on airlines for select
  using (true);

-- Policy: Only admins can modify airlines
create policy "Admins can manage airlines"
  on airlines for all
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

-- Insert sample airlines
insert into airlines (name, code) values
  ('Saudi Airlines', 'SV'),
  ('Emirates', 'EK'),
  ('Qatar Airways', 'QR'),
  ('Kuwait Airways', 'KU'),
  ('Oman Air', 'WY'),
  ('Gulf Air', 'GF'),
  ('Malaysia Airlines', 'MH'),
  ('Singapore Airlines', 'SQ'),
  ('Thai Airways', 'TG'),
  ('Air India', 'AI')
on conflict (code) do nothing;
