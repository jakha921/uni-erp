import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  children: ReactNode;
  className?: string;
}

export function BulkActionsBar({ count, onClear, children, className }: BulkActionsBarProps) {
  if (count === 0) return null;
  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-lg',
      className,
    )}>
      <span className="text-sm font-medium text-primary-700">{count} ta tanlandi</span>
      <div className="flex items-center gap-2">
        {children}
      </div>
      <div className="flex-1" />
      <button onClick={onClear} className="p-1 rounded hover:bg-primary-100">
        <X className="h-4 w-4 text-primary-600" />
      </button>
    </div>
  );
}
