# BD TicketPro - Deployment Guide

This guide covers deploying the BD TicketPro application to Vercel with Supabase as the backend.

## Prerequisites

1. **Vercel Account**: https://vercel.com
2. **Supabase Account**: https://supabase.com
3. **Git Repository**: Project should be pushed to GitHub, GitLab, or Bitbucket

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `bd-ticketpro` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Select closest to your target audience
4. Click "Create new project"

### 1.2 Get Your Supabase Credentials

1. Once the project is created, go to **Settings → API**
2. Copy the following values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### 1.3 Set Up Database Schema (Optional but Recommended)

In the Supabase SQL Editor, you can run the following to create the necessary tables:

```sql
-- Users table (already managed by Supabase Auth)
-- Extend with custom metadata if needed

-- Tickets table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL,
  batch_number TEXT NOT NULL,
  buying_price DECIMAL(10, 2) NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'available',
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries table
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  flag TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_country ON tickets(country_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_bookings_ticket ON bookings(ticket_id);
```

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Select the appropriate Git provider (GitHub, GitLab, Bitbucket)
5. Authorize Vercel to access your repository

### 2.2 Configure Environment Variables

1. After selecting your repository, you'll see "Environment Variables" section
2. Add the following variables:

**Public Environment Variables** (visible to browser):
- `NEXT_PUBLIC_SUPABASE_URL`: Paste your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Paste your Supabase anon public key

**Secret Environment Variables** (server-side only):
- `SUPABASE_SERVICE_ROLE_KEY`: Paste your Service Role Key

### 2.3 Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your application
3. Once complete, you'll get a unique URL (e.g., `https://bd-ticketpro-xyz.vercel.app`)

## Step 3: Post-Deployment Configuration

### 3.1 Configure Supabase URL in Auth Settings

1. In your Supabase dashboard, go to **Authentication �� URL Configuration**
2. Add your Vercel deployment URL to allowed redirect URLs:
   - `https://your-vercel-url.vercel.app/auth/callback`
   - `https://your-vercel-url.vercel.app`

### 3.2 Test Your Deployment

1. Visit your Vercel URL
2. Try the demo login (should work immediately)
3. To enable real Supabase authentication, create a user in Supabase:
   - Go to **Authentication → Users**
   - Click "Add user"
   - Enter email and password
   - Now you can test real login

## Environment Variables Reference

```
NEXT_PUBLIC_SUPABASE_URL           # Required: Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY      # Required: Supabase Anonymous Key
SUPABASE_SERVICE_ROLE_KEY          # Required: Service Role Key (server-only)
NEXT_PUBLIC_APP_URL                # Optional: Your app's full URL
NODE_ENV                           # Automatically set by Vercel (production/development)
NEXT_PUBLIC_VERCEL_ENV             # Automatically set by Vercel
```

## Local Development with Supabase

### 1. Create `.env.local` file

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Fill in your Supabase credentials

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Run development server

```bash
pnpm install
pnpm dev
```

## Vercel Deployments

### Automatic Deployments

Every push to your main branch will automatically trigger a deployment on Vercel.

### Preview Deployments

Every pull request creates a preview deployment with a unique URL for testing before merging.

### Revert a Deployment

In Vercel dashboard:
1. Go to "Deployments"
2. Click the three dots on a previous deployment
3. Select "Promote to Production"

## Monitoring and Logs

### View Logs in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" to see real-time logs

### View Logs in Supabase

1. Go to Supabase Dashboard
2. Click "Logs" in the sidebar
3. Monitor database activity and API calls

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.local` for local development
2. **Keep Service Role Key Secret** - Only use on server-side operations
3. **Use Row Level Security (RLS)** in Supabase to protect data
4. **Enable MFA** on your Vercel and Supabase accounts
5. **Rotate keys regularly** - Generate new API keys periodically

## Troubleshooting

### Deployment fails with "Module not found"

1. Check `package.json` and `pnpm-lock.yaml` are committed
2. Run `pnpm install` locally to verify dependencies
3. Check Node.js version compatibility (Next.js 14 requires Node 18+)

### Auth not working after deployment

1. Verify environment variables are set in Vercel
2. Check Supabase URL is correct (no trailing slashes)
3. Ensure Vercel URL is added to Supabase redirect URLs
4. Clear browser cookies and try again

### Database queries returning errors

1. Check `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
2. Verify Row Level Security policies allow your queries
3. Check database schema matches your queries
4. Review Supabase logs for detailed error messages

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
