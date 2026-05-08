import { useState, useCallback, useMemo } from 'react';
import { Check } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Button, Avatar } from '@/components/ui';
import { generateName, rnum, SUBJECTS } from '@/api/mock/shared-data';
import type { PersonName } from '@/types/shared';

interface Student {
  id: string;
  name: PersonName;
}

interface Grades {
  a1: number;
  a2: number;
  mid: number;
  final: number;
}

type GradeKey = keyof Grades;

const GROUPS = ['301-A', '301-B', '302-A', '205-A'];
const GRADE_KEYS: GradeKey[] = ['a1', 'a2', 'mid', 'final'];
const GRADE_LABELS: Record<GradeKey, string> = {
  a1: 'A1 (10%)',
  a2: 'A2 (10%)',
  mid: 'Oraliq',
  final: 'Yakuniy',
};
const WEIGHTS: Record<GradeKey, number> = { a1: 0.1, a2: 0.1, mid: 0.3, final: 0.5 };

const students: Student[] = Array.from({ length: 10 }, (_, i) => {
  const name = generateName(i + 300);
  return { id: `STD-${String(i + 1).padStart(3, '0')}`, name };
});

function initGrades(): Record<string, Grades> {
  const result: Record<string, Grades> = {};
  students.forEach((s, i) => {
    result[s.id] = {
      a1: rnum(i * 3, 60, 95),
      a2: rnum(i * 5, 55, 92),
      mid: rnum(i * 7, 55, 95),
      final: rnum(i * 11, 55, 95),
    };
  });
  return result;
}

function calcTotal(g: Grades): number {
  return GRADE_KEYS.reduce((sum, k) => sum + g[k] * WEIGHTS[k], 0);
}

function getLetterGrade(total: number): { label: string; variant: 'success' | 'info' | 'warning' | 'error' } {
  if (total >= 86) return { label: "A'lo", variant: 'success' };
  if (total >= 71) return { label: 'Yaxshi', variant: 'info' };
  if (total >= 55) return { label: 'Qoniqarli', variant: 'warning' };
  return { label: 'Qoniqarsiz', variant: 'error' };
}

function gradeColor(value: number): string {
  return value >= 55 ? 'text-slate-800' : 'text-red-700';
}

export function GradingPage() {
  const [group, setGroup] = useState('301-A');
  const [subject, setSubject] = useState('Algoritmlar');
  const [grades, setGrades] = useState<Record<string, Grades>>(initGrades);

  const handleUpdate = useCallback((studentId: string, key: GradeKey, rawValue: string) => {
    const num = Math.max(0, Math.min(100, Number(rawValue) || 0));
    setGrades((prev) => {
      const existing = prev[studentId];
      if (!existing) return prev;
      return {
        ...prev,
        [studentId]: { ...existing, [key]: num } as Grades,
      };
    });
  }, []);

  const totals = useMemo(() => {
    const result: Record<string, number> = {};
    students.forEach((s) => {
      const g = grades[s.id];
      if (g) result[s.id] = calcTotal(g);
    });
    return result;
  }, [grades]);

  return (
    <PageContent>
      <PageHeader
        title="Baholash"
        subtitle="Talabalar baholarini kiritish va tahrirlash"
        breadcrumbs={[
          { label: "Ta'lim", path: '/grading' },
          { label: 'Baholash' },
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
            <label className="text-[11px] font-medium text-muted">Semester</label>
            <select className="h-9 rounded-lg border border-border px-3 text-sm">
              <option>2025-2026 - 2-semester</option>
              <option>2025-2026 - 1-semester</option>
              <option>2024-2025 - 2-semester</option>
            </select>
          </div>
          <div className="flex-1" />
          <div className="text-xs text-muted">
            Og&apos;irlik: A1 10% &middot; A2 10% &middot; Oraliq 30% &middot; Yakuniy 50%
          </div>
          <Button size="sm" leftIcon={<Check className="h-4 w-4" />}>
            Saqlash
          </Button>
        </div>
      </Card>

      {/* Grading table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFB]">
                <th className="px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
                  Talaba
                </th>
                {GRADE_KEYS.map((k) => (
                  <th
                    key={k}
                    className="px-2 py-2.5 text-center text-[11px] font-semibold text-muted"
                  >
                    {GRADE_LABELS[k]}
                  </th>
                ))}
                <th className="px-3.5 py-2.5 text-center text-[11px] font-semibold text-muted">
                  Jami
                </th>
                <th className="px-3.5 py-2.5 text-center text-[11px] font-semibold text-muted">
                  Baho
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const g = grades[s.id];
                if (!g) return null;
                const total = totals[s.id] ?? 0;
                const letterGrade = getLetterGrade(total);

                return (
                  <tr key={s.id} className="border-t border-[#F1F5F9]">
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name.full} size="sm" />
                        <div className="text-[13px] font-medium text-slate-900">
                          {s.name.short}
                        </div>
                      </div>
                    </td>
                    {GRADE_KEYS.map((k) => (
                      <td key={k} className="px-2 py-1.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g[k]}
                          onChange={(e) => handleUpdate(s.id, k, e.target.value)}
                          className={`w-[60px] rounded-md border border-slate-200 py-1.5 text-center text-[13px] font-semibold tabular-nums outline-none transition-colors focus:border-primary-400 focus:ring-1 focus:ring-primary-400 ${gradeColor(g[k])}`}
                        />
                      </td>
                    ))}
                    <td className="px-3.5 py-2.5 text-center text-[15px] font-bold tabular-nums text-slate-900">
                      {total.toFixed(1)}
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      <Badge variant={letterGrade.variant}>{letterGrade.label}</Badge>
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
