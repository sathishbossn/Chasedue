import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsOfService() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.subtitle}>Last updated: {new Date().toLocaleDateString()}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using [BRAND_NAME], you accept and agree to be bound by the terms and provision of this agreement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.sectionText}>
              [BRAND_NAME] is a financial management platform that provides:
            </Text>
            <Text style={styles.bullet}>• Expense tracking and categorization</Text>
            <Text style={styles.bullet}>• Client and invoice management</Text>
            <Text style={styles.bullet}>• Financial reporting and analytics</Text>
            <Text style={styles.bullet}>• [ADDITIONAL_FEATURES]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.sectionText}>
              • You must provide accurate information when creating an account
            </Text>
            <Text style={styles.bullet}>• You are responsible for maintaining account security</Text>
            <Text style={styles.bullet}>• One account per individual or business entity</Text>
            <Text style={styles.bullet}>• We reserve the right to suspend or terminate accounts</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Subscription Plans</Text>
            <Text style={styles.sectionText}>
              [BRAND_NAME] offers:
            </Text>
            <Text style={styles.bullet}>• [FREE_TIER_DESCRIPTION]</Text>
            <Text style={styles.bullet}>• [PREMIUM_TIER_DESCRIPTION]</Text>
            <Text style={styles.bullet}>• [BILLING_OPTIONS]</Text>
            <Text style={styles.bullet}>• [TRIAL_PERIOD]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Contact Information</Text>
            <Text style={styles.sectionText}>
              For questions about these terms:
            </Text>
            <Text style={styles.contact}>📧 legal@[COMPANY_DOMAIN]</Text>
            <Text style={styles.contact}>🌐 [COMPANY_WEBSITE]</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © [CURRENT_YEAR] [BRAND_NAME]. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF006E',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#AAAAAA',
    marginLeft: 16,
    marginBottom: 4,
  },
  contact: {
    fontSize: 16,
    color: '#5EEAD4',
    marginBottom: 4,
  },
  footer: {
    marginTop: 48,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
