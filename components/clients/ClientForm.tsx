import { View } from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ClientForm() {
  return (
    <View className="gap-3">
      <Input placeholder="Client name" />
      <Input placeholder="WhatsApp number" keyboardType="phone-pad" />
      <Button label="Save client" />
    </View>
  );
}

