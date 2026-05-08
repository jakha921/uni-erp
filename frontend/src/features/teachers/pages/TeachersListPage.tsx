import { useState, useMemo } from 'react';
import { Search, MoreHorizontal, Upload, Plus } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Avatar, Spinner } from '@/components/ui';
import { DataTable, Pagination, type Column } from '@/components/table';
import { useTeachersList } from '@/api/hooks/useTeachers';
import type { TeacherListItem } from '@/types/teacher';

// --- Employment form labels ---
const EMPLOYMENT_LABELS: Record<string, string> = {
  shtatliy: 'Shtatli',
  sovmestitel: 'Sovmestitel',
  soatbay: 'Soatbay',
};

export function TeachersListPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [empForm, setEmpForm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: teachersData, isLoading } = useTeachersList({
    page,
    pageSize,
    search: search || undefined,
    departmentId: dept ? Number(dept) : undefined,
    employmentForm: empForm || undefined,
  });

  const teachers = teachersData?.data ?? [];
  const total = teachersData?.total ?? 0;
  const totalPages = teachersData?.totalPages ?? Math.max(1, Math.ceil(total / pageSize));

  // Compute department list from data for filter
  const departments = useMemo(() => {
    const depts = Array.from(new Set(teachers.map((t) => t.department)));
    return depts.sort();
  }, [teachers]);

  // Stats computed from current page data (best-effort until API provides stats endpoint)
  const stats = useMemo(() => {
    const shtatli = teachers.filter((t) => t.employmentForm === 'shtatliy').length;
    const soatbay = teachers.filter((t) => t.employmentForm === 'soatbay').length;
    const phd = teachers.filter((t) => t.academicDegree && t.academicDegree !== '—').length;
    const professor = teachers.filter((t) => t.academicRank?.toLowerCase().includes('professor')).length;
    return { total, shtatli, soatbay, phd, professor };
  }, [teachers, total]);

  const columns: Column<TeacherListItem>[] = [
    {
      key: 'fullName',
      header: 'F.I.Sh.',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.fullName} size="sm" />
          <div>
            <div className="text-[13px] font-medium text-slate-900">{row.fullName}</div>
            <div className="text-[11px] text-muted">{row.shortName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Kafedra',
      render: (row) => <span className="text-[13px] text-slate-700">{row.department}</span>,
    },
    {
      key: 'position',
      header: 'Lavozim',
      render: (row) => <span className="text-[13px] text-slate-700">{row.position}</span>,
    },
    {
      key: 'academicDegree',
      header: 'Daraja',
      render: (row) =>
        row.academicDegree && row.academicDegree !== '—' ? (
          <Badge variant="info">{row.academicDegree}</Badge>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: 'employmentForm',
      header: 'Shakl',
      render: (row) => (
        <Badge variant={row.employmentForm === 'shtatliy' ? 'success' : 'warning'} dot>
          {EMPLOYMENT_LABELS[row.employmentForm] ?? row.employmentForm}
        </Badge>
      ),
    },
    {
      key: 'academicRank',
      header: 'Unvon',
      render: (row) => (
        <span className="text-[13px] text-slate-700">{row.academicRank || '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => {
        const variant = row.status === 'active' ? 'success' : row.status === 'leave' ? 'warning' : 'error';
        const label = row.status === 'active' ? 'Faol' : row.status === 'leave' ? "Ta'tilda" : 'Nofaol';
        return (
          <Badge variant={variant} dot>
            {label}
          </Badge>
        );
      },
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="O'qituvchilar"
        subtitle="O'qituvchilar ro'yxati va statistikasi"
        breadcrumbs={[
          { label: "Ta'lim", path: '/teachers' },
          { label: "O'qituvchilar" },
        ]}
      />

      {/* KPI StatCards */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Jami o'qituvchilar" value={stats.total.toString()} />
        <StatCard label="Shtatli" value={stats.shtatli.toString()} />
        <StatCard label="Soatbay" value={stats.soatbay.toString()} />
        <StatCard label="PhD / DSc" value={stats.phd.toString()} />
        <StatCard label="Professor" value={stats.professor.toString()} />
      </div>

      {/* Table with toolbar inside */}
      <Card noPadding className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#F1F5F9] px-4 py-3">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="F.I.Sh. bo'yicha qidirish..."
              className="h-9 w-full rounded-lg border border-border pl-8 pr-3 text-[13px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
          </div>
          <select
            value={dept}
            onChange={(e) => {
              setDept(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border px-3 text-[13px]"
          >
            <option value="">Barchasi</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={empForm}
            onChange={(e) => {
              setEmpForm(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border px-3 text-[13px]"
          >
            <option value="">Barchasi</option>
            <option value="shtatliy">Shtatli</option>
            <option value="soatbay">Soatbay</option>
            <option value="sovmestitel">Sovmestitel</option>
          </select>
          <div className="flex-1" />
          <Button variant="secondary" size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />}>
            Eksport
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Yangi o&apos;qituvchi
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <DataTable<TeacherListItem>
              data={teachers}
              columns={columns}
              keyField="id"
              actions={() => (
                <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              )}
            />
            <div className="border-t border-[#F1F5F9] px-4 py-3">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                total={total}
                pageSize={pageSize}
              />
            </div>
          </>
        )}
      </Card>
    </PageContent>
  );
}
