import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Briefcase, AlertCircle, TrendingUp } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { ProgressBar, Spinner, AlertBanner } from '@/components/ui';
import { formatMoney } from '@/lib/utils';
import { useStaffing } from '@/api/hooks/useLegacy';

export function StaffingPage() {
  const { t } = useTranslation();
  const [deptFilter, setDeptFilter] = useState('');

  const { data: positions = [], isLoading, error } = useStaffing({ pageSize: 200 });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof positions>();
    for (const pos of positions) {
      const arr = map.get(pos.departmentName) ?? [];
      arr.push(pos);
      map.set(pos.departmentName, arr);
    }
    return Array.from(map.entries()).map(([name, items]) => ({ name, positions: items }));
  }, [positions]);

  const totalSlots = positions.reduce((s, p) => s + p.totalSlots, 0);
  const filledSlots = positions.reduce((s, p) => s + p.filledSlots, 0);
  const vacantSlots = totalSlots - filledSlots;
  const fillRate = totalSlots ? Math.round((filledSlots / totalSlots) * 100) : 0;

  const filteredGrouped = deptFilter ? grouped.filter((d) => d.name === deptFilter) : grouped;

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title={t('legacy.staffingTitle')}
        subtitle={t('legacy.staffingSubtitle')}
        breadcrumbs={[{ label: t('nav.legacy') }, { label: t('nav.staffing') }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label={t('legacy.totalStaffUnits')} value={totalSlots.toString()} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard label={t('legacy.filledPositions')} value={filledSlots.toString()} icon={<Users className="h-5 w-5" />} />
        <StatCard label={t('legacy.vacantPositions')} value={vacantSlots.toString()} icon={<AlertCircle className="h-5 w-5" />} />
        <StatCard label={t('legacy.fillRate')} value={`${fillRate}%`} icon={<TrendingUp className="h-5 w-5" />} trend={{ value: fillRate - 90 }} />
      </div>

      <div className="mb-4">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="h-9 rounded-md border border-border px-3 text-sm"
        >
          <option value="">{t('legacy.allDepartments')}</option>
          {grouped.map((d) => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredGrouped.map((dept) => {
          const deptTotal = dept.positions.reduce((s, p) => s + p.totalSlots, 0);
          const deptFilled = dept.positions.reduce((s, p) => s + p.filledSlots, 0);
          const deptVacant = deptTotal - deptFilled;

          return (
            <Card key={dept.name} title="" className="overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-semibold text-slate-900">{dept.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Jami: <strong className="text-slate-700">{deptTotal}</strong></span>
                    <span>Band: <strong className="text-emerald-600">{deptFilled}</strong></span>
                    {deptVacant > 0 && (
                      <span>Bo'sh: <strong className="text-amber-600">{deptVacant}</strong></span>
                    )}
                    <strong className="text-slate-700">{deptTotal ? Math.round((deptFilled / deptTotal) * 100) : 0}%</strong>
                  </div>
                </div>
                <ProgressBar
                  value={deptTotal ? Math.round((deptFilled / deptTotal) * 100) : 0}
                  color={deptVacant === 0 ? 'bg-emerald-500' : 'bg-primary-500'}
                  size="sm"
                />
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">LAVOZIM</th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">SHTAT</th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">BAND</th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">BO'SH</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">MAOSH (so'm)</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.positions.map((pos, i) => {
                    const vacant = pos.totalSlots - pos.filledSlots;
                    return (
                      <tr key={pos.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                        <td className="px-4 py-2.5 text-[13px] font-medium text-slate-900">{pos.positionName}</td>
                        <td className="px-4 py-2.5 text-[13px] text-slate-600 text-center">{pos.totalSlots}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="text-[13px] font-medium text-emerald-600">{pos.filledSlots}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {vacant > 0 ? (
                            <span className="text-[13px] font-medium text-amber-600">{vacant}</span>
                          ) : (
                            <span className="text-[13px] text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-slate-600 text-right font-mono">{formatMoney(pos.salary)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          );
        })}
      </div>
    </PageContent>
  );
}
