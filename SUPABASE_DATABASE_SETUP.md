# Supabase Database Setup Guide

## Quick Setup

Your Supabase project is ready at: https://app.supabase.com/project/ngpbdtyminrvwsjdcapv

### Step 1: Create Database Tables

1. Go to your Supabase dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire content of `supabase/schema.sql` from this project
5. Paste it into the SQL editor
6. Click "Run"

This will create all tables, indexes, and seed with initial data (countries, airlines, and sample tickets).

### Step 2: Verify Tables Created

After running the SQL, you should see these tables in the "Tables" section:
- ✅ `countries` (15 countries included)
- ✅ `airlines` (10 airlines included)
- ✅ `tickets` (3 sample tickets included)
- ✅ `bookings`
- ✅ `payments`
- ✅ `activity_logs`

### Step 3: Set Up Authentication (Optional but Recommended)

1. Go to **Authentication** → **Users**
2. Click "Add User" to create admin/test users
3. Example: 
   - Email: `admin@ticketpro.com`
   - Password: `SecurePassword123!`

### Step 4: Get Your Service Role Key (For Server Operations)

Your credentials are:
- **Project URL**: `https://ngpbdtyminrvwsjdcapv.supabase.co`
- **Anon Key**: Already set in environment variables
- **Service Role Key**: Get from **Settings → API** (keep this secret!)

## What Gets Created

### Tables
1. **countries** - Destination and origin countries
2. **airlines** - Airline information
3. **tickets** - Flight tickets with pricing and availability
4. **bookings** - Customer bookings and reservations
5. **payments** - Payment records for bookings
6. **activity_logs** - System activity and audit trail

### Indexes
- Flight departure dates (for sorting)
- Ticket status (for filtering)
- Country and airline relationships
- Booking status and customer email

### Row Level Security (RLS)
- Public read access to countries, airlines, and tickets
- Authenticated users can create and view their bookings
- Payment records protected by ownership

### Sample Data
- **15 Countries**: Saudi Arabia, UAE, Qatar, Kuwait, etc.
- **10 Airlines**: Bangladesh Biman, Emirates, Qatar Airways, etc.
- **3 Sample Tickets**: Various routes from Dhaka to Gulf countries

## Troubleshooting

### "table already exists" error
- This is fine. The schema uses `CREATE TABLE IF NOT EXISTS`
- Your existing data won't be affected

### RLS errors when querying
- Make sure you're authenticated when accessing protected tables
- Countries, airlines, and tickets are publicly readable

### Can't insert tickets
- Make sure you have valid country and airline IDs
- The schema includes foreign key constraints

## Next Steps

1. The app is configured to use these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. All API routes have been updated to query from Supabase

3. Start the dev server and test:
   ```bash
   npm run dev
   ```

4. Navigate to each page and verify data is loading:
   - Dashboard (stats from real tickets)
   - Countries (list from database)
   - Tickets (with real pricing and availability)
   - Bookings (create new bookings)
   - Reports (analytics from real data)

## Additional Configuration (Optional)

### Enable Backups
1. Go to **Settings → Backups**
2. Enable automated backups for production data

### Monitor Performance
1. Use **Database → Monitoring** to track query performance
2. Analyze slow queries and add indexes if needed

### Set Up Webhooks
1. Go to **Database → Webhooks** to notify external systems of changes
2. Useful for real-time updates or integrations

## Support
- Supabase Docs: https://supabase.com/docs
- API Reference: https://supabase.com/docs/reference/javascript/introduction
- Database Guides: https://supabase.com/docs/guides/database
