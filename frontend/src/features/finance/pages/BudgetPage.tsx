import { useState } from 'react';
import { Target, CheckCircle, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, type Column } from '@/components/table';
import { Button, Badge, Spinner } from '@/components/ui';
import { StatCard, Card } from '@/components/data-display';
import { formatMoney } from '@/lib/utils';
import { useBudgetCategories, useBudgetSummary } from '@/api/hooks/useBudget';
import type { BudgetCategory } from '@/types/finance';

const CATEGORY_COLORS: Record<string, string> = {
  'Ish haqi': '#3B82F6',
  'Kommunal xizmatlar': '#F59E0B',
  "Ta'mirlash": '#2DB976',
  'Jihozlar': '#8B5CF6',
  'Transport': '#EC4899',
  'Stipendiya': '#06B6D4',
  'Boshqa xarajatlar': '#94A3B8',
};

const DEFAULT_COLOR = '#64748B';

function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? DEFAULT_COLOR;
}

export function BudgetPage() {
  const [year] = useState(2026);

  const { data: categoriesData, isLoading: isLoadingCategories } = useBudgetCategories({ year });
  const { data: summary, isLoading: isLoadingSummary } = useBudgetSummary(year);

  const categories = categoriesData ?? [];

  const totalPlanned = summary?.totalPlanned ?? categories.reduce((s: number, c: BudgetCategory) => s + c.planned, 0);
  const totalSpent = summary?.totalSpent ?? categories.reduce((s: number, c: BudgetCategory) => s + c.spent, 0);
  const totalRemaining = summary?.totalRemaining ?? (totalPlanned - totalSpent);
  const totalPercent = totalPlanned > 0 ? Math.round((totalSpent / totalPlanned) * 100) : 0;

  const columns: Column<BudgetCategory>[] = [
    {
      key: 'idx',
      header: '№',
      width: '50px',
      render: (_, index) => <span className="text-slate-500">{index + 1}</span>,
    },
    {
      key: 'name',
      header: 'Kategoriya',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: getCategoryColor(row.name) }}
          />
          <span className="font-medium text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'planned',
      header: 'Rejalashtirilgan',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-slate-600">{formatMoney(row.planned)}</span>
      ),
    },
    {
      key: 'spent',
      header: 'Sarflangan',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold text-slate-900">{formatMoney(row.spent)}</span>
      ),
    },
    {
      key: 'remaining',
      header: 'Qoldiq',
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums text-green-700">{formatMoney(row.remaining)}</span>
      ),
    },
    {
      key: 'percentUsed',
      header: 'Ijro %',
      width: '220px',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(row.percentUsed, 100)}%`,
                backgroundColor: getCategoryColor(row.name),
              }}
            />
          </div>
          <Badge
            variant={row.percentUsed >= 90 ? 'error' : row.percentUsed >= 75 ? 'warning' : 'success'}
          >
            {row.percentUsed}%
          </Badge>
        </div>
      ),
    },
  ];

  const isLoading = isLoadingCategories || isLoadingSummary;

  return (
    <PageContent>
      <PageHeader
        title="Byudjet"
        subtitle={`Daromad va xarajatlar rejasi va ijrosi - ${year}`}
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: 'Byudjet' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" leftIcon={<Target className="h-4 w-4" />}>
              Hisobot
            </Button>
            <Button leftIcon={<CheckCircle className="h-4 w-4" />}>Xarajat hujjati</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-5">
        <StatCard
          label="Umumiy byudjet"
          value={formatMoney(totalPlanned)}
          icon={<Target className="h-5 w-5" />}
          iconBg="bg-blue-500"
        />
        <StatCard
          label="Sarflangan"
          value={formatMoney(totalSpent)}
          icon={<CheckCircle className="h-5 w-5" />}
          iconBg="bg-emerald-500"
          sub={`April ${year} holatiga`}
        />
        <StatCard
          label="Qoldiq"
          value={formatMoney(totalRemaining)}
          icon={<Wallet className="h-5 w-5" />}
          iconBg="bg-amber-500"
        />
        <StatCard
          label="Ijro foizi"
          value={`${totalPercent}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBg="bg-violet-500"
          trend={{ value: 2, label: "o'tgan oyga" }}
        />
      </div>

      <Card title="Byudjet kategoriyalari" subtitle="Xarajat moddalari bo'yicha reja va ijro" noPadding>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable
            data={categories}
            columns={columns}
            keyField="id"
            emptyMessage="Kategoriyalar topilmadi"
          />
        )}
      </Card>

      <Card className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-900">Umumiy ijro</span>
          <span className="text-sm font-bold text-slate-900">{totalPercent}%</span>
        </div>
        <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
            style={{ width: `${Math.min(totalPercent, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Sarflangan: {formatMoney(totalSpent)}</span>
          <span>Qoldiq: {formatMoney(totalRemaining)}</span>
        </div>
      </Card>
    </PageContent>
  );
}
