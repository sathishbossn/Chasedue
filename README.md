# CarrotCash - Freelancer SaaS MVP

A React Native freelancer management app built with Expo Router and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase project

### Setup

1. **Clone and install**
```bash
git clone <your-repo>
cd CarrotCash
npm install
```

2. **Environment variables**
Create `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Database setup**
Run these SQL files in Supabase Dashboard > SQL Editor:
- `supabase/profiles.sql` - User profiles with RLS
- `supabase/clients.sql` - Client management with RLS

4. **Start development**
```bash
npx expo start --clear
```

## 📱 Features

### ✅ Completed (MVP)
- **Authentication**: Login/Register with Supabase
- **Dashboard**: Welcome screen with navigation
- **Client Management**: Full CRUD operations
- **Profile System**: User profiles with RLS
- **Responsive Design**: Mobile-first with inline styles

### 🚧 Coming Soon
- Invoice generation & tracking
- WhatsApp integration
- Payment processing
- Analytics dashboard

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native + Expo Router
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Inline styles (no StyleSheet)
- **Navigation**: Expo Router Stack + Tabs

### Project Structure
```
app/
├── (auth)/          # Authentication screens
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/          # Main app tabs
│   ├── dashboard.tsx
│   ├── clients.tsx
│   └── invoices.tsx
└── _layout.tsx      # Root layout with Stack

lib/
└── supabase.ts      # Supabase client

context/
└── AuthContext.tsx  # Authentication state

supabase/
├── profiles.sql     # User profiles schema
└── clients.sql      # Client management schema
```

## 🚀 Deployment

### Supabase Setup
1. Create new project at [supabase.com](https://supabase.com)
2. Run SQL files in order: `profiles.sql` → `clients.sql`
3. Copy URL and anon key to `.env`

### Railway (Web Build)
1. Build for web:
```bash
npx expo build:web
```

2. Deploy `dist` folder to Railway
3. Set environment variables in Railway dashboard

### Mobile App Store
- Use Expo Application Services (EAS) for builds
- Configure `app.json` for production
- Submit to Apple App Store / Google Play

## 💰 Business Model

Target: **$1,000 MRR** MVP
- $10/month subscription
- 100 paying freelancers
- Focus on simple client management + invoicing

## 🛠️ Development

### Key Commands
```bash
# Start development server
npx expo start --clear

# Run on device/simulator
npx expo start --ios
npx expo start --android

# Build for production
npx expo build:web
npx expo build:android
npx expo build:ios
```

### Path Aliases
- `@/` → root directory
- Used for imports: `@/lib/supabase`, `@/context/AuthContext`

## 📄 License

MIT License - feel free to use for your own projects!
