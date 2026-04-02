import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <SidebarLayout>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ href: '/(tabs)' }} />
        <Stack.Screen name="clients" options={{ href: '/(tabs)/clients' }} />
        <Stack.Screen name="invoices" options={{ href: '/(tabs)/invoices' }} />
        <Stack.Screen name="expenses" options={{ href: '/(tabs)/expenses' }} />
        <Stack.Screen name="profile" options={{ href: '/(tabs)/profile' }} />
      </Stack>
    </SidebarLayout>
  );
}