import { BookOpen, Clock, FileText, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { StatCard, Card } from '@/components/data-display';
import { Badge, Skeleton } from '@/components/ui';
import { useSchedules, useGrades } from '@/api/hooks/useEducation';
import { useStudent } from '@/api/hooks/useStudents';
import { useAuthStore } from '@/stores/auth.store';
import { formatDate } from '@/lib/utils';

const PAIR_TIMES: Record<number, string> = {
  1: '08:30 — 10:00',
  2: '10:15 — 11:45',
  3: '12:00 — 13:30',
  4: '13:45 — 15:15',
  5: '15:30 — 17:00',
  6: '17:15 — 18:45',
};

function gradeVariant(grade: number): 'success' | 'warning' | 'error' {
  if (grade >= 86) return 'success';
  if (grade >= 71) return 'warning';
  return 'error';
}

export function TalabaDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.currentUser);
  const todayDow = new Date().getDay();
  const adjustedDow = todayDow === 0 ? 7 : todayDow;

  const { data: studentDetail } = useStudent(user?.studentId ?? 0);
  const groupId = studentDetail?.group?.id;

  const { data: scheduleData, isLoading: schedLoading } = useSchedules({
    groupId,
    pageSize: 100,
  });

  const { data: gradesData, isLoading: gradesLoading } = useGrades({
    studentId: user?.studentId ?? undefined,
    pageSize: 10,
  });

  const allSchedules = scheduleData?.data ?? [];
  const todaySchedule = allSchedules.filter((s) => s.dayOfWeek === adjustedDow);
  const recentGrades = gradesData?.data ?? [];

  if (schedLoading || gradesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const avgScore = recentGrades.length > 0
    ? (recentGrades.reduce((sum, g) => sum + g.score, 0) / recentGrades.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t('dashboard.avgGrade')}
          value={avgScore}
          icon={<BookOpen className="h-5 w-5" />}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatCard
          label={t('dashboard.todayLessons')}
          value={todaySchedule.length}
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
        />
        <StatCard
          label={t('dashboard.gradesCount')}
          value={recentGrades.length}
          icon={<FileText className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label={t('dashboard.totalLessons')}
          value={allSchedules.length}
          icon={<Calendar className="h-5 w-5" />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      {/* Today's schedule */}
      <Card title={t('dashboard.todaySchedule')}>
        {todaySchedule.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">{t('dashboard.noLessonsToday')}</p>
        ) : (
          <div className="space-y-3">
            {todaySchedule.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4"
              >
                <div className="w-28 shrink-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {PAIR_TIMES[lesson.pairNumber] ?? `${lesson.pairNumber}-juft`}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{lesson.subjectName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {lesson.teacherName} · {lesson.room}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent grades */}
      <Card title="So'nggi baholar">
        {recentGrades.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Baholar mavjud emas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 font-medium text-slate-500">Fan</th>
                  <th className="pb-3 font-medium text-slate-500">Turi</th>
                  <th className="pb-3 font-medium text-slate-500">Baho</th>
                  <th className="pb-3 text-right font-medium text-slate-500">Sana</th>
                </tr>
              </thead>
              <tbody>
                {recentGrades.map((g) => (
                  <tr key={g.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-900">{g.subjectName}</td>
                    <td className="py-3 text-slate-600">{g.gradeType}</td>
                    <td className="py-3">
                      <Badge variant={gradeVariant(g.score)}>
                        {g.score}/{g.maxScore}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-slate-400">
                      {formatDate ? formatDate(String(g.semesterId)) : g.semesterId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
