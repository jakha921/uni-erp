import { PageContent, PageHeader } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Spinner } from '@/components/ui';
import { GraduationCap, CreditCard, BookOpen, FileText } from 'lucide-react';
import { useStudentCabinet } from '@/api/hooks/useCabinet';

const QUICK_ACTIONS = [
  { icon: FileText, label: 'Spravka olish', description: 'Elektron ariza', color: '#2DB976' },
  { icon: GraduationCap, label: 'Test topshirish', description: 'Joriy testlar', color: '#3B82F6' },
  { icon: CreditCard, label: "To'lov tarixi", description: 'Kontrakt holati', color: '#F59E0B' },
  { icon: BookOpen, label: 'Xabarlar', description: 'Bildirishnomalar', color: '#8B5CF6' },
] as const;

const LESSON_VARIANT: Record<string, 'info' | 'success' | 'warning'> = {
  lecture: 'info',
  practice: 'success',
  lab: 'warning',
  seminar: 'info',
};

const LESSON_LABELS: Record<string, string> = {
  lecture: "Ma'ruza",
  practice: 'Amaliyot',
  lab: 'Laboratoriya',
  seminar: 'Seminar',
};

export function StudentCabinetPage() {
  const { data, isLoading } = useStudentCabinet();

  if (isLoading || !data) {
    return <PageContent><div className="flex justify-center py-20"><Spinner size="lg" /></div></PageContent>;
  }

  const { student, todaySchedule, currentGrades } = data;

  return (
    <PageContent>
      <PageHeader
        title="Talaba kabineti"
        breadcrumbs={[{ label: 'Kabinetlar' }, { label: 'Talaba kabineti' }]}
      />

      <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-6 text-white flex items-center gap-5 mb-5">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white/20 text-[26px] font-bold">
          {student.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider opacity-85">Xush kelibsiz</p>
          <h2 className="mt-1 text-2xl font-bold">{student.fullName}</h2>
          <p className="mt-1 text-[13px] opacity-90">
            {student.group} guruh &middot; {student.course}-kurs
          </p>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <StatBlock value={String(student.gpa)} label="O'rtacha ball" />
          <div className="h-10 w-px bg-white/30" />
          <StatBlock value={String(student.totalCredits)} label="Kreditlar" />
          <div className="h-10 w-px bg-white/30" />
          <StatBlock value={`${student.attendanceRate}%`} label="Davomat" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-white p-[18px] text-left hover:shadow-md transition-shadow"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${action.color}15`, color: action.color }}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <p className="text-[13px] font-semibold text-slate-900">{action.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Bugungi dars jadvali</h3>
              <p className="text-xs text-slate-500 mt-0.5">{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <Badge variant="success" dot>{todaySchedule.length} ta dars</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {todaySchedule.map((cls, i) => {
              const pairTimes = ['08:30', '10:10', '12:00', '13:40', '15:20'];
              const time = pairTimes[cls.pairNumber - 1] ?? `${cls.pairNumber}-para`;
              return (
                <div
                  key={cls.id}
                  className={`flex items-center gap-3.5 rounded-xl p-3 ${
                    i === 0 ? 'bg-green-50 border border-green-200' : 'bg-[#F8FAFB] border border-transparent'
                  }`}
                >
                  <div className="w-14 text-center">
                    <span className="text-base font-bold text-slate-900 tabular-nums">{time}</span>
                  </div>
                  <div className="h-9 w-px bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-slate-900">{cls.subjectName}</p>
                    <p className="text-[11.5px] text-slate-500 mt-0.5">{cls.teacherName} &middot; {cls.room}</p>
                  </div>
                  <Badge variant={LESSON_VARIANT[cls.lessonType] ?? 'info'}>
                    {LESSON_LABELS[cls.lessonType] ?? cls.lessonType}
                  </Badge>
                </div>
              );
            })}
            {todaySchedule.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-6">Bugun darslar yo'q</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Joriy semestr baholari</h3>
          <div className="flex flex-col gap-1.5">
            {currentGrades.map((g) => (
              <div key={g.subject} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
                <p className="flex-1 text-[13px] font-medium text-slate-900">{g.subject}</p>
                <div className="h-1 w-20 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${g.total}%`,
                      backgroundColor: g.total >= 90 ? '#2DB976' : g.total >= 80 ? '#3B82F6' : '#F59E0B',
                    }}
                  />
                </div>
                <span className="min-w-[30px] text-right text-sm font-bold text-slate-900 tabular-nums">{g.total}</span>
              </div>
            ))}
          </div>
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
