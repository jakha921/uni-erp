import { useState } from 'react';
import { Truck, CheckCircle, Wrench, MapPin } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';

type VehicleStatus = 'all' | 'active' | 'repair' | 'inactive';

const VEHICLES = [
  { id: 1, brand: 'Mercedes Sprinter', plate: '01 A 234 BC', driver: 'Karimov A.', route: 'Universitet → Yotoqxona', status: 'active' as const },
  { id: 2, brand: 'Ford Transit', plate: '01 B 567 DE', driver: 'Toshmatov B.', route: 'Shahar marshrutlari', status: 'active' as const },
  { id: 3, brand: 'Isuzu NQR', plate: '01 C 890 FG', driver: 'Xolmatov S.', route: 'Xo\'jalik yumushi', status: 'repair' as const },
  { id: 4, brand: 'Toyota Hiace', plate: '01 D 123 HI', driver: 'Rahimov N.', route: 'Mehmon kutish', status: 'active' as const },
  { id: 5, brand: 'GAZelle Next', plate: '01 E 456 JK', driver: 'Yusupov M.', route: 'Pochta va yuk', status: 'active' as const },
  { id: 6, brand: 'Hyundai County', plate: '01 F 789 LM', driver: 'Ergashev O.', route: 'Talabalar avtobuslari', status: 'inactive' as const },
  { id: 7, brand: 'Daewoo Lacetti', plate: '01 G 012 NO', driver: 'Nazarov I.', route: 'Rahbariyat', status: 'active' as const },
  { id: 8, brand: 'Nexia 3', plate: '01 H 345 PQ', driver: 'Mirzaev K.', route: 'Rahbariyat', status: 'repair' as const },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: 'Faol', color: 'bg-emerald-50 text-emerald-700' },
  repair: { label: "Ta'mirda", color: 'bg-amber-50 text-amber-700' },
  inactive: { label: 'Nofaol', color: 'bg-slate-100 text-slate-500' },
};

export function TransportPage() {
  const [filter, setFilter] = useState<VehicleStatus>('all');

  const filtered = filter === 'all' ? VEHICLES : VEHICLES.filter((v) => v.status === filter);
  const active = VEHICLES.filter((v) => v.status === 'active').length;
  const repair = VEHICLES.filter((v) => v.status === 'repair').length;

  return (
    <PageContent>
      <PageHeader
        title="Transport"
        subtitle="Universitet transport vositalari boshqaruvi"
        breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'Transport' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Jami transport" value={VEHICLES.length.toString()} icon={<Truck className="h-5 w-5" />} />
        <StatCard label="Faol" value={active.toString()} icon={<CheckCircle className="h-5 w-5" />} trend={{ value: 0 }} />
        <StatCard label="Ta'mirda" value={repair.toString()} icon={<Wrench className="h-5 w-5" />} />
        <StatCard label="Yo'nalishlar" value="6" icon={<MapPin className="h-5 w-5" />} />
      </div>

      <Card title="" className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          {(['all', 'active', 'repair', 'inactive'] as VehicleStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === s ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s === 'all' ? 'Barchasi' : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-border">
              {['MARKA', "DAVLAT RAQAMI", 'HAYDOVCHI', "YO'NALISH", 'HOLAT'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => {
              const st = STATUS_LABELS[v.status]!;
              return (
                <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{v.brand}</td>
                  <td className="px-4 py-3 text-[13px] font-mono text-slate-600">{v.plate}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-700">{v.driver}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{v.route}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${st.color}`}>
                      {st.label}
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
