import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Clock, Briefcase, Calendar, Search, BarChart3, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { StatCard } from '@/components/data-display/StatCard';
import { Tabs } from '@/components/navigation/Tabs';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/overlays';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { LeaveTable } from '../components/LeaveTable';
import { LeaveForm } from '../components/LeaveForm';
import { useLeaves, useCreateLeave, useUpdateLeave, useDeleteLeave, useEmployees } from '@/api/hooks/useHr';
import type { CreateLeaveDto, Leave, LeaveStatus } from '@/types/hr';

const MONTH_NAMES = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
const DAY_SHORTS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

const LEAVE_COLORS: Record<string, { bg: string; text: string }> = {
  annual: { bg: '#DCFCE7', text: '#16A34A' },
  sick: { bg: '#FEE2E2', text: '#DC2626' },
  unpaid: { bg: '#FEF3C7', text: '#D97706' },
  maternity: { bg: '#F3E8FF', text: '#7C3AED' },
  business_trip: { bg: '#DBEAFE', text: '#2563EB' },
  study: { bg: '#FEF9C3', text: '#CA8A04' },
};

function LeaveCalendar({ leaves, calendarMonth, onMonthChange }: {
  leaves: Leave[];
  calendarMonth: Date;
  onMonthChange: (d: Date) => void;
}) {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const approved = leaves.filter((l) => l.status === 'approved');

  const leavesOnDay = (day: number) => {
    const date = new Date(year, month, day);
    return approved.filter((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      return date >= start && date <= end;
    });
  };

  const today = new Date();

  return (
    <Card noPadding>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <button onClick={() => onMonthChange(new Date(year, month - 1, 1))} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-slate-900">{MONTH_NAMES[month]} {year}</span>
        <button onClick={() => onMonthChange(new Date(year, month + 1, 1))} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_SHORTS.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const isToday = day !== null && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          const dayLeaves = day !== null ? leavesOnDay(day) : [];

          return (
            <div key={idx} className={`min-h-[80px] border-b border-r border-slate-100 p-1.5 ${day === null ? 'bg-slate-50/50' : ''}`}>
              {day !== null && (
                <>
                  <div className={`mb-1 h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold ${isToday ? 'bg-primary-500 text-white' : 'text-slate-700'}`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayLeaves.slice(0, 3).map((l) => {
                      const colors = LEAVE_COLORS[l.type] ?? { bg: '#F1F5F9', text: '#64748B' };
                      return (
                        <div
                          key={l.id}
                          title={`${l.employeeName} — ${l.typeLabel}`}
                          className="truncate rounded px-1 py-0.5 text-[9.5px] font-medium"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {l.employeeName.split(' ')[0]}
                        </div>
                      );
                    })}
                    {dayLeaves.length > 3 && (
                      <div className="text-[9.5px] text-slate-400 pl-1">+{dayLeaves.length - 3}</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function LeavesPage() {
  const [searchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [tab, setTab] = useState(() => searchParams.get('status') ?? 'all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [deleteLeave, setDeleteLeave] = useState<Leave | null>(null);

  const { data: leaves, isLoading } = useLeaves();
  const { data: employeesData } = useEmployees();
  const createMutation = useCreateLeave();
  const updateMutation = useUpdateLeave();
  const deleteMutation = useDeleteLeave();

  const employees = employeesData?.data ?? [];

  const filtered = useMemo(() => {
    if (!leaves) return [];
    return leaves.filter((l) => {
      if (search && !l.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
      if (tab === 'leaves' && l.type === 'business_trip') return false;
      if (tab === 'trips' && l.type !== 'business_trip') return false;
      if (tab === 'pending' && l.status !== 'pending') return false;
      if (dateFrom && l.startDate < dateFrom) return false;
      if (dateTo && l.endDate > dateTo) return false;
      return true;
    });
  }, [leaves, tab, search, dateFrom, dateTo]);

  const onLeaveCount = leaves?.filter(l => l.status === 'approved' && l.type !== 'business_trip').length ?? 0;
  const onTripCount = leaves?.filter(l => l.status === 'approved' && l.type === 'business_trip').length ?? 0;
  const pendingCount = leaves?.filter(l => l.status === 'pending').length ?? 0;

  const handleApprove = (leave: { id: string }) => {
    updateMutation.mutate({ id: leave.id, patch: { status: 'approved' as LeaveStatus } });
  };

  const handleReject = (leave: { id: string }) => {
    updateMutation.mutate({ id: leave.id, patch: { status: 'rejected' as LeaveStatus } });
  };

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title="Ta'tillar va xizmat safarlari"
        subtitle={`Jami: ${filtered.length} ta`}
        breadcrumbs={[
          { label: 'Kadrlar', path: '/hr' },
          { label: "Ta'tillar" },
        ]}
        actions={
          <div className="flex gap-2">
            <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-1.5 transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                title="Ro'yxat"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`rounded-md p-1.5 transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                title="Kalendar"
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
              Yangi ariza
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Hozir ta'tilda" value={onLeaveCount} icon={<Calendar className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Hozir safarda" value={onTripCount} icon={<Briefcase className="h-[18px] w-[18px]" />} iconBg="#8B5CF6" />
        <StatCard label="Tasdiqlash kutmoqda" value={pendingCount} icon={<Clock className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Bu oy jami" value={leaves?.length ?? 0} icon={<BarChart3 className="h-[18px] w-[18px]" />} iconBg="#6366F1" />
      </div>

      <div className="mt-6">
        {viewMode === 'list' ? (
          <>
            <Tabs
              tabs={[
                { id: 'all', label: 'Hammasi', count: leaves?.length ?? 0 },
                { id: 'leaves', label: "Ta'tillar", count: leaves?.filter((l) => l.type !== 'business_trip').length ?? 0 },
                { id: 'trips', label: 'Xizmat safarlari', count: leaves?.filter((l) => l.type === 'business_trip').length ?? 0 },
                { id: 'pending', label: 'Tasdiqlash kutmoqda', count: pendingCount },
              ]}
              activeTab={tab}
              onTabChange={setTab}
            />
            <Card className="mt-4 mb-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Xodim ismi bo'yicha qidirish…"
                    className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                  />
                </div>
                <DateRangePicker
                  from={dateFrom}
                  to={dateTo}
                  onChange={(f, t) => { setDateFrom(f); setDateTo(t); }}
                />
              </div>
            </Card>
            <Card noPadding className="overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" /></div>
              ) : (
                <LeaveTable data={filtered} onApprove={handleApprove} onReject={handleReject} onDelete={setDeleteLeave} />
              )}
            </Card>
          </>
        ) : (
          <LeaveCalendar
            leaves={leaves ?? []}
            calendarMonth={calendarMonth}
            onMonthChange={setCalendarMonth}
          />
        )}
      </div>

      <LeaveForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => {
          createMutation.mutate(data as unknown as CreateLeaveDto, {
            onSuccess: () => setFormOpen(false),
          });
        }}
        employees={employees}
        loading={createMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteLeave}
        onClose={() => setDeleteLeave(null)}
        onConfirm={() => {
          if (!deleteLeave) return;
          deleteMutation.mutate(deleteLeave.id, { onSuccess: () => setDeleteLeave(null) });
        }}
        title="Arizani bekor qilish"
        message={`"${deleteLeave?.employeeName}" xodimining ta'til arizasini bekor qilishni tasdiqlaysizmi?`}
        confirmLabel="Bekor qilish"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </PageContent>
  );
}
