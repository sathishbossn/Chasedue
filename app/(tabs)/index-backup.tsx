import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

const PRIMARY = '#FF006E';

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No session. Please log in.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/landing')}>
          <Text style={styles.primaryBtnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'there';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.welcome}>Welcome, {userName}!</Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Outstanding Invoices</Text>
          <Text style={styles.sectionLink}>see who owes you</Text>
        </View>
        <View style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={40} color="#DDD" />
          <Text style={styles.emptyText}>No outstanding invoices</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/invoices')}>
            <Text style={styles.emptyBtnText}>Create Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
            <Text style={styles.sectionLink}>view all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyCard}>
          <Ionicons name="receipt-outline" size={40} color="#DDD" />
          <Text style={styles.emptyText}>No expenses yet</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/expenses')}>
            <Text style={styles.emptyBtnText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Clients</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/clients')}>
            <Text style={styles.sectionLink}>view all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyCard}>
          <Ionicons name="people-outline" size={40} color="#DDD" />
          <Text style={styles.emptyText}>No clients yet</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/clients')}>
            <Text style={styles.emptyBtnText}>Add Client</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  content: { padding: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8', padding: 32 },
  errorText: { fontSize: 16, color: '#666', marginBottom: 20 },
  welcome: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 28 },
  section: { marginBottom: 36 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  sectionLink: { fontSize: 13, color: '#FF006E', fontWeight: '500' },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: '#EEEEEE' },
  emptyText: { fontSize: 15, color: '#999', marginTop: 12, marginBottom: 20 },
  emptyBtn: { borderWidth: 1.5, borderColor: '#FF006E', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  emptyBtnText: { color: '#FF006E', fontWeight: '600', fontSize: 14 },
  primaryBtn: { backgroundColor: '#FF006E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
