-- Fix confirmed_at NULL for existing users
-- Run this in Supabase SQL Editor to fix login issues

UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE confirmed_at IS NULL;

-- Verify the fix
SELECT 
  id, 
  email, 
  created_at, 
  confirmed_at,
  CASE 
    WHEN confirmed_at IS NULL THEN 'NOT CONFIRMED'
    ELSE 'CONFIRMED'
  END as status
FROM auth.users 
ORDER BY created_at DESC;

-- Alternative: Update specific users by email
UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE email IN (
  'test@example.com',
  'demo@carrotcash.com'
  -- Add more test emails here
) AND confirmed_at IS NULL;
