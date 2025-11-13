# BD TicketPro - Production Setup Instructions

## Overview

Your app is now ready for production deployment. All demo data has been removed and replaced with Supabase-powered API endpoints. Follow these steps to complete the setup.

## Step 1: Set Up Supabase Database (CRITICAL)

### 1.1 Access Your Supabase Project

1. Go to: https://app.supabase.com
2. Sign in to your account
3. Select project: **ngpbdtyminrvwsjdcapv**
4. Navigate to **SQL Editor** in the left sidebar

### 1.2 Create Database Schema

1. Click **New Query**
2. Open the file `supabase/schema.sql` from this project
3. Copy the entire content
4. Paste into the SQL editor
5. Click **Run** button

This will create:
- ✅ `countries` table (15 countries pre-loaded)
- ✅ `airlines` table (10 airlines pre-loaded)
- ✅ `tickets` table (3 sample tickets pre-loaded)
- ✅ `bookings` table
- ✅ `payments` table
- ✅ `activity_logs` table
- ✅ All indexes for performance
- ✅ Row Level Security policies

**Wait for completion** - It should take 10-30 seconds.

### 1.3 Verify Tables

Go to **Table Editor** in the sidebar and verify you see:
- `countries` (15 rows)
- `airlines` (10 rows)
- `tickets` (3 rows)
- `bookings` (empty)
- `payments` (empty)
- `activity_logs` (empty)

## Step 2: Environment Variables (Already Set)

Your environment variables are already configured:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ngpbdtyminrvwsjdcapv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **These are already set in the development environment**

For Vercel deployment, add these same variables to your Vercel project settings.

## Step 3: Test the App

### 3.1 Start Development Server

```bash
npm run dev
```

### 3.2 Test Each Page

#### Dashboard (`/dashboard`)
- Should show real statistics from Supabase
- **Today's Sales**: Counts confirmed bookings from today
- **Total Bookings**: Total bookings count
- **Available Tickets**: Count of available tickets
- **Estimated Profit**: Calculated from ticket prices

#### Countries (`/countries`)
- Should show 15 countries from the database
- Each card shows available/total tickets
- Click on any country to see its tickets

#### Tickets (`/tickets`)
- Should display 3 sample tickets
- Filter by status: Available, Locked, Sold
- Shows real pricing: Buying Price and Selling Price
- Available seats update in real-time

#### Bookings (`/bookings`)
- Create new bookings (requires ticket selection)
- View booking history
- Filter by status

#### Reports (`/reports`)
- Revenue and profit analytics
- Date range filtering
- Summary statistics

## Step 4: Authentication (Optional)

### Create Test Users

To test with real authentication:

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add User**
3. Enter:
   - Email: `admin@ticketpro.com`
   - Password: `Admin@123456`
4. Click **Create User**

Then login at `/login` with these credentials.

## Step 5: Vercel Deployment

### 5.1 Push to Git

```bash
git add .
git commit -m "Production-ready Supabase integration"
git push origin main
```

### 5.2 Deploy to Vercel

1. Go to: https://vercel.com
2. Import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

Your app will be live on a Vercel URL like `https://bd-ticketpro-xyz.vercel.app`

## What's Been Changed

### API Routes (Now Using Supabase)

| Route | Changes |
|-------|---------|
| `/api/countries` | Returns real countries from database |
| `/api/countries/stats` | Calculates stats from real tickets |
| `/api/tickets` | Queries real tickets with filters |
| `/api/airlines` | Returns real airlines |
| `/api/bookings` | Create/read bookings from database |
| `/api/dashboard/stats` | Real analytics from Supabase |
| `/api/reports` | Real revenue/profit reports |

### Removed Demo Data

- ❌ Removed hardcoded DEMO_COUNTRIES
- ❌ Removed hardcoded DEMO_TICKETS
- ❌ Removed demo booking responses
- ✅ All data now from Supabase

### New Features

- ✅ Real-time statistics
- ✅ Transaction-safe bookings
- ✅ Activity logging
- ✅ Row Level Security
- ✅ Audit trails

## Troubleshooting

### "Table does not exist" Error

**Cause**: SQL schema not run in Supabase

**Solution**:
1. Go to Supabase SQL Editor
2. Create new query
3. Copy entire `supabase/schema.sql`
4. Click Run

### "Column does not exist" Error

**Cause**: Database schema incomplete

**Solution**: Run the full schema SQL again (it's safe to re-run)

### Empty Data on Pages

**Cause**: Tables created but no data

**Solution**: The schema automatically seeds data. If empty:
1. Go to **Table Editor**
2. Click **countries** table
3. Click **Insert Row** and add data manually, OR
4. Run the data insertion queries from `supabase/schema.sql`

### Authentication Issues

**If users can't login**:
1. Create users in Supabase → Authentication → Users
2. Verify email matches exactly
3. Check password requirements

### Bookings Not Saving

**Cause**: Missing tickets in database

**Solution**:
1. Create tickets first in `/admin/buying` page, OR
2. Manually insert via Supabase Table Editor

## Database Relationships

```
Countries (1) ──── (Many) Tickets
Airlines (1) ──── (Many) Tickets
Tickets (1) ──── (Many) Bookings
Bookings (1) ──── (Many) Payments
```

All relationships have CASCADE DELETE for data integrity.

## Key Features Now Working

### Dashboard
- Real-time KPI metrics
- Today's sales tracking
- Ticket inventory overview
- Profit estimation

### Ticket Management
- Create bulk tickets
- Search and filter
- Status tracking
- Price management

### Booking System
- Customer booking creation
- Booking confirmation
- Status tracking
- Email notifications (optional)

### Reports
- Revenue analytics
- Profit calculations
- Custom date ranges
- Booking summaries

## Next Steps

1. ✅ **Immediate**: Run the SQL schema in Supabase
2. ✅ **Testing**: Test each page with real data
3. ✅ **Users**: Create users for team members
4. ✅ **Deployment**: Deploy to Vercel
5. ⏳ **Monitoring**: Set up monitoring (optional)

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Database Guide**: `SUPABASE_DATABASE_SETUP.md`

## Security Notes

- ✅ Row Level Security enabled
- ✅ Public read for countries/airlines/tickets
- ✅ Protected bookings and payments
- ✅ Audit logging for actions
- ✅ Admin only table editing (implement as needed)

---

**Status**: 🚀 **Ready for Production**

After completing these steps, your app will be fully functional with real Supabase data!
