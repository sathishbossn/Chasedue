import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AddClient() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ratePerHour, setRatePerHour] = useState('');

  const handleSave = async (e?: any) => {
    console.log('🔥🔥🔥 SAVE BUTTON CLICKED - FUNCTION CALLED!');
    console.log('🔥 Save button clicked!');
    console.log('📊 Form data:', { name, company, email, phone, ratePerHour });
    
    // PREVENT DEFAULT: Stop page refresh
    if (e && e.preventDefault) {
      e.preventDefault();
      console.log('🛡️ Preventing default form behavior');
    }
    
    // Validation
    if (!name.trim()) {
      console.log('❌ Validation failed: Name is empty');
      console.log('Error: Client name is required');
      return;
    }

    if (!session?.user?.id) {
      console.log('❌ Validation failed: No session');
      console.log('Error: You must be logged in to add a client');
      return;
    }

    console.log('✅ Validation passed');
    setLoading(true);

    try {
      console.log('🔧 Adding client:', name);
      console.log('👤 User ID:', session.user.id);

      // AUTH FETCH: Get current user
      console.log('🔍 Fetching current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.log('❌ User fetch error:', userError);
        console.log('Error: Failed to get user info. Please try again.');
        return;
      }
      
      if (!user) {
        console.log('❌ Save failed: No user found');
        console.log('Error: User session expired. Please log in again.');
        return;
      }

      console.log('✅ User fetched successfully:', user.id);

      // DATABASE INSERT: Sync with Supabase schema
      console.log('💾 Inserting into clients table...');
      const clientData = { 
        name: name.trim(), 
        company: company.trim() || null, 
        email: email.trim() || null, 
        phone: phone.trim() || null,
        rate_per_hour: ratePerHour ? Number(ratePerHour) : null, // DATA TYPES: Ensure Number
        user_id: user.id, // SYNC COLUMNS: user_id
        freelancer_id: user.id // SYNC COLUMNS: freelancer_id
      };
      console.log('📦 Data to insert:', clientData);
      
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData]);

      // FEEDBACK: Log save result
      if (error) {
        console.log('❌ Save failed:', error);
        console.log('❌ Error details:', JSON.stringify(error, null, 2));
        console.log('FEEDBACK: Save Failed -', error.message || 'Failed to add client. Please try again.');
        return;
      }
      
      console.log('✅ Save succeeded: Client added successfully');
      console.log('📊 Returned data:', data);
      
      // NAVIGATION: Redirect to app dashboard
      console.log('🚀 Redirecting to /(app)');
      router.replace("/(app)");

    } catch (error) {
      console.error('💥 Unexpected error:', error);
      console.error('💥 Error details:', JSON.stringify(error, null, 2));
      console.log('FEEDBACK: An unexpected error occurred. Please try again.');
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Client</Text>
          <Text style={styles.subtitle}>Fill in the client details below</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter client name"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter company name"
              value={company}
              onChangeText={setCompany}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rate per Hour</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hourly rate"
              value={ratePerHour}
              onChangeText={setRatePerHour}
              keyboardType="numeric"
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
            onPress={(e) => {
              console.log('🔥🔥🔥 BUTTON PRESSED - TouchableOpacity working!');
              console.log('🛡️ PREVENT DEFAULT: Stopping any form submission');
              if (!loading) {
                handleSave(e);
              } else {
                console.log('⏳ Button disabled - request in flight');
              }
            }}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Client'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#10b981',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
});
