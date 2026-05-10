import { useNavigate } from 'react-router-dom';
import { Banknote } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { useFinanceDashboard } from '@/api/hooks/useFinance';
import { usePayments } from '@/api/hooks/useFinance';
import { useContracts } from '@/api/hooks/useFinance';
import { formatMoney, formatDate } from '@/lib/utils';
import { FinanceKpiRow } from '../components/FinanceKpiRow';
import { PaymentStatusDonut } from '../components/PaymentStatusDonut';
import { RevenueByFaculty } from '../components/RevenueByFaculty';
import { MonthlyTrend } from '../components/MonthlyTrend';
import { DebtorCard } from '../components/DebtorCard';
import type { PaymentMethod } from '@/types/finance';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, { variant: 'info' | 'default' | 'success' | 'warning'; label: string }> = {
  bank: { variant: 'info', label: "Bank o'tkazmasi" },
  naqd: { variant: 'default', label: 'Naqd' },
  online: { variant: 'success', label: 'Online' },
  click: { variant: 'success', label: 'Click' },
  payme: { variant: 'warning', label: 'Payme' },
};

export function FinanceDashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useFinanceDashboard();
  const { data: paymentsData } = usePayments({ pageSize: 10 });
  const { data: contractsData } = useContracts({ pageSize: 100 });

  if (statsLoading || !stats) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </PageContent>
    );
  }

  const recentPayments = paymentsData?.data.slice(0, 10) ?? [];
  const topDebtors = (contractsData?.data ?? [])
    .filter((c) => c.debtAmount > 0 && c.status === 'active')
    .sort((a, b) => b.debtAmount - a.debtAmount)
    .slice(0, 5);

  return (
    <PageContent>
      <PageHeader
        title="Moliyaviy panel"
        subtitle="Kontrakt to'lovlari va moliyaviy ko'rsatkichlar"
        breadcrumbs={[{ label: 'Moliya' }]}
      />

      {/* KPI row */}
      <FinanceKpiRow
        totalAmount={stats.totalContractAmount}
        totalPaid={stats.totalPaid}
        totalDebt={stats.totalDebt}
        collectionRate={stats.collectionRate}
        contractCount={stats.totalContracts}
        debtorCount={stats.debtorCount}
      />

      {/* Charts grid 2x2 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PaymentStatusDonut
          full={stats.byStatus?.[0]?.count ?? 0}
          partial={stats.byStatus?.[1]?.count ?? 0}
          none={stats.byStatus?.[2]?.count ?? 0}
        />
        <RevenueByFaculty
          data={stats.byFaculty ?? []}
          onFacultyClick={(faculty) => navigate(`/finance/contracts?faculty=${encodeURIComponent(faculty)}`)}
        />
        <MonthlyTrend data={stats.byMonth ?? []} />
        {/* Course-based chart placeholder using bar approach */}
        <Card title="Kurslar bo'yicha" subtitle="To'langan va qarz nisbati">
          <div className="flex items-end gap-4" style={{ height: 200 }}>
            {['1-kurs', '2-kurs', '3-kurs', '4-kurs'].map((level) => {
              const levelContracts = (contractsData?.data ?? []).filter(
                (c) => c.level === level,
              );
              const total = levelContracts.reduce((s, c) => s + c.contractAmount, 0);
              const paid = levelContracts.reduce((s, c) => s + c.paidAmount, 0);
              const maxTotal = Math.max(
                ...['1-kurs', '2-kurs', '3-kurs', '4-kurs'].map((l) =>
                  (contractsData?.data ?? [])
                    .filter((c) => c.level === l)
                    .reduce((s, c) => s + c.contractAmount, 0),
                ),
                1,
              );
              const totalH = (total / maxTotal) * 100;
              const paidPct = total > 0 ? (paid / total) * 100 : 0;
              return (
                <div key={level} className="flex flex-1 flex-col items-center gap-2" style={{ height: '100%' }}>
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-red-100"
                      style={{ height: `${totalH}%`, position: 'relative' }}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-t-md bg-emerald-500"
                        style={{ height: `${paidPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{level}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              To&apos;langan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-100" />
              Qarz
            </span>
          </div>
        </Card>
      </div>

      {/* Bottom panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent payments */}
        <Card title="So'nggi to'lovlar" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50/50">
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-slate-500">
                    Sana
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-slate-500">
                    Talaba
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium uppercase text-slate-500">
                    Summa
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-slate-500">
                    Usul
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentPayments.map((p) => {
                  const methodCfg = PAYMENT_METHOD_LABELS[p.paymentMethod];
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-xs text-slate-600">
                        {formatDate(p.paymentDate)}
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">{p.studentName}</td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-green-700">
                        {formatMoney(p.amount)}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={methodCfg.variant} dot>
                          {methodCfg.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {recentPayments.length > 0 && (
            <div className="border-t border-border px-4 py-2">
              <button
                onClick={() => navigate('/finance/payments')}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Barcha to&apos;lovlar &rarr;
              </button>
            </div>
          )}
        </Card>

        {/* Top debtors */}
        <Card title="Top qarzdorlar">
          <div className="flex flex-col gap-3">
            {topDebtors.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <Banknote className="mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-500">Qarzdorlar yo&apos;q</p>
              </div>
            )}
            {topDebtors.map((d) => (
              <DebtorCard key={d.id} contract={d} />
            ))}
          </div>
          {topDebtors.length > 0 && (
            <button
              onClick={() => navigate('/finance/debtors')}
              className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Barcha qarzdorlar &rarr;
            </button>
          )}
        </Card>
      </div>
    </PageContent>
  );
}
