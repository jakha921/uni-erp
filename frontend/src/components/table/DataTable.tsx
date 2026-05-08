import { type ReactNode } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/Checkbox';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField?: string;
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
  onRowClick?: (row: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  actions?: (row: T) => ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  keyField = 'id',
  selectable,
  selectedIds,
  onSelectionChange,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = "Ma'lumot topilmadi",
  className,
  rowClassName,
  actions,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds?.size === data.length;

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((row) => (row as Record<string, unknown>)[keyField] as string | number)));
    }
  };

  const handleSelectRow = (id: string | number) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFB]">
            {selectable && (
              <th className="w-12 px-3 py-2.5">
                <Checkbox
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]',
                  col.sortable && 'cursor-pointer select-none hover:text-slate-700',
                  col.className,
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    sortBy === col.key
                      ? (sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)
                      : <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="w-14 px-3 py-2.5" />}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-3 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="h-10 w-10 text-slate-200" />
                  <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                  <p className="text-xs text-slate-400">Filtrlarni o&apos;zgartirib ko&apos;ring</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const id = (row as Record<string, unknown>)[keyField] as string | number;
              const isSelected = selectedIds?.has(id);
              return (
                <tr
                  key={id ?? i}
                  className={cn(
                    'border-b border-[#F8FAFB] hover:bg-[#F8FAFB] transition-colors',
                    isSelected && 'bg-primary-50/50',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row),
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="w-12 px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={!!isSelected} onChange={() => handleSelectRow(id)} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-3 py-2.5 text-[13px] text-slate-700', col.className)}>
                      {col.render ? col.render(row, i) : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
