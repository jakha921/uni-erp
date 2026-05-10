import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Download } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Pagination } from '@/components/table';
import { Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useEmployee, useDepartments } from '@/api/hooks/useHr';
import type { EmployeeListParams, EmployeeStatus, EmployeeListItem } from '@/types/hr';
import type { EmployeeFormData } from '../schemas/employee.schema';

export function EmployeesListPage() {
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState<EmployeeListParams>({
    page: 1,
    pageSize: 20,
    search: '',
    status: (searchParams.get('status') as EmployeeStatus | null) ?? undefined,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<EmployeeListItem | null>(null);
  const [position, setPosition] = useState('');

  const { data, isLoading } = useEmployees(params);
  const { data: departments = [] } = useDepartments();
  const { data: editEmployeeData } = useEmployee(editEmployeeId ?? 0);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const handleSearch = useCallback((value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setParams((prev) => ({
      ...prev,
      status: status ? (status as EmployeeStatus) : undefined,
      page: 1,
    }));
  }, []);

  const handleDepartmentChange = useCallback((deptId: string) => {
    setParams((prev) => ({
      ...prev,
      departmentId: deptId ? Number(deptId) : undefined,
      page: 1,
    }));
  }, []);


  const handleSort = useCallback((key: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: key,
      sortOrder: prev.sortBy === key && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const buildDto = (formData: EmployeeFormData) => ({
    firstName: formData.firstName,
    secondName: formData.secondName,
    thirdName: formData.thirdName,
    gender: formData.gender,
    birthDate: formData.birthDate,
    departmentId: Number(formData.departmentId),
    positionCode: formData.positionCode,
    academicDegree: formData.academicDegree,
    academicRank: formData.academicRank,
    employmentForm: formData.employmentForm,
    hireDate: formData.hireDate,
    phone: formData.phone,
    email: formData.email,
    passport: formData.passport,
    pinfl: formData.pinfl,
    salary: Number(formData.salary),
  });

  const handleSubmit = useCallback(
    (formData: EmployeeFormData) => {
      if (editEmployeeId) {
        updateMutation.mutate(
          { id: editEmployeeId, dto: buildDto(formData) },
          { onSuccess: () => { setFormOpen(false); setEditEmployeeId(null); } },
        );
      } else {
        createMutation.mutate(buildDto(formData), { onSuccess: () => setFormOpen(false) });
      }
    },
    [createMutation, updateMutation, editEmployeeId],
  );

  return (
    <PageContent>
      <PageHeader
        title="Xodimlar"
        subtitle={data ? `Jami: ${data.total} ta xodim` : undefined}
        breadcrumbs={[{ label: 'Kadrlar', path: '/hr' }, { label: 'Xodimlar' }]}
      />

      {/* Card-toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={params.search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="F.I.SH yoki ID raqam bo'yicha qidirish…"
              className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
          </div>
          <select
            value={params.departmentId ? String(params.departmentId) : ''}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Bo&apos;lim</option>
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name.length > 28 ? d.name.slice(0, 28) + '…' : d.name}
              </option>
            ))}
          </select>
          <select
            className="h-9 rounded-lg border border-border px-3 text-sm"
            value={position}
            onChange={(e) => { setPosition(e.target.value); setParams((p) => ({ ...p, page: 1 })); }}
          >
            <option value="">Lavozim</option>
            <option value="professor">Professor</option>
            <option value="dotsent">Dotsent</option>
            <option value="katta-oqituvchi">Katta o&apos;qituvchi</option>
            <option value="oqituvchi">O&apos;qituvchi</option>
            <option value="laborant">Laborant</option>
            <option value="boshqaruvchi">Boshqaruvchi</option>
          </select>
          <select
            value={params.status ?? ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Holat</option>
            <option value="active">Faol</option>
            <option value="leave">Ta&apos;tilda</option>
            <option value="business_trip">Xizmat safarida</option>
            <option value="inactive">Nofaol</option>
          </select>
          <div className="flex-1" />
          {useAuthStore.getState().currentUser?.role === 'admin' && (
            <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
              HEMIS dan yuklash
            </Button>
          )}
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => { setEditEmployeeId(null); setFormOpen(true); }}
          >
            Yangi xodim
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center"><Spinner /></div>
        ) : (
          <>
            <EmployeeTable
              data={data?.data ?? []}
              sortBy={params.sortBy}
              sortOrder={params.sortOrder}
              onSort={handleSort}
              onEdit={(emp) => { setEditEmployeeId(emp.id); setFormOpen(true); }}
              onDelete={setDeleteEmployee}
            />
            {data && data.totalPages > 1 && (
              <div className="border-t border-[#F1F5F9] px-4 py-3">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  total={data.total}
                  pageSize={data.pageSize}
                  onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <EmployeeForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditEmployeeId(null); }}
        onSubmit={handleSubmit}
        employee={editEmployeeId ? (editEmployeeData ?? null) : null}
        departments={departments}
        loading={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmDialog
        open={!!deleteEmployee}
        onClose={() => setDeleteEmployee(null)}
        onConfirm={() => {
          if (!deleteEmployee) return;
          deleteEmployeeMutation.mutate(deleteEmployee.id, { onSuccess: () => setDeleteEmployee(null) });
        }}
        title="Xodimni o'chirish"
        message={`"${deleteEmployee?.fullName}" xodimni o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteEmployeeMutation.isPending}
      />
    </PageContent>
  );
}
