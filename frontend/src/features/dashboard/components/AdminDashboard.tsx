import {
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  Wallet,
  AlertTriangle,
  Briefcase,
  Inbox,
  Clock,
  BookOpen,
  Award,
  LayoutGrid,
} from 'lucide-react';

import { StatCard, ChartCard, DonutChart, LineChartSimple } from '@/components/data-display';
import { Badge } from '@/components/ui';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { ActivityFeed } from './ActivityFeed';

export function AdminDashboard() {
  const { stats, activities, studentsByRegion, studentsByGender, monthlyPayments } =
    useDashboardStats();

  const fmtCompact = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} mlrd`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln`;
    return new Intl.NumberFormat('uz-UZ').format(n);
  };

  const studentsByAge = [
    { name: '17-20 yosh', value: 1580, color: '#2DB976' },
    { name: '21-24 yosh', value: 1340, color: '#F59E0B' },
    { name: '25+ yosh', value: 327, color: '#64748B' },
  ];

  return (
    <div className="space-y-6">
      {/* Semester badge */}
      <div className="flex items-center justify-between">
        <Badge variant="success" dot>
          Navoiy (bosh filial) · 2025-2026 · 2-semester
        </Badge>
      </div>

      {/* Row 1: Core stats (6 cols) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Fakultetlar"
          value="8"
          icon={<Briefcase className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
        />
        <StatCard
          label="Kafedralar"
          value="24"
          icon={<LayoutGrid className="h-[18px] w-[18px]" />}
          iconBg="#10B981"
        />
        <StatCard
          label="O'qituvchilar"
          value={String(stats.totalEmployees)}
          icon={<UserCheck className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Talabalar"
          value={new Intl.NumberFormat('uz-UZ').format(stats.totalStudents)}
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#1B7A4E"
        />
        <StatCard
          label="Xonalar"
          value="142"
          icon={<GraduationCap className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Guruhlar"
          value="89"
          icon={<BookOpen className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
      </div>

      {/* Row 2: Financial stats (6 cols) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Tushumlar"
          value={`${fmtCompact(stats.totalRevenue)}M`}
          icon={<Wallet className="h-[18px] w-[18px]" />}
          iconBg="#10B981"
        />
        <StatCard
          label="Qarzdorlar"
          value={String(stats.debtorCount)}
          icon={<AlertTriangle className="h-[18px] w-[18px]" />}
          iconBg="#EF4444"
        />
        <StatCard
          label="Kontraktlar"
          value={new Intl.NumberFormat('uz-UZ').format(stats.totalContracts)}
          icon={<FileText className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Jami qarz"
          value={`${fmtCompact(stats.totalDebt)}M`}
          icon={<Inbox className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Stipendiyalar"
          value={String(stats.scholarshipCount)}
          icon={<Award className="h-[18px] w-[18px]" />}
          iconBg="#14B8A6"
        />
        <StatCard
          label="Buyruqlar"
          value="18"
          icon={<Clock className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
      </div>

      {/* Row 3: 3 Donut charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <ChartCard title="Viloyatlar bo'yicha" subtitle="Barcha">
          <DonutChart data={studentsByRegion} size={160} />
        </ChartCard>
        <ChartCard title="Jinsi bo'yicha" subtitle="2025-26">
          <DonutChart data={studentsByGender} size={160} />
        </ChartCard>
        <ChartCard title="Yoshi bo'yicha" subtitle="2025-26">
          <DonutChart data={studentsByAge} size={160} />
        </ChartCard>
      </div>

      {/* Row 4: Line chart + Activity (1.6fr 1fr) */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard
          title="Talabalar dinamikasi"
          subtitle="12 oy"
          action={<Badge variant="success" dot>+8.4% YoY</Badge>}
        >
          <LineChartSimple data={monthlyPayments} showArea color="#2DB976" height={200} />
        </ChartCard>
        <ActivityFeed items={activities} />
      </div>
    </div>
  );
}
