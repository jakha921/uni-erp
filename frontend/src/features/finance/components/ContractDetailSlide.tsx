import { X, Plus, CircleDollarSign } from 'lucide-react';
import { formatMoney, formatDate } from '@/lib/utils';
import { usePayments } from '@/api/hooks/useFinance';
import { Badge } from '@/components/ui';
import type { Contract, PaymentMethod } from '@/types/finance';

interface ContractDetailSlideProps {
  contract: Contract;
  onClose: () => void;
}

const STATUS_CONFIG = {
  active: { label: 'Faol', variant: 'success' as const },
  completed: { label: 'Yakunlangan', variant: 'default' as const },
  cancelled: { label: 'Bekor qilingan', variant: 'error' as const },
};

const TYPE_LABELS: Record<string, string> = {
  bazoviy: 'Bazoviy',
  tabaqalashtirilgan: 'Tabaqalashtirilgan',
  grant: 'Grant',
  xorijiy: 'Xorijiy',
};

const PAY_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank: "Bank o'tkazmasi",
  naqd: 'Naqd',
  online: 'Online',
  click: 'Click',
  payme: 'Payme',
};

export function ContractDetailSlide({ contract, onClose }: ContractDetailSlideProps) {
  const { data: paymentsData } = usePayments({ page: 1, pageSize: 100 });
  const payments = (paymentsData?.data ?? [])
    .filter((p) => p.contractId === contract.id)
    .sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));

  const today = new Date().toISOString().slice(0, 10);
  const statusCfg = STATUS_CONFIG[contract.status];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[620px] bg-surface h-full overflow-y-auto shadow-2xl border-l border-border animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Kontrakt tafsiloti</h2>
            <p className="text-xs text-slate-500 mt-0.5">{contract.contractNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 flex items-center gap-1.5 transition-colors">
              <Plus className="h-3 w-3" /> To&apos;lov qo&apos;shish
            </button>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Student header */}
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
              {contract.studentName.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">{contract.studentName}</p>
              <p className="text-[12.5px] text-slate-500">ID: {contract.studentIdNumber}</p>
              <p className="text-[12.5px] text-slate-500">{contract.groupName} · {contract.level} · {contract.facultyName.split(' ').slice(0, 3).join(' ')}</p>
            </div>
            <Badge variant={statusCfg.variant} dot>{statusCfg.label}</Badge>
          </div>

          {/* Summary boxes */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-[10px] p-3">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1">Summa</p>
              <p className="text-sm font-bold text-slate-900 tabular-nums">{formatMoney(contract.contractAmount)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-[10px] p-3">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1">To&apos;langan</p>
              <p className="text-sm font-bold text-emerald-700 tabular-nums">{formatMoney(contract.paidAmount)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-[10px] p-3">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1">Qarz</p>
              <p className={`text-sm font-bold tabular-nums ${contract.debtAmount > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                {formatMoney(contract.debtAmount)}
              </p>
            </div>
          </div>

          {/* Contract info */}
          <div>
            <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide mb-2.5">Kontrakt</h3>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-[10px] p-3.5 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-0.5">Raqami</p>
                <p className="font-medium text-slate-900">{contract.contractNumber}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-0.5">Sana</p>
                <p className="font-medium text-slate-900">{formatDate(contract.contractDate)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-0.5">Turi</p>
                <p className="font-medium text-slate-900">{TYPE_LABELS[contract.contractType] ?? contract.contractType}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-0.5">O&apos;quv yili</p>
                <p className="font-medium text-slate-900">{contract.educationYear}</p>
              </div>
            </div>
          </div>

          {/* Payment schedule */}
          <div>
            <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide mb-2.5">To&apos;lov jadvali</h3>
            <div className="flex flex-col gap-1.5">
              {contract.paymentSchedule.map((s, i) => {
                const isPaid = s.status === 'paid';
                const overdue = s.status === 'overdue' || (!isPaid && s.dueDate < today);
                const statusInfo = isPaid
                  ? { label: "To'langan", bg: 'bg-emerald-50', text: 'text-emerald-700' }
                  : overdue
                  ? { label: "Muddati o'tgan", bg: 'bg-red-50', text: 'text-red-700' }
                  : { label: 'Kutilmoqda', bg: 'bg-amber-50', text: 'text-amber-700' };
                return (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${statusInfo.bg}`}>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-slate-900">{formatDate(s.dueDate)}</p>
                      <p className="text-[11.5px] text-slate-500">{i + 1}-bo&apos;lib</p>
                    </div>
                    <span className="text-[13px] font-semibold tabular-nums text-slate-900">{formatMoney(s.amount)}</span>
                    <span className={`text-[11.5px] font-semibold ${statusInfo.text}`}>{statusInfo.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment history */}
          <div>
            <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide mb-2.5">
              To&apos;lov tarixi ({payments.length})
            </h3>
            {payments.length === 0 ? (
              <p className="text-[13px] text-slate-500 text-center py-4 bg-slate-50 rounded-lg">
                Hali to&apos;lovlar yo&apos;q
              </p>
            ) : (
              <div className="flex flex-col">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 last:border-0">
                    <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <CircleDollarSign className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900">{formatMoney(p.amount)}</p>
                      <p className="text-[11.5px] text-slate-500">{formatDate(p.paymentDate)} · {p.receiptNumber}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {PAY_METHOD_LABELS[p.paymentMethod]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
