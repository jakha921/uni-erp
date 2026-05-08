import { useState, useMemo } from 'react';
import { Search, FileText, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Avatar } from '@/components/ui';
import { DataTable, Pagination, type Column } from '@/components/table';
import { generateAuditLog, type AuditEntry } from '../data';

const ACTION_BADGE_MAP: Record<string, { variant: 'info' | 'warning' | 'success' | 'error' | 'default'; label: string }> = {
  login: { variant: 'info', label: 'Kirish' },
  edit: { variant: 'warning', label: 'Tahrir' },
  create: { variant: 'success', label: 'Yaratish' },
  delete: { variant: 'error', label: "O'chirish" },
  role_change: { variant: 'warning', label: "Rol o'zgartirish" },
  password_reset: { variant: 'warning', label: 'Parol tiklash' },
  block: { variant: 'error', label: 'Bloklash' },
  export: { variant: 'info', label: 'Eksport' },
};

const ACTION_TYPE_OPTIONS = [
  { value: 'all', label: 'Barcha harakatlar' },
  { value: 'login', label: 'Kirish' },
  { value: 'edit', label: 'Tahrir' },
  { value: 'create', label: 'Yaratish' },
  { value: 'delete', label: "O'chirish" },
  { value: 'role_change', label: "Rol o'zgartirish" },
  { value: 'password_reset', label: 'Parol tiklash' },
  { value: 'block', label: 'Bloklash' },
  { value: 'export', label: 'Eksport' },
];

const SEV_OPTIONS = [
  { value: 'all', label: 'Barchasi', color: '#64748B' },
  { value: 'critical', label: 'Critical', color: '#EF4444' },
  { value: 'warn', label: 'Warn', color: '#F59E0B' },
  { value: 'info', label: 'Info', color: '#10B981' },
];

const AUDIT_LOG = generateAuditLog(40);

export function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    return AUDIT_LOG.filter((r) => {
      if (sevFilter !== 'all' && r.action.sev !== sevFilter) return false;
      if (actionFilter !== 'all' && r.action.kind !== actionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${r.actorLogin} ${r.actorName.full} ${r.desc} ${r.action.label} ${r.ip} ${r.module}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      return true;
    });
  }, [search, sevFilter, actionFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => ({
    total: AUDIT_LOG.length,
    critical: AUDIT_LOG.filter((r) => r.action.sev === 'critical').length,
    warn: AUDIT_LOG.filter((r) => r.action.sev === 'warn').length,
    info: AUDIT_LOG.filter((r) => r.action.sev === 'info').length,
  }), []);

  const columns: Column<AuditEntry>[] = useMemo(
    () => [
      {
        key: 'timestamp',
        header: 'Vaqt',
        width: '160px',
        render: (row) => (
          <div>
            <div className="text-[13px] text-slate-700">{row.date}</div>
            <div className="mt-0.5 font-mono text-[11px] text-muted">{row.timestamp}</div>
          </div>
        ),
      },
      {
        key: 'actor',
        header: 'Foydalanuvchi',
        render: (row) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.actorName.full} size="sm" />
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-slate-900">{row.actorName.short}</div>
              <div className="mt-0.5 font-mono text-[11px] text-muted">@{row.actorLogin}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'module',
        header: 'Modul',
        render: (row) => <span className="text-[13px] text-slate-600">{row.module}</span>,
      },
      {
        key: 'action',
        header: 'Harakat',
        render: (row) => {
          const info = ACTION_BADGE_MAP[row.action.kind] ?? { variant: 'default' as const, label: row.action.label };
          return <Badge variant={info.variant}>{info.label}</Badge>;
        },
      },
      {
        key: 'desc',
        header: 'Tafsilot',
        render: (row) => (
          <span className="line-clamp-1 text-[13px] text-slate-600">{row.desc}</span>
        ),
      },
      {
        key: 'ip',
        header: 'IP',
        width: '120px',
        render: (row) => <span className="font-mono text-[12px] text-muted">{row.ip}</span>,
      },
    ],
    [],
  );

  return (
    <PageContent>
      <PageHeader
        title="Audit log"
        subtitle="Tizimdagi barcha harakatlar tarixi"
        breadcrumbs={[{ label: 'Tizim' }, { label: 'Audit log' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Jami yozuv (24h)"
          value={stats.total}
          icon={<FileText className="h-5 w-5" />}
          iconBg="#3B82F620"
          sub="+12% kechagi kunga"
        />
        <StatCard
          label="Critical"
          value={stats.critical}
          icon={<ShieldAlert className="h-5 w-5" />}
          iconBg="#EF444420"
          sub="Diqqatga loyiq"
        />
        <StatCard
          label="Ogohlantirish"
          value={stats.warn}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBg="#F59E0B20"
          sub="Rol/ruxsat o'zgarishlari"
        />
        <StatCard
          label="Info"
          value={stats.info}
          icon={<CheckCircle className="h-5 w-5" />}
          iconBg="#10B98120"
          sub="Oddiy faollik"
        />
      </div>

      {/* Filters + Table */}
      <Card className="mt-6" noPadding>
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Login, IP, harakat yoki tafsilot..."
              className="h-9 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-border bg-white px-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <span className="text-xs text-muted">&mdash;</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-border bg-white px-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Severity filter pills */}
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {SEV_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => { setSevFilter(o.value); setPage(1); }}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: sevFilter === o.value ? '#fff' : 'transparent',
                  color: sevFilter === o.value ? o.color : '#64748B',
                  boxShadow: sevFilter === o.value ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: o.color }} />
                {o.label}
              </button>
            ))}
          </div>

          {/* Action type filter */}
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {ACTION_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <DataTable data={pagedData} columns={columns} keyField="id" />

        <div className="border-t border-border px-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            total={filtered.length}
            pageSize={pageSize}
          />
        </div>
      </Card>
    </PageContent>
  );
}
