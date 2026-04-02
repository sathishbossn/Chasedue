// scripts/confirmUser.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

// Supabase URL and service role key from environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function confirmUser(userId) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  if (error) {
    console.error('❌ Failed to confirm user:', error.message);
  } else {
    console.log(`✅ User ${userId} confirmed successfully.`);
  }
}

// The user ID for test7@carrotcash.com from your screenshot
confirmUser('5f3bb8ef-5a2d-44a5-9a72-a7ad3bf88bd3');