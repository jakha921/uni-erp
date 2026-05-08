import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormMoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
  currency?: string;
}

export const FormMoneyInput = forwardRef<HTMLInputElement, FormMoneyInputProps>(
  ({ error, currency = "so'm", className, ...props }, ref) => (
    <div className="flex">
      <input
        ref={ref}
        type="number"
        className={cn(
          'flex-1 h-9 px-3 rounded-l-md border text-sm transition-colors placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
          error ? 'border-error' : 'border-border',
          className,
        )}
        {...props}
      />
      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-border bg-slate-50 text-sm text-muted">
        {currency}
      </span>
    </div>
  ),
);
FormMoneyInput.displayName = 'FormMoneyInput';
