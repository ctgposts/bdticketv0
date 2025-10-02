-- Insert sample tickets for testing
do $$
declare
  v_saudi_id uuid;
  v_emirates_id uuid;
  v_qatar_id uuid;
  v_ksa_id uuid;
  v_uae_id uuid;
  v_qat_id uuid;
  v_admin_id uuid;
begin
  -- Get airline IDs
  select id into v_saudi_id from airlines where code = 'SV';
  select id into v_emirates_id from airlines where code = 'EK';
  select id into v_qatar_id from airlines where code = 'QR';
  
  -- Get country IDs
  select id into v_ksa_id from countries where code = 'KSA';
  select id into v_uae_id from countries where code = 'UAE';
  select id into v_qat_id from countries where code = 'QAT';
  
  -- Get admin user ID
  select id into v_admin_id from users where username = 'admin';
  
  -- Insert sample tickets
  insert into tickets (
    airline_id, country_id, flight_number, batch_number,
    origin, destination, departure_date, departure_time, arrival_time,
    buying_price, selling_price, total_seats, available_seats,
    status, created_by
  ) values
  (v_saudi_id, v_ksa_id, 'SV801', 'BATCH001', 'Dhaka', 'Riyadh', 
   current_date + interval '5 days', '10:30', '14:45', 42000, 45000, 10, 10, 'available', v_admin_id),
  (v_saudi_id, v_ksa_id, 'SV803', 'BATCH001', 'Dhaka', 'Jeddah', 
   current_date + interval '7 days', '11:00', '15:30', 43000, 46000, 8, 8, 'available', v_admin_id),
  (v_emirates_id, v_uae_id, 'EK582', 'BATCH002', 'Dhaka', 'Dubai', 
   current_date + interval '3 days', '09:00', '13:30', 45000, 48000, 15, 15, 'available', v_admin_id),
  (v_emirates_id, v_uae_id, 'EK584', 'BATCH002', 'Dhaka', 'Abu Dhabi', 
   current_date + interval '4 days', '14:30', '19:00', 44000, 47000, 12, 12, 'available', v_admin_id),
  (v_qatar_id, v_qat_id, 'QR636', 'BATCH003', 'Dhaka', 'Doha', 
   current_date + interval '6 days', '23:45', '04:15', 41000, 44000, 20, 20, 'available', v_admin_id),
  (v_qatar_id, v_qat_id, 'QR638', 'BATCH003', 'Dhaka', 'Doha', 
   current_date + interval '8 days', '01:30', '06:00', 40000, 43000, 18, 15, 'available', v_admin_id)
  on conflict do nothing;
end $$;
