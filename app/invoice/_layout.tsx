import { Stack } from 'expo-router';

export default function InvoiceLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Invoice',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#004d4d',
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            borderBottomWidth: 1,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            color: '#ffffff',
          },
        }} 
      />
    </Stack>
  );
}
