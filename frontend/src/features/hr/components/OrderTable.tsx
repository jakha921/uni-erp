import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/table';
import { Button } from '@/components/ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatDate } from '@/lib/utils';
import type { HrOrder } from '@/types/hr';

interface OrderTableProps {
  data: HrOrder[];
  onView?: (order: HrOrder) => void;
}

export function OrderTable({ data, onView }: OrderTableProps) {
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
      actions={(row) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={() => onView?.(row)}
        >
          Ko&apos;rish
        </Button>
      )}
    />
  );
}
