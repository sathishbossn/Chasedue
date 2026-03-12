# CarrotCash Deployment Guide

## 🚀 Production Deployment

### Supabase Setup (Required)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Choose region closest to your users

2. **Run Database Migrations**
   - Open Supabase Dashboard → SQL Editor
   - Execute `supabase/profiles.sql`
   - Execute `supabase/clients.sql`

3. **Environment Variables**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Railway (Web Deployment)

1. **Build Web Version**
   ```bash
   npx expo build:web
   ```

2. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and deploy
   railway login
   railway init
   railway up
   ```

3. **Configure Railway**
   - Set environment variables in dashboard
   - Enable automatic deployments
   - Configure custom domain

### Mobile App Stores

#### Using EAS (Expo Application Services)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "CarrotCash",
       "slug": "carrot-cash",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "platforms": ["ios", "android"],
       "ios": {
         "bundleIdentifier": "com.yourcompany.carrotcash",
         "buildNumber": "1.0.0"
       },
       "android": {
         "package": "com.yourcompany.carrotcash",
         "versionCode": 1
       }
     }
   }
   ```

3. **Build for Production**
   ```bash
   # iOS build
   eas build --platform ios

   # Android build
   eas build --platform android
   ```

4. **Submit to Stores**
   ```bash
   # Submit to App Store
   eas submit --platform ios

   # Submit to Google Play
   eas submit --platform android
   ```

## 🔧 Environment Configuration

### Development
```bash
# Local development
npx expo start --clear
```

### Staging
```bash
# Test build
npx expo build:web --mode production
```

### Production
```bash
# Production build
npx expo build:web --mode production
```

## 📊 Monitoring & Analytics

### Supabase Monitoring
- Dashboard shows database usage
- Auth metrics and user activity
- Real-time subscription limits

### Railway Monitoring
- Application metrics
- Error tracking
- Performance monitoring

### Mobile Analytics (Optional)
- Add Firebase Analytics
- Implement crash reporting
- Track user engagement

## 🔒 Security Checklist

### Supabase RLS Policies
- ✅ Profiles table: Users can only access own data
- ✅ Clients table: Freelancers can only manage own clients
- ✅ Auth policies properly configured

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly

### API Security
- ✅ Supabase Row Level Security enabled
- ✅ No direct database access from client
- ✅ Proper error handling without data leakage

## 🚀 Performance Optimization

### Web Build
- Enable gzip compression
- Use CDN for static assets
- Implement proper caching

### Mobile Build
- Optimize bundle size
- Use lazy loading for screens
- Implement offline support

### Database
- Add indexes for frequently queried columns
- Optimize RLS policies
- Monitor query performance

## 📱 Testing

### Before Deployment
```bash
# Run tests
npm test

# Check build
npx expo build:web --mode production

# Test on devices
npx expo start --ios
npx expo start --android
```

### Production Checklist
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Build process successful
- [ ] Test on real devices
- [ ] Performance acceptable
- [ ] Security measures in place

## 🆘 Troubleshooting

### Common Issues
1. **Blank screen**: Check navigation setup
2. **Auth errors**: Verify Supabase URL/keys
3. **Build failures**: Check dependencies
4. **Database errors**: Verify RLS policies

### Debug Commands
```bash
# Clear cache
npx expo start --clear

# Reset project
expo install --fix

# Check logs
npx expo start --tunnel
```
