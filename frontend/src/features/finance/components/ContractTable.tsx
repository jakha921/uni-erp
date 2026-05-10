import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/table';
import { Badge } from '@/components/ui';
import { DropdownMenu } from '@/components/overlays';
import { formatMoney } from '@/lib/utils';
import type { Contract, ContractType, ContractStatus } from '@/types/finance';

const CONTRACT_TYPE_CONFIG: Record<ContractType, { variant: 'info' | 'warning' | 'success' | 'default'; label: string }> = {
  bazoviy: { variant: 'info', label: 'Bazoviy' },
  tabaqalashtirilgan: { variant: 'warning', label: 'Tabaqalashtirilgan' },
  grant: { variant: 'success', label: 'Grant' },
  xorijiy: { variant: 'default', label: 'Xorijiy' },
};

const CONTRACT_STATUS_CONFIG: Record<ContractStatus, { variant: 'success' | 'default' | 'error'; label: string }> = {
  active: { variant: 'success', label: 'Faol' },
  completed: { variant: 'default', label: 'Yakunlangan' },
  cancelled: { variant: 'error', label: 'Bekor qilingan' },
};

interface ContractTableProps {
  data: Contract[];
  page?: number;
  pageSize?: number;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
  onRowClick?: (contract: Contract) => void;
}

export function ContractTable({
  data,
  page = 1,
  pageSize = 10,
  onEdit,
  onDelete,
  onRowClick,
}: ContractTableProps) {
  const navigate = useNavigate();

  const columns: Column<Contract>[] = [
    {
      key: 'idx',
      header: '#',
      width: '50px',
      render: (_, index) => (
        <span className="text-slate-500">{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      key: 'contractNumber',
      header: 'Kontrakt №',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-slate-900">{row.contractNumber}</span>
      ),
    },
    {
      key: 'studentName',
      header: 'Talaba',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.studentName}</p>
          <p className="text-[11.5px] text-muted">{row.groupName}</p>
        </div>
      ),
    },
    {
      key: 'facultyName',
      header: 'Fakultet',
      render: (row) => (
        <span className="text-[12.5px]">{(row.facultyName ?? '').split(' ').slice(0, 2).join(' ')}</span>
      ),
    },
    {
      key: 'level',
      header: 'Kurs',
      render: (row) => <span>{row.level}</span>,
    },
    {
      key: 'contractType',
      header: 'Turi',
      render: (row) => {
        const cfg = CONTRACT_TYPE_CONFIG[row.contractType];
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: 'contractAmount',
      header: 'Summa',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="font-semibold tabular-nums">{formatMoney(row.contractAmount)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: "To'langan",
      render: (row) => {
        const pct =
          row.contractAmount > 0
            ? Math.round((row.paidAmount / row.contractAmount) * 100)
            : 0;
        return (
          <div className="min-w-[140px]">
            <p className="mb-1 text-xs tabular-nums text-muted">
              {formatMoney(row.paidAmount)} ({pct}%)
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded bg-primary-500 transition-all duration-300"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'debtAmount',
      header: 'Qarz',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span
          className={`font-semibold tabular-nums ${
            row.debtAmount > 0 ? 'text-red-700' : 'text-green-700'
          }`}
        >
          {formatMoney(row.debtAmount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => {
        const cfg = CONTRACT_STATUS_CONFIG[row.status];
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyField="id"
      onRowClick={(row) => onRowClick ? onRowClick(row) : navigate(`/finance/contracts/${row.id}`)}
      emptyMessage="Kontraktlar topilmadi"
      actions={(row) => (
        <DropdownMenu
          items={[
            {
              label: 'Tafsilotlar',
              icon: <Eye className="h-4 w-4" />,
              onClick: () => navigate(`/finance/contracts/${row.id}`),
            },
            ...(onEdit
              ? [
                  {
                    label: 'Tahrirlash',
                    icon: <Pencil className="h-4 w-4" />,
                    onClick: () => onEdit(row),
                  },
                ]
              : []),
            ...(onDelete
              ? [
                  {
                    label: "O'chirish",
                    icon: <Trash2 className="h-4 w-4" />,
                    danger: true,
                    onClick: () => onDelete(row),
                  },
                ]
              : []),
          ]}
        />
      )}
    />
  );
}
