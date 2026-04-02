import React, { useState, useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Lora_400Regular } from '@expo-google-fonts/lora';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { AuthProvider } from '@/context/AuthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { APP_NAME } from '../src/constants/BrandConfig';

import '../global.css';

export default function RootLayout() {
  // Font Loading using expo-font's built-in Google Fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Lora_400Regular,
  });

  // ALL HOOKS AT THE ABSOLUTE TOP - React Hook Rules
  const router = useRouter();
  const segments = useSegments();
  
  // Web compatibility safeguard for Linking
  const url = typeof Linking !== 'undefined' ? Linking.useURL() : null;
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isVerifyingSession, setIsVerifyingSession] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Refs to prevent re-subscription loops
  const segmentsRef = useRef(segments);
  const urlRef = useRef(url);
  const isLoadingRef = useRef(isLoading);
  const isVerifyingRef = useRef(isVerifyingSession);

  // Update refs when values change
  useEffect(() => { segmentsRef.current = segments; }, [segments]);
  useEffect(() => { urlRef.current = url; }, [url]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { isVerifyingRef.current = isVerifyingSession; }, [isVerifyingSession]);

  // CONSOLIDATED AUTH EFFECT - Single useEffect to prevent race conditions
  useEffect(() => {
    let isMounted = true;
    let redirectTimeout: NodeJS.Timeout | null = null;
    
    // Initialize auth state
    const initializeAuth = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      
      try {
        // Check initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('🔍 Initial session check:', initialSession ? 'EXISTS' : 'NULL');
        
        if (isMounted) {
          setSession(initialSession);
          
          // Handle initial navigation based on session
          if (initialSession) {
            // User has session, redirect to dashboard if on auth/landing
            if (segmentsRef.current[0] === '(auth)' || segmentsRef.current[0] === 'landing') {
              console.log('🚀 User has session, redirecting to dashboard');
              redirectTimeout = setTimeout(() => {
                if (isMounted) router.replace('/(tabs)');
              }, 100);
            }
          } else {
            // No session, redirect to landing if not on auth/landing
            if (segmentsRef.current[0] !== '(auth)' && segmentsRef.current[0] !== 'landing') {
              console.log('🚀 No session, redirecting to landing');
              redirectTimeout = setTimeout(() => {
                if (isMounted) router.replace('/landing');
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Handle deep linking (OAuth callbacks)
    const handleDeepLink = async () => {
      if (!urlRef.current || typeof urlRef.current !== 'string' || typeof window === 'undefined') {
        return;
      }
      
      console.log('🔗 Deep link URL received:', urlRef.current);
      
      // Check if this is a Supabase OAuth callback
      if (urlRef.current.includes('access_token') || urlRef.current.includes('refresh_token')) {
        console.log('🔐 Supabase OAuth callback detected, verifying session...');
        setIsVerifyingSession(true);
        
        try {
          // Extract tokens from URL
          const urlParams = new URLSearchParams(urlRef.current.split('#')[1] || urlRef.current.split('?')[1] || '');
          const accessToken = urlParams.get('access_token');
          const refreshToken = urlParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log('🎯 Tokens found, setting session...');
            
            // Set the session with the tokens from URL
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error('❌ Session setting error:', error);
              throw error;
            }
            
            console.log('✅ Session set successfully');
            if (isMounted) {
              setSession(data.session);
              setIsVerifyingSession(false);
              
              // Redirect to dashboard
              redirectTimeout = setTimeout(() => {
                if (isMounted) router.replace('/(tabs)');
              }, 100);
            }
          } else {
            console.error('❌ No tokens found in URL');
            throw new Error('No tokens found in callback URL');
          }
        } catch (error) {
          console.error('❌ Deep link handling error:', error);
          Alert.alert('Error', 'Failed to complete sign-in. Please try again.');
          if (isMounted) {
            setIsVerifyingSession(false);
            router.replace('/(auth)/login');
          }
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        setSession(session);
        setIsLoading(false);
        setIsVerifyingSession(false);
        
        // Redirect to dashboard
        redirectTimeout = setTimeout(() => {
          if (isMounted) router.replace('/(tabs)');
        }, 100);
        
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsLoading(false);
        
        // Redirect to landing
        redirectTimeout = setTimeout(() => {
          if (isMounted) router.replace('/landing');
        }, 100);
        
      } else if (session) {
        setSession(session);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
    
    // Initialize everything
    initializeAuth();
    handleDeepLink();
    
    // Cleanup
    return () => {
      isMounted = false;
      if (redirectTimeout) clearTimeout(redirectTimeout);
      subscription.unsubscribe();
    };
  }, []); // Run once on mount only

  // 5-second fallback timeout to prevent infinite loading
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (isLoadingRef.current || isVerifyingRef.current) {
        setIsLoading(false);
        setIsVerifyingSession(false);
        router.replace('/(auth)/login');
      }
    }, 5000);

    return () => clearTimeout(fallbackTimeout);
  }, []); // Run once on mount only

  // RENDER LOGIC - NO EARLY RETURNS BEFORE HOOKS
  const isInAuthGroup = segments[0] === '(auth)';
  
  // CRITICAL: Safety check - return simple view if fonts aren't loaded
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-[#141413] justify-center items-center">
          <ActivityIndicator size="large" color="#D97757" />
        </View>
      </SafeAreaProvider>
    );
  }
  
  if (isLoading || isVerifyingSession) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-brand-dark">
          <ActivityIndicator 
            size="large" 
            color="#d97757" // Brand Primary Orange
            className="mb-5"
          />
          <Text className="text-brand-light text-base font-semibold text-center px-5 mb-5">
            {isVerifyingSession ? 'Verifying your session...' : `Loading ${APP_NAME}...`}
          </Text>
          
          {/* Manual entry button for users with session but no redirect */}
          {showManualEntry && (
            <TouchableOpacity
              className="bg-brand-primary px-6 py-3 rounded-lg mt-5 shadow-lg"
              onPress={() => {
                console.log('🚀 Manual entry button pressed');
                router.replace('/(tabs)');
              }}
            >
              <Text className="text-brand-light text-base font-semibold">
                Enter Dashboard
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  // MAIN RENDER
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <Stack>
            <Stack.Screen name="landing" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="invoice" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
