// scripts/confirmUser.js
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and service role key (keep this secret!)
const supabaseUrl = 'https://idjtdmsdkwupwwxacynt.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkanRkbXNka3d1cHd3eGFjeW50Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyNDQ2MSwiZXhwIjoyMDg4MDAwNDYxfQ.AlsoO8kLla3XksfufG3aLY0V95A4gC6i2tjUkvnmZjg';

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