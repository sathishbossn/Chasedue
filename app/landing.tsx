import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Hero from '../components/HeroNative';
import Features from '../components/FeaturesNative';
import { APP_NAME } from '../src/constants/BrandConfig';

const { width } = Dimensions.get('window');
const isWide = width > 900;

const PRIMARY = '#FF006E';
const DARK = '#0D0D0D';

export default function LandingPage() {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const bg = isDark ? '#0D0D0D' : '#FFFFFF';
  const bg2 = isDark ? '#1A1A1A' : '#F5F5F5';
  const textPrimary = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#AAAAAA' : '#666666';
  const cardBg = isDark ? '#1A1A1A' : '#F9F9F9';
  const cardBorder = isDark ? '#2A2A2A' : '#EEEEEE';

  const handleGetStarted = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { signInWithGoogle } = await import('@/lib/supabase');
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (authMode === 'signup' && !fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail, password: cleanPassword,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;
        Alert.alert('Account Created', 'Check your email to confirm your account.');
        setAuthMode('login');
        setEmail(''); setPassword(''); setFullName('');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* NAV */}
        <View style={{ backgroundColor: bg, borderBottomWidth: 1, borderBottomColor: cardBorder, paddingHorizontal: 40, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: textPrimary }}>🥕 {APP_NAME}</Text>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => { setAuthMode('login'); setShowAuth(true); }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: textMuted }}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGetStarted}
              style={{ backgroundColor: PRIMARY, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO SECTION - Premium Component */}
        <Hero onGetStarted={handleGetStarted} />

        {/* FEATURES SECTION - Premium Component */}
        <Features />

        {/* TRUST BAR */}
        <View style={{ backgroundColor: isDark ? '#111111' : '#F5F5F5', paddingVertical: 24, paddingHorizontal: 40, borderTopWidth: 1, borderBottomWidth: 1, borderColor: cardBorder }}>
          <View style={{ maxWidth: 1200, alignSelf: 'center', width: '100%', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: textMuted, marginBottom: 16, fontWeight: '500' }}>Built for Indian solopreneurs who mean business</Text>
            <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['👨‍💻 Developers', '🎨 Designers', '📊 Consultants', '🏪 Shop Owners', '📱 App Builders', '✍️ Creators'].map((name, i) => (
                <View key={i} style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#AAAAAA' }}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* TESTIMONIAL */}
        <View style={{ backgroundColor: isDark ? '#0A0A0A' : '#F9F9F9', paddingVertical: 80, paddingHorizontal: 40 }}>
          <View style={{ maxWidth: 700, alignSelf: 'center', width: '100%' }}>
            <Text style={{ fontSize: 13, color: PRIMARY, fontWeight: '700', textAlign: 'center', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 1 }}>Testimonial</Text>
            <View style={{ backgroundColor: cardBg, borderRadius: 20, padding: 40, borderWidth: 1, borderColor: PRIMARY }}>
              <Text style={{ fontSize: 60, color: PRIMARY, opacity: 0.3, lineHeight: 50, marginBottom: 8 }}>{'"'}</Text>
              <Text style={{ fontSize: 18, color: textPrimary, lineHeight: 30, fontStyle: 'italic', marginBottom: 24 }}>
                {APP_NAME} transformed how I manage my freelance business. The automated expense tracking and professional invoices saved me 10+ hours per month. The data insights helped me increase revenue by 25%.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>ASK</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: textPrimary }}>A Sathish Kumar</Text>
                  <Text style={{ fontSize: 13, color: textMuted }}>Solopreneur & Data Analyst</Text>
                </View>
                <View style={{ marginLeft: 'auto' as any }}>
                  <Text style={{ color: PRIMARY, fontSize: 18 }}>★★★★★</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={{ backgroundColor: bg, paddingVertical: 80, paddingHorizontal: 40 }}>
          <View style={{ maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1, backgroundColor: cardBorder, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: cardBorder }}>
              {[
                { num: '160+', label: 'Countries supported' },
                { num: '7000+', label: '5-star reviews' },
                { num: '553+', label: 'Bills per minute' },
                { num: '30M+', label: 'Businesses served' },
              ].map((s, i) => (
                <View key={i} style={{ flex: 1, minWidth: 160, backgroundColor: bg, padding: 36, alignItems: 'center' }}>
                  <Text style={{ fontSize: 40, fontWeight: '800', color: PRIMARY, lineHeight: 44 }}>{s.num}</Text>
                  <Text style={{ fontSize: 13, color: textMuted, textAlign: 'center', marginTop: 6 }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* PRICING SECTION */}
        <View style={{ backgroundColor: isDark ? '#0D0D0D' : '#FFFFFF', paddingVertical: 80, paddingHorizontal: 40 }}>
          <View style={{ maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
            <Text style={{ fontSize: isWide ? 36 : 28, fontWeight: '800', color: textPrimary, textAlign: 'center', marginBottom: 16 }}>
              Simple, Transparent Pricing
            </Text>
            <Text style={{ fontSize: 18, color: textMuted, textAlign: 'center', marginBottom: 60 }}>
              Start free. Upgrade when you're ready.
            </Text>
            
            <View style={{ flexDirection: isWide ? 'row' : 'column', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
              {/* Starter Card */}
              <View style={{ backgroundColor: cardBg, borderColor: '#2A2A2A', borderWidth: 1, borderRadius: 16, padding: 32, width: isWide ? 340 : '100%', maxWidth: 340 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>Starter</Text>
                <Text style={{ fontSize: 40, fontWeight: '800', color: textPrimary, marginBottom: 8 }}>₹0<Text style={{ fontSize: 20, fontWeight: '500', color: textMuted }}>/month</Text></Text>
                <Text style={{ fontSize: 14, color: textMuted, marginBottom: 32 }}>Perfect for getting started</Text>
                
                <View style={{ gap: 16, marginBottom: 32 }}>
                  <Text style={{ fontSize: 16, color: textPrimary }}>✓ 50 expenses/month</Text>
                  <Text style={{ fontSize: 16, color: textPrimary }}>✓ 5 GST invoices/month</Text>
                  <Text style={{ fontSize: 16, color: textPrimary }}>✓ CSV export</Text>
                  <Text style={{ fontSize: 16, color: textPrimary }}>✓ Google Sign-In</Text>
                  <Text style={{ fontSize: 16, color: textPrimary }}>✓ Dashboard analytics</Text>
                </View>
                
                <TouchableOpacity style={{ backgroundColor: '#2A2A2A', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Get Started Free</Text>
                </TouchableOpacity>
              </View>

              {/* Professional Card */}
              <View style={{ backgroundColor: cardBg, borderColor: PRIMARY, borderWidth: 2, borderRadius: 16, padding: 32, width: isWide ? 340 : '100%', maxWidth: 340, transform: [{ scale: isWide ? 1.05 : 1 }] }}>
                <View style={{ backgroundColor: PRIMARY, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, alignSelf: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: 'white', textAlign: 'center' }}>MOST POPULAR</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: PRIMARY, marginBottom: 8 }}>Professional</Text>
                <Text style={{ fontSize: 40, fontWeight: '800', color: PRIMARY, marginBottom: 8 }}>₹499<Text style={{ fontSize: 20, fontWeight: '500', color: textMuted }}>/month</Text></Text>
                <Text style={{ fontSize: 14, color: textMuted, marginBottom: 32 }}>For serious solopreneurs</Text>
                
                <View style={{ gap: 16, marginBottom: 32 }}>
                  <Text style={{ fontSize: 16, color: PRIMARY }}>✓ Unlimited expenses</Text>
                  <Text style={{ fontSize: 16, color: PRIMARY }}>✓ Unlimited GST invoices</Text>
                  <Text style={{ fontSize: 16, color: PRIMARY }}>✓ GST reports & GSTR-1</Text>
                  <Text style={{ fontSize: 16, color: PRIMARY }}>✓ Client management</Text>
                  <Text style={{ fontSize: 16, color: PRIMARY }}>✓ Razorpay payments</Text>
                  <Text style={{ fontSize: 16, color: PRIMARY }}>✓ Priority support</Text>
                </View>
                
                <TouchableOpacity style={{ backgroundColor: PRIMARY, paddingVertical: 16, borderRadius: 12, alignItems: 'center' }} onPress={handleGetStarted}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Start Free Trial</Text>
                </TouchableOpacity>
              </View>

              {/* Business Card */}
              <View style={{ backgroundColor: cardBg, borderColor: '#5EEAD4', borderWidth: 1, borderRadius: 16, padding: 32, width: isWide ? 340 : '100%', maxWidth: 340 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#5EEAD4', marginBottom: 8 }}>Business</Text>
                <Text style={{ fontSize: 40, fontWeight: '800', color: '#5EEAD4', marginBottom: 8 }}>₹999<Text style={{ fontSize: 20, fontWeight: '500', color: textMuted }}>/month</Text></Text>
                <Text style={{ fontSize: 14, color: textMuted, marginBottom: 32 }}>For growing teams</Text>
                
                <View style={{ gap: 16, marginBottom: 32 }}>
                  <Text style={{ fontSize: 16, color: '#5EEAD4' }}>✓ Everything in Professional</Text>
                  <Text style={{ fontSize: 16, color: '#5EEAD4' }}>✓ WhatsApp invoicing (coming soon)</Text>
                  <Text style={{ fontSize: 16, color: '#5EEAD4' }}>✓ Team members (up to 5)</Text>
                  <Text style={{ fontSize: 16, color: '#5EEAD4' }}>✓ API access</Text>
                  <Text style={{ fontSize: 16, color: '#5EEAD4' }}>✓ Custom branding</Text>
                  <Text style={{ fontSize: 16, color: '#5EEAD4' }}>✓ Dedicated support</Text>
                </View>
                
                <TouchableOpacity style={{ backgroundColor: '#5EEAD4', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#0D0D0D', fontSize: 16, fontWeight: '700' }}>Contact Sales</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ */}
        <View style={{ backgroundColor: isDark ? '#0A0A0A' : '#F9F9F9', paddingVertical: 80, paddingHorizontal: 40 }}>
          <View style={{ maxWidth: 800, alignSelf: 'center', width: '100%' }}>
            <Text style={{ fontSize: isWide ? 36 : 26, fontWeight: '800', color: textPrimary, textAlign: 'center', marginBottom: 48 }}>
              Frequently Asked Questions
            </Text>
            {[
              { q: `Is ${APP_NAME} really free?`, a: `Yes! ${APP_NAME} offers a free tier with all essential features. Premium features are available for growing businesses.` },
              { q: 'How does Google Sign-In work?', a: 'Click Continue with Google, sign in with your Google account, and you are instantly in your dashboard. No password needed.' },
              { q: `Does ${APP_NAME} support GST?`, a: `Yes! ${APP_NAME} is fully GST-compliant. Create GST invoices, file GSTR-1 reports, and manage tax summaries from your dashboard.` },
              { q: 'Can I export my financial data?', a: 'Yes, export invoices, expenses, and reports as CSV or PDF anytime from your dashboard.' },
            ].map((faq, i) => (
              <View key={i} style={{ backgroundColor: cardBg, borderRadius: 12, padding: 24, marginBottom: 12, borderWidth: 1, borderColor: cardBorder }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: PRIMARY, marginBottom: 10 }}>{faq.q}</Text>
                <Text style={{ fontSize: 14, color: textMuted, lineHeight: 22 }}>{faq.a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA BANNER */}
        <View style={{ paddingVertical: 80, paddingHorizontal: 40, backgroundColor: '#FF006E' }}>
          <View style={{ maxWidth: 600, alignSelf: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: isWide ? 44 : 30, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 16 }}>
              Ready to get started?
            </Text>
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 36 }}>
              Join 30 million business owners. Your first 30 days are free.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <TouchableOpacity onPress={handleGetStarted}
                style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 28, paddingVertical: 16, borderRadius: 10 }}>
                <Text style={{ color: PRIMARY, fontWeight: '800', fontSize: 16 }}>Start Now</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGoogleSignIn}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', paddingHorizontal: 28, paddingVertical: 16, borderRadius: 10 }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={{ backgroundColor: DARK, paddingVertical: 48, paddingHorizontal: 40, borderTopWidth: 1, borderTopColor: '#222' }}>
          <View style={{ maxWidth: 1200, alignSelf: 'center', width: '100%', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 }}>🥕 {APP_NAME}</Text>
            <Text style={{ fontSize: 14, color: PRIMARY, marginBottom: 24 }}>Professional Finance for Indian Solopreneurs</Text>
            <View style={{ flexDirection: 'row', gap: 28, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Privacy', 'Terms', 'Contact', 'Help'].map((link, i) => (
                <TouchableOpacity key={i}>
                  <Text style={{ fontSize: 14, color: '#888' }}>{link}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Theme toggle */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Text style={{ color: '#666', fontSize: 13 }}>{isDark ? '🌙 Dark' : '☀️ Light'}</Text>
              <TouchableOpacity onPress={() => setIsDark(!isDark)}
                style={{ width: 48, height: 26, borderRadius: 13, backgroundColor: isDark ? PRIMARY : '#E0E0E0', justifyContent: 'center', paddingHorizontal: 3 }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', transform: [{ translateX: isDark ? 22 : 0 }] }} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 12, color: '#555' }}>© 2026 {APP_NAME}. Built by A. Sathish Kumar, Chennai.</Text>
          </View>
        </View>

      </ScrollView>

      {/* AUTH MODAL */}
      <Modal visible={showAuth} transparent animationType="fade" onRequestClose={() => setShowAuth(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 36, width: '100%', maxWidth: 440, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }}>
              <TouchableOpacity onPress={() => setShowAuth(false)} style={{ position: 'absolute', top: 16, right: 16, padding: 4 }}>
                <Text style={{ fontSize: 20, color: '#999' }}>✕</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 26, fontWeight: '800', color: '#1A1A1A' }}>🥕 {APP_NAME}</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A1A1A', textAlign: 'center', marginBottom: 24 }}>
                {authMode === 'login' ? `Log in to ${APP_NAME}` : 'Create your account'}
              </Text>
              {authMode === 'signup' && (
                <TextInput placeholder="Full Name" placeholderTextColor="#999" value={fullName} onChangeText={setFullName}
                  style={styles.modalInput} autoCapitalize="words" />
              )}
              <TextInput placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail}
                style={styles.modalInput} keyboardType="email-address" autoCapitalize="none" />
              <TextInput placeholder="Password" placeholderTextColor="#999" value={password} onChangeText={setPassword}
                style={styles.modalInput} secureTextEntry />
              <TouchableOpacity onPress={handleEmailAuth} disabled={loading}
                style={{ backgroundColor: loading ? '#ccc' : PRIMARY, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
                  {loading ? (authMode === 'login' ? 'Logging in...' : 'Creating...') : (authMode === 'login' ? 'Log In' : 'Create Account')}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#E0E0E0' }} />
                <Text style={{ color: '#999', fontSize: 13, fontWeight: '600' }}>OR</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#E0E0E0' }} />
              </View>
              <TouchableOpacity onPress={handleGoogleSignIn} disabled={googleLoading}
                style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20, opacity: googleLoading ? 0.6 : 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#4285F4' }}>G</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}>
                  {googleLoading ? 'Opening Google...' : 'Sign in with Google'}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                <Text style={{ color: '#666', fontSize: 14 }}>
                  {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                  <Text style={{ color: PRIMARY, fontSize: 14, fontWeight: '700' }}>
                    {authMode === 'login' ? 'Sign Up' : 'Log In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
});
