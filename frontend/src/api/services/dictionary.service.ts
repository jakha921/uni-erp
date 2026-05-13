import type { DictionaryItem, DictionaryType, DictionaryListParams, CreateDictionaryItemDto } from '@/types/admin';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, drfListToArray } from '../client';
import { DictionaryMockService } from '../mock/dictionary.mock';

export interface IDictionaryService {
  getItems(type: DictionaryType, params?: DictionaryListParams): Promise<DictionaryItem[]>;
  createItem(type: DictionaryType, data: CreateDictionaryItemDto): Promise<DictionaryItem>;
  updateItem(type: DictionaryType, id: number, data: Partial<CreateDictionaryItemDto>): Promise<DictionaryItem>;
  deleteItem(type: DictionaryType, id: number): Promise<void>;
}

class DictionaryApiService implements IDictionaryService {
  async getItems(type: DictionaryType, params?: DictionaryListParams): Promise<DictionaryItem[]> {
    const res = await apiClient.get<{ count: number; next: null; previous: null; results: DictionaryItem[] } | DictionaryItem[]>(
      ENDPOINTS.admin.dictionaries,
      { params: { type, search: params?.search } },
    );
    return drfListToArray(res as { count: number; next: null; previous: null; results: DictionaryItem[] });
  }

  async createItem(type: DictionaryType, data: CreateDictionaryItemDto): Promise<DictionaryItem> {
    return apiClient.post<DictionaryItem>(ENDPOINTS.admin.dictionaries, { ...data, type });
  }

  async updateItem(_type: DictionaryType, id: number, data: Partial<CreateDictionaryItemDto>): Promise<DictionaryItem> {
    return apiClient.patch<DictionaryItem>(ENDPOINTS.admin.dictionaryItem(id), data);
  }

  async deleteItem(_type: DictionaryType, id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.dictionaryItem(id));
  }
}

export const dictionaryService: IDictionaryService = USE_MOCK
  ? new DictionaryMockService()
  : new DictionaryApiService();
