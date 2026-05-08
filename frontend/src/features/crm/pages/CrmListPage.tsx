import { useState, useMemo } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, Pagination } from '@/components/table';
import type { Column } from '@/components/table';
import { Card, StatCard } from '@/components/data-display';
import { Avatar, Badge, Button } from '@/components/ui';
import type { Lead, LeadStatus, LeadSource } from '@/types/crm';
import { generateName, generatePhone, pick, rnum, DIRECTIONS } from '@/api/mock/shared-data';

const CRM_STATUSES: LeadStatus[] = ['Yangi', "Qo'ng'iroq", 'Kutilmoqda', 'Qabul', 'Rad'];
const CRM_SOURCES: LeadSource[] = ['Website', 'Telegram', 'Instagram', 'Referral'];
const ASSIGNEES = ['Olimov B.', 'Nazarova M.', 'Saidov R.', 'Xolmatova D.'];

const LEADS: Lead[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: generateName(i + 201, 0.48),
  phone: generatePhone(i + 203),
  direction: pick(DIRECTIONS, i + 205),
  source: pick(CRM_SOURCES, i + 207),
  status: pick(CRM_STATUSES, i + 209),
  assignee: pick(ASSIGNEES, i + 211),
  date: `${rnum(i + 213, 1, 23)}.04.2026`,
}));

const STATUS_TABS: Array<LeadStatus | 'Barchasi'> = ['Barchasi', 'Yangi', "Qo'ng'iroq", 'Kutilmoqda', 'Qabul', 'Rad'];

const STATUS_BADGE_VARIANT: Record<LeadStatus, 'info' | 'warning' | 'default' | 'success' | 'error'> = {
  Yangi: 'info',
  "Qo'ng'iroq": 'warning',
  Kutilmoqda: 'default',
  Qabul: 'success',
  Rad: 'error',
};

const SOURCE_VARIANT: Record<LeadSource, 'info' | 'success' | 'warning' | 'default'> = {
  Website: 'success',
  Telegram: 'info',
  Instagram: 'warning',
  Referral: 'default',
};

const PAGE_SIZE = 10;

export function CrmListPage() {
  const [statusTab, setStatusTab] = useState<LeadStatus | 'Barchasi'>('Barchasi');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return LEADS.filter((lead) => {
      if (statusTab !== 'Barchasi' && lead.status !== statusTab) return false;
      if (sourceFilter && lead.source !== sourceFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !lead.name.full.toLowerCase().includes(q) &&
          !lead.phone.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [statusTab, search, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  const columns: Column<Lead>[] = [
    {
      key: 'id',
      header: '№',
      width: '60px',
      render: (row) => (
        <span className="text-xs text-muted tabular-nums">
          #{String(row.id).padStart(4, '0')}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Abituriyent',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name.full} size="sm" />
          <div>
            <div className="font-medium text-slate-900">{row.name.short}</div>
            <div className="text-xs text-muted">{row.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'direction',
      header: "Yo'nalish",
      render: (row) => <span className="text-[13px]">{row.direction}</span>,
    },
    {
      key: 'source',
      header: 'Manba',
      render: (row) => (
        <Badge variant={SOURCE_VARIANT[row.source]}>{row.source}</Badge>
      ),
    },
    {
      key: 'assignee',
      header: "Mas'ul",
      render: (row) => <span className="text-[13px]">{row.assignee}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={STATUS_BADGE_VARIANT[row.status]} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Sana',
      render: (row) => (
        <span className="text-xs text-muted">{row.date}</span>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Arizalar (CRM)"
        subtitle="Abituriyentlar va qabul jarayoni"
        breadcrumbs={[
          { label: 'CRM', path: '/crm' },
          { label: 'Arizalar' },
        ]}
      />

      {/* KPI Cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Jami arizalar" value="248" sub="+23 bu hafta" />
        <StatCard label="Yangi" value="42" sub="Ko'rib chiqilmagan" />
        <StatCard label="Konversiya" value="28%" sub="+4% bu oy" />
        <StatCard label="Qabul qilindi" value="69" sub="Bu yil" />
        <StatCard label="O'rtacha vaqt" value="3.2 kun" sub="Javob vaqti" />
      </div>

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
                {s}
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
              placeholder="Ism yoki telefon..."
              className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
          </div>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value as LeadSource | ''); setPage(1); }}
            className="h-9 w-[160px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha manbalar</option>
            {CRM_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Yangi ariza
          </Button>
        </div>

        {/* Table */}
        <DataTable<Lead>
          data={paginated}
          columns={columns}
          keyField="id"
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
            total={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </Card>
    </PageContent>
  );
}
