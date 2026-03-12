import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { session } = useAuth();
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientCount();
  }, []);

  const fetchClientCount = async () => {
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('freelancer_id', session?.user.id);
    
    if (!error) {
      setClientCount(count || 0);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>
        Welcome Freelancer! 🥕
      </Text>
      <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 40 }}>
        {session?.user?.email ? `Logged in as ${session.user.email}` : 'Welcome back!'}
      </Text>
      
      <View style={{ backgroundColor: '#007AFF', padding: 20, borderRadius: 12, marginBottom: 30 }}>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          {clientCount}
        </Text>
        <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>
          Clients
        </Text>
      </View>
      
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
        Manage your clients and grow your freelance business
      </Text>
    </View>
  );
}
