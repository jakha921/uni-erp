import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Spinner } from '@/components/ui';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { useSubjects } from '@/api/hooks/useEducation';
import { useDepartments } from '@/api/hooks/useCore';
import type { Subject } from '@/types/education';

// --- Columns ---

const subjectColumns: Column<Subject>[] = [
  {
    key: 'code', header: 'Kod', width: '100px',
    render: (row) => <span className="font-medium text-slate-900 tabular-nums">{row.code}</span>,
  },
  {
    key: 'name', header: 'Fan nomi', sortable: true,
    render: (row) => <span className="text-slate-900">{row.name}</span>,
  },
  { key: 'credits', header: 'Kredit', width: '80px', className: 'text-center', render: (row) => <span className="font-semibold tabular-nums">{row.credits}</span> },
  { key: 'hoursLecture', header: 'Lek.', width: '70px', className: 'text-center', render: (row) => <span className="tabular-nums">{row.hoursLecture}</span> },
  { key: 'hoursPractice', header: 'Amaliy', width: '70px', className: 'text-center', render: (row) => <span className="tabular-nums">{row.hoursPractice}</span> },
  {
    key: 'departmentName', header: 'Kafedra',
    render: (row) => <span className="text-muted">{row.departmentName}</span>,
  },
];

// --- Component ---

export function SubjectsPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects({ search: search || undefined });
  const { data: departmentsData, isLoading: deptsLoading } = useDepartments();

  const subjects = subjectsData?.data ?? [];
  const departments = departmentsData ?? [];

  const isLoading = subjectsLoading || deptsLoading;

  const DEPT_FILTER_OPTIONS = useMemo(() => [
    { value: '', label: 'Barcha kafedralar' },
    ...departments.map((d) => ({ value: String(d.id), label: d.name })),
  ], [departments]);

  const filtered = useMemo(() => {
    return subjects.filter((s) => {
      if (deptFilter && String(s.departmentId) !== deptFilter) return false;
      return true;
    });
  }, [subjects, deptFilter]);

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const avgCredits = subjects.length > 0 ? (totalCredits / subjects.length).toFixed(1) : '0';

  const activeFilterCount = deptFilter ? 1 : 0;

  return (
    <PageContent>
      <PageHeader
        title="Fanlar"
        subtitle="O'quv fanlari va dasturlari katalogi"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Fanlar' }]}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <StatCard label="Jami fanlar" value={subjects.length} />
            <StatCard label="Kafedralar" value={departments.length} />
            <StatCard label="Jami kreditlar" value={totalCredits} />
            <StatCard label="O'rtacha kredit" value={avgCredits} />
          </div>

          <div className="mb-4">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Fan nomi yoki kod..."
              activeFilterCount={activeFilterCount}
              onClearFilters={() => { setDeptFilter(''); setSearch(''); }}
              filters={
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="h-9 rounded-md border border-border px-3 text-sm"
                >
                  {DEPT_FILTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              }
              actions={
                <Badge variant="default">{filtered.length} ta fan</Badge>
              }
            />
          </div>

          <Card noPadding>
            <DataTable
              data={filtered}
              columns={subjectColumns}
              keyField="id"
              emptyMessage="Fanlar topilmadi"
            />
          </Card>
        </>
      )}
    </PageContent>
  );
}
