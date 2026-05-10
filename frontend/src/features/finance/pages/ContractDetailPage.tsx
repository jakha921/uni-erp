import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, User, Calendar, Banknote, CreditCard, ExternalLink } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button, Spinner, Badge } from '@/components/ui';
import { Modal } from '@/components/overlays';
import { useContract, useCreatePayment } from '@/api/hooks/useFinance';
import { formatMoney, formatDate } from '@/lib/utils';
import { PaymentTimeline } from '../components/PaymentTimeline';
import { PaymentForm } from '../components/PaymentForm';
import type { ContractStatus, ContractType } from '@/types/finance';
import type { PaymentFormData } from '../schemas/payment.schema';

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  bazoviy: 'Bazoviy',
  tabaqalashtirilgan: 'Tabaqalashtirilgan',
  grant: 'Grant',
  xorijiy: 'Xorijiy',
};

const CONTRACT_STATUS_CONFIG: Record<ContractStatus, { variant: 'success' | 'default' | 'error'; label: string }> = {
  active: { variant: 'success', label: 'Faol' },
  completed: { variant: 'default', label: 'Yakunlangan' },
  cancelled: { variant: 'error', label: 'Bekor qilingan' },
};

const ONLINE_PAYMENT_PROVIDERS = [
  { name: 'Payme', color: '#1677FF', logo: '💳', desc: 'payme.uz orqali to\'lov' },
  { name: 'Click', color: '#FF6B00', logo: '⚡', desc: 'click.uz orqali to\'lov' },
  { name: 'Uzum', color: '#7C3AED', logo: '🛍', desc: 'uzum.uz orqali to\'lov' },
  { name: 'EPAY', color: '#16A34A', logo: '🏦', desc: 'Milliy bank epay' },
];

function OnlinePaymentModal({ open, onClose, contractId, amount }: { open: boolean; onClose: () => void; contractId: string; amount: number }) {
  const baseUrl = `https://uni-erp.bitu.uz/pay?contract=${contractId}&amount=${amount}&provider=`;
  return (
    <Modal open={open} onClose={onClose} title="Onlayn to'lov usulini tanlang">
      <div className="space-y-3">
        <p className="text-sm text-slate-500">
          Kontrakt to'lovini quyidagi to'lov tizimlari orqali amalga oshiring:
        </p>
        {ONLINE_PAYMENT_PROVIDERS.map((p) => (
          <a
            key={p.name}
            href={`${baseUrl}${p.name.toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary-300 hover:bg-slate-50 transition-colors"
          >
            <span className="text-2xl">{p.logo}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{p.name}</p>
              <p className="text-xs text-slate-500">{p.desc}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400" />
          </a>
        ))}
        <p className="text-center text-[11px] text-slate-400 pt-2">
          To'lov muvaffaqiyatli amalga oshirilgandan so'ng avtomatik qayd etiladi
        </p>
      </div>
    </Modal>
  );
}

export function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [onlinePaymentOpen, setOnlinePaymentOpen] = useState(false);

  const { data: contract, isLoading } = useContract(id ?? '');
  const createPayment = useCreatePayment();

  const handlePaymentSubmit = useCallback(
    (formData: PaymentFormData) => {
      createPayment.mutate(
        {
          contractId: formData.contractId,
          amount: formData.amount,
          paymentDate: formData.paymentDate,
          paymentMethod: formData.paymentMethod,
          receiptNumber: formData.receiptNumber,
          note: formData.note,
        },
        { onSuccess: () => setPaymentFormOpen(false) },
      );
    },
    [createPayment],
  );

  if (isLoading || !contract) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </PageContent>
    );
  }

  const statusCfg = CONTRACT_STATUS_CONFIG[contract.status];
  const paidPct =
    contract.contractAmount > 0
      ? Math.round((contract.paidAmount / contract.contractAmount) * 100)
      : 0;

  return (
    <PageContent>
      <PageHeader
        title={contract.contractNumber}
        subtitle={`${contract.studentName} — ${contract.facultyName}`}
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: 'Kontraktlar', path: '/finance/contracts' },
          { label: contract.contractNumber },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate('/finance/contracts')}
            >
              Orqaga
            </Button>
            <Button
              variant="secondary"
              leftIcon={<CreditCard className="h-4 w-4" />}
              onClick={() => setOnlinePaymentOpen(true)}
            >
              Onlayn to&apos;lov
            </Button>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setPaymentFormOpen(true)}
            >
              Yangi to&apos;lov
            </Button>
          </div>
        }
      />

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Student info */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{contract.studentName}</p>
              <p className="text-xs text-slate-500">{contract.studentIdNumber}</p>
              <p className="mt-1 text-xs text-slate-500">
                {contract.facultyName} &middot; {contract.groupName}
              </p>
              <p className="text-xs text-slate-500">
                {contract.level} &middot; {contract.specialty}
              </p>
            </div>
          </div>
        </Card>

        {/* Contract info */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{contract.contractNumber}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={statusCfg.variant} dot>
                  {statusCfg.label}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Turi: {CONTRACT_TYPE_LABELS[contract.contractType]}
              </p>
              <p className="text-xs text-slate-500">
                <Calendar className="mr-1 inline h-3 w-3" />
                {formatDate(contract.contractDate)} &middot; {contract.educationYear}
              </p>
            </div>
          </div>
        </Card>

        {/* Financial summary */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
              <Banknote className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {formatMoney(contract.contractAmount)}
              </p>
              <div className="mt-2 flex gap-4 text-xs">
                <span className="text-green-700">
                  To&apos;langan: <strong>{formatMoney(contract.paidAmount)}</strong>
                </span>
                <span className="text-red-700">
                  Qarz: <strong>{formatMoney(contract.debtAmount)}</strong>
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    paidPct >= 100
                      ? 'bg-green-500'
                      : paidPct >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, paidPct)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">{paidPct}% to&apos;langan</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment schedule */}
      <div className="mt-6">
        <Card title="To'lov jadvali" subtitle="Rejadagi va bajarilgan to'lovlar">
          {contract.paymentSchedule.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              To&apos;lov jadvali mavjud emas
            </p>
          ) : (
            <PaymentTimeline schedule={contract.paymentSchedule} />
          )}
        </Card>
      </div>

      {/* Payment form modal */}
      {paymentFormOpen && (
        <PaymentForm
          open={paymentFormOpen}
          onClose={() => setPaymentFormOpen(false)}
          onSubmit={handlePaymentSubmit}
          contract={contract}
          loading={createPayment.isPending}
        />
      )}

      <OnlinePaymentModal
        open={onlinePaymentOpen}
        onClose={() => setOnlinePaymentOpen(false)}
        contractId={contract.id}
        amount={contract.debtAmount}
      />
    </PageContent>
  );
}
