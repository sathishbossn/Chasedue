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
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase, getCurrentSession, getCurrentUser, signInWithGoogle } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { APP_NAME } from '../../src/constants/BrandConfig';

const { width, height } = Dimensions.get('window');
const isWide = width > 900;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showHardcodedButton, setShowHardcodedButton] = useState(false);
  const router = useRouter();

  // Check for existing session
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setShowHardcodedButton(true);
        }
      } catch (error) {
        console.log('⚠️ No existing session found');
      }
    };
    checkExistingSession();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { data, error } = await signInWithGoogle();

      if (error) {
        Alert.alert('Google Sign-In Failed', (error as any).message || 'Please try again.');
        return;
      }

      if (data?.session) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          Alert.alert('Login Failed', error.message);
          return;
        }

        if (data.session) {
          router.replace('/(tabs)');
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
            },
          },
        });

        if (error) {
          Alert.alert('Sign Up Failed', error.message);
          return;
        }

        Alert.alert(
          'Account Created',
          'Please check your email to verify your account, then sign in.',
          [{ text: 'OK', onPress: () => setIsLogin(true) }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHardcodedLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'sathish@example.com',
        password: 'password123',
      });

      if (error) {
        Alert.alert('Login Failed', error.message);
        return;
      }

      if (data.session) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1557804506-66957127d14f?w=1600&h=900&fit=crop' }}
        className="flex-1"
        blurRadius={2}
      >
        <LinearGradient
          colors={['rgba(217, 119, 87, 0.9)', 'rgba(20, 20, 19, 0.9)']}
          className="flex-1"
        />
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-12">
            <View className="flex-row items-center mb-3">
              <Text className="text-5xl mr-3">🥕</Text>
              <Text className="text-brand-light text-3xl font-bold">
                {APP_NAME}
              </Text>
            </View>
            <Text className="text-white/80 text-center text-base">
              Professional Finance for Modern Founders
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white/95 backdrop-blur-xl rounded-2xl mx-6 p-6 shadow-xl">
            <View className="items-center mb-8">
              <Text className="text-brand-dark text-2xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text className="text-gray-600 text-center text-base">
                {isLogin
                  ? 'Sign in to manage your finances'
                  : 'Start tracking your expenses today'}
              </Text>
            </View>

            {/* Email Input */}
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="mail-outline" size={20} color="#666" className="mr-3" />
              <TextInput
                className="flex-1 text-brand-dark text-base"
                placeholder="Email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="lock-closed-outline" size={20} color="#666" className="mr-3" />
              <TextInput
                className="flex-1 text-brand-dark text-base"
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-[#D97757] py-4 rounded-xl mb-5 ${
                loading ? 'opacity-60' : ''
              }`}
              onPress={handleEmailAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#faf9f5" />
              ) : (
                <Text className="text-[#faf9f5] text-base font-bold text-center">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center gap-3 mb-5">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="text-gray-500 text-sm font-medium">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Google Sign-In */}
            <TouchableOpacity
              className={`flex-row items-center justify-center bg-brand-light py-4 rounded-xl border border-gray-200 mb-5 ${
                googleLoading ? 'opacity-60' : ''
              }`}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <>
                  <View className="w-6 h-6 bg-gray-800 rounded justify-center items-center mr-3">
                    <Text className="text-white text-sm font-bold">G</Text>
                  </View>
                  <Text className="text-brand-dark text-base font-semibold">
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <View className="flex-row items-center justify-center">
              <Text className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text className="text-[#D97757] text-sm font-semibold ml-1">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hardcoded Login Button */}
            {showHardcodedButton && (
              <TouchableOpacity
                className={`bg-[#D97757] py-4 rounded-xl mt-5 ${
                  loading ? 'opacity-60' : ''
                }`}
                onPress={handleHardcodedLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color='#faf9f5' />
                ) : (
                  <Text className="text-[#faf9f5] text-base font-bold text-center">Quick Login (Demo)</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View className="mt-8">
            <Text className="text-gray-400 text-xs text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
