// scripts/createFinalTestUser.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idjtdmsdkwupwwxacynt.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkanRkbXNka3d1cHd3eGFjeW50Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyNDQ2MSwiZXhwIjoyMDg4MDAwNDYxfQ.AlsoO8kLla3XksfufG3aLY0V95A4gC6i2tjUkvnmZjg';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function createFinalTestUser() {
  console.log('🔧 Creating Final Test User: final_test@carrotcash.com');
  console.log('====================================================');
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'final_test@carrotcash.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        created_by: 'senior_expo_agent',
        auto_confirmed: true,
        full_name: 'Final Test User',
      },
    });

    if (error) {
      console.error('❌ Failed to create user:', error.message);
      
      if (error.message.includes('already registered')) {
        console.log('ℹ️ User already exists, confirming...');
        
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => u.email === 'final_test@carrotcash.com');
        
        if (existingUser) {
          const { error: confirmError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { email_confirm: true }
          );
          
          if (confirmError) {
            console.error('❌ Failed to confirm existing user:', confirmError.message);
          } else {
            console.log('✅ Existing user confirmed!');
          }
        }
      }
      return;
    }

    console.log('✅ Final test user created successfully!');
    console.log(`📧 Email: final_test@carrotcash.com`);
    console.log(`🔑 Password: password123`);
    console.log(`🆔 User ID: ${data.user.id}`);
    console.log(`📊 Confirmation Status: ✅ CONFIRMED`);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

console.log('🚀 Creating Final Test User for CarrotCash');
createFinalTestUser();
