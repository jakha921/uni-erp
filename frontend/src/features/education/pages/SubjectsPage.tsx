import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge } from '@/components/ui';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { SUBJECTS, DEPARTMENTS, pick, rnum } from '@/api/mock/shared-data';

// --- Types ---

interface SubjectRow {
  id: number;
  code: string;
  name: string;
  credits: number;
  lecture: number;
  practical: number;
  lab: number;
  department: string;
  type: 'Majburiy' | 'Tanlov';
  semester: number;
}

// --- Mock Data ---

const MOCK_SUBJECTS: SubjectRow[] = SUBJECTS.map((name, i) => {
  return {
    id: i + 1,
    code: `${['MAT', 'IT', 'IT', 'EC', 'MG', 'MG', 'IT', 'IT', 'PD', 'PD'][i % 10]}-${rnum(i + 80, 101, 405)}`,
    name,
    credits: rnum(i + 90, 3, 6),
    lecture: rnum(i + 93, 16, 36),
    practical: rnum(i + 94, 12, 36),
    lab: i % 3 === 0 ? rnum(i + 95, 8, 24) : 0,
    department: pick(DEPARTMENTS, i + 100),
    type: i % 3 === 2 ? 'Tanlov' : 'Majburiy',
    semester: rnum(i + 92, 1, 8),
  };
});

const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'Barcha turlar' },
  { value: 'Majburiy', label: 'Majburiy' },
  { value: 'Tanlov', label: 'Tanlov' },
];

const DEPT_FILTER_OPTIONS = [
  { value: '', label: 'Barcha kafedralar' },
  ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
];

// --- Columns ---

const subjectColumns: Column<SubjectRow>[] = [
  {
    key: 'code', header: 'Kod', width: '100px',
    render: (row) => <span className="font-medium text-slate-900 tabular-nums">{row.code}</span>,
  },
  {
    key: 'name', header: 'Fan nomi', sortable: true,
    render: (row) => <span className="text-slate-900">{row.name}</span>,
  },
  {
    key: 'type', header: 'Turi', width: '110px',
    render: (row) => (
      <Badge variant={row.type === 'Majburiy' ? 'info' : 'success'}>
        {row.type}
      </Badge>
    ),
  },
  { key: 'semester', header: 'Sem.', width: '60px', className: 'text-center', render: (row) => <span className="tabular-nums">{row.semester}</span> },
  { key: 'credits', header: 'Kredit', width: '80px', className: 'text-center', render: (row) => <span className="font-semibold tabular-nums">{row.credits}</span> },
  { key: 'lecture', header: 'Lek.', width: '70px', className: 'text-center', render: (row) => <span className="tabular-nums">{row.lecture}</span> },
  { key: 'practical', header: 'Amaliy', width: '70px', className: 'text-center', render: (row) => <span className="tabular-nums">{row.practical}</span> },
  {
    key: 'lab', header: 'Lab.', width: '70px', className: 'text-center',
    render: (row) => <span className={`tabular-nums ${row.lab > 0 ? 'text-slate-900' : 'text-slate-300'}`}>{row.lab || '—'}</span>,
  },
  {
    key: 'department', header: 'Kafedra',
    render: (row) => <span className="text-muted">{row.department}</span>,
  },
];

// --- Component ---

export function SubjectsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const filtered = useMemo(() => {
    return MOCK_SUBJECTS.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q)) return false;
      }
      if (typeFilter && s.type !== typeFilter) return false;
      if (deptFilter && s.department !== deptFilter) return false;
      return true;
    });
  }, [search, typeFilter, deptFilter]);

  const mandatoryCount = MOCK_SUBJECTS.filter((s) => s.type === 'Majburiy').length;
  const electiveCount = MOCK_SUBJECTS.filter((s) => s.type === 'Tanlov').length;
  const totalCredits = MOCK_SUBJECTS.reduce((sum, s) => sum + s.credits, 0);
  const avgCredits = (totalCredits / MOCK_SUBJECTS.length).toFixed(1);

  const activeFilterCount = (typeFilter ? 1 : 0) + (deptFilter ? 1 : 0);

  return (
    <PageContent>
      <PageHeader
        title="Fanlar"
        subtitle="O'quv fanlari va dasturlari katalogi"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Fanlar' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami fanlar" value={MOCK_SUBJECTS.length} />
        <StatCard label="Majburiy" value={mandatoryCount} />
        <StatCard label="Tanlov" value={electiveCount} />
        <StatCard label="O'rtacha kredit" value={avgCredits} />
      </div>

      <div className="mb-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Fan nomi yoki kod..."
          activeFilterCount={activeFilterCount}
          onClearFilters={() => { setTypeFilter(''); setDeptFilter(''); setSearch(''); }}
          filters={
            <>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="h-9 rounded-md border border-border px-3 text-sm"
              >
                {DEPT_FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 rounded-md border border-border px-3 text-sm"
              >
                {TYPE_FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </>
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
    </PageContent>
  );
}
