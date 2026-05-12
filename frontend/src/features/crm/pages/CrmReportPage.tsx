import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, TrendingUp, UserCheck, PhoneCall } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard, DonutChart, LineChartSimple } from '@/components/data-display';
import { AlertBanner, Spinner } from '@/components/ui';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { useCrmStats } from '@/api/hooks/useCrm';

type Period = 'month' | 'quarter' | 'year';

const SOURCE_COLORS = ['#3B82F6', '#2DB976', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'];

export function CrmReportPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('month');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: stats, isLoading, error } = useCrmStats();

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  if (isLoading || !stats) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center"><Spinner /></div>
      </PageContent>
    );
  }

  const funnelData = stats.funnel ?? [];
  const totalLeads = stats.totalLeads;
  const enrolled = stats.enrolledLeads;
  const conversionRate = stats.conversionRate;
  const newLeads = stats.newLeads;

  const sourceDonutData = (stats.bySource ?? []).map((s, i) => ({
    name: s.source,
    value: s.count,
    color: SOURCE_COLORS[i % SOURCE_COLORS.length] ?? '#94A3B8',
  }));

  // Monthly trend from byStatus as a simple series (placeholder shape until backend provides monthly)
  const monthlyTrend = (stats.byStatus ?? []).map((s) => ({
    name: s.status,
    value: s.count,
    color: '#2DB976',
  }));

  return (
    <PageContent>
      <PageHeader
        title={t('crm.reportTitle')}
        subtitle={t('crm.reportSubtitle')}
        breadcrumbs={[{ label: 'CRM', path: '/crm' }, { label: 'Hisobot' }]}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              onChange={(f, t) => { setDateFrom(f); setDateTo(t); }}
            />
            <div className="flex gap-1 rounded-lg border border-border p-1 bg-white">
              {(['month', 'quarter', 'year'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    period === p
                      ? 'bg-primary-500 text-white font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p === 'month' ? t('crm.periodMonth') : p === 'quarter' ? t('crm.periodQuarter') : t('crm.periodYear')}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label={t('crm.totalAppeals')}
          value={totalLeads.toLocaleString()}
          icon={<PhoneCall className="h-5 w-5" />}
          trend={{ value: 12 }}
        />
        <StatCard
          label={t('crm.enrolledCount')}
          value={enrolled.toLocaleString()}
          icon={<UserCheck className="h-5 w-5" />}
          trend={{ value: 8 }}
        />
        <StatCard
          label={t('crm.conversion')}
          value={`${conversionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 3 }}
        />
        <StatCard
          label={t('crm.newAppeals')}
          value={newLeads.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: -5 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title={t('crm.admissionFunnel')} className="p-5">
          <div className="space-y-3 mt-2">
            {funnelData.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">{stage.stage}</span>
                  <span className="text-slate-500">
                    {stage.count.toLocaleString()} ({stage.percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-6 rounded-lg bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all"
                    style={{
                      width: `${stage.percent}%`,
                      backgroundColor: `hsl(${150 - i * 30}, 70%, ${50 + i * 5}%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={t('crm.statusDynamic')} className="p-5">
          <LineChartSimple data={monthlyTrend} color="#2DB976" showArea height={220} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">
        <Card title={t('crm.appealSources')} className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{t('crm.sourceLabel')}</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{t('crm.appealsLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {(stats.bySource ?? []).map((s, i) => (
                <tr key={s.source} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{s.source}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600 text-right">{s.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title={t('crm.sourceShare')} className="p-5">
          <DonutChart data={sourceDonutData} size={220} innerRadius={60} />
        </Card>
      </div>
    </PageContent>
  );
}
