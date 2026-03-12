import React from 'react';
import { View, Text } from 'react-native';

export default function Invoices() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Invoices</Text>
      <Text style={{ textAlign: 'center', color: '#666' }}>
        Invoice management coming soon! Create, send, and track payments.
      </Text>
    </View>
  );
}
