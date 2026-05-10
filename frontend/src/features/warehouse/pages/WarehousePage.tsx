import { useState, useMemo } from 'react';
import { Package, Warehouse, AlertTriangle, ShoppingCart, Plus, Pencil, Trash2, ArrowRightLeft, FileDown } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { Badge, Button, Spinner, AlertBanner } from '@/components/ui';
import { StatCard, Card } from '@/components/data-display';
import { ConfirmDialog } from '@/components/overlays';
import { useWarehouseItems, useWarehouseStats, useCreateWarehouseItem, useUpdateWarehouseItem, useDeleteWarehouseItem, useCreateMovement } from '@/api/hooks/useWarehouse';
import { ItemForm } from '../components/ItemForm';
import { MovementForm } from '../components/MovementForm';
import type { WarehouseItem } from '@/types/warehouse';
import type { ItemFormData } from '../schemas/item.schema';
import type { MovementFormData } from '../schemas/item.schema';

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

const CATEGORY_OPTIONS = [
  { value: '', label: 'Umumiy' },
  { value: 'office', label: 'Ofis' },
  { value: 'cleaning', label: 'Tozalash' },
  { value: 'technical', label: 'Texnik' },
  { value: 'furniture', label: 'Mebel' },
  { value: 'food', label: 'Oziq-ovqat' },
  { value: 'other', label: 'Boshqa' },
];

