-- Create payments table for tracking payment history
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  amount numeric(10, 2) not null,
  payment_method text not null check (payment_method in ('cash', 'card', 'bank_transfer', 'mobile_banking')),
  payment_type text not null check (payment_type in ('advance', 'full', 'partial', 'refund')),
  transaction_id text,
  notes text,
  received_by uuid references users(id) on delete set null,
  created_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_payments_booking on payments(booking_id);
create index if not exists idx_payments_created_at on payments(created_at);

-- Enable Row Level Security
alter table payments enable row level security;

-- Policy: Staff can read payments
create policy "Staff can read payments"
  on payments for select
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role in ('admin', 'manager', 'staff')
    )
  );

-- Policy: Staff can create payments
create policy "Staff can create payments"
  on payments for insert
  with check (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role in ('admin', 'manager', 'staff')
    )
  );
