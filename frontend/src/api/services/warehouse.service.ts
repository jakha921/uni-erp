import type {
  WarehouseItem, StockMovement, WarehouseListParams,
  CreateItemDto, CreateMovementDto, WarehouseStats,
} from '@/types/warehouse';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { WarehouseMockService } from '../mock/warehouse.mock';

export interface IWarehouseService {
  getItems(params: WarehouseListParams): Promise<PaginatedResponse<WarehouseItem>>;
  getItemById(id: number): Promise<WarehouseItem>;
  createItem(data: CreateItemDto): Promise<WarehouseItem>;
  updateItem(id: number, data: Partial<CreateItemDto>): Promise<WarehouseItem>;
  deleteItem(id: number): Promise<void>;
  getMovements(itemId?: number): Promise<StockMovement[]>;
  createMovement(data: CreateMovementDto): Promise<StockMovement>;
  getStats(): Promise<WarehouseStats>;
}

class WarehouseApiService implements IWarehouseService {
  async getItems(params: WarehouseListParams) {
    return apiClient.get<PaginatedResponse<WarehouseItem>>(ENDPOINTS.warehouse.items, {
      params: { page: params.page, page_size: params.pageSize, search: params.search, category: params.category, below_min: params.belowMin },
    });
  }
  async getItemById(id: number) { return apiClient.get<WarehouseItem>(ENDPOINTS.warehouse.itemDetail(id)); }
  async createItem(data: CreateItemDto) { return apiClient.post<WarehouseItem>(ENDPOINTS.warehouse.items, data); }
  async updateItem(id: number, data: Partial<CreateItemDto>) { return apiClient.patch<WarehouseItem>(ENDPOINTS.warehouse.itemDetail(id), data); }
  async deleteItem(id: number) { return apiClient.delete<void>(ENDPOINTS.warehouse.itemDetail(id)); }
  async getMovements(itemId?: number) {
    return apiClient.get<StockMovement[]>(ENDPOINTS.warehouse.movements, { params: { item_id: itemId } });
  }
  async createMovement(data: CreateMovementDto) { return apiClient.post<StockMovement>(ENDPOINTS.warehouse.movements, data); }
  async getStats() { return apiClient.get<WarehouseStats>(ENDPOINTS.warehouse.stats); }
}

export const warehouseService: IWarehouseService = USE_MOCK
  ? new WarehouseMockService()
  : new WarehouseApiService();
