import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { FlaskConical, Zap, CheckCircle2, Banknote, Plus, MapPin, Calendar, Users, Pencil, Trash2 } from 'lucide-react';
import {
  useProjects, useArticles, useGrants, useConferences,
  useCreateProject, useUpdateProject, useDeleteProject,
  useCreateArticle, useDeleteArticle,
} from '@/api/hooks/useScience';
import { useTeachersList } from '@/api/hooks/useTeachers';
import { ProjectForm } from '../components/ProjectForm';
import { ArticleForm } from '../components/ArticleForm';
import type { ResearchProject, Article, Grant, Conference } from '@/types/science';
import type { ProjectFormData } from '../schemas/project.schema';
import type { ArticleFormData } from '../schemas/article.schema';

function fmtSum(n: number): string {
  return (n / 1_000_000).toFixed(0) + ' mln';
}

function useArticleColumns(onDelete: (a: Article) => void): Column<Article>[] {
  const { t } = useTranslation();
  return [
  {
    key: 'title', header: t('science.article'),
    render: (row) => (
      <div>
        <p className="font-medium text-slate-900">{row.title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{row.authors}</p>
      </div>
    ),
  },
  { key: 'journal', header: t('science.journal'), render: (row) => <span className="text-slate-600">{row.journal}</span> },
  {
    key: 'type', header: t('science.articleType'),
    render: (row) => {
      const variant = row.type.includes('scopus') ? 'success' as const : row.type.includes('wos') ? 'info' as const : 'default' as const;
      return <Badge variant={variant}>{row.type}</Badge>;
    },
  },
  { key: 'year', header: t('science.year'), width: '80px', className: 'text-right', render: (row) => <span className="tabular-nums text-slate-500">{row.year}</span> },
  { key: 'citations', header: t('science.citation'), width: '80px', className: 'text-right', render: (row) => <span className="tabular-nums font-semibold text-slate-900">{row.citations}</span> },
  {
    key: 'actions', header: '',
    render: (row) => (
      <button type="button" onClick={() => onDelete(row)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    ),
  },
];
}

function useGrantColumns(): Column<Grant>[] {
  const { t } = useTranslation();
  return [
  { key: 'projectName', header: t('science.grantProject'), render: (row) => <span className="font-medium text-slate-900">{row.projectName}</span> },
  { key: 'sponsor', header: t('science.grantSponsorLabel'), render: (row) => <span className="text-slate-600">{row.sponsor}</span> },
  {
    key: 'amount', header: t('science.grantAmount'), className: 'text-right',
    render: (row) => <span className="tabular-nums font-medium">{fmtSum(row.amount)} so&apos;m</span>,
  },
  {
    key: 'status', header: t('common.status'),
    render: (row) => {
      const labelKeys: Record<Grant['status'], string> = { active: 'science.grantStatusActive', completed: 'science.grantStatusCompleted', pending: 'science.grantStatusPending' };
      const variants: Record<Grant['status'], 'success' | 'default' | 'warning'> = { active: 'success', completed: 'default', pending: 'warning' };
      return <Badge variant={variants[row.status]} dot>{t(labelKeys[row.status])}</Badge>;
    },
  },
];
}

export function ResearchPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('projects');
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<ResearchProject | null>(null);
  const [deleteProject, setDeleteProject] = useState<ResearchProject | null>(null);
  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [deleteArticle, setDeleteArticle] = useState<Article | null>(null);

  const { data: projectsData, isLoading: projectsLoading } = useProjects({ page: 1, pageSize: 50 });
  const { data: articlesData, isLoading: articlesLoading } = useArticles({ page: 1, pageSize: 50 });
  const { data: grantsData, isLoading: grantsLoading } = useGrants({ page: 1, pageSize: 50 });
  const { data: conferencesData, isLoading: conferencesLoading } = useConferences({ page: 1, pageSize: 50 });
  const { data: teachersData } = useTeachersList({ page: 1, pageSize: 100 });

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const createArticle = useCreateArticle();
  const deleteArticleMutation = useDeleteArticle();

  const projects = projectsData?.data ?? [];
  const articles = articlesData?.data ?? [];
  const grants = grantsData?.data ?? [];
  const conferences = conferencesData?.data ?? [];
  const leaders = (teachersData?.data ?? []).map((t) => ({ id: t.id, fullName: t.fullName }));

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const totalFunding = projects.reduce((s, p) => s + p.fundAmount, 0);

  const PAGE_TABS = [
    { id: 'projects', label: t('science.tabProjects'), count: projectsData?.total ?? 0 },
    { id: 'articles', label: t('science.tabArticles'), count: articlesData?.total ?? 0 },
    { id: 'grants', label: t('science.tabGrants'), count: grantsData?.total ?? 0 },
    { id: 'conferences', label: t('science.tabConferences'), count: conferencesData?.total ?? 0 },
  ];

  const handleCreateProject = (data: ProjectFormData) => {
    createProject.mutate(
      { ...data, leaderId: Number(data.leaderId), fundAmount: Number(data.fundAmount) },
      { onSuccess: () => setProjectFormOpen(false) },
    );
  };

  const handleEditProject = (data: ProjectFormData) => {
    if (!editProject) return;
    updateProject.mutate(
      { id: editProject.id, data: { ...data, leaderId: Number(data.leaderId), fundAmount: Number(data.fundAmount) } },
      { onSuccess: () => setEditProject(null) },
    );
  };

  const handleCreateArticle = (data: ArticleFormData) => {
    createArticle.mutate(
      { ...data, year: Number(data.year) },
      { onSuccess: () => setArticleFormOpen(false) },
    );
  };

  const tabActions: Record<string, React.ReactNode> = {
    projects: (
      <Button variant="primary" size="sm" onClick={() => setProjectFormOpen(true)}>
        <Plus className="h-4 w-4 mr-1.5" /> {t('science.newProject')}
      </Button>
    ),
    articles: (
      <Button variant="primary" size="sm" onClick={() => setArticleFormOpen(true)}>
        <Plus className="h-4 w-4 mr-1.5" /> {t('science.newArticle')}
      </Button>
    ),
  };

  return (
    <PageContent>
      <PageHeader
        title={t('science.researchTitle')}
        subtitle={t('science.researchSubtitle')}
        breadcrumbs={[{ label: t('nav.science') }, { label: t('nav.research') }]}
        actions={tabActions[activeTab]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard
          label={t('science.activeProjects')}
          value={activeProjects}
          icon={<FlaskConical className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          sub={t('science.perYear')}
        />
        <StatCard
          label={t('science.totalFunding')}
          value={totalFunding > 0 ? `${(totalFunding / 1_000_000_000).toFixed(1)} mlrd` : '0'}
          sub="so'm"
          icon={<Banknote className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label={t('science.publications')}
          value={articlesData?.total ?? 0}
          sub={`${articles.filter((a) => a.type === 'scopus' || a.type === 'wos').length} Q1/Q2`}
          icon={<Zap className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label={t('science.hIndex')}
          value="23.4"
          sub={t('science.hIndexSub')}
          icon={<CheckCircle2 className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
      </div>

      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            isLoading={projectsLoading}
            onEdit={(p) => setEditProject(p)}
            onDelete={(p) => setDeleteProject(p)}
          />
        )}
        {activeTab === 'articles' && (
          <ArticlesTab
            articles={articles}
            isLoading={articlesLoading}
            onDelete={(a) => setDeleteArticle(a)}
          />
        )}
        {activeTab === 'grants' && <GrantsTab grants={grants} isLoading={grantsLoading} />}
        {activeTab === 'conferences' && <ConferencesTab conferences={conferences} isLoading={conferencesLoading} />}
      </div>

      <ProjectForm
        open={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        onSubmit={handleCreateProject}
        leaders={leaders}
        loading={createProject.isPending}
      />

      <ProjectForm
        open={!!editProject}
        onClose={() => setEditProject(null)}
        onSubmit={handleEditProject}
        project={editProject}
        leaders={leaders}
        loading={updateProject.isPending}
      />

      <ArticleForm
        open={articleFormOpen}
        onClose={() => setArticleFormOpen(false)}
        onSubmit={handleCreateArticle}
        loading={createArticle.isPending}
      />

      <ConfirmDialog
        open={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={() => {
          if (!deleteProject) return;
          deleteProjectMutation.mutate(deleteProject.id, { onSuccess: () => setDeleteProject(null) });
        }}
        title={t('science.deleteProjectTitle')}
        message={t('science.deleteProjectConfirm', { title: deleteProject?.title })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteProjectMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteArticle}
        onClose={() => setDeleteArticle(null)}
        onConfirm={() => {
          if (!deleteArticle) return;
          deleteArticleMutation.mutate(deleteArticle.id, { onSuccess: () => setDeleteArticle(null) });
        }}
        title={t('science.deleteArticleTitle')}
        message={t('science.deleteArticleConfirm', { title: deleteArticle?.title })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteArticleMutation.isPending}
      />
    </PageContent>
  );
}

function ProjectsTab({
  projects, isLoading, onEdit, onDelete,
}: {
  projects: ResearchProject[];
  isLoading: boolean;
  onEdit: (p: ResearchProject) => void;
  onDelete: (p: ResearchProject) => void;
}) {
  const { t } = useTranslation();
  if (isLoading) return <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>;
  if (projects.length === 0) return <div className="text-center py-10 text-slate-400 text-sm">{t('science.projectsNotFound')}</div>;

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
                  {project.status === 'completed' ? t('science.projectCompleted') : t('science.projectStatus')}
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
                <span>{project.teamSize} {t('science.participants')}</span>
                <span>{fmtSum(project.fundAmount)} so&apos;m</span>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <button type="button" onClick={() => onEdit(project)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => onDelete(project)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="w-32 text-right shrink-0">
              <span className="text-xl font-bold text-slate-900 tabular-nums">{project.progress}%</span>
              <div className="h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${project.progress}%`, backgroundColor: project.progress === 100 ? '#94A3B8' : '#2DB976' }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ArticlesTab({ articles, isLoading, onDelete }: { articles: Article[]; isLoading: boolean; onDelete: (a: Article) => void }) {
  const { t } = useTranslation();
  const columns = useArticleColumns(onDelete);
  if (isLoading) return <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>;
  return (
    <Card noPadding>
      <DataTable data={articles} columns={columns} keyField="id" emptyMessage={t('science.articlesNotFound')} />
    </Card>
  );
}

function GrantsTab({ grants, isLoading }: { grants: Grant[]; isLoading: boolean }) {
  const { t } = useTranslation();
  const columns = useGrantColumns();
  if (isLoading) return <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>;
  return (
    <Card noPadding>
      <DataTable data={grants} columns={columns} keyField="id" emptyMessage={t('science.grantsNotFound')} />
    </Card>
  );
}

function ConferencesTab({ conferences, isLoading }: { conferences: Conference[]; isLoading: boolean }) {
  const { t } = useTranslation();
  if (isLoading) return <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>;
  if (conferences.length === 0) return <div className="text-center py-10 text-slate-400 text-sm">{t('science.conferencesNotFound')}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {conferences.map((conf) => (
        <Card key={conf.id}>
          <h4 className="text-[14px] font-semibold text-slate-900 leading-snug mb-3">{conf.name}</h4>
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
              <span>{t('science.participantCount', { count: conf.participantCount })}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
