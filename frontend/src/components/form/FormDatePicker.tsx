import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormDatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      type="date"
      className={cn(
        'h-9 px-3 rounded-md border text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        error ? 'border-error' : 'border-border',
        className,
      )}
      {...props}
    />
  ),
);
FormDatePicker.displayName = 'FormDatePicker';
