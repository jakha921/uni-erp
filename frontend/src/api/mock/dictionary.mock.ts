import { delay } from './delay';
import type { DictionaryItem, DictionaryType, DictionaryListParams, CreateDictionaryItemDto } from '@/types/admin';
import type { IDictionaryService } from '../services/dictionary.service';

const DICT_DATA: Record<DictionaryType, DictionaryItem[]> = {
  directions: [
    { id: 1, code: 'IT', name: 'Axborot texnologiyalari', isActive: true, sortOrder: 1 },
    { id: 2, code: 'ECON', name: 'Iqtisodiyot', isActive: true, sortOrder: 2 },
    { id: 3, code: 'MGMT', name: 'Menejment', isActive: true, sortOrder: 3 },
    { id: 4, code: 'PED', name: 'Pedagogika', isActive: true, sortOrder: 4 },
    { id: 5, code: 'MINE', name: "Tog'-kon ishi", isActive: true, sortOrder: 5 },
  ],
  programs: [
    { id: 1, code: 'BAK', name: 'Bakalavr', isActive: true, sortOrder: 1 },
    { id: 2, code: 'MAG', name: 'Magistratura', isActive: true, sortOrder: 2 },
    { id: 3, code: 'PHD', name: 'PhD', isActive: true, sortOrder: 3 },
  ],
  languages: [
    { id: 1, code: 'UZ', name: "O'zbek tili", isActive: true, sortOrder: 1 },
    { id: 2, code: 'RU', name: 'Rus tili', isActive: true, sortOrder: 2 },
    { id: 3, code: 'EN', name: 'Ingliz tili', isActive: true, sortOrder: 3 },
  ],
  nationalities: [
    { id: 1, code: 'UZB', name: "O'zbek", isActive: true, sortOrder: 1 },
    { id: 2, code: 'RUS', name: 'Rus', isActive: true, sortOrder: 2 },
    { id: 3, code: 'TAJ', name: 'Tojik', isActive: true, sortOrder: 3 },
    { id: 4, code: 'KAZ', name: "Qozoq", isActive: true, sortOrder: 4 },
  ],
  subject_types: [
    { id: 1, code: 'MAJOR', name: 'Mutaxassislik fani', isActive: true, sortOrder: 1 },
    { id: 2, code: 'GENERAL', name: 'Umumiy fan', isActive: true, sortOrder: 2 },
    { id: 3, code: 'ELECTIVE', name: 'Tanlov fani', isActive: true, sortOrder: 3 },
  ],
  districts: [
    { id: 1, code: 'CHI', name: 'Chilonzor tumani', isActive: true, sortOrder: 1 },
    { id: 2, code: 'MIR', name: "Mirzo Ulug'bek tumani", isActive: true, sortOrder: 2 },
    { id: 3, code: 'YAK', name: 'Yakkasaroy tumani', isActive: true, sortOrder: 3 },
    { id: 4, code: 'SER', name: 'Sergeli tumani', isActive: true, sortOrder: 4 },
  ],
  marital_status: [
    { id: 1, code: 'SINGLE', name: 'Turmush qurmagan', isActive: true, sortOrder: 1 },
    { id: 2, code: 'MARRIED', name: 'Turmush qurgan', isActive: true, sortOrder: 2 },
    { id: 3, code: 'DIVORCED', name: 'Ajrashgan', isActive: true, sortOrder: 3 },
  ],
  specialties: [
    { id: 1, code: 'SE', name: 'Dasturiy injiniring', isActive: true, sortOrder: 1 },
    { id: 2, code: 'IS', name: 'Axborot tizimlari', isActive: true, sortOrder: 2 },
    { id: 3, code: 'CS', name: 'Kiberxavfsizlik', isActive: true, sortOrder: 3 },
    { id: 4, code: 'AI', name: "Sun'iy intellekt", isActive: true, sortOrder: 4 },
  ],
};

export class DictionaryMockService implements IDictionaryService {
  async getItems(type: DictionaryType, params?: DictionaryListParams) {
    await delay(200);
    let items = DICT_DATA[type] ?? [];
    if (params?.search) { const q = params.search.toLowerCase(); items = items.filter((it) => it.name.toLowerCase().includes(q) || it.code.toLowerCase().includes(q)); }
    return items;
  }
  async createItem(type: DictionaryType, data: CreateDictionaryItemDto) {
    await delay(300);
    const items = DICT_DATA[type] ?? [];
    return { id: items.length + 100, ...data, isActive: true, sortOrder: data.sortOrder ?? items.length + 1 };
  }
  async updateItem(type: DictionaryType, id: number, data: Partial<CreateDictionaryItemDto>) {
    await delay(300);
    const item = (DICT_DATA[type] ?? []).find((it) => it.id === id);
    if (!item) throw new Error('Not found');
    return { ...item, ...data };
  }
  async deleteItem(_type: DictionaryType, _id: number) { await delay(200); }
}
