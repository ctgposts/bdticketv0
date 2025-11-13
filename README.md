# BD TicketPro - Travel Agency Management System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

## Overview

BD TicketPro is a comprehensive Travel Agency Management System designed for Bangladeshi travel agencies and international flight ticket management. The application provides a complete solution for:

- **Flight Ticket Management**: Manage ticket inventory, pricing, and availability
- **Booking System**: Handle customer bookings and reservations
- **Dashboard Analytics**: Track sales, revenue, and key metrics
- **Administrative Functions**: Manage users, settings, and system configuration

## Technology Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Radix UI Components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod validation

## Quick Start

### Prerequisites

- Node.js 18+ or pnpm 10+
- Supabase account (free tier available at https://supabase.com)
- Vercel account (optional, for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bd-ticketpro
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Supabase credentials**
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Demo Access

The application includes a demo mode that allows exploration without authentication:

- Click "Enter Demo" on the login page
- Access all features with pre-configured demo data
- Perfect for testing and evaluation

## Supabase Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:
- Creating a Supabase project
- Setting up authentication
- Configuring the database schema
- Managing environment variables

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Visit https://vercel.com and import your repository
3. Add Supabase environment variables
4. Click "Deploy"

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Environment Variables for Production

Make sure to set these in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Project Structure

```
bd-ticketpro/
├── app/
│   ├── (dashboard)/          # Protected dashboard pages
│   │   ├── admin/            # Admin features
│   │   ├── bookings/         # Booking management
│   │   ├── reports/          # Analytics and reports
│   ��   ├── tickets/          # Ticket inventory
│   │   └── settings/         # App settings
│   ├── api/                  # API routes
│   ├── login/                # Authentication page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── layout/               # Layout components
│   └── [feature]/            # Feature-specific components
├── contexts/                 # React contexts
├── hooks/                    # Custom React hooks
├── lib/
│   ├── supabase/            # Supabase client config
│   ├── auth.ts              # Auth utilities
│   └── utils.ts             # Helper functions
├── types/                    # TypeScript type definitions
├── middleware.ts             # Next.js middleware
└── vercel.json              # Vercel deployment config
```

## Key Features

### Dashboard
- Real-time analytics and KPIs
- Sales tracking
- Inventory overview
- Quick actions

### Tickets Management
- Add and manage flight tickets
- Track ticket status (available, locked, sold)
- Pricing management
- Bulk operations

### Bookings
- Customer booking management
- Booking status tracking
- Customer communication
- Booking history

### Reports
- Sales analytics
- Revenue tracking
- Profit margins
- Custom date range filtering

### Settings
- User management
- System configuration
- Theme preferences
- Application settings

## Authentication

The application uses Supabase for secure authentication:

### Demo Mode
- No credentials required
- Pre-configured demo user
- Full feature access
- Perfect for trials and testing

### Real Authentication
- Email/password login
- Secure session management
- Automatic session refresh
- User role-based access control

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized for fast page loads
- Code splitting and lazy loading
- Image optimization
- CSS minification
- Database query optimization with indexes

## Security

- Row Level Security (RLS) in Supabase
- Secure API routes
- HTTPS enforcement
- Environment variable protection
- Session management middleware

## Troubleshooting

### "Module not found" error
Check that all dependencies are installed:
```bash
pnpm install
```

### Auth not working
1. Verify Supabase credentials in `.env.local`
2. Check Supabase project is active
3. Clear browser cookies and try again

### Database connection errors
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check network connectivity
3. Review Supabase logs for detailed errors

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more troubleshooting steps.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary software for BD TicketPro.

## Support

For issues, questions, or feature requests:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for common solutions
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs
4. Review Vercel documentation: https://vercel.com/docs

## Deployment Status

- **Last Updated**: {{ date }}
- **Build Status**: Check Vercel dashboard
- **Uptime**: 99.9% (Vercel infrastructure)

---

Built with ❤️ for travel agencies in Bangladesh
