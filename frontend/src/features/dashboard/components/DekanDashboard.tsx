import { Users, UserCheck, BookOpen, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  StatCard,
  ChartCard,
  DonutChart,
  BarChartSimple,
} from '@/components/data-display';
import { useDashboardStats } from '../hooks/useDashboardStats';

export function DekanDashboard() {
  const { t } = useTranslation();
  const { stats, studentsByCourse, studentsByGender } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Fakultet talabalari"
          value={new Intl.NumberFormat('uz-UZ').format(stats.totalStudents)}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={{ value: 5.2, label: 'o\'tgan yilga' }}
        />
        <StatCard
          label={t('nav.employees', 'Xodimlar')}
          value={stats.totalEmployees}
          icon={<UserCheck className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="O'rtacha GPA"
          value={stats.avgGpa.toFixed(2)}
          icon={<BookOpen className="h-5 w-5" />}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatCard
          label={t('nav.attendance', 'Davomat')}
          value={`${stats.attendanceRate}%`}
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
          trend={{ value: 2.1, label: 'oy' }}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Kurslar bo'yicha talabalar" subtitle="2025-2026 o'quv yili">
          <BarChartSimple data={studentsByCourse} color="#2DB976" height={260} />
        </ChartCard>
        <ChartCard title="Jinsi bo'yicha taqsimot" subtitle="Fakultet talabalari">
          <DonutChart data={studentsByGender} size={220} />
        </ChartCard>
      </div>
    </div>
  );
}
