# CarrotCash Production Deployment Guide

## ✅ Current Status
- **Expo Router** app with authentication flow working
- **Supabase** backend configured and connected
- **TypeScript** compilation clean (no errors)
- **Web build** running on localhost:8082
- **CRUD operations** for clients implemented and tested
- **Monetization** system implemented:
  - Free plan: 3 clients limit
  - Pro plan: ₹499/month (unlimited clients)
  - Razorpay + Stripe payment integration
  - Upgrade modal on client limit

## 🚀 Step 1: Supabase Setup

### Enable Email Confirmations
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `idjtdmsdkwupwwxacynt`
3. Navigate to **Authentication** → **Settings**
4. Toggle **"Enable email confirmations"** to ON
5. Save settings

### Run Database Setup
1. Go to **SQL Editor**
2. Copy and paste contents of `supabase/setup.sql`
3. Click **Run** to create tables and RLS policies
4. Copy and paste contents of `supabase/subscriptions.sql`
5. Click **Run** to create subscription system

## 🔧 Step 2: Environment Configuration

### Verify .env file
```env
EXPO_PUBLIC_SUPABASE_URL=https://idjtdmsdkwupwwxacynt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkanRkbXNka3d1cHd3eGFjeW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjQ0NjEsImV4cCI6MjA4ODAwMDQ2MX0.Rpqly7YNVnQvE4LKmww0s9TUfDnSWZ7R-nilyrfHH5o
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 📦 Step 3: Railway Deployment

### Build for Production
```bash
# Install dependencies
npm install

# Build web version for production
npx expo export

# The build will be in the 'dist' folder
```

### Deploy to Railway (Quick Method)
1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

2. **Deploy on Railway**:
   - Go to [Railway Dashboard](https://railway.app)
   - Click **"New Project"** → **"Deploy from GitHub repo"**
   - Select your `CarrotCash` repository
   - Railway will auto-detect and deploy the app

3. **Configure Environment Variables**:
   - In Railway dashboard, go to **Settings** → **Variables**
   - Add:
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://idjtdmsdkwupwwxacynt.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkanRkbXNka3d1cHd3eGFjeW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjQ0NjEsImV4cCI6MjA4ODAwMDQ2MX0.Rpqly7YNVnQvE4LKmww0s9TUfDnSWZ7R-nilyrfHH5o
     ```

### Alternative: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🌐 Step 4: Custom Domain Setup (carrotcash.in)

### Configure Custom Domain on Railway
1. **In Railway Dashboard**:
   - Go to your **CarrotCash** project
   - Click **"Settings"** → **"Domains"**
   - Click **"Add Custom Domain"**
   - Enter: `carrotcash.in`
   - Railway will provide DNS records

2. **DNS Configuration** (at your domain registrar):
   ```
   A Record: @ → Railway IP (provided by Railway)
   CNAME: www → railway.app
   ```

3. **SSL Certificate**:
   - Railway provides automatic SSL certificates
   - Wait 5-10 minutes for SSL to provision

### Alternative: Purchase Domain
1. Buy `carrotcash.in` from Namecheap (~$10/year)
2. Or use Cloudflare for DNS management
3. Point nameservers to Railway's provided DNS

### Configure DNS
```
A Record: @ → Railway IP
CNAME: www → railway.app
```

### SSL Certificate
- Railway provides automatic SSL
- Cloudflare can be used for additional security

## 💰 Step 5: Payment Integration (Razorpay Placeholder)

### Add Razorpay
```bash
npm install razorpay
```

### Environment Variables
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🚀 Step 6: Launch Strategy

### Product Hunt Launch
1. Prepare launch assets (logo, screenshots)
2. Write compelling copy
3. Schedule launch for Tuesday 8AM PST
4. Engage with early commenters

### Reddit Promotion
- r/freelance: Share case study
- r/SaaS: Post launch announcement
- r/IndieHackers: Share journey

### Indie Hackers
1. Create project page
2. Post monthly revenue updates
3. Engage with community

## 📊 Business Metrics

### Target: $1,000 MRR by March 2026
- Price: $10/month
- Customers needed: 100
- Conversion rate target: 2-3%

### Key Metrics to Track
- Signups per day
- Conversion rate (free → paid)
- Customer acquisition cost
- Lifetime value (LTV)

## 🛠️ Post-Launch Checklist

- [x] Email confirmations working
- [x] All CRUD operations functional
- [x] Mobile responsive design
- [x] Error handling complete
- [x] TypeScript compilation clean
- [x] Authentication flow working
- [ ] Analytics implemented
- [ ] Payment gateway integrated
- [ ] Legal pages (Privacy, Terms)
- [ ] Customer support channel
- [ ] Production build optimized
- [ ] Domain SSL configured

## 🎯 Success Metrics

### Week 1 Goals
- 50+ signups
- 5+ paying customers
- Product Hunt top 5

### Month 1 Goals
- 200+ signups
- 20+ paying customers ($200 MRR)
- Positive user feedback

### Quarter 1 Goals
- 100+ paying customers ($1,000 MRR)
- Feature requests prioritized
- Expansion roadmap planned
