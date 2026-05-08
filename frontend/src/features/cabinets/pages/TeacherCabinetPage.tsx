import { PageContent, PageHeader } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button, Spinner } from '@/components/ui';
import { CalendarDays, GraduationCap, ClipboardCheck, ListTodo, Calendar } from 'lucide-react';
import { useTeacherCabinet } from '@/api/hooks/useCabinet';

const QUICK_ACTIONS = [
  { icon: CalendarDays, label: 'Dars jadvali', color: '#3B82F6' },
  { icon: GraduationCap, label: 'Baholar', color: '#2DB976' },
  { icon: ClipboardCheck, label: 'Davomat', color: '#F59E0B' },
  { icon: ListTodo, label: 'Vazifalar', color: '#8B5CF6' },
] as const;

const PAIR_TIMES = ['08:30', '10:10', '12:00', '13:40', '15:20'];

const PRIORITY_COLORS: Record<string, string> = { grading: '#EF4444', thesis: '#F59E0B', other: '#94A3B8' };

export function TeacherCabinetPage() {
  const { data, isLoading } = useTeacherCabinet();

  if (isLoading || !data) {
    return <PageContent><div className="flex justify-center py-20"><Spinner size="lg" /></div></PageContent>;
  }

  const { teacher, todayClasses, myGroups, pendingTasks, stats } = data;
  const initials = teacher.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2);

  return (
    <PageContent>
      <PageHeader title="O'qituvchi kabineti" breadcrumbs={[{ label: 'Kabinetlar' }, { label: "O'qituvchi kabineti" }]} />

      <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-6 text-white flex items-center gap-5 mb-5">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white/20 text-[26px] font-bold">{initials}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider opacity-85">O&apos;qituvchi kabineti</p>
          <h2 className="mt-1 text-2xl font-bold">{teacher.fullName}</h2>
          <p className="mt-1 text-[13px] opacity-90">{teacher.department} &middot; {teacher.position}</p>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <StatBlock value={String(todayClasses.length)} label="Bugungi darslar" />
          <div className="h-10 w-px bg-white/30" />
          <StatBlock value={String(stats.totalStudents)} label="Talabalar" />
          <div className="h-10 w-px bg-white/30" />
          <StatBlock value={`${stats.avgAttendance}%`} label="Davomat" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {QUICK_ACTIONS.map((action) => (
          <button key={action.label} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-left hover:shadow-md transition-shadow">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-[13px] font-semibold text-slate-900">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Bugungi dars jadvali</h3>
              <p className="text-xs text-slate-500 mt-0.5">{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <Button variant="secondary" size="sm"><ClipboardCheck className="h-3.5 w-3.5 mr-1" />Davomat olish</Button>
          </div>
          <div className="flex flex-col gap-2">
            {todayClasses.map((cls) => (
              <div key={cls.id} className="flex items-center gap-3.5 rounded-xl bg-[#F8FAFB] p-3">
                <div className="w-14 text-center">
                  <span className="text-base font-bold text-slate-900 tabular-nums">{PAIR_TIMES[cls.pairNumber - 1] ?? `${cls.pairNumber}-para`}</span>
                </div>
                <div className="h-9 w-px bg-slate-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-900">{cls.subjectName}</p>
                  <p className="text-[11.5px] text-slate-500 mt-0.5">{cls.groupName} &middot; {cls.room}</p>
                </div>
                <Button variant="secondary" size="sm">Boshlash</Button>
              </div>
            ))}
            {todayClasses.length === 0 && <p className="text-center text-sm text-slate-400 py-6">Bugun darslar yo&apos;q</p>}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Mening vazifalarim</h3>
          <div className="flex flex-col gap-2">
            {pendingTasks.map((task) => (
              <div key={task.title} className="flex gap-2.5 rounded-lg bg-[#F8FAFB] p-2.5">
                <div className="w-1 shrink-0 self-stretch rounded-full" style={{ backgroundColor: PRIORITY_COLORS[task.type] ?? '#94A3B8' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-900 leading-relaxed">{task.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" />{task.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {myGroups.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-slate-900 mt-6 mb-3">Mening guruhlarim</h3>
              <div className="flex flex-col gap-1.5">
                {myGroups.map((g) => (
                  <div key={g.groupName} className="flex items-center justify-between rounded-lg px-2.5 py-2">
                    <div>
                      <p className="text-[13px] font-medium text-slate-900">{g.groupName}</p>
                      <p className="text-[11px] text-slate-500">{g.subjectName}</p>
                    </div>
                    <span className="text-xs text-muted">{g.studentCount} talaba</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </PageContent>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[32px] font-bold tabular-nums">{value}</p>
      <p className="text-[11px] opacity-80 mt-0.5">{label}</p>
    </div>
  );
}
