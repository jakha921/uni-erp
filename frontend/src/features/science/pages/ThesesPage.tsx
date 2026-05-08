import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheses } from '@/api/hooks/useScience';
import type { Thesis } from '@/types/science';

// --- Stage Config ---

type ThesisStage = Thesis['stage'];

const STAGE_LABELS: Record<ThesisStage, string> = {
  topic_approved: 'Birinchi sharx',
  in_progress: 'Tahrirlash',
  review: 'Himoyaga ruxsat',
  defense: 'Himoyada',
  completed: 'Himoyalandi',
};

const STAGE_COLORS: Record<ThesisStage, string> = {
  topic_approved: '#3B82F6',
  in_progress: '#F59E0B',
  review: '#8B5CF6',
  defense: '#EC4899',
  completed: '#2DB976',
};

const STAGE_BADGE_VARIANTS: Record<ThesisStage, 'info' | 'warning' | 'success' | 'default'> = {
  topic_approved: 'info',
  in_progress: 'warning',
  review: 'default',
  defense: 'warning',
  completed: 'success',
};

const FILTER_TABS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'Barchasi' },
  { id: 'topic_approved', label: 'Birinchi sharx' },
  { id: 'in_progress', label: 'Tahrirlash' },
  { id: 'review', label: 'Himoyaga ruxsat' },
  { id: 'completed', label: 'Himoyalandi' },
];

// --- Component ---

export function ThesesPage() {
  const [filter, setFilter] = useState('all');

  const { data: thesesData, isLoading } = useTheses({
    page: 1,
    pageSize: 50,
    stage: filter !== 'all' ? filter : undefined,
  });

  const theses = thesesData?.data ?? [];

  // Client-side filter when hook doesn't re-fetch per stage
  const filtered = useMemo(() => {
    if (filter === 'all') return theses;
    return theses.filter((t) => t.stage === filter);
  }, [filter, theses]);

  return (
    <PageContent>
      <PageHeader
        title="Diplom ishlari"
        subtitle="Talabalar bitiruv malakaviy ishlari"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Diplom ishlari' }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>Yangi diplom</Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-sm">Diplom ishlari topilmadi</div>
      )}

      {/* Card Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((thesis) => (
            <ThesisCard key={thesis.id} thesis={thesis} />
          ))}
        </div>
      )}
    </PageContent>
  );
}

function ThesisCard({ thesis }: { thesis: Thesis }) {
  const topColor = STAGE_COLORS[thesis.stage] ?? '#94A3B8';
  const initials = thesis.studentName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden">
      {/* Color bar */}
      <div className="h-[3px] -mx-6 -mt-6 mb-4" style={{ backgroundColor: topColor }} />

      {/* Header with ID and badges */}
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          DIP-{thesis.id}
        </span>
        <Badge variant={STAGE_BADGE_VARIANTS[thesis.stage] ?? 'default'} dot>
          {STAGE_LABELS[thesis.stage] ?? thesis.stage}
        </Badge>
        {thesis.grade != null && (
          <Badge variant="success">Baho: {thesis.grade}/100</Badge>
        )}
      </div>

      {/* Topic */}
      <h4 className="text-[14px] font-semibold text-slate-900 leading-snug mb-2.5">
        {thesis.title}
      </h4>

      {/* Student */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
          {initials}
        </div>
        <span className="text-[13px] font-medium text-slate-900">{thesis.studentName}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Rahbar: <strong className="text-slate-700">{thesis.supervisorName}</strong>
        </span>
        {thesis.defenseDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {thesis.defenseDate}
          </span>
        )}
      </div>
    </Card>
  );
}
