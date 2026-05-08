import { useState, useMemo } from 'react';
import { Inbox, Bell, Clock, CheckCircle2, Plus, Edit, Users, CheckCircle } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Button } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { generateName, pick, rnum } from '@/api/mock/shared-data';
import { cn } from '@/lib/utils';

type AppealStatus = 'Yangi' | "Ko'rib chiqilmoqda" | 'Hal qilingan';
type AppealCategory = { id: string; label: string; variant: 'error' | 'info' | 'success' | 'warning' };

interface Appeal {
  id: string;
  subject: string;
  cat: AppealCategory;
  status: AppealStatus;
  author: { full: string; short: string; initials: string; isFemale: boolean };
  assignee: string;
  date: string;
}

const APPEAL_CATS: AppealCategory[] = [
  { id: 'shikoyat', label: 'Shikoyat', variant: 'error' },
  { id: 'taklif', label: 'Taklif', variant: 'info' },
  { id: 'savol', label: 'Savol', variant: 'success' },
  { id: 'ariza', label: 'Ariza', variant: 'warning' },
];

const APPEAL_SUBJECTS = [
  "Auditoriya iliqligi haqida", "Wi-Fi sifatini yaxshilash", "Stipendiya muddati",
  "Imtihon natijasi haqida", "TTJ xonasi xizmati", "Kutubxona soatlari",
  "O'qituvchi munosabati", "Bufet narxlari", "Onlayn dars sifati",
  "Diplom mavzusini tasdiqlash", "Akademik ta'til arizasi", "Ko'chirish arizasi",
  "Stipendiya kechikishi", "Imtihon jadvali",
];

function generateAppeals(): Appeal[] {
  return APPEAL_SUBJECTS.map((subject, i) => {
    const author = generateName(i + 1003, 0.5);
    const assigneeName = generateName(i + 1005, 0.4);
    const cat = pick(APPEAL_CATS, i + 1001);
    const status: AppealStatus = i < 3 ? 'Yangi' : i < 9 ? "Ko'rib chiqilmoqda" : 'Hal qilingan';
    const day = Math.round(rnum(i + 1007, 1, 25));
    return {
      id: `MUR-${String(3000 + i).padStart(5, '0')}`,
      subject,
      cat,
      status,
      author: { full: author.full, short: author.short, initials: author.initials, isFemale: author.isFemale },
      assignee: assigneeName.short,
      date: `${String(day).padStart(2, '0')}.04.2026`,
    };
  });
}

const APPEALS = generateAppeals();

type FilterId = 'all' | 'new' | 'progress' | 'done';

