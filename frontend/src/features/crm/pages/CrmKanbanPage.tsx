import { useState, useCallback } from 'react';
import { Calendar, User, Plus, LayoutGrid, BarChart3, Filter } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Avatar, Badge, Button } from '@/components/ui';
import type { Lead, LeadStatus, LeadSource } from '@/types/crm';
import { generateName, generatePhone, pick, rnum, DIRECTIONS } from '@/api/mock/shared-data';
import { cn } from '@/lib/utils';

const CRM_STATUSES: LeadStatus[] = ['Yangi', "Qo'ng'iroq", 'Kutilmoqda', 'Qabul', 'Rad'];
const CRM_SOURCES: LeadSource[] = ['Website', 'Telegram', 'Instagram', 'Referral'];
const ASSIGNEES = ['Olimov B.', 'Nazarova M.', 'Saidov R.', 'Xolmatova D.'];

const INITIAL_LEADS: Lead[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: generateName(i + 201, 0.48),
  phone: generatePhone(i + 203),
  direction: pick(DIRECTIONS, i + 205),
  source: pick(CRM_SOURCES, i + 207),
  status: pick(CRM_STATUSES, i + 209),
  assignee: pick(ASSIGNEES, i + 211),
  date: `${rnum(i + 213, 1, 23)}.04.2026`,
}));

interface StageConfig {
  id: LeadStatus;
  label: string;
  color: string;
  bg: string;
}

const STAGES: StageConfig[] = [
  { id: 'Yangi', label: 'Yangi', color: '#3B82F6', bg: 'bg-blue-50' },
  { id: "Qo'ng'iroq", label: "Qo'ng'iroq", color: '#F59E0B', bg: 'bg-amber-50' },
  { id: 'Kutilmoqda', label: 'Hujjat kutilmoqda', color: '#64748B', bg: 'bg-slate-100' },
  { id: 'Qabul', label: 'Qabul qilindi', color: '#2DB976', bg: 'bg-green-50' },
  { id: 'Rad', label: 'Rad etildi', color: '#EF4444', bg: 'bg-red-50' },
];

const SOURCE_VARIANT: Record<LeadSource, 'info' | 'success' | 'warning' | 'default'> = {
  Website: 'success',
  Telegram: 'info',
  Instagram: 'warning',
  Referral: 'default',
};

export function CrmKanbanPage() {
  const [cards, setCards] = useState<Lead[]>(() => INITIAL_LEADS.map((l) => ({ ...l })));
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overStage, setOverStage] = useState<LeadStatus | null>(null);

  const handleDragStart = useCallback((id: number) => {
    setDraggingId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setOverStage(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    setOverStage(stageId);
  }, []);

  const handleDrop = useCallback((stageId: LeadStatus) => {
    if (draggingId !== null) {
      setCards((prev) =>
        prev.map((c) => (c.id === draggingId ? { ...c, status: stageId } : c)),
      );
    }
    setDraggingId(null);
    setOverStage(null);
  }, [draggingId]);

  return (
    <PageContent>
      <PageHeader
        title="Voronka (Kanban)"
        subtitle="Qabul jarayonini vizual boshqarish"
        breadcrumbs={[
          { label: 'CRM', path: '/crm' },
          { label: 'Voronka' },
        ]}
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex gap-1 rounded-[10px] border border-slate-200 bg-white p-[3px]">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[12.5px] font-medium text-slate-600">
            <LayoutGrid className="h-3.5 w-3.5" />
            Ro&apos;yxat
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-[12.5px] font-semibold text-white">
            <BarChart3 className="h-3.5 w-3.5" />
            Voronka
          </button>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />}>
          Filtr
        </Button>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Yangi ariza
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-5 md:grid-cols-3 lg:grid-cols-5">
        {STAGES.map((stage) => {
          const stageCards = cards.filter((c) => c.status === stage.id);
          const isOver = overStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={() => setOverStage(null)}
              onDrop={() => handleDrop(stage.id)}
              className={cn(
                'min-h-[420px] rounded-xl p-3 transition-all',
                isOver ? stage.bg : 'bg-[#F8FAFB]',
                isOver ? 'border-2 border-dashed' : 'border-2 border-dashed border-transparent',
              )}
              style={isOver ? { borderColor: stage.color } : undefined}
            >
              {/* Column Header */}
              <div className="mb-3 flex items-center justify-between px-1.5 py-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-[13px] font-semibold text-slate-900">
                    {stage.label}
                  </span>
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[11px] font-medium text-muted">
                    {stageCards.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {stageCards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    isDragging={draggingId === card.id}
                    onDragStart={() => handleDragStart(card.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
                <button className="flex items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-slate-300 bg-transparent px-3 py-2.5 text-xs text-muted hover:border-slate-400 hover:text-slate-600">
                  <Plus className="h-3.5 w-3.5" />
                  Ariza qo&apos;shish
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageContent>
  );
}

interface KanbanCardProps {
  card: Lead;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function KanbanCard({ card, isDragging, onDragStart, onDragEnd }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'cursor-grab rounded-[10px] border border-slate-200 bg-white p-3 transition-shadow',
        isDragging
          ? 'opacity-50 shadow-lg -rotate-1'
          : 'shadow-sm hover:shadow-md',
      )}
    >
      {/* Header: Avatar + Name */}
      <div className="flex items-start gap-2.5">
        <Avatar name={card.name.full} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-tight text-slate-900">
            {card.name.short}
          </div>
          <div className="mt-0.5 text-[11px] text-muted">{card.phone}</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge>{card.direction}</Badge>
        <Badge variant={SOURCE_VARIANT[card.source]}>{card.source}</Badge>
      </div>

      {/* Footer */}
      <div className="mt-2.5 flex items-center justify-between border-t border-[#F1F5F9] pt-2.5 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {card.date}
        </span>
        <span className="inline-flex items-center gap-1">
          <User className="h-3 w-3" />
          {card.assignee}
        </span>
      </div>
    </div>
  );
}
