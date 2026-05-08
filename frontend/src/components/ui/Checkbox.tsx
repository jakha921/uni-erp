import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cn('inline-flex items-center gap-2 cursor-pointer', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-500/20"
        {...props}
      />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  ),
);
Checkbox.displayName = 'Checkbox';
