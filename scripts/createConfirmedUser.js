// scripts/createConfirmedUser.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idjtdmsdkwupwwxacynt.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkanRkbXNka3d1cHd3eGFjeW50Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyNDQ2MSwiZXhwIjoyMDg4MDAwNDYxfQ.AlsoO8kLla3XksfufG3aLY0V95A4gC6i2tjUkvnmZjg';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function createConfirmedUser(email, password) {
  console.log(`🔧 CarrotCash User Creation - Creating: ${email}`);
  console.log('==========================================');
  
  try {
    // First, create the user with admin API
    console.log('📝 Creating user account...');
    
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirm email during creation
      user_metadata: {
        created_by: 'admin_script',
        created_at: new Date().toISOString(),
        auto_confirmed: true,
      },
      app_metadata: {
        provider: 'email',
        role: 'authenticated',
      },
    });
    
    if (createError) {
      console.error('❌ Failed to create user:', createError.message);
      console.error('🔧 Error details:', JSON.stringify(createError, null, 2));
      
      // Check if user already exists
      if (createError.message.includes('already registered')) {
        console.log('ℹ️ User might already exist, trying to confirm existing user...');
        
        // Try to find and confirm existing user
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => u.email === email);
        
        if (existingUser) {
          console.log(`📧 Found existing user: ${existingUser.id}`);
          
          const { error: confirmError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { email_confirm: true }
          );
          
          if (confirmError) {
            console.error('❌ Failed to confirm existing user:', confirmError.message);
          } else {
            console.log(`✅ Existing user '${email}' has been confirmed!`);
          }
        }
      }
      return;
    }
    
    console.log('✅ User created successfully!');
    console.log(`📊 User ID: ${createData.user.id}`);
    console.log(`📧 Email: ${createData.user.email}`);
    console.log(`📅 Created: ${new Date(createData.user.created_at).toLocaleString()}`);
    
    // Verify the user was created with confirmation
    console.log('\n🔍 Verifying user creation...');
    
    const { data: verifyData, error: verifyError } = await supabase.auth.admin.getUserById(createData.user.id);
    
    if (verifyError) {
      console.error('❌ Failed to verify user:', verifyError.message);
      return;
    }
    
    if (verifyData.user) {
      const isConfirmed = verifyData.user.email_confirmed_at || verifyData.user.confirmed_at;
      console.log(`📊 Confirmation Status: ${isConfirmed ? '✅ CONFIRMED' : '❌ UNCONFIRMED'}`);
      
      if (isConfirmed) {
        console.log(`🎉 User '${email}' is ready to use CarrotCash!`);
        console.log(`🔑 Login Credentials:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`🌐 Login URL: http://localhost:8082/(auth)/login`);
      } else {
        console.log(`⚠️ User created but not confirmed. Manual confirmation needed.`);
      }
    }
    
    // Test login with the new user (optional)
    console.log('\n🧪 Testing login with new user...');
    
    try {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (loginError) {
        console.error('❌ Login test failed:', loginError.message);
      } else {
        console.log('✅ Login test successful!');
        console.log(`📊 Session created for: ${loginData.user?.email}`);
        
        // Sign out to clean up
        await supabase.auth.signOut();
        console.log('🔒 Signed out after test');
      }
    } catch (loginTestError) {
      console.error('💥 Login test error:', loginTestError.message);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Create test8@carrotcash.com with confirmed status
const newUserEmail = 'test8@carrotcash.com';
const newUserPassword = 'password123';

console.log('🚀 Starting CarrotCash User Creation Process');
createConfirmedUser(newUserEmail, newUserPassword);
