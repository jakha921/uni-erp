import type { Contract } from '@/types/finance';
import { formatMoney } from '@/lib/utils';

interface DebtorCardProps {
  contract: Contract;
}

export function DebtorCard({ contract }: DebtorCardProps) {
  const pct = Math.round((contract.debtAmount / contract.contractAmount) * 100);
  const isCritical = pct > 70;
  const isMedium = pct >= 30 && pct <= 70;

  const borderColor = isCritical
    ? 'border-l-red-500'
    : isMedium
      ? 'border-l-amber-500'
      : 'border-l-green-500';
  const bgColor = isCritical
    ? 'bg-red-50'
    : isMedium
      ? 'bg-amber-50'
      : 'bg-green-50';
  const barColor = isCritical
    ? 'bg-red-500'
    : isMedium
      ? 'bg-amber-500'
      : 'bg-green-500';
  const textColor = isCritical
    ? 'text-red-700'
    : isMedium
      ? 'text-amber-700'
      : 'text-green-700';

  return (
    <div className={`rounded-lg border-l-[3px] p-3 ${borderColor} ${bgColor}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">
          {contract.studentName}
        </span>
        <span className={`text-sm font-bold tabular-nums ${textColor}`}>
          {formatMoney(contract.debtAmount)}
        </span>
      </div>
      <p className="mb-2 text-xs text-slate-500">
        {contract.facultyName.split(' ').slice(0, 3).join(' ')} · {contract.groupName}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`mt-1 text-xs font-semibold ${textColor}`}>Qarz: {pct}%</p>
    </div>
  );
}
