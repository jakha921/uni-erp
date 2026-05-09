import { useState, useMemo } from 'react';
import { Package, Warehouse, AlertTriangle, ShoppingCart } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { Badge, Button, Spinner } from '@/components/ui';
import { StatCard, Card } from '@/components/data-display';
import { useWarehouseItems, useWarehouseStats } from '@/api/hooks/useWarehouse';
import type { WarehouseItem } from '@/types/warehouse';

type WarehouseStatus = 'Yetarli' | 'Kam' | 'Tugagan';

function getStatus(item: WarehouseItem): WarehouseStatus {
  if (item.quantity <= 0) return 'Tugagan';
  if (item.quantity <= item.minQuantity) return 'Kam';
  return 'Yetarli';
}

const STATUS_CONFIG: Record<WarehouseStatus, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  Yetarli: { variant: 'success', label: 'Yetarli' },
  Kam: { variant: 'warning', label: 'Kam' },
  Tugagan: { variant: 'error', label: 'Tugagan' },
};

const CATEGORIES = ['Jihozlar', 'Tozalash', 'Kanselyariya', 'Ehtiyot qismlar'];
const CATEGORY_OPTIONS = [
  { value: '', label: 'Umumiy' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function WarehousePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: itemsData, isLoading } = useWarehouseItems({
    page: 1,
    pageSize: 50,
    search: search || undefined,
  });
  const { data: statsData } = useWarehouseStats();

  const items = itemsData?.data ?? [];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (search) {
        const q = search.toLowerCase();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (categoryFilter && item.category !== categoryFilter) return false;
      return true;
    });
  }, [items, search, categoryFilter]);

  // Use stats from API if available, otherwise compute from items
  const totalItems = statsData?.totalItems ?? items.length;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const lowCount = statsData?.belowMinCount ?? items.filter((i) => i.quantity > 0 && i.quantity <= i.minQuantity).length;
  const outCount = items.filter((i) => i.quantity <= 0).length;

  const columns: Column<WarehouseItem>[] = [
    {
      key: 'idx',
      header: '?',
      width: '50px',
      render: (_, index) => <span className="text-slate-500">{index + 1}</span>,
    },
    {
      key: 'name',
      header: 'Nomi',
      sortable: true,
      render: (row) => <span className="font-medium text-slate-900">{row.name}</span>,
    },
    {
      key: 'category',
      header: 'Kategoriya',
      render: (row) => {
        const colors: Record<string, string> = {
          office: 'bg-amber-50 text-amber-700',
          cleaning: 'bg-emerald-50 text-emerald-700',
          technical: 'bg-blue-50 text-blue-700',
          furniture: 'bg-violet-50 text-violet-700',
          food: 'bg-orange-50 text-orange-700',
          other: 'bg-slate-100 text-slate-700',
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[row.category] ?? 'bg-slate-100 text-slate-700'}`}
          >
            {row.category}
          </span>
        );
      },
    },
    {
      key: 'unit',
      header: 'Birlik',
      render: (row) => <span className="text-slate-600">{row.unit}</span>,
    },
    {
      key: 'quantity',
      header: 'Miqdori',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-semibold text-slate-900">{row.quantity}</span>
      ),
    },
    {
      key: 'minQuantity',
      header: 'Min. miqdor',
      className: 'text-right',
      render: (row) => <span className="tabular-nums text-slate-500">{row.minQuantity}</span>,
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => {
        const status = getStatus(row);
        const cfg = STATUS_CONFIG[status];
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: 'lastMovementDate',
      header: 'Oxirgi kirim',
      render: (row) => <span className="tabular-nums text-slate-500">{row.lastMovementDate ?? '—'}</span>,
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Ombor"
        subtitle="Materiallar va inventarni boshqarish"
        breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'Ombor' }]}
        actions={
          <Button leftIcon={<ShoppingCart className="h-4 w-4" />}>Kirim qo&apos;shish</Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-5">
        <StatCard
          label="Jami nomlari"
          value={totalItems}
          icon={<Package className="h-5 w-5" />}
          iconBg="bg-blue-500"
          sub="turdagi mahsulot"
        />
        <StatCard
          label="Omborda"
          value={totalQty}
          icon={<Warehouse className="h-5 w-5" />}
          iconBg="bg-emerald-500"
          sub="dona jami"
        />
        <StatCard
          label="Kam qolgan"
          value={lowCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBg="bg-amber-500"
          sub="diqqat talab etadi"
        />
        <StatCard
          label="Buyurtma kerak"
          value={outCount}
          icon={<ShoppingCart className="h-5 w-5" />}
          iconBg="bg-red-500"
          sub="tugagan mahsulotlar"
        />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Mahsulot nomi..."
        activeFilterCount={categoryFilter ? 1 : 0}
        onClearFilters={() => {
          setCategoryFilter('');
          setSearch('');
        }}
        filters={
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-border px-3 text-sm"
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        }
        actions={<Badge variant="default">{filtered.length} ta mahsulot</Badge>}
      />

      <Card noPadding className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable
            data={filtered}
            columns={columns}
            keyField="id"
            emptyMessage="Mahsulotlar topilmadi"
          />
        )}
      </Card>
    </PageContent>
  );
}
