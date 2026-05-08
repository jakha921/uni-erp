import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { FlaskConical, Zap, CheckCircle2, Banknote, Plus, MapPin, Calendar, Users } from 'lucide-react';

// --- Types ---

interface Project {
  id: string;
  title: string;
  leader: string;
  department: string;
  team: number;
  fund: number;
  start: string;
  end: string;
  status: 'active' | 'completed';
  progress: number;
}

interface Article {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: string;
  citations: number;
}

interface Grant {
  id: number;
  project: string;
  sponsor: string;
  amount: number;
  status: 'active' | 'completed' | 'pending';
}

interface Conference {
  id: number;
  name: string;
  date: string;
  location: string;
  participants: number;
}

// --- Mock Data ---

const PROJECTS: Project[] = [
  { id: 'IL-2024-08', title: 'Navoiy viloyatida raqamli iqtisodiyot va elektron tijorat rivojlanishi', leader: 'prof. Saidov A.B.', department: 'Iqtisodiyot nazariyasi', team: 6, fund: 250_000_000, start: '01.2024', end: '12.2026', status: 'active', progress: 35 },
  { id: 'IL-2024-12', title: "Sun'iy intellekt asosida talabalar o'zlashtirishini bashorat qilish", leader: 'dots. Karimov F.X.', department: 'Axborot tizimlari', team: 4, fund: 180_000_000, start: '03.2024', end: '06.2025', status: 'active', progress: 62 },
  { id: 'IL-2023-21', title: "Tog'-kon sanoatida energiya samaradorligini oshirish texnologiyalari", leader: 'dots. Nazarov H.S.', department: "Tog'-kon texnologiyalari", team: 8, fund: 420_000_000, start: '01.2023', end: '12.2025', status: 'active', progress: 78 },
  { id: 'IL-2023-05', title: 'Smart-kampus: IoT asosida universitet infrastrukturasini boshqarish', leader: 'prof. Yusupova M.K.', department: 'Dasturiy injiniring', team: 5, fund: 160_000_000, start: '02.2023', end: '02.2025', status: 'completed', progress: 100 },
  { id: 'IL-2024-15', title: "O'zbek tilini qayta ishlash uchun NLP modellari", leader: 'dots. Ergashev D.R.', department: 'Axborot tizimlari', team: 3, fund: 120_000_000, start: '06.2024', end: '06.2026', status: 'active', progress: 18 },
  { id: 'IL-2022-33', title: "Navoiy viloyati sanoat korxonalarida ekologik monitoring tizimi", leader: 'prof. Qodirova L.S.', department: 'Ekologiya', team: 7, fund: 310_000_000, start: '01.2022', end: '12.2024', status: 'completed', progress: 100 },
];

const ARTICLES: Article[] = [
  { id: 1, title: 'Digital economy adoption in Central Asia: 5-year cohort study', authors: 'Saidov A.B., Tursunov R.M., et al.', journal: 'Journal of Economic Studies', year: 2024, type: 'Q1 Scopus', citations: 12 },
  { id: 2, title: "Dasturlash fanlarini o'qitishda zamonaviy metodlar", authors: 'Nazarov H.S.', journal: 'NIU Ilmiy axborotnomasi', year: 2024, type: 'OAK', citations: 3 },
  { id: 3, title: 'Predictive analytics in higher education: 18-month study', authors: 'Karimov F.X., Hasanov B.O.', journal: 'Computers & Education', year: 2023, type: 'Q1 Scopus', citations: 47 },
  { id: 4, title: "Tog'-kon sanoatida avtomatlashtirish tizimlari", authors: 'Yusupova M.K., Qodirova L.S.', journal: 'Texnika va texnologiya', year: 2023, type: 'OAK', citations: 8 },
  { id: 5, title: 'IoT-based campus management: architecture and implementation', authors: 'Yusupova M.K., Ergashev D.R.', journal: 'IEEE Access', year: 2024, type: 'Q2 Scopus', citations: 5 },
  { id: 6, title: "Ekologik monitoring tizimlarida katta ma'lumotlar tahlili", authors: 'Qodirova L.S., Rahimov T.N.', journal: "Fan va texnologiya", year: 2023, type: 'OAK', citations: 2 },
  { id: 7, title: 'Machine learning approaches for student retention', authors: 'Karimov F.X.', journal: 'Education and Information Technologies', year: 2024, type: 'Q1 Scopus', citations: 21 },
  { id: 8, title: "NLP for Uzbek language: challenges and solutions", authors: 'Ergashev D.R., Karimov F.X.', journal: 'ACL Workshop', year: 2024, type: 'Q2 Scopus', citations: 3 },
];

