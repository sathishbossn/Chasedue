import React, { useState } from 'react';
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
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('🔥 CARROTCASH SIGNUP ATTEMPT');
      console.log('📧 Email:', email.toLowerCase().trim());
      console.log('👤 Name:', fullName.trim());
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: { 
            full_name: fullName.trim(),
            email_confirmed: true  // Prevent future unconfirmed users
          }
        }
      });

      console.log('📊 SIGNUP RESPONSE:', { data, error });

      if (error) throw error;

      console.log('✅ SIGNUP SUCCESS - User created');
      console.log('👤 User ID:', data.user?.id);
      console.log('📧 User Email:', data.user?.email);

      Alert.alert('Success', 'Account created! You can now login.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.log('🚨 SIGNUP ERROR:', error.message);
      Alert.alert('Sign up failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 24,
          paddingTop: 60,
        }}>
          <Text style={{ 
            fontSize: 36, 
            fontWeight: 'bold', 
            color: '#1e293b',
            textAlign: 'center'
          }}>
            Join CarrotCash
          </Text>
          
          <Text style={{ 
            fontSize: 18, 
            color: '#64748b', 
            textAlign: 'center',
            lineHeight: 24
          }}>
            Start tracking expenses{'\n'}Secure your freelance income
          </Text>

          <View style={{ width: '100%', gap: 16 }}>
            <TextInput
              style={{
                borderWidth: 1.5,
                borderColor: '#e2e8f0',
                padding: 18,
                borderRadius: 16,
                fontSize: 16,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCorrect={false}
              editable={!loading}
              placeholderTextColor="#94a3b8"
            />
            
            <TextInput
              style={{
                borderWidth: 1.5,
                borderColor: '#e2e8f0',
                padding: 18,
                borderRadius: 16,
                fontSize: 16,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              placeholderTextColor="#94a3b8"
            />
            
            <TextInput
              style={{
                borderWidth: 1.5,
                borderColor: '#e2e8f0',
                padding: 18,
                borderRadius: 16,
                fontSize: 16,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#10b981',
                padding: 18,
                borderRadius: 16,
                alignItems: 'center',
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={{ 
                color: '#fff', 
                fontSize: 18, 
                fontWeight: '700',
                letterSpacing: 0.5
              }}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#64748b', fontSize: 16 }}>Have account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#3b82f6', fontWeight: '600', fontSize: 16 }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
