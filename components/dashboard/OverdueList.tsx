import { Text, View } from 'react-native';
import { Card } from '../ui/Card';

export function OverdueList() {
  return (
    <View className="gap-3">
      <Card>
        <Text className="font-semibold">No overdue invoices yet</Text>
        <Text className="text-gray-500">Overdue invoices will show here.</Text>
      </Card>
    </View>
  );
}

