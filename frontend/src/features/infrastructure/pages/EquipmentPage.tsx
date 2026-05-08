import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { SearchInput } from '@/components/form';
import { DataTable, type Column } from '@/components/table';
import { Monitor, CheckCircle, Wrench, XCircle, Plus } from 'lucide-react';
import { useEquipment } from '@/api/hooks/useInfrastructure';
import type { Equipment, EquipmentStatus } from '@/types/infrastructure';

// --- Categories for filter ---
const CATEGORIES = ['Kompyuter texnikasi', "O'quv jihozlari", 'Laboratoriya', 'Mebel', 'Boshqa'];

const STATUSES: EquipmentStatus[] = ['working', 'repair', 'written_off', 'storage'];

// --- Status Config ---

const STATUS_LABELS: Record<EquipmentStatus, string> = {
  working: 'Ishlamoqda',
  repair: "Ta'mirda",
  written_off: 'Hisobdan chiqarilgan',
  storage: 'Omborxonada',
};

const STATUS_VARIANTS: Record<EquipmentStatus, 'success' | 'warning' | 'error' | 'default'> = {
  working: 'success',
  repair: 'warning',
  written_off: 'error',
  storage: 'default',
};

// --- Columns ---

const columns: Column<Equipment>[] = [
  {
    key: 'id',
    header: '?',
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
    header: 'Inv ?',
    render: (row) => <span className="text-slate-500 tabular-nums font-mono text-xs">{row.inventoryNumber}</span>,
  },
  {
    key: 'location',
    header: 'Joylashuv',
    render: (row) => <span className="text-slate-600">{row.location}</span>,
  },
  {
    key: 'responsiblePerson',
    header: "Mas'ul",
    render: (row) => <span className="text-slate-500">{row.responsiblePerson}</span>,
  },
  {
    key: 'cost',
    header: 'Qiymat',
    className: 'text-right',
    render: (row) => <span className="tabular-nums font-medium text-slate-900">{row.cost.toLocaleString('ru-RU')}</span>,
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
    key: 'purchaseDate',
    header: 'Sana',
    render: (row) => <span className="text-slate-500 tabular-nums">{row.purchaseDate}</span>,
  },
];

// --- Component ---

export function EquipmentPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: equipmentData, isLoading } = useEquipment({
    page: 1,
    pageSize: 50,
    search: search || undefined,
    category: categoryFilter || undefined,
    status: (statusFilter as EquipmentStatus) || undefined,
  });

  const items = equipmentData?.data ?? [];

  // Client-side filtering for instant response
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.inventoryNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  // Stats
  const working = items.filter((e) => e.status === 'working').length;
  const repair = items.filter((e) => e.status === 'repair').length;
  const writtenOff = items.filter((e) => e.status === 'written_off').length;
  const totalValue = items.reduce((s, e) => s + e.cost, 0);

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
          value={totalValue > 0 ? `${(totalValue / 1_000_000_000).toFixed(2)} mlrd` : '0'}
          icon={<Monitor className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          sub="so'm"
        />
        <StatCard
          label="Ishlamoqda"
          value={working}
          icon={<CheckCircle className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Ta'mirda"
          value={repair}
          icon={<Wrench className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Hisobdan chiq."
          value={writtenOff}
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
            <option value="">Barcha kategoriyalar</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 pr-8 border border-border rounded-md text-sm bg-white"
          >
            <option value="">Barcha holatlar</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable
            data={filtered}
            columns={columns}
            keyField="id"
            emptyMessage="Jihozlar topilmadi"
          />
        )}
      </Card>
    </PageContent>
  );
}
