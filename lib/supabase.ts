import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// CRITICAL: Client initialized OUTSIDE any component to prevent re-initialization
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://idjtdmsdkwupwwxacynt.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkanRkbXNka3d1cHd3eGFjeW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjQ0NjEsImV4cCI6MjA4ODAwMDQ2MX0.Rpqly7YNVnQvE4LKmww0s9TUfDnSWZ7R-nilyrfHH5o';

// Verify environment variables are loaded (only once)
console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Anon Key:', supabaseAnonKey ? 'LOADED' : 'MISSING');

// OPTIMIZED: Single Supabase instance with enhanced AsyncStorage configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInTabs: true, // PREVENT LOCK BROKEN ERRORS
    detectSessionInUrl: false,
  },
});

// CACHED session helpers to prevent repeated calls
let cachedSession: any = null;
let lastSessionCheck = 0;
const CACHE_DURATION = 5000; // 5 seconds

export const getCurrentSession = async () => {
  try {
    const now = Date.now();
    
    // Return cached session if recent
    if (cachedSession && (now - lastSessionCheck) < CACHE_DURATION) {
      console.log('🔍 getCurrentSession: CACHED result:', cachedSession ? 'EXISTS' : 'NULL');
      return cachedSession;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔍 getCurrentSession: FRESH result:', session ? 'EXISTS' : 'NULL');
    
    // Cache the result
    cachedSession = session;
    lastSessionCheck = now;
    
    return session;
  } catch (error) {
    console.log('❌ getCurrentSession error:', error);
    cachedSession = null;
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 getCurrentUser result:', user ? 'EXISTS' : 'NULL');
    return user;
  } catch (error) {
    console.log('❌ getCurrentUser error:', error);
    return null;
  }
};
