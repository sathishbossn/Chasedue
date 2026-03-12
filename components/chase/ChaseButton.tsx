import { ComponentProps } from 'react';
import { Button } from '../ui/Button';

type Props = Omit<ComponentProps<typeof Button>, 'label'> & {
  label?: string;
};

export function ChaseButton({ label = 'Chase on WhatsApp', ...rest }: Props) {
  return <Button label={label} {...rest} />;
}

