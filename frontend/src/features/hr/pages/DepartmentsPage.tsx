import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Layers, Users, BookOpen, Plus } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { StatCard } from '@/components/data-display';
import { Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { DepartmentTree } from '../components/DepartmentTree';
import { DepartmentForm } from '../components/DepartmentForm';
import { useDepartments, useEmployees, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '@/api/hooks/useHr';
import type { HrDepartment } from '@/types/hr';
import type { DepartmentFormData } from '../schemas/department.schema';

export function DepartmentsPage() {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<HrDepartment | null>(null);
  const [deleteDepartment, setDeleteDepartment] = useState<HrDepartment | null>(null);

  const { data: departments = [], isLoading } = useDepartments();
  const { data: employeesData } = useEmployees({ pageSize: 500 });
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  const totalEmployees = employeesData?.data?.length ?? 0;
  const employeeOptions = (employeesData?.data ?? []).map((e) => ({ id: e.id, name: e.fullName }));
  const departmentOptions = departments.map((d) => ({ id: d.id, name: d.name }));

  const handleOpenCreate = () => { setEditDepartment(null); setFormOpen(true); };
  const handleOpenEdit = (d: HrDepartment) => { setEditDepartment(d); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditDepartment(null); };

  const handleSubmit = (data: DepartmentFormData) => {
    const dto = {
      name: data.name,
      code: data.code,
      type: data.type,
      parentId: data.parentId ?? null,
      headId: data.headId ?? null,
    };
    if (editDepartment) {
      updateDepartment.mutate({ id: editDepartment.id, dto }, { onSuccess: handleClose });
    } else {
      createDepartment.mutate(dto, { onSuccess: handleClose });
    }
  };

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
    fakultet: departments.filter((d) => d.type === 'fakultet').length,
    kafedra: departments.filter((d) => d.type === 'kafedra').length,
    bolim: departments.filter((d) => d.type === 'bolim').length,
  };

  return (
    <PageContent>
      <PageHeader
        title={t('hr.departmentsAndChairs')}
        subtitle={`${t('common.total')}: ${stats.total}`}
        breadcrumbs={[{ label: t('nav.hr'), path: '/hr' }, { label: t('nav.departments') }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
            {t('hr.newDepartment')}
          </Button>
        }
      />

      {/* StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label={t('hr.faculties')} value={stats.fakultet} icon={<Building2 className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label={t('hr.departments')} value={stats.kafedra} icon={<BookOpen className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
        <StatCard label={t('hr.divisions')} value={stats.bolim} icon={<Layers className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label={t('hr.totalEmployees')} value={totalEmployees} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#6366F1" />
      </div>

      <div className="mt-6">
        <DepartmentTree
          departments={departments}
          onEdit={handleOpenEdit}
          onDelete={setDeleteDepartment}
        />
      </div>

      <DepartmentForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        department={editDepartment}
        departments={departmentOptions}
        employees={employeeOptions}
        loading={createDepartment.isPending || updateDepartment.isPending}
      />

      <ConfirmDialog
        open={!!deleteDepartment}
        onClose={() => setDeleteDepartment(null)}
        onConfirm={() => {
          if (!deleteDepartment) return;
          deleteDepartmentMutation.mutate(deleteDepartment.id, { onSuccess: () => setDeleteDepartment(null) });
        }}
        title={t('hr.deleteDepartment')}
        message={t('hr.deleteDepartmentConfirm', { name: deleteDepartment?.name })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteDepartmentMutation.isPending}
      />
    </PageContent>
  );
}
