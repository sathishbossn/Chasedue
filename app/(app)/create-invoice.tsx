import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Client {
  id: string;
  name: string;
  email?: string;
}

export default function CreateInvoice() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  
  // Form fields
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchClients();
    generateInvoiceNumber();
  }, []);

  const fetchClients = async () => {
    try {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('user_id', session.user.id)
        .order('name', { ascending: true });

      if (error) {
        console.log('❌ Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('💥 Error fetching clients:', error);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInvoiceNumber(`INV-${year}${month}-${random}`);
  };

  const handleSave = async () => {
    // Validation
    if (!selectedClient) {
      Alert.alert('Error', 'Please select a client');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!dueDate) {
      Alert.alert('Error', 'Please enter a due date');
      return;
    }

    if (!session?.user?.id) {
      Alert.alert('Error', 'You must be logged in to create an invoice');
      return;
    }

    setLoading(true);

    try {
      console.log('🔧 Creating invoice...');
      console.log('👤 User ID:', session.user.id);

      // AUTH FETCH: Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'User session expired. Please log in again.');
        return;
      }

      // DATABASE INSERT: Create invoice
      const invoiceData = { 
        invoice_number: invoiceNumber.trim(),
        client_id: selectedClient,
        user_id: user.id,
        amount: parseFloat(amount),
        due_date: dueDate,
        status: 'draft',
        notes: notes.trim() || null,
      };
      
      console.log('📦 Invoice data:', invoiceData);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData]);

      if (error) {
        console.log('❌ Save failed:', error);
        Alert.alert('Save Failed', error.message || 'Failed to create invoice. Please try again.');
        return;
      }
      
      console.log('✅ Invoice created successfully');
      
      Alert.alert(
        'Success',
        'Invoice created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(app)/invoices'),
          },
        ]
      );

    } catch (error) {
      console.error('💥 Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#004d4d', '#001a1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Invoice</Text>
            <Text style={styles.subtitle}>Fill in the invoice details below</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Invoice Number</Text>
              <TextInput
                style={styles.input}
                value={invoiceNumber}
                onChangeText={setInvoiceNumber}
                editable={false}
                placeholder="Auto-generated"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client *</Text>
              {clients.length > 0 ? (
                <ScrollView style={styles.clientList} horizontal showsHorizontalScrollIndicator={false}>
                  {clients.map((client) => (
                    <TouchableOpacity
                      key={client.id}
                      style={[
                        styles.clientChip,
                        selectedClient === client.id && styles.selectedClientChip
                      ]}
                      onPress={() => setSelectedClient(client.id)}
                    >
                      <Text style={[
                        styles.clientChipText,
                        selectedClient === client.id && styles.selectedClientChipText
                      ]}>
                        {client.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noClientsContainer}>
                  <Text style={styles.noClientsText}>No clients found</Text>
                  <TouchableOpacity
                    style={styles.addClientButton}
                    onPress={() => router.push('/(app)/add-client')}
                  >
                    <Text style={styles.addClientButtonText}>Add Client</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount ($) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any notes or terms..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Creating...' : 'Create Invoice'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5eead4',
    opacity: 0.8,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  clientList: {
    flexDirection: 'row',
    gap: 8,
  },
  clientChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedClientChip: {
    backgroundColor: '#ff7043',
    borderColor: '#ff7043',
  },
  clientChipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedClientChipText: {
    color: '#ffffff',
  },
  noClientsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noClientsText: {
    color: '#ffffff',
    opacity: 0.6,
    marginBottom: 16,
  },
  addClientButton: {
    backgroundColor: '#ff7043',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addClientButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#ff7043',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
});
