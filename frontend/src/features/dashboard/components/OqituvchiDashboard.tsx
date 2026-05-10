import { Users, GraduationCap, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { StatCard, Card } from '@/components/data-display';
import { Badge, Skeleton } from '@/components/ui';
import { useSchedules } from '@/api/hooks/useEducation';
import { useAuthStore } from '@/stores/auth.store';

const PAIR_TIMES: Record<number, string> = {
  1: '08:30 — 10:00',
  2: '10:15 — 11:45',
  3: '12:00 — 13:30',
  4: '13:45 — 15:15',
  5: '15:30 — 17:00',
  6: '17:15 — 18:45',
};

const DAY_NAMES = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

export function OqituvchiDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.currentUser);
  const todayDow = new Date().getDay(); // 0=Sun, 1=Mon...
  const adjustedDow = todayDow === 0 ? 7 : todayDow; // make Sun=7 for filtering

  const { data: scheduleData, isLoading } = useSchedules({
    teacherId: user?.id,
    pageSize: 100,
  });

  const allSchedules = scheduleData?.data ?? [];

  const todaySchedule = allSchedules.filter((s) => s.dayOfWeek === adjustedDow);

  const uniqueGroups = Array.from(
    new Map(allSchedules.map((s) => [s.groupId, { id: s.groupId, name: s.groupName }])).values()
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label={t('dashboard.myGroups')}
          value={uniqueGroups.length}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label={t('dashboard.lessonsCount')}
          value={allSchedules.length}
          icon={<GraduationCap className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label={t('dashboard.todayLessons')}
          value={todaySchedule.length}
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
        />
      </div>

      {/* Today's schedule */}
      <Card title={`${t('dashboard.todaySchedule')} — ${DAY_NAMES[(adjustedDow - 1) % 7] ?? ''}`}>
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
                    {lesson.groupName} · {lesson.room}
                  </p>
                </div>
                <Badge variant="info">{lesson.groupName}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Groups */}
      <Card title="Guruhlarim">
        {uniqueGroups.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">Guruhlar mavjud emas</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {uniqueGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-center"
              >
                <p className="text-lg font-bold text-slate-900">{group.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {allSchedules.filter((s) => s.groupId === group.id).length} ta dars
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
