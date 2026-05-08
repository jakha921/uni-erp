import { useState, useMemo } from 'react';
import { Package, Warehouse, AlertTriangle, ShoppingCart } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { Badge, Button } from '@/components/ui';
import { StatCard, Card } from '@/components/data-display';
import { rnum } from '@/api/mock/shared-data';

type WarehouseStatus = 'Yetarli' | 'Kam' | 'Tugagan';

interface WarehouseItem {
  id: number;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  status: WarehouseStatus;
  lastReceived: string;
}

const CATEGORIES = ['Jihozlar', 'Tozalash', 'Kanselyariya', 'Ehtiyot qismlar'];

const ITEM_NAMES: Record<string, string[]> = {
  Jihozlar: [
    'Proyektor Epson EB-X51',
    'Kompyuter monitori 24"',
    'Printer HP LaserJet',
    'UPS APC 1500VA',
  ],
  Tozalash: [
    'Dezinfeksiya vositasi 5L',
    'Pol yuvish vositasi',
    'Chiqindi qoplari (100 dona)',
    'Shvabra sopi',
  ],
  Kanselyariya: [
    'A4 qog\'oz (500 varaq)',
    'Ruchka (ko\'k, 50 dona)',
    'Papka registrator',
    'Shtamp yostig\'i',
  ],
  'Ehtiyot qismlar': [
    'Toner kartridj HP 85A',
    'Sichqoncha USB',
    'Klaviatura USB',
    'HDMI kabel 3m',
  ],
};

const UNITS: Record<string, string> = {
  Jihozlar: 'dona',
  Tozalash: 'dona',
  Kanselyariya: 'pachka',
  'Ehtiyot qismlar': 'dona',
};

function generateWarehouseItems(): WarehouseItem[] {
  const items: WarehouseItem[] = [];
  let id = 1;

  for (const category of CATEGORIES) {
    const names = ITEM_NAMES[category] ?? [];
    for (const name of names) {
      const minQty = rnum(id + 100, 5, 20);
      const qty = rnum(id + 200, 0, 80);
      let status: WarehouseStatus = 'Yetarli';
      if (qty <= 0) status = 'Tugagan';
      else if (qty <= minQty) status = 'Kam';

      const day = rnum(id + 300, 1, 28);
      const month = rnum(id + 400, 1, 4);

      items.push({
        id,
        name,
        category,
        unit: UNITS[category] ?? 'dona',
        quantity: qty,
        minQuantity: minQty,
        status,
        lastReceived: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.2026`,
      });
      id++;
    }
  }

  // Add a few extra items to reach 15
  const extraItems = [
    { name: 'Stul ofisiy', category: 'Jihozlar', unit: 'dona' },
    { name: 'Suv sovutgich', category: 'Jihozlar', unit: 'dona' },
    { name: 'Sanitariya vositasi', category: 'Tozalash', unit: 'dona' },
  ];
  for (const extra of extraItems) {
    const minQty = rnum(id + 100, 5, 20);
    const qty = rnum(id + 200, 0, 80);
    let status: WarehouseStatus = 'Yetarli';
    if (qty <= 0) status = 'Tugagan';
    else if (qty <= minQty) status = 'Kam';

    const day = rnum(id + 300, 1, 28);
    const month = rnum(id + 400, 1, 4);

    items.push({
      id,
      name: extra.name,
      category: extra.category,
      unit: extra.unit,
      quantity: qty,
      minQuantity: minQty,
      status,
      lastReceived: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.2026`,
    });
    id++;
  }

  return items.slice(0, 15);
}

const STATUS_CONFIG: Record<WarehouseStatus, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  Yetarli: { variant: 'success', label: 'Yetarli' },
  Kam: { variant: 'warning', label: 'Kam' },
  Tugagan: { variant: 'error', label: 'Tugagan' },
};

const CATEGORY_OPTIONS = [
  { value: '', label: 'Umumiy' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function WarehousePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const items = useMemo(() => generateWarehouseItems(), []);

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

  const totalItems = items.length;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const lowCount = items.filter((i) => i.status === 'Kam').length;
  const outCount = items.filter((i) => i.status === 'Tugagan').length;

  const columns: Column<WarehouseItem>[] = [
    {
      key: 'idx',
      header: '№',
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
          Jihozlar: 'bg-blue-50 text-blue-700',
          Tozalash: 'bg-emerald-50 text-emerald-700',
          Kanselyariya: 'bg-amber-50 text-amber-700',
          'Ehtiyot qismlar': 'bg-violet-50 text-violet-700',
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
        const cfg = STATUS_CONFIG[row.status];
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: 'lastReceived',
      header: 'Oxirgi kirim',
      render: (row) => <span className="tabular-nums text-slate-500">{row.lastReceived}</span>,
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
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
        <DataTable
          data={filtered}
          columns={columns}
          keyField="id"
          emptyMessage="Mahsulotlar topilmadi"
        />
      </Card>
    </PageContent>
  );
}
