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
  // ALL HOOKS AT THE ABSOLUTE TOP - React Hook Rules
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // AUTH STATE EFFECT
  useEffect(() => {
    // Check initial session
    const checkInitialSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Initial session check:', session ? 'EXISTS' : 'NULL');
      console.log('📍 Current segments:', segments);
      
      setSession(session);
      setIsLoading(false);
    };

    checkInitialSession();

    // Set up global auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event);
      console.log('📧 Session email:', session?.user?.email || 'NONE');
      console.log('📍 Current segments:', segments);
      
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // NAVIGATION EFFECT - ONLY REDIRECTS BASED ON SESSION STATE
  useEffect(() => {
    if (!session && !isLoading && segments[0] !== '(auth)') {
      console.log('🚀 No session, redirecting to login from:', segments[0]);
      router.replace('/(auth)/login');
    } else if (session && segments[0] === '(auth)') {
      console.log('🚀 User logged in, redirecting to app from auth');
      router.replace('/(app)');
    }
  }, [session, isLoading, segments]);

  // RENDER LOGIC - NO EARLY RETURNS BEFORE HOOKS
  const isInAuthGroup = segments[0] === '(auth)';
  
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

  // MAIN RENDER
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
