import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, ChartCard, LineChartSimple, BarChartSimple, DonutChart } from '@/components/data-display';
import { Spinner } from '@/components/ui';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { Users, UserCog, FileText, Percent } from 'lucide-react';
import { useAnalytics } from '@/api/hooks/useAnalytics';
import { useStudentStatistics } from '@/api/hooks/useStudents';
import type { AnalyticsParams } from '@/types/admin';

const PAYMENT_COLORS: Record<string, string> = {
  "Davlat granti": '#2DB976',
  "To'lov-shartnoma": '#3B82F6',
};

export function AnalyticsPage() {
  const { t } = useTranslation();
  const [params] = useState<AnalyticsParams>({ period: 'year' });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { data, isLoading } = useAnalytics(params);
  const { data: studentStats } = useStudentStatistics();

  if (isLoading || !data) {
    return <PageContent><div className="flex justify-center py-20"><Spinner size="lg" /></div></PageContent>;
  }

  const studentTrend = data.studentTrend.map((d) => ({ name: d.month, value: d.count }));
  const paymentDonut = (studentStats?.byPaymentForm ?? []).map((p, i) => ({
    name: p.form,
    value: p.count,
    color: PAYMENT_COLORS[p.form] ?? (i % 2 === 0 ? '#2DB976' : '#3B82F6'),
  }));
  const facultyData = data.byFaculty.map((f) => ({ name: f.faculty.slice(0, 12), value: f.students }));
  const totalStudents = data.studentTrend[data.studentTrend.length - 1]?.count ?? 0;
  const totalRevenue = data.revenueTrend.reduce((s, m) => s + m.amount, 0);

  return (
    <PageContent>
      <PageHeader
        title={t('admin.analyticsTitle')}
        subtitle={t('admin.analyticsSubtitle')}
        breadcrumbs={[{ label: t('nav.admin') }, { label: t('nav.analytics') }]}
        actions={
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onChange={(f, t) => { setDateFrom(f); setDateTo(t); }}
          />
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label={t('admin.totalStudents')} value={totalStudents} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
        <StatCard label={t('admin.annualRevenue')} value={`${(totalRevenue / 1_000_000_000).toFixed(1)} mlrd`} sub="so'm" icon={<FileText className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label={t('admin.avgGpa')} value={data.topGroups[0]?.avgGrade.toFixed(1) ?? '—'} icon={<Percent className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label={t('admin.attendanceRate')} value={`${data.attendanceRate[data.attendanceRate.length - 1]?.rate ?? 0}%`} icon={<UserCog className="h-[18px] w-[18px]" />} iconBg="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title={t('admin.monthlyGrowth')} subtitle={t('admin.studentContingent')}>
          <LineChartSimple data={studentTrend} showArea color="#2DB976" height={240} />
        </ChartCard>
        <ChartCard title={t('admin.byFaculty')} subtitle={t('admin.byFacultySubtitle')}>
          <BarChartSimple data={facultyData} horizontal color="#3B82F6" height={240} />
        </ChartCard>
        <ChartCard title={t('admin.paymentStatus')} subtitle={t('admin.paymentSubtitle')}>
          <DonutChart data={paymentDonut.length > 0 ? paymentDonut : []} size={220} innerRadius={60} />
        </ChartCard>
        <ChartCard title={t('admin.topGroups')} subtitle={t('admin.topGroupsSubtitle')}>
          <div className="flex flex-col gap-2.5">
            {data.topGroups.map((g, i) => (
              <div key={g.group} className="flex items-center gap-3">
                <div className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md text-xs font-bold ${i < 3 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-900">{g.group}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Davomat: {g.attendanceRate}%</p>
                </div>
                <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${g.avgGrade}%` }} />
                </div>
                <span className="min-w-[40px] text-right text-sm font-bold text-green-700 tabular-nums">{g.avgGrade}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </PageContent>
  );
}
