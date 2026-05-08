import type { ListParams } from './common';

export type ItemCategory = 'office' | 'cleaning' | 'technical' | 'furniture' | 'food' | 'other';
export type MovementType = 'incoming' | 'outgoing' | 'write_off' | 'transfer';

export interface WarehouseItem {
  id: number;
  name: string;
  sku: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  totalValue: number;
  location: string;
  lastMovementDate?: string;
}

export interface StockMovement {
  id: number;
  itemId: number;
  itemName: string;
  type: MovementType;
  quantity: number;
  date: string;
  note: string;
  responsiblePerson: string;
}

export interface WarehouseListParams extends ListParams {
  category?: ItemCategory;
  belowMin?: boolean;
}

export interface CreateItemDto {
  name: string;
  sku: string;
  category: ItemCategory;
  unit: string;
  minQuantity: number;
  price: number;
  location: string;
}

export interface CreateMovementDto {
  itemId: number;
  type: MovementType;
  quantity: number;
  note?: string;
}

export interface WarehouseStats {
  totalItems: number;
  totalValue: number;
  belowMinCount: number;
  byCategory: { category: string; count: number; value: number }[];
}
