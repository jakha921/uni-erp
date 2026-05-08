import type { ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  className?: string;
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Qidirish...",
  filters,
  actions,
  activeFilterCount = 0,
  onClearFilters,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          {search && (
            <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-100">
              <X className="h-3.5 w-3.5 text-muted" />
            </button>
          )}
        </div>
      )}
      {filters}
      {activeFilterCount > 0 && onClearFilters && (
        <button onClick={onClearFilters} className="inline-flex items-center gap-1 text-xs text-muted hover:text-slate-700">
          <X className="h-3 w-3" />
          Tozalash ({activeFilterCount})
        </button>
      )}
      <div className="flex-1" />
      {actions}
    </div>
  );
}
