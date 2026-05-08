import { PageContent, PageHeader } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge } from '@/components/ui';
import {
  GraduationCap,
  CreditCard,
  BookOpen,
  FileText,
} from 'lucide-react';

// --- Types ---

interface ScheduleItem {
  time: string;
  subject: string;
  room: string;
  teacher: string;
  type: 'Ma\'ruza' | 'Amaliyot' | 'Laboratoriya';
}

interface GradeItem {
  subject: string;
  grade: number;
  status: string;
}

// --- Mock Data ---

const STUDENT = {
  name: 'Karimov Sherzod',
  initials: 'KS',
  faculty: 'Axborot texnologiyalari',
  course: 3,
  group: '301-A',
  id: 'STU-2024-0847',
  gpa: 3.92,
  credits: 147,
  attendance: 94,
};

const TODAY_SCHEDULE: ScheduleItem[] = [
  { time: '08:30', subject: 'Algoritmlar', room: 'A-204', teacher: 'prof. Tursunov R.M.', type: 'Ma\'ruza' },
  { time: '10:10', subject: 'Ma\'lumotlar bazasi', room: 'B-115', teacher: 'dots. Saidov A.B.', type: 'Amaliyot' },
  { time: '12:00', subject: 'Veb-dasturlash', room: 'A-301', teacher: 'dots. Nazarov H.S.', type: 'Ma\'ruza' },
  { time: '13:40', subject: 'Tarmoqlar', room: 'C-208', teacher: 'dots. Hasanov B.O.', type: 'Laboratoriya' },
];

const RECENT_GRADES: GradeItem[] = [
  { subject: 'Algoritmlar', grade: 92, status: 'A\'lo' },
  { subject: 'Ma\'lumotlar bazasi', grade: 88, status: 'Yaxshi' },
  { subject: 'Veb-dasturlash', grade: 95, status: 'A\'lo' },
  { subject: 'Tarmoqlar', grade: 78, status: 'Yaxshi' },
];

const QUICK_ACTIONS = [
  { icon: FileText, label: 'Spravka olish', description: 'Elektron ariza', color: '#2DB976' },
  { icon: GraduationCap, label: 'Test topshirish', description: 'Joriy testlar', color: '#3B82F6' },
  { icon: CreditCard, label: "To'lov tarixi", description: 'Kontrakt holati', color: '#F59E0B', notifCount: 0 },
  { icon: BookOpen, label: 'Xabarlar', description: 'Bildirishnomalar', color: '#8B5CF6', notifCount: 3 },
] as const;

const TYPE_VARIANT: Record<ScheduleItem['type'], 'info' | 'success' | 'warning'> = {
  'Ma\'ruza': 'info',
  Amaliyot: 'success',
  Laboratoriya: 'warning',
};

// --- Component ---

export function StudentCabinetPage() {
  return (
    <PageContent>
      <PageHeader
        title="Talaba kabineti"
        breadcrumbs={[{ label: 'Kabinetlar' }, { label: 'Talaba kabineti' }]}
      />

      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-6 text-white flex items-center gap-5 mb-5">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white/20 text-[26px] font-bold">
          {STUDENT.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider opacity-85">Xush kelibsiz</p>
          <h2 className="mt-1 text-2xl font-bold">{STUDENT.name}</h2>
          <p className="mt-1 text-[13px] opacity-90">
            {STUDENT.faculty} &middot; {STUDENT.course}-kurs &middot; {STUDENT.group} guruh &middot; ID: {STUDENT.id}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <StatBlock value={String(STUDENT.gpa)} label="O'rtacha GPA" />
          <div className="h-10 w-px bg-white/30" />
          <StatBlock value={String(STUDENT.credits)} label="Kreditlar" />
          <div className="h-10 w-px bg-white/30" />
          <StatBlock value={`${STUDENT.attendance}%`} label="Davomat" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-white p-[18px] text-left hover:shadow-md transition-shadow"
          >
            <div
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${action.color}15`, color: action.color }}
            >
              <action.icon className="h-5 w-5" />
              {'notifCount' in action && action.notifCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                  {action.notifCount}
                </span>
              )}
            </div>
            <p className="text-[13px] font-semibold text-slate-900">{action.label}</p>
          </button>
        ))}
      </div>

      {/* Today's Schedule + Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        {/* Today's Schedule */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Bugungi dars jadvali</h3>
              <p className="text-xs text-slate-500 mt-0.5">Chorshanba, 24 aprel 2026</p>
            </div>
            <Badge variant="success" dot>
              {TODAY_SCHEDULE.length} ta dars
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {TODAY_SCHEDULE.map((cls, i) => (
              <div
                key={cls.time}
                className={`flex items-center gap-3.5 rounded-xl p-3 ${
                  i === 0
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-[#F8FAFB] border border-transparent'
                }`}
              >
                <div className="w-14 text-center">
                  <span className="text-base font-bold text-slate-900 tabular-nums">{cls.time}</span>
                </div>
                <div className="h-9 w-px bg-slate-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-900">{cls.subject}</p>
                  <p className="text-[11.5px] text-slate-500 mt-0.5">
                    {cls.teacher} &middot; {cls.room}
                  </p>
                </div>
                <Badge variant={TYPE_VARIANT[cls.type]}>{cls.type}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Grades */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Joriy semestr baholari</h3>
          <div className="flex flex-col gap-1.5">
            {RECENT_GRADES.map((g) => (
              <div key={g.subject} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
                <p className="flex-1 text-[13px] font-medium text-slate-900">{g.subject}</p>
                <div className="h-1 w-20 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${g.grade}%`,
                      backgroundColor:
                        g.grade >= 90 ? '#2DB976' : g.grade >= 80 ? '#3B82F6' : '#F59E0B',
                    }}
                  />
                </div>
                <span className="min-w-[30px] text-right text-sm font-bold text-slate-900 tabular-nums">
                  {g.grade}
                </span>
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
