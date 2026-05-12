import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Plus, LayoutGrid, BarChart3, Filter, X, Phone, Tag, Clock } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Avatar, Badge, Button } from '@/components/ui';
import type { LeadStatus, LeadSource, LeadListItem } from '@/types/crm';
import { useLeads, useUpdateLead } from '@/api/hooks/useCrm';
import { cn } from '@/lib/utils';

const SOURCE_KEYS: Record<LeadSource, string> = {
  website: 'crm.sourceWebsite',
  telegram: 'crm.sourceTelegram',
  instagram: 'crm.sourceInstagram',
  referral: 'crm.sourceReferral',
  event: 'crm.sourceEvent',
  call: 'crm.sourceCall',
};

const SOURCE_VARIANT: Record<LeadSource, 'info' | 'success' | 'warning' | 'default'> = {
  website: 'success',
  telegram: 'info',
  instagram: 'warning',
  referral: 'default',
  event: 'default',
  call: 'default',
};

interface StageConfig {
  id: LeadStatus;
  label: string;
  color: string;
  bg: string;
}

interface StageConfigWithKey extends Omit<StageConfig, 'label'> {
  labelKey: string;
}

const STAGES_CONFIG: StageConfigWithKey[] = [
  { id: 'new', labelKey: 'crm.statusNew', color: '#3B82F6', bg: 'bg-blue-50' },
  { id: 'contacted', labelKey: 'crm.statusContacted', color: '#F59E0B', bg: 'bg-amber-50' },
  { id: 'interested', labelKey: 'crm.statusInterested', color: '#8B5CF6', bg: 'bg-violet-50' },
  { id: 'applied', labelKey: 'crm.statusApplied', color: '#64748B', bg: 'bg-slate-100' },
  { id: 'enrolled', labelKey: 'crm.statusEnrolled', color: '#2DB976', bg: 'bg-green-50' },
  { id: 'rejected', labelKey: 'crm.statusRejected', color: '#EF4444', bg: 'bg-red-50' },
];

export function CrmKanbanPage() {
  const { t } = useTranslation();
  const STAGES = useMemo(() => STAGES_CONFIG.map((s) => ({ ...s, label: t(s.labelKey) })), [t]);
  const { data: leadsData } = useLeads({ pageSize: 100 });
  const allLeads = leadsData?.data ?? [];
  const updateLead = useUpdateLead();

  const [statusOverrides, setStatusOverrides] = useState<Record<number, LeadStatus>>({});
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overStage, setOverStage] = useState<LeadStatus | null>(null);
  const [detailLead, setDetailLead] = useState<LeadListItem | null>(null);

  const cards = useMemo(() =>
    allLeads.map((l) => ({ ...l, status: statusOverrides[l.id] ?? l.status })),
    [allLeads, statusOverrides],
  );

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
      setStatusOverrides((prev) => ({ ...prev, [draggingId]: stageId }));
      updateLead.mutate({ id: draggingId, data: { status: stageId } });
    }
    setDraggingId(null);
    setOverStage(null);
  }, [draggingId, updateLead]);

  return (
    <PageContent>
      <PageHeader
        title={t('crm.kanbanTitle')}
        subtitle={t('crm.kanbanSubtitle')}
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
            {t('crm.listView')}
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-[12.5px] font-semibold text-white">
            <BarChart3 className="h-3.5 w-3.5" />
            {t('crm.funnelView')}
          </button>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />}>
          {t('common.filter')}
        </Button>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          {t('crm.newApplication')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-5 md:grid-cols-3 lg:grid-cols-6">
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
                    onClick={() => setDetailLead(card)}
                  />
                ))}
                <button className="flex items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-slate-300 bg-transparent px-3 py-2.5 text-xs text-muted hover:border-slate-400 hover:text-slate-600">
                  <Plus className="h-3.5 w-3.5" />
                  {t('crm.addApplication')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {detailLead && (
        <LeadDetailSlide lead={detailLead} onClose={() => setDetailLead(null)} />
      )}
    </PageContent>
  );
}

interface KanbanCardData {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  direction: string;
  source: LeadSource;
  assigneeName: string;
  createdAt: string;
}

interface KanbanCardProps {
  card: KanbanCardData;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onClick: () => void;
}

function KanbanCard({ card, isDragging, onDragStart, onDragEnd, onClick }: KanbanCardProps) {
  const { t } = useTranslation();
  const fullName = `${card.lastName} ${card.firstName}`;
  const shortName = `${card.lastName} ${card.firstName?.[0] ?? ''}.`;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'cursor-grab rounded-[10px] border border-slate-200 bg-white p-3 transition-shadow',
        isDragging
          ? 'opacity-50 shadow-lg -rotate-1'
          : 'shadow-sm hover:shadow-md hover:border-slate-300',
      )}
    >
      {/* Header: Avatar + Name */}
      <div className="flex items-start gap-2.5">
        <Avatar name={fullName} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-tight text-slate-900">
            {shortName}
          </div>
          <div className="mt-0.5 text-[11px] text-muted">{card.phone}</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge>{card.direction}</Badge>
        <Badge variant={SOURCE_VARIANT[card.source]}>{t(SOURCE_KEYS[card.source])}</Badge>
      </div>

      {/* Footer */}
      <div className="mt-2.5 flex items-center justify-between border-t border-[#F1F5F9] pt-2.5 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {card.createdAt}
        </span>
        <span className="inline-flex items-center gap-1">
          <User className="h-3 w-3" />
          {card.assigneeName}
        </span>
      </div>
    </div>
  );
}

function LeadDetailSlide({ lead, onClose }: { lead: LeadListItem; onClose: () => void }) {
  const { t } = useTranslation();
  const fullName = `${lead.lastName} ${lead.firstName}`;
  const STAGES = useMemo(() => STAGES_CONFIG.map((s) => ({ ...s, label: t(s.labelKey) })), [t]);
  const stageCfg = STAGES.find((s) => s.id === lead.status) ?? STAGES[0]!;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">{t('crm.applicationDetail')}</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5">
          <div className="flex items-start gap-3">
            <Avatar name={fullName} size="md" />
            <div>
              <p className="text-[15px] font-semibold text-slate-900">{fullName}</p>
              <p className="text-[12px] text-slate-500">{lead.direction}</p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white"
            style={{ backgroundColor: stageCfg.color }}
          >
            {stageCfg.label}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[13px] text-slate-700">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              {lead.phone}
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-slate-700">
              <Tag className="h-4 w-4 text-slate-400 shrink-0" />
              {t(SOURCE_KEYS[lead.source])}
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-slate-500">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              {lead.createdAt}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-[12px] font-semibold text-slate-500 mb-2">{t('crm.responsible')}</p>
            <div className="flex items-center gap-2.5">
              <Avatar name={lead.assigneeName} size="sm" />
              <span className="text-[13px] text-slate-700">{lead.assigneeName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
