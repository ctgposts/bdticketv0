-- Create countries table
create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  flag text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster lookups
create index if not exists idx_countries_code on countries(code);

-- Enable Row Level Security
alter table countries enable row level security;

-- Policy: Everyone can read countries
create policy "Anyone can read countries"
  on countries for select
  using (true);

-- Policy: Only admins can modify countries
create policy "Admins can insert countries"
  on countries for insert
  with check (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

create policy "Admins can update countries"
  on countries for update
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

create policy "Admins can delete countries"
  on countries for delete
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

-- Insert sample countries
insert into countries (name, code, flag) values
  ('Saudi Arabia', 'KSA', '🇸🇦'),
  ('United Arab Emirates', 'UAE', '🇦🇪'),
  ('Qatar', 'QAT', '🇶🇦'),
  ('Kuwait', 'KWT', '🇰🇼'),
  ('Oman', 'OMN', '🇴🇲'),
  ('Bahrain', 'BHR', '🇧🇭'),
  ('Malaysia', 'MYS', '🇲🇾'),
  ('Singapore', 'SGP', '🇸🇬'),
  ('Thailand', 'THA', '🇹🇭'),
  ('India', 'IND', '🇮🇳')
on conflict (code) do nothing;
