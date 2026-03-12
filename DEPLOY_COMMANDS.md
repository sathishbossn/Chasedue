# 🚀 CarrotCash Deploy Commands

## 📦 Build & Export
```bash
# Install dependencies
npm install

# Build for production
npx expo export

# Start local development
npm start
# URL: http://localhost:8081
```

## 🚀 Railway Deployment
```bash
# Git commands
git add .
git commit -m "CarrotCash MVP - Launch Ready"
git push origin main

# Railway CLI (alternative)
npm install -g @railway/cli
railway login
railway init
railway up
```

## 🔧 Environment Variables (Railway)
```bash
EXPO_PUBLIC_SUPABASE_URL=https://idjtdmsdkwupwwxacynt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourTestKey
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YourStripeKey
```

## 🗄️ Supabase Setup
```bash
# Run in Supabase SQL Editor
# 1. supabase/setup.sql (clients table)
# 2. supabase/subscriptions.sql (subscriptions table)

# Verify settings
# Auth → Settings → "Enable email confirmations" = OFF
```

## 🌐 Domain Setup (carrotcash.in)
```bash
# DNS Records
A Record: @ → Railway IP
CNAME: www → railway.app

# SSL Certificate (automatic via Railway)
```

## 🧪 Testing Commands
```bash
# Test local build
npx serve dist -l 3000
# URL: http://localhost:3000

# Test production build
npm run build
npm run serve
```

## 📊 Status Check
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Check build size
ls -la dist/

# Check running processes
netstat -an | findstr 8081
```

---

**Ready to deploy!** 🥕
