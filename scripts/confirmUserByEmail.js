// scripts/confirmUserByEmail.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idjtdmsdkwupwwxacynt.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkanRkbXNka3d1cHd3eGFjeW50Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyNDQ2MSwiZXhwIjoyMDg4MDAwNDYxfQ.AlsoO8kLla3XksfufG3aLY0V95A4gC6i2tjUkvnmZjg';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function confirmUserByEmail(targetEmail) {
  console.log(`🎯 CarrotCash User Confirmation - Target: ${targetEmail}`);
  console.log('================================================');
  
  try {
    // List all users to find the target
    console.log('🔍 Searching for user...');
    
    let page = 1;
    let targetUser = null;
    
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page: page,
        perPage: 100,
      });
      
      if (error) {
        console.error('❌ Error searching for user:', error.message);
        return;
      }
      
      if (!data.users || data.users.length === 0) {
        break;
      }
      
      // Find the target user
      targetUser = data.users.find(u => u.email === targetEmail);
      
      if (targetUser) {
        console.log(`✅ Found user on page ${page}:`);
        console.log(`📧 Email: ${targetUser.email}`);
        console.log(`🆔 ID: ${targetUser.id}`);
        console.log(`📅 Created: ${new Date(targetUser.created_at).toLocaleString()}`);
        console.log(`📊 Current Status: ${targetUser.email_confirmed_at || targetUser.confirmed_at ? '✅ CONFIRMED' : '❌ UNCONFIRMED'}`);
        break;
      }
      
      page++;
      
      // Safety check
      if (page > 50) {
        console.log('⚠️ Safety limit reached, stopping search');
        break;
      }
    }
    
    if (!targetUser) {
      console.log(`❌ User with email '${targetEmail}' not found in the system`);
      return;
    }
    
    // Check if already confirmed
    const isConfirmed = targetUser.email_confirmed_at || targetUser.confirmed_at;
    if (isConfirmed) {
      console.log(`✅ User '${targetEmail}' is already confirmed! No action needed.`);
      return;
    }
    
    // Confirm the user
    console.log(`🔧 Attempting to confirm user: ${targetUser.id}`);
    
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      {
        email_confirm: true,
        user_metadata: {
          confirmed_by: 'admin_script',
          confirmed_at: new Date().toISOString(),
        },
      }
    );
    
    if (updateError) {
      console.error('❌ Failed to confirm user:', updateError.message);
      console.error('🔧 Error details:', JSON.stringify(updateError, null, 2));
      
      // Try alternative method
      console.log('🔄 Trying alternative confirmation method...');
      
      const { error: altError } = await supabase.auth.admin.updateUserById(
        targetUser.id,
        {
          email_confirm: true,
        }
      );
      
      if (altError) {
        console.error('❌ Alternative method also failed:', altError.message);
      } else {
        console.log('✅ Alternative method succeeded!');
        console.log(`🎉 User '${targetEmail}' has been confirmed!`);
      }
    } else {
      console.log('✅ User confirmation successful!');
      console.log(`📊 Updated user data:`, JSON.stringify(updateData, null, 2));
      console.log(`🎉 User '${targetEmail}' has been confirmed!`);
    }
    
    // Verify the confirmation
    console.log('\n🔍 Verifying confirmation...');
    const { data: verifyData } = await supabase.auth.admin.getUserById(targetUser.id);
    
    if (verifyData.user) {
      const isNowConfirmed = verifyData.user.email_confirmed_at || verifyData.user.confirmed_at;
      console.log(`📊 Final Status: ${isNowConfirmed ? '✅ CONFIRMED' : '❌ STILL UNCONFIRMED'}`);
      
      if (isNowConfirmed) {
        console.log(`🚀 User '${targetEmail}' can now log in to CarrotCash!`);
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Execute with target user
const targetEmail = 'test7@carrotcash.com';
confirmUserByEmail(targetEmail);
