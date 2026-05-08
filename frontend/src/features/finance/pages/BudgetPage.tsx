import { useMemo } from 'react';
import { Target, CheckCircle, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, type Column } from '@/components/table';
import { Button, Badge } from '@/components/ui';
import { StatCard, Card } from '@/components/data-display';
import { formatMoney } from '@/lib/utils';

interface BudgetCategory {
  id: number;
  name: string;
  planned: number;
  spent: number;
  remaining: number;
  percent: number;
  color: string;
}

function generateBudgetCategories(): BudgetCategory[] {
  const categories: Array<{ name: string; planned: number; spent: number; color: string }> = [
    { name: 'Ish haqi', planned: 14800000000, spent: 12480000000, color: '#3B82F6' },
    { name: 'Kommunal xizmatlar', planned: 980000000, spent: 720000000, color: '#F59E0B' },
    { name: "Ta'mirlash", planned: 1850000000, spent: 1240000000, color: '#2DB976' },
    { name: 'Jihozlar', planned: 720000000, spent: 480000000, color: '#8B5CF6' },
    { name: 'Transport', planned: 280000000, spent: 145000000, color: '#EC4899' },
    { name: 'Stipendiya', planned: 2400000000, spent: 1800000000, color: '#06B6D4' },
    { name: 'Boshqa xarajatlar', planned: 350000000, spent: 180000000, color: '#94A3B8' },
  ];

  return categories.map((cat, i) => ({
    id: i + 1,
    name: cat.name,
    planned: cat.planned,
    spent: cat.spent,
    remaining: cat.planned - cat.spent,
    percent: Math.round((cat.spent / cat.planned) * 100),
    color: cat.color,
  }));
}

export function BudgetPage() {
  const categories = useMemo(() => generateBudgetCategories(), []);

  const totalPlanned = categories.reduce((s, c) => s + c.planned, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalRemaining = totalPlanned - totalSpent;
  const totalPercent = Math.round((totalSpent / totalPlanned) * 100);

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
            style={{ backgroundColor: row.color }}
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
      key: 'percent',
      header: 'Ijro %',
      width: '220px',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(row.percent, 100)}%`,
                backgroundColor: row.color,
              }}
            />
          </div>
          <Badge
            variant={row.percent >= 90 ? 'error' : row.percent >= 75 ? 'warning' : 'success'}
          >
            {row.percent}%
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Byudjet"
        subtitle="Daromad va xarajatlar rejasi va ijrosi - 2026"
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
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
          sub={`April 2026 holatiga`}
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
        <DataTable
          data={categories}
          columns={columns}
          keyField="id"
          emptyMessage="Kategoriyalar topilmadi"
        />
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
