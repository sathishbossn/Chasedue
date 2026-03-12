import { ComponentProps } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { cn } from '../../lib/cn';

type Props = ComponentProps<typeof TouchableOpacity> & {
  label: string;
};

export function Button({ label, className, ...rest }: Props) {
  return (
    <TouchableOpacity
      className={cn(
        'rounded-md bg-primary px-4 py-2 items-center justify-center',
        className,
      )}
      {...rest}
    >
      <Text className="font-semibold text-white">{label}</Text>
    </TouchableOpacity>
  );
}

