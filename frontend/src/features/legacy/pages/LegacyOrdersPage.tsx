import { FileText, UserPlus, UserMinus, Gift } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';

const ORDERS = [
  { id: 'B-2025/001', type: 'Qabul qilish', employee: 'Toshmatov Alisher Bekovich', date: '2025-01-05', department: 'IT fakulteti', status: 'approved' as const },
  { id: 'B-2025/002', type: 'Ta\'til', employee: 'Karimov Sardor Normatovich', date: '2025-01-12', department: 'Moliya', status: 'approved' as const },
  { id: 'B-2025/003', type: 'Mukofotlash', employee: 'Nazarova Dilnoza Ibrohimovna', date: '2025-02-01', department: 'Kafedra', status: 'approved' as const },
  { id: 'B-2025/004', type: 'Bo\'shatish', employee: 'Ergashev Otabek Karimovich', date: '2025-02-14', department: 'Kutubxona', status: 'approved' as const },
  { id: 'B-2025/005', type: 'Qabul qilish', employee: 'Mirzaeva Kamola Askarovna', date: '2025-03-01', department: 'Dekanat', status: 'pending' as const },
  { id: 'B-2025/006', type: 'Mukofotlash', employee: 'Rahimov Nodir Baxtiyorovich', date: '2025-03-10', department: 'IT fakulteti', status: 'approved' as const },
  { id: 'B-2025/007', type: 'Ta\'til', employee: 'Yusupov Mansur Ortiqovich', date: '2025-04-01', department: 'Buxgalteriya', status: 'pending' as const },
  { id: 'B-2025/008', type: 'Qabul qilish', employee: 'Xolmatov Sarvarbek Sobirov', date: '2025-04-15', department: 'Xo\'jalik', status: 'pending' as const },
];

const STATUS_META: Record<string, { label: string; color: string }> = {
  approved: { label: 'Tasdiqlangan', color: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Kutilmoqda', color: 'bg-amber-50 text-amber-700' },
  rejected: { label: 'Rad etilgan', color: 'bg-red-50 text-red-700' },
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  'Qabul qilish': <UserPlus className="h-3.5 w-3.5" />,
  "Bo'shatish": <UserMinus className="h-3.5 w-3.5" />,
  'Mukofotlash': <Gift className="h-3.5 w-3.5" />,
  "Ta'til": <FileText className="h-3.5 w-3.5" />,
};

export function LegacyOrdersPage() {
  const currentMonth = ORDERS.filter((o) => o.date.startsWith('2025-04')).length;
  const hires = ORDERS.filter((o) => o.type === 'Qabul qilish').length;
  const dismissals = ORDERS.filter((o) => o.type === "Bo'shatish").length;

  return (
    <PageContent>
      <PageHeader
        title="Buyruqlar (arxiv)"
        subtitle="Eski tizimdan ko'chirilgan buyruqlar. Yangi buyruqlar uchun HR modulidan foydalaning."
        breadcrumbs={[{ label: 'Eski tizim' }, { label: 'Buyruqlar' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Jami buyruqlar" value={ORDERS.length.toString()} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Joriy oy" value={currentMonth.toString()} icon={<FileText className="h-5 w-5" />} trend={{ value: currentMonth }} />
        <StatCard label="Qabul qilish" value={hires.toString()} icon={<UserPlus className="h-5 w-5" />} />
        <StatCard label="Bo'shatish" value={dismissals.toString()} icon={<UserMinus className="h-5 w-5" />} />
      </div>

      <Card title="" className="overflow-hidden">
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
            {ORDERS.map((o, i) => {
              const meta = STATUS_META[o.status]!;
              return (
                <tr key={o.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 text-[13px] font-mono text-slate-600">{o.id}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-700">
                      {TYPE_ICON[o.type]}
                      {o.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{o.employee}</td>
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
      </Card>
    </PageContent>
  );
}
