import { useState, useMemo } from 'react';
import { Users, BookOpen, Star, X } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Spinner } from '@/components/ui';
import { FilterBar } from '@/components/table';
import { useDepartments, useFaculties } from '@/api/hooks/useCore';
import type { Department } from '@/types/core';

// --- Colors for department cards ---

const COLORS = ['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444', '#10B981'];

// --- Component ---

export function AcademicDepartmentsPage() {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<{ dept: Department; facultyName: string } | null>(null);

  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const { data: faculties, isLoading: facultiesLoading } = useFaculties();

  const isLoading = deptsLoading || facultiesLoading;

  const deptList = departments ?? [];
  const facultyMap = useMemo(() => {
    const map = new Map<number, string>();
    (faculties ?? []).forEach((f) => map.set(f.id, f.name));
    return map;
  }, [faculties]);

  const filtered = useMemo(() => {
    if (!search) return deptList;
    const q = search.toLowerCase();
    return deptList.filter((d) => {
      const facultyName = facultyMap.get(d.facultyId) ?? '';
      return (
        d.name.toLowerCase().includes(q) ||
        facultyName.toLowerCase().includes(q) ||
        (d.headName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [deptList, search, facultyMap]);

  if (isLoading) {
    return (
      <PageContent>
        <PageHeader
          title="Kafedralar"
          subtitle="Yuklanmoqda..."
          breadcrumbs={[{ label: "Ta'lim" }, { label: 'Kafedralar' }]}
        />
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title="Kafedralar"
        subtitle={`Jami: ${deptList.length} ta kafedra`}
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
        {filtered.map((dept, i) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            facultyName={facultyMap.get(dept.facultyId) ?? ''}
            color={COLORS[i % COLORS.length]!}
            onClick={() => setSelectedDept({ dept, facultyName: facultyMap.get(dept.facultyId) ?? '' })}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-slate-500">Kafedralar topilmadi</p>
          <p className="mt-1 text-xs text-slate-400">Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring</p>
        </div>
      )}

      {selectedDept && (
        <DepartmentSlideOver
          department={selectedDept.dept}
          facultyName={selectedDept.facultyName}
          onClose={() => setSelectedDept(null)}
        />
      )}
    </PageContent>
  );
}

function DepartmentCard({
  department,
  facultyName,
  color,
  onClick,
}: {
  department: Department;
  facultyName: string;
  color: string;
  onClick: () => void;
}) {
  const headInitials = department.headName
    ? department.headName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'N/A';

  return (
    <div className="cursor-pointer" onClick={onClick}>
    <Card noPadding className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Colored top border */}
      <div className="h-1" style={{ backgroundColor: color }} />

      <div className="p-5">
        {/* Faculty + name */}
        <div className="mb-3.5">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {facultyName}
          </p>
          <h3 className="mt-1 text-[15px] font-semibold text-slate-900 leading-snug">
            {department.name}
          </h3>
        </div>

        {/* Head */}
        <div className="mb-3 flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold text-white">
            {headInitials}
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Mudir</p>
            <p className="text-[12.5px] font-semibold text-slate-900">
              {department.headName ?? "Belgilanmagan"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md bg-slate-50 p-2 text-center">
            <div className="flex justify-center mb-0.5"><Users className="h-3.5 w-3.5 text-slate-400" /></div>
            <p className="text-sm font-bold text-slate-900">{department.staffCount ?? '—'}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">O'qituvchi</p>
          </div>
          <div className="rounded-md bg-slate-50 p-2 text-center">
            <div className="flex justify-center mb-0.5"><BookOpen className="h-3.5 w-3.5 text-slate-400" /></div>
            <p className="text-sm font-bold text-slate-900">{department.studentCount ?? '—'}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Talaba</p>
          </div>
          <div className="rounded-md bg-slate-50 p-2 text-center">
            <div className="flex justify-center mb-0.5"><Star className="h-3.5 w-3.5 text-slate-400" /></div>
            <p className="text-sm font-bold text-slate-900">{department.avgGrade ?? '—'}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">O'rtacha</p>
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
}

function DepartmentSlideOver({
  department,
  facultyName,
  onClose,
}: {
  department: Department;
  facultyName: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Kafedra tafsiloti</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 p-5 space-y-5">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{facultyName}</p>
            <h3 className="mt-1 text-[17px] font-bold text-slate-900">{department.name}</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">{department.code}</p>
          </div>

          {department.headName && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-[12px] font-bold text-white">
                {department.headName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Kafedra mudiri</p>
                <p className="text-[14px] font-semibold text-slate-900">{department.headName}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-blue-700">{department.staffCount ?? '—'}</p>
              <p className="text-[11px] text-blue-500">O&apos;qituvchi</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-center">
              <BookOpen className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-emerald-700">{department.studentCount ?? '—'}</p>
              <p className="text-[11px] text-emerald-500">Talaba</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <Star className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-amber-700">{department.avgGrade ?? '—'}</p>
              <p className="text-[11px] text-amber-500">O&apos;rtacha baho</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
