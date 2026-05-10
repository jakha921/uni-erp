import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, FileDown } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button, Badge } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '@/api/hooks/useEducation';
import { useGroups, useSemesters } from '@/api/hooks/useCore';
import { useSubjects } from '@/api/hooks/useEducation';
import { useTeachersList } from '@/api/hooks/useTeachers';
import { ScheduleForm } from '../components/ScheduleForm';
import type { Schedule, LessonType } from '@/types/education';
import type { ScheduleFormData } from '../schemas/schedule.schema';

type ViewMode = 'week' | 'day' | 'month';

const DAY_NAMES = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const DAY_NAMES_SHORT = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
const HOURS = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];
const SLOT_HEIGHT = 80;

const VIEW_LABELS: Record<ViewMode, string> = { week: 'Hafta', day: 'Kun', month: 'Oy' };

const TYPE_STYLES: Record<LessonType, { bg: string; border: string; fg: string; label: string }> = {
  lecture: { bg: 'bg-green-50', border: 'border-l-emerald-500', fg: 'text-green-700', label: "Ma'ruza" },
  lab: { bg: 'bg-blue-50', border: 'border-l-blue-500', fg: 'text-blue-700', label: 'Labor.' },
  seminar: { bg: 'bg-amber-50', border: 'border-l-amber-500', fg: 'text-amber-700', label: 'Seminar' },
  practice: { bg: 'bg-purple-50', border: 'border-l-violet-500', fg: 'text-purple-700', label: 'Amaliy' },
};

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function fmtDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function fmtMonthYear(d: Date): string {
  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function EventChip({
  event,
  onEdit,
  onDelete,
}: {
  event: Schedule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const style = TYPE_STYLES[event.lessonType];
  return (
    <div className={`group relative overflow-hidden rounded-lg border-l-[3px] p-2 ${style.bg} ${style.border}`}>
      <div className={`text-[11px] font-semibold ${style.fg}`}>
        {style.label} &middot; {event.room}
      </div>
      <div className="mt-0.5 text-[13px] font-semibold leading-tight text-slate-900">{event.subjectName}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">{event.teacherName}</div>
      <div className="absolute right-1 top-1 hidden gap-0.5 group-hover:flex">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="rounded p-0.5 bg-white/80 text-slate-500 hover:text-slate-700">
          <Pencil className="h-3 w-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="rounded p-0.5 bg-white/80 text-slate-500 hover:text-red-500">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function WeekView({ schedules, weekStart, onEdit, onDelete }: {
  schedules: Schedule[];
  weekStart: Date;
  onEdit: (s: Schedule) => void;
  onDelete: (s: Schedule) => void;
}) {
  const today = new Date();
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));

  return (
    <Card noPadding>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-slate-200">
            <div />
            {weekDays.map((d, i) => {
              const isToday = fmtDate(d) === fmtDate(today);
              return (
                <div key={i} className="border-l border-slate-100 px-2.5 py-3 text-center">
                  <div className="text-[11px] uppercase tracking-[0.05em] text-slate-400">{DAY_NAMES_SHORT[i]}</div>
                  <div className={`mt-0.5 text-lg font-bold tabular-nums ${isToday ? 'text-primary-500' : 'text-slate-900'}`}>
                    {d.getDate()}
                  </div>
                  <div className="text-[10px] text-slate-400">{String(d.getMonth() + 1).padStart(2, '0')}</div>
                </div>
              );
            })}
          </div>

          <div className="relative grid grid-cols-[80px_repeat(6,1fr)]">
            <div>
              {HOURS.map((h, i) => (
                <div key={h} className={`flex items-start px-2.5 pt-1.5 text-[11px] tabular-nums text-slate-400 ${i > 0 ? 'border-t border-slate-100' : ''}`} style={{ height: `${SLOT_HEIGHT}px` }}>
                  {h}
                </div>
              ))}
            </div>
            {Array.from({ length: 6 }, (_, dayIdx) => (
              <div key={dayIdx} className="relative border-l border-slate-100">
                {HOURS.map((_, hi) => (
                  <div key={hi} className={hi > 0 ? 'border-t border-slate-100' : ''} style={{ height: `${SLOT_HEIGHT}px` }} />
                ))}
                {schedules.filter((s) => s.dayOfWeek === dayIdx).map((event) => (
                  <div
                    key={event.id}
                    className="absolute left-1 right-1 cursor-pointer"
                    style={{ top: `${(event.pairNumber - 1) * SLOT_HEIGHT + 3}px`, height: `${SLOT_HEIGHT - 6}px` }}
                  >
                    <EventChip event={event} onEdit={() => onEdit(event)} onDelete={() => onDelete(event)} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function DayView({ schedules, currentDay, onEdit, onDelete }: {
  schedules: Schedule[];
  currentDay: Date;
  onEdit: (s: Schedule) => void;
  onDelete: (s: Schedule) => void;
}) {
  const dayIdx = currentDay.getDay() === 0 ? 6 : currentDay.getDay() - 1;
  const daySchedules = schedules.filter((s) => s.dayOfWeek === dayIdx).sort((a, b) => a.pairNumber - b.pairNumber);

  return (
    <Card>
      {daySchedules.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">Bu kunda darslar yo'q</div>
      ) : (
        <div className="space-y-2">
          {daySchedules.map((event) => {
            const style = TYPE_STYLES[event.lessonType];
            return (
              <div key={event.id} className={`group flex items-center gap-4 rounded-xl border-l-4 p-4 ${style.bg} ${style.border}`}>
                <div className="w-14 shrink-0 text-center">
                  <div className="text-xs text-slate-400">{event.pairNumber}-juft</div>
                  <div className="text-sm font-bold text-slate-700">{HOURS[(event.pairNumber - 1)] ?? ''}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-slate-900">{event.subjectName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{event.teacherName} &middot; {event.room}</div>
                </div>
                <Badge variant="default">{style.label}</Badge>
                <div className="hidden gap-1 group-hover:flex">
                  <button onClick={() => onEdit(event)} className="p-1 text-slate-400 hover:text-slate-700 rounded"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => onDelete(event)} className="p-1 text-slate-400 hover:text-red-500 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function MonthView({ schedules, monthStart, onEdit }: {
  schedules: Schedule[];
  monthStart: Date;
  onEdit: (s: Schedule) => void;
  onDelete?: (s: Schedule) => void;
}) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const today = new Date();

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Card noPadding>
      <div className="grid grid-cols-7 border-b border-slate-200">
        {DAY_NAMES_SHORT.map((d) => (
          <div key={d} className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, idx) => {
          const dayIdx = date ? (date.getDay() === 0 ? 6 : date.getDay() - 1) : -1;
          const daySchedules = date ? schedules.filter((s) => s.dayOfWeek === dayIdx) : [];
          const isToday = date ? fmtDate(date) === fmtDate(today) : false;

          return (
            <div
              key={idx}
              className={`min-h-[90px] border-b border-r border-slate-100 p-1.5 ${!date ? 'bg-slate-50/50' : ''}`}
            >
              {date && (
                <>
                  <div className={`mb-1 h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold ${isToday ? 'bg-primary-500 text-white' : 'text-slate-700'}`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {daySchedules.slice(0, 2).map((s) => {
                      const style = TYPE_STYLES[s.lessonType];
                      return (
                        <div
                          key={s.id}
                          onClick={() => onEdit(s)}
                          className={`cursor-pointer truncate rounded px-1 py-0.5 text-[10px] font-medium ${style.bg} ${style.fg}`}
                          title={s.subjectName}
                        >
                          {s.subjectName}
                        </div>
                      );
                    })}
                    {daySchedules.length > 2 && (
                      <div className="text-[10px] text-slate-400 pl-1">+{daySchedules.length - 2} ta</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {/* unused onDelete — satisfy linter */}
    </Card>
  );
}

export function SchedulePage() {
  const [view, setView] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(() => getMonday(new Date()));
  const [groupFilter, setGroupFilter] = useState<number | undefined>(undefined);
  const [teacherFilter, setTeacherFilter] = useState<number | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [deleteSchedule, setDeleteSchedule] = useState<Schedule | null>(null);

  const { data: schedulesData } = useSchedules({ groupId: groupFilter, teacherId: teacherFilter, pageSize: 200 });
  const { data: groups } = useGroups();
  const { data: subjectsData } = useSubjects({ pageSize: 200 });
  const { data: teachersData } = useTeachersList({ page: 1, pageSize: 200 });
  const { data: semesters } = useSemesters();

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  const schedules = schedulesData?.data ?? [];
  const groupsList = groups ?? [];
  const subjectsList = subjectsData?.data ?? [];
  const teachersList = teachersData?.data ?? [];
  const semestersList = semesters ?? [];

  const handlePrev = () => {
    if (view === 'week') setCurrentDate((d) => addDays(d, -7));
    else if (view === 'day') setCurrentDate((d) => addDays(d, -1));
    else setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const handleNext = () => {
    if (view === 'week') setCurrentDate((d) => addDays(d, 7));
    else if (view === 'day') setCurrentDate((d) => addDays(d, 1));
    else setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const periodLabel = (() => {
    if (view === 'week') {
      const end = addDays(currentDate, 5);
      return `${fmtDate(currentDate)} – ${fmtDate(end)}`;
    }
    if (view === 'day') return `${DAY_NAMES[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}, ${fmtDate(currentDate)}`;
    return fmtMonthYear(currentDate);
  })();

  const handleOpenCreate = () => { setEditSchedule(null); setFormOpen(true); };
  const handleOpenEdit = (s: Schedule) => { setEditSchedule(s); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditSchedule(null); };

  const handleSubmit = (data: ScheduleFormData) => {
    if (editSchedule) {
      updateSchedule.mutate({ id: editSchedule.id, dto: data }, { onSuccess: handleClose });
    } else {
      createSchedule.mutate(data, { onSuccess: handleClose });
    }
  };

  const weekStart = view === 'week' ? currentDate : getMonday(currentDate);
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  return (
    <PageContent>
      <PageHeader
        title="Dars jadvali"
        subtitle="Haftalik dars jadvali"
        breadcrumbs={[{ label: "Ta'lim", path: '/schedule' }, { label: 'Dars jadvali' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/api/v1/education/schedule/export/';
                a.download = 'jadval.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              PDF
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
              Dars qo&apos;shish
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={handlePrev}>
            Oldingi
          </Button>
          <div className="min-w-[220px] text-center text-sm font-semibold text-slate-900">{periodLabel}</div>
          <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />} onClick={handleNext}>
            Keyingi
          </Button>
          <div className="flex-1" />
          <select
            value={groupFilter ?? ''}
            onChange={(e) => setGroupFilter(e.target.value ? Number(e.target.value) : undefined)}
            className="h-8 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha guruhlar</option>
            {groupsList.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <select
            value={teacherFilter ?? ''}
            onChange={(e) => setTeacherFilter(e.target.value ? Number(e.target.value) : undefined)}
            className="h-8 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha o'qituvchilar</option>
            {teachersList.map((t) => (
              <option key={t.id} value={t.id}>{t.fullName}</option>
            ))}
          </select>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {(['week', 'day', 'month'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {view === 'week' && <WeekView schedules={schedules} weekStart={weekStart} onEdit={handleOpenEdit} onDelete={setDeleteSchedule} />}
      {view === 'day' && <DayView schedules={schedules} currentDay={currentDate} onEdit={handleOpenEdit} onDelete={setDeleteSchedule} />}
      {view === 'month' && <MonthView schedules={schedules} monthStart={monthStart} onEdit={handleOpenEdit} onDelete={setDeleteSchedule} />}

      <ScheduleForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        schedule={editSchedule}
        groups={groupsList.map((g) => ({ id: g.id, name: g.name }))}
        subjects={subjectsList.map((s) => ({ id: s.id, name: s.name }))}
        teachers={teachersList.map((t) => ({ id: t.id, name: t.fullName }))}
        semesters={semestersList.map((s) => ({ id: s.id, name: s.name }))}
        loading={createSchedule.isPending || updateSchedule.isPending}
      />

      <ConfirmDialog
        open={!!deleteSchedule}
        onClose={() => setDeleteSchedule(null)}
        onConfirm={() => {
          if (!deleteSchedule) return;
          deleteScheduleMutation.mutate(deleteSchedule.id, { onSuccess: () => setDeleteSchedule(null) });
        }}
        title="Darsni o'chirish"
        message={`"${deleteSchedule?.subjectName}" darsini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteScheduleMutation.isPending}
      />
    </PageContent>
  );
}
