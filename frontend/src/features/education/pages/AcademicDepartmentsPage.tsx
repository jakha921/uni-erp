import { useState, useMemo } from 'react';
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
          />
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

function DepartmentCard({
  department,
  facultyName,
  color,
}: {
  department: Department;
  facultyName: string;
  color: string;
}) {
  const headInitials = department.headName
    ? department.headName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'N/A';

  return (
    <Card noPadding className="overflow-hidden">
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

        {/* Stats - using code as a stand-in since Department type lacks staffCount/studentCount */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-slate-50 p-2 text-center">
            <p className="text-base font-bold text-slate-900">{department.code}</p>
            <p className="mt-0.5 text-[10.5px] text-slate-500">Kod</p>
          </div>
          <div className="rounded-md bg-slate-50 p-2 text-center">
            <p className="text-base font-bold text-slate-900">{department.facultyId}</p>
            <p className="mt-0.5 text-[10.5px] text-slate-500">Fakultet ID</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