export function AppealsPage() {
  const [selected, setSelected] = useState<Appeal>(APPEALS[0] as Appeal);
  const [filter, setFilter] = useState<FilterId>('all');

  const counts = useMemo(() => ({
    total: APPEALS.length,
    yangi: APPEALS.filter((a) => a.status === 'Yangi').length,
    progress: APPEALS.filter((a) => a.status === "Ko'rib chiqilmoqda").length,
    done: APPEALS.filter((a) => a.status === 'Hal qilingan').length,
  }), []);

  const filtered = useMemo(() => {
    if (filter === 'all') return APPEALS;
    if (filter === 'new') return APPEALS.filter((a) => a.status === 'Yangi');
    if (filter === 'progress') return APPEALS.filter((a) => a.status === "Ko'rib chiqilmoqda");
    return APPEALS.filter((a) => a.status === 'Hal qilingan');
  }, [filter]);

  const statusVariant = (s: AppealStatus): 'error' | 'warning' | 'success' => {
    if (s === 'Yangi') return 'error';
    if (s === "Ko'rib chiqilmoqda") return 'warning';
    return 'success';
  };

  return (
    <PageContent>
      <PageHeader
        title="Murojaatlar"
        subtitle="Talabalar va xodimlar murojaatlari, shikoyat va takliflar"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Murojaatlar' }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Yangi murojaat
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
          <div className="flex flex-wrap gap-1.5 border-b border-border p-3">
            {([
              { id: 'all' as const, label: 'Hammasi' },
              { id: 'new' as const, label: 'Yangi', count: counts.yangi },
              { id: 'progress' as const, label: 'Jarayonda', count: counts.progress },
              { id: 'done' as const, label: 'Hal qilingan', count: counts.done },
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
          <div className="flex-1 overflow-y-auto">
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={cn(
                  'block w-full border-b border-slate-100 p-3.5 text-left',
                  selected.id === a.id
                    ? 'border-l-[3px] border-l-primary-500 bg-green-50/70'
                    : 'border-l-[3px] border-l-transparent',
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant={a.cat.variant}>{a.cat.label}</Badge>
                  <span className="text-[11px] text-slate-400">{a.date}</span>
                </div>
                <p className="text-[13px] font-semibold text-slate-900 mb-1">{a.subject}</p>
                <p className="text-xs text-slate-500">{a.author.full}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Right: detail */}
        <Card className="overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={selected.cat.variant}>{selected.cat.label}</Badge>
                <span className="text-xs tabular-nums text-slate-400">{selected.id}</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-tight text-slate-900">{selected.subject}</h2>
              <p className="mt-1 text-[13px] text-slate-500">Yuborilgan: {selected.date}</p>
            </div>
            <Badge variant={statusVariant(selected.status)} dot>{selected.status}</Badge>
          </div>

          {/* Meta */}
          <div className="mb-5 grid grid-cols-2 gap-3.5 rounded-xl bg-[#F8FAFB] p-4">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-slate-400">Murojaatchi</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Avatar name={selected.author.full} size="sm" />
                <span className="text-[13px] text-slate-900">{selected.author.full}</span>
              </div>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-slate-400">Mas{"'"}ul shaxs</p>
              <p className="mt-1.5 text-[13px] text-slate-900">{selected.assignee}</p>
            </div>
          </div>

          {/* Appeal text */}
          <div className="mb-5 rounded-xl border border-border bg-white p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400">Murojaat matni</p>
            <p className="text-sm leading-relaxed text-slate-700">
              Hurmatli rahbariyat, men sizga &ldquo;{selected.subject.toLowerCase()}&rdquo; masalasi bo{"'"}yicha murojaat qilmoqdaman.
              Bu masala 2-kursdan boshlab davom etmoqda va ko{"'"}plab talabalarni qiziqtirmoqda.
              Iltimos, ushbu masalani ko{"'"}rib chiqing va tegishli choralar ko{"'"}rishni so{"'"}rab murojaat qilmoqdaman.
            </p>
          </div>

          {/* Comment */}
          <div className="mb-5">
            <h4 className="mb-3 text-[13px] font-semibold text-slate-900">Javoblar va izohlar</h4>
            <div className="flex gap-3 mb-2.5">
              <Avatar name={selected.assignee} size="sm" />
              <div className="flex-1 rounded-xl border border-green-200 bg-green-50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-slate-900">{selected.assignee}</span>
                  <span className="text-[11.5px] text-slate-400">2 kun oldin</span>
                </div>
                <p className="text-[13px] leading-relaxed text-slate-700">
                  Murojaatingiz qabul qilindi. Tegishli bo{"'"}lim bilan muhokama qilinmoqda. 5 ish kuni ichida javob beramiz.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" leftIcon={<Edit className="h-3.5 w-3.5" />}>Javob yozish</Button>
            <Button variant="secondary" size="sm" leftIcon={<Users className="h-3.5 w-3.5" />}>Yo{"'"}naltirish</Button>
            <Button variant="secondary" size="sm" leftIcon={<CheckCircle className="h-3.5 w-3.5" />}>Hal qilingan deb belgilash</Button>
          </div>
        </Card>
      </div>
    </PageContent>
  );
}
