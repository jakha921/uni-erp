import { useState } from 'react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { DataTable, type Column } from '@/components/table';
import { Badge, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { Users, Briefcase, GraduationCap, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAlumniList, useCreateAlumni, useUpdateAlumni, useDeleteAlumni } from '@/api/hooks/useAlumni';
import { AlumniForm } from '../components/AlumniForm';
import type { Alumni } from '@/types/education';
import type { CreateAlumniFormData } from '../schemas/alumni.schema';

const STATUS_LABELS: Record<string, string> = {
  employed: 'Ishlamoqda',
  unemployed: 'Ish qidiryapti',
  studying: 'Magistraturada',
  unknown: "Noma'lum",
};

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  employed: 'success',
  studying: 'info',
  unemployed: 'default',
  unknown: 'warning',
};

export function AlumniPage() {
  const [params] = useState({ page: 1, pageSize: 50 });
  const [formOpen, setFormOpen] = useState(false);
  const [editAlumni, setEditAlumni] = useState<Alumni | null>(null);
  const [deleteAlumni, setDeleteAlumni] = useState<Alumni | null>(null);

  const { data, isLoading } = useAlumniList(params);
  const createAlumni = useCreateAlumni();
  const updateAlumni = useUpdateAlumni();
  const deleteAlumniMutation = useDeleteAlumni();

  const alumni = data?.data ?? [];
  const total = data?.total ?? 0;
  const employed = alumni.filter((a) => a.status === 'employed').length;
  const studying = alumni.filter((a) => a.status === 'studying').length;

  const handleCreate = (formData: CreateAlumniFormData) => {
    createAlumni.mutate(formData, { onSuccess: () => setFormOpen(false) });
  };

  const handleEdit = (formData: CreateAlumniFormData) => {
    if (!editAlumni) return;
    updateAlumni.mutate({ id: editAlumni.id, data: formData }, { onSuccess: () => setEditAlumni(null) });
  };

  const columns: Column<Alumni>[] = [
    { key: 'idx', header: 'No', width: '50px', render: (_, index) => <span className="text-slate-500">{index + 1}</span> },
    { key: 'fullName', header: 'F.I.Sh', render: (row) => <span className="font-medium text-slate-900">{row.fullName}</span> },
    { key: 'graduationYear', header: 'Bitirgan yili', render: (row) => <span className="tabular-nums">{row.graduationYear}</span> },
    { key: 'faculty', header: 'Fakultet' },
    { key: 'specialty', header: "Yo'nalish" },
    { key: 'workplace', header: 'Ish joyi' },
    {
      key: 'status', header: 'Holat',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'} dot>{STATUS_LABELS[row.status] ?? row.status}</Badge>,
    },
    {
      key: 'actions', header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setEditAlumni(row)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => setDeleteAlumni(row)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Bitiruvchilar"
        subtitle="Universitet bitiruvchilari ma'lumotlari"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Bitiruvchilar' }]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Yangi bitiruvchi
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <StatCard label="Jami bitiruvchilar" value={total} icon={<GraduationCap className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Ishga joylashgan" value={employed} icon={<Briefcase className="h-[18px] w-[18px]" />} iconBg="#2DB976" sub={total > 0 ? `${((employed / total) * 100).toFixed(1)}% band` : ''} />
        <StatCard label="Magistraturada" value={studying} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#8B5CF6" />
      </div>

      <Card noPadding>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <DataTable data={alumni} columns={columns} keyField="id" emptyMessage="Bitiruvchilar topilmadi" />
        )}
      </Card>

      <AlumniForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={createAlumni.isPending}
      />

      <AlumniForm
        open={!!editAlumni}
        onClose={() => setEditAlumni(null)}
        onSubmit={handleEdit}
        alumni={editAlumni}
        loading={updateAlumni.isPending}
      />

      <ConfirmDialog
        open={!!deleteAlumni}
        onClose={() => setDeleteAlumni(null)}
        onConfirm={() => {
          if (!deleteAlumni) return;
          deleteAlumniMutation.mutate(deleteAlumni.id, { onSuccess: () => setDeleteAlumni(null) });
        }}
        title="Bitiruvchini o'chirish"
        message={`"${deleteAlumni?.fullName}" bitiruvchisini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteAlumniMutation.isPending}
      />
    </PageContent>
  );
}
