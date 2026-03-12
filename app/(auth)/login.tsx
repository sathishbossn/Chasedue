import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase, getCurrentSession, getCurrentUser } from '@/lib/supabase';

export default function Login() {
  console.log('🔥 LOGIN COMPONENT LOADING!');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🚀 AUTO-SETUP: Runs once when the login screen loads
  useEffect(() => {
    const autoSetupAdmin = async () => {
      try {
        console.log('🤖 Auto-setup: Creating admin user...');
        const { data, error } = await supabase.auth.signUp({
          email: 'admin@carrotcash.com',
          password: 'password123',
          options: {
            data: { name: 'Admin User' }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            console.log('✅ Admin already exists - you\'re good to go!');
          } else {
            console.log('⚠️ Auto-setup error:', error.message);
          }
        } else {
          console.log('✅ Admin user created successfully!');
          if (data.session) {
            console.log('🔓 Auto-logged in! Redirecting...');
            router.replace('/(app)');
          } else {
            console.log('📧 Email confirmation required. Please check email or disable email confirm in Supabase.');
            Alert.alert(
              'Action Required',
              'Admin account created but email confirmation is ON.\n\nGo to Supabase Dashboard → Authentication → Providers → Email and uncheck "Confirm email", then try logging in.',
              [{ text: 'OK' }]
            );
          }
        }
      } catch (e) {
        console.log('❌ Auto-setup failed:', e);
      }
    };

    autoSetupAdmin();
  }, []); // Empty dependency array = runs only once

  const handleLogin = async () => {
    console.log('🔥 CARROTCASH LOGIN ATTEMPT');
    console.log('📧 Email:', email);
    console.log('🔑 Password length:', password.length);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🌐 Calling supabase.auth.signInWithPassword...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      console.log('📊 SUPABASE RESPONSE:');
      console.log('📦 Data object:', JSON.stringify(data, null, 2));
      console.log('❌ Error object:', error);
      
      if (error) {
        console.log('🚨 LOGIN ERROR CODE:', error.status);
        console.log('🚨 LOGIN ERROR MESSAGE:', error.message);
        Alert.alert('Login Error', error.message, [{ text: 'OK' }]);
        return;
      }
      
      if (data.session) {
        console.log('✅ SESSION CREATED SUCCESSFULLY!');
        console.log('👤 User ID:', data.session.user.id);
        console.log('📧 User Email:', data.session.user.email);
        console.log('🆔 Access Token:', data.session.access_token ? 'VALID' : 'INVALID');
        console.log('⏰ Expires At:', new Date(data.session.expires_at! * 1000));
        console.log('🔐 Refresh Token:', data.session.refresh_token ? 'VALID' : 'INVALID');
        
        console.log('🔍 DEBUG - Full User Object:', JSON.stringify(data.session.user, null, 2));
        
        if (data.session.user.identities && data.session.user.identities.length === 0) {
          console.log('⚠️ WARNING: User identities array is empty - this may cause auth issues');
        } else if (data.session.user.identities) {
          console.log('✅ User identities found:', data.session.user.identities.length);
        } else {
          console.log('⚠️ WARNING: User identities property is missing');
        }
        
        const currentSession = await getCurrentSession();
        console.log('🔍 Current session check:', currentSession ? 'PERSISTED' : 'NOT PERSISTED');
        
        Alert.alert(
          'Success', 
          'Login successful! Redirecting to dashboard...', 
          [{ text: 'OK' }]
        );
        
        console.log('🚀 IMMEDIATE REDIRECT TO DASHBOARD...');
        router.replace('/(app)');
        
      } else {
        console.log('❌ NO SESSION CREATED');
        console.log('🔍 Data received:', JSON.stringify(data, null, 2));
        
        const currentUser = await getCurrentUser();
        console.log('👥 Current user check:', currentUser);
        
        if (currentUser) {
          console.log('🔍 DEBUG - Current User Object:', JSON.stringify(currentUser, null, 2));
          if (currentUser.identities && currentUser.identities.length === 0) {
            console.log('⚠️ WARNING: Current user has empty identities - this is likely the auth issue');
          }
        }
        
        Alert.alert(
          'Login Failed', 
          'No session created. Please check:\n\n1. Email is confirmed\n2. Password is correct\n3. Account is active', 
          [{ text: 'OK' }]
        );
      }
      
    } catch (err) {
      console.log('💥 CATCH ERROR:', err);
      Alert.alert('Unexpected Error', 'Please try again or contact support');
    } finally {
      setLoading(false);
      console.log('🏁 LOGIN ATTEMPT FINISHED');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View style={{ alignItems: 'center', gap: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>🥕 CarrotCash</Text>
          <Text style={{ fontSize: 16, color: '#666' }}>Freelancer Management System</Text>
          
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            style={{ 
              borderWidth: 1, 
              padding: 12, 
              borderRadius: 8, 
              width: '100%',
              backgroundColor: '#f9f9f9',
              fontSize: 16
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ 
              borderWidth: 1, 
              padding: 12, 
              borderRadius: 8, 
              width: '100%',
              backgroundColor: '#f9f9f9',
              fontSize: 16
            }}
            autoComplete="password"
          />
          
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#ccc' : '#007AFF', 
              padding: 16, 
              borderRadius: 8, 
              width: '100%',
              opacity: loading ? 0.7 : 1,
              elevation: loading ? 0 : 2,
              shadowOpacity: loading ? 0 : 0.2
            }}
          >
            <Text style={{ 
              color: 'white', 
              textAlign: 'center', 
              fontSize: 16, 
              fontWeight: '600' 
            }}>
              {loading ? '🔄 Authenticating...' : '🚀 Login to CarrotCash'}
            </Text>
          </TouchableOpacity>
          
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: '500' }}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </Link>
          
          <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f8ff', borderRadius: 8 }}>
            <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
              🔍 Open Console (F12) for detailed login logs
            </Text>
            <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 5 }}>
              📧 Test: admin@carrotcash.com / password123
            </Text>
            <Text style={{ fontSize: 10, color: '#999', textAlign: 'center', marginTop: 5 }}>
              🔧 Supabase URL: {process.env.EXPO_PUBLIC_SUPABASE_URL}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}