const GRANTS: Grant[] = [
  { id: 1, project: 'Raqamli iqtisodiyot tadqiqoti', sponsor: "O'zbekiston Fanlar akademiyasi", amount: 250_000_000, status: 'active' },
  { id: 2, project: "AI asosida ta'limni takomillashtirish", sponsor: 'UNDP', amount: 180_000_000, status: 'active' },
  { id: 3, project: 'Energiya samaradorligi loyihasi', sponsor: 'Vazirlar Mahkamasi', amount: 420_000_000, status: 'active' },
  { id: 4, project: 'Smart-kampus IoT', sponsor: 'KOICA', amount: 160_000_000, status: 'completed' },
  { id: 5, project: "O'zbek tili NLP modellari", sponsor: 'Google Research', amount: 120_000_000, status: 'pending' },
];

const CONFERENCES: Conference[] = [
  { id: 1, name: "Xalqaro ilmiy-amaliy konferensiya: Raqamli iqtisodiyot", date: '12-13.03.2026', location: "Navoiy shahri, NIU bosh binosi", participants: 240 },
  { id: 2, name: "IT va ta'lim integratsiyasi forumi", date: '15.05.2026', location: 'Toshkent, TATU', participants: 180 },
  { id: 3, name: "Tog'-kon sanoati innovatsiyalari", date: '20-21.09.2025', location: 'Navoiy shahri', participants: 150 },
  { id: 4, name: "Yosh olimlar simpozimi 2026", date: '10.11.2026', location: "NIU konferens-zali", participants: 95 },
];

// --- Helpers ---

function fmtSum(n: number): string {
  return (n / 1_000_000).toFixed(0) + ' mln';
}

// --- Tab Config ---

const PAGE_TABS = [
  { id: 'projects', label: 'Loyihalar', count: PROJECTS.length },
  { id: 'articles', label: 'Maqolalar', count: ARTICLES.length },
  { id: 'grants', label: 'Grantlar', count: GRANTS.length },
  { id: 'conferences', label: 'Konferensiyalar', count: CONFERENCES.length },
];

// --- Article Columns ---

