import { useState, useMemo } from 'react';
import { Plus, CheckCircle, CircleDollarSign, X, Search, ChevronRight, Printer, FileDown } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Button, Spinner, Badge } from '@/components/ui';
import { Modal } from '@/components/overlays';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { usePayments, useContracts } from '@/api/hooks/useFinance';
import { formatMoney, formatDate } from '@/lib/utils';
import type { PaymentMethod, Contract, Payment } from '@/types/finance';
import { PAYMENT_METHOD_STATUSES } from '@/config/statuses';
import { useAppStore } from '@/stores/app.store';

const PAYMENT_METHOD_LABELS = PAYMENT_METHOD_STATUSES;


function buildReceiptDom(win: Window, payment: Payment, institutionName: string) {
  const d = win.document;
  const style = d.createElement('style');
  style.textContent = 'body{font-family:sans-serif;padding:24px;font-size:13px;color:#1e293b}h2{text-align:center;font-size:16px;font-weight:700;margin-bottom:16px}.rr{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f1f5f9}.rl{color:#64748b}.rt{background:#f0fdf4;border-radius:8px;padding:12px;text-align:center;margin:16px 0}.rf{text-align:center;font-size:11px;color:#94a3b8;margin-top:20px}';
  d.head.appendChild(style);
  const h2 = d.createElement('h2');
  h2.textContent = institutionName;
  d.body.appendChild(h2);
  const rows: [string, string][] = [
    ["Kvitansiya №", payment.receiptNumber],
    ["Sana", formatDate(payment.paymentDate)],
    ["Talaba", payment.studentName],
    ["Fakultet", payment.facultyName],
    ["To'lov usuli", PAYMENT_METHOD_LABELS[payment.paymentMethod]?.label ?? payment.paymentMethod],
  ];
  rows.forEach(([label, value]) => {
    const row = d.createElement('div');
    row.className = 'rr';
    const lbl = d.createElement('span');
    lbl.className = 'rl';
    lbl.textContent = label;
    const val = d.createElement('span');
    val.textContent = value;
    row.appendChild(lbl);
    row.appendChild(val);
    d.body.appendChild(row);
  });
  const total = d.createElement('div');
  total.className = 'rt';
  const tp = d.createElement('p');
  tp.textContent = "Qabul qilindi";
  const tv = d.createElement('p');
  tv.textContent = formatMoney(payment.amount);
  Object.assign(tv.style, { fontSize: '22px', fontWeight: '700', color: '#16a34a' });
  total.appendChild(tp);
  total.appendChild(tv);
  d.body.appendChild(total);
  const footer = d.createElement('p');
  footer.className = 'rf';
  footer.textContent = "Ushbu kvitansiya to'lovni tasdiqlaydi";
  d.body.appendChild(footer);
}

function ReceiptModal({ payment, onClose }: { payment: Payment | null; onClose: () => void }) {
  const institutionName = useAppStore((s) => s.institutionName);

  const handlePrint = () => {
    if (!payment) return;
    const win = window.open('', '_blank', 'width=420,height=640');
    if (!win) return;
    buildReceiptDom(win, payment, institutionName);
    win.print();
    win.close();
  };

  return (
    <Modal
      open={!!payment}
      onClose={onClose}
      title="Kvitansiya"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Yopish</Button>
          <Button leftIcon={<Printer className="h-4 w-4" />} onClick={handlePrint}>Chop etish</Button>
        </div>
      }
    >
      {payment && (
        <div className="space-y-1">
          <h2 className="text-center text-base font-bold text-slate-900 mb-4">{institutionName}</h2>
          {[
            { label: 'Kvitansiya №', value: payment.receiptNumber },
            { label: 'Sana', value: formatDate(payment.paymentDate) },
            { label: 'Talaba', value: payment.studentName },
            { label: 'Fakultet', value: payment.facultyName },
            { label: "To'lov usuli", value: PAYMENT_METHOD_LABELS[payment.paymentMethod]?.label ?? payment.paymentMethod },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-slate-100 text-sm">
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-900">{value}</span>
            </div>
          ))}
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center">
            <p className="text-xs text-emerald-700 mb-0.5">Qabul qilindi</p>
            <p className="text-2xl font-bold text-emerald-700">{formatMoney(payment.amount)}</p>
          </div>
          <p className="mt-4 text-center text-[11px] text-slate-400">
            Ushbu kvitansiya to&apos;lovni tasdiqlaydi
          </p>
        </div>
      )}
    </Modal>
  );
}

