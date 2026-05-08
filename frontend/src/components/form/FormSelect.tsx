import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: FormSelectOption[];
  placeholder?: string;
  error?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ options, placeholder, error, className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-9 px-3 rounded-md border text-sm transition-colors appearance-none bg-white',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        error ? 'border-error' : 'border-border',
        className,
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
);
FormSelect.displayName = 'FormSelect';
