import { FileText, Wallet, AlertTriangle, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  StatCard,
  ChartCard,
  DonutChart,
  LineChartSimple,
  Card,
} from '@/components/data-display';
import { Badge, Spinner } from '@/components/ui';
import { useFinanceDashboard } from '@/api/hooks/useFinance';
import { usePayments } from '@/api/hooks/useFinance';
import { formatMoney } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  active: '#F59E0B',
  completed: '#10B981',
  cancelled: '#EF4444',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Faol',
  completed: "To'langan",
  cancelled: 'Bekor qilingan',
};

export function BuxgalterDashboard() {
  const { t } = useTranslation();
  const { data: dashStats, isLoading } = useFinanceDashboard();
  const { data: recentData } = usePayments({ pageSize: 5 });

  const fmtCompact = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} mlrd`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln`;
    return new Intl.NumberFormat('uz-UZ').format(n);
  };

  if (isLoading || !dashStats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const paymentStatusData = (dashStats.byStatus ?? []).map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s.count,
    color: STATUS_COLORS[s.status] ?? '#94A3B8',
  }));

  const monthlyPayments = (dashStats.byMonth ?? []).map((m) => ({
    name: m.month,
    value: m.amount / 1_000_000,
    color: '#10B981',
  }));

  const recentPayments = recentData?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t('nav.contracts', 'Kontraktlar')}
          value={new Intl.NumberFormat('uz-UZ').format(dashStats.totalContracts)}
          icon={<FileText className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Tushumlar"
          value={fmtCompact(dashStats.totalPaid)}
          icon={<Wallet className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={{ value: 12.3, label: 'YoY' }}
        />
        <StatCard
          label="Jami qarz"
          value={fmtCompact(dashStats.totalDebt)}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <StatCard
          label="Yig'ilish darajasi"
          value={`${dashStats.collectionRate.toFixed(1)}%`}
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
                <th className="pb-3 text-right font-medium text-slate-500">Sana</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-900">{p.studentName}</td>
                  <td className="py-3 tabular-nums text-slate-700">{formatMoney(p.amount)}</td>
                  <td className="py-3">
                    <Badge variant="info">{p.paymentMethod}</Badge>
                  </td>
                  <td className="py-3 text-right text-slate-400">{p.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
