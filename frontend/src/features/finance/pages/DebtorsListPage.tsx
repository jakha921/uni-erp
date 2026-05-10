import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, CircleDollarSign, Mail, DollarSign, X, CheckCircle, FileDown } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Spinner, Button } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { DataTable, Pagination, type Column } from '@/components/table';
import { useContracts } from '@/api/hooks/useFinance';
import { useFaculties } from '@/api/hooks/useCore';
import { formatMoney } from '@/lib/utils';
import type { Contract } from '@/types/finance';

type Tier = 'all' | 'critical' | 'medium' | 'light';

interface DebtorRow extends Contract {
  debtPct: number;
  tier: 'critical' | 'medium' | 'light';
}


export function DebtorsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [bucket, setBucket] = useState<Tier>('all');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsTarget, setSmsTarget] = useState<DebtorRow | null>(null);
  const pageSize = 20;

  const { data: faculties } = useFaculties();
  const { data, isLoading } = useContracts({
    page: 1,
    pageSize: 500,
    status: 'active',
  });

  const debtorsList = useMemo<DebtorRow[]>(() => {
    return (data?.data ?? [])
      .filter((c) => c.debtAmount > 0)
      .map((c) => {
        const pct = (c.debtAmount / c.contractAmount) * 100;
        const tier: DebtorRow['tier'] = pct > 70 ? 'critical' : pct >= 30 ? 'medium' : 'light';
        return { ...c, debtPct: pct, tier };
      })
      .sort((a, b) => b.debtAmount - a.debtAmount);
  }, [data]);

  const filtered = useMemo(() => {
    return debtorsList.filter((d) => {
      if (bucket !== 'all' && d.tier !== bucket) return false;
      if (facultyFilter !== 'all' && d.facultyName !== facultyFilter) return false;
      if (levelFilter !== 'all' && d.level !== levelFilter) return false;
      return true;
    });
  }, [debtorsList, bucket, facultyFilter, levelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalContracts = data?.data?.length ?? 0;
  const avgDebt = debtorsList.length > 0
    ? debtorsList.reduce((s, d) => s + d.debtAmount, 0) / debtorsList.length
    : 0;

  const criticalCount = debtorsList.filter((d) => d.tier === 'critical').length;
  const mediumCount = debtorsList.filter((d) => d.tier === 'medium').length;
  const lightCount = debtorsList.filter((d) => d.tier === 'light').length;

  const handleBulkSms = () => {
    setSmsTarget(null);
    setSmsModalOpen(true);
  };

  const handleRowSms = (row: DebtorRow) => {
    setSmsTarget(row);
    setSmsModalOpen(true);
  };

  const handleSmsClose = () => {
    setSmsModalOpen(false);
    setSmsTarget(null);
    setSelectedIds(new Set());
  };

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center"><Spinner /></div>
      </PageContent>
    );
  }

  const columns: Column<DebtorRow>[] = [
    { key: 'idx', header: '#', width: '50px', render: (_, i) => <span className="text-slate-500">{(page - 1) * pageSize + i + 1}</span> },
    {
      key: 'studentName', header: 'Talaba', render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.studentName}</p>
          <p className="text-[11.5px] text-muted">{row.contractNumber}</p>
        </div>
      ),
    },
    { key: 'groupName', header: 'Guruh', render: (row) => <span>{row.groupName}</span> },
    { key: 'facultyName', header: 'Fakultet', render: (row) => <span className="text-[12.5px]">{row.facultyName.split(' ').slice(0, 2).join(' ')}</span> },
    { key: 'contractAmount', header: 'Kontrakt', className: 'text-right', render: (row) => <span className="tabular-nums">{formatMoney(row.contractAmount)}</span> },
    { key: 'paidAmount', header: "To'langan", className: 'text-right', render: (row) => <span className="tabular-nums text-green-700">{formatMoney(row.paidAmount)}</span> },
    { key: 'debtAmount', header: 'Qarz', className: 'text-right', render: (row) => <span className="tabular-nums font-bold text-red-700">{formatMoney(row.debtAmount)}</span> },
    {
      key: 'debtPct', header: '%', render: (row) => {
        const color = row.tier === 'critical' ? '#EF4444' : row.tier === 'medium' ? '#F59E0B' : '#2DB976';
        return (
          <div className="min-w-[100px]">
            <p className="text-xs font-semibold mb-1" style={{ color }}>{Math.round(row.debtPct)}%</p>
            <div className="h-1.5 w-full rounded bg-slate-100 overflow-hidden">
              <div className="h-full rounded" style={{ width: `${Math.min(100, row.debtPct)}%`, background: color }} />
            </div>
          </div>
        );
      },
    },
  ];

  const selectedDebtors = debtorsList.filter((d) => selectedIds.has(d.id));

  return (
    <PageContent>
      <PageHeader
        title="Qarzdorlar"
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: 'Qarzdorlar' },
        ]}
        actions={
          <Button
            variant="secondary"
            leftIcon={<FileDown className="h-4 w-4" />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = '/api/v1/finance/debtors/export/';
              a.download = 'qarzdorlar.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Excel
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <StatCard
          label="Jami talabalar"
          value={totalContracts}
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
          sub="Kontrakt bo'yicha"
        />
        <StatCard
          label="Qarzdor talabalar"
          value={debtorsList.length}
          icon={<AlertTriangle className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
          sub={`${totalContracts > 0 ? Math.round(debtorsList.length / totalContracts * 100) : 0}% talabalardan`}
        />
        <StatCard
          label="O'rtacha qarzdorlik"
          value={formatMoney(avgDebt)}
          icon={<CircleDollarSign className="h-[18px] w-[18px]" />}
          iconBg="#EF4444"
        />
      </div>

      {/* Bucket tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'Barchasi', count: debtorsList.length },
          { id: 'critical', label: 'Kritik', count: criticalCount },
          { id: 'medium', label: "O'rtacha", count: mediumCount },
          { id: 'light', label: 'Yengil', count: lightCount },
        ]}
        activeTab={bucket}
        onTabChange={(id) => { setBucket(id as Tier); setPage(1); }}
      />

      {/* Filters toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 mt-4 mb-3">
        <select
          value={facultyFilter}
          onChange={(e) => { setFacultyFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border border-border text-sm bg-white dark:bg-slate-800 min-w-[180px]"
        >
          <option value="all">Barcha fakultetlar</option>
          {(faculties ?? []).map((f) => (
            <option key={f.id} value={f.name}>{f.name}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border border-border text-sm bg-white dark:bg-slate-800 min-w-[130px]"
        >
          <option value="all">Barcha kurslar</option>
          <option value="1-kurs">1-kurs</option>
          <option value="2-kurs">2-kurs</option>
          <option value="3-kurs">3-kurs</option>
          <option value="4-kurs">4-kurs</option>
        </select>
        <div className="flex-1" />
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkSms}
            className="h-9 px-4 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Mail className="h-3.5 w-3.5" />
            SMS yuborish ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        <DataTable
          data={pageRows}
          columns={columns}
          keyField="id"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyMessage="Qarzdorlar topilmadi"
          rowClassName={(row) => row.tier === 'critical' ? 'border-l-[3px] border-l-red-500' : ''}
          actions={(row) => (
            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/finance/payments'); }}
                className="h-7 w-7 rounded-md hover:bg-emerald-50 text-emerald-600 inline-flex items-center justify-center transition-colors"
                title="To'lov"
              >
                <DollarSign className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleRowSms(row); }}
                className="h-7 w-7 rounded-md hover:bg-blue-50 text-blue-600 inline-flex items-center justify-center transition-colors"
                title="SMS"
              >
                <Mail className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        />
        <div className="border-t border-[#F1F5F9] px-4 py-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            total={filtered.length}
            pageSize={pageSize}
          />
        </div>
      </Card>

      {/* SMS Modal */}
      {smsModalOpen && (
        <SmsModal
          recipients={smsTarget ? [smsTarget] : selectedDebtors}
          onClose={handleSmsClose}
        />
      )}
    </PageContent>
  );
}

function SmsModal({ recipients, onClose }: { recipients: DebtorRow[]; onClose: () => void }) {
  const sample = recipients[0];
  const defaultText = `Hurmatli ${sample?.studentName?.split(' ')[1] ?? '{name}'}, shartnoma to'lovi bo'yicha ${sample ? formatMoney(sample.debtAmount) : '{debt}'} qarzdorligingiz mavjud. Iltimos, to'lovni amalga oshiring.`;

  const [text, setText] = useState(defaultText);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-[520px] mx-4 overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {sent ? 'SMS yuborildi' : recipients.length > 1 ? `SMS yuborish (${recipients.length})` : 'SMS yuborish'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-lg font-bold text-emerald-600">SMS yuborildi</p>
              <p className="text-sm text-slate-600 text-center">
                <strong>{recipients.length}</strong> ta qabul qiluvchiga xabar muvaffaqiyatli yuborildi.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center max-h-20 overflow-y-auto">
                {recipients.slice(0, 8).map((r) => (
                  <span key={r.id} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    {r.studentName}
                  </span>
                ))}
                {recipients.length > 8 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    +{recipients.length - 8}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Recipients */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Qabul qiluvchilar
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  {recipients.slice(0, 12).map((r) => (
                    <span key={r.id} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      {r.studentName}
                    </span>
                  ))}
                  {recipients.length > 12 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      +{recipients.length - 12}
                    </span>
                  )}
                </div>
              </div>
              {/* Message */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Xabar</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  className="w-full p-3 border border-border rounded-lg text-sm resize-y bg-white dark:bg-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">{text.length} belgi</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-slate-50 dark:bg-slate-800/50">
          {sent ? (
            <button
              onClick={onClose}
              className="h-9 px-5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Yopish
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSend}
                className="h-9 px-5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Mail className="h-3.5 w-3.5" />
                Yuborish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
