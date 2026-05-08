import { useState } from 'react';
import { ScrollText, CheckCircle, Clock, Award } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';

type PatentStatus = 'all' | 'registered' | 'pending' | 'license';

const PATENTS = [
  { id: 1, name: 'Sun\'iy intellekt asosida tibbiy tashxis tizimi', author: 'Toshmatov A.B.', date: '2024-03-15', type: 'Ixtiro', status: 'registered' as const },
  { id: 2, name: 'Energiya tejaydigan issiqlik almashtirgich', author: 'Karimov S.N.', date: '2024-01-20', type: 'Foydali model', status: 'registered' as const },
  { id: 3, name: "Aqlli suv sarfini nazorat qilish tizimi", author: 'Nazarov I.M.', date: '2024-05-10', type: 'Ixtiro', status: 'pending' as const },
  { id: 4, name: 'Kompozit materialdan qurilgan yengil konstruksiya', author: 'Yusupov M.O.', date: '2023-11-05', type: 'Ixtiro', status: 'license' as const },
  { id: 5, name: 'Blockchain asosida hujjat autentifikatsiyasi', author: 'Ergashev O.K.', date: '2024-06-01', type: 'Dasturiy mahsulot', status: 'pending' as const },
  { id: 6, name: "O'simlik o'sishini optimallashtiruvchi sensor", author: 'Mirzaev K.A.', date: '2023-09-18', type: 'Foydali model', status: 'registered' as const },
  { id: 7, name: 'Yuqori aniqlikli GPS lokatsiya moduli', author: 'Rahimov N.B.', date: '2024-02-28', type: 'Ixtiro', status: 'license' as const },
];

const STATUS_META: Record<string, { label: string; color: string }> = {
  registered: { label: "Ro'yxatdan o'tgan", color: 'bg-emerald-50 text-emerald-700' },
  pending: { label: "Ko'rib chiqilmoqda", color: 'bg-amber-50 text-amber-700' },
  license: { label: 'Litsenziya', color: 'bg-blue-50 text-blue-700' },
};

export function PatentsPage() {
  const [filter, setFilter] = useState<PatentStatus>('all');

  const filtered = filter === 'all' ? PATENTS : PATENTS.filter((p) => p.status === filter);
  const registered = PATENTS.filter((p) => p.status === 'registered').length;
  const pending = PATENTS.filter((p) => p.status === 'pending').length;
  const licenses = PATENTS.filter((p) => p.status === 'license').length;

  return (
    <PageContent>
      <PageHeader
        title="Patentlar"
        subtitle="Intellektual mulk va patentlar boshqaruvi"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Patentlar' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Jami patentlar" value={PATENTS.length.toString()} icon={<ScrollText className="h-5 w-5" />} trend={{ value: 5 }} />
        <StatCard label="Tasdiqlangan" value={registered.toString()} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard label="Ko'rib chiqilmoqda" value={pending.toString()} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Litsenziyalar" value={licenses.toString()} icon={<Award className="h-5 w-5" />} trend={{ value: 2 }} />
      </div>

      <Card title="" className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          {(['all', 'registered', 'pending', 'license'] as PatentStatus[]).map((s) => (
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
              {['NOMI', 'MUALLIF', 'TURI', 'SANA', 'HOLAT'].map((h) => (
                <th key={h} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 ${h === 'NOMI' ? 'text-left' : h === 'SANA' || h === 'HOLAT' ? 'text-center' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const meta = STATUS_META[p.status]!;
              return (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 text-[13px] font-medium text-slate-900 max-w-xs">{p.name}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-700">{p.author}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{p.type}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-500 text-center">{p.date}</td>
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

        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">Ma'lumot topilmadi</div>
        )}
      </Card>
    </PageContent>
  );
}
