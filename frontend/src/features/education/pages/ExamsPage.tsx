import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { ConfirmDialog } from '@/components/overlays';
import { useExamsList, useCreateExam, useUpdateExam, useDeleteExam } from '@/api/hooks/useExams';
import { useSubjects } from '@/api/hooks/useEducation';
import { useGroups } from '@/api/hooks/useCore';
import { useTeachersList } from '@/api/hooks/useTeachers';
import { ExamForm } from '../components/ExamForm';
import type { Exam, ExamStatus, ExamType, CreateExamDto } from '@/types/education';
import type { CreateExamFormData } from '../schemas/exam.schema';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const PAGE_TABS = [
  { id: 'sessions', label: 'Sessiyalar' },
  { id: 'calendar', label: 'Imtihonlar jadvali' },
  { id: 'tickets', label: 'Biletlar' },
  { id: 'vedomost', label: 'Vedomostlar' },
];

const STATUS_LABELS: Record<ExamStatus, { variant: 'success' | 'default' | 'info'; label: string }> = {
  active: { variant: 'success', label: 'Faol' },
  completed: { variant: 'default', label: 'Yakunlangan' },
  scheduled: { variant: 'info', label: 'Rejalashtirilgan' },
};

const TYPE_LABELS: Record<ExamType, { label: string; variant: 'info' | 'warning' }> = {
  midterm: { label: 'Oraliq', variant: 'info' },
  final: { label: 'Yakuniy', variant: 'warning' },
};

interface Ticket {
  id: number;
  number: number;
  questions: string[];
}

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

