import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  rate_per_hour?: number;
  notes?: string;
  created_at: string;
  user_id: string;
}

export default function ClientList() {
  const router = useRouter();
  const { session } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClients = async () => {
    try {
      if (!session?.user?.id) {
        console.log('No session found');
        return;
      }

      console.log('🔍 Fetching clients for user:', session.user.id);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching clients:', error);
        Alert.alert('Error', 'Failed to load clients. Please check your connection.');
        return;
      }

      console.log('✅ Clients fetched:', data?.length || 0);
      setClients(data || []);
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred while loading clients.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [session]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const renderClient = ({ item }: { item: Client }) => (
    <BlurView intensity={15} tint="dark" style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      {(item.company || item.email) && (
        <View style={styles.clientDetails}>
          {item.company && (
            <Text style={styles.clientDetail}>{item.company}</Text>
          )}
          {item.email && (
            <Text style={styles.clientDetail}>{item.email}</Text>
          )}
          {item.phone && (
            <Text style={styles.clientDetail}>{item.phone}</Text>
          )}
          {item.rate_per_hour && (
            <Text style={styles.clientDetail}>${item.rate_per_hour}/hr</Text>
          )}
        </View>
      )}
    </BlurView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading clients...</Text>
      </View>
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
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeText}>Welcome Freelancer</Text>
              <Text style={styles.emailText}>{session?.user?.email || 'Loading...'}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsSection}>
          <BlurView intensity={20} tint="dark" style={styles.glassCard}>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{clients.length}</Text>
              <Text style={styles.statLabel}>Total Clients</Text>
            </View>
          </BlurView>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Clients</Text>
            <TouchableOpacity 
              style={styles.addClientButton} 
              onPress={() => router.push('/(app)/add-client')}
            >
              <Text style={styles.addClientButtonText}>+ Add Client</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff7043" />
              <Text style={styles.loadingText}>Loading clients...</Text>
            </View>
          ) : (
            <FlatList
              data={clients}
              renderItem={renderClient}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff7043" />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <BlurView intensity={15} tint="dark" style={styles.emptyGlassCard}>
                    <Text style={styles.emptyText}>No clients yet</Text>
                    <Text style={styles.emptySubtext}>Tap "Add Client" to get started</Text>
                  </BlurView>
                </View>
              }
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(app)/invoices')}
            >
              <BlurView intensity={15} tint="dark" style={styles.quickActionBlur}>
                <Text style={styles.quickActionTitle}>View Invoices</Text>
                <Text style={styles.quickActionDescription}>Manage and track all invoices</Text>
              </BlurView>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/invoice/create')}
            >
              <BlurView intensity={15} tint="dark" style={styles.quickActionBlur}>
                <Text style={styles.quickActionTitle}>Create Invoice</Text>
                <Text style={styles.quickActionDescription}>Generate a new invoice</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  
  // Header Section
  headerSection: {
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#5eead4',
    opacity: 0.8,
  },
  logoutButton: {
    backgroundColor: '#ff7043',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Stats Section
  statsSection: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 48,
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
  
  // Content Section
  contentSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  addClientButton: {
    backgroundColor: '#ff7043',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addClientButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Client Cards
  clientCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  clientDate: {
    fontSize: 14,
    color: '#5eead4',
    opacity: 0.7,
  },
  clientDetails: {
    gap: 4,
  },
  clientDetail: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyGlassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    minWidth: width - 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#5eead4',
    opacity: 0.8,
    textAlign: 'center',
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  
  // List Container
  listContainer: {
    paddingBottom: 20,
  },
  
  // Quick Actions Section
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  quickActionsGrid: {
    gap: 16,
  },
  quickActionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  quickActionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  quickActionDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
});
