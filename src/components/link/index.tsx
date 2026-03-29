import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { NavLinkProps, NavLink as RouterNavLink } from 'react-router';

type LinkProps = Omit<NavLinkProps, 'className'> & {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            className,
            isActive && activeClassName,
            isPending && pendingClassName,
          )
        }
        {...props}
      />
    );
  },
);
