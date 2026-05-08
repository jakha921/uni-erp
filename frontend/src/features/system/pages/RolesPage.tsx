import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LayoutGrid, Plus, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button, Badge } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { ROLES, PERM_MATRIX, MODULE_GROUPS, PERM_VERBS, ALL_MODULES, type SystemRole } from '../data';

function PermVerbDot({ verbId, active }: { verbId: string; active: boolean }) {
  const verb = PERM_VERBS.find((v) => v.id === verbId);
  if (!verb) return null;
  if (!active) return null;
  return (
    <span
      className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-[5px] text-[10.5px] font-bold"
      style={{ backgroundColor: verb.color + '20', color: verb.color }}
      title={verb.label}
    >
      {verb.short}
    </span>
  );
}

function RoleCard({ role, selected, onClick }: { role: SystemRole; selected: boolean; onClick: () => void }) {
  const perms = PERM_MATRIX[role.id] ?? {};
  const modCount = Object.keys(perms).length;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl bg-white p-4 transition-all"
      style={{
        border: `2px solid ${selected ? role.color : '#F1F5F9'}`,
        boxShadow: selected ? `0 0 0 4px ${role.color}15` : '0 1px 3px rgba(0,0,0,.04)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: role.color + '15', color: role.color }}
        >
          <Shield className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{role.name}</span>
            {!role.system && (
              <span className="rounded-full bg-amber-50 px-1.5 py-px text-[10px] font-bold text-amber-700">
                CUSTOM
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{role.desc}</p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-3.5">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold tabular-nums text-slate-600">
            {role.users.toLocaleString('ru-RU')}
          </span>
          <span className="text-[11px] text-muted">foyd.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <LayoutGrid className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">{modCount}</span>
          <span className="text-[11px] text-muted">modul</span>
        </div>
        {role.scope && (
          <Badge variant="default" className="ml-auto">
            {role.scope}
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[10.5px] font-semibold text-muted">LVL</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: role.color }}>
            {role.level}
          </span>
        </div>
      </div>

      {/* mini progress bar */}
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, (modCount / ALL_MODULES.length) * 100)}%`, backgroundColor: role.color }}
        />
      </div>
    </div>
  );
}

function RoleDetailPanel({ role }: { role: SystemRole }) {
  const perms = PERM_MATRIX[role.id] ?? {};
  const permCount = Object.values(perms).flat().length;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(MODULE_GROUPS.map((g) => g.label)));

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <Card noPadding>
      {/* Header with gradient */}
      <div
        className="border-b border-border p-5"
        style={{ background: `linear-gradient(135deg, ${role.color}10 0%, transparent 60%)` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white"
            style={{ backgroundColor: role.color }}
          >
            {role.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{role.name}</span>
              <span
                className="rounded-full px-1.5 py-px text-[10.5px] font-semibold"
                style={{
                  backgroundColor: role.system ? '#F1F5F9' : '#FEF3C7',
                  color: role.system ? '#64748B' : '#92400E',
                }}
              >
                {role.system ? 'SYSTEM' : 'CUSTOM'}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted">
              {role.users.toLocaleString('ru-RU')} ta foydalanuvchi &middot; level {role.level}
            </div>
          </div>
        </div>
        <p className="mt-3.5 text-[13px] leading-relaxed text-slate-600">{role.desc}</p>
        {role.scope && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs text-slate-600">
            <LayoutGrid className="h-3 w-3" /> Scope: <strong>{role.scope}</strong>
          </div>
        )}
        {!role.system && role.createdBy && (
          <div className="mt-2.5 text-[11.5px] text-muted">
            {role.createdAt} sanasida {role.createdBy} tomonidan yaratilgan
          </div>
        )}
      </div>

      {/* Permission breakdown */}
      <div className="max-h-[480px] overflow-y-auto p-4">
        <div className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.04em] text-muted">
          Modul ruxsatlari ({permCount} ta jami)
        </div>
        {MODULE_GROUPS.map((group) => {
          const items = group.modules.filter((m) => perms[m.id]);
          if (items.length === 0) return null;
          const isExpanded = expandedGroups.has(group.label);
          return (
            <div key={group.label} className="mb-3">
              <button
                onClick={() => toggleGroup(group.label)}
                className="mb-1.5 flex w-full items-center gap-1.5 text-left text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400 hover:text-slate-600"
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {group.label}
              </button>
              {isExpanded &&
                items.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2.5 border-b border-dashed border-slate-100 py-1.5"
                  >
                    <span className="flex-1 text-[13px] text-slate-900">{m.name}</span>
                    <div className="flex gap-0.5">
                      {PERM_VERBS.map((v) => (
                        <PermVerbDot key={v.id} verbId={v.id} active={perms[m.id]?.includes(v.id) ?? false} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-border p-3.5">
        <Button variant="secondary" size="sm" disabled={role.id === 'super-admin'}>
          Tahrirlash
        </Button>
        <Button variant="secondary" size="sm">
          Klonlash
        </Button>
        <Button variant="secondary" size="sm" leftIcon={<Users className="h-3.5 w-3.5" />}>
          Foydalanuvchilar
        </Button>
        <div className="flex-1" />
        {!role.system && (
          <Button variant="danger" size="sm">
            O&apos;chirish
          </Button>
        )}
      </div>
    </Card>
  );
}

export function RolesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('rector');

  const tabs = useMemo(
    () => [
      { id: 'all', label: 'Barchasi', count: ROLES.length },
      { id: 'system', label: 'System', count: ROLES.filter((r) => r.system).length },
      { id: 'custom', label: 'Custom', count: ROLES.filter((r) => !r.system).length },
    ],
    [],
  );

  const filteredRoles = useMemo(
    () => ROLES.filter((r) => filter === 'all' || (filter === 'system' ? r.system : !r.system)),
    [filter],
  );

  // ROLES is a non-empty const array so this always resolves
  const selectedRole = (ROLES.find((r) => r.id === selectedId) ?? ROLES[1]) as SystemRole;

  return (
    <PageContent>
      <PageHeader
        title="Rollar va ruxsatlar"
        subtitle={`${ROLES.length} ta rol · ${ROLES.filter((r) => !r.system).length} ta custom · ${ROLES.reduce((s, r) => s + r.users, 0).toLocaleString('ru-RU')} ta foydalanuvchi`}
        breadcrumbs={[{ label: 'Tizim' }, { label: 'Rollar' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<LayoutGrid className="h-4 w-4" />}
              onClick={() => navigate('/system/permissions')}
            >
              Permission Matrix
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Yangi rol
            </Button>
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={filter} onTabChange={setFilter} className="mb-4" />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_480px]">
        {/* Role grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredRoles.map((r) => (
            <RoleCard key={r.id} role={r} selected={r.id === selectedId} onClick={() => setSelectedId(r.id)} />
          ))}
        </div>

        {/* Detail panel */}
        <div className="sticky top-4">
          <RoleDetailPanel role={selectedRole} />
        </div>
      </div>
    </PageContent>
  );
}
