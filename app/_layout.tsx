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
  const [isRedirecting, setIsRedirecting] = useState(false);

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
      
      // Only set session to null if explicitly signed out
      if (event === 'SIGNED_OUT') {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
      // Don't set session to null for other events (TOKEN_REFRESHED, etc.)
    });

    return () => subscription.unsubscribe();
  }, []);

  // NAVIGATION EFFECT WITH GUARD TO PREVENT LOCK BROKEN
  useEffect(() => {
    // Don't redirect while loading or if already redirecting
    if (isLoading || isRedirecting) return;
    
    const redirect = async () => {
      setIsRedirecting(true);
      
      // Only redirect if auth state has actually changed
      if (!session && segments[0] !== '(auth)') {
        console.log('🚀 No session, redirecting to login from:', segments[0]);
        await router.replace('/(auth)/login');
      } else if (session && segments[0] === '(auth)') {
        console.log('🚀 User logged in, redirecting to app from auth');
        await router.replace('/(app)');
      }
      
      // Small delay to prevent rapid redirects
      setTimeout(() => setIsRedirecting(false), 500);
    };
    
    redirect();
  }, [session, segments, isLoading, isRedirecting]);

  // RENDER LOGIC - NO EARLY RETURNS BEFORE HOOKS
  const isInAuthGroup = segments[0] === '(auth)';
  
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
