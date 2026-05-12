import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, MoreHorizontal, X, FileDown } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, Pagination } from '@/components/table';
import type { Column } from '@/components/table';
import { Card, StatCard } from '@/components/data-display';
import { Avatar, Badge, Button } from '@/components/ui';
import type { LeadListItem, LeadStatus, LeadSource } from '@/types/crm';
import { useLeads, useCrmStats, useCreateLead, useDeleteLead, useBulkUpdateLeadStatus } from '@/api/hooks/useCrm';
import { ConfirmDialog } from '@/components/overlays';
import { LeadForm } from '../components/LeadForm';

import type { CreateLeadFormData } from '../schemas/lead.schema';

const STATUS_KEYS: Record<LeadStatus, string> = {
  new: 'crm.statusNew',
  contacted: 'crm.statusContacted',
  interested: 'crm.statusInterested',
  applied: 'crm.statusApplied',
  enrolled: 'crm.statusEnrolled',
  rejected: 'crm.statusRejected',
};

const SOURCE_KEYS: Record<LeadSource, string> = {
  website: 'crm.sourceWebsite',
  telegram: 'crm.sourceTelegram',
  instagram: 'crm.sourceInstagram',
  referral: 'crm.sourceReferral',
  event: 'crm.sourceEvent',
  call: 'crm.sourceCall',
};

const STATUS_TABS: Array<LeadStatus | 'all'> = ['all', 'new', 'contacted', 'interested', 'applied', 'enrolled', 'rejected'];
const STATUS_TAB_KEYS: Record<LeadStatus | 'all', string> = {
  all: 'crm.allLabel',
  ...STATUS_KEYS,
};

const STATUS_BADGE_VARIANT: Record<LeadStatus, 'info' | 'warning' | 'default' | 'success' | 'error'> = {
  new: 'info',
  contacted: 'warning',
  interested: 'default',
  applied: 'default',
  enrolled: 'success',
  rejected: 'error',
};

const SOURCE_VARIANT: Record<LeadSource, 'info' | 'success' | 'warning' | 'default'> = {
  website: 'success',
  telegram: 'info',
  instagram: 'warning',
  referral: 'default',
  event: 'default',
  call: 'default',
};

const PAGE_SIZE = 10;

