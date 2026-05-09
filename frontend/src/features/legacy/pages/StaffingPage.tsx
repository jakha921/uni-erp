import { Users, Briefcase, AlertCircle, TrendingUp } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';

interface Position {
  title: string;
  total: number;
  filled: number;
  salary: string;
}

interface Department {
  name: string;
  positions: Position[];
}

const STAFFING: Department[] = [
  {
    name: 'IT Fakulteti',
    positions: [
      { title: 'Dekan', total: 1, filled: 1, salary: '5 200 000' },
      { title: 'Professor', total: 8, filled: 7, salary: '4 800 000' },
      { title: 'Dotsent', total: 14, filled: 12, salary: '3 600 000' },
      { title: "O'qituvchi", total: 20, filled: 18, salary: '2 800 000' },
      { title: 'Assistent', total: 10, filled: 8, salary: '2 200 000' },
    ],
  },
  {
    name: 'Moliya va Buxgalteriya',
    positions: [
      { title: 'Bosh buxgalter', total: 1, filled: 1, salary: '4 500 000' },
      { title: "Buxgalter-iqtisodchi", total: 6, filled: 5, salary: '3 200 000' },
      { title: "Kassa xodimi", total: 3, filled: 3, salary: '2 400 000' },
    ],
  },
  {
    name: 'Dekanat va ma\'muriyat',
    positions: [
      { title: 'Rektor', total: 1, filled: 1, salary: '9 000 000' },
      { title: 'Prorektor', total: 4, filled: 4, salary: '7 000 000' },
      { title: "O'quv ishlari bo'limi boshlig'i", total: 2, filled: 2, salary: '5 000 000' },
      { title: 'Metodist', total: 8, filled: 6, salary: '2 600 000' },
    ],
  },
  {
    name: "Xo'jalik va texnik xizmat",
    positions: [
      { title: "Xo'jalik bo'limi boshlig'i", total: 1, filled: 1, salary: '3 800 000' },
      { title: 'Texnik xodim', total: 12, filled: 10, salary: '1 800 000' },
      { title: 'Haydovchi', total: 5, filled: 4, salary: '2 200 000' },
      { title: 'Qorovul', total: 8, filled: 8, salary: '1 600 000' },
    ],
  },
];

export function StaffingPage() {
  const allPositions = STAFFING.flatMap((d) => d.positions);
  const totalSlots = allPositions.reduce((s, p) => s + p.total, 0);
  const filledSlots = allPositions.reduce((s, p) => s + p.filled, 0);
  const vacantSlots = totalSlots - filledSlots;
  const fillRate = Math.round((filledSlots / totalSlots) * 100);

  return (
    <PageContent>
      <PageHeader
        title="Shtatlash jadvali"
        subtitle="Xodimlar shtati va lavozimlar jadvali"
        breadcrumbs={[{ label: 'Eski tizim' }, { label: 'Shtatlash jadvali' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami shtat birliklari" value={totalSlots.toString()} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard label="Band" value={filledSlots.toString()} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Bo'sh o'rinlar" value={vacantSlots.toString()} icon={<AlertCircle className="h-5 w-5" />} />
        <StatCard label="Band foizi" value={`${fillRate}%`} icon={<TrendingUp className="h-5 w-5" />} trend={{ value: fillRate - 90 }} />
      </div>

      <div className="space-y-4">
        {STAFFING.map((dept) => {
          const deptTotal = dept.positions.reduce((s, p) => s + p.total, 0);
          const deptFilled = dept.positions.reduce((s, p) => s + p.filled, 0);
          const deptVacant = deptTotal - deptFilled;

          return (
            <Card key={dept.name} title="" className="overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-50">
                <h3 className="text-[14px] font-semibold text-slate-900">{dept.name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Jami: <strong className="text-slate-700">{deptTotal}</strong></span>
                  <span>Band: <strong className="text-emerald-600">{deptFilled}</strong></span>
                  {deptVacant > 0 && (
                    <span>Bo'sh: <strong className="text-amber-600">{deptVacant}</strong></span>
                  )}
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">LAVOZIM</th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">SHTAT</th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">BAND</th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">BO'SH</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">MAOSH (so'm)</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.positions.map((pos, i) => {
                    const vacant = pos.total - pos.filled;
                    return (
                      <tr key={pos.title} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                        <td className="px-4 py-2.5 text-[13px] font-medium text-slate-900">{pos.title}</td>
                        <td className="px-4 py-2.5 text-[13px] text-slate-600 text-center">{pos.total}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="text-[13px] font-medium text-emerald-600">{pos.filled}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {vacant > 0 ? (
                            <span className="text-[13px] font-medium text-amber-600">{vacant}</span>
                          ) : (
                            <span className="text-[13px] text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-slate-600 text-right font-mono">{pos.salary}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          );
        })}
      </div>
    </PageContent>
  );
}
