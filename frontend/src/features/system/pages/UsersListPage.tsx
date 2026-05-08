import { useState, useMemo, useCallback } from 'react';
import { Users, CheckCircle, ShieldAlert, UserPlus, Search, ShieldCheck, MoreHorizontal, Eye, Lock, KeyRound } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Avatar, Button } from '@/components/ui';
import { DataTable, Pagination, type Column } from '@/components/table';
import { generateUsers, ROLES, type SystemUser } from '../data';

const ROLE_COLOR_MAP: Record<string, string> = {
  'super-admin': '#EF4444',
  rector: '#8B5CF6',
  'vice-rector': '#3B82F6',
  dean: '#06B6D4',
  'hr-manager': '#F59E0B',
  finance: '#2DB976',
  teacher: '#10B981',
  student: '#3B82F6',
  'crm-operator': '#EC4899',
};

function RoleChip({ roleId }: { roleId: string }) {
  const role = ROLES.find((r) => r.id === roleId);
  if (!role) return null;
  const color = ROLE_COLOR_MAP[roleId] ?? '#94A3B8';
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: color + '15', color, border: `1px solid ${color}30` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {role.name}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, { variant: 'success' | 'error' | 'info' | 'warning'; label: string }> = {
    Faol: { variant: 'success', label: 'Faol' },
    Bloklangan: { variant: 'error', label: 'Bloklangan' },
    'Taklif yuborilgan': { variant: 'info', label: 'Taklif yuborilgan' },
    Pauza: { variant: 'warning', label: 'Pauza' },
  };
  const info = map[status] ?? { variant: 'default' as const, label: status };
  return (
    <Badge variant={info.variant} dot>
      {info.label}
    </Badge>
  );
}

function ActionsMenu({ user }: { user: SystemUser }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-border bg-white py-1 shadow-lg">
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <Eye className="h-3.5 w-3.5" />
              Ko&apos;rish
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <Lock className="h-3.5 w-3.5" />
              {user.status === 'Bloklangan' ? 'Blokdan chiqarish' : 'Bloklash'}
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <KeyRound className="h-3.5 w-3.5" />
              Parol tiklash
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const USERS = generateUsers(20);

const STATUS_OPTIONS = [
  { value: 'all', label: 'Barcha statuslar' },
  { value: 'Faol', label: 'Faol' },
  { value: 'Bloklangan', label: 'Bloklangan' },
  { value: 'Taklif yuborilgan', label: 'Taklif yuborilgan' },
  { value: 'Pauza', label: 'Pauza' },
];

const BRANCH_OPTIONS = [
  { value: 'all', label: 'Barcha filiallar' },
  { value: 'Navoiy (bosh)', label: 'Navoiy (bosh)' },
  { value: 'Zarafshon filiali', label: 'Zarafshon filiali' },
  { value: 'Uchquduq filiali', label: 'Uchquduq filiali' },
  { value: 'Qiziltepa filiali', label: 'Qiziltepa filiali' },
];

const ROLE_OPTIONS = [
  { value: 'all', label: 'Barcha rollar' },
  ...ROLES.map((r) => ({ value: r.id, label: r.name })),
];

export function UsersListPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (!`${u.name.full} ${u.login} ${u.email}`.toLowerCase().includes(q)) return false;
      }
      if (roleFilter !== 'all' && !u.roles.includes(roleFilter)) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (branchFilter !== 'all' && u.branch !== branchFilter) return false;
      return true;
    });
  }, [search, roleFilter, statusFilter, branchFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => ({
    total: USERS.length,
    active: USERS.filter((u) => u.status === 'Faol').length,
    blocked: USERS.filter((u) => u.status === 'Bloklangan').length,
    newToday: USERS.filter((u) => u.lastLoginDays === 0).length,
  }), []);

  const columns: Column<SystemUser>[] = useMemo(
    () => [
      {
        key: 'index',
        header: '#',
        width: '50px',
        render: (_row, index) => (
          <span className="text-xs text-muted">{(page - 1) * pageSize + index + 1}</span>
        ),
      },
      {
        key: 'name',
        header: 'Foydalanuvchi',
        render: (row) => (
          <div className="flex items-center gap-3">
            <Avatar name={row.name.full} size="sm" />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">{row.name.full}</div>
              <div className="mt-0.5 text-xs text-muted font-mono">@{row.login}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        render: (row) => <span className="text-[13px] text-slate-600">{row.email}</span>,
      },
      {
        key: 'roles',
        header: 'Rollar',
        render: (row) => (
          <div className="flex flex-wrap gap-1">
            {row.roles.slice(0, 2).map((rid) => (
              <RoleChip key={rid} roleId={rid} />
            ))}
            {row.roles.length > 2 && (
              <span className="self-center text-[11px] text-muted font-medium">+{row.roles.length - 2}</span>
            )}
          </div>
        ),
      },
      {
        key: 'branch',
        header: 'Filial',
        render: (row) => (
          <div>
            <div className="text-[13px] text-slate-700">{row.branch}</div>
            <div className="mt-0.5 text-[11px] text-muted">{row.department.replace(' kafedrasi', '')}</div>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Holat',
        render: (row) => <StatusDot status={row.status} />,
      },
      {
        key: 'twoFa',
        header: '2FA',
        width: '70px',
        render: (row) =>
          row.twoFa ? (
            <div className="flex items-center gap-1 text-xs font-semibold text-green-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Ha
            </div>
          ) : (
            <span className="text-xs text-slate-300">&mdash;</span>
          ),
      },
      {
        key: 'lastLogin',
        header: 'Oxirgi kirish',
        render: (row) => (
          <span
            className={`text-[13px] ${row.lastLoginDays === 0 ? 'font-semibold text-green-700' : 'text-slate-600'}`}
          >
            {row.lastLogin}
          </span>
        ),
      },
    ],
    [page],
  );

  const handleActions = useCallback(
    (row: SystemUser) => <ActionsMenu user={row} />,
    [],
  );

  return (
    <PageContent>
      <PageHeader
        title="Foydalanuvchilar"
        subtitle="Tizim foydalanuvchilari va ularning huquqlari"
        breadcrumbs={[{ label: 'Tizim' }, { label: 'Foydalanuvchilar' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
            Foydalanuvchi qo&apos;shish
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Jami foydalanuvchi"
          value={stats.total}
          icon={<Users className="h-5 w-5" />}
          iconBg="#2DB97620"
          sub="+3 oyiga"
        />
        <StatCard
          label="Faol"
          value={stats.active}
          icon={<CheckCircle className="h-5 w-5" />}
          iconBg="#10B98120"
          sub={`${stats.newToday} ta hozir online`}
        />
        <StatCard
          label="Bloklangan"
          value={stats.blocked}
          icon={<ShieldAlert className="h-5 w-5" />}
          iconBg="#EF444420"
          sub="Xavfsizlik holati"
        />
        <StatCard
          label="Yangi (bugun)"
          value={stats.newToday}
          icon={<UserPlus className="h-5 w-5" />}
          iconBg="#3B82F620"
          sub="Bugungi kirish"
        />
      </div>

      {/* Filters + Table */}
      <Card className="mt-6" noPadding>
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Ism, login yoki email bo'yicha qidirish..."
              className="h-9 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => { setBranchFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {BRANCH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <DataTable data={pagedData} columns={columns} keyField="id" actions={handleActions} />

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
