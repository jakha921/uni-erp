import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const BRANCHES = [
  { value: 'navoiy', label: 'Navoiy (bosh filial)' },
  { value: 'zarafshon', label: 'Zarafshon filiali' },
  { value: 'uchquduq', label: 'Uchquduq filiali' },
] as const;

interface BranchSelectorProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
}

export const BranchSelector = forwardRef<HTMLSelectElement, BranchSelectorProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const selectId = id ?? 'branch-selector';
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-10 px-3 rounded-lg border text-sm transition-colors appearance-none bg-white',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
            error ? 'border-red-300' : 'border-slate-200',
            className,
          )}
          {...props}
        >
          {BRANCHES.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
BranchSelector.displayName = 'BranchSelector';
