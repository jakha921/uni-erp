import { useState } from 'react';
import { Search, Users, Star, Clock } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Avatar } from '@/components/ui';
import { generateName, rnum } from '@/api/mock/shared-data';

const GROUPS = [
  { id: 'DS-21-1', name: 'DS-21-1', subject: 'Algoritmlar', count: 22 },
  { id: 'DS-21-2', name: 'DS-21-2', subject: "Ma'lumotlar bazasi", count: 18 },
  { id: 'CS-22-1', name: 'CS-22-1', subject: 'Kiberxavfsizlik', count: 25 },
];

function makeStudents(groupIdx: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const n = generateName(groupIdx * 30 + i);
    return {
      id: `${groupIdx}-${i}`,
      name: n.short,
      fullName: n.full,
      attendance: rnum(groupIdx * 100 + i, 70, 100),
      avgScore: rnum(groupIdx * 100 + i + 50, 55, 97),
    };
  });
}

function getAttendanceColor(v: number) {
  if (v >= 90) return 'text-emerald-600';
  if (v >= 75) return 'text-amber-600';
  return 'text-red-600';
}

export function MyStudentsPage() {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]!.id);
  const [search, setSearch] = useState('');

  const groupIdx = GROUPS.findIndex((g) => g.id === activeGroup);
  const group = GROUPS[groupIdx]!;
  const allStudents = makeStudents(groupIdx, group.count);
  const students = allStudents.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const avgAttendance = Math.round(allStudents.reduce((s, st) => s + st.attendance, 0) / allStudents.length);
  const excellent = allStudents.filter((s) => s.avgScore >= 86).length;

  return (
    <PageContent>
      <PageHeader
        title="Mening talabalarim"
        subtitle="Sizga biriktirilgan guruhlar va talabalar"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Mening talabalarim' }]}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Jami talabalar"
          value={GROUPS.reduce((s, g) => s + g.count, 0).toString()}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="O'rtacha davomat"
          value={`${avgAttendance}%`}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 2 }}
        />
        <StatCard
          label="A'lo baholar"
          value={excellent.toString()}
          icon={<Star className="h-5 w-5" />}
          trend={{ value: 3 }}
        />
      </div>

      <Card title="" className="overflow-hidden">
        <div className="border-b border-border px-4 flex items-center gap-2">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => { setActiveGroup(g.id); setSearch(''); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeGroup === g.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {g.name}
              <span className="ml-2 text-xs text-slate-400">({g.count})</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Talaba qidirish..."
              className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Fan: {group.subject} · {group.count} talaba</p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-border">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                TALABA
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                DAVOMAT
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                O'RTacha BALL
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                BAHO
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((st, i) => {
              const grade =
                st.avgScore >= 86 ? "A'lo" : st.avgScore >= 71 ? 'Yaxshi' : st.avgScore >= 55 ? 'Qoniqarli' : 'Qoniqarsiz';
              const gradeColor =
                st.avgScore >= 86 ? 'bg-emerald-50 text-emerald-700' : st.avgScore >= 71 ? 'bg-blue-50 text-blue-700' : st.avgScore >= 55 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';
              return (
                <tr key={st.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={st.fullName} size="sm" />
                      <span className="text-[13px] font-medium text-slate-900">{st.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[13px] font-semibold ${getAttendanceColor(st.attendance)}`}>
                      {st.attendance}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[13px] text-slate-700">{st.avgScore}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${gradeColor}`}>
                      {grade}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">Talaba topilmadi</div>
        )}
      </Card>
    </PageContent>
  );
}