export function ExamsPage() {
  const [activeTab, setActiveTab] = useState('sessions');
  const [formOpen, setFormOpen] = useState(false);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [deleteExam, setDeleteExam] = useState<Exam | null>(null);

  const { data: subjectsData } = useSubjects();
  const { data: groupsData } = useGroups();
  const { data: teachersData } = useTeachersList({ page: 1, pageSize: 100 });
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();
  const deleteExamMutation = useDeleteExam();

  const subjects = (subjectsData?.data ?? []).map((s) => ({ id: s.id, name: s.name }));
  const groups = (groupsData ?? []).map((g) => ({ id: g.id, name: g.name }));
  const teachers = (teachersData?.data ?? []).map((t) => ({ id: t.id, fullName: t.fullName }));

  const handleCreate = (data: CreateExamFormData) => {
    const dto: CreateExamDto = { ...data, subjectId: Number(data.subjectId), groupId: Number(data.groupId), teacherId: Number(data.teacherId) };
    createExam.mutate(dto, { onSuccess: () => setFormOpen(false) });
  };

  const handleEdit = (data: CreateExamFormData) => {
    if (!editExam) return;
    updateExam.mutate(
      { id: editExam.id, data: { ...data, subjectId: Number(data.subjectId), groupId: Number(data.groupId), teacherId: Number(data.teacherId) } },
      { onSuccess: () => setEditExam(null) },
    );
  };

  const handleDelete = () => {
    if (!deleteExam) return;
    deleteExamMutation.mutate(deleteExam.id, { onSuccess: () => setDeleteExam(null) });
  };

  return (
    <PageContent>
      <PageHeader
        title="Imtihonlar"
        subtitle="Sessiyalar, jadval va natijalar"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Imtihonlar' }]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Yangi imtihon
          </Button>
        }
      />

      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'sessions' && <SessionsTab />}
        {activeTab === 'calendar' && (
          <CalendarTab
            onEdit={(exam) => setEditExam(exam)}
            onDelete={(exam) => setDeleteExam(exam)}
          />
        )}
        {activeTab === 'tickets' && <TicketsTab />}
        {activeTab === 'vedomost' && <VedomostTab />}
      </div>

      <ExamForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        subjects={subjects}
        groups={groups}
        teachers={teachers}
        loading={createExam.isPending}
      />

      <ExamForm
        open={!!editExam}
        onClose={() => setEditExam(null)}
        onSubmit={handleEdit}
        exam={editExam}
        subjects={subjects}
        groups={groups}
        teachers={teachers}
        loading={updateExam.isPending}
      />

      <ConfirmDialog
        open={!!deleteExam}
        onClose={() => setDeleteExam(null)}
        onConfirm={handleDelete}
        title="Imtihonni o'chirish"
        message={`"${deleteExam?.subjectName}" imtihonini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteExamMutation.isPending}
      />
    </PageContent>
  );
}

function SessionsTab() {
  const { data, isLoading } = useExamsList();
  const exams = data?.data ?? [];

  const sessions = useMemo(() => {
    const statusGroups: Record<ExamStatus, Exam[]> = { active: [], completed: [], scheduled: [] };
    exams.forEach((e) => { statusGroups[e.status].push(e); });
    return [
      { id: 1, name: 'Bahorgi sessiya 2025-2026', period: '15.05 — 30.06.2026', status: 'active' as ExamStatus, exams: statusGroups.active.length + statusGroups.completed.length, students: (statusGroups.active.length + statusGroups.completed.length) * 30 },
      { id: 2, name: 'Kuzgi sessiya 2025-2026', period: '20.12.2025 — 15.01.2026', status: 'completed' as ExamStatus, exams: statusGroups.completed.length, students: statusGroups.completed.length * 30 },
      { id: 3, name: 'Qayta topshirish (bahor)', period: '01.07 — 15.07.2026', status: 'scheduled' as ExamStatus, exams: statusGroups.scheduled.length, students: statusGroups.scheduled.length * 30 },
    ];
  }, [exams]);

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sessions.map((s) => {
        const cfg = STATUS_LABELS[s.status];
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

function CalendarTab({ onEdit, onDelete }: { onEdit: (exam: Exam) => void; onDelete: (exam: Exam) => void }) {
  const { data, isLoading } = useExamsList();
  const exams = data?.data ?? [];

  const examColumns: Column<Exam>[] = [
    { key: 'subjectName', header: 'Fan', render: (row) => <span className="text-[13.5px] font-medium text-slate-900">{row.subjectName}</span> },
    { key: 'groupName', header: 'Guruh', render: (row) => <span className="text-[12.5px] text-slate-600">{row.groupName}</span> },
    { key: 'examDate', header: 'Sana', render: (row) => <span className="text-[13px] text-slate-900 tabular-nums">{row.examDate}</span> },
    { key: 'room', header: 'Xona', render: (row) => <span className="text-[13px] text-slate-600">{'№'} {row.room}</span> },
    { key: 'teacherName', header: "O'qituvchi", render: (row) => <span className="text-[13px] text-slate-600">{row.teacherName}</span> },
    {
      key: 'type', header: 'Tur',
      render: (row) => {
        const cfg = TYPE_LABELS[row.type];
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
      },
    },
    {
      key: 'status', header: 'Holat',
      render: (row) => {
        const cfg = STATUS_LABELS[row.status];
        return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
      },
    },
    {
      key: 'actions', header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onEdit(row)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onDelete(row)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <Card noPadding>
      <DataTable data={exams} columns={examColumns} keyField="id" emptyMessage="Imtihonlar topilmadi" />
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
  const { data, isLoading } = useExamsList();
  const exams = data?.data ?? [];
  const firstExam = exams[0];

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const vedomostRows = exams.slice(0, 12).map((exam, i) => {
    const oral = 40 + (i * 3) % 11;
    const written = 38 + (i * 5) % 13;
    const test = 40 + (i * 7) % 11;
    const total = oral + written + test;
    const grade = total >= 135 ? 5 : total >= 120 ? 4 : total >= 100 ? 3 : 2;
    return { id: i + 1, student: exam.teacherName, ticket: (i % 9) + 1, oral, written, test, total, grade };
  });

  interface VedomostRow { id: number; student: string; ticket: number; oral: number; written: number; test: number; total: number; grade: number; }

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
        return <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-bold ${bg}`}>{row.grade}</span>;
      },
    },
    { key: 'sign', header: 'Imzo', render: () => <span className="text-xs italic text-slate-400">_______</span> },
  ];

  return (
    <Card noPadding>
      {firstExam && (
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-900">{firstExam.subjectName} — {firstExam.groupName}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Imtihon: {firstExam.examDate} &middot; O&apos;qituvchi: {firstExam.teacherName} &middot; Xona: {firstExam.room}
          </p>
        </div>
      )}
      <DataTable data={vedomostRows} columns={vedomostColumns} keyField="id" emptyMessage="Vedomost bo'sh" />
    </Card>
  );
}
