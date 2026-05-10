import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Badge, Button, Spinner } from '@/components/ui';
import { useNewsList, useCreateNews, useDeleteNews } from '@/api/hooks/useNews';
import { ConfirmDialog } from '@/components/overlays';
import { NewsForm } from '../components/NewsForm';
import type { NewsArticle } from '@/types/operations';
import type { NewsFormData } from '../schemas/news.schema';
import { cn } from '@/lib/utils';

// --- Color palette for gradient headers ---
const TAG_COLORS: Record<string, string> = {
  Universitet: '#2DB976',
  Akademik: '#3B82F6',
  Hamkorlik: '#F59E0B',
  Talabalar: '#8B5CF6',
  'Ilm-fan': '#0EA5E9',
};

function getColor(category: string): string {
  return TAG_COLORS[category] ?? '#64748B';
}

type ViewMode = 'grid' | 'list';

export function NewsPage() {
  const [tagFilter, setTagFilter] = useState('all');
  const [view, setView] = useState<ViewMode>('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteNews, setDeleteNews] = useState<NewsArticle | null>(null);
  const createNews = useCreateNews();
  const deleteNewsMutation = useDeleteNews();

  const { data: newsData, isLoading } = useNewsList({
    page: 1,
    pageSize: 50,
    category: tagFilter !== 'all' ? tagFilter : undefined,
  });

  const newsItems = newsData?.data ?? [];

  const allTags = useMemo(() => {
    const tags = Array.from(new Set(newsItems.map((n) => n.category)));
    return ['all', ...tags];
  }, [newsItems]);

  const filtered = useMemo(() => {
    if (tagFilter === 'all') return newsItems;
    return newsItems.filter((n) => n.category === tagFilter);
  }, [newsItems, tagFilter]);

  return (
    <PageContent>
      <PageHeader
        title="Yangiliklar"
        subtitle="Universitet hayotidagi muhim voqealar"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Yangiliklar' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Yangilik yozish
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setTagFilter(t)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
              tagFilter === t
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-border bg-white text-slate-500 hover:bg-slate-50',
            )}
          >
            {t === 'all' ? 'Barchasi' : t}
          </button>
        ))}

        <div className="ml-auto flex gap-1 rounded-lg bg-slate-100 p-0.5">
          {([
            { id: 'grid' as const, icon: LayoutGrid },
            { id: 'list' as const, icon: List },
          ]).map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                'flex items-center rounded-md p-1.5 transition-colors',
                view === id
                  ? 'bg-white text-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <Icon className="h-4 w-4" />
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

      {/* Grid View */}
      {!isLoading && view === 'grid' && (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((n) => (
            <NewsGridCard key={n.id} item={n} />
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && view === 'list' && (
        <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          {filtered.map((n, i) => (
            <NewsListRow key={n.id} item={n} isLast={i === filtered.length - 1} />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16">
          <p className="text-sm font-medium text-slate-500">Yangiliklar topilmadi</p>
          <p className="text-xs text-slate-400">Filtrlarni o{"'"}zgartirib ko{"'"}ring</p>
        </div>
      )}
      <NewsForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data: NewsFormData) => {
          createNews.mutate(data, { onSuccess: () => setFormOpen(false) });
        }}
        loading={createNews.isPending}
      />

      <ConfirmDialog
        open={!!deleteNews}
        onClose={() => setDeleteNews(null)}
        onConfirm={() => {
          if (!deleteNews) return;
          deleteNewsMutation.mutate(deleteNews.id, { onSuccess: () => setDeleteNews(null) });
        }}
        title="Yangilikni o'chirish"
        message={`"${deleteNews?.title}" yangiligini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteNewsMutation.isPending}
      />
    </PageContent>
  );
}

function NewsGridCard({ item: n }: { item: NewsArticle }) {
  const color = getColor(n.category);

  return (
    <div className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md">
      {/* Gradient header */}
      <div
        className="relative h-[140px]"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
      >
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
          {n.category}
        </span>
        <span className="absolute bottom-3 left-4 text-[13px] font-bold tracking-tight text-white">
          {n.publishedAt}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-base font-bold leading-tight text-slate-900">{n.title}</h3>
        <p className="mb-3.5 text-[13px] leading-relaxed text-slate-500">{n.excerpt}</p>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
          <span>{n.author}</span>
        </div>
      </div>
    </div>
  );
}

function NewsListRow({ item: n, isLast }: { item: NewsArticle; isLast: boolean }) {
  const color = getColor(n.category);

  return (
    <div
      className="flex cursor-pointer gap-4 p-4"
      style={{ borderBottom: !isLast ? '1px solid #F1F5F9' : 'none' }}
    >
      <div
        className="h-20 w-[120px] shrink-0 rounded-xl"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2.5">
          <Badge variant="info">{n.category}</Badge>
          <span className="text-xs text-slate-400">{n.publishedAt}</span>
        </div>
        <h3 className="mb-1 text-base font-bold text-slate-900">{n.title}</h3>
        <p className="text-[13px] text-slate-500">{n.excerpt}</p>
      </div>
    </div>
  );
}
