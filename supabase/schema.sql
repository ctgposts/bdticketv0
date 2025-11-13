-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  flag TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Airlines Table
CREATE TABLE IF NOT EXISTS airlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number TEXT NOT NULL,
  airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  destination_country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  origin_country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  departure_date TIMESTAMP NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  buying_price DECIMAL(10, 2) NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 10,
  available_seats INTEGER NOT NULL DEFAULT 10,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'locked', 'sold', 'cancelled')),
  batch_number TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_passport TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  amount DECIMAL(10, 2) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_country ON tickets(destination_country_id);
CREATE INDEX idx_tickets_airline ON tickets(airline_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_departure ON tickets(departure_date);
CREATE INDEX idx_bookings_ticket ON bookings(ticket_id);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);

-- Insert default countries
INSERT INTO countries (name, code, flag) VALUES
  ('Saudi Arabia', 'KSA', '🇸🇦'),
  ('United Arab Emirates', 'UAE', '🇦🇪'),
  ('Qatar', 'QAT', '🇶🇦'),
  ('Kuwait', 'KWT', '🇰🇼'),
  ('Oman', 'OMN', '🇴🇲'),
  ('Bahrain', 'BHR', '🇧🇭'),
  ('Malaysia', 'MYS', '🇲🇾'),
  ('Singapore', 'SGP', '🇸🇬'),
  ('Thailand', 'THA', '🇹🇭'),
  ('Turkey', 'TUR', '🇹🇷'),
  ('Bangladesh', 'BD', '🇧🇩'),
  ('Egypt', 'EGY', '🇪🇬'),
  ('Pakistan', 'PAK', '🇵🇰'),
  ('India', 'IND', '🇮🇳'),
  ('Sri Lanka', 'LKA', '🇱🇰')
ON CONFLICT (code) DO NOTHING;

-- Insert default airlines
INSERT INTO airlines (name, code, logo_url) VALUES
  ('Bangladesh Biman Airways', 'BG', 'https://via.placeholder.com/50'),
  ('Emirates', 'EK', 'https://via.placeholder.com/50'),
  ('Qatar Airways', 'QR', 'https://via.placeholder.com/50'),
  ('Turkish Airlines', 'TK', 'https://via.placeholder.com/50'),
  ('Saudi Airlines', 'SV', 'https://via.placeholder.com/50'),
  ('Air Asia', 'AK', 'https://via.placeholder.com/50'),
  ('Flydubai', 'FZ', 'https://via.placeholder.com/50'),
  ('Kuwait Airways', 'KU', 'https://via.placeholder.com/50'),
  ('Oman Air', 'WY', 'https://via.placeholder.com/50'),
  ('Malaysia Airlines', 'MH', 'https://via.placeholder.com/50')
ON CONFLICT (code) DO NOTHING;

-- Insert sample tickets
INSERT INTO tickets (
  flight_number, airline_id, origin, destination,
  destination_country_id, origin_country_id,
  departure_date, departure_time, arrival_time,
  buying_price, selling_price, total_seats, available_seats,
  status, batch_number
) SELECT
  'BA-1001',
  (SELECT id FROM airlines WHERE code = 'BG'),
  'Dhaka (DAC)',
  'Dubai (DXB)',
  (SELECT id FROM countries WHERE code = 'UAE'),
  (SELECT id FROM countries WHERE code = 'BD'),
  CURRENT_TIMESTAMP + INTERVAL '15 days',
  '14:30',
  '17:45',
  85000,
  95000,
  10,
  8,
  'available',
  'BATCH-001'
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE flight_number = 'BA-1001');

INSERT INTO tickets (
  flight_number, airline_id, origin, destination,
  destination_country_id, origin_country_id,
  departure_date, departure_time, arrival_time,
  buying_price, selling_price, total_seats, available_seats,
  status, batch_number
) SELECT
  'EK-2002',
  (SELECT id FROM airlines WHERE code = 'EK'),
  'Dhaka (DAC)',
  'Jeddah (JED)',
  (SELECT id FROM countries WHERE code = 'KSA'),
  (SELECT id FROM countries WHERE code = 'BD'),
  CURRENT_TIMESTAMP + INTERVAL '20 days',
  '23:15',
  '03:30',
  92000,
  105000,
  10,
  5,
  'available',
  'BATCH-002'
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE flight_number = 'EK-2002');

INSERT INTO tickets (
  flight_number, airline_id, origin, destination,
  destination_country_id, origin_country_id,
  departure_date, departure_time, arrival_time,
  buying_price, selling_price, total_seats, available_seats,
  status, batch_number
) SELECT
  'QR-3003',
  (SELECT id FROM airlines WHERE code = 'QR'),
  'Dhaka (DAC)',
  'Doha (DOH)',
  (SELECT id FROM countries WHERE code = 'QAT'),
  (SELECT id FROM countries WHERE code = 'BD'),
  CURRENT_TIMESTAMP + INTERVAL '25 days',
  '10:00',
  '12:45',
  75000,
  85000,
  15,
  12,
  'available',
  'BATCH-003'
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE flight_number = 'QR-3003');

-- Set up Row Level Security (RLS)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for countries and airlines
CREATE POLICY "Allow public read access to countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Allow public read access to airlines" ON airlines FOR SELECT USING (true);
CREATE POLICY "Allow public read access to tickets" ON tickets FOR SELECT USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (
  auth.uid() = created_by OR auth.role() = 'authenticated'
);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = created_by);

-- Activity logs policies
CREATE POLICY "Users can view activity logs" ON activity_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Payments policies
CREATE POLICY "Users can view their payment history" ON payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = payments.booking_id
    AND bookings.created_by = auth.uid()
  ) OR auth.role() = 'authenticated'
);

-- Triggers for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_airlines_updated_at BEFORE UPDATE ON airlines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
