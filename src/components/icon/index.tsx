import { cn } from '@/lib/utils';
import { Lock, LucideIcon, LucideProps, Mail } from 'lucide-react';

export { Lock, Mail };

export type { LucideIcon, LucideProps };

interface IconProps extends LucideProps {
  icon: LucideIcon;
}

export function Icon({
  icon: IconComponent,
  className,
  size = 20,
  ...props
}: IconProps) {
  return (
    <IconComponent size={size} className={cn('z-10', className)} {...props} />
  );
}
