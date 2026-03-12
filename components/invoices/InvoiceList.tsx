import { Text, View } from 'react-native';
import { Card } from '../ui/Card';

export function InvoiceList() {
  return (
    <View className="gap-3">
      <Card>
        <Text className="font-semibold">Sample invoice</Text>
        <Text className="text-gray-500">This will show your invoices.</Text>
      </Card>
    </View>
  );
}

