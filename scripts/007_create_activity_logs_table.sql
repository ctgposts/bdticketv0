-- Create activity logs table for audit trail
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_activity_logs_user on activity_logs(user_id);
create index if not exists idx_activity_logs_entity on activity_logs(entity_type, entity_id);
create index if not exists idx_activity_logs_created_at on activity_logs(created_at);

-- Enable Row Level Security
alter table activity_logs enable row level security;

-- Policy: Only admins can read activity logs
create policy "Admins can read activity logs"
  on activity_logs for select
  using (
    exists (
      select 1 from users
      where id::text = auth.uid()::text
      and role = 'admin'
    )
  );

-- Function to log activities
create or replace function log_activity(
  p_user_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_details jsonb default null
)
returns void as $$
begin
  insert into activity_logs (user_id, action, entity_type, entity_id, details)
  values (p_user_id, p_action, p_entity_type, p_entity_id, p_details);
end;
$$ language plpgsql;
