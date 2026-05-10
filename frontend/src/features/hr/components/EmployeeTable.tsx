import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/table';
import { Avatar, Button } from '@/components/ui';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import type { EmployeeListItem } from '@/types/hr';

interface EmployeeTableProps {
  data: EmployeeListItem[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onEdit?: (employee: EmployeeListItem) => void;
  onDelete?: (employee: EmployeeListItem) => void;
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
}

export function EmployeeTable({ data, sortBy, sortOrder, onSort, onEdit, onDelete, selectedIds, onSelectionChange }: EmployeeTableProps) {
  const navigate = useNavigate();

  const columns: Column<EmployeeListItem>[] = [
    {
      key: 'fullName',
      header: 'F.I.SH',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} src={row.image} size="sm" />
          <div>
            <div className="font-medium text-slate-900">{row.fullName}</div>
            <div className="text-xs text-muted mt-0.5">{row.employeeIdNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Lavozimi',
      render: (row) => row.position.name,
    },
    {
      key: 'department',
      header: "Bo'lim",
      render: (row) => (
        <span className="text-[13px]" title={row.department.name}>
          {row.department.name.length > 28
            ? row.department.name.slice(0, 28) + '...'
            : row.department.name}
        </span>
      ),
    },
    {
      key: 'academicDegree',
      header: 'Daraja',
      render: (row) =>
        row.academicDegree.code === 'no-degree' ? (
          <span className="text-muted">—</span>
        ) : (
          row.academicDegree.name
        ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => <EmployeeStatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyField="id"
      selectable={!!onSelectionChange}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      onRowClick={(row) => navigate(`/hr/employees/${row.id}`)}
      emptyMessage="Xodimlar topilmadi"
      actions={(row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={(e) => { e.stopPropagation(); navigate(`/hr/employees/${row.id}`); }}
          >
            Ko&apos;rish
          </Button>
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(row); }}
              className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(row); }}
              className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    />
  );
}
