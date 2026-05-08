import type { DictionaryItem, DictionaryType, DictionaryListParams, CreateDictionaryItemDto } from '@/types/admin';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { DictionaryMockService } from '../mock/dictionary.mock';

export interface IDictionaryService {
  getItems(type: DictionaryType, params?: DictionaryListParams): Promise<DictionaryItem[]>;
  createItem(type: DictionaryType, data: CreateDictionaryItemDto): Promise<DictionaryItem>;
  updateItem(type: DictionaryType, id: number, data: Partial<CreateDictionaryItemDto>): Promise<DictionaryItem>;
  deleteItem(type: DictionaryType, id: number): Promise<void>;
}

class DictionaryApiService implements IDictionaryService {
  async getItems(type: DictionaryType, params?: DictionaryListParams) {
    return apiClient.get<DictionaryItem[]>(ENDPOINTS.admin.dictionaries(type), {
      params: { search: params?.search },
    });
  }
  async createItem(type: DictionaryType, data: CreateDictionaryItemDto) {
    return apiClient.post<DictionaryItem>(ENDPOINTS.admin.dictionaries(type), data);
  }
  async updateItem(type: DictionaryType, id: number, data: Partial<CreateDictionaryItemDto>) {
    return apiClient.patch<DictionaryItem>(ENDPOINTS.admin.dictionaryItem(type, id), data);
  }
  async deleteItem(type: DictionaryType, id: number) {
    return apiClient.delete<void>(ENDPOINTS.admin.dictionaryItem(type, id));
  }
}

export const dictionaryService: IDictionaryService = USE_MOCK
  ? new DictionaryMockService()
  : new DictionaryApiService();
