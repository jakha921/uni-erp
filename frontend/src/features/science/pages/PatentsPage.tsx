import { useState, useMemo } from 'react';
import { ScrollText, CheckCircle, Clock, Award, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { AlertBanner, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { usePatents, useCreatePatent, useDeletePatent } from '@/api/hooks/useScience';
import { PatentForm } from '../components/PatentForm';
import type { Patent } from '@/types/science';
import type { PatentFormData } from '../schemas/patent.schema';

type PatentFilter = 'all' | Patent['status'];

const STATUS_COLORS: Record<Patent['status'], string> = {
  filed: 'bg-blue-50 text-blue-700',
  under_review: 'bg-amber-50 text-amber-700',
  granted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

export function PatentsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<PatentFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deletePatent, setDeletePatent] = useState<Patent | null>(null);

  const STATUS_LABELS: Record<Patent['status'], string> = {
    filed: t('science.patentStatusFiled'),
    under_review: t('science.patentStatusUnderReview'),
    granted: t('science.patentStatusGranted'),
    rejected: t('science.patentStatusRejected'),
  };

  const { data: patentsData, isLoading, error } = usePatents({ page: 1, pageSize: 50 });
  const createPatent = useCreatePatent();
  const deletePatentMutation = useDeletePatent();

  const allPatents = patentsData?.data ?? [];
  const filtered = useMemo(() => filter === 'all' ? allPatents : allPatents.filter((p) => p.status === filter), [allPatents, filter]);
  const granted = allPatents.filter((p) => p.status === 'granted').length;
  const underReview = allPatents.filter((p) => p.status === 'under_review' || p.status === 'filed').length;
  const total = patentsData?.total ?? allPatents.length;

  const handleCreate = (data: PatentFormData) => {
    createPatent.mutate(data, { onSuccess: () => setFormOpen(false) });
  };

  const tableHeaders = [
    t('common.name'),
    t('science.patentAuthor'),
    t('science.patentCategory'),
    t('science.patentDate'),
    t('common.status'),
    '',
  ];

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title={t('science.patentsTitle')}
        subtitle={t('science.patentsSubtitle')}
        breadcrumbs={[{ label: t('nav.science') }, { label: t('nav.patents') }]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> {t('science.newPatent')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label={t('science.totalPatents')} value={total.toString()} icon={<ScrollText className="h-5 w-5" />} trend={{ value: 5 }} />
        <StatCard label={t('science.approvedPatents')} value={granted.toString()} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard label={t('science.patentStatusUnderReview')} value={underReview.toString()} icon={<Clock className="h-5 w-5" />} />
        <StatCard label={t('science.patented')} value={allPatents.filter((p) => p.patentNumber).length.toString()} icon={<Award className="h-5 w-5" />} trend={{ value: 2 }} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card title="" className="overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            {(['all', 'granted', 'under_review', 'filed', 'rejected'] as PatentFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === s ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s === 'all' ? t('common.all') : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {tableHeaders.map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 ${i < 3 ? 'text-left' : 'text-center'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const color = STATUS_COLORS[p.status];
                const label = STATUS_LABELS[p.status];
                return (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-[13px] font-medium text-slate-900 max-w-xs">{p.title}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-700">{p.inventors}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{p.category}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-500 text-center">{p.applicationDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${color ?? ''}`}>
                        {label ?? p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => setDeletePatent(p)} className="p-1 text-slate-400 hover:text-red-600 rounded">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">{t('common.noData')}</div>
          )}
        </Card>
      )}

      <PatentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={createPatent.isPending}
      />

      <ConfirmDialog
        open={!!deletePatent}
        onClose={() => setDeletePatent(null)}
        onConfirm={() => {
          if (!deletePatent) return;
          deletePatentMutation.mutate(deletePatent.id, { onSuccess: () => setDeletePatent(null) });
        }}
        title={t('science.deletePatentTitle')}
        message={t('science.deletePatentConfirm', { title: deletePatent?.title ?? '' })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deletePatentMutation.isPending}
      />
    </PageContent>
  );
}
