# BattleBetz Admin Panel

A powerful, responsive admin dashboard for managing the BattleBetz platform. Built with Next.js, React, TypeScript, and Supabase.

## Features

- **Authentication System**: Secure user authentication using NextAuth and Supabase
- **Responsive Layout**: Mobile-friendly design with sidebar navigation
- **Dashboard**: Real-time metrics with data visualization
- **User Management**: View and manage user accounts with filtering
- **Tournament Management**: Create and manage tournaments with status tracking
- **Game Management**: Control betting status and game information
- **Analytics**: Interactive charts for growth, engagement, and revenue metrics

## Tech Stack

- **Next.js 14** with App Router
- **React 18** with Hooks
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **TanStack Query** for data fetching and caching
- **ShadCN UI** for component styling
- **Tailwind CSS** for utility-first styling
- **Recharts** for data visualization
- **NextAuth** for authentication
- **Date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/battlebetz-admin.git
cd battlebetz-admin
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
NEXTAUTH_SECRET=your_generated_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
battlebetz-admin/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Protected routes
│   │   ├── api/          # API routes
│   │   └── login/        # Public routes
│   ├── components/       # Reusable components
│   │   ├── layout/       # Layout components
│   │   ├── ui/           # UI components (ShadCN)
│   │   └── providers/    # Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── services/         # API services
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
```

## Database Schema

The application integrates with the following Supabase tables:

- **users**: User accounts and profiles
- **games**: Sport events and betting markets
- **tournaments**: Competitive events with entries and prizes
- **bets**: User betting activity
- **transactions**: Financial activity tracking

## Deployment

This application can be deployed to Vercel or any other Next.js-compatible hosting:

```bash
npm run build
# or
yarn build
```

For production deployment, ensure you have set up the environment variables in your hosting provider.

## License

This project is proprietary and confidential.

## Support

For support or questions, please contact your project administrator.
