import { useState } from 'react';
import { Users, TrendingUp, UserCheck, PhoneCall } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard, DonutChart, LineChartSimple } from '@/components/data-display';
import { DateRangePicker } from '@/components/form/DateRangePicker';

type Period = 'month' | 'quarter' | 'year';

const FUNNEL_DATA = [
  { name: 'Murojaatlar', value: 1240 },
  { name: 'Konsultatsiya', value: 870 },
  { name: 'Hujjat topshirdi', value: 540 },
  { name: 'Qabul qilindi', value: 320 },
];

const SOURCES = [
  { source: 'Ijtimoiy tarmoqlar', leads: 410, enrolled: 120, rate: 29, color: '#3B82F6' },
  { source: 'Ochiq eshiklar kuni', leads: 280, enrolled: 95, rate: 34, color: '#2DB976' },
  { source: "Ko'rgazma / Tadbir", leads: 195, enrolled: 58, rate: 30, color: '#F59E0B' },
  { source: "Do'stlar tavsiyasi", leads: 175, enrolled: 71, rate: 41, color: '#8B5CF6' },
  { source: 'Veb-sayt', leads: 140, enrolled: 45, rate: 32, color: '#EC4899' },
  { source: "Reklama (TV/radio)", leads: 40, enrolled: 11, rate: 28, color: '#EF4444' },
];

const SOURCE_DONUT_DATA = SOURCES.map((s) => ({ name: s.source.split(' ')[0] ?? s.source, value: s.leads, color: s.color }));

const MONTHLY_TREND = [
  { name: 'Sen', value: 85 },
  { name: 'Okt', value: 110 },
  { name: 'Noy', value: 95 },
  { name: 'Dek', value: 70 },
  { name: 'Yan', value: 60 },
  { name: 'Feb', value: 78 },
  { name: 'Mar', value: 120 },
  { name: 'Apr', value: 140 },
  { name: 'May', value: 105 },
];

export function CrmReportPage() {
  const [period, setPeriod] = useState<Period>('month');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const totalLeads = FUNNEL_DATA[0]?.value ?? 0;
  const enrolled = FUNNEL_DATA[FUNNEL_DATA.length - 1]?.value ?? 0;
  const conversionRate = totalLeads > 0 ? Math.round((enrolled / totalLeads) * 100) : 0;

  return (
    <PageContent>
      <PageHeader
        title="CRM Hisobot"
        subtitle="Qabul jarayoni statistikasi va konversiya tahlili"
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
                  {p === 'month' ? 'Oy' : p === 'quarter' ? 'Chorak' : 'Yil'}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Jami murojaatlar"
          value={totalLeads.toLocaleString()}
          icon={<PhoneCall className="h-5 w-5" />}
          trend={{ value: 12 }}
        />
        <StatCard
          label="Qabul qilinganlar"
          value={enrolled.toLocaleString()}
          icon={<UserCheck className="h-5 w-5" />}
          trend={{ value: 8 }}
        />
        <StatCard
          label="Konversiya"
          value={`${conversionRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 3 }}
        />
        <StatCard
          label="Faol murojaat"
          value="184"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: -5 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Qabul qilish funnel" className="p-5">
          <div className="space-y-3 mt-2">
            {FUNNEL_DATA.map((stage, i) => {
              const pct = Math.round((stage.value / (FUNNEL_DATA[0]?.value ?? 1)) * 100);
              return (
                <div key={stage.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">{stage.name}</span>
                    <span className="text-slate-500">
                      {stage.value.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="h-6 rounded-lg bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: `hsl(${150 - i * 30}, 70%, ${50 + i * 5}%)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Oylik dinamika" className="p-5">
          <LineChartSimple data={MONTHLY_TREND} color="#2DB976" showArea height={220} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">
        <Card title="Murojaatlar manbalari" className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                MANBA
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                MUROJAATLAR
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                QABUL QILINGAN
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                KONVERSIYA
              </th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((s, i) => (
              <tr key={s.source} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{s.source}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600 text-right">
                  {s.leads.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-600 text-right">{s.enrolled}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`text-[13px] font-medium ${
                      s.rate >= 35
                        ? 'text-emerald-600'
                        : s.rate >= 30
                          ? 'text-blue-600'
                          : 'text-slate-600'
                    }`}
                  >
                    {s.rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </Card>
        <Card title="Manba ulushi" className="p-5">
          <DonutChart data={SOURCE_DONUT_DATA} size={220} innerRadius={60} />
        </Card>
      </div>
    </PageContent>
  );
}