export function WarehousePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [movementFormOpen, setMovementFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<WarehouseItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<WarehouseItem | null>(null);
  const [movementItemId, setMovementItemId] = useState<number | undefined>(undefined);

  const { data: itemsData, isLoading } = useWarehouseItems({ page: 1, pageSize: 50, search: search || undefined });
  const { data: statsData } = useWarehouseStats();

  const createItem = useCreateWarehouseItem();
  const updateItem = useUpdateWarehouseItem();
  const deleteItemMutation = useDeleteWarehouseItem();
  const createMovement = useCreateMovement();

  const items = itemsData?.data ?? [];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (search) { const q = search.toLowerCase(); if (!item.name.toLowerCase().includes(q)) return false; }
      if (categoryFilter && item.category !== categoryFilter) return false;
      return true;
    });
  }, [items, search, categoryFilter]);

  const totalItems = statsData?.totalItems ?? items.length;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const lowCount = statsData?.belowMinCount ?? items.filter((i) => i.quantity > 0 && i.quantity <= i.minQuantity).length;
  const outCount = items.filter((i) => i.quantity <= 0).length;

  const handleOpenCreate = () => { setEditItem(null); setItemFormOpen(true); };
  const handleCloseItemForm = () => { setItemFormOpen(false); setEditItem(null); };

  const handleItemSubmit = (data: ItemFormData) => {
    if (editItem) {
      updateItem.mutate({ id: editItem.id, data }, { onSuccess: handleCloseItemForm });
    } else {
      createItem.mutate(data, { onSuccess: handleCloseItemForm });
    }
  };

  const handleMovementSubmit = (data: MovementFormData) => {
    createMovement.mutate(data, { onSuccess: () => { setMovementFormOpen(false); setMovementItemId(undefined); } });
  };

  const actionColumn: Column<WarehouseItem> = {
    key: 'id', header: '', width: '90px',
    render: (row) => (
      <div className="flex items-center gap-1 justify-end">
        <button onClick={() => { setMovementItemId(row.id); setMovementFormOpen(true); }} className="rounded p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600" title="Harakat qo'shish">
          <ArrowRightLeft className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => { setEditItem(row); setItemFormOpen(true); }} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setDeleteItem(row)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    ),
  };

  const columns: Column<WarehouseItem>[] = [
    { key: 'idx', header: '?', width: '50px', render: (_, index) => <span className="text-slate-500">{index + 1}</span> },
    { key: 'name', header: 'Nomi', sortable: true, render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
    {
      key: 'category', header: 'Kategoriya',
      render: (row) => {
        const colors: Record<string, string> = {
          office: 'bg-amber-50 text-amber-700', cleaning: 'bg-emerald-50 text-emerald-700',
          technical: 'bg-blue-50 text-blue-700', furniture: 'bg-violet-50 text-violet-700',
          food: 'bg-orange-50 text-orange-700', other: 'bg-slate-100 text-slate-700',
        };
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[row.category] ?? 'bg-slate-100 text-slate-700'}`}>{row.category}</span>;
      },
    },
    { key: 'unit', header: 'Birlik', render: (row) => <span className="text-slate-600">{row.unit}</span> },
    { key: 'quantity', header: 'Miqdori', className: 'text-right', sortable: true, render: (row) => <span className="tabular-nums font-semibold text-slate-900">{row.quantity}</span> },
    { key: 'minQuantity', header: 'Min. miqdor', className: 'text-right', render: (row) => <span className="tabular-nums text-slate-500">{row.minQuantity}</span> },
    {
      key: 'status', header: 'Holat',
      render: (row) => {
        const status = getStatus(row);
        const cfg = STATUS_CONFIG[status];
        return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
      },
    },
    { key: 'lastMovementDate', header: 'Oxirgi kirim', render: (row) => <span className="tabular-nums text-slate-500">{row.lastMovementDate ?? '—'}</span> },
    actionColumn,
  ];

  return (
    <PageContent>
      <PageHeader
        title="Ombor"
        subtitle="Materiallar va inventarni boshqarish"
        breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'Ombor' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/api/v1/warehouse/items/export/';
                a.download = 'ombor.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              Excel
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<ArrowRightLeft className="h-4 w-4" />} onClick={() => { setMovementItemId(undefined); setMovementFormOpen(true); }}>
              Harakat
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
              Tovar qo&apos;shish
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-5">
        <StatCard label="Jami nomlari" value={totalItems} icon={<Package className="h-5 w-5" />} iconBg="bg-blue-500" sub="turdagi mahsulot" />
        <StatCard label="Omborda" value={totalQty} icon={<Warehouse className="h-5 w-5" />} iconBg="bg-emerald-500" sub="dona jami" />
        <StatCard label="Kam qolgan" value={lowCount} icon={<AlertTriangle className="h-5 w-5" />} iconBg="bg-amber-500" sub="diqqat talab etadi" />
        <StatCard label="Buyurtma kerak" value={outCount} icon={<ShoppingCart className="h-5 w-5" />} iconBg="bg-red-500" sub="tugagan mahsulotlar" />
      </div>

      {(lowCount > 0 || outCount > 0) && (
        <div className="mb-4">
          {outCount > 0 && (
            <AlertBanner
              variant="error"
              title={`${outCount} ta mahsulot tugagan`}
              message="Ushbu mahsulotlarni zudlik bilan buyurtma qiling."
              dismissible
              className="mb-2"
            />
          )}
          {lowCount > 0 && (
            <AlertBanner
              variant="warning"
              title={`${lowCount} ta mahsulot kam qolgan`}
              message="Minimal miqdordan past mahsulotlarni to'ldiring."
              dismissible
            />
          )}
        </div>
      )}

      <ItemForm
        open={itemFormOpen}
        onClose={handleCloseItemForm}
        onSubmit={handleItemSubmit}
        item={editItem}
        loading={createItem.isPending || updateItem.isPending}
      />
      <MovementForm
        open={movementFormOpen}
        onClose={() => { setMovementFormOpen(false); setMovementItemId(undefined); }}
        onSubmit={handleMovementSubmit}
        items={items}
        preselectedItemId={movementItemId}
        loading={createMovement.isPending}
      />
      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (!deleteItem) return;
          deleteItemMutation.mutate(deleteItem.id, { onSuccess: () => setDeleteItem(null) });
        }}
        title="Tovarni o'chirish"
        message={`"${deleteItem?.name}" tovarini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteItemMutation.isPending}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Mahsulot nomi..."
        activeFilterCount={categoryFilter ? 1 : 0}
        onClearFilters={() => { setCategoryFilter(''); setSearch(''); }}
        filters={
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-9 rounded-md border border-border px-3 text-sm">
            {CATEGORY_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        }
        actions={<Badge variant="default">{filtered.length} ta mahsulot</Badge>}
      />

      <Card noPadding className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <DataTable data={filtered} columns={columns} keyField="id" emptyMessage="Mahsulotlar topilmadi" />
        )}
      </Card>
    </PageContent>
  );
}
