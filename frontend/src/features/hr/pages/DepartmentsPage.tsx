import { Building2, Layers, Users, BookOpen, Plus } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { StatCard } from '@/components/data-display';
import { Button, Spinner } from '@/components/ui';
import { DepartmentTree } from '../components/DepartmentTree';
import { useDepartments, useEmployees } from '@/api/hooks/useHr';

export function DepartmentsPage() {
  const { data: departments = [], isLoading } = useDepartments();
  const { data: employeesData } = useEmployees({ pageSize: 500 });
  const totalEmployees = employeesData?.data?.length ?? 0;

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </PageContent>
    );
  }

  const stats = {
    total: departments.length,
    rektorat: departments.filter((d) => d.type === 'rektorat').length,
    fakultet: departments.filter((d) => d.type === 'fakultet').length,
    kafedra: departments.filter((d) => d.type === 'kafedra').length,
    bolim: departments.filter((d) => d.type === 'bolim').length,
  };

  return (
    <PageContent>
      <PageHeader
        title="Bo'limlar va kafedralar"
        subtitle={`Jami: ${stats.total} ta tarkibiy bo'linma`}
        breadcrumbs={[{ label: 'Kadrlar', path: '/hr' }, { label: "Bo'limlar" }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Yangi bo&apos;lim
          </Button>
        }
      />

      {/* StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Fakultetlar" value={stats.fakultet} icon={<Building2 className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Kafedralar" value={stats.kafedra} icon={<BookOpen className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
        <StatCard label="Bo'limlar" value={stats.bolim} icon={<Layers className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Jami xodimlar" value={totalEmployees} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#6366F1" />
      </div>

      <div className="mt-6">
        <DepartmentTree departments={departments} />
      </div>
    </PageContent>
  );
}
