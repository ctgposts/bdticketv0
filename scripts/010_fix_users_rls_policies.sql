-- Drop existing policies that cause recursion
drop policy if exists "Users can read own data" on users;
drop policy if exists "Admins can read all users" on users;
drop policy if exists "Admins can insert users" on users;
drop policy if exists "Admins can update users" on users;

-- Create a function to check if user is admin (avoids recursion)
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from users
    where id = auth.uid()
    and role = 'admin'
    and is_active = true
  );
end;
$$ language plpgsql security definer;

-- Policy: Allow service role to read all (for authentication)
create policy "Service role can read all users"
  on users for select
  using (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    or auth.uid() is not null
  );

-- Policy: Users can read their own data
create policy "Users can read own data"
  on users for select
  using (id = auth.uid());

-- Policy: Admins can insert users
create policy "Admins can insert users"
  on users for insert
  with check (is_admin());

-- Policy: Admins can update users
create policy "Admins can update users"
  on users for update
  using (is_admin());

-- Policy: Admins can delete users
create policy "Admins can delete users"
  on users for delete
  using (is_admin());
