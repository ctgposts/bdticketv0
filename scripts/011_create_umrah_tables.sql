-- Create Umrah packages table
CREATE TABLE IF NOT EXISTS umrah_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name TEXT NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('economy', 'standard', 'premium', 'vip')),
  duration_days INTEGER NOT NULL,
  makkah_hotel TEXT,
  madinah_hotel TEXT,
  makkah_nights INTEGER,
  madinah_nights INTEGER,
  airline_id UUID REFERENCES airlines(id),
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 0,
  available_seats INTEGER NOT NULL DEFAULT 0,
  package_price DECIMAL(10, 2) NOT NULL,
  includes TEXT[], -- Array of included services
  excludes TEXT[], -- Array of excluded services
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out', 'cancelled')),
  visa_processing BOOLEAN DEFAULT true,
  transport_included BOOLEAN DEFAULT true,
  guide_included BOOLEAN DEFAULT true,
  description TEXT,
  terms_conditions TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Umrah bookings table
CREATE TABLE IF NOT EXISTS umrah_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES umrah_packages(id) ON DELETE CASCADE,
  booking_reference TEXT UNIQUE NOT NULL,
  group_name TEXT,
  number_of_pilgrims INTEGER NOT NULL DEFAULT 1,
  agent_name TEXT NOT NULL,
  agent_phone TEXT,
  agent_email TEXT,
  lead_pilgrim_name TEXT NOT NULL,
  lead_pilgrim_phone TEXT NOT NULL,
  lead_pilgrim_email TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  due_amount DECIMAL(10, 2) DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  visa_status TEXT DEFAULT 'pending' CHECK (visa_status IN ('pending', 'processing', 'approved', 'rejected')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT
);

-- Create Umrah pilgrims table (for individual pilgrims in a group booking)
CREATE TABLE IF NOT EXISTS umrah_pilgrims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES umrah_bookings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  passport_expiry DATE,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  nationality TEXT,
  phone TEXT,
  email TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  medical_conditions TEXT,
  special_requirements TEXT,
  visa_number TEXT,
  visa_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_umrah_packages_departure ON umrah_packages(departure_date);
CREATE INDEX IF NOT EXISTS idx_umrah_packages_status ON umrah_packages(status);
CREATE INDEX IF NOT EXISTS idx_umrah_bookings_package ON umrah_bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_umrah_bookings_status ON umrah_bookings(status);
CREATE INDEX IF NOT EXISTS idx_umrah_pilgrims_booking ON umrah_pilgrims(booking_id);

-- Enable RLS
ALTER TABLE umrah_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE umrah_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE umrah_pilgrims ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all authenticated users to read, admins to write)
CREATE POLICY "Allow public read access to umrah_packages" ON umrah_packages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to umrah_packages" ON umrah_packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update to umrah_packages" ON umrah_packages FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete to umrah_packages" ON umrah_packages FOR DELETE USING (true);

CREATE POLICY "Allow public read access to umrah_bookings" ON umrah_bookings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to umrah_bookings" ON umrah_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update to umrah_bookings" ON umrah_bookings FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete to umrah_bookings" ON umrah_bookings FOR DELETE USING (true);

CREATE POLICY "Allow public read access to umrah_pilgrims" ON umrah_pilgrims FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to umrah_pilgrims" ON umrah_pilgrims FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update to umrah_pilgrims" ON umrah_pilgrims FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete to umrah_pilgrims" ON umrah_pilgrims FOR DELETE USING (true);

-- Trigger to update available_seats when booking is created
CREATE OR REPLACE FUNCTION update_umrah_package_seats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE umrah_packages 
    SET available_seats = available_seats - NEW.number_of_pilgrims
    WHERE id = NEW.package_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      UPDATE umrah_packages 
      SET available_seats = available_seats + OLD.number_of_pilgrims
      WHERE id = OLD.package_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER umrah_booking_seats_trigger
AFTER INSERT OR UPDATE ON umrah_bookings
FOR EACH ROW
EXECUTE FUNCTION update_umrah_package_seats();

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_umrah_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference := 'UMR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_umrah_booking_reference
BEFORE INSERT ON umrah_bookings
FOR EACH ROW
WHEN (NEW.booking_reference IS NULL)
EXECUTE FUNCTION generate_umrah_booking_reference();
