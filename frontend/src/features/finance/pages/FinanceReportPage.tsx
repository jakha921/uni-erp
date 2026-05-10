import { useState, useMemo } from 'react';
import { Printer, Download, FileText, BarChart3 } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { formatMoney } from '@/lib/utils';
import { useContracts, usePayments } from '@/api/hooks/useFinance';
import type { Contract, PaymentMethod } from '@/types/finance';

type ReportType = 'general' | 'faculty' | 'level' | 'type' | 'method';

interface ReportRow {
  key: string;
  count: number;
  total: number;
  paid: number;
  debt: number;
  pct: number;
}

const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: 'general', label: 'Umumiy' },
  { value: 'faculty', label: "Fakultet bo'yicha" },
  { value: 'level', label: "Kurs bo'yicha" },
  { value: 'type', label: "Kontrakt turi bo'yicha" },
  { value: 'method', label: "To'lov usuli bo'yicha" },
];

const FACULTIES = [
  'Kompyuter injiniringi',
  'Iqtisodiyot',
  'Pedagogika',
  'Filologiya',
  'Tabiiy fanlar',
  'Huquqshunoslik',
  'San\'at va dizayn',
  'Tibbiyot',
];

interface MethodRow {
  method: string;
  count: number;
  sum: number;
}

const PAY_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank: "Bank o'tkazmasi",
  naqd: 'Naqd',
  click: 'Click',
  payme: 'PayMe',
  online: 'Online',
};

