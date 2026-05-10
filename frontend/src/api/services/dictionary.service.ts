import type { DictionaryItem, DictionaryType, DictionaryListParams, CreateDictionaryItemDto } from '@/types/admin';
import { DictionaryMockService } from '../mock/dictionary.mock';

export interface IDictionaryService {
  getItems(type: DictionaryType, params?: DictionaryListParams): Promise<DictionaryItem[]>;
  createItem(type: DictionaryType, data: CreateDictionaryItemDto): Promise<DictionaryItem>;
  updateItem(type: DictionaryType, id: number, data: Partial<CreateDictionaryItemDto>): Promise<DictionaryItem>;
  deleteItem(type: DictionaryType, id: number): Promise<void>;
}

export const dictionaryService: IDictionaryService = new DictionaryMockService();
