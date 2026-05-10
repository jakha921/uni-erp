import { Eye, Trash2, ChevronRight } from 'lucide-react';
import { DataTable, type Column } from '@/components/table';
import { Button } from '@/components/ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatDate } from '@/lib/utils';
import type { HrOrder } from '@/types/hr';

const NEXT_STATUS: Partial<Record<HrOrder['status'], HrOrder['status']>> = {
  draft: 'review',
  review: 'signed',
};

const NEXT_STATUS_LABEL: Partial<Record<HrOrder['status'], string>> = {
  draft: "Ko'rib chiqishga",
  review: 'Imzolash',
};

interface OrderTableProps {
  data: HrOrder[];
  onView?: (order: HrOrder) => void;
  onStatusChange?: (order: HrOrder, status: HrOrder['status']) => void;
  onDelete?: (order: HrOrder) => void;
}

export function OrderTable({ data, onView, onStatusChange, onDelete }: OrderTableProps) {
  const columns: Column<HrOrder>[] = [
    {
      key: 'number',
      header: 'Raqam va sana',
      width: '140px',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.number}</div>
          <div className="text-xs text-muted mt-0.5">{formatDate(row.date)}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Buyruq turi',
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: row.typeColor }}
          />
          <span className="text-sm font-medium">{row.typeLabel}</span>
        </span>
      ),
    },
    {
      key: 'employeeName',
      header: 'Xodim',
      render: (row) => <span className="text-sm">{row.employeeName}</span>,
    },
    {
      key: 'basis',
      header: 'Asos',
      render: (row) => <span className="text-sm text-muted">{row.basis}</span>,
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => <OrderStatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyField="id"
      onRowClick={onView}
      emptyMessage="Buyruqlar topilmadi"
      actions={(row) => {
        const nextStatus = NEXT_STATUS[row.status];
        const nextLabel = NEXT_STATUS_LABEL[row.status];
        return (
          <div className="flex items-center gap-1 justify-end">
            {onStatusChange && nextStatus && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ChevronRight className="h-4 w-4" />}
                onClick={(e) => { e.stopPropagation(); onStatusChange(row, nextStatus); }}
                title={nextLabel}
              >
                {nextLabel}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Eye className="h-4 w-4" />}
              onClick={(e) => { e.stopPropagation(); onView?.(row); }}
            >
              Ko&apos;rish
            </Button>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                className="h-7 w-7 rounded-md hover:bg-red-50 text-red-400 inline-flex items-center justify-center transition-colors"
                title="O'chirish"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      }}
    />
  );
}
