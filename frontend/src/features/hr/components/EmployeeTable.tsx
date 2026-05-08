import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/table';
import { Avatar, Button } from '@/components/ui';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import type { EmployeeListItem } from '@/types/hr';

interface EmployeeTableProps {
  data: EmployeeListItem[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

export function EmployeeTable({ data, sortBy, sortOrder, onSort }: EmployeeTableProps) {
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
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      onRowClick={(row) => navigate(`/hr/employees/${row.id}`)}
      emptyMessage="Xodimlar topilmadi"
      actions={(row) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={() => navigate(`/hr/employees/${row.id}`)}
        >
          Ko&apos;rish
        </Button>
      )}
    />
  );
}
