-- Create bookings table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references tickets(id) on delete restrict,
  
  -- Agent Information
  agent_name text not null,
  agent_phone text not null,
  agent_email text,
  
  -- Passenger Information
  passenger_name text not null,
  passenger_passport text not null,
  passenger_phone text not null,
  passenger_email text,
  pax_count integer not null default 1,
  
  -- Pricing
  selling_price numeric(10, 2) not null,
  buying_price numeric(10, 2),
  
  -- Payment Information
  payment_type text not null check (payment_type in ('full', 'partial')),
  payment_method text not null check (payment_method in ('cash', 'card', 'bank_transfer', 'mobile_banking')),
  paid_amount numeric(10, 2) not null,
  due_amount numeric(10, 2) default 0,
  
  -- Status
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'locked')),
  
  -- Metadata
  notes text,
  created_by uuid references users(id) on delete set null,
  confirmed_by uuid references users(id) on delete set null,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint valid_payment check (paid_amount > 0 and paid_amount <= selling_price)
);

-- Create indexes
create index if not exists idx_bookings_ticket on bookings(ticket_id);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_created_by on bookings(created_by);
create index if not exists idx_bookings_created_at on bookings(created_at);
create index if not exists idx_bookings_passenger on bookings(passenger_name);

-- Enable Row Level Security
alter table bookings enable row level security;

-- Policy: Staff can read their own bookings
create policy "Staff can read own bookings"
  on bookings for select
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and (role in ('admin', 'manager') or (role = 'staff' and id = bookings.created_by))
    )
  );

-- Policy: Staff can create bookings
create policy "Staff can create bookings"
  on bookings for insert
  with check (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role in ('admin', 'manager', 'staff')
    )
  );

-- Policy: Managers can update bookings
create policy "Managers can update bookings"
  on bookings for update
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role in ('admin', 'manager')
    )
  );

-- Function to update ticket availability when booking is created
create or replace function update_ticket_on_booking()
returns trigger as $$
begin
  if new.status = 'confirmed' then
    update tickets
    set available_seats = available_seats - new.pax_count
    where id = new.ticket_id;
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger for updating ticket availability
drop trigger if exists trigger_update_ticket_on_booking on bookings;
create trigger trigger_update_ticket_on_booking
  after insert or update on bookings
  for each row
  execute function update_ticket_on_booking();

-- Function to restore ticket availability when booking is cancelled
create or replace function restore_ticket_on_cancellation()
returns trigger as $$
begin
  if old.status = 'confirmed' and new.status = 'cancelled' then
    update tickets
    set available_seats = available_seats + old.pax_count
    where id = old.ticket_id;
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger for restoring ticket availability
drop trigger if exists trigger_restore_ticket_on_cancellation on bookings;
create trigger trigger_restore_ticket_on_cancellation
  after update on bookings
  for each row
  execute function restore_ticket_on_cancellation();
