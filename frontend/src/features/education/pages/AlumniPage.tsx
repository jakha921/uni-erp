import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { DataTable, type Column } from '@/components/table';
import { Badge, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { Users, Briefcase, GraduationCap, Plus, Pencil, Trash2, FileDown } from 'lucide-react';
import { useAlumniList, useCreateAlumni, useUpdateAlumni, useDeleteAlumni } from '@/api/hooks/useAlumni';
import { AlumniForm } from '../components/AlumniForm';
import type { Alumni } from '@/types/education';
import type { CreateAlumniFormData } from '../schemas/alumni.schema';

const STATUS_KEYS: Record<string, string> = {
  employed: 'education.alumniStatusEmployed',
  unemployed: 'education.alumniStatusUnemployed',
  studying: 'education.alumniStatusStudying',
  unknown: 'education.alumniStatusUnknown',
};

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  employed: 'success',
  studying: 'info',
  unemployed: 'default',
  unknown: 'warning',
};

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export function AlumniPage() {
  const { t } = useTranslation();
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editAlumni, setEditAlumni] = useState<Alumni | null>(null);
  const [deleteAlumni, setDeleteAlumni] = useState<Alumni | null>(null);

  const { data, isLoading } = useAlumniList({
    page: 1,
    pageSize: 50,
    graduationYear: yearFilter ? Number(yearFilter) : undefined,
    status: statusFilter || undefined,
  });
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
    { key: 'fullName', header: t('students.fullName'), render: (row) => <span className="font-medium text-slate-900">{row.fullName}</span> },
    { key: 'graduationYear', header: t('education.graduationYear'), render: (row) => <span className="tabular-nums">{row.graduationYear}</span> },
    { key: 'faculty', header: t('students.faculty') },
    { key: 'specialty', header: t('education.directions') },
    { key: 'workplace', header: t('education.workplace') },
    {
      key: 'status', header: t('common.status'),
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'} dot>{t(STATUS_KEYS[row.status] ?? row.status)}</Badge>,
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
        title={t('education.alumniTitle')}
        subtitle={t('education.alumniSubtitle')}
        breadcrumbs={[{ label: t('nav.education') }, { label: t('nav.alumni') }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/api/v1/education/alumni/export/';
                a.download = 'bitiruvchilar.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              Excel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> {t('education.newAlumni')}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <StatCard label={t('education.totalAlumni')} value={total} icon={<GraduationCap className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label={t('education.employed')} value={employed} icon={<Briefcase className="h-[18px] w-[18px]" />} iconBg="#2DB976" sub={total > 0 ? t('education.employedPct', { pct: ((employed / total) * 100).toFixed(1) }) : ''} />
        <StatCard label={t('education.inMaster')} value={studying} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#8B5CF6" />
      </div>

      <Card noPadding>
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="h-8 rounded-lg border border-border px-2 text-[13px] text-slate-700"
          >
            <option value="">{t('education.allYears')}</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-lg border border-border px-2 text-[13px] text-slate-700"
          >
            <option value="">{t('education.allStatuses')}</option>
            <option value="employed">{t('education.alumniStatusEmployed')}</option>
            <option value="unemployed">{t('education.alumniStatusUnemployed')}</option>
            <option value="studying">{t('education.alumniStatusStudying')}</option>
            <option value="unknown">{t('education.alumniStatusUnknown')}</option>
          </select>
          {(yearFilter || statusFilter) && (
            <button
              onClick={() => { setYearFilter(''); setStatusFilter(''); }}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              {t('education.clearFilters')}
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <DataTable data={alumni} columns={columns} keyField="id" emptyMessage={t('education.alumniNotFound')} />
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
        title={t('education.deleteAlumniTitle')}
        message={t('education.deleteAlumniConfirm', { name: deleteAlumni?.fullName })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteAlumniMutation.isPending}
      />
    </PageContent>
  );
}
