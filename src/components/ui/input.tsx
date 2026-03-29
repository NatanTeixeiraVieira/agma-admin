import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Options, withMask } from 'use-mask-input';

type InputProps = React.ComponentProps<'input'> & {
  mask?: string | string[];
  maskOptions?: Options;
};

function Input({
  className,
  mask,
  maskOptions,
  placeholder,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const maskProps = mask
    ? {
        ref: withMask(mask, {
          placeholder: '',
          showMaskOnFocus: false,
          showMaskOnHover: false,
          autoUnmask: true,
          jitMasking: true,
          ...maskOptions,
        }),
      }
    : {};

  return (
    <div className="relative w-full">
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        data-slot="input"
        className={cn(
          'border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
          'placeholder:text-muted-foreground',
          'selection:bg-primary selection:text-primary-foreground',
          'dark:aria-invalid:ring-destructive/40 dark:bg-input/30',
          'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20  aria-invalid:border-destructive',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          isPassword && 'pr-10',
          className,
        )}
        placeholder={placeholder}
        {...props}
        {...maskProps}
      />

      {isPassword && !!props.value && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

export { Input };
