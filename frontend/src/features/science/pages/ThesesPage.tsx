import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Button } from '@/components/ui';
import { Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---

type ThesisStage = 'Birinchi sharx' | 'Tahrirlash' | 'Himoyaga ruxsat' | 'Himoyalandi';

interface Thesis {
  id: string;
  student: string;
  studentInitials: string;
  topic: string;
  supervisor: string;
  stage: ThesisStage;
  defenseDate: string;
  grade: number | null;
}

// --- Mock Data ---

const THESES: Thesis[] = [
  { id: 'DIP-24-001', student: 'Karimov Sherzod Rashidovich', studentInitials: 'KSh', topic: 'Navoiy viloyatida raqamli iqtisodiyot rivojlanishining iqtisodiy samarasi', supervisor: 'prof. Yusupova M.K.', stage: 'Himoyaga ruxsat', defenseDate: '15.06.2024', grade: null },
  { id: 'DIP-24-002', student: 'Aliyeva Nilufar Abdullayevna', studentInitials: 'AN', topic: "Mashina o'rganish algoritmlari yordamida talabalar muvaffaqiyatini bashorat qilish", supervisor: 'dots. Karimov F.X.', stage: 'Tahrirlash', defenseDate: '20.06.2024', grade: null },
  { id: 'DIP-24-003', student: 'Tursunov Bekzod Sobirovich', studentInitials: 'TB', topic: 'Korxonalarni boshqarishda CRM tizimlarining samaradorligi', supervisor: 'prof. Saidov A.B.', stage: 'Birinchi sharx', defenseDate: '22.06.2024', grade: null },
  { id: 'DIP-24-004', student: 'Yusupova Madina Bahodirovna', studentInitials: 'YM', topic: "Tog'-kon korxonalarida xavfsizlik tizimlarini avtomatlashtirish", supervisor: 'dots. Qodirova L.S.', stage: 'Himoyaga ruxsat', defenseDate: '15.06.2024', grade: null },
  { id: 'DIP-23-187', student: 'Nazarov Sardor Mahmudovich', studentInitials: 'NS', topic: 'Energetika sohasida quyosh panellarini joriy etish samaradorligi', supervisor: 'prof. Ergasheva D.N.', stage: 'Himoyalandi', defenseDate: '24.05.2023', grade: 92 },
  { id: 'DIP-23-156', student: 'Mirzayeva Sevinch Nematovna', studentInitials: 'MS', topic: 'Pedagogik faoliyatda raqamli vositalar samaradorligi', supervisor: 'dots. Hasanov B.O.', stage: 'Himoyalandi', defenseDate: '20.05.2023', grade: 87 },
];

// --- Stage Config ---

const STAGE_COLORS: Record<ThesisStage, string> = {
  'Birinchi sharx': '#3B82F6',
  Tahrirlash: '#F59E0B',
  'Himoyaga ruxsat': '#8B5CF6',
  Himoyalandi: '#2DB976',
};

const STAGE_BADGE_VARIANTS: Record<ThesisStage, 'info' | 'warning' | 'success' | 'default'> = {
  'Birinchi sharx': 'info',
  Tahrirlash: 'warning',
  'Himoyaga ruxsat': 'default',
  Himoyalandi: 'success',
};

const FILTER_TABS: Array<{ id: string; label: string }> = [
  { id: 'Barchasi', label: 'Barchasi' },
  { id: 'Birinchi sharx', label: 'Birinchi sharx' },
  { id: 'Tahrirlash', label: 'Tahrirlash' },
  { id: 'Himoyaga ruxsat', label: 'Himoyaga ruxsat' },
  { id: 'Himoyalandi', label: 'Himoyalandi' },
];

// --- Component ---

export function ThesesPage() {
  const [filter, setFilter] = useState('Barchasi');

  const filtered = useMemo(() => {
    if (filter === 'Barchasi') return THESES;
    return THESES.filter((t) => t.stage === filter);
  }, [filter]);

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

      {/* Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((thesis) => (
          <ThesisCard key={thesis.id} thesis={thesis} />
        ))}
      </div>
    </PageContent>
  );
}

function ThesisCard({ thesis }: { thesis: Thesis }) {
  const topColor = STAGE_COLORS[thesis.stage];

  return (
    <Card className="overflow-hidden">
      {/* Color bar */}
      <div className="h-[3px] -mx-6 -mt-6 mb-4" style={{ backgroundColor: topColor }} />

      {/* Header with ID and badges */}
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {thesis.id}
        </span>
        <Badge variant={STAGE_BADGE_VARIANTS[thesis.stage]} dot>
          {thesis.stage}
        </Badge>
        {thesis.grade !== null && (
          <Badge variant="success">Baho: {thesis.grade}/100</Badge>
        )}
      </div>

      {/* Topic */}
      <h4 className="text-[14px] font-semibold text-slate-900 leading-snug mb-2.5">
        {thesis.topic}
      </h4>

      {/* Student */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
          {thesis.studentInitials}
        </div>
        <span className="text-[13px] font-medium text-slate-900">{thesis.student}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Rahbar: <strong className="text-slate-700">{thesis.supervisor}</strong>
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {thesis.defenseDate}
        </span>
      </div>
    </Card>
  );
}
