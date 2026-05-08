import { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button, Avatar } from '@/components/ui';
import { generateName, seed, SUBJECTS } from '@/api/mock/shared-data';
import type { PersonName } from '@/types/shared';

type AttendanceStatus = 'P' | 'N' | 'U';

interface Student {
  id: string;
  name: PersonName;
}

const GROUPS = ['301-A', '301-B', '302-A', '205-A', '104-B'];

const students: Student[] = Array.from({ length: 14 }, (_, i) => {
  const name = generateName(i + 200);
  return { id: `STD-${String(i + 1).padStart(3, '0')}`, name };
});

const dates = ['18.04', '19.04', '20.04', '21.04', '22.04', '23.04', '24.04', '25.04'];

function initGrid(): Record<string, AttendanceStatus[]> {
  const rows: Record<string, AttendanceStatus[]> = {};
  students.forEach((s, i) => {
    rows[s.id] = dates.map((_, j) => {
      const r = seed(i * 17 + j);
      return r > 0.88 ? 'N' : r > 0.78 ? 'U' : 'P';
    });
  });
  return rows;
}

function getMarkStyle(v: AttendanceStatus) {
  if (v === 'P') return { bg: 'bg-green-50', fg: 'text-green-700', label: '+' };
  if (v === 'N') return { bg: 'bg-red-50', fg: 'text-red-700', label: '—' };
  return { bg: 'bg-amber-50', fg: 'text-amber-700', label: 'U' };
}

function cycleStatus(v: AttendanceStatus): AttendanceStatus {
  if (v === 'P') return 'N';
  if (v === 'N') return 'U';
  return 'P';
}

export function AcademicAttendancePage() {
  const [group, setGroup] = useState('301-A');
  const [subject, setSubject] = useState('Algoritmlar');
  const [grid, setGrid] = useState<Record<string, AttendanceStatus[]>>(initGrid);

  const handleCycle = useCallback((studentId: string, colIndex: number) => {
    setGrid((prev) => {
      const existing = prev[studentId];
      if (!existing) return prev;
      const row = [...existing];
      const current = row[colIndex];
      if (current) row[colIndex] = cycleStatus(current);
      return { ...prev, [studentId]: row };
    });
  }, []);

  return (
    <PageContent>
      <PageHeader
        title="Davomat"
        subtitle="Talabalar davomatini boshqarish"
        breadcrumbs={[
          { label: "Ta'lim", path: '/attendance' },
          { label: 'Davomat' },
        ]}
      />

      {/* Filters toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted">Guruh</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="h-9 min-w-[140px] rounded-lg border border-border px-3 text-sm"
            >
              {GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted">Fan</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 min-w-[180px] rounded-lg border border-border px-3 text-sm"
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted">Davr</label>
            <select className="h-9 rounded-lg border border-border px-3 text-sm">
              <option>18.04 — 25.04 (shu hafta)</option>
              <option>11.04 — 17.04</option>
            </select>
          </div>
          <div className="flex-1" />
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-green-50 text-[10px] font-bold text-green-700">
                +
              </span>
              Keldi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-red-50 text-[10px] font-bold text-red-700">
                —
              </span>
              Kelmadi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-amber-50 text-[10px] font-bold text-amber-700">
                U
              </span>
              Uzrli
            </span>
          </div>
          <Button size="sm" leftIcon={<Check className="h-4 w-4" />}>
            Saqlash
          </Button>
        </div>
      </Card>

      {/* Attendance grid */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFB]">
                <th className="sticky left-0 z-10 min-w-[220px] bg-[#F8FAFB] px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
                  Talaba
                </th>
                {dates.map((d) => (
                  <th
                    key={d}
                    className="min-w-[52px] px-1 py-2.5 text-center text-[11px] font-semibold text-muted"
                  >
                    {d}
                  </th>
                ))}
                <th className="px-3.5 py-2.5 text-center text-[11px] font-semibold text-muted">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const row = grid[s.id] ?? [];
                const presentCount = row.filter((v) => v === 'P').length;
                const pct = row.length > 0 ? Math.round((presentCount / row.length) * 100) : 0;
                const pctColor =
                  pct >= 80
                    ? 'text-green-700'
                    : pct >= 60
                      ? 'text-amber-700'
                      : 'text-red-700';

                return (
                  <tr key={s.id} className="border-t border-[#F1F5F9]">
                    <td className="sticky left-0 z-10 bg-white px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name.full} size="sm" />
                        <div>
                          <div className="text-[13px] font-medium text-slate-900">
                            {s.name.short}
                          </div>
                          <div className="text-[11px] text-muted">{s.id}</div>
                        </div>
                      </div>
                    </td>
                    {row.map((v, ci) => {
                      const m = getMarkStyle(v);
                      return (
                        <td key={ci} className="px-1 py-1.5 text-center">
                          <button
                            onClick={() => handleCycle(s.id, ci)}
                            className={`h-[30px] w-9 rounded-md border-none ${m.bg} ${m.fg} cursor-pointer text-[13px] font-bold transition-transform hover:scale-105`}
                          >
                            {m.label}
                          </button>
                        </td>
                      );
                    })}
                    <td
                      className={`px-3.5 py-2.5 text-center text-[13px] font-semibold tabular-nums ${pctColor}`}
                    >
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContent>
  );
}
