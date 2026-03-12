import { Text, View } from 'react-native';
import { Card } from '../ui/Card';

export function ClientList() {
  return (
    <View className="gap-3">
      <Card>
        <Text className="font-semibold">Sample client</Text>
        <Text className="text-gray-500">This will show your clients.</Text>
      </Card>
    </View>
  );
}