export function CrmListPage() {
  const { t } = useTranslation();
  const [statusTab, setStatusTab] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteLead, setDeleteLead] = useState<LeadListItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<LeadStatus | ''>('');
  const createLead = useCreateLead();
  const deleteLeadMutation = useDeleteLead();
  const bulkUpdate = useBulkUpdateLeadStatus();
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('');
  const [page, setPage] = useState(1);

  const { data: leadsData } = useLeads({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    status: statusTab !== 'all' ? statusTab : undefined,
    source: sourceFilter || undefined,
  });

  const { data: stats } = useCrmStats();

  const leads = leadsData?.data ?? [];
  const total = leadsData?.total ?? 0;
  const totalPages = leadsData?.totalPages ?? 1;

  const columns: Column<LeadListItem>[] = useMemo(() => [
    {
      key: 'id',
      header: '#',
      width: '60px',
      render: (row) => (
        <span className="text-xs text-muted tabular-nums">
          #{String(row.id).padStart(4, '0')}
        </span>
      ),
    },
    {
      key: 'firstName',
      header: t('crm.applicant'),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={`${row.lastName} ${row.firstName}`} size="sm" />
          <div>
            <div className="font-medium text-slate-900">
              {row.lastName} {row.firstName?.[0] ?? ''}.
            </div>
            <div className="text-xs text-muted">{row.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'direction',
      header: t('crm.direction'),
      render: (row) => <span className="text-[13px]">{row.direction}</span>,
    },
    {
      key: 'source',
      header: t('crm.source'),
      render: (row) => (
        <Badge variant={SOURCE_VARIANT[row.source]}>{t(SOURCE_KEYS[row.source])}</Badge>
      ),
    },
    {
      key: 'assigneeName',
      header: t('common.assignee'),
      render: (row) => <span className="text-[13px]">{row.assigneeName}</span>,
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => (
        <Badge variant={STATUS_BADGE_VARIANT[row.status]} dot>
          {t(STATUS_KEYS[row.status])}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: t('common.date'),
      render: (row) => (
        <span className="text-xs text-muted">{row.createdAt}</span>
      ),
    },
  ], []);

  return (
    <PageContent>
      <PageHeader
        title={t('crm.listTitle')}
        subtitle={t('crm.listSubtitle')}
        breadcrumbs={[
          { label: 'CRM', path: '/crm' },
          { label: 'Arizalar' },
        ]}
        actions={
          <Button
            variant="secondary"
            leftIcon={<FileDown className="h-4 w-4" />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = '/api/v1/crm/leads/export/';
              a.download = 'arizalar.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Excel
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label={t('crm.totalApplications')} value={String(stats?.totalLeads ?? '-')} sub={t('crm.thisWeek')} />
        <StatCard label={t('crm.statusNew')} value={String(stats?.newLeads ?? '-')} sub={t('crm.newUnreviewed')} />
        <StatCard label={t('crm.conversion')} value={`${stats?.conversionRate ?? '-'}%`} sub={t('crm.thisMonth')} />
        <StatCard label={t('crm.enrolled')} value={String(stats?.enrolledLeads ?? '-')} sub={t('crm.thisYear')} />
        <StatCard label={t('crm.avgTime')} value="3.2 kun" sub={t('crm.responseTime')} />
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5">
          <span className="text-sm font-medium text-primary-700">{t('crm.selectedCount', { count: selectedIds.size })}</span>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as LeadStatus | '')}
              className="h-8 rounded-lg border border-border px-2 text-sm"
            >
              <option value="">{t('crm.selectStatus')}</option>
              {(Object.keys(STATUS_KEYS) as LeadStatus[]).map((s) => (
                <option key={s} value={s}>{t(STATUS_KEYS[s])}</option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={!bulkStatus || bulkUpdate.isPending}
              onClick={() => {
                if (!bulkStatus) return;
                bulkUpdate.mutate(
                  { ids: [...selectedIds].map(Number), status: bulkStatus },
                  { onSuccess: () => { setSelectedIds(new Set()); setBulkStatus(''); } },
                );
              }}
            >
              {t('crm.apply')}
            </Button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-1 rounded p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <Card noPadding className="mb-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#F1F5F9] px-4 py-3">
          {/* Status Tabs */}
          <div className="flex gap-1 rounded-[10px] bg-[#F1F5F9] p-[3px]">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusTab(s); setPage(1); }}
                className={
                  statusTab === s
                    ? 'rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-900 shadow-sm'
                    : 'rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-muted hover:text-slate-700'
                }
              >
                {t(STATUS_TAB_KEYS[s])}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('crm.searchPlaceholder')}
              className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
          </div>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value as LeadSource | ''); setPage(1); }}
            className="h-9 w-[160px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">{t('crm.allSources')}</option>
            {(Object.keys(SOURCE_KEYS) as LeadSource[]).map((s) => (
              <option key={s} value={s}>{t(SOURCE_KEYS[s])}</option>
            ))}
          </select>

          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            {t('crm.newApplication')}
          </Button>
        </div>

        {/* Table */}
        <DataTable<LeadListItem>
          data={leads}
          columns={columns}
          keyField="id"
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={() => (
            <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        />

        <div className="border-t border-[#F1F5F9] px-4 py-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            total={total}
            pageSize={PAGE_SIZE}
          />
        </div>
      </Card>

      <LeadForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data: CreateLeadFormData) => {
          createLead.mutate(data, { onSuccess: () => setFormOpen(false) });
        }}
        loading={createLead.isPending}
      />

      <ConfirmDialog
        open={!!deleteLead}
        onClose={() => setDeleteLead(null)}
        onConfirm={() => {
          if (!deleteLead) return;
          deleteLeadMutation.mutate(deleteLead.id, { onSuccess: () => setDeleteLead(null) });
        }}
        title={t('crm.deleteApplicationTitle')}
        message={t('crm.deleteApplicationConfirm', { name: `${deleteLead?.firstName} ${deleteLead?.lastName}` })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteLeadMutation.isPending}
      />
    </PageContent>
  );
}
