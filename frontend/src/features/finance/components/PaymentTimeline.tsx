import { Check, Clock, AlertCircle, Banknote } from 'lucide-react';
import type { PaymentScheduleItem, Payment } from '@/types/finance';
import { formatMoney, formatDate } from '@/lib/utils';

interface PaymentTimelineProps {
  schedule: PaymentScheduleItem[];
  actualPayments?: Payment[];
}

const scheduleStatusConfig = {
  paid: {
    bg: 'bg-green-50',
    dotBg: 'bg-green-500',
    text: 'text-green-700',
    label: "To'langan",
    icon: Check,
  },
  pending: {
    bg: 'bg-amber-50',
    dotBg: 'bg-amber-500',
    text: 'text-amber-700',
    label: 'Kutilmoqda',
    icon: Clock,
  },
  overdue: {
    bg: 'bg-red-50',
    dotBg: 'bg-red-500',
    text: 'text-red-700',
    label: "Muddati o'tgan",
    icon: AlertCircle,
  },
} as const;

export function PaymentTimeline({ schedule, actualPayments }: PaymentTimelineProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Schedule */}
      <div className="flex flex-col gap-2">
        {schedule.map((item, i) => {
          const cfg = scheduleStatusConfig[item.status];
          const Icon = cfg.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${cfg.bg}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cfg.dotBg} text-white`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{formatDate(item.dueDate)}</p>
                <p className="text-xs text-slate-500">{i + 1}-bo'lib</p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-900">
                {formatMoney(item.amount)}
              </span>
              <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Actual payments history */}
      {actualPayments && actualPayments.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Haqiqiy to&apos;lovlar tarixi
          </p>
          <div className="flex flex-col gap-2">
            {actualPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Banknote className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{formatDate(p.paymentDate)}</p>
                  <p className="text-xs text-slate-500">{p.paymentMethod} · #{p.receiptNumber}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">
                  {formatMoney(p.amount)}
                </span>
                <span className="text-xs font-semibold text-blue-700">Qabul qilindi</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
