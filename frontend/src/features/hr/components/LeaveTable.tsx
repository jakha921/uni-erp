import { Check, X } from 'lucide-react';
import { DataTable, type Column } from '@/components/table';
import { Button } from '@/components/ui';
import { LeaveStatusBadge } from './LeaveStatusBadge';
import { formatDate } from '@/lib/utils';
import type { Leave } from '@/types/hr';

interface LeaveTableProps {
  data: Leave[];
  onApprove?: (leave: Leave) => void;
  onReject?: (leave: Leave) => void;
}

const LEAVE_TYPE_LABELS: Record<Leave['type'], string> = {
  annual: "Mehnat ta'tili",
  sick: 'Kasallik',
  maternity: "Dekret ta'tili",
  unpaid: "Haq to'lanmaydigan",
  business_trip: 'Xizmat safari',
  study: "O'quv ta'tili",
};

export function LeaveTable({ data, onApprove, onReject }: LeaveTableProps) {
  const columns: Column<Leave>[] = [
    {
      key: 'employeeName',
      header: 'Xodim',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-900">{row.employeeName}</div>
          <div className="text-xs text-muted mt-0.5">{row.departmentName}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Turi',
      render: (row) => (
        <span className="text-sm">{LEAVE_TYPE_LABELS[row.type]}</span>
      ),
    },
    {
      key: 'dates',
      header: 'Sana',
      render: (row) => (
        <div className="text-sm">
          <span>{formatDate(row.startDate)}</span>
          <span className="text-muted mx-1">—</span>
          <span>{formatDate(row.endDate)}</span>
        </div>
      ),
    },
    {
      key: 'days',
      header: 'Kunlar',
      render: (row) => (
        <span className="text-sm font-medium">{row.days} kun</span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => <LeaveStatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyField="id"
      emptyMessage="Ta'tillar topilmadi"
      actions={(row) =>
        row.status === 'pending' ? (
          <div className="flex items-center gap-1">
            {onApprove && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Check className="h-4 w-4 text-green-600" />}
                onClick={() => onApprove(row)}
              >
                Tasdiqlash
              </Button>
            )}
            {onReject && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<X className="h-4 w-4 text-red-600" />}
                onClick={() => onReject(row)}
              >
                Rad etish
              </Button>
            )}
          </div>
        ) : null
      }
    />
  );
}
