import { useState, useMemo } from 'react';
import { Search, FileText, ShieldAlert, AlertTriangle, CheckCircle, FileDown } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Avatar, Spinner, Button } from '@/components/ui';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { DataTable, Pagination, type Column } from '@/components/table';
import { useAuditLog } from '@/api/hooks/useSystem';
import type { AuditLogEntry } from '@/types/system';

const ACTION_BADGE: Record<string, { variant: 'info' | 'warning' | 'success' | 'error' | 'default'; label: string }> = {
  login: { variant: 'info', label: 'Kirish' },
  logout: { variant: 'default', label: 'Chiqish' },
  update: { variant: 'warning', label: 'Tahrir' },
  create: { variant: 'success', label: 'Yaratish' },
  delete: { variant: 'error', label: "O'chirish" },
};

const SEV_OPTIONS = [
  { value: '', label: 'Barchasi', color: '#64748B' },
  { value: 'critical', label: 'Critical', color: '#EF4444' },
  { value: 'warning', label: 'Warn', color: '#F59E0B' },
  { value: 'info', label: 'Info', color: '#10B981' },
];

export function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useAuditLog({
    page, pageSize, search: search || undefined,
    action: actionFilter || undefined, severity: sevFilter || undefined,
    dateFrom: dateFrom || undefined, dateTo: dateTo || undefined,
  });

  const entries = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const criticalCount = entries.filter((e) => e.severity === 'critical').length;
  const warningCount = entries.filter((e) => e.severity === 'warning').length;
  const infoCount = entries.filter((e) => e.severity === 'info').length;

  const columns: Column<AuditLogEntry>[] = useMemo(() => [
    {
      key: 'createdAt', header: 'Vaqt', width: '160px',
      render: (row) => {
        const d = new Date(row.createdAt);
        return (
          <div>
            <div className="text-[13px] text-slate-700">{d.toLocaleDateString('uz-UZ')}</div>
            <div className="mt-0.5 font-mono text-[11px] text-muted">{d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        );
      },
    },
    {
      key: 'userName', header: 'Foydalanuvchi',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.userName} size="sm" />
          <div className="text-[13px] font-medium text-slate-900">{row.userName}</div>
        </div>
      ),
    },
    { key: 'module', header: 'Modul', render: (row) => <span className="text-[13px] text-slate-600">{row.module}</span> },
    {
      key: 'action', header: 'Harakat',
      render: (row) => {
        const info = ACTION_BADGE[row.action] ?? { variant: 'default' as const, label: row.action };
        return <Badge variant={info.variant}>{info.label}</Badge>;
      },
    },
    { key: 'details', header: 'Tafsilot', render: (row) => <span className="line-clamp-1 text-[13px] text-slate-600">{row.details}</span> },
    { key: 'ipAddress', header: 'IP', width: '120px', render: (row) => <span className="font-mono text-[12px] text-muted">{row.ipAddress}</span> },
  ], []);

  return (
    <PageContent>
      <PageHeader
        title="Audit log"
        subtitle="Tizimdagi barcha harakatlar tarixi"
        breadcrumbs={[{ label: 'Tizim' }, { label: 'Audit log' }]}
        actions={
          <Button
            variant="secondary"
            leftIcon={<FileDown className="h-4 w-4" />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = `/api/v1/system/audit/export/?dateFrom=${dateFrom}&dateTo=${dateTo}&severity=${sevFilter}&action=${actionFilter}`;
              a.download = 'audit-log.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Excel
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Jami yozuv" value={total} icon={<FileText className="h-5 w-5" />} iconBg="#3B82F6" />
        <StatCard label="Critical" value={criticalCount} icon={<ShieldAlert className="h-5 w-5" />} iconBg="#EF4444" />
        <StatCard label="Ogohlantirish" value={warningCount} icon={<AlertTriangle className="h-5 w-5" />} iconBg="#F59E0B" />
        <StatCard label="Info" value={infoCount} icon={<CheckCircle className="h-5 w-5" />} iconBg="#10B981" />
      </div>

      <Card className="mt-6" noPadding>
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Login, IP, harakat yoki tafsilot..."
              className="h-9 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          </div>
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onChange={(f, t) => { setDateFrom(f); setDateTo(t); setPage(1); }}
          />
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {SEV_OPTIONS.map((o) => (
              <button key={o.value} onClick={() => { setSevFilter(o.value); setPage(1); }}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ backgroundColor: sevFilter === o.value ? '#fff' : 'transparent', color: sevFilter === o.value ? o.color : '#64748B', boxShadow: sevFilter === o.value ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: o.color }} />
                {o.label}
              </button>
            ))}
          </div>
          <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border bg-white px-3 text-sm">
            <option value="">Barcha harakatlar</option>
            <option value="login">Kirish</option>
            <option value="create">Yaratish</option>
            <option value="update">Tahrir</option>
            <option value="delete">O&apos;chirish</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <DataTable data={entries} columns={columns} keyField="id" />
        )}

        <div className="border-t border-border px-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} pageSize={pageSize} />
        </div>
      </Card>
    </PageContent>
  );
}
