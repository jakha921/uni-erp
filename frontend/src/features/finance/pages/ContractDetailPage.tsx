import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, User, Calendar, Banknote, CreditCard, ExternalLink, Download } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button, Spinner, Badge } from '@/components/ui';
import { Modal } from '@/components/overlays';
import { useContract, useCreatePayment, usePayments } from '@/api/hooks/useFinance';
import { formatMoney, formatDate } from '@/lib/utils';
import { PaymentTimeline } from '../components/PaymentTimeline';
import { PaymentForm } from '../components/PaymentForm';
import type { Contract, ContractStatus, ContractType } from '@/types/finance';
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

function printContractPdf(c: Contract) {
  const win = window.open('', '_blank', 'width=794,height=1123');
  if (!win) return;
  const d = win.document;
  const style = d.createElement('style');
  style.textContent = `
    body { font-family: 'Times New Roman', serif; margin: 0; padding: 50px 70px; color: #000; }
    h1 { text-align: center; font-size: 16px; text-transform: uppercase; margin-bottom: 4px; }
    h2 { text-align: center; font-size: 13px; margin-bottom: 30px; }
    .contract-title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0 4px; }
    .contract-num { text-align: center; font-size: 13px; color: #555; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 7px 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
    td:first-child { color: #64748b; width: 45%; }
    td:last-child { font-weight: 600; }
    .amount-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; text-align: center; }
    .amount-label { font-size: 12px; color: #64748b; }
    .amount-value { font-size: 24px; font-weight: bold; color: #16a34a; }
    .sigs { display: flex; justify-content: space-between; margin-top: 60px; font-size: 12px; }
    .sig-block p { margin: 4px 0; }
    @media print { @page { margin: 0; } body { padding: 50px 70px; } }
  `;
  d.head.appendChild(style);
  const today = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

  const h1 = d.createElement('h1'); h1.textContent = "O'zbekiston Respublikasi"; d.body.appendChild(h1);
  const h2 = d.createElement('h2'); h2.textContent = 'Buxoro innovatsion texnologiyalar universiteti'; d.body.appendChild(h2);
  const ctitle = d.createElement('div'); ctitle.className = 'contract-title'; ctitle.textContent = 'TA\'LIM SHARTNOMASI'; d.body.appendChild(ctitle);
  const cnum = d.createElement('div'); cnum.className = 'contract-num'; cnum.textContent = `№ ${c.contractNumber} | Sana: ${formatDate(c.contractDate)}`; d.body.appendChild(cnum);

  const rows: [string, string][] = [
    ['Talaba', c.studentName],
    ['Talaba ID', c.studentIdNumber],
    ['Fakultet', c.facultyName],
    ['Mutaxassislik', c.specialty],
    ['Guruh', c.groupName],
    ['Kurs', c.level],
    ["O'quv yili", c.educationYear],
    ["Shartnoma turi", CONTRACT_TYPE_LABELS[c.contractType]],
  ];
  const table = d.createElement('table');
  rows.forEach(([label, value]) => {
    const tr = d.createElement('tr');
    const td1 = d.createElement('td'); td1.textContent = label;
    const td2 = d.createElement('td'); td2.textContent = value || '—';
    tr.appendChild(td1); tr.appendChild(td2);
    table.appendChild(tr);
  });
  d.body.appendChild(table);

  const amtBox = d.createElement('div'); amtBox.className = 'amount-box';
  const lbl = d.createElement('div'); lbl.className = 'amount-label'; lbl.textContent = "Shartnoma summasi";
  const val = d.createElement('div'); val.className = 'amount-value'; val.textContent = formatMoney(c.contractAmount);
  amtBox.appendChild(lbl); amtBox.appendChild(val);
  d.body.appendChild(amtBox);

  const sigs = d.createElement('div'); sigs.className = 'sigs';
  const univ = d.createElement('div'); univ.className = 'sig-block';
  const up1 = d.createElement('p'); up1.textContent = 'Universitet nomidan:';
  const up2 = d.createElement('p'); up2.textContent = 'Rektor: _______________________';
  const up3 = d.createElement('p'); up3.textContent = `Sana: ${today}`;
  univ.appendChild(up1); univ.appendChild(up2); univ.appendChild(up3);
  const stud = d.createElement('div'); stud.className = 'sig-block';
  const sp1 = d.createElement('p'); sp1.textContent = 'Talaba:';
  const sp2 = d.createElement('p'); sp2.textContent = c.studentName;
  const sp3 = d.createElement('p'); sp3.textContent = 'Imzo: _______________________';
  stud.appendChild(sp1); stud.appendChild(sp2); stud.appendChild(sp3);
  sigs.appendChild(univ); sigs.appendChild(stud);
  d.body.appendChild(sigs);

  d.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 250);
}

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
  const { data: paymentsData } = usePayments({ contractId: id, pageSize: 100 });
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
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => printContractPdf(contract)}
            >
              Yuklab olish
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
            <PaymentTimeline schedule={contract.paymentSchedule} actualPayments={paymentsData?.data} />
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
