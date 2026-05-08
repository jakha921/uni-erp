import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/table/DataTable';
import { Button } from '@/components/ui/Button';
import { StudentStatusBadge } from './StudentStatusBadge';
import type { StudentListItem } from '@/types/student';

interface StudentTableProps {
  data: StudentListItem[];
  page: number;
  pageSize: number;
  onView: (id: number) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

export function StudentTable({
  data,
  page,
  pageSize,
  onView,
  sortBy,
  sortOrder,
  onSort,
}: StudentTableProps) {
  const navigate = useNavigate();

  const columns: Column<StudentListItem>[] = [
    {
      key: 'idx',
      header: '№',
      width: '50px',
      render: (_, index) => (
        <span className="text-slate-500">{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      key: 'fullName',
      header: 'F.I.SH',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 text-sm">{row.fullName}</div>
          <div className="text-xs text-muted font-mono">{row.studentIdNumber}</div>
        </div>
      ),
    },
    {
      key: 'group',
      header: 'Guruh',
      render: (row) => (
        <span className="font-medium text-sm tabular-nums">{row.group.name}</span>
      ),
    },
    {
      key: 'course',
      header: 'Kurs',
      sortable: true,
      width: '80px',
      render: (row) => (
        <span className="text-sm tabular-nums">{row.course}-kurs</span>
      ),
    },
    {
      key: 'faculty',
      header: 'Fakultet',
      render: (row) => {
        const name = row.faculty.name;
        return (
          <span className="text-sm text-slate-600 block max-w-[180px] truncate">
            {name.length > 26 ? name.slice(0, 26) + '…' : name}
          </span>
        );
      },
    },
    {
      key: 'paymentForm',
      header: "To'lov",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            row.paymentForm.code === 'grant'
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {row.paymentForm.code === 'grant' ? 'Grant' : 'Kontrakt'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => <StudentStatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable<StudentListItem>
      data={data}
      columns={columns}
      keyField="id"
      onRowClick={(row) => navigate(`/students/${row.id}`)}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      emptyMessage="Talabalar topilmadi"
      actions={(row) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye className="h-3.5 w-3.5" />}
          onClick={(e) => { e.stopPropagation(); onView(row.id as number); }}
        >
          Ko&apos;rish
        </Button>
      )}
    />
  );
}
