import { useState, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button } from '@/components/ui';
import { ROLES, PERM_MATRIX, MODULE_GROUPS, PERM_VERBS, ALL_MODULES } from '../data';
import { useUpdateRolePermissions } from '@/api/hooks/useSystem';

export function PermissionMatrixPage() {
  const navigate = useNavigate();
  const [activeVerb, setActiveVerb] = useState('view');
  const [highlightRole, setHighlightRole] = useState<string | null>(null);
  const [highlightMod, setHighlightMod] = useState<string | null>(null);
  const [localMatrix, setLocalMatrix] = useState<Record<string, Record<string, string[]>>>(() => {
    const copy: Record<string, Record<string, string[]>> = {};
    for (const [role, mods] of Object.entries(PERM_MATRIX)) {
      copy[role] = {};
      for (const [mod, verbs] of Object.entries(mods)) {
        copy[role][mod] = [...verbs];
      }
    }
    return copy;
  });

  const updatePermissions = useUpdateRolePermissions();

  const handleToggle = (roleId: string, modId: string) => {
    const currentVerbs = localMatrix[roleId]?.[modId] ?? [];
    const has = currentVerbs.includes(activeVerb);
    const newVerbs = has ? currentVerbs.filter((v) => v !== activeVerb) : [...currentVerbs, activeVerb];
    setLocalMatrix((prev) => ({
      ...prev,
      [roleId]: { ...(prev[roleId] ?? {}), [modId]: newVerbs },
    }));
    updatePermissions.mutate({ roleId, moduleId: modId, verb: activeVerb, granted: !has });
  };

  const activeVerbObj = PERM_VERBS.find((v) => v.id === activeVerb);

  const { grantedCells, totalCells } = useMemo(() => {
    const total = ROLES.length * ALL_MODULES.length;
    const granted = ROLES.reduce((s, r) => {
      const m = localMatrix[r.id] ?? {};
      return s + Object.values(m).filter((verbs) => verbs.includes(activeVerb)).length;
    }, 0);
    return { grantedCells: granted, totalCells: total };
  }, [activeVerb, localMatrix]);

  const coveragePercent = totalCells > 0 ? Math.round((grantedCells / totalCells) * 100) : 0;

  return (
    <PageContent>
      <PageHeader
        title="Ruxsatlar matritsasi"
        subtitle={`${ROLES.length} rol x ${ALL_MODULES.length} modul`}
        breadcrumbs={[
          { label: 'Tizim', path: '/system/roles' },
          { label: 'Rollar', path: '/system/roles' },
          { label: 'Ruxsatlar matritsasi' },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/system/roles')}
          >
            Rollarga qaytish
          </Button>
        }
      />

      {/* Verb filter bar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">Ruxsat turi bo&apos;yicha filtrlash</div>
            <div className="mt-1 text-xs text-muted">
              <strong>{grantedCells}</strong>/{totalCells} qamrov ({coveragePercent}%) &mdash;{' '}
              <span style={{ color: activeVerbObj?.color }}>{activeVerbObj?.label}</span>
            </div>
          </div>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {PERM_VERBS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVerb(v.id)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: activeVerb === v.id ? v.color : 'transparent',
                  color: activeVerb === v.id ? '#fff' : '#64748B',
                }}
              >
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded text-[9.5px] font-bold"
                  style={{
                    backgroundColor: activeVerb === v.id ? '#ffffff30' : v.color + '20',
                    color: activeVerb === v.id ? '#fff' : v.color,
                  }}
                >
                  {v.short}
                </span>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Matrix */}
      <Card noPadding className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th className="sticky left-0 z-10 min-w-[280px] border-b border-r border-slate-200 bg-white px-4 py-3.5 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
                    Modul \ Rol
                  </span>
                </th>
                {ROLES.map((r) => (
                  <th
                    key={r.id}
                    className="min-w-[88px] border-b border-slate-200 px-1.5 py-3 transition-colors"
                    style={{ backgroundColor: highlightRole === r.id ? r.color + '12' : '#fff' }}
                    onMouseEnter={() => setHighlightRole(r.id)}
                    onMouseLeave={() => setHighlightRole(null)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[11px] font-bold text-white"
                        style={{ backgroundColor: r.color }}
                      >
                        {r.name
                          .split(' ')
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <span className="max-w-[84px] text-center text-[11px] font-semibold leading-tight text-slate-900">
                        {r.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted">{r.users.toLocaleString('ru-RU')}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULE_GROUPS.map((group, gi) => (
                <Fragment key={group.label}>
                  {/* Group header */}
                  <tr>
                    <td
                      colSpan={ROLES.length + 1}
                      className="sticky left-0 z-[5] bg-slate-50 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted"
                      style={{
                        borderTop: gi > 0 ? '1px solid #E2E8F0' : undefined,
                        borderBottom: '1px solid #E2E8F0',
                      }}
                    >
                      {group.label}
                    </td>
                  </tr>
                  {/* Module rows */}
                  {group.modules.map((mod) => (
                    <tr
                      key={mod.id}
                      onMouseEnter={() => setHighlightMod(mod.id)}
                      onMouseLeave={() => setHighlightMod(null)}
                    >
                      <td
                        className="sticky left-0 z-[2] min-w-[280px] border-b border-r border-slate-100 px-4 py-3 transition-colors"
                        style={{ backgroundColor: highlightMod === mod.id ? '#F0FDF4' : '#fff' }}
                      >
                        <div className="text-[13px] font-medium text-slate-900">{mod.name}</div>
                        <div className="mt-0.5 text-[11.5px] leading-snug text-muted">{mod.desc}</div>
                      </td>
                      {ROLES.map((r) => {
                        const verbs = (localMatrix[r.id] ?? {})[mod.id] ?? [];
                        const has = verbs.includes(activeVerb);
                        const allVerbCount = verbs.length;
                        const isHL = highlightRole === r.id || highlightMod === mod.id;

                        return (
                          <td
                            key={r.id}
                            className="border-b border-slate-100 px-1.5 py-2 text-center transition-colors cursor-pointer"
                            style={{
                              backgroundColor: has
                                ? (activeVerbObj?.color ?? '#64748B') + (isHL ? '22' : '12')
                                : isHL
                                  ? '#F8FAFC'
                                  : '#fff',
                            }}
                            onClick={() => handleToggle(r.id, mod.id)}
                            title={has ? `${activeVerbObj?.label} ruxsatini olib tashlash` : `${activeVerbObj?.label} ruxsatini berish`}
                          >
                            {has ? (
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-white"
                                style={{ backgroundColor: activeVerbObj?.color ?? '#64748B' }}
                              >
                                <Check className="h-3 w-3" strokeWidth={3} />
                                {allVerbCount > 1 && (
                                  <span className="text-[10px] font-bold opacity-90">+{allVerbCount - 1}</span>
                                )}
                              </span>
                            ) : (
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-slate-300" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 px-2 text-xs text-muted">
        <div className="inline-flex items-center gap-1.5">
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: activeVerbObj?.color ?? '#64748B' }}
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
          Ruxsat berilgan
        </div>
        <div className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-200" />
          Ruxsat yo&apos;q
        </div>
        <div className="inline-flex items-center gap-1.5">
          <span
            className="rounded px-1 py-px text-[10px] font-bold text-white"
            style={{ backgroundColor: activeVerbObj?.color ?? '#64748B' }}
          >
            +N
          </span>
          Boshqa N ta verb ham mavjud
        </div>
        <div className="ml-auto">Verb tanlash uchun yuqoridagi tugmalardan foydalaning</div>
      </div>
    </PageContent>
  );
}
