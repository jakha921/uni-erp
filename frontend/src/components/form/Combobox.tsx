import { useState, useRef, useEffect, forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, X, Loader2 } from 'lucide-react';

export interface ComboboxOption {
  value: string | number;
  label: string;
}

interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  options: ComboboxOption[];
  value?: string | number | null;
  onChange: (value: string | number | null) => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
  error?: boolean;
  clearable?: boolean;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  ({ options, value, onChange, onSearch, loading, error, clearable = true, placeholder, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);

    const filtered = query
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
          setQuery('');
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <div
          className={cn(
            'flex items-center h-9 rounded-md border text-sm transition-colors',
            'focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500',
            error ? 'border-error' : 'border-border',
          )}
        >
          <input
            ref={ref}
            type="text"
            value={open ? query : selected?.label ?? ''}
            placeholder={placeholder ?? "Tanlang..."}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => {
              setOpen(true);
              setQuery('');
            }}
            className="flex-1 h-full px-3 bg-transparent outline-none text-sm"
            autoComplete="off"
            {...props}
          />
          <div className="flex items-center pr-2 gap-0.5">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
            {clearable && value != null && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                  setQuery('');
                }}
                className="p-0.5 hover:bg-slate-100 rounded"
              >
                <X className="h-3.5 w-3.5 text-muted" />
              </button>
            )}
            <ChevronDown className={cn('h-4 w-4 text-muted transition-transform', open && 'rotate-180')} />
          </div>
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-border bg-surface shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted">
                {loading ? 'Yuklanmoqda...' : 'Topilmadi'}
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors',
                    option.value === value && 'bg-primary-50 text-primary-700 font-medium',
                  )}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  },
);
Combobox.displayName = 'Combobox';
