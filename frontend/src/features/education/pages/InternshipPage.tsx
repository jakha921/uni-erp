import { useState } from 'react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { DataTable, type Column } from '@/components/table';
import { Badge, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { Tabs } from '@/components/navigation';
import { Users, Clock, CheckCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import { useInternshipsList, useCreateInternship, useUpdateInternship, useDeleteInternship } from '@/api/hooks/useInternships';
import { useStudentsList } from '@/api/hooks/useStudents';
import { InternshipForm } from '../components/InternshipForm';
import type { Internship } from '@/types/education';
import type { CreateInternshipFormData } from '../schemas/internship.schema';

const STATUS_LABELS: Record<string, string> = { planned: 'Rejalashtirilgan', active: 'Joriy', completed: 'Yakunlangan' };
const STATUS_VARIANT: Record<string, 'info' | 'success' | 'default'> = { planned: 'default', active: 'info', completed: 'success' };

export function InternshipPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [formOpen, setFormOpen] = useState(false);
  const [editInternship, setEditInternship] = useState<Internship | null>(null);
  const [deleteInternship, setDeleteInternship] = useState<Internship | null>(null);

  const statusFilter = activeTab === 'all' ? undefined : activeTab;
  const { data, isLoading } = useInternshipsList({ page: 1, pageSize: 50, status: statusFilter });
  const { data: studentsData } = useStudentsList({ page: 1, pageSize: 200 });
  const createInternship = useCreateInternship();
  const updateInternship = useUpdateInternship();
  const deleteInternshipMutation = useDeleteInternship();

  const internships = data?.data ?? [];
  const total = data?.total ?? 0;
  const activeCount = internships.filter((item) => item.status === 'active').length;
  const completedCount = internships.filter((item) => item.status === 'completed').length;
  const students = (studentsData?.data ?? []).map((s) => ({ id: s.id, fullName: s.fullName }));

  const tabs = [
    { id: 'active', label: 'Joriy', count: activeCount },
    { id: 'completed', label: 'Yakunlangan', count: completedCount },
  ];

  const handleCreate = (formData: CreateInternshipFormData) => {
    createInternship.mutate(
      { ...formData, studentId: Number(formData.studentId) },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  const handleEdit = (formData: CreateInternshipFormData) => {
    if (!editInternship) return;
    updateInternship.mutate(
      { id: editInternship.id, data: { ...formData, studentId: Number(formData.studentId) } },
      { onSuccess: () => setEditInternship(null) },
    );
  };

  const columns: Column<Internship>[] = [
    { key: 'idx', header: 'No', width: '50px', render: (_, index) => <span className="text-slate-500">{index + 1}</span> },
    { key: 'studentName', header: 'Talaba', render: (row) => <span className="font-medium text-slate-900">{row.studentName}</span> },
    { key: 'companyName', header: 'Tashkilot' },
    { key: 'startDate', header: 'Boshlangan', render: (row) => <span className="tabular-nums">{row.startDate}</span> },
    { key: 'endDate', header: 'Tugash', render: (row) => <span className="tabular-nums">{row.endDate}</span> },
    { key: 'supervisorName', header: 'Rahbar' },
    {
      key: 'status', header: 'Holat',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'} dot>{STATUS_LABELS[row.status] ?? row.status}</Badge>,
    },
    {
      key: 'actions', header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setEditInternship(row)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => setDeleteInternship(row)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Amaliyot"
        subtitle="Ishlab chiqarish amaliyoti ma'lumotlari"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Amaliyot' }]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Yangi amaliyot
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <StatCard label="Jami amaliyotchilar" value={total} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Joriy" value={activeCount} icon={<Clock className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Yakunlangan" value={completedCount} icon={<CheckCircle className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <Card noPadding>
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : (
            <DataTable data={internships} columns={columns} keyField="id" emptyMessage="Amaliyotlar topilmadi" />
          )}
        </Card>
      </div>

      <InternshipForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        students={students}
        loading={createInternship.isPending}
      />

      <InternshipForm
        open={!!editInternship}
        onClose={() => setEditInternship(null)}
        onSubmit={handleEdit}
        internship={editInternship}
        students={students}
        loading={updateInternship.isPending}
      />

      <ConfirmDialog
        open={!!deleteInternship}
        onClose={() => setDeleteInternship(null)}
        onConfirm={() => {
          if (!deleteInternship) return;
          deleteInternshipMutation.mutate(deleteInternship.id, { onSuccess: () => setDeleteInternship(null) });
        }}
        title="Amaliyotni o'chirish"
        message={`"${deleteInternship?.studentName}" amaliyotini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteInternshipMutation.isPending}
      />
    </PageContent>
  );
}
