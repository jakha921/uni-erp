import { delay } from './delay';
import { pick, rnum } from './shared-data';
import type { WarehouseItem, StockMovement, WarehouseListParams, CreateItemDto, CreateMovementDto, WarehouseStats } from '@/types/warehouse';
import type { PaginatedResponse } from '@/types/common';
import type { IWarehouseService } from '../services/warehouse.service';

const ITEM_NAMES = ['A4 qog\'oz', 'Ruchka (ko\'k)', 'Marker', 'Shtrix', 'Papka', 'Stapler', 'Skrepka', 'Yelim', 'Doskaga bo\'r', 'Qaychi', 'Stol', 'Stul', 'Shkaf', 'Dezinfektsiya', 'Salfetka'];
const UNITS = ['dona', 'pachka', 'quti', 'litr', 'kg'];
const CATEGORIES: WarehouseItem['category'][] = ['office', 'cleaning', 'technical', 'furniture', 'food', 'other'];
const MOVE_TYPES: StockMovement['type'][] = ['incoming', 'outgoing', 'write_off', 'transfer'];

const ITEMS: WarehouseItem[] = ITEM_NAMES.map((name, i) => {
  const qty = rnum(i, 5, 200);
  const price = rnum(i + 3, 1000, 50000);
  const minQty = rnum(i + 5, 3, 20);
  return {
    id: i + 1, name, sku: `SKU-${String(1000 + i)}`,
    category: pick(CATEGORIES, i + 1), quantity: qty, unit: pick(UNITS, i + 2),
    minQuantity: minQty, price, totalValue: qty * price,
    location: `Ombor-${rnum(i, 1, 3)}, Javon-${rnum(i + 1, 1, 10)}`,
    lastMovementDate: `2026-0${rnum(i, 1, 5)}-${String(rnum(i, 1, 28)).padStart(2, '0')}`,
  };
});

const MOVEMENTS: StockMovement[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1, itemId: rnum(i, 1, ITEMS.length), itemName: pick(ITEM_NAMES, i),
  type: pick(MOVE_TYPES, i + 1), quantity: rnum(i + 2, 1, 50),
  date: `2026-0${rnum(i, 1, 5)}-${String(rnum(i + 1, 1, 28)).padStart(2, '0')}`,
  note: `Harakat #${i + 1}`, responsiblePerson: `Xodim ${i + 1}`,
}));

export class WarehouseMockService implements IWarehouseService {
  async getItems(params: WarehouseListParams): Promise<PaginatedResponse<WarehouseItem>> {
    await delay(300);
    let data = [...ITEMS];
    if (params.search) { const q = params.search.toLowerCase(); data = data.filter((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)); }
    if (params.category) data = data.filter((it) => it.category === params.category);
    if (params.belowMin) data = data.filter((it) => it.quantity < it.minQuantity);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 20;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }
  async getItemById(id: number) { await delay(200); const it = ITEMS.find((it) => it.id === id); if (!it) throw new Error('Not found'); return it; }
  async createItem(data: CreateItemDto) { await delay(300); return { id: ITEMS.length + 1, ...data, quantity: 0, totalValue: 0 }; }
  async updateItem(id: number, data: Partial<CreateItemDto>) { await delay(300); const it = ITEMS.find((it) => it.id === id); if (!it) throw new Error('Not found'); return { ...it, ...data }; }
  async deleteItem(_id: number) { await delay(200); }
  async getMovements(itemId?: number) { await delay(200); return itemId ? MOVEMENTS.filter((m) => m.itemId === itemId) : MOVEMENTS; }
  async createMovement(data: CreateMovementDto) { await delay(300); return { id: MOVEMENTS.length + 1, ...data, itemName: 'Item', date: new Date().toISOString().slice(0, 10), note: data.note ?? '', responsiblePerson: 'Current user' }; }
  async getStats(): Promise<WarehouseStats> {
    await delay(200);
    const belowMin = ITEMS.filter((it) => it.quantity < it.minQuantity).length;
    const totalValue = ITEMS.reduce((s, it) => s + it.totalValue, 0);
    const byCategory = CATEGORIES.map((cat) => {
      const items = ITEMS.filter((it) => it.category === cat);
      return { category: cat, count: items.length, value: items.reduce((s, it) => s + it.totalValue, 0) };
    }).filter((c) => c.count > 0);
    return { totalItems: ITEMS.length, totalValue, belowMinCount: belowMin, byCategory };
  }
}
