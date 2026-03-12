import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <LinearGradient colors={['#004d4d', '#001a1a']} style={styles.gradientContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff7043" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#004d4d', '#001a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>CarrotCash</Text>
            <Text style={styles.heroSubtitle}>Premium Freelance Management</Text>
            <Text style={styles.heroDescription}>
              Streamline your freelance business with beautiful invoicing, client management, and financial analytics.
            </Text>
            
            <View style={styles.ctaContainer}>
              <TouchableOpacity 
                style={styles.primaryCTA}
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.primaryCTAText}>Get Started</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryCTA}
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.secondaryCTAText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose CarrotCash?</Text>
          
          <View style={styles.featuresGrid}>
            <BlurView intensity={20} tint="dark" style={styles.featureCard}>
              <Text style={styles.featureTitle}>Smart Invoicing</Text>
              <Text style={styles.featureDescription}>
                Create professional invoices in seconds with our intelligent templates.
              </Text>
            </BlurView>
            
            <BlurView intensity={20} tint="dark" style={styles.featureCard}>
              <Text style={styles.featureTitle}>Client Management</Text>
              <Text style={styles.featureDescription}>
                Keep track of your clients, projects, and payment history all in one place.
              </Text>
            </BlurView>
            
            <BlurView intensity={20} tint="dark" style={styles.featureCard}>
              <Text style={styles.featureTitle}>Financial Analytics</Text>
              <Text style={styles.featureDescription}>
                Get insights into your earnings, payment trends, and business growth.
              </Text>
            </BlurView>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <BlurView intensity={20} tint="dark" style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Freelancers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>$2M+</Text>
                <Text style={styles.statLabel}>Invoiced</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>98%</Text>
                <Text style={styles.statLabel}>Satisfaction</Text>
              </View>
            </View>
          </BlurView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Hero Section
  heroSection: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5eead4',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroDescription: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
  },
  
  // CTA Buttons
  ctaContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryCTA: {
    backgroundColor: '#ff7043',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 140,
  },
  primaryCTAText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryCTA: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 140,
  },
  secondaryCTAText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  
  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 24,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#5eead4',
    opacity: 0.8,
    fontWeight: '600',
  },
});
