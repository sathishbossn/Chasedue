import { Text, View } from 'react-native';
import { Card } from '../ui/Card';

export function SummaryCards() {
  return (
    <View className="flex-row flex-wrap gap-3">
      <Card className="min-w-[140px]">
        <Text className="text-xs uppercase text-gray-500">Total due</Text>
        <Text className="text-lg font-semibold">₹0</Text>
      </Card>
      <Card className="min-w-[140px]">
        <Text className="text-xs uppercase text-gray-500">Collected</Text>
        <Text className="text-lg font-semibold">₹0</Text>
      </Card>
    </View>
  );
}

