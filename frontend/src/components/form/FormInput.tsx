import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-9 px-3 rounded-md border text-sm transition-colors placeholder:text-muted',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        error ? 'border-error bg-error-light' : 'border-border bg-white',
        className,
      )}
      {...props}
    />
  ),
);
FormInput.displayName = 'FormInput';
