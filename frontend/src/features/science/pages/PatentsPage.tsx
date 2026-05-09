import { useState, useMemo } from 'react';
import { ScrollText, CheckCircle, Clock, Award } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Spinner } from '@/components/ui';
import { usePatents } from '@/api/hooks/useScience';
import type { Patent } from '@/types/science';

type PatentFilter = 'all' | Patent['status'];

const STATUS_META: Record<Patent['status'], { label: string; color: string }> = {
  filed: { label: "Topshirilgan", color: 'bg-blue-50 text-blue-700' },
  under_review: { label: "Ko'rib chiqilmoqda", color: 'bg-amber-50 text-amber-700' },
  granted: { label: "Ro'yxatdan o'tgan", color: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Rad etilgan', color: 'bg-red-50 text-red-700' },
};

export function PatentsPage() {
  const [filter, setFilter] = useState<PatentFilter>('all');

  const { data: patentsData, isLoading } = usePatents({ page: 1, pageSize: 50 });

  const allPatents = patentsData?.data ?? [];

  const filtered = useMemo(() => {
    if (filter === 'all') return allPatents;
    return allPatents.filter((p) => p.status === filter);
  }, [allPatents, filter]);

  const granted = allPatents.filter((p) => p.status === 'granted').length;
  const underReview = allPatents.filter((p) => p.status === 'under_review' || p.status === 'filed').length;
  const total = patentsData?.total ?? allPatents.length;

  return (
    <PageContent>
      <PageHeader
        title="Patentlar"
        subtitle="Intellektual mulk va patentlar boshqaruvi"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Patentlar' }]}
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
                {['NOMI', 'MUALLIF', 'KATEGORIYA', 'SANA', 'HOLAT'].map((h) => (
                  <th key={h} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 ${h === 'NOMI' ? 'text-left' : h === 'SANA' || h === 'HOLAT' ? 'text-center' : 'text-left'}`}>
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
    </PageContent>
  );
}
