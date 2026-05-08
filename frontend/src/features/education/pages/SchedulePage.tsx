import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Button } from '@/components/ui';

type ViewMode = 'week' | 'day' | 'month';
type EventType = 'lecture' | 'practice' | 'lab' | 'seminar';

interface ScheduleEvent {
  day: number;
  hour: number;
  duration: number;
  subject: string;
  teacher: string;
  room: string;
  type: EventType;
}

const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const DATES = ['21.04', '22.04', '23.04', '24.04', '25.04', '26.04'];
const HOURS = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];

const EVENTS: ScheduleEvent[] = [
  { day: 0, hour: 0, duration: 1, subject: 'Algoritmlar', teacher: 'Karimov U.B.', room: '301', type: 'lecture' },
  { day: 0, hour: 1, duration: 1, subject: "Ma'lumotlar bazasi", teacher: 'Nazarova M.', room: '204', type: 'lab' },
  { day: 0, hour: 3, duration: 1, subject: 'Tarmoqlar', teacher: 'Saidov R.', room: 'Lab-2', type: 'lab' },
  { day: 1, hour: 0, duration: 1, subject: 'Veb-dasturlash', teacher: 'Xolmatov A.', room: '112', type: 'lecture' },
  { day: 1, hour: 2, duration: 1, subject: 'Iqtisodiyot nazariyasi', teacher: 'Yusupov J.', room: '301', type: 'seminar' },
  { day: 2, hour: 1, duration: 2, subject: 'Ishlab chiqarish amaliyoti', teacher: 'Rahimov S.', room: 'Lab-A', type: 'practice' },
  { day: 2, hour: 4, duration: 1, subject: 'Algoritmlar', teacher: 'Karimov U.B.', room: '301', type: 'lecture' },
  { day: 3, hour: 0, duration: 1, subject: "Ma'lumotlar bazasi", teacher: 'Nazarova M.', room: '204', type: 'lecture' },
  { day: 3, hour: 2, duration: 1, subject: 'Diskret matematika', teacher: 'Tursunova F.', room: 'Lab-3', type: 'lab' },
  { day: 4, hour: 1, duration: 1, subject: 'Operatsion tizimlar', teacher: 'Ergashev B.', room: '208', type: 'seminar' },
  { day: 4, hour: 3, duration: 1, subject: 'Iqtisodiyot nazariyasi', teacher: 'Yusupov J.', room: '301', type: 'lecture' },
  { day: 5, hour: 0, duration: 1, subject: 'Pedagogika', teacher: 'Hasanova D.', room: '115', type: 'lecture' },
];

const TYPE_STYLES: Record<EventType, { bg: string; border: string; fg: string; label: string }> = {
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

  return (
    <PageContent>
      <PageHeader
        title="Dars jadvali"
        subtitle="Haftalik dars jadvali"
        breadcrumbs={[
          { label: "Ta'lim", path: '/schedule' },
          { label: 'Dars jadvali' },
        ]}
      />

      {/* Toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Oldingi
          </Button>
          <div className="min-w-[220px] text-center text-sm font-semibold text-slate-900">
            21 – 26 Aprel, 2026
          </div>
          <Button
            variant="secondary"
            size="sm"
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Keyingi
          </Button>
          <div className="flex-1" />
          <select className="h-8 rounded-lg border border-border px-3 text-sm">
            <option>301-A guruhi</option>
            <option>301-B guruhi</option>
            <option>Karimov U.B.</option>
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
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Dars qo&apos;shish
          </Button>
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
                <div
                  key={d}
                  className="border-l border-[#F1F5F9] px-2.5 py-3 text-center"
                >
                  <div className="text-[11px] uppercase tracking-[0.05em] text-muted">
                    {d}
                  </div>
                  <div
                    className={`mt-0.5 text-lg font-bold tabular-nums ${
                      i === 4 ? 'text-primary-500' : 'text-slate-900'
                    }`}
                  >
                    {DATES[i]}
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
                    className={`flex h-[${SLOT_HEIGHT}px] items-start px-2.5 pt-1.5 text-[11px] tabular-nums text-muted ${
                      i > 0 ? 'border-t border-[#F1F5F9]' : ''
                    }`}
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
                    <div
                      key={hi}
                      className={`${hi > 0 ? 'border-t border-[#F1F5F9]' : ''}`}
                      style={{ height: `${SLOT_HEIGHT}px` }}
                    />
                  ))}

                  {/* Events overlay */}
                  {EVENTS.filter((e) => e.day === dayIdx).map((event, eIdx) => {
                    const style = TYPE_STYLES[event.type];
                    return (
                      <div
                        key={eIdx}
                        className={`absolute left-1 right-1 cursor-pointer overflow-hidden rounded-lg border-l-[3px] p-2 ${style.bg} ${style.border}`}
                        style={{
                          top: `${event.hour * SLOT_HEIGHT + 3}px`,
                          height: `${event.duration * SLOT_HEIGHT - 6}px`,
                        }}
                      >
                        <div className={`text-[11px] font-semibold ${style.fg}`}>
                          {style.label} &middot; {event.room}
                        </div>
                        <div className="mt-0.5 text-[13px] font-semibold leading-tight text-slate-900">
                          {event.subject}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted">
                          {event.teacher}
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
    </PageContent>
  );
}