export function FinanceReportPage() {
  const { data: contracts } = useContracts();
  const { data: paymentsData } = usePayments({ pageSize: 500 });

  const [fromDate, setFromDate] = useState('2025-09-01');
  const [toDate, setToDate] = useState('2026-06-30');
  const [reportType, setReportType] = useState<ReportType>('faculty');
  const [generated, setGenerated] = useState(false);

  const reportData = useMemo((): ReportRow[] | null => {
    if (!generated || !contracts?.data) return null;

    const filteredContracts = contracts.data.filter((c: Contract) => {
      if (fromDate && c.contractDate < fromDate) return false;
      if (toDate && c.contractDate > toDate) return false;
      return true;
    });

    let groups: { key: string; contracts: Contract[] }[];

    if (reportType === 'faculty') {
      groups = FACULTIES.map((f) => ({
        key: f,
        contracts: filteredContracts.filter((c: Contract) => c.facultyName === f),
      }));
    } else if (reportType === 'level') {
      groups = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'].map((l) => ({
        key: l,
        contracts: filteredContracts.filter((c: Contract) => c.level === l),
      }));
    } else if (reportType === 'type') {
      groups = ['bazoviy', 'tabaqalashtirilgan', 'grant', 'xorijiy'].map((ct) => ({
        key: ct,
        contracts: filteredContracts.filter((c: Contract) => c.contractType === ct),
      }));
    } else {
      groups = [{ key: 'JAMI', contracts: filteredContracts }];
    }

    return groups.map((g) => {
      const total = g.contracts.reduce((s: number, c: Contract) => s + c.contractAmount, 0);
      const paid = g.contracts.reduce((s: number, c: Contract) => s + c.paidAmount, 0);
      return {
        key: g.key,
        count: g.contracts.length,
        total,
        paid,
        debt: total - paid,
        pct: total > 0 ? Math.round((paid / total) * 100) : 0,
      };
    });
  }, [generated, reportType, contracts, fromDate, toDate]);

  const methodData = useMemo((): MethodRow[] | null => {
    if (!generated || reportType !== 'method' || !paymentsData?.data) return null;
    const payments = paymentsData.data.filter((p) => {
      if (fromDate && p.paymentDate < fromDate) return false;
      if (toDate && p.paymentDate > toDate) return false;
      return true;
    });
    return (['bank', 'naqd', 'click', 'payme', 'online'] as PaymentMethod[]).map((m) => {
      const list = payments.filter((p) => p.paymentMethod === m);
      const sum = list.reduce((s, p) => s + p.amount, 0);
      return { method: PAY_METHOD_LABELS[m], count: list.length, sum };
    });
  }, [generated, reportType, paymentsData, fromDate, toDate]);

  const totals = useMemo(() => {
    if (!reportData) return null;
    return reportData.reduce(
      (acc, r) => ({
        count: acc.count + r.count,
        total: acc.total + r.total,
        paid: acc.paid + r.paid,
        debt: acc.debt + r.debt,
      }),
      { count: 0, total: 0, paid: 0, debt: 0 },
    );
  }, [reportData]);

  const exportCSV = () => {
    if (!reportData) return;
    const rows = [['Kategoriya', 'Kontraktlar', 'Jami', "To'langan", 'Qarz', "Yig'im %"]];
    reportData.forEach((r) => rows.push([r.key, String(r.count), String(r.total), String(r.paid), String(r.debt), r.pct + '%']));
    if (totals) rows.push(['JAMI', String(totals.count), String(totals.total), String(totals.paid), String(totals.debt), (totals.total > 0 ? Math.round((totals.paid / totals.total) * 100) : 0) + '%']);
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moliyaviy-hisobot-${reportType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContent>
      <PageHeader
        title="Moliyaviy hisobot"
        subtitle="Umumiy moliyaviy ko'rsatkichlar va statistika"
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: 'Hisobot' },
        ]}
      />

      {/* Params Card */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Davr (dan)</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border text-sm bg-white dark:bg-slate-800"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Davr (gacha)</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border text-sm bg-white dark:bg-slate-800"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Hisobot turi</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="h-10 px-3 rounded-lg border border-border text-sm bg-white dark:bg-slate-800"
            >
              {REPORT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setGenerated(true)}
            className="h-10 px-5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Hisobot yaratish
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!generated && (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Hisobot yaratilmagan</h3>
          <p className="text-sm text-slate-400 mt-1">Davr va turini tanlang, so&apos;ngra tugmani bosing.</p>
        </div>
      )}

      {/* Generated report */}
      {/* Method report type */}
      {generated && methodData && reportType === 'method' && (
        <>
          <div className="flex gap-2 mb-4 justify-end">
            <button onClick={() => window.print()} className="h-9 px-4 rounded-lg border border-border bg-surface text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Printer className="h-3.5 w-3.5" /> Chop etish
            </button>
            <button onClick={exportCSV} className="h-9 px-4 rounded-lg border border-border bg-surface text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download className="h-3.5 w-3.5" /> Excel yuklash
            </button>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/api/v1/finance/report/export-pdf/';
                a.download = 'moliyaviy-hisobot.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              className="h-9 px-4 rounded-lg border border-border bg-surface text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" /> PDF
            </button>
          </div>
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">To&apos;lov usuli</th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">To&apos;lovlar soni</th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">Jami summa</th>
                </tr>
              </thead>
              <tbody>
                {methodData.map((r) => (
                  <tr key={r.method} className="border-t border-border/60 hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-[13px] font-medium text-slate-900">{r.method}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums text-slate-600">{r.count}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums font-semibold text-slate-900">{formatMoney(r.sum)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {generated && reportData && reportType !== 'method' && (
        <>
          {/* Export buttons */}
          <div className="flex gap-2 mb-4 justify-end">
            <button
              onClick={() => window.print()}
              className="h-9 px-4 rounded-lg border border-border bg-surface text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Chop etish
            </button>
            <button
              onClick={exportCSV}
              className="h-9 px-4 rounded-lg border border-border bg-surface text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Excel yuklash
            </button>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/api/v1/finance/report/export-pdf/';
                a.download = 'moliyaviy-hisobot.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              className="h-9 px-4 rounded-lg border border-border bg-surface text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" /> PDF
            </button>
          </div>

          {/* Result table */}
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">Kategoriya</th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">Kontraktlar</th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">Jami summa</th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">To&apos;langan</th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">Qarz</th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 px-4 py-3">Yig&apos;im %</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((r) => (
                  <tr key={r.key} className="border-t border-border/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 text-[13px] font-medium text-slate-900 dark:text-slate-100">{r.key}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums text-slate-600">{r.count}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums text-slate-600">{formatMoney(r.total)}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums text-emerald-700">{formatMoney(r.paid)}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums text-red-600">{formatMoney(r.debt)}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums font-bold text-slate-900">{r.pct}%</td>
                  </tr>
                ))}
                {totals && (
                  <tr className="border-t border-border bg-slate-100 dark:bg-slate-800/50 font-bold">
                    <td className="px-4 py-2.5 text-[13px] font-bold text-slate-900">JAMI</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums font-bold">{totals.count}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums font-bold">{formatMoney(totals.total)}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums font-bold text-emerald-700">{formatMoney(totals.paid)}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums font-bold text-red-600">{formatMoney(totals.debt)}</td>
                    <td className="px-4 py-2.5 text-[13px] text-right tabular-nums font-bold">{totals.total > 0 ? Math.round((totals.paid / totals.total) * 100) : 0}%</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
            {/* Category progress bars */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Kategoriya bo&apos;yicha yig&apos;im
              </h3>
              <div className="flex flex-col gap-3">
                {reportData.map((r) => (
                  <div key={r.key}>
                    <div className="flex justify-between mb-1 text-[12.5px]">
                      <span className="text-slate-600 font-medium">{r.key}</span>
                      <span className="text-slate-900 font-semibold">{r.pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paid/Debt donut */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                To&apos;langan / Qarz
              </h3>
              {totals && totals.total > 0 && (
                <div className="flex flex-col items-center">
                  <DonutChart
                    paid={totals.paid}
                    debt={totals.debt}
                    pct={Math.round((totals.paid / totals.total) * 100)}
                  />
                  <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-600">To&apos;langan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs text-slate-600">Qarz</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </PageContent>
  );
}

function DonutChart({ paid, debt, pct }: { paid: number; debt: number; pct: number }) {
  const total = paid + debt;
  const paidAngle = (paid / total) * 360;
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const strokeWidth = 20;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(endAngle);
    const end = polarToCartesian(startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {/* Debt arc (background) */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#FEE2E2" strokeWidth={strokeWidth} />
      {/* Paid arc */}
      {paidAngle > 0 && (
        <path
          d={describeArc(0, Math.min(paidAngle, 359.99))}
          fill="none"
          stroke="#2DB976"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      {/* Center text */}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-xl font-bold" fontSize="22" fontWeight="700">
        {pct}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-slate-400" fontSize="11">
        Yig&apos;im
      </text>
    </svg>
  );
}
