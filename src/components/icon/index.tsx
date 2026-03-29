import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

interface IconProps extends LucideProps {
  name: IconName;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const IconComponent = LucideIcons[name] as React.FC<LucideProps>;

  if (!IconComponent) return null;

  return (
    <IconComponent size={size} className={cn('z-10', className)} {...props} />
  );
}
