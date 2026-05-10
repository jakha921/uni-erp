import { useState, useMemo, useRef } from 'react';
import { Inbox, Bell, Clock, CheckCircle2, Plus, Users, CheckCircle, Trash2, Send } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { ConfirmDialog } from '@/components/overlays';
import { cn } from '@/lib/utils';
import { useAppealsList, useUpdateAppealStatus, useCreateAppeal, useDeleteAppeal, useAddAppealComment } from '@/api/hooks/useAppeals';
import { AppealForm } from '../components/AppealForm';
import type { AppealFormData } from '../schemas/appeal.schema';
import type { Appeal, AppealStatus, AppealCategory } from '@/types/operations';

const CATEGORY_LABEL: Record<AppealCategory, string> = {
  complaint: 'Shikoyat',
  request: 'Ariza',
  suggestion: 'Taklif',
  question: 'Savol',
};

const CATEGORY_VARIANT: Record<AppealCategory, 'error' | 'info' | 'success' | 'warning'> = {
  complaint: 'error',
  suggestion: 'info',
  question: 'success',
  request: 'warning',
};

const STATUS_LABEL: Record<AppealStatus, string> = {
  new: 'Yangi',
  in_progress: "Ko'rib chiqilmoqda",
  resolved: 'Hal qilingan',
  closed: 'Yopilgan',
};

type FilterId = 'all' | 'new' | 'in_progress' | 'resolved';

