import { useState, useMemo } from 'react';
import { Plus, Eye, LayoutGrid, List } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Badge, Button } from '@/components/ui';
import { rnum, generateName } from '@/api/mock/shared-data';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tag: string;
  color: string;
  views: number;
}

const NEWS_TITLES: [string, string, string, string][] = [
  ['Yangi laboratoriya ochildi: AI Lab', "Sun'iy intellekt sohasidagi izlanishlar uchun zamonaviy laboratoriya ochildi. 24 ta ish o'rni mavjud.", '#2DB976', 'Universitet'],
  ["O'quv yili 2026-2027 boshlanish sanasi", "Yangi o'quv yili 2-sentabrda boshlanishi rejalashtirilgan. Talabalar ro'yxatdan o'tishi 25-avgustdan.", '#3B82F6', 'Akademik'],
  ['Xalqaro hamkorlik shartnomasi', "Germaniya universitetlari bilan akademik almashinuv dasturi bo'yicha shartnoma imzolandi.", '#F59E0B', 'Hamkorlik'],
  ['Qabul komissiyasi natijalari', "Bu yilgi qabul komissiyasi 1247 ta yangi talabani qabul qildi. O'tgan yilga nisbatan +12%.", '#EC4899', 'Akademik'],
  ["Talabalar olimpiadasi g'oliblari", "Matematika, IT va Iqtisodiyot bo'yicha respublika olimpiadasida 8 ta sovrin.", '#8B5CF6', 'Talabalar'],
  ['Yangi kafedra: Robototexnika', "Sentabrdan boshlab Robototexnika kafedrasi yangi yo'nalishni qabul qiladi.", '#10B981', 'Akademik'],
  ["Stipendiyalar yangi tartibi", "Yuqori GPA (3.5+) talabalar uchun stipendiya summasi 30% oshirildi.", '#06B6D4', 'Talabalar'],
  ["Ilmiy konferensiya — Mart 2026", "12-13 mart kunlari xalqaro ilmiy konferensiya bo'lib o'tadi. 18 mamlakat ishtirokchilari.", '#0EA5E9', 'Ilm-fan'],
  ["Bahor: ekologik aksiyalar", "April oyida atrof-muhitni muhofaza qilish bo'yicha bir qator tadbirlar rejalashtirildi.", '#22C55E', 'Universitet'],
];

const NEWS_ITEMS: NewsItem[] = NEWS_TITLES.map((row, i) => {
  const name = generateName(i + 1101, 0.4);
  return {
    id: i + 1,
    title: row[0],
    excerpt: row[1],
    color: row[2],
    tag: row[3],
    date: `${String(Math.round(rnum(i + 1100, 1, 25))).padStart(2, '0')}.04.2026`,
    author: name.short,
    views: Math.round(rnum(i + 1103, 80, 2400)),
  };
});

function fmtNum(n: number): string {
  return n.toLocaleString('ru-RU');
}

type ViewMode = 'grid' | 'list';

export function NewsPage() {
  const [tagFilter, setTagFilter] = useState('all');
  const [view, setView] = useState<ViewMode>('grid');

  const allTags = useMemo(() => {
    return ['all', ...Array.from(new Set(NEWS_ITEMS.map((n) => n.tag)))];
  }, []);

  const filtered = useMemo(() => {
    return NEWS_ITEMS.filter((n) => {
      if (tagFilter !== 'all' && n.tag !== tagFilter) return false;
      return true;
    });
  }, [tagFilter]);

  return (
    <PageContent>
      <PageHeader
        title="Yangiliklar"
        subtitle="Universitet hayotidagi muhim voqealar"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Yangiliklar' }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
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

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
            >
              {/* Gradient header */}
              <div
                className="relative h-[140px]"
                style={{ background: `linear-gradient(135deg, ${n.color}, ${n.color}aa)` }}
              >
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
                  {n.tag}
                </span>
                <span className="absolute bottom-3 left-4 text-[13px] font-bold tracking-tight text-white">
                  {n.date}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-2 text-base font-bold leading-tight text-slate-900">{n.title}</h3>
                <p className="mb-3.5 text-[13px] leading-relaxed text-slate-500">{n.excerpt}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                  <span>{n.author}</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {fmtNum(n.views)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
          {filtered.map((n, i) => (
            <div
              key={n.id}
              className="flex cursor-pointer gap-4 p-4"
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
            >
              <div
                className="h-20 w-[120px] shrink-0 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${n.color}, ${n.color}aa)` }}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2.5">
                  <Badge variant="info">{n.tag}</Badge>
                  <span className="text-xs text-slate-400">{n.date}</span>
                </div>
                <h3 className="mb-1 text-base font-bold text-slate-900">{n.title}</h3>
                <p className="text-[13px] text-slate-500">{n.excerpt}</p>
              </div>
              <div className="flex shrink-0 items-end gap-1 self-end whitespace-nowrap text-xs text-slate-400">
                <Eye className="h-3 w-3" />
                {fmtNum(n.views)}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16">
          <p className="text-sm font-medium text-slate-500">Yangiliklar topilmadi</p>
          <p className="text-xs text-slate-400">Filtrlarni o{"'"}zgartirib ko{"'"}ring</p>
        </div>
      )}
    </PageContent>
  );
}
