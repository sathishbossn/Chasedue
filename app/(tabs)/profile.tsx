import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
  Share,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const PRIMARY = '#d97757';
const DARK = '#141413';
const LIGHT = '#faf9f5';
const GRAY = '#e8e6dc';
const CARD_BG = '#1A1A1A';

const { width, height } = Dimensions.get('window');
const isWide = width > 900;

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  business_name?: string;
  is_pro?: boolean;
}

export default function Profile() {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(10000);
  const [analytics, setAnalytics] = useState({
    totalExpenses: 0,
    mostFrequentCategory: 'N/A',
    transactionCount: 0,
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchAnalytics();
  }, [session]);

  const fetchAnalytics = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('amount, category')
        .eq('user_id', session.user.id);

      if (error) throw error;

      if (expenses && expenses.length > 0) {
        const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const categoryCount: { [key: string]: number } = {};
        
        expenses.forEach(exp => {
          const category = exp.category || 'Other';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        const mostFrequentCategory = Object.entries(categoryCount)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

        setAnalytics({
          totalExpenses,
          mostFrequentCategory,
          transactionCount: expenses.length,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/landing');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const exportData = async () => {
    if (!session?.user?.id) return;

    setExporting(true);
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const csvContent = [
        ['Date', 'Description', 'Amount', 'Category', 'Project Type'],
        ...(expenses || []).map(exp => [
          new Date(exp.created_at).toLocaleDateString(),
          exp.description || '',
          exp.amount || 0,
          exp.category || '',
          exp.project_type || '',
        ])
      ].map(row => row.join(',')).join('\n');

      const fileName = `carrotcash-export-${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', 'Data exported successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = userProfile?.full_name || session?.user?.email?.split('@')[0] || 'there';

  const renderQuickStats = () => (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Quick Stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="receipt-outline" size={24} color={PRIMARY} />
          </View>
          <Text style={styles.statValue}>${analytics.totalExpenses.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Expenses</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="pricetag-outline" size={24} color={PRIMARY} />
          </View>
          <Text style={styles.statValue}>{analytics.mostFrequentCategory}</Text>
          <Text style={styles.statLabel}>Top Category</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="swap-horizontal-outline" size={24} color={PRIMARY} />
          </View>
          <Text style={styles.statValue}>{analytics.transactionCount}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="wallet-outline" size={24} color={PRIMARY} />
          </View>
          <Text style={styles.statValue}>${monthlyBudget.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Monthly Budget</Text>
        </View>
      </View>
    </View>
  );

  const renderAccountSettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.settingsGrid}>
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="person-outline" size={20} color={PRIMARY} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Profile Information</Text>
              <Text style={styles.settingDescription}>Update your personal details</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingAction}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="business-outline" size={20} color={PRIMARY} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Business Details</Text>
              <Text style={styles.settingDescription}>Manage your business information</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingAction}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={20} color={PRIMARY} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Manage push notifications</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E5E5', true: 'rgba(255, 0, 110, 0.3)' }}
            thumbColor={notificationsEnabled ? PRIMARY : '#FFF'}
          />
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="download-outline" size={20} color={PRIMARY} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>Download your financial data</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.settingAction, exporting && styles.settingActionDisabled]}
            onPress={exportData}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator size="small" color={PRIMARY} />
            ) : (
              <Ionicons name="download" size={20} color={PRIMARY} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDangerZone = () => (
    <View style={styles.dangerSection}>
      <Text style={styles.sectionTitle}>Account Actions</Text>
      <View style={styles.dangerCard}>
        <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.dangerButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderQuickStats()}
        {renderAccountSettings()}
        {renderDangerZone()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: '#faf9f5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: DARK,
    marginTop: 2,
    fontFamily: 'Poppins',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Scroll Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  
  // Section
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  
  // Quick Stats
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: LIGHT,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 0, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: DARK,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Account Settings
  settingsSection: {
    marginBottom: 32,
  },
  settingsGrid: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: LIGHT,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingAction: {
    padding: 8,
  },
  settingActionDisabled: {
    opacity: 0.5,
  },
  
  // Danger Zone
  dangerSection: {
    marginBottom: 32,
  },
  dangerCard: {
    backgroundColor: LIGHT,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  dangerButtonText: {
    color: '#faf9f5',
    fontSize: 16,
    fontWeight: '600',
  },
});
