import { useNavigate } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DataTable, type Column } from '@/components/table/DataTable';
import { Button } from '@/components/ui/Button';
import { StudentStatusBadge } from './StudentStatusBadge';
import type { StudentListItem } from '@/types/student';

interface StudentTableProps {
  data: StudentListItem[];
  page: number;
  pageSize: number;
  onView: (id: number) => void;
  onDelete?: (student: StudentListItem) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
}

export function StudentTable({
  data,
  page,
  pageSize,
  onView,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  selectedIds,
  onSelectionChange,
}: StudentTableProps) {
  const { t } = useTranslation();
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
      header: t('students.fullName'),
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
      header: t('students.group'),
      render: (row) => (
        <span className="font-medium text-sm tabular-nums">{row.group.name}</span>
      ),
    },
    {
      key: 'course',
      header: t('students.course'),
      sortable: true,
      width: '80px',
      render: (row) => (
        <span className="text-sm tabular-nums">{row.course}-kurs</span>
      ),
    },
    {
      key: 'faculty',
      header: t('students.faculty'),
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
      header: t('students.paymentForm'),
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            row.paymentForm.code === 'grant'
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {row.paymentForm.code === 'grant' ? t('students.grant') : t('students.contract')}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => <StudentStatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable<StudentListItem>
      data={data}
      columns={columns}
      keyField="id"
      selectable={!!onSelectionChange}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      onRowClick={(row) => navigate(`/students/${row.id}`)}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      emptyMessage={t('common.noData')}
      actions={(row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-3.5 w-3.5" />}
            onClick={(e) => { e.stopPropagation(); onView(row.id as number); }}
          >
            {t('common.view')}
          </Button>
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
