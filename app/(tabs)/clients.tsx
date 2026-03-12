import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import UpgradeModal from '@/components/UpgradeModal';

type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  rate_per_hour?: number;
  notes?: string;
};

export default function Clients() {
  const { session } = useAuth();
  const { isPro, clientLimit, canAddClient } = useSubscription();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    rate_per_hour: '',
    notes: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('freelancer_id', session?.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Client name is required');
      return;
    }

    // Check client limit for free users
    if (!isPro && !editingClient && clients.length >= 3) {
      setUpgradeModalVisible(true);
      return;
    }

    const clientData = {
      freelancer_id: session?.user.id,
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      company: formData.company || null,
      rate_per_hour: formData.rate_per_hour ? parseFloat(formData.rate_per_hour) : null,
      notes: formData.notes || null,
    };

    let error;
    if (editingClient) {
      const { error: updateError } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', editingClient.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('clients')
        .insert(clientData);
      error = insertError;
    }

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setModalVisible(false);
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        rate_per_hour: '',
        notes: '',
      });
      fetchClients();
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      rate_per_hour: client.rate_per_hour?.toString() || '',
      notes: client.notes || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (client: Client) => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${client.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('clients')
              .delete()
              .eq('id', client.id);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              fetchClients();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading clients...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Clients</Text>
          {!isPro && (
            <Text style={{ fontSize: 14, color: '#666' }}>
              {clients.length}/3 clients (Free plan)
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!isPro && clients.length >= 3) {
              setUpgradeModalVisible(true);
              return;
            }
            setEditingClient(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              company: '',
              rate_per_hour: '',
              notes: '',
            });
            setModalVisible(true);
          }}
          style={{ 
            backgroundColor: !isPro && clients.length >= 3 ? '#ccc' : '#007AFF', 
            padding: 10, 
            borderRadius: 8 
          }}
          disabled={!isPro && clients.length >= 3}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Add Client</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {clients.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Text style={{ fontSize: 48, marginBottom: 20 }}>🥕</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 12 }}>
              No clients yet
            </Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
              Start building your freelance business by adding your first client
            </Text>
            <TouchableOpacity
              onPress={() => {
                setEditingClient(null);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  rate_per_hour: '',
                  notes: '',
                });
                setModalVisible(true);
              }}
              style={{ backgroundColor: '#007AFF', padding: 16, borderRadius: 12, paddingHorizontal: 24 }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Add Your First Client
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          clients.map((client) => (
            <View
              key={client.id}
              style={{
                backgroundColor: '#f8f9fa',
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>
                {client.name}
              </Text>
              {client.company && (
                <Text style={{ color: '#666', marginBottom: 2 }}>{client.company}</Text>
              )}
              {client.email && (
                <Text style={{ color: '#666', marginBottom: 2 }}>{client.email}</Text>
              )}
              {client.rate_per_hour && (
                <Text style={{ color: '#007AFF', fontWeight: '500' }}>
                  ${client.rate_per_hour}/hr
                </Text>
              )}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  onPress={() => handleEdit(client)}
                  style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 4, flex: 1 }}
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(client)}
                  style={{ backgroundColor: '#FF3B30', padding: 8, borderRadius: 4, flex: 1 }}
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            {editingClient ? 'Edit Client' : 'Add Client'}
          </Text>

          <ScrollView>
            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ marginBottom: 4, fontWeight: '500' }}>Name *</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                  }}
                  placeholder="Client name"
                />
              </View>

              <View>
                <Text style={{ marginBottom: 4, fontWeight: '500' }}>Company</Text>
                <TextInput
                  value={formData.company}
                  onChangeText={(text) => setFormData({ ...formData, company: text })}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                  }}
                  placeholder="Company name"
                />
              </View>

              <View>
                <Text style={{ marginBottom: 4, fontWeight: '500' }}>Email</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                  }}
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text style={{ marginBottom: 4, fontWeight: '500' }}>Phone</Text>
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                  }}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text style={{ marginBottom: 4, fontWeight: '500' }}>Rate per hour</Text>
                <TextInput
                  value={formData.rate_per_hour}
                  onChangeText={(text) => setFormData({ ...formData, rate_per_hour: text })}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                  }}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View>
                <Text style={{ marginBottom: 4, fontWeight: '500' }}>Notes</Text>
                <TextInput
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                    height: 100,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Additional notes..."
                  multiline
                />
              </View>
            </View>
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#f0f0f0',
                padding: 16,
                borderRadius: 8,
                flex: 1,
              }}
            >
              <Text style={{ textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={{ backgroundColor: '#007AFF', padding: 16, borderRadius: 8, flex: 1 }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                {editingClient ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <UpgradeModal
        visible={upgradeModalVisible}
        onClose={() => setUpgradeModalVisible(false)}
        onUpgradeSuccess={() => {
          // Refresh subscription status after successful upgrade
          window.location.reload();
        }}
      />
    </View>
  );
}
