-- CARROTCASH FINAL AUTH FIX - Force Confirm All Users
-- Run this in Supabase SQL Editor to eliminate "unconfirmed user" failures

-- Step 1: Force confirm ALL users with NULL confirmed_at
UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE confirmed_at IS NULL;

-- Step 2: Verify the fix worked
SELECT 
  id,
  email,
  created_at,
  confirmed_at,
  CASE 
    WHEN confirmed_at IS NULL THEN '❌ NOT CONFIRMED'
    ELSE '✅ CONFIRMED'
  END as confirmation_status,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC;

-- Step 3: Clean up old sessions (forces fresh login)
DELETE FROM auth.sessions 
WHERE created_at < NOW() - INTERVAL '2 hours';

-- Step 4: Reset any stuck authentication states
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL AND confirmed_at IS NOT NULL;

-- Step 5: Final verification
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- Expected Results:
-- - confirmation_status should show ✅ CONFIRMED for all users
-- - unconfirmed_users should be 0
-- - confirmed_users should equal total_users
