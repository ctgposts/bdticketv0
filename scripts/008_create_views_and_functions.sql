-- Create view for ticket details with related information
create or replace view ticket_details as
select 
  t.id,
  t.flight_number,
  t.batch_number,
  t.origin,
  t.destination,
  t.departure_date,
  t.departure_time,
  t.arrival_time,
  t.buying_price,
  t.selling_price,
  t.total_seats,
  t.available_seats,
  t.status,
  t.locked_until,
  t.notes,
  t.created_at,
  t.updated_at,
  a.name as airline_name,
  a.code as airline_code,
  c.name as country_name,
  c.code as country_code,
  c.flag as country_flag,
  u.name as created_by_name
from tickets t
left join airlines a on t.airline_id = a.id
left join countries c on t.country_id = c.id
left join users u on t.created_by = u.id;

-- Create view for booking details
create or replace view booking_details as
select 
  b.id,
  b.agent_name,
  b.agent_phone,
  b.agent_email,
  b.passenger_name,
  b.passenger_passport,
  b.passenger_phone,
  b.passenger_email,
  b.pax_count,
  b.selling_price,
  b.buying_price,
  b.payment_type,
  b.payment_method,
  b.paid_amount,
  b.due_amount,
  b.status,
  b.notes,
  b.created_at,
  b.confirmed_at,
  b.cancelled_at,
  t.flight_number,
  t.departure_date,
  t.departure_time,
  a.name as airline_name,
  c.name as country_name,
  c.flag as country_flag,
  u.name as created_by_name,
  uc.name as confirmed_by_name
from bookings b
left join tickets t on b.ticket_id = t.id
left join airlines a on t.airline_id = a.id
left join countries c on t.country_id = c.id
left join users u on b.created_by = u.id
left join users uc on b.confirmed_by = uc.id;

-- Function to get dashboard statistics
create or replace function get_dashboard_stats(p_user_id uuid default null)
returns jsonb as $$
declare
  v_stats jsonb;
  v_today date := current_date;
begin
  select jsonb_build_object(
    'todaysSales', (
      select jsonb_build_object(
        'amount', coalesce(sum(paid_amount), 0),
        'count', count(*)
      )
      from bookings
      where date(created_at) = v_today
      and status = 'confirmed'
    ),
    'totalBookings', (
      select count(*)
      from bookings
      where status in ('pending', 'confirmed')
    ),
    'lockedTickets', (
      select count(*)
      from tickets
      where status = 'locked'
      and locked_until > now()
    ),
    'totalInventory', (
      select count(*)
      from tickets
      where status in ('available', 'booked')
    ),
    'estimatedProfit', (
      select coalesce(sum(selling_price - buying_price), 0)
      from bookings
      where status = 'confirmed'
      and date(created_at) = v_today
    ),
    'availableSeats', (
      select coalesce(sum(available_seats), 0)
      from tickets
      where status in ('available', 'booked')
    ),
    'totalRevenue', (
      select coalesce(sum(paid_amount), 0)
      from bookings
      where status = 'confirmed'
    )
  ) into v_stats;
  
  return v_stats;
end;
$$ language plpgsql;

-- Function to search tickets
create or replace function search_tickets(
  p_search_term text default null,
  p_country_code text default null,
  p_airline_code text default null,
  p_status text default null,
  p_from_date date default null,
  p_to_date date default null
)
returns setof ticket_details as $$
begin
  return query
  select * from ticket_details t
  where (p_search_term is null or (
    t.flight_number ilike '%' || p_search_term || '%' or
    t.airline_name ilike '%' || p_search_term || '%' or
    t.country_name ilike '%' || p_search_term || '%' or
    t.destination ilike '%' || p_search_term || '%'
  ))
  and (p_country_code is null or t.country_code = p_country_code)
  and (p_airline_code is null or t.airline_code = p_airline_code)
  and (p_status is null or t.status = p_status)
  and (p_from_date is null or t.departure_date >= p_from_date)
  and (p_to_date is null or t.departure_date <= p_to_date)
  order by t.departure_date, t.departure_time;
end;
$$ language plpgsql;
