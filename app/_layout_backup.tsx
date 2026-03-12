import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

import '../global.css';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';

export default function RootLayout() {
  // 1. DEFINE ALL HOOKS AT THE VERY TOP (React Hook Rules)
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // 2. DEFINE AUTH LISTENER EFFECT (First effect)
  useEffect(() => {
    // Check initial session
    const checkInitialSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Initial session check:', session ? 'EXISTS' : 'NULL');
      console.log('📍 Current segments:', segments);
      
      setSession(session);
      
      // FIXED REDIRECT LOGIC: Only redirect if not loading, no session, and not in auth group
      if (!isLoading && !session && segments[0] !== '(auth)') {
        console.log('🚀 Redirecting to login from:', segments[0]);
        router.replace('/(auth)/login');
      } else if (session) {
        console.log('👤 User logged in:', session.user.email);
        // VALIDATED PATH: Redirect to valid file '/(app)/index'
        if (segments[0] !== '(tabs)' && segments[0] !== '(app)') {
          console.log('🚀 Redirecting to client management from:', segments[0]);
          router.replace('/(app)');
        }
      } else {
        console.log('✅ User in auth group or loading - no redirect needed');
      }
      
      setIsLoading(false);
    };

    checkInitialSession();

    // Set up global auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event);
      console.log('📧 Session email:', session?.user?.email || 'NONE');
      console.log('📍 Current segments:', segments);
      
      setSession(session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in - redirecting to client management');
        router.replace('/(app)');
      } else if (event === 'SIGNED_OUT' || !session) {
        console.log('🔓 User signed out - checking route');
        // Only redirect to login if not already in auth group
        if (segments[0] !== '(auth)') {
          console.log('🚀 Redirecting to login');
          router.replace('/(auth)/login');
        } else {
          console.log('✅ User already in auth group - no redirect needed');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [session, isLoading]); // FIXED: Depend ONLY on session and isLoading

  // 3. DEFINE NAVIGATION EFFECT (Second effect - if needed)
  // No additional navigation effect needed as it's handled in the auth listener

  // 4. CONDITIONAL LOGIC CHECK - ONLY AT THE BOTTOM
  // CRITICAL FIX: Prevent re-mounting when user is in auth group
  if (segments[0] === '(auth)') {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </SubscriptionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    );
  }

  // 5. LOADING CHECK - ONLY AFTER ALL HOOKS
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </SubscriptionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    );
  }

  // 6. FINAL RETURN - ONLY AFTER ALL LOGIC
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}


