import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { generateName, rnum, pick, SUBJECTS, DEPARTMENTS } from '@/api/mock/shared-data';

// --- Types ---

interface Session {
  id: number;
  name: string;
  period: string;
  status: 'Faol' | 'Yakunlangan' | 'Rejalashtirilgan';
  exams: number;
  students: number;
}

interface Exam {
  id: number;
  subject: string;
  faculty: string;
  course: number;
  date: string;
  time: string;
  room: string;
  teacher: string;
  students: number;
  type: 'Yozma' | "Og'zaki" | 'Test' | 'Amaliy';
}

interface Ticket {
  id: number;
  number: number;
  questions: string[];
}

interface VedomostRow {
  id: number;
  student: string;
  ticket: number;
  oral: number;
  written: number;
  test: number;
  total: number;
  grade: number;
}

// --- Mock Data ---

const SESSIONS: Session[] = [
  { id: 1, name: 'Bahorgi sessiya 2025-2026', period: '15.05 — 30.06.2026', status: 'Faol', exams: 48, students: 2847 },
  { id: 2, name: 'Kuzgi sessiya 2025-2026', period: '20.12.2025 — 15.01.2026', status: 'Yakunlangan', exams: 52, students: 2912 },
  { id: 3, name: 'Qayta topshirish (bahor)', period: '01.07 — 15.07.2026', status: 'Rejalashtirilgan', exams: 0, students: 0 },
];

const EXAMS: Exam[] = [
  { id: 1, subject: 'Algoritmlar', faculty: 'Axborot texnologiyalari', course: 1, date: '22.05.2026', time: '09:00', room: '301', teacher: 'Karimov U.B.', students: 128, type: 'Yozma' },
  { id: 2, subject: "Ma'lumotlar bazasi", faculty: 'Axborot texnologiyalari', course: 2, date: '24.05.2026', time: '10:30', room: '204', teacher: 'Nazarova M.', students: 112, type: "Og'zaki" },
  { id: 3, subject: 'Iqtisodiy tahlil', faculty: 'Iqtisodiyot', course: 2, date: '26.05.2026', time: '09:00', room: 'Lab-2', teacher: 'Saidov R.', students: 94, type: 'Test' },
  { id: 4, subject: 'Moliya', faculty: 'Iqtisodiyot', course: 3, date: '28.05.2026', time: '14:00', room: '112', teacher: 'Xolmatov A.', students: 86, type: 'Yozma' },
  { id: 5, subject: "Tog'-kon ishi", faculty: "Tog'-kon ishi", course: 5, date: '30.05.2026', time: '09:00', room: 'Karyer', teacher: 'Rahimov S.', students: 74, type: 'Amaliy' },
  { id: 6, subject: 'Pedagogika', faculty: 'Pedagogika', course: 4, date: '02.06.2026', time: '10:00', room: '115', teacher: 'Hasanova D.', students: 68, type: "Og'zaki" },
];

const TICKET_QUESTIONS = [
  ['Algoritmlarning predmeti va vazifalari', 'Murakkablik nazariyasi', 'Amaliy masala'],
  ['Daraxt strukturalari va funksiyasi', 'Iqtisodiyot asoslari', 'Amaliy masala'],
  ['Tarmoq protokollari', 'OOP prinsiplari', 'Amaliy masala'],
  ["Ma'lumotlar bazasi normalashtirish", 'Algoritmlar klassifikatsiyasi', 'Amaliy masala'],
  ['Dasturlash paradigmalari', 'Operatsion tizimlar funksiyalari', 'Amaliy masala'],
  ['Kompilyator bosqichlari', 'Tarmoq topologiyalari', 'Amaliy masala'],
  ['Operatsion tizim arxitekturasi', 'Bulutli xizmatlar', 'Amaliy masala'],
  ['Veb-xavfsizlik asoslari', 'REST API dizayni', 'Amaliy masala'],
  ["Mashinaviy o'rganish kirish", 'Neyron tarmoqlar', 'Amaliy masala'],
];

const TICKETS: Ticket[] = TICKET_QUESTIONS.map((questions, i) => ({
  id: i + 1,
  number: i + 1,
  questions,
}));

const VEDOMOST_ROWS: VedomostRow[] = Array.from({ length: 12 }, (_, i) => {
  const name = generateName(i + 100);
  const oral = rnum(i + 31, 40, 50);
  const written = rnum(i + 32, 38, 50);
  const test = rnum(i + 33, 40, 50);
  const total = oral + written + test;
  const grade = total >= 135 ? 5 : total >= 120 ? 4 : total >= 100 ? 3 : 2;
  return { id: i + 1, student: name.full, ticket: (i % 9) + 1, oral, written, test, total, grade };
});

// --- Tab Config ---

const PAGE_TABS = [
  { id: 'sessions', label: 'Sessiyalar' },
  { id: 'calendar', label: 'Imtihonlar jadvali' },
  { id: 'tickets', label: 'Biletlar' },
  { id: 'vedomost', label: 'Vedomostlar' },
];

const SESSION_STATUS_MAP: Record<Session['status'], { variant: 'success' | 'default' | 'info'; label: string }> = {
  Faol: { variant: 'success', label: 'Faol' },
  Yakunlangan: { variant: 'default', label: 'Yakunlangan' },
  Rejalashtirilgan: { variant: 'info', label: 'Rejalashtirilgan' },
};

