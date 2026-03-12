import { View } from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function InvoiceForm() {
  return (
    <View className="gap-3">
      <Input placeholder="Amount" keyboardType="numeric" />
      <Input placeholder="Due date (YYYY-MM-DD)" />
      <Button label="Save invoice" />
    </View>
  );
}

