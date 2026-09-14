# BattleBetz Web Application

<div align="center">
  <img src="public/assets/images/logo.png" alt="BattleBetz Logo" width="200" height="200">
  
  <h3>🏆 The Ultimate Sports Betting Tournament Platform 🏆</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.49.4-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

BattleBetz is a modern sports betting tournament platform that allows users to compete against each other in structured betting tournaments. Users can join tournaments, place bets on various sports events, and compete for prize pools using a token-based system.

### Key Concepts
- **Tournaments**: Structured competitions with entry fees and prize pools
- **BBZT Tokens**: In-app currency used for betting within tournaments
- **Leaderboards**: Real-time rankings based on betting performance
- **Profile System**: User profiles with statistics and transaction history

## ✨ Features

### 🏆 Tournament System
- Browse and join upcoming tournaments
- Real-time tournament status and leaderboards
- Multiple tournament types (Sports, eSports, Fantasy)
- Prize pool distribution system

### 🎲 Betting Engine
- Place bets on live sports events
- Real-time odds and game updates
- Bet history and performance tracking
- Token-based betting system

### 👤 User Management
- Secure authentication with NextAuth.js
- Comprehensive user profiles
- Transaction history
- Account settings and preferences

### 📊 Analytics & Reporting
- Performance statistics
- Betting history analysis
- Tournament participation tracking
- Financial transaction records

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark theme with glass morphism effects
- Real-time updates and notifications
- Intuitive navigation and user flows

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5.8.3
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.320.0
- **State Management**: React Hooks + Context API

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js 4.24.5 + Supabase Auth
- **ORM**: Supabase Client 2.49.4
- **Password Hashing**: bcryptjs 3.0.2

### Payment Processing
- **Payment Gateway**: Stripe 18.1.0
- **Client Integration**: @stripe/stripe-js 7.3.0

### Development Tools
- **Linting**: ESLint 8.56.0 + TypeScript ESLint
- **Testing**: Jest 29.7.0
- **Build Tool**: Next.js built-in
- **Package Manager**: npm/yarn

### Additional Libraries
- **HTTP Client**: Axios 1.9.0
- **Date Handling**: date-fns 3.6.0
- **Validation**: Zod 3.22.4
- **Utilities**: clsx 2.1.1, tailwind-merge 3.2.0

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase Account** for database and authentication
- **Stripe Account** for payment processing (optional for development)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/battlebetz-web.git
   cd battlebetz-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables (see [Environment Variables](#environment-variables) section)

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (SQL files in `/database` folder)
   - Configure authentication providers
   - Set up Row Level Security (RLS) policies

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Application Configuration
NODE_ENV=development
```

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Base URL of your application | ✅ |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ⚠️ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ⚠️ |

⚠️ = Required for payment functionality

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
# or
yarn build
yarn start
```

### Linting
```bash
npm run lint
# or
yarn lint
```

### Testing
```bash
npm run test
# or
yarn test
```

## 📁 Project Structure

```
battlebetz-web/
├── public/                     # Static assets
│   └── assets/
│       ├── images/            # Image assets
│       └── fonts/             # Font files
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/           # Authentication pages
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard page
│   │   ├── profile/          # Profile pages
│   │   ├── tournaments/      # Tournament pages
│   │   └── settings/         # Settings page
│   ├── components/           # Reusable React components
│   │   ├── auth/            # Authentication components
│   │   ├── bets/            # Betting components
│   │   ├── profile/         # Profile components
│   │   ├── providers/       # Context providers
│   │   ├── tournaments/     # Tournament components
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── auth-options.ts  # NextAuth configuration
│   │   └── supabase.ts      # Supabase client
│   ├── services/            # API service functions
│   │   ├── news/           # News service
│   │   ├── notifications/  # Notification service
│   │   ├── profiles/       # Profile service
│   │   └── tournaments/    # Tournament service
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .env.local              # Environment variables
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛣 API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `POST /api/auth/reset` - Password reset
- `DELETE /api/auth/delete-account` - Account deletion

### User Management
- `PUT /api/user/update-profile` - Update user profile
- `PUT /api/user/update-password` - Update password

### Payments
- `POST /api/payments/stripe` - Stripe payment processing

## 🗄 Database Schema

### Core Tables

#### Users
```sql
users (
  id: uuid (primary key)
  email: varchar (unique)
  username: varchar (unique)
  hashed_password: varchar
  role: enum ('USER', 'ADMIN')
  status: boolean
  created_at: timestamp
  updated_at: timestamp
)
```

#### Tournaments
```sql
tournaments (
  id: uuid (primary key)
  name: varchar
  description: text
  status: enum ('UPCOMING', 'ACTIVE', 'COMPLETED')
  prize_pool: decimal
  entry_fee: decimal
  start_date: timestamp
  end_date: timestamp
  max_participants: integer
  type: varchar
  is_public: boolean
  created_at: timestamp
)
```

#### Tournament Participants
```sql
tournament_round_participants (
  id: uuid (primary key)
  tournament_id: uuid (foreign key)
  user_id: uuid (foreign key)
  token_balance: decimal
  rank: integer
  joined_at: timestamp
)
```

#### Games
```sql
games (
  event_id: integer (primary key)
  sport: varchar
  start_time: timestamp
  status: varchar
  home_team: varchar
  away_team: varchar
  home_score: integer
  away_score: integer
)
```

#### Transactions
```sql
transactions (
  id: uuid (primary key)
  user_id: uuid (foreign key)
  amount: decimal
  type: varchar
  status: enum ('pending', 'completed', 'failed')
  reference: varchar
  created_at: timestamp
)
```

## 🔐 Authentication

The application uses a hybrid authentication system:

1. **NextAuth.js** for session management
2. **Supabase Auth** for user authentication
3. **bcryptjs** for password hashing

### Authentication Flow
1. User submits credentials
2. System validates against Supabase Auth
3. On success, creates NextAuth.js session
4. User profile is fetched/created in database
5. Session includes user ID, email, role, and status

### Protected Routes
- All routes under `/dashboard/*`
- All routes under `/profile/*`
- All routes under `/tournaments/*/place-bets`
- Settings page

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Upload the `.next` folder to your server
3. Set environment variables on your server
4. Run: `npm start`

### Environment Setup for Production
- Set `NODE_ENV=production`
- Use production Supabase project
- Configure production Stripe keys
- Set secure `NEXTAUTH_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core tournament and betting functionality
- **v1.1.0** - Added profile redesign and enhanced settings
- **v1.2.0** - Improved authentication and payment processing

---

<div align="center">
  <p>Made with ❤️ by the BattleBetz Team</p>
  <p>© 2024 BattleBetz. All rights reserved.</p>
</div>
