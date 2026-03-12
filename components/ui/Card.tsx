import { ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: Props) {
  return (
    <View className={cn('rounded-lg border border-gray-200 bg-white p-4', className)}>
      {children}
    </View>
  );
}

