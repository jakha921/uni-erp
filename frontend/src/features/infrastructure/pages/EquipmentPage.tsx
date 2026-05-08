import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button } from '@/components/ui';
import { SearchInput } from '@/components/form';
import { DataTable, type Column } from '@/components/table';
import { Monitor, CheckCircle, Wrench, XCircle, Plus } from 'lucide-react';
import { rnum, pick, generateName } from '@/api/mock/shared-data';

// --- Types ---

interface Equipment {
  id: number;
  name: string;
  category: string;
  inventoryNumber: string;
  room: string;
  status: 'working' | 'repair' | 'decommissioned';
  date: string;
  responsible: string;
  value: number;
}

// --- Mock Data ---

const CATEGORIES = ['Kompyuter texnikasi', "O'quv jihozlari", 'Laboratoriya', 'Mebel', 'Boshqa'];

const EQUIPMENT_NAMES = [
  ['Proyektor Epson EB-X51', 'Kompyuter texnikasi'],
  ['Kompyuter Dell OptiPlex 3080', 'Kompyuter texnikasi'],
  ['Printer HP LaserJet Pro M404n', 'Kompyuter texnikasi'],
  ['Interaktiv doska SMART Board', "O'quv jihozlari"],
  ['Mikroskop Levenhuk 320 BASE', 'Laboratoriya'],
  ["O'quv stendi (Elektrotexnika)", 'Laboratoriya'],
  ['Laboratoriya shkafi LS-21', 'Laboratoriya'],
  ['Monitor Samsung 27" LF27T350', 'Kompyuter texnikasi'],
  ["O'quv stoli 1400x700", 'Mebel'],
  ['Ofis kreslo Prestige', 'Mebel'],
  ['Router MikroTik hAP ac3', 'Kompyuter texnikasi'],
  ['UPS APC Back-UPS 1100VA', 'Boshqa'],
] as const;

const STATUSES: Equipment['status'][] = ['working', 'repair', 'decommissioned'];
const ROOMS = ['101-A', '203-B', '305-A', '102-C', '210-A', '401-B', '112-A', '307-C'];

const VALUES = [3500000, 8500000, 12000000, 850000, 420000, 24000000, 1800000, 4200000, 38000000, 65000000, 5400000, 2200000];

const EQUIPMENT_ITEMS: Equipment[] = EQUIPMENT_NAMES.map((row, i) => {
  const name = generateName(i + 700, 0.3);
  const statusIdx = rnum(i * 5, 0, 10);
  const status: Equipment['status'] = statusIdx < 8 ? 'working' : statusIdx < 10 ? 'repair' : 'decommissioned';
  return {
    id: i + 1,
    name: row[0],
    category: row[1],
    inventoryNumber: `INV/2024/${String(100 + i * 17).padStart(4, '0')}`,
    room: pick(ROOMS, i + 3),
    status,
    date: `${String(rnum(i + 10, 1, 28)).padStart(2, '0')}.${String(rnum(i + 20, 1, 12)).padStart(2, '0')}.2026`,
    responsible: name.short,
    value: VALUES[i] ?? 1000000,
  };
});

const WORKING = EQUIPMENT_ITEMS.filter((e) => e.status === 'working').length;
const REPAIR = EQUIPMENT_ITEMS.filter((e) => e.status === 'repair').length;
const DECOMMISSIONED = EQUIPMENT_ITEMS.filter((e) => e.status === 'decommissioned').length;
const TOTAL_VALUE = EQUIPMENT_ITEMS.reduce((s, e) => s + e.value, 0);

// --- Status Config ---

const STATUS_LABELS: Record<Equipment['status'], string> = {
  working: 'Ishlamoqda',
  repair: "Ta'mirda",
  decommissioned: 'Hisobdan chiqarilgan',
};

const STATUS_VARIANTS: Record<Equipment['status'], 'success' | 'warning' | 'error'> = {
  working: 'success',
  repair: 'warning',
  decommissioned: 'error',
};

// --- Columns ---

const columns: Column<Equipment>[] = [
  {
    key: 'id',
    header: '№',
    width: '50px',
    render: (row) => <span className="text-slate-500 tabular-nums">{row.id}</span>,
  },
  {
    key: 'name',
    header: 'Nomi',
    render: (row) => <span className="font-medium text-slate-900">{row.name}</span>,
  },
  {
    key: 'category',
    header: 'Kategoriya',
    render: (row) => <span className="text-slate-600">{row.category}</span>,
  },
  {
    key: 'inventoryNumber',
    header: 'Inv №',
    render: (row) => <span className="text-slate-500 tabular-nums font-mono text-xs">{row.inventoryNumber}</span>,
  },
  {
    key: 'room',
    header: 'Joylashuv',
    render: (row) => <span className="text-slate-600">{row.room}</span>,
  },
  {
    key: 'responsible',
    header: "Mas'ul",
    render: (row) => <span className="text-slate-500">{row.responsible}</span>,
  },
  {
    key: 'value',
    header: 'Qiymat',
    className: 'text-right',
    render: (row) => <span className="tabular-nums font-medium text-slate-900">{row.value.toLocaleString('ru-RU')}</span>,
  },
  {
    key: 'status',
    header: 'Holat',
    render: (row) => (
      <Badge variant={STATUS_VARIANTS[row.status]} dot>
        {STATUS_LABELS[row.status]}
      </Badge>
    ),
  },
  {
    key: 'date',
    header: 'Sana',
    render: (row) => <span className="text-slate-500 tabular-nums">{row.date}</span>,
  },
];

// --- Component ---

export function EquipmentPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return EQUIPMENT_ITEMS.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.inventoryNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, categoryFilter, statusFilter]);

  return (
    <PageContent>
      <PageHeader
        title="Jihozlar"
        subtitle="Asosiy vositalar va texnika"
        breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'Jihozlar' }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>Jihoz qo&apos;shish</Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Umumiy qiymat"
          value={`${(TOTAL_VALUE / 1_000_000_000).toFixed(2)} mlrd`}
          icon={<Monitor className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          sub="so'm"
        />
        <StatCard
          label="Ishlamoqda"
          value={WORKING}
          icon={<CheckCircle className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Ta'mirda"
          value={REPAIR}
          icon={<Wrench className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Hisobdan chiq."
          value={DECOMMISSIONED}
          icon={<XCircle className="h-[18px] w-[18px]" />}
          iconBg="#94A3B8"
        />
      </div>

      {/* Filters + Table */}
      <Card noPadding>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
          <SearchInput
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            className="w-60"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 pr-8 border border-border rounded-md text-sm bg-white"
          >
            <option value="all">Barcha kategoriyalar</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 pr-8 border border-border rounded-md text-sm bg-white"
          >
            <option value="all">Barcha holatlar</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <DataTable
          data={filtered}
          columns={columns}
          keyField="id"
          emptyMessage="Jihozlar topilmadi"
        />
      </Card>
    </PageContent>
  );
}
