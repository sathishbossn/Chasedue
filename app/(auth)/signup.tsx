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

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: { full_name: fullName.trim() }
        }
      });

      if (error) throw error;

      Alert.alert('Success', 'Check your email to confirm account!');
      router.replace('/(auth)/login');
    } catch (error: any) {
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View style={{ alignItems: 'center', gap: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>CarrotCash</Text>
          <Text style={{ fontSize: 16, color: '#666' }}>Freelancer Management</Text>
          
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={{ borderWidth: 1, padding: 12, borderRadius: 8, width: '100%' }}
          />
          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, padding: 12, borderRadius: 8, width: '100%' }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, padding: 12, borderRadius: 8, width: '100%' }}
          />
          
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#ccc' : '#007AFF', 
              padding: 12, 
              borderRadius: 8, 
              width: '100%',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={{ borderWidth: 1, padding: 12, borderRadius: 8, width: '100%', alignItems: 'center' }}>
              <Text>Already have an account? Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
