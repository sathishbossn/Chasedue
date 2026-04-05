import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>Last updated: {new Date().toLocaleDateString()}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              [BRAND_NAME] collects information you provide directly to us, including:
            </Text>
            <Text style={styles.bullet}>• [DATA_TYPE_1]</Text>
            <Text style={styles.bullet}>• [DATA_TYPE_2]</Text>
            <Text style={styles.bullet}>• [DATA_TYPE_3]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use your information to:
            </Text>
            <Text style={styles.bullet}>• [USE_CASE_1]</Text>
            <Text style={styles.bullet}>• [USE_CASE_2]</Text>
            <Text style={styles.bullet}>• [USE_CASE_3]</Text>
            <Text style={styles.bullet}>• [USE_CASE_4]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement [SECURITY_MEASURES]:
            </Text>
            <Text style={styles.bullet}>• [SECURITY_FEATURE_1]</Text>
            <Text style={styles.bullet}>• [SECURITY_FEATURE_2]</Text>
            <Text style={styles.bullet}>• [SECURITY_FEATURE_3]</Text>
            <Text style={styles.bullet}>• [SECURITY_FEATURE_4]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
            <Text style={styles.sectionText}>
              [BRAND_NAME] integrates with:
            </Text>
            <Text style={styles.bullet}>• [THIRD_PARTY_1]</Text>
            <Text style={styles.bullet}>• [THIRD_PARTY_2]</Text>
            <Text style={styles.bullet}>• [THIRD_PARTY_3]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to:
            </Text>
            <Text style={styles.bullet}>• [USER_RIGHT_1]</Text>
            <Text style={styles.bullet}>• [USER_RIGHT_2]</Text>
            <Text style={styles.bullet}>• [USER_RIGHT_3]</Text>
            <Text style={styles.bullet}>• [USER_RIGHT_4]</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Contact Us</Text>
            <Text style={styles.sectionText}>
              For privacy-related questions, contact us at:
            </Text>
            <Text style={styles.contact}>📧 privacy@[COMPANY_DOMAIN]</Text>
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
