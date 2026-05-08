import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { FlaskConical, Zap, CheckCircle2, Banknote, Plus, MapPin, Calendar, Users } from 'lucide-react';
import { useProjects, useArticles, useGrants, useConferences } from '@/api/hooks/useScience';
import type { ResearchProject, Article, Grant, Conference } from '@/types/science';

// --- Helpers ---

function fmtSum(n: number): string {
  return (n / 1_000_000).toFixed(0) + ' mln';
}

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
      const variant = row.type.includes('scopus')
        ? 'success' as const
        : row.type.includes('wos')
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
    key: 'projectName',
    header: 'Loyiha',
    render: (row) => <span className="font-medium text-slate-900">{row.projectName}</span>,
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

  const { data: projectsData, isLoading: projectsLoading } = useProjects({ page: 1, pageSize: 50 });
  const { data: articlesData, isLoading: articlesLoading } = useArticles({ page: 1, pageSize: 50 });
  const { data: grantsData, isLoading: grantsLoading } = useGrants({ page: 1, pageSize: 50 });
  const { data: conferencesData, isLoading: conferencesLoading } = useConferences({ page: 1, pageSize: 50 });

  const projects = projectsData?.data ?? [];
  const articles = articlesData?.data ?? [];
  const grants = grantsData?.data ?? [];
  const conferences = conferencesData?.data ?? [];

  const PAGE_TABS = [
    { id: 'projects', label: 'Loyihalar', count: projectsData?.total ?? 0 },
    { id: 'articles', label: 'Maqolalar', count: articlesData?.total ?? 0 },
    { id: 'grants', label: 'Grantlar', count: grantsData?.total ?? 0 },
    { id: 'conferences', label: 'Konferensiyalar', count: conferencesData?.total ?? 0 },
  ];

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const totalFunding = projects.reduce((s, p) => s + p.fundAmount, 0);

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
          value={activeProjects}
          icon={<FlaskConical className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          sub="+3 yil"
        />
        <StatCard
          label="Jami moliyalashuv"
          value={totalFunding > 0 ? `${(totalFunding / 1_000_000_000).toFixed(1)} mlrd` : '0'}
          sub="so'm"
          icon={<Banknote className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Publikatsiyalar"
          value={articlesData?.total ?? 0}
          sub={`${articles.filter((a) => a.type === 'scopus' || a.type === 'wos').length} Q1/Q2`}
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
        {activeTab === 'projects' && <ProjectsTab projects={projects} isLoading={projectsLoading} />}
        {activeTab === 'articles' && <ArticlesTab articles={articles} isLoading={articlesLoading} />}
        {activeTab === 'grants' && <GrantsTab grants={grants} isLoading={grantsLoading} />}
        {activeTab === 'conferences' && <ConferencesTab conferences={conferences} isLoading={conferencesLoading} />}
      </div>
    </PageContent>
  );
}

function ProjectsTab({ projects, isLoading }: { projects: ResearchProject[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (projects.length === 0) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loyihalar topilmadi</div>;
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  IL-{project.id}
                </span>
                <Badge variant={project.status === 'completed' ? 'default' : 'success'} dot>
                  {project.status === 'completed' ? 'Yakunlandi' : 'Davom etmoqda'}
                </Badge>
                <span className="text-[11px] text-slate-500">
                  {project.startDate} &rarr; {project.endDate}
                </span>
              </div>
              <h4 className="text-[15px] font-semibold text-slate-900 leading-snug mb-2">
                {project.title}
              </h4>
              <div className="flex gap-4 text-xs text-slate-500 flex-wrap">
                <span>
                  <strong className="text-slate-900">{project.leaderName}</strong> &middot; {project.department}
                </span>
                <span>{project.teamSize} ishtirokchi</span>
                <span>{fmtSum(project.fundAmount)} so&apos;m</span>
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

function ArticlesTab({ articles, isLoading }: { articles: Article[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card noPadding>
      <DataTable data={articles} columns={articleColumns} keyField="id" emptyMessage="Maqolalar topilmadi" />
    </Card>
  );
}

function GrantsTab({ grants, isLoading }: { grants: Grant[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card noPadding>
      <DataTable data={grants} columns={grantColumns} keyField="id" emptyMessage="Grantlar topilmadi" />
    </Card>
  );
}

function ConferencesTab({ conferences, isLoading }: { conferences: Conference[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (conferences.length === 0) {
    return <div className="text-center py-10 text-slate-400 text-sm">Konferensiyalar topilmadi</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {conferences.map((conf) => (
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
              <span>{conf.participantCount} ishtirokchi</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
