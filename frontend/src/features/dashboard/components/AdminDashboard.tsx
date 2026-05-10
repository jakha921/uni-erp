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
import { Badge, Skeleton } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { useAdminDashboard } from '@/api/hooks/useDashboard';
import { useStudentStatistics } from '@/api/hooks/useStudents';
import { useFinanceDashboard } from '@/api/hooks/useFinance';
import { useFaculties } from '@/api/hooks/useCore';
import { ActivityFeed } from './ActivityFeed';

const GENDER_COLORS: Record<string, string> = {
  Erkak: '#3B82F6',
  Ayol: '#EC4899',
};

const ACTIVITY_ICON_MAP: Record<string, 'money' | 'users' | 'doc' | 'check'> = {
  payment: 'money',
  student: 'users',
  order: 'doc',
  attendance: 'check',
};

const ACTIVITY_COLORS: Record<string, { color: string; bg: string }> = {
  payment: { color: '#10B981', bg: '#ECFDF5' },
  student: { color: '#3B82F6', bg: '#EFF6FF' },
  order: { color: '#8B5CF6', bg: '#F5F3FF' },
  attendance: { color: '#F59E0B', bg: '#FFFBEB' },
};

export function AdminDashboard() {
  const { t } = useTranslation();
  const { data: adminData, isLoading: adminLoading } = useAdminDashboard();
  const { data: studentStats, isLoading: statsLoading } = useStudentStatistics();
  const { data: financeStats } = useFinanceDashboard();
  const { data: faculties } = useFaculties();

  const isLoading = adminLoading || statsLoading;

  const fmtCompact = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} mlrd`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln`;
    return new Intl.NumberFormat('uz-UZ').format(n);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const genderDonut = (studentStats?.byGender ?? []).map((g) => ({
    name: g.gender,
    value: g.count,
    color: GENDER_COLORS[g.gender] ?? '#94A3B8',
  }));

  const facultyDonut = (faculties ?? []).slice(0, 5).map((f, i) => ({
    name: f.name.slice(0, 12),
    value: (studentStats?.byFaculty.find((b) => b.faculty === f.name)?.count ?? 0),
    color: ['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'][i % 5] ?? '#94A3B8',
  })).filter((f) => f.value > 0);

  const paymentDonut = (financeStats?.byStatus ?? []).map((s, i) => ({
    name: s.status,
    value: s.count,
    color: ['#10B981', '#F59E0B', '#EF4444'][i % 3] ?? '#94A3B8',
  }));

  const monthlyPaymentsChart = (financeStats?.byMonth ?? []).map((m) => ({
    name: m.month,
    value: m.amount / 1_000_000,
    color: '#2DB976',
  }));

  const activityItems = (adminData?.recentActivity ?? []).slice(0, 5).map((a: { id: number; type: string; description: string; date: string; user: string }) => ({
    id: String(a.id),
    icon: ACTIVITY_ICON_MAP[a.type] ?? 'doc' as const,
    color: ACTIVITY_COLORS[a.type]?.color ?? '#64748B',
    bg: ACTIVITY_COLORS[a.type]?.bg ?? '#F8FAFC',
    title: a.description,
    sub: a.user,
    time: a.date,
  }));

  return (
    <div className="space-y-6">
      {/* Semester badge */}
      <div className="flex items-center justify-between">
        <Badge variant="success" dot>
          Navoiy (bosh filial) · 2025-2026 · 2-semester
        </Badge>
      </div>

      {/* Row 1: Core stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label={t('dashboard.faculties')}
          value={faculties?.length ?? '—'}
          icon={<Briefcase className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
        />
        <StatCard
          label={t('dashboard.departments')}
          value="—"
          icon={<LayoutGrid className="h-[18px] w-[18px]" />}
          iconBg="#10B981"
        />
        <StatCard
          label={t('dashboard.teachers')}
          value={new Intl.NumberFormat('uz-UZ').format(adminData?.totalEmployees ?? 0)}
          icon={<UserCheck className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label={t('dashboard.totalStudents')}
          value={new Intl.NumberFormat('uz-UZ').format(adminData?.totalStudents ?? 0)}
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#1B7A4E"
        />
        <StatCard
          label={t('dashboard.newStudents')}
          value={adminData?.newStudents ?? '—'}
          icon={<GraduationCap className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label={t('dashboard.graduates')}
          value={adminData?.graduatedStudents ?? '—'}
          icon={<BookOpen className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
      </div>

      {/* Row 2: Financial stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label={t('dashboard.revenue')}
          value={fmtCompact(financeStats?.totalPaid ?? 0)}
          icon={<Wallet className="h-[18px] w-[18px]" />}
          iconBg="#10B981"
        />
        <StatCard
          label={t('dashboard.debtors')}
          value={financeStats?.debtorCount ?? '—'}
          icon={<AlertTriangle className="h-[18px] w-[18px]" />}
          iconBg="#EF4444"
        />
        <StatCard
          label={t('dashboard.contracts')}
          value={new Intl.NumberFormat('uz-UZ').format(financeStats?.totalContracts ?? 0)}
          icon={<FileText className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label={t('dashboard.totalDebt')}
          value={fmtCompact(financeStats?.totalDebt ?? 0)}
          icon={<Inbox className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label={t('dashboard.scholarships')}
          value={financeStats?.scholarshipCount ?? '—'}
          icon={<Award className="h-[18px] w-[18px]" />}
          iconBg="#14B8A6"
        />
        <StatCard
          label={t('dashboard.avgGrade')}
          value={adminData?.avgGrade.toFixed(1) ?? '—'}
          icon={<Clock className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
      </div>

      {/* Row 3: 3 Donut charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <ChartCard title={t('dashboard.byFaculty')} subtitle={t('dashboard.totalStudents')}>
          <DonutChart data={facultyDonut} size={160} />
        </ChartCard>
        <ChartCard title={t('dashboard.byGender')} subtitle="2025-26">
          <DonutChart data={genderDonut} size={160} />
        </ChartCard>
        <ChartCard title={t('dashboard.paymentStatus')} subtitle={t('dashboard.contracts')}>
          <DonutChart data={paymentDonut} size={160} />
        </ChartCard>
      </div>

      {/* Row 4: Line chart + Activity */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard
          title={t('dashboard.monthlyPayments')}
          subtitle="mln so'm"
          action={<Badge variant="success" dot>+8.4% YoY</Badge>}
        >
          <LineChartSimple data={monthlyPaymentsChart} showArea color="#2DB976" height={200} />
        </ChartCard>
        <ActivityFeed items={activityItems} />
      </div>
    </div>
  );
}
