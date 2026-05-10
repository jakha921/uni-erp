import { useState, useMemo } from 'react';
import { FileText, UserPlus, UserMinus, Gift } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Spinner } from '@/components/ui';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { Pagination } from '@/components/table';
import { useLegacyOrders } from '@/api/hooks/useLegacy';

const PAGE_SIZE = 20;

const STATUS_META: Record<string, { label: string; color: string }> = {
  active: { label: 'Faol', color: 'bg-emerald-50 text-emerald-700' },
  archived: { label: 'Arxivlangan', color: 'bg-slate-100 text-slate-500' },
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  hire: <UserPlus className="h-3.5 w-3.5" />,
  fire: <UserMinus className="h-3.5 w-3.5" />,
  reward: <Gift className="h-3.5 w-3.5" />,
  leave: <FileText className="h-3.5 w-3.5" />,
  penalty: <FileText className="h-3.5 w-3.5" />,
};

export function LegacyOrdersPage() {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLegacyOrders({ page, pageSize: PAGE_SIZE, type: typeFilter || undefined });

  const allOrders = data?.data ?? [];
  const orders = useMemo(() => allOrders.filter((o) => {
    if (dateFrom && o.date < dateFrom) return false;
    if (dateTo && o.date > dateTo) return false;
    return true;
  }), [allOrders, dateFrom, dateTo]);
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const hires = orders.filter((o) => o.type === 'hire').length;
  const fires = orders.filter((o) => o.type === 'fire').length;

  return (
    <PageContent>
      <PageHeader
        title="Buyruqlar (arxiv)"
        subtitle="Eski tizimdan ko'chirilgan buyruqlar. Yangi buyruqlar uchun HR modulidan foydalaning."
        breadcrumbs={[{ label: 'Eski tizim' }, { label: 'Buyruqlar' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami buyruqlar" value={String(total)} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Faol" value={String(orders.filter((o) => o.status === 'active').length)} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Qabul qilish" value={String(hires)} icon={<UserPlus className="h-5 w-5" />} />
        <StatCard label="Bo'shatish" value={String(fires)} icon={<UserMinus className="h-5 w-5" />} />
      </div>

      <Card title="" className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border">
          {[{ key: '', label: 'Barchasi' }, { key: 'hire', label: 'Qabul' }, { key: 'fire', label: "Bo'shatish" }, { key: 'reward', label: 'Mukofot' }, { key: 'leave', label: "Ta'til" }].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTypeFilter(t.key); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === t.key ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto">
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              onChange={(f, t) => { setDateFrom(f); setDateTo(t); setPage(1); }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {['RAQAM', 'TURI', 'XODIM', "BO'LIM", 'SANA', 'HOLAT'].map((h) => (
                  <th key={h} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 ${h === 'SANA' || h === 'HOLAT' ? 'text-center' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => {
                const meta = STATUS_META[o.status] ?? { label: o.status, color: 'bg-slate-100 text-slate-500' };
                return (
                  <tr key={o.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-[13px] font-mono text-slate-600">{o.number}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-700">
                        {TYPE_ICON[o.type]}
                        {o.typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{o.employeeName}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{o.department}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-500 text-center">{o.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">Buyruqlar topilmadi</div>
        )}
        {!isLoading && totalPages > 1 && (
          <div className="border-t border-border px-4 py-3">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} pageSize={PAGE_SIZE} />
          </div>
        )}
      </Card>
    </PageContent>
  );
}