export function AppealsPage() {
  const [filter, setFilter] = useState<FilterId>('all');
  const [categoryFilter, setCategoryFilter] = useState<AppealCategory | ''>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteAppeal, setDeleteAppeal] = useState<Appeal | null>(null);
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const createAppeal = useCreateAppeal();
  const deleteAppealMutation = useDeleteAppeal();
  const addComment = useAddAppealComment();

  const statusParam = filter === 'all' ? undefined : filter as AppealStatus;

  const { data: appealsData, isLoading } = useAppealsList({
    status: statusParam,
    category: categoryFilter || undefined,
  });

  const updateStatus = useUpdateAppealStatus();

  const appeals = appealsData?.data ?? [];
  const totalCount = appealsData?.total ?? 0;

  const selected = useMemo(() => {
    if (selectedId !== null) {
      return appeals.find((a) => a.id === selectedId) ?? appeals[0] ?? null;
    }
    return appeals[0] ?? null;
  }, [appeals, selectedId]);

  const counts = useMemo(() => ({
    total: totalCount,
    yangi: appeals.filter((a) => a.status === 'new').length,
    progress: appeals.filter((a) => a.status === 'in_progress').length,
    done: appeals.filter((a) => a.status === 'resolved' || a.status === 'closed').length,
  }), [appeals, totalCount]);

  const statusVariant = (s: AppealStatus): 'error' | 'warning' | 'success' => {
    if (s === 'new') return 'error';
    if (s === 'in_progress') return 'warning';
    return 'success';
  };

  const handleResolve = () => {
    if (selected) {
      updateStatus.mutate({ id: selected.id, status: 'resolved' });
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Murojaatlar"
        subtitle="Talabalar va xodimlar murojaatlari, shikoyat va takliflar"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Murojaatlar' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Yangi murojaat
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Jami"
          value={counts.total}
          icon={<Inbox className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Yangi"
          value={counts.yangi}
          icon={<Bell className="h-[18px] w-[18px]" />}
          iconBg="#EF4444"
        />
        <StatCard
          label="Ko'rib chiqilmoqda"
          value={counts.progress}
          icon={<Clock className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Hal qilingan"
          value={counts.done}
          icon={<CheckCircle2 className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
        />
      </div>

      {/* Split panel layout */}
      <div className="grid grid-cols-[380px_1fr] gap-4" style={{ height: 640 }}>
        {/* Left: list */}
        <Card noPadding className="flex flex-col overflow-hidden">
          <div className="border-b border-border p-3 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {([
                { id: 'all' as const, label: 'Hammasi' },
                { id: 'new' as const, label: 'Yangi', count: counts.yangi },
                { id: 'in_progress' as const, label: 'Jarayonda', count: counts.progress },
                { id: 'resolved' as const, label: 'Hal qilingan', count: counts.done },
              ]).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors',
                    filter === f.id
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-border bg-white text-slate-500',
                  )}
                >
                  {f.label}{f.count != null ? ` (${f.count})` : ''}
                </button>
              ))}
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AppealCategory | '')}
              className="h-7 w-full rounded-md border border-border px-2 text-xs text-slate-600"
            >
              <option value="">Barcha kategoriyalar</option>
              <option value="complaint">Shikoyat</option>
              <option value="request">Ariza</option>
              <option value="suggestion">Taklif</option>
              <option value="question">Savol</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : appeals.length === 0 ? (
              <div className="flex justify-center py-12 text-sm text-slate-400">
                Murojaatlar topilmadi
              </div>
            ) : (
              appeals.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={cn(
                    'block w-full border-b border-slate-100 p-3.5 text-left',
                    selected?.id === a.id
                      ? 'border-l-[3px] border-l-primary-500 bg-green-50/70'
                      : 'border-l-[3px] border-l-transparent',
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant={CATEGORY_VARIANT[a.category]}>{CATEGORY_LABEL[a.category]}</Badge>
                    <span className="text-[11px] text-slate-400">{a.createdAt}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-900 mb-1">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.authorName}</p>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Right: detail */}
        {selected ? (
          <Card className="overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={CATEGORY_VARIANT[selected.category]}>{CATEGORY_LABEL[selected.category]}</Badge>
                  <span className="text-xs tabular-nums text-slate-400">#{selected.id}</span>
                </div>
                <h2 className="text-[22px] font-bold tracking-tight text-slate-900">{selected.title}</h2>
                <p className="mt-1 text-[13px] text-slate-500">Yuborilgan: {selected.createdAt}</p>
              </div>
              <Badge variant={statusVariant(selected.status)} dot>{STATUS_LABEL[selected.status]}</Badge>
            </div>

            {/* Meta */}
            <div className="mb-5 grid grid-cols-2 gap-3.5 rounded-xl bg-[#F8FAFB] p-4">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-slate-400">Murojaatchi</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Avatar name={selected.authorName} size="sm" />
                  <span className="text-[13px] text-slate-900">{selected.authorName}</span>
                </div>
              </div>
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-slate-400">Mas{"'"}ul shaxs</p>
                <p className="mt-1.5 text-[13px] text-slate-900">{selected.assigneeName ?? '—'}</p>
              </div>
            </div>

            {/* Appeal text */}
            <div className="mb-5 rounded-xl border border-border bg-white p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400">Murojaat matni</p>
              <p className="text-sm leading-relaxed text-slate-700">
                {selected.description}
              </p>
            </div>

            {/* Comments */}
            {selected.comments && selected.comments.length > 0 && (
              <div className="mb-5">
                <h4 className="mb-3 text-[13px] font-semibold text-slate-900">Javoblar va izohlar</h4>
                {selected.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 mb-2.5">
                    <Avatar name={comment.authorName} size="sm" />
                    <div className="flex-1 rounded-xl border border-green-200 bg-green-50 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-slate-900">{comment.authorName}</span>
                        <span className="text-[11.5px] text-slate-400">{comment.createdAt}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-slate-700">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment input */}
            <div className="flex gap-2 items-end">
              <textarea
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Izoh yozing..."
                rows={2}
                className="flex-1 resize-none rounded-lg border border-border px-3 py-2 text-[13px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey && commentText.trim() && selected) {
                    addComment.mutate({ id: selected.id, content: commentText.trim() }, {
                      onSuccess: () => setCommentText(''),
                    });
                  }
                }}
              />
              <Button
                size="sm"
                leftIcon={<Send className="h-3.5 w-3.5" />}
                loading={addComment.isPending}
                disabled={!commentText.trim()}
                onClick={() => {
                  if (selected && commentText.trim()) {
                    addComment.mutate({ id: selected.id, content: commentText.trim() }, {
                      onSuccess: () => setCommentText(''),
                    });
                  }
                }}
              >
                Yuborish
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" size="sm" leftIcon={<Users className="h-3.5 w-3.5" />}>Yo{"'"}naltirish</Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCircle className="h-3.5 w-3.5" />}
                onClick={handleResolve}
              >
                Hal qilingan deb belgilash
              </Button>
              <button
                onClick={() => selected && setDeleteAppeal(selected)}
                className="h-8 w-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 inline-flex items-center justify-center transition-colors"
                title="O'chirish"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center">
            <p className="text-sm text-slate-400">Murojaatni tanlang</p>
          </Card>
        )}
      </div>
      <AppealForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data: AppealFormData) => {
          createAppeal.mutate(data, { onSuccess: () => setFormOpen(false) });
        }}
        loading={createAppeal.isPending}
      />

      <ConfirmDialog
        open={!!deleteAppeal}
        onClose={() => setDeleteAppeal(null)}
        onConfirm={() => {
          if (!deleteAppeal) return;
          deleteAppealMutation.mutate(deleteAppeal.id, { onSuccess: () => { setDeleteAppeal(null); setSelectedId(null); } });
        }}
        title="Murojaatni o'chirish"
        message={`"${deleteAppeal?.title}" murojaatini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteAppealMutation.isPending}
      />
    </PageContent>
  );
}
