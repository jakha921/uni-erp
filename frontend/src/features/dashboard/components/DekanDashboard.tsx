import { Users, UserCheck, BookOpen, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  StatCard,
  ChartCard,
  DonutChart,
  BarChartSimple,
} from '@/components/data-display';
import { Skeleton } from '@/components/ui';
import { useStudentStatistics } from '@/api/hooks/useStudents';
import { useEmployees } from '@/api/hooks/useHr';

const GENDER_COLORS: Record<string, string> = {
  Erkak: '#3B82F6',
  Ayol: '#EC4899',
};

export function DekanDashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useStudentStatistics();
  const { data: empData } = useEmployees({ pageSize: 1 });

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const studentsByCourse = stats.byCourse.map((c) => ({
    name: `${c.course}-kurs`,
    value: c.count,
    color: '#2DB976',
  }));

  const studentsByGender = stats.byGender.map((g) => ({
    name: g.gender,
    value: g.count,
    color: GENDER_COLORS[g.gender] ?? '#94A3B8',
  }));

  const activeCount = stats.byStatus.find((s) => s.status === "O'qimoqda")?.count ?? 0;
  const attendanceRate = stats.totalStudents > 0
    ? Math.round((activeCount / stats.totalStudents) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t('dashboard.facultyStudents')}
          value={new Intl.NumberFormat('uz-UZ').format(stats.totalStudents)}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={{ value: 5.2, label: "o'tgan yilga" }}
        />
        <StatCard
          label={t('nav.employees')}
          value={empData?.total ?? '—'}
          icon={<UserCheck className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label={t('dashboard.activeStudents')}
          value={activeCount}
          icon={<BookOpen className="h-5 w-5" />}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatCard
          label={t('nav.attendance')}
          value={`${attendanceRate}%`}
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
          trend={{ value: 2.1, label: 'oy' }}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title={t('dashboard.byCourseStudents')} subtitle="2025-2026 o'quv yili">
          <BarChartSimple data={studentsByCourse} color="#2DB976" height={260} />
        </ChartCard>
        <ChartCard title={t('dashboard.byGender')} subtitle={t('dashboard.facultyStudents')}>
          <DonutChart data={studentsByGender} size={220} />
        </ChartCard>
      </div>
    </div>
  );
}
