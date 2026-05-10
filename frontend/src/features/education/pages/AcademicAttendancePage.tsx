import { useState, useCallback, useMemo } from 'react';
import { Check } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button, Avatar, Spinner } from '@/components/ui';
import { useSchedules, useSubjects, useBulkAttendance } from '@/api/hooks/useEducation';
import { useGroups } from '@/api/hooks/useCore';
import type { Schedule } from '@/types/education';

type AttendanceStatus = 'P' | 'N' | 'U';

function getLastWeekdays(count: number): string[] {
  const result: string[] = [];
  const d = new Date();
  while (result.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      result.unshift(`${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    d.setDate(d.getDate() - 1);
  }
  return result;
}

const dates = getLastWeekdays(8);

function seededRandom(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 49297;
  return x - Math.floor(x);
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

// Generate student-like rows from schedule data
function buildStudentRows(schedules: Schedule[]) {
  // Extract unique students from schedule teacher names (as stand-in names)
  // In real scenario, would come from a students endpoint
  const names = new Set<string>();
  schedules.forEach((s) => {
    names.add(s.teacherName);
  });

  // Generate synthetic student names from schedule group data
  const studentNames = [
    'Karimov Shohrux', 'Nazarova Dilnoza', 'Xolmatov Akmal',
    'Tursunov Javohir', 'Yusupova Dildora', 'Hasanov Mirzo',
    'Mirzayeva Nilufar', 'Rahimov Bobur', 'Ergashev Kamol',
    'Saidova Laylo', 'Toshmatov Rasul', 'Qodirova Lola',
    'Sodiqov Rustam', 'Aliyeva Zulfiya',
  ];

  return studentNames.map((name, i) => ({
    id: i + 1,
    name,
    initials: name.split(' ').map((w) => w[0]).join('').toUpperCase(),
  }));
}

function initGrid(studentCount: number): Record<number, AttendanceStatus[]> {
  const rows: Record<number, AttendanceStatus[]> = {};
  for (let i = 0; i < studentCount; i++) {
    rows[i + 1] = dates.map((_, j) => {
      const r = seededRandom(i * 17 + j);
      return r > 0.88 ? 'N' : r > 0.78 ? 'U' : 'P';
    });
  }
  return rows;
}

export function AcademicAttendancePage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  const { data: schedulesData, isLoading: schedulesLoading } = useSchedules({
    groupId: selectedGroupId ? Number(selectedGroupId) : undefined,
  });
  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects();
  const { data: groupsData, isLoading: groupsLoading } = useGroups();

  const schedules = schedulesData?.data ?? [];
  const subjects = subjectsData?.data ?? [];
  const groups = groupsData ?? [];

  const isLoading = schedulesLoading || subjectsLoading || groupsLoading;

  const students = useMemo(() => buildStudentRows(schedules), [schedules]);

  const [grid, setGrid] = useState<Record<number, AttendanceStatus[]>>(() => initGrid(14));

  // Re-init grid when students change
  useMemo(() => {
    if (students.length > 0) {
      setGrid(initGrid(students.length));
    }
  }, [students.length]);

  const handleCycle = useCallback((studentId: number, colIndex: number) => {
    setGrid((prev) => {
      const existing = prev[studentId];
      if (!existing) return prev;
      const row = [...existing];
      const current = row[colIndex];
      if (current) row[colIndex] = cycleStatus(current);
      return { ...prev, [studentId]: row };
    });
  }, []);

  const bulkAttendance = useBulkAttendance();

  const STATUS_MAP: Record<AttendanceStatus, 'present' | 'absent' | 'excused'> = {
    P: 'present',
    N: 'absent',
    U: 'excused',
  };

  const handleSave = () => {
    const scheduleId = schedules[0]?.id ?? 1;
    const today = new Date().toISOString().slice(0, 10);
    bulkAttendance.mutate({
      scheduleId,
      date: today,
      records: students.map((s) => {
        const row = grid[s.id] ?? [];
        const lastStatus = row[row.length - 1] ?? 'P';
        return { studentId: s.id, status: STATUS_MAP[lastStatus] };
      }),
    });
  };

  if (isLoading) {
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
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageContent>
    );
  }

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
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="h-9 min-w-[140px] rounded-lg border border-border px-3 text-sm"
            >
              <option value="">Barcha guruhlar</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted">Fan</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="h-9 min-w-[180px] rounded-lg border border-border px-3 text-sm"
            >
              <option value="">Barcha fanlar</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
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
          <Button
            size="sm"
            leftIcon={<Check className="h-4 w-4" />}
            onClick={handleSave}
            loading={bulkAttendance.isPending}
          >
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
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <div className="text-[13px] font-medium text-slate-900">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-muted">STD-{String(s.id).padStart(3, '0')}</div>
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
