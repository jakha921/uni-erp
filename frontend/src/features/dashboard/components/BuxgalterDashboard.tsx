import { FileText, Wallet, AlertTriangle, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  StatCard,
  ChartCard,
  DonutChart,
  LineChartSimple,
  Card,
} from '@/components/data-display';
import { Badge } from '@/components/ui';
import { useDashboardStats } from '../hooks/useDashboardStats';

const paymentStatusData = [
  { name: "To'langan", value: 2150, color: '#10B981' },
  { name: 'Qisman', value: 680, color: '#F59E0B' },
  { name: "To'lanmagan", value: 415, color: '#EF4444' },
];

const recentPayments = [
  { id: '1', student: 'Xolmatov A.', amount: '2 500 000', method: 'Click', time: '5 daq. oldin' },
  { id: '2', student: 'Karimova N.', amount: '1 800 000', method: 'Payme', time: '12 daq. oldin' },
  { id: '3', student: 'Toshmatov B.', amount: '3 200 000', method: 'Bank', time: '30 daq. oldin' },
  { id: '4', student: 'Rahimov S.', amount: '2 100 000', method: 'Naqd', time: '1 soat oldin' },
  { id: '5', student: 'Azimova D.', amount: '1 500 000', method: 'Click', time: '2 soat oldin' },
];

export function BuxgalterDashboard() {
  const { t } = useTranslation();
  const { stats, monthlyPayments } = useDashboardStats();

  const fmtCompact = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} mlrd`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln`;
    return new Intl.NumberFormat('uz-UZ').format(n);
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t('nav.contracts', 'Kontraktlar')}
          value={new Intl.NumberFormat('uz-UZ').format(stats.totalContracts)}
          icon={<FileText className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Tushumlar"
          value={fmtCompact(stats.totalRevenue)}
          icon={<Wallet className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={{ value: 12.3, label: 'YoY' }}
        />
        <StatCard
          label="Jami qarz"
          value={fmtCompact(stats.totalDebt)}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <StatCard
          label="Yig'ilish darajasi"
          value={`${stats.collectionRate}%`}
          icon={<Percent className="h-5 w-5" />}
          iconBg="bg-teal-100"
          iconColor="text-teal-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="To'lov holati" subtitle="Kontraktlar bo'yicha">
          <DonutChart data={paymentStatusData} size={220} />
        </ChartCard>
        <ChartCard
          title="Oylik to'lovlar trendi"
          subtitle="mln so'm"
          action={<Badge variant="success" dot>+15.2% YoY</Badge>}
        >
          <LineChartSimple data={monthlyPayments} showArea color="#10B981" height={220} />
        </ChartCard>
      </div>

      {/* Recent payments */}
      <Card title="So'nggi to'lovlar" subtitle="Bugungi kun">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 font-medium text-slate-500">Talaba</th>
                <th className="pb-3 font-medium text-slate-500">Summa</th>
                <th className="pb-3 font-medium text-slate-500">Usul</th>
                <th className="pb-3 text-right font-medium text-slate-500">Vaqt</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-900">{p.student}</td>
                  <td className="py-3 tabular-nums text-slate-700">{p.amount} so&apos;m</td>
                  <td className="py-3">
                    <Badge variant="info">{p.method}</Badge>
                  </td>
                  <td className="py-3 text-right text-slate-400">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
