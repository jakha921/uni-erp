import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '@/api/hooks/useEducation';
import { useGroups, useSemesters } from '@/api/hooks/useCore';
import { useSubjects } from '@/api/hooks/useEducation';
import { useTeachersList } from '@/api/hooks/useTeachers';
import { ScheduleForm } from '../components/ScheduleForm';
import type { Schedule, LessonType } from '@/types/education';
import type { ScheduleFormData } from '../schemas/schedule.schema';

type ViewMode = 'week' | 'day' | 'month';

const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const HOURS = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];

const TYPE_STYLES: Record<LessonType, { bg: string; border: string; fg: string; label: string }> = {
  lecture: { bg: 'bg-green-50', border: 'border-l-emerald-500', fg: 'text-green-700', label: "Maʼruza" },
  lab: { bg: 'bg-blue-50', border: 'border-l-blue-500', fg: 'text-blue-700', label: 'Labor.' },
  seminar: { bg: 'bg-amber-50', border: 'border-l-amber-500', fg: 'text-amber-700', label: 'Seminar' },
  practice: { bg: 'bg-purple-50', border: 'border-l-violet-500', fg: 'text-purple-700', label: 'Amaliy' },
};

const VIEW_LABELS: Record<ViewMode, string> = {
  week: 'Hafta',
  day: 'Kun',
  month: 'Oy',
};

const SLOT_HEIGHT = 80;

export function SchedulePage() {
  const [view, setView] = useState<ViewMode>('week');
  const [groupFilter, setGroupFilter] = useState<number | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [deleteSchedule, setDeleteSchedule] = useState<Schedule | null>(null);

  const { data: schedulesData } = useSchedules({ groupId: groupFilter, pageSize: 200 });
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

  return (
    <PageContent>
      <PageHeader
        title="Dars jadvali"
        subtitle="Haftalik dars jadvali"
        breadcrumbs={[
          { label: "Ta'lim", path: '/schedule' },
          { label: 'Dars jadvali' },
        ]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
            Dars qo&apos;shish
          </Button>
        }
      />

      {/* Toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Oldingi
          </Button>
          <div className="min-w-[220px] text-center text-sm font-semibold text-slate-900">
            Haftalik jadval
          </div>
          <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
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
          {/* View toggle */}
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {(['week', 'day', 'month'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === v
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-muted hover:text-slate-700'
                }`}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Calendar grid */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day headers */}
            <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-slate-200">
              <div />
              {DAYS.map((d, i) => (
                <div key={d} className="border-l border-[#F1F5F9] px-2.5 py-3 text-center">
                  <div className="text-[11px] uppercase tracking-[0.05em] text-muted">{d}</div>
                  <div className={`mt-0.5 text-lg font-bold tabular-nums ${i === 4 ? 'text-primary-500' : 'text-slate-900'}`}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid + events */}
            <div className="relative grid grid-cols-[80px_repeat(6,1fr)]">
              {/* Time column */}
              <div>
                {HOURS.map((h, i) => (
                  <div
                    key={h}
                    className={`flex items-start px-2.5 pt-1.5 text-[11px] tabular-nums text-muted ${i > 0 ? 'border-t border-[#F1F5F9]' : ''}`}
                    style={{ height: `${SLOT_HEIGHT}px` }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((_, dayIdx) => (
                <div key={dayIdx} className="relative border-l border-[#F1F5F9]">
                  {/* Grid lines */}
                  {HOURS.map((_, hi) => (
                    <div key={hi} className={hi > 0 ? 'border-t border-[#F1F5F9]' : ''} style={{ height: `${SLOT_HEIGHT}px` }} />
                  ))}

                  {/* Events from API */}
                  {schedules
                    .filter((s) => s.dayOfWeek === dayIdx)
                    .map((event) => {
                      const style = TYPE_STYLES[event.lessonType];
                      const slotIdx = event.pairNumber - 1;
                      return (
                        <div
                          key={event.id}
                          className={`group absolute left-1 right-1 cursor-pointer overflow-hidden rounded-lg border-l-[3px] p-2 ${style.bg} ${style.border}`}
                          style={{
                            top: `${slotIdx * SLOT_HEIGHT + 3}px`,
                            height: `${SLOT_HEIGHT - 6}px`,
                          }}
                        >
                          <div className={`text-[11px] font-semibold ${style.fg}`}>
                            {style.label} &middot; {event.room}
                          </div>
                          <div className="mt-0.5 text-[13px] font-semibold leading-tight text-slate-900">
                            {event.subjectName}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted">{event.teacherName}</div>
                          <div className="absolute right-1 top-1 hidden gap-0.5 group-hover:flex">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenEdit(event); }}
                              className="rounded p-0.5 bg-white/80 text-slate-500 hover:text-slate-700"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteSchedule(event); }}
                              className="rounded p-0.5 bg-white/80 text-slate-500 hover:text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

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
