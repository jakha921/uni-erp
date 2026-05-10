import { useState, useMemo } from 'react';
import { ScrollText, CheckCircle, Clock, Award, Plus, Trash2 } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { usePatents, useCreatePatent, useDeletePatent } from '@/api/hooks/useScience';
import { PatentForm } from '../components/PatentForm';
import type { Patent } from '@/types/science';
import type { PatentFormData } from '../schemas/patent.schema';

type PatentFilter = 'all' | Patent['status'];

const STATUS_META: Record<Patent['status'], { label: string; color: string }> = {
  filed: { label: "Topshirilgan", color: 'bg-blue-50 text-blue-700' },
  under_review: { label: "Ko'rib chiqilmoqda", color: 'bg-amber-50 text-amber-700' },
  granted: { label: "Ro'yxatdan o'tgan", color: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Rad etilgan', color: 'bg-red-50 text-red-700' },
};

export function PatentsPage() {
  const [filter, setFilter] = useState<PatentFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deletePatent, setDeletePatent] = useState<Patent | null>(null);

  const { data: patentsData, isLoading } = usePatents({ page: 1, pageSize: 50 });
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

  return (
    <PageContent>
      <PageHeader
        title="Patentlar"
        subtitle="Intellektual mulk va patentlar boshqaruvi"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Patentlar' }]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Yangi patent
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami patentlar" value={total.toString()} icon={<ScrollText className="h-5 w-5" />} trend={{ value: 5 }} />
        <StatCard label="Tasdiqlangan" value={granted.toString()} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard label="Ko'rib chiqilmoqda" value={underReview.toString()} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Patentli" value={allPatents.filter((p) => p.patentNumber).length.toString()} icon={<Award className="h-5 w-5" />} trend={{ value: 2 }} />
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
                {s === 'all' ? 'Barchasi' : STATUS_META[s]?.label}
              </button>
            ))}
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {['NOMI', 'MUALLIF', 'KATEGORIYA', 'SANA', 'HOLAT', ''].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 ${h === 'NOMI' || h === 'MUALLIF' || h === 'KATEGORIYA' ? 'text-left' : 'text-center'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const meta = STATUS_META[p.status];
                return (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-[13px] font-medium text-slate-900 max-w-xs">{p.title}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-700">{p.inventors}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{p.category}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-500 text-center">{p.applicationDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta?.color ?? ''}`}>
                        {meta?.label ?? p.status}
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
            <div className="text-center py-10 text-slate-400 text-sm">Ma'lumot topilmadi</div>
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
        title="Patentni o'chirish"
        message={`"${deletePatent?.title}" patentini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deletePatentMutation.isPending}
      />
    </PageContent>
  );
}
