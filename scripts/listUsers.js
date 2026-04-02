// scripts/listUsers.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function listAllUsers() {
  console.log('🔍 CarrotCash User Audit - Listing All Users');
  console.log('==========================================');
  
  let page = 1;
  let totalUsers = 0;
  let confirmedUsers = 0;
  let unconfirmedUsers = 0;
  
  try {
    while (true) {
      console.log(`📄 Fetching page ${page}...`);
      
      const { data, error } = await supabase.auth.admin.listUsers({
        page: page,
        perPage: 100,
      });
      
      if (error) {
        console.error('❌ Error fetching users:', error.message);
        break;
      }
      
      if (!data.users || data.users.length === 0) {
        console.log('✅ No more users found');
        break;
      }
      
      console.log(`\n📋 Page ${page} - ${data.users.length} users:`);
      console.log('─'.repeat(80));
      
      data.users.forEach((user, index) => {
        const isConfirmed = user.email_confirmed_at || user.confirmed_at;
        const status = isConfirmed ? '✅ CONFIRMED' : '❌ UNCONFIRMED';
        const createdDate = new Date(user.created_at).toLocaleDateString();
        
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Status: ${status}`);
        console.log(`   Created: ${createdDate}`);
        console.log(`   Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}`);
        console.log('');
        
        if (isConfirmed) {
          confirmedUsers++;
        } else {
          unconfirmedUsers++;
        }
      });
      
      totalUsers += data.users.length;
      page++;
      
      // Safety check to prevent infinite loops
      if (page > 50) {
        console.log('⚠️ Safety limit reached, stopping pagination');
        break;
      }
    }
    
    console.log('\n📊 SUMMARY:');
    console.log('─'.repeat(40));
    console.log(`Total Users: ${totalUsers}`);
    console.log(`✅ Confirmed Users: ${confirmedUsers}`);
    console.log(`❌ Unconfirmed Users: ${unconfirmedUsers}`);
    console.log(`📈 Confirmation Rate: ${totalUsers > 0 ? ((confirmedUsers / totalUsers) * 100).toFixed(1) : 0}%`);
    
    // List unconfirmed users for easy reference
    if (unconfirmedUsers > 0) {
      console.log('\n⚠️ UNCONFIRMED USERS (need confirmation):');
      console.log('─'.repeat(50));
      
      page = 1;
      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({
          page: page,
          perPage: 100,
        });
        
        if (error || !data.users || data.users.length === 0) break;
        
        data.users.forEach(user => {
          const isConfirmed = user.email_confirmed_at || user.confirmed_at;
          if (!isConfirmed) {
            console.log(`📧 ${user.email} (ID: ${user.id})`);
          }
        });
        
        page++;
        if (page > 50) break;
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

console.log('🚀 Starting CarrotCash User Audit');
listAllUsers();
