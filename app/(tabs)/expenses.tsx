import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_NAME } from '../../src/constants/BrandConfig';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const PRIMARY = '#D97757';
const LIGHT = '#faf9f5';
const GRAY = '#e8e6dc';

const { width } = Dimensions.get('window');
const isWide = width > 900;

interface Expense {
  id: string;
  title: string;  // ✅ Correct column name
  amount: number;
  category: string;
  user_id: string;
  created_at: string;  // ✅ Correct column name
}

export default function Expenses() {
  const { session } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    project_type: 'kharcha',
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other',
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      // Map data to match interface - expenses table uses 'title' not 'description'
      const mappedExpenses = data?.map(expense => ({
        id: expense.id,
        title: expense.title || 'Untitled',
        amount: expense.amount,
        category: expense.category || 'Other',
        user_id: expense.user_id,
        created_at: expense.created_at,
        project_type: 'kharcha' // Default project type for compatibility
      })) || [];

      setExpenses(mappedExpenses);
    } catch (error: any) {
      console.error('Error fetching expenses:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      Alert.alert('Error', `Failed to fetch expenses: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.amount || !formData.description || !formData.category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Parse amount - strip ₹ symbol and commas, handle Indian number format
    const cleanAmount = formData.amount
      .replace(/[₹$,]/g, '')  // Remove currency symbols and commas
      .trim();
    
    const parsedAmount = parseFloat(cleanAmount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: session.user.id,
          title: formData.description, // ✅ Map description to title column
          amount: parsedAmount,
          category: formData.category,
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Success', 'Expense added successfully!');
      setShowModal(false);
      setFormData({ amount: '', description: '', category: '', project_type: 'kharcha' });
      fetchExpenses();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create expense');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('expenses').delete().eq('id', id);
              if (error) throw error;
              fetchExpenses();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Text>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', fontFamily: 'Poppins' }}>Expenses</Text>
            <Text style={{ fontSize: 14, color: '#666', fontFamily: 'Poppins' }}>
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{ backgroundColor: PRIMARY, padding: 12, borderRadius: 8 }}
          >
            <Ionicons name="add" size={20} color="#faf9f5" />
          </TouchableOpacity>
        </View>

        {expenses.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 48, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEEEEE' }}>
            <Ionicons name="receipt-outline" size={48} color="#DDD" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 16, marginBottom: 8, fontFamily: 'Poppins' }}>
              No expenses yet
            </Text>
            <Text style={{ fontSize: 14, color: '#888', marginBottom: 24, textAlign: 'center' }}>
              Start tracking your expenses to see them here
            </Text>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={{ backgroundColor: PRIMARY, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
            >
              <Text style={{ color: '#faf9f5', fontWeight: '700', fontSize: 15 }}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {expenses.map((expense) => (
              <View
                key={expense.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#EEEEEE',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 }}>
                      {expense.description}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                      {expense.category}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>
                      {new Date(expense.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: PRIMARY, marginBottom: 8 }}>
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <View style={{
                        backgroundColor: expense.project_type === 'carrotcash' ? 'rgba(255, 0, 110, 0.1)' : 'rgba(94, 234, 228, 0.1)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: expense.project_type === 'carrotcash' ? PRIMARY : '#5EEAD4',
                        }}>
                          {expense.project_type === 'carrotcash' ? APP_NAME : 'Kharcha'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
                  <TouchableOpacity
                    onPress={() => handleDelete(expense.id)}
                    style={{ backgroundColor: '#FF3B30', padding: 8, borderRadius: 6, paddingHorizontal: 12 }}
                  >
                    <Text style={{ color: '#faf9f5', fontSize: 14, fontWeight: '600' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A1A1A', fontFamily: 'Poppins' }}>Add Expense</Text>
          </View>
          
          <ScrollView style={{ flex: 1, padding: 24 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, fontFamily: 'Poppins' }}>Amount (₹)</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 15,
                  color: '#1A1A1A',
                  backgroundColor: '#FAFAFA',
                }}
                placeholder="0.00"
                placeholderTextColor="#999"
                value={formData.amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 }}>Description</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 15,
                  color: '#1A1A1A',
                  backgroundColor: '#FAFAFA',
                  height: 80,
                  textAlignVertical: 'top',
                }}
                placeholder="What was this expense for?"
                placeholderTextColor="#999"
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                multiline
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 }}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8 }}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={{
                      backgroundColor: formData.category === category ? PRIMARY : '#F0F0F0',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: formData.category === category ? PRIMARY : 'transparent',
                    }}
                    onPress={() => setFormData(prev => ({ ...prev, category }))}
                  >
                    <Text style={{
                      color: formData.category === category ? '#faf9f5' : '#666',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 }}>Project Type</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: formData.project_type === 'kharcha' ? PRIMARY : '#F0F0F0',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: formData.project_type === 'kharcha' ? PRIMARY : 'transparent',
                  }}
                  onPress={() => setFormData(prev => ({ ...prev, project_type: 'kharcha' }))}
                >
                  <Text style={{
                    color: formData.project_type === 'kharcha' ? '#faf9f5' : '#666',
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    Kharcha (Personal)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: formData.project_type === 'carrotcash' ? PRIMARY : '#F0F0F0',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: formData.project_type === 'carrotcash' ? PRIMARY : 'transparent',
                  }}
                  onPress={() => setFormData(prev => ({ ...prev, project_type: 'carrotcash' }))}
                >
                  <Text style={{
                    color: formData.project_type === 'carrotcash' ? '#faf9f5' : '#666',
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    {APP_NAME} (Business)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={{ padding: 24, borderTopWidth: 1, borderTopColor: '#EEEEEE' }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: 16,
                  borderRadius: 12,
                  flex: 1,
                }}
              >
                <Text style={{ textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                disabled={saving}
                style={{
                  backgroundColor: PRIMARY,
                  padding: 16,
                  borderRadius: 12,
                  flex: 1,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Text style={{ color: '#faf9f5', textAlign: 'center', fontWeight: '600' }}>
                  {saving ? 'Saving...' : 'Add Expense'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
