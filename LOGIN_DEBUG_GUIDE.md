# 🔍 CarrotCash Login Debug Guide

## ✅ Debug Implementation Complete

### What was added to login.tsx:
```javascript
const handleLogin = async () => {
    console.log('Login attempt:', email);
    
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Supabase response:', { data, error });
    setLoading(false);
    
    if (error) {
      console.log('Login error:', error.message);
      Alert.alert('Login Error', error.message);
      return;
    }
    
    if (data.session) {
      console.log('Session created:', data.session);
      console.log('User logged in:', data.session.user.email);
      router.replace('/(tabs)/dashboard');
    } else {
      console.log('No session created - check email confirmation');
      Alert.alert('Login Issue', 'No session created. Check email confirmation settings.');
    }
  };
```

## 🧪 Testing Steps

### 1. Open Browser
- **URL**: http://localhost:8083
- **Access**: Click the browser preview button or open manually

### 2. Navigate to Login
- Click "Create Account" → then back to Login
- Or go directly to `/(auth)/login`

### 3. Test Login Scenarios

#### Scenario A: Valid Credentials
1. Enter email: `test@example.com`
2. Enter password: `password123`
3. Click "Login"
4. **Expected**: Console logs + redirect to dashboard

#### Scenario B: Invalid Credentials  
1. Enter email: `wrong@email.com`
2. Enter password: `wrongpass`
3. Click "Login"
4. **Expected**: "Invalid login credentials" alert

#### Scenario C: Missing User
1. Enter email: `nonexistent@email.com`
2. Enter any password
3. Click "Login"
4. **Expected**: "Invalid login credentials" alert

## 🔍 Console Debug Output

### Open Browser Console:
- **Chrome**: F12 → Console tab
- **Firefox**: F12 → Console tab
- **Safari**: Develop → Show JavaScript Console

### What to look for:
```
Login attempt: test@example.com
Supabase response: {data: {...}, error: null}
Session created: {...}
User logged in: test@example.com
```

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid login credentials"
- **Cause**: User doesn't exist or wrong password
- **Fix**: Create user first via signup page

### Issue 2: "No session created"
- **Cause**: Email confirmation required
- **Fix**: Check Supabase Auth settings → Disable email confirm

### Issue 3: No redirect after login
- **Cause**: Router not working
- **Fix**: Check console for navigation errors

### Issue 4: Network error
- **Cause**: Supabase connection issue
- **Fix**: Check environment variables

## 📋 Supabase Settings Check

### Email Confirmation:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Project: `idjtdmsdkwupwwxacynt`
3. Authentication → Settings
4. **Toggle OFF**: "Enable email confirmations"

### Test User Creation:
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `test@example.com`
4. Password: `password123`
5. **Skip email confirmation**

## 🎯 Success Indicators

### ✅ Working Login:
- Console shows "Login attempt" and "Session created"
- No error alerts
- Redirects to `/dashboard`
- Dashboard shows user email

### ✅ Working Auth Flow:
- Can login → logout → login again
- Session persists on refresh
- Protected routes work correctly

---

**Ready to test!** Open http://localhost:8083 and check the console for debug output.
