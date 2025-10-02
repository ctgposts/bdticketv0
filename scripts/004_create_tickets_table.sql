-- Create tickets table
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  airline_id uuid references airlines(id) on delete restrict,
  country_id uuid references countries(id) on delete restrict,
  flight_number text not null,
  batch_number text not null,
  origin text not null default 'Dhaka',
  destination text not null,
  departure_date date not null,
  departure_time time not null,
  arrival_time time,
  buying_price numeric(10, 2) not null,
  selling_price numeric(10, 2) not null,
  total_seats integer not null default 1,
  available_seats integer not null default 1,
  status text not null default 'available' check (status in ('available', 'locked', 'sold', 'booked')),
  locked_until timestamptz,
  locked_by uuid references users(id) on delete set null,
  notes text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_seats check (available_seats >= 0 and available_seats <= total_seats),
  constraint valid_prices check (selling_price >= buying_price)
);

-- Create indexes for faster queries
create index if not exists idx_tickets_airline on tickets(airline_id);
create index if not exists idx_tickets_country on tickets(country_id);
create index if not exists idx_tickets_status on tickets(status);
create index if not exists idx_tickets_departure_date on tickets(departure_date);
create index if not exists idx_tickets_batch on tickets(batch_number);

-- Enable Row Level Security
alter table tickets enable row level security;

-- Policy: Everyone can read available tickets
create policy "Anyone can read tickets"
  on tickets for select
  using (true);

-- Policy: Admins and managers can insert tickets
create policy "Admins can insert tickets"
  on tickets for insert
  with check (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role in ('admin', 'manager')
    )
  );

-- Policy: Admins and managers can update tickets
create policy "Admins can update tickets"
  on tickets for update
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role in ('admin', 'manager')
    )
  );

-- Policy: Only admins can delete tickets
create policy "Admins can delete tickets"
  on tickets for delete
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

-- Function to auto-update status based on available seats
create or replace function update_ticket_status()
returns trigger as $$
begin
  if new.available_seats = 0 then
    new.status = 'sold';
  elsif new.available_seats < new.total_seats and new.status = 'available' then
    new.status = 'booked';
  end if;
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for auto-updating status
drop trigger if exists trigger_update_ticket_status on tickets;
create trigger trigger_update_ticket_status
  before update on tickets
  for each row
  execute function update_ticket_status();
