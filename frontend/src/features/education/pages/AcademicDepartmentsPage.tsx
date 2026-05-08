import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { FilterBar } from '@/components/table';
import { DEPARTMENTS, FACULTIES, generateName, rnum, pick } from '@/api/mock/shared-data';

// --- Types ---

interface Department {
  id: number;
  name: string;
  faculty: string;
  head: string;
  headInitials: string;
  staffCount: number;
  studentCount: number;
  subjectCount: number;
  color: string;
}

// --- Mock Data ---

const COLORS = ['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444', '#10B981'];

const MOCK_DEPARTMENTS: Department[] = DEPARTMENTS.map((name, i) => {
  const headName = generateName(i + 500);
  const prefix = i % 3 === 0 ? 'prof.' : 'dots.';
  return {
    id: i + 1,
    name,
    faculty: pick(FACULTIES, i + 10),
    head: `${prefix} ${headName.short}`,
    headInitials: headName.initials,
    staffCount: rnum(i + 50, 12, 32),
    studentCount: rnum(i + 60, 198, 567),
    subjectCount: rnum(i + 70, 3, 9),
    color: COLORS[i % COLORS.length] as string,
  };
});

// --- Component ---

export function AcademicDepartmentsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_DEPARTMENTS.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.faculty.toLowerCase().includes(q) || d.head.toLowerCase().includes(q);
  });

  return (
    <PageContent>
      <PageHeader
        title="Kafedralar"
        subtitle={`Jami: ${MOCK_DEPARTMENTS.length} ta kafedra`}
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Kafedralar' }]}
      />

      <div className="mb-5">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Kafedra qidirish..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((dept) => (
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-slate-500">Kafedralar topilmadi</p>
          <p className="mt-1 text-xs text-slate-400">Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring</p>
        </div>
      )}
    </PageContent>
  );
}

function DepartmentCard({ department }: { department: Department }) {
  return (
    <Card noPadding className="overflow-hidden">
      {/* Colored top border */}
      <div className="h-1" style={{ backgroundColor: department.color }} />

      <div className="p-5">
        {/* Faculty + name */}
        <div className="mb-3.5">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {department.faculty}
          </p>
          <h3 className="mt-1 text-[15px] font-semibold text-slate-900 leading-snug">
            {department.name}
          </h3>
        </div>

        {/* Head */}
        <div className="mb-3 flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold text-white">
            {department.headInitials}
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Mudir</p>
            <p className="text-[12.5px] font-semibold text-slate-900">{department.head}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Xodimlar', value: department.staffCount },
            { label: 'Talabalar', value: department.studentCount },
            { label: 'Fanlar', value: department.subjectCount },
          ].map((stat) => (
            <div key={stat.label} className="rounded-md bg-slate-50 p-2 text-center">
              <p className="text-base font-bold text-slate-900 tabular-nums">{stat.value}</p>
              <p className="mt-0.5 text-[10.5px] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
