import {
  Banknote,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '@/components/data-display';
import { formatMoney } from '@/lib/utils';

interface FinanceKpiRowProps {
  totalAmount: number;
  totalPaid: number;
  totalDebt: number;
  collectionRate: number;
  contractCount: number;
  debtorCount: number;
}

export function FinanceKpiRow({
  totalAmount,
  totalPaid,
  totalDebt,
  collectionRate,
  contractCount,
  debtorCount,
}: FinanceKpiRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Jami kontrakt summasi"
        value={formatMoney(totalAmount)}
        icon={<Banknote className="h-5 w-5" />}
        iconBg="#2DB976"
        sub={`${contractCount} ta kontrakt`}
      />
      <div className="rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] p-5 text-white" style={{ background: 'linear-gradient(135deg, #2DB976, #1B7A4E)' }}>
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 mb-3.5">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <p className="text-[13px] text-white/80 mb-1">To&apos;langan</p>
        <p className="text-[28px] font-bold leading-tight tracking-tight">{formatMoney(totalPaid)}</p>
        <p className="mt-1 text-xs text-white/70">{collectionRate}% yig&apos;im</p>
      </div>
      <StatCard
        label="Qarzdorlik"
        value={formatMoney(totalDebt)}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconBg="#F59E0B"
        sub={`${debtorCount} ta talaba`}
      />
      <div className="rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] p-5 text-white" style={{ background: 'linear-gradient(135deg, #2DB976, #1B7A4E)' }}>
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 mb-3.5">
          <TrendingUp className="h-5 w-5" />
        </div>
        <p className="text-[13px] text-white/80 mb-1">Yig&apos;im foizi</p>
        <p className="text-[28px] font-bold leading-tight tracking-tight">{collectionRate}%</p>
        <p className="mt-1 text-xs text-white/70">Joriy o&apos;quv yili</p>
      </div>
    </div>
  );
}
