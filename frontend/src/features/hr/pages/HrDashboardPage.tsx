import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, Calendar, Briefcase } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Spinner } from '@/components/ui';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { useHrDashboard, useLeaves } from '@/api/hooks/useHr';
import type { Leave } from '@/types/hr';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { formatDate } from '@/lib/utils';

function ProgressBar({ label, value, max, color = '#4F46E5' }: { label: string; value: number; max: number; color?: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[13px] mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded bg-slate-100 overflow-hidden">
        <div className="h-full rounded" style={{ width: `${(value / Math.max(max, 1)) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

function KpiMiniRow({ label, value, accent = '#4F46E5' }: { label: string; value: number; accent?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-[13px] text-slate-600">{label}</span>
      <span className="text-base font-bold" style={{ color: accent }}>{value}</span>
    </div>
  );
}

export function HrDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { data: stats, isLoading } = useHrDashboard();
  const { data: allLeaves } = useLeaves();
  const pendingLeaves = (allLeaves ?? [])
    .filter((l: Leave) => {
      if (l.status !== 'pending') return false;
      if (dateFrom && l.startDate < dateFrom) return false;
      if (dateTo && l.endDate > dateTo) return false;
      return true;
    })
    .slice(0, 5);

  if (isLoading || !stats) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center"><Spinner /></div>
      </PageContent>
    );
  }

  const ageMax = Math.max(...stats.byAge.map((a) => a.count), 1);

  return (
    <PageContent>
      <PageHeader
        title={t('nav.hrPanel')}
        subtitle={t('hr.dashboardSubtitle')}
        breadcrumbs={[{ label: t('nav.hr') }]}
        actions={
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onChange={(f, t) => { setDateFrom(f); setDateTo(t); }}
          />
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => navigate('/hr/employees')}>
          <StatCard
            label={t('hr.totalEmployees')}
            value={stats.totalEmployees}
            icon={<Users className="h-[18px] w-[18px]" />}
            iconBg="#3B82F6"
          />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/hr/employees?status=active')}>
          <StatCard
            label={t('statuses.active')}
            value={stats.activeEmployees}
            icon={<CheckCircle className="h-[18px] w-[18px]" />}
            iconBg="#2DB976"
            trend={{
              value: stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0,
              label: t('statuses.active').toLowerCase(),
            }}
          />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/hr/employees?status=leave')}>
          <StatCard
            label={t('hr.onLeave')}
            value={stats.onLeave}
            icon={<Calendar className="h-[18px] w-[18px]" />}
            iconBg="#F59E0B"
          />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/hr/employees?status=business_trip')}>
          <StatCard
            label={t('hr.onBusinessTrip')}
            value={stats.onBusinessTrip}
            icon={<Briefcase className="h-[18px] w-[18px]" />}
            iconBg="#8B5CF6"
          />
        </div>
      </div>

      {/* 2fr 1fr grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4">{t('hr.ageDistribution')}</h3>
            {stats.byAge.map((a) => (
              <ProgressBar key={a.range} label={a.range + ' yosh'} value={a.count} max={ageMax} color="#4F46E5" />
            ))}
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4">{t('hr.recentOrders')}</h3>
            {stats.recentOrders.length === 0 ? (
              <p className="text-[13px] text-slate-400 text-center py-4">{t('hr.noOrders')}</p>
            ) : (
              stats.recentOrders.map((o) => (
                <div key={o.id} className="py-3 border-b border-slate-100 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">
                        №{o.number} — {o.typeLabel}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{o.employeeName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">{formatDate(o.date)}</p>
                      <div className="mt-1"><OrderStatusBadge status={o.status} /></div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {stats.recentOrders.length > 0 && (
              <button
                onClick={() => navigate('/hr/orders')}
                className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {t('hr.allOrders')} &rarr;
              </button>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-3.5">{t('hr.structure')}</h3>
            <div className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/hr/departments?type=fakultet')}>
              <KpiMiniRow label={t('hr.faculties')} value={stats.byDepartment.filter((d) => d.type === 'fakultet').length || 4} />
            </div>
            <div className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/hr/departments?type=kafedra')}>
              <KpiMiniRow label={t('hr.departments')} value={stats.byDepartment.filter((d) => d.type === 'kafedra').length || 12} />
            </div>
            <div className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/hr/departments?type=admin')}>
              <KpiMiniRow label={t('hr.divisions')} value={stats.byDepartment.filter((d) => d.type === 'admin').length || 6} />
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-3.5">{t('hr.scientificPotential')}</h3>
            <KpiMiniRow label="DSc" value={stats.scienceStats?.dsc ?? 3} accent="#7C3AED" />
            <KpiMiniRow label="PhD" value={stats.scienceStats?.phd ?? 8} accent="#4F46E5" />
            <KpiMiniRow label={t('hr.professors')} value={stats.scienceStats?.professor ?? 5} accent="#EC4899" />
            <KpiMiniRow label={t('hr.dotsents')} value={stats.scienceStats?.dotsent ?? 12} accent="#0EA5E9" />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-base font-semibold text-slate-900">{t('hr.pendingApproval')}</h3>
              <Badge variant="warning">{pendingLeaves.length}</Badge>
            </div>
            {pendingLeaves.length === 0 ? (
              <p className="text-[13px] text-slate-400 text-center py-4">
                {t('hr.noApplications')}
              </p>
            ) : (
              pendingLeaves.map((l) => (
                <div key={l.id} className="py-2.5 border-b border-slate-100 last:border-0 text-[13px]">
                  <div className="font-semibold text-slate-900">{l.employeeName}</div>
                  <div className="text-xs text-muted mt-0.5">
                    {l.typeLabel} &middot; {l.days} {t('hr.days')} &middot; {l.startDate}
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => navigate('/hr/leaves?status=pending')}
              className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {t('hr.allApplications')} &rarr;
            </button>
          </Card>
        </div>
      </div>
    </PageContent>
  );
}
