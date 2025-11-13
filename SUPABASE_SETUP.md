# Supabase Setup Guide for BD TicketPro

This guide walks you through setting up Supabase for the BD TicketPro application.

## Step 1: Create a Supabase Account

1. Visit https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email address

## Step 2: Create a New Project

1. After logging in, click "New Project"
2. Fill in the project details:
   - **Project Name**: `bd-ticketpro` (or your preferred name)
   - **Password**: Create a strong database password (you'll need this)
   - **Region**: Select the region closest to your users:
     - Asia Southeast: Singapore (ap-southeast-1)
     - South Asia: India (ap-south-1)
     - Or select based on your target market
   - **Pricing Plan**: Start with Free plan (no credit card required)

3. Click "Create new project"
4. Wait for the project to be created (usually 1-2 minutes)

## Step 3: Get Your API Credentials

Once your project is created:

1. Click on your project to open the dashboard
2. Go to **Settings** (bottom of the left sidebar)
3. Click **API**
4. You'll see your credentials:

```
Project URL:           https://xxxxx.supabase.co
Anon Public Key:       xxxxxxxxxxxxxxxxxxxxxxxxxx...
Service Role Key:      xxxxxxxxxxxxxxxxxxxxxxxxxx... (keep this secret!)
```

Copy these values - you'll need them next.

## Step 4: Configure Your Application

### For Local Development:

1. In your project root, create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Save the file

### For Vercel Deployment:

1. Go to Vercel dashboard for your project
2. Click "Settings"
3. Go to "Environment Variables"
4. Add these variables (mark sensitive ones as secret):

| Key | Value | Type |
|-----|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Standard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Anon Key | Standard |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Service Role Key | **Secret** |

5. Click "Save"

## Step 5: (Optional) Set Up Database Schema

To use the full functionality of BD TicketPro, you should set up the database tables.

### In Supabase Dashboard:

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the SQL schema below
4. Click **Run**

```sql
-- Create tickets table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL,
  batch_number TEXT NOT NULL,
  buying_price DECIMAL(10, 2) NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'locked', 'sold')),
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create countries table
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  flag TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_country ON tickets(country_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_bookings_ticket ON bookings(ticket_id);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
```

## Step 6: (Optional) Create Test Users

To test the authentication system:

1. In Supabase dashboard, go to **Authentication → Users**
2. Click **Add User**
3. Fill in:
   - Email: `admin@example.com`
   - Password: `SecurePassword123!`
4. Click **Create user**

Now you can test the app with these credentials.

## Step 7: Configure Authentication Redirect URLs

For proper authentication flow:

1. In Supabase, go to **Authentication → URL Configuration**
2. Under "Allowed Redirect URLs", add:
   - For local development: `http://localhost:3000/auth/callback`
   - For Vercel: `https://your-vercel-url.vercel.app/auth/callback`

## Verification

### Test Local Development:

1. Run `pnpm install`
2. Run `pnpm dev`
3. Open http://localhost:3000
4. You should see the login page

**Two login options:**
- **Demo Mode**: Click "Enter Demo" (no credentials needed)
- **Real Login**: Click "switch to real login" and use the test user credentials

### Test Vercel Deployment:

1. Push your changes to Git
2. Vercel will automatically deploy
3. Visit your Vercel URL
4. Test both demo and real login modes

## Common Issues and Solutions

### "Failed to initialize Supabase"
- **Cause**: Environment variables not set or incorrect
- **Solution**: 
  - Check `.env.local` exists and has correct values
  - Verify there are no extra spaces or quotes
  - Restart dev server after changing env variables

### "Login button does nothing"
- **Cause**: Supabase credentials not configured
- **Solution**:
  - Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Verify the keys are correct from Supabase dashboard
  - Check browser console for error messages

### "Wrong email or password" (even with correct credentials)
- **Cause**: User not created in Supabase
- **Solution**:
  - Create a test user in Supabase → Authentication → Users
  - Verify email matches exactly
  - Check password requirements

### "Cannot POST /api/auth/callback"
- **Cause**: Callback URL not configured in Supabase
- **Solution**:
  - In Supabase, go to Authentication → URL Configuration
  - Add your Vercel/local URL to Allowed Redirect URLs
  - Example: `https://your-domain.com/auth/callback`

## Next Steps

After setting up Supabase:

1. **Test the application**: Try logging in with your test user
2. **Explore the dashboard**: Check out all features
3. **Deploy to Vercel**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Add more data**: Create users, tickets, and bookings

## Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Supabase Guide**: https://supabase.com/docs/guides/with-nextjs
- **Vercel Deployment**: https://vercel.com/docs/concepts/deployments/overview

## Need Help?

- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) file for more detailed setup instructions
- Review the [README.md](./README.md) for project overview
- Visit Supabase docs: https://supabase.com/docs