export function PaymentsListPage() {
  const [method, setMethod] = useState<PaymentMethod | ''>('');
  const [faculty, setFaculty] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [printPayment, setPrintPayment] = useState<Payment | null>(null);

  const { data, isLoading } = usePayments({
    page: 1,
    pageSize: 200,
    paymentMethod: method || undefined,
  });

  const payments = data?.data ?? [];

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (faculty && p.facultyName !== faculty) return false;
      if (dateFrom && p.paymentDate < dateFrom) return false;
      if (dateTo && p.paymentDate > dateTo) return false;
      return true;
    });
  }, [payments, faculty, dateFrom, dateTo]);

  const totalSum = filtered.reduce((s, p) => s + p.amount, 0);

  const grouped = useMemo(() => {
    const g: Record<string, typeof filtered> = {};
    filtered.forEach((p) => {
      (g[p.paymentDate] = g[p.paymentDate] || []).push(p);
    });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center"><Spinner /></div>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title="To'lovlar"
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: "To'lovlar" },
        ]}
        actions={
          <Button
            variant="secondary"
            leftIcon={<FileDown className="h-4 w-4" />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = '/api/v1/finance/payments/export/';
              a.download = 'tolovlar.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Excel
          </Button>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <StatCard
          label="To'lovlar soni"
          value={payments.length}
          icon={<CheckCircle className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
          sub="Tanlangan davr"
        />
        <StatCard
          label="Jami summa"
          value={formatMoney(totalSum)}
          icon={<CircleDollarSign className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
        />
      </div>

      {/* Toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onChange={(f, t) => { setDateFrom(f); setDateTo(t); }}
          />
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="h-9 w-[220px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha fakultetlar</option>
            <option value="Kompyuter injiniringi">Kompyuter injiniringi</option>
            <option value="Iqtisodiyot">Iqtisodiyot</option>
            <option value="Pedagogika">Pedagogika</option>
            <option value="Filologiya">Filologiya</option>
          </select>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod | '')}
            className="h-9 w-[180px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha usullar</option>
            <option value="bank">Bank</option>
            <option value="naqd">Naqd</option>
            <option value="click">Click</option>
            <option value="payme">Payme</option>
            <option value="online">Online</option>
          </select>
          <div className="flex-1" />
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setPaymentModalOpen(true)}>Yangi to&apos;lov</Button>
        </div>
      </Card>

      {/* Grouped by date */}
      {grouped.length === 0 && (
        <Card>
          <div className="py-12 text-center text-muted">To&apos;lovlar topilmadi</div>
        </Card>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <NewPaymentModal onClose={() => setPaymentModalOpen(false)} />
      )}

      {grouped.map(([date, list]) => (
        <div key={date} className="mb-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-[0.05em] mb-2">
            {formatDate(date)} &middot; {list.length} ta &middot; {formatMoney(list.reduce((s, p) => s + p.amount, 0))}
          </p>
          <Card noPadding className="overflow-hidden">
            {list.map((p, i) => {
              const methodCfg = PAYMENT_METHOD_LABELS[p.paymentMethod];
              const initials = p.studentName.split(' ').map((x) => x[0]).slice(0, 2).join('');
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3.5 px-4 py-3.5 ${i > 0 ? 'border-t border-[#F1F5F9]' : ''}`}
                >
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900">{p.studentName}</p>
                    <p className="text-[11.5px] text-muted">{p.receiptNumber}</p>
                  </div>
                  <div className="min-w-[110px]">
                    <Badge variant={methodCfg?.variant ?? 'default'} dot>{methodCfg?.label ?? p.paymentMethod}</Badge>
                  </div>
                  <div className="text-[15px] font-bold text-green-700 tabular-nums min-w-[140px] text-right">
                    {formatMoney(p.amount)}
                  </div>
                  <button
                    title="Kvitansiya chop etish"
                    onClick={() => setPrintPayment(p)}
                    className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </Card>
        </div>
      ))}

      <ReceiptModal payment={printPayment} onClose={() => setPrintPayment(null)} />
    </PageContent>
  );
}

type PaymentStep = 'student' | 'contract' | 'form';

function NewPaymentModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<PaymentStep>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<{ name: string; group: string; id: string } | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [amount, setAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank');
  const [receipt, setReceipt] = useState('');

  const { data: contractsData } = useContracts({ page: 1, pageSize: 500, status: 'active' });
  const contracts = contractsData?.data ?? [];

  const searchResults = useMemo(() => {
    if (searchQuery.length < 3) return [];
    const q = searchQuery.toLowerCase();
    const seen = new Set<string>();
    return contracts
      .filter((c) => {
        if (seen.has(c.studentName)) return false;
        const match = c.studentName.toLowerCase().includes(q) || c.contractNumber.toLowerCase().includes(q);
        if (match) seen.add(c.studentName);
        return match;
      })
      .slice(0, 8)
      .map((c) => ({ name: c.studentName, group: c.groupName, id: String(c.studentId) }));
  }, [searchQuery, contracts]);

  const studentContracts = useMemo(() => {
    if (!selectedStudent) return [];
    return contracts.filter((c) => c.studentName === selectedStudent.name);
  }, [selectedStudent, contracts]);

  const handleSelectStudent = (s: { name: string; group: string; id: string }) => {
    setSelectedStudent(s);
    setStep('contract');
  };

  const handleSelectContract = (c: Contract) => {
    setSelectedContract(c);
    setStep('form');
  };

  const handleSubmit = () => {
    onClose();
  };

  const stepTitle = step === 'student' ? 'Yangi to\'lov — Talaba' : step === 'contract' ? 'Kontraktni tanlang' : 'To\'lov ma\'lumotlari';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-[560px] mx-4 overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{stepTitle}</h3>
            <div className="flex items-center gap-1 ml-2">
              {(['student', 'contract', 'form'] as PaymentStep[]).map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                  <div className={`w-2 h-2 rounded-full ${step === s ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Step 1: Search student */}
          {step === 'student' && (
            <div>
              <p className="text-sm text-slate-500 mb-3">Talabani qidiring (kamida 3 belgi)</p>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ism yoki kontrakt raqami..."
                  className="w-full h-10 pl-10 pr-3 border border-border rounded-lg text-sm"
                  autoFocus
                />
              </div>
              {searchResults.length > 0 && (
                <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                  {searchResults.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectStudent(s)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {s.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.group}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select contract */}
          {step === 'contract' && selectedStudent && (
            <div>
              <div className="flex items-center gap-2.5 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-[10px] mb-4">
                <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-semibold shrink-0">
                  {selectedStudent.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{selectedStudent.name}</p>
                  <p className="text-xs text-slate-500">{selectedStudent.group}</p>
                </div>
                <button onClick={() => { setSelectedStudent(null); setStep('student'); }} className="p-1 rounded text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {studentContracts.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg">Bu talabaga kontrakt topilmadi</p>
                )}
                {studentContracts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectContract(c)}
                    className="p-3 border border-border rounded-[10px] hover:border-emerald-300 hover:bg-emerald-50/30 text-left transition-colors"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-900">{c.contractNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatMoney(c.contractAmount)} · qoldiq: <strong className="text-red-600">{formatMoney(c.debtAmount)}</strong>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Payment form */}
          {step === 'form' && selectedContract && (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                <p className="font-medium text-slate-900">{selectedContract.studentName}</p>
                <p className="text-xs text-slate-500">{selectedContract.contractNumber} · Qoldiq: <strong className="text-red-600">{formatMoney(selectedContract.debtAmount)}</strong></p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Summa</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="h-10 px-3 border border-border rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">To&apos;lov usuli</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="h-10 px-3 border border-border rounded-lg text-sm"
                >
                  <option value="bank">Bank o&apos;tkazmasi</option>
                  <option value="naqd">Naqd</option>
                  <option value="click">Click</option>
                  <option value="payme">Payme</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Kvitansiya raqami</label>
                <input
                  value={receipt}
                  onChange={(e) => setReceipt(e.target.value)}
                  placeholder="QV-000000"
                  className="h-10 px-3 border border-border rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'form' && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={() => { setSelectedContract(null); setStep('contract'); }}
              className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Orqaga
            </button>
            <button
              onClick={handleSubmit}
              disabled={!amount}
              className="h-9 px-5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              To&apos;lovni saqlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
