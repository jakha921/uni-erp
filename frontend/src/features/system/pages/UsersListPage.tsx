import { useState, useMemo, useCallback } from 'react';
import { Users, CheckCircle, ShieldAlert, UserPlus, Search, MoreHorizontal, Eye, Lock, KeyRound } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Avatar, Button, Spinner } from '@/components/ui';
import { DataTable, Pagination, type Column } from '@/components/table';
import { useSystemUsers, useBlockUser } from '@/api/hooks/useSystem';
import { useRoles } from '@/api/hooks/useSystem';
import type { SystemUserListItem } from '@/types/system';

const ROLE_COLORS: Record<string, string> = {
  admin: '#EF4444', buxgalter: '#F59E0B', dekan: '#3B82F6', oqituvchi: '#10B981', talaba: '#8B5CF6',
};

function RoleChip({ role, roleName }: { role: string; roleName: string }) {
  const color = ROLE_COLORS[role] ?? '#94A3B8';
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: color + '15', color, border: `1px solid ${color}30` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {roleName}
    </span>
  );
}

const STATUS_MAP: Record<string, { variant: 'success' | 'error'; label: string }> = {
  active: { variant: 'success', label: 'Faol' },
  blocked: { variant: 'error', label: 'Bloklangan' },
};

export function UsersListPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useSystemUsers({
    page, pageSize, search: search || undefined,
    role: roleFilter || undefined, status: statusFilter || undefined,
  });
  const { data: roles } = useRoles();
  const blockUser = useBlockUser();

  const users = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const activeCount = users.filter((u) => u.status === 'active').length;
  const blockedCount = users.filter((u) => u.status === 'blocked').length;

  const columns: Column<SystemUserListItem>[] = useMemo(() => [
    { key: 'index', header: '#', width: '50px', render: (_row, index) => <span className="text-xs text-muted">{(page - 1) * pageSize + index + 1}</span> },
    {
      key: 'fullName', header: 'Foydalanuvchi',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} size="sm" src={row.image ?? undefined} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900">{row.fullName}</div>
            <div className="mt-0.5 text-xs text-muted">{row.phone}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (row) => <span className="text-[13px] text-slate-600">{row.email}</span> },
    {
      key: 'roles', header: 'Rollar',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles.slice(0, 2).map((r) => <RoleChip key={r.id} role={r.role} roleName={r.roleName} />)}
          {row.roles.length > 2 && <span className="self-center text-[11px] text-muted font-medium">+{row.roles.length - 2}</span>}
        </div>
      ),
    },
    {
      key: 'status', header: 'Holat',
      render: (row) => {
        const st = STATUS_MAP[row.status] ?? { variant: 'default' as const, label: row.status };
        return <Badge variant={st.variant} dot>{st.label}</Badge>;
      },
    },
    {
      key: 'lastLogin', header: 'Oxirgi kirish',
      render: (row) => <span className="text-[13px] text-slate-600">{row.lastLogin ? new Date(row.lastLogin).toLocaleDateString('uz-UZ') : '—'}</span>,
    },
  ], [page]);

  const handleActions = useCallback(
    (row: SystemUserListItem) => (
      <div className="relative group">
        <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 peer">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-border bg-white py-1 shadow-lg hidden group-hover:block">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <Eye className="h-3.5 w-3.5" />Ko&apos;rish
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => blockUser.mutate(row.id)}
          >
            <Lock className="h-3.5 w-3.5" />{row.status === 'blocked' ? 'Blokdan chiqarish' : 'Bloklash'}
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <KeyRound className="h-3.5 w-3.5" />Parol tiklash
          </button>
        </div>
      </div>
    ), [blockUser],
  );

  return (
    <PageContent>
      <PageHeader
        title="Foydalanuvchilar"
        subtitle="Tizim foydalanuvchilari va ularning huquqlari"
        breadcrumbs={[{ label: 'Tizim' }, { label: 'Foydalanuvchilar' }]}
        actions={<Button variant="primary" size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>Foydalanuvchi qo&apos;shish</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Jami foydalanuvchi" value={total} icon={<Users className="h-5 w-5" />} iconBg="#2DB976" />
        <StatCard label="Faol" value={activeCount} icon={<CheckCircle className="h-5 w-5" />} iconBg="#10B981" />
        <StatCard label="Bloklangan" value={blockedCount} icon={<ShieldAlert className="h-5 w-5" />} iconBg="#EF4444" />
        <StatCard label="Jami rollar" value={roles?.length ?? 0} icon={<UserPlus className="h-5 w-5" />} iconBg="#3B82F6" />
      </div>

      <Card className="mt-6" noPadding>
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Ism, telefon yoki email bo'yicha qidirish..."
              className="h-9 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          </div>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border bg-white px-3 text-sm">
            <option value="">Barcha rollar</option>
            {(roles ?? []).map((r) => <option key={r.id} value={r.id}>{r.nameUz}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-border bg-white px-3 text-sm">
            <option value="">Barcha statuslar</option>
            <option value="active">Faol</option>
            <option value="blocked">Bloklangan</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <DataTable data={users} columns={columns} keyField="id" actions={handleActions} />
        )}

        <div className="border-t border-border px-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} pageSize={pageSize} />
        </div>
      </Card>
    </PageContent>
  );
}