const EXAM_TYPE_MAP: Record<Exam['type'], 'info' | 'warning' | 'success' | 'default'> = {
  Yozma: 'info',
  "Og'zaki": 'warning',
  Test: 'success',
  Amaliy: 'default',
};

// --- Columns ---

const examColumns: Column<Exam>[] = [
  { key: 'subject', header: 'Fan', render: (row) => <span className="text-[13.5px] font-medium text-slate-900">{row.subject}</span> },
  { key: 'faculty', header: 'Fakultet', render: (row) => <span className="text-[12.5px] text-slate-600">{row.faculty}</span> },
  { key: 'course', header: 'Kurs', render: (row) => <span className="text-[13px] text-slate-600 tabular-nums">{row.course}-kurs</span> },
  { key: 'date', header: 'Sana', render: (row) => <span className="text-[13px] text-slate-900 tabular-nums">{row.date}</span> },
  { key: 'time', header: 'Vaqt', render: (row) => <span className="text-[13px] text-slate-600 tabular-nums">{row.time}</span> },
  { key: 'room', header: 'Xona', render: (row) => <span className="text-[13px] text-slate-600">{'№'} {row.room}</span> },
  { key: 'teacher', header: "O'qituvchi", render: (row) => <span className="text-[13px] text-slate-600">{row.teacher}</span> },
  {
    key: 'type', header: 'Tur',
    render: (row) => <Badge variant={EXAM_TYPE_MAP[row.type]}>{row.type}</Badge>,
  },
  { key: 'students', header: 'Talabalar', render: (row) => <span className="text-[13px] font-semibold text-slate-900 tabular-nums">{row.students}</span> },
];

const vedomostColumns: Column<VedomostRow>[] = [
  { key: 'idx', header: 'No', width: '50px', render: (_, index) => <span className="text-slate-500">{index + 1}</span> },
  { key: 'student', header: 'Talaba', render: (row) => <span className="font-medium text-slate-900">{row.student}</span> },
  { key: 'ticket', header: 'Bilet', render: (row) => <span className="text-slate-600">No {row.ticket}</span> },
  { key: 'oral', header: "Og'zaki", className: 'text-center', render: (row) => <span className="tabular-nums">{row.oral}</span> },
  { key: 'written', header: 'Yozma', className: 'text-center', render: (row) => <span className="tabular-nums">{row.written}</span> },
  { key: 'test', header: 'Test', className: 'text-center', render: (row) => <span className="tabular-nums">{row.test}</span> },
  {
    key: 'grade', header: 'Baho',
    render: (row) => {
      const bg = row.grade >= 5 ? 'bg-green-100 text-green-800' : row.grade === 4 ? 'bg-emerald-50 text-emerald-700' : row.grade === 3 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';
      return (
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-bold ${bg}`}>
          {row.grade}
        </span>
      );
    },
  },
  { key: 'sign', header: 'Imzo', render: () => <span className="text-xs italic text-slate-400">_______</span> },
];

// --- Component ---

export function ExamsPage() {
  const [activeTab, setActiveTab] = useState('sessions');

  return (
    <PageContent>
      <PageHeader
        title="Imtihonlar"
        subtitle="Sessiyalar, jadval va natijalar"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Imtihonlar' }]}
      />

      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'sessions' && <SessionsTab />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'tickets' && <TicketsTab />}
        {activeTab === 'vedomost' && <VedomostTab />}
      </div>
    </PageContent>
  );
}

function SessionsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {SESSIONS.map((s) => {
        const cfg = SESSION_STATUS_MAP[s.status];
        return (
          <Card key={s.id}>
            <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
            <h3 className="mt-3 text-[15px] font-semibold text-slate-900 leading-snug">{s.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{s.period}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div>
                <p className="text-[11px] text-slate-400">Imtihonlar</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">{s.exams}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Talabalar</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">{s.students.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function CalendarTab() {
  return (
    <Card noPadding>
      <DataTable data={EXAMS} columns={examColumns} keyField="id" emptyMessage="Imtihonlar topilmadi" />
    </Card>
  );
}

function TicketsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TICKETS.map((t) => (
        <Card key={t.id}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-700">
              No {t.number}
            </div>
            <span className="text-[13px] font-semibold text-slate-900">Bilet {t.number}</span>
          </div>
          <div className="space-y-1 text-xs text-slate-500 leading-relaxed">
            {t.questions.map((q, qi) => (
              <div key={qi}>
                <span className="font-semibold text-slate-700">{qi + 1}.</span> {q}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function VedomostTab() {
  const subject = pick(SUBJECTS, 1);
  const teacher = generateName(200);
  const dept = pick(DEPARTMENTS, 3);

  return (
    <Card noPadding>
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-semibold text-slate-900">{subject} — 301-A guruhi</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Imtihon: 22.05.2026 &middot; O&apos;qituvchi: {teacher.short} &middot; Kafedra: {dept}
        </p>
      </div>
      <DataTable data={VEDOMOST_ROWS} columns={vedomostColumns} keyField="id" emptyMessage="Vedomost bo'sh" />
    </Card>
  );
}
