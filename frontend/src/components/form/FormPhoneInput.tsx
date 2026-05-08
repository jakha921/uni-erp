import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormPhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const FormPhoneInput = forwardRef<HTMLInputElement, FormPhoneInputProps>(
  ({ error, className, ...props }, ref) => (
    <div className="flex">
      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-slate-50 text-sm text-muted">
        +998
      </span>
      <input
        ref={ref}
        type="tel"
        placeholder="(XX) XXX-XX-XX"
        className={cn(
          'flex-1 h-9 px-3 rounded-r-md border text-sm transition-colors placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
          error ? 'border-error' : 'border-border',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
FormPhoneInput.displayName = 'FormPhoneInput';
