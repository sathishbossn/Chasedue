import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export const getValidSession = async () => {
  // First try to refresh the session forcefully
  const { data: refreshData, error: refreshError } = 
    await supabase.auth.refreshSession()
  
  if (!refreshError && refreshData.session) {
    return refreshData.session
  }

  // Fallback to getSession
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    console.error('No valid session:', error)
    return null
  }

  return session
}
