import { ComponentProps } from 'react';
import { TextInput } from 'react-native';
import { cn } from '../../lib/cn';

type Props = ComponentProps<typeof TextInput>;

export function Input({ className, ...rest }: Props) {
  return (
    <TextInput
      className={cn(
        'rounded-md border border-gray-300 px-3 py-2 text-base',
        className,
      )}
      {...rest}
    />
  );
}

