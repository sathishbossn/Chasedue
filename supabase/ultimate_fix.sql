-- ULTIMATE CARROTCASH LOGIN FIX
-- Run this EXACT script in Supabase SQL Editor

-- Step 1: Fix all NULL confirmed_at users
UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE confirmed_at IS NULL;

-- Step 2: Verify the fix
SELECT 
  email, 
  created_at, 
  confirmed_at,
  CASE 
    WHEN confirmed_at IS NULL THEN '❌ NOT CONFIRMED'
    ELSE '✅ CONFIRMED'
  END as status
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 3: Reset any problematic sessions
-- This forces users to login fresh
DELETE FROM auth.sessions WHERE created_at < NOW() - INTERVAL '1 hour';

-- Step 4: Check if user exists for testing
SELECT COUNT(*) as user_count FROM auth.users WHERE email LIKE '%@%';

-- Expected Results:
-- - All confirmed_at fields should be populated
-- - Status should show ✅ CONFIRMED for all users
-- - User count should be > 0
