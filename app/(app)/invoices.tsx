import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name?: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  notes?: string;
}

export default function Invoices() {
  const router = useRouter();
  const { session } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = async () => {
    try {
      if (!session?.user?.id) {
        console.log('No session found');
        return;
      }

      console.log('🔍 Fetching invoices for user:', session.user.id);
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients:client_id(name)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('❌ Error fetching invoices:', error);
        return;
      }

      console.log('✅ Invoices fetched:', data?.length || 0);
      setInvoices(data || []);
    } catch (error) {
      console.error('💥 Unexpected error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [session]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'sent': return '#3b82f6';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'sent': return 'Sent';
      case 'overdue': return 'Overdue';
      default: return 'Draft';
    }
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <BlurView intensity={15} tint="dark" style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>{item.invoice_number}</Text>
          <Text style={styles.clientName}>{item.clients?.name || 'Unknown Client'}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.invoiceDetails}>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        <Text style={styles.dueDate}>
          Due: {new Date(item.due_date).toLocaleDateString()}
        </Text>
      </View>
      
      {item.notes && (
        <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text>
      )}
    </BlurView>
  );

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
              <Text style={styles.title}>Invoices</Text>
              <Text style={styles.subtitle}>{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</Text>
            </View>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/(app)/create-invoice')}
            >
              <Text style={styles.createButtonText}>+ Create</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff7043" />
            <Text style={styles.loadingText}>Loading invoices...</Text>
          </View>
        ) : (
          <FlatList
            data={invoices}
            renderItem={renderInvoice}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff7043" />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <BlurView intensity={15} tint="dark" style={styles.emptyGlassCard}>
                  <Text style={styles.emptyText}>No invoices yet</Text>
                  <Text style={styles.emptySubtext}>Create your first invoice to get started</Text>
                </BlurView>
              </View>
            }
            scrollEnabled={false}
          />
        )}
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
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#5eead4',
    opacity: 0.8,
  },
  createButton: {
    backgroundColor: '#ff7043',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Invoice Cards
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  dueDate: {
    fontSize: 14,
    color: '#5eead4',
    opacity: 0.8,
  },
  notes: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.6,
    fontStyle: 'italic',
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
});