const articleColumns: Column<Article>[] = [
  {
    key: 'title',
    header: 'Maqola',
    render: (row) => (
      <div>
        <p className="font-medium text-slate-900">{row.title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{row.authors}</p>
      </div>
    ),
  },
  {
    key: 'journal',
    header: 'Jurnal',
    render: (row) => <span className="text-slate-600">{row.journal}</span>,
  },
  {
    key: 'type',
    header: 'Tur',
    render: (row) => {
      const variant = row.type.includes('Q1')
        ? 'success' as const
        : row.type.includes('Q2')
          ? 'info' as const
          : 'default' as const;
      return <Badge variant={variant}>{row.type}</Badge>;
    },
  },
  {
    key: 'year',
    header: 'Yil',
    width: '80px',
    className: 'text-right',
    render: (row) => <span className="tabular-nums text-slate-500">{row.year}</span>,
  },
  {
    key: 'citations',
    header: 'Iqtibos',
    width: '80px',
    className: 'text-right',
    render: (row) => <span className="tabular-nums font-semibold text-slate-900">{row.citations}</span>,
  },
];

// --- Grant Columns ---

const grantColumns: Column<Grant>[] = [
  {
    key: 'project',
    header: 'Loyiha',
    render: (row) => <span className="font-medium text-slate-900">{row.project}</span>,
  },
  {
    key: 'sponsor',
    header: 'Moliyalashtiruvchi',
    render: (row) => <span className="text-slate-600">{row.sponsor}</span>,
  },
  {
    key: 'amount',
    header: 'Summa',
    className: 'text-right',
    render: (row) => <span className="tabular-nums font-medium">{fmtSum(row.amount)} so&apos;m</span>,
  },
  {
    key: 'status',
    header: 'Holat',
    render: (row) => {
      const labels: Record<Grant['status'], string> = { active: 'Faol', completed: 'Yakunlangan', pending: 'Kutilmoqda' };
      const variants: Record<Grant['status'], 'success' | 'default' | 'warning'> = { active: 'success', completed: 'default', pending: 'warning' };
      return <Badge variant={variants[row.status]} dot>{labels[row.status]}</Badge>;
    },
  },
];

// --- Component ---

export function ResearchPage() {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <PageContent>
      <PageHeader
        title="Ilmiy ishlar"
        subtitle="Ilmiy loyihalar, maqolalar va grantlar"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Ilmiy ishlar' }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>Yangi loyiha</Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Faol loyihalar"
          value={14}
          icon={<FlaskConical className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          sub="+3 yil"
        />
        <StatCard
          label="Jami moliyalashuv"
          value="2.4 mlrd"
          sub="so'm"
          icon={<Banknote className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="2024 publikatsiyalar"
          value={47}
          sub="12 Q1/Q2"
          icon={<Zap className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Hirsh indeksi (jami)"
          value="23.4"
          sub="kafedra o'rtacha"
          icon={<CheckCircle2 className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'articles' && <ArticlesTab />}
        {activeTab === 'grants' && <GrantsTab />}
        {activeTab === 'conferences' && <ConferencesTab />}
      </div>
    </PageContent>
  );
}

function ProjectsTab() {
  return (
    <div className="space-y-3">
      {PROJECTS.map((project) => (
        <Card key={project.id}>
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  {project.id}
                </span>
                <Badge variant={project.status === 'completed' ? 'default' : 'success'} dot>
                  {project.status === 'completed' ? 'Yakunlandi' : 'Davom etmoqda'}
                </Badge>
                <span className="text-[11px] text-slate-500">
                  {project.start} &rarr; {project.end}
                </span>
              </div>
              <h4 className="text-[15px] font-semibold text-slate-900 leading-snug mb-2">
                {project.title}
              </h4>
              <div className="flex gap-4 text-xs text-slate-500 flex-wrap">
                <span>
                  <strong className="text-slate-900">{project.leader}</strong> &middot; {project.department}
                </span>
                <span>{project.team} ishtirokchi</span>
                <span>{fmtSum(project.fund)} so&apos;m</span>
              </div>
            </div>
            <div className="w-32 text-right shrink-0">
              <span className="text-xl font-bold text-slate-900 tabular-nums">{project.progress}%</span>
              <div className="h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${project.progress}%`,
                    backgroundColor: project.progress === 100 ? '#94A3B8' : '#2DB976',
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ArticlesTab() {
  return (
    <Card noPadding>
      <DataTable data={ARTICLES} columns={articleColumns} keyField="id" emptyMessage="Maqolalar topilmadi" />
    </Card>
  );
}

function GrantsTab() {
  return (
    <Card noPadding>
      <DataTable data={GRANTS} columns={grantColumns} keyField="id" emptyMessage="Grantlar topilmadi" />
    </Card>
  );
}

function ConferencesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {CONFERENCES.map((conf) => (
        <Card key={conf.id}>
          <h4 className="text-[14px] font-semibold text-slate-900 leading-snug mb-3">
            {conf.name}
          </h4>
          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{conf.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{conf.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>{conf.participants} ishtirokchi</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
