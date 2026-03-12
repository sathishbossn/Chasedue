# 🚀 CarrotCash Railway Deployment Checklist

## ✅ Pre-Deployment (Completed)
- [x] `npx expo export` - Build completed successfully
- [x] `dist/` folder created with web build
- [x] `railway.json` configuration added
- [x] `serve` package added for production serving
- [x] Environment variables documented

## 📋 Railway Deployment Steps

### 1. GitHub Repository
- [ ] Push latest changes to GitHub
- [ ] Ensure repository is public or has Railway access

### 2. Railway Setup
- [ ] Go to [Railway Dashboard](https://railway.app)
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select CarrotCash repository
- [ ] Wait for automatic deployment

### 3. Environment Variables
- [ ] Go to Settings → Variables
- [ ] Add `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Add `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Redeploy if needed

### 4. Custom Domain (carrotcash.in)
- [ ] Go to Settings → Domains
- [ ] Add custom domain: `carrotcash.in`
- [ ] Copy DNS records from Railway
- [ ] Update DNS at domain registrar
- [ ] Wait for SSL certificate (5-10 min)

## 🧪 Post-Deployment Testing
- [ ] Visit Railway URL and verify app loads
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test client CRUD operations
- [ ] Verify Supabase connection
- [ ] Test mobile responsiveness

## 🔧 Troubleshooting
- **Build fails**: Check `package.json` and dependencies
- **Supabase errors**: Verify environment variables
- **Domain not working**: Check DNS propagation
- **SSL errors**: Wait longer for certificate provisioning

## 📊 Success Metrics
- [ ] App loads without errors
- [ ] Authentication works end-to-end
- [ ] Client management functions properly
- [ ] Custom domain resolves correctly
- [ ] HTTPS certificate active

---

**Expected Timeline**: 15-30 minutes for full deployment
**Cost**: Railway free tier + domain (~$10/year)
