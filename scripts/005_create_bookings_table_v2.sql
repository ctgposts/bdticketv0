-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  booking_reference TEXT UNIQUE NOT NULL,
  
  -- Agent Information
  agent_name TEXT NOT NULL,
  agent_phone TEXT NOT NULL,
  agent_email TEXT,
  
  -- Passenger Information
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  passenger_email TEXT,
  passenger_passport TEXT,
  
  -- Booking Details
  number_of_seats INTEGER NOT NULL DEFAULT 1 CHECK (number_of_seats > 0),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  due_amount DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  
  -- Status and Metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  notes TEXT,
  
  -- Audit Fields
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES public.users(id),
  cancellation_reason TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_ticket_id ON public.bookings(ticket_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_agent_phone ON public.bookings(agent_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_phone ON public.bookings(passenger_phone);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to view bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to delete bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- Create trigger to update ticket availability when booking is created/updated/deleted
CREATE OR REPLACE FUNCTION update_ticket_availability_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Decrease available seats when booking is created
    UPDATE public.tickets
    SET available_seats = available_seats - NEW.number_of_seats
    WHERE id = NEW.ticket_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Adjust seats if number changed or status changed
    IF OLD.number_of_seats != NEW.number_of_seats OR OLD.status != NEW.status THEN
      IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Return seats when booking is cancelled
        UPDATE public.tickets
        SET available_seats = available_seats + OLD.number_of_seats
        WHERE id = OLD.ticket_id;
      ELSIF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
        -- Take seats when booking is reactivated
        UPDATE public.tickets
        SET available_seats = available_seats - NEW.number_of_seats
        WHERE id = NEW.ticket_id;
      ELSE
        -- Adjust for seat number change
        UPDATE public.tickets
        SET available_seats = available_seats + OLD.number_of_seats - NEW.number_of_seats
        WHERE id = NEW.ticket_id;
      END IF;
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Return seats when booking is deleted (only if not cancelled)
    IF OLD.status != 'cancelled' THEN
      UPDATE public.tickets
      SET available_seats = available_seats + OLD.number_of_seats
      WHERE id = OLD.ticket_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ticket_availability
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_availability_on_booking();

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate reference like BK20250102-ABCD
    ref := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    
    -- Check if it exists
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE booking_reference = ref) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN ref;
END;
$$ LANGUAGE plpgsql;
