import { delay } from './delay';
import { generateName, pick, rnum } from './shared-data';
import type { Document as Doc, DocumentListParams, CreateDocumentDto, Folder } from '@/types/admin';
import type { PaginatedResponse } from '@/types/common';
import type { IDmsService } from '../services/dms.service';

const FOLDERS: Folder[] = [
  { id: 1, name: 'Buyruqlar', parentId: null, documentCount: 8 },
  { id: 2, name: 'Shartnomalar', parentId: null, documentCount: 5 },
  { id: 3, name: 'Hisobotlar', parentId: null, documentCount: 4 },
  { id: 4, name: 'Kadrlar', parentId: null, documentCount: 6 },
  { id: 5, name: 'Ichki hujjatlar', parentId: null, documentCount: 3 },
];

const DOC_CATEGORIES = ['Buyruq', 'Shartnoma', 'Hisobot', 'Xat', 'Bayonnoma'];
const PRIORITIES: Doc['priority'][] = ['low', 'medium', 'high', 'urgent'];
const STATUSES: Doc['status'][] = ['draft', 'pending', 'approved', 'rejected', 'archived'];

const DOCUMENTS: Doc[] = Array.from({ length: 25 }, (_, i) => {
  const name = generateName(i + 1100, 0.35);
  return {
    id: i + 1, title: `${pick(DOC_CATEGORIES, i)} #${2026000 + i}`, number: `DOC-${2026000 + i}`,
    category: pick(DOC_CATEGORIES, i + 1), folderId: rnum(i, 1, 5), folderName: pick(FOLDERS.map((f) => f.name), i + 2),
    priority: pick(PRIORITIES, i + 3), status: pick(STATUSES, i + 4),
    authorId: rnum(i, 1, 10), authorName: name.short,
    fileUrl: i % 3 === 0 ? `/files/doc-${i + 1}.pdf` : undefined, fileSize: i % 3 === 0 ? rnum(i, 50000, 5000000) : undefined,
    createdAt: `2026-0${rnum(i, 1, 5)}-${String(rnum(i, 1, 28)).padStart(2, '0')}`,
    updatedAt: `2026-0${rnum(i + 1, 1, 5)}-${String(rnum(i + 1, 1, 28)).padStart(2, '0')}`,
  };
});

export class DmsMockService implements IDmsService {
  async getDocuments(params: DocumentListParams): Promise<PaginatedResponse<Doc>> {
    await delay(300);
    let data = [...DOCUMENTS];
    if (params.search) { const q = params.search.toLowerCase(); data = data.filter((d) => d.title.toLowerCase().includes(q) || d.number.toLowerCase().includes(q)); }
    if (params.folderId) data = data.filter((d) => d.folderId === params.folderId);
    if (params.status) data = data.filter((d) => d.status === params.status);
    if (params.priority) data = data.filter((d) => d.priority === params.priority);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 20;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }
  async getDocumentById(id: number) { await delay(200); const d = DOCUMENTS.find((d) => d.id === id); if (!d) throw new Error('Not found'); return d; }
  async createDocument(data: CreateDocumentDto) { await delay(300); return { id: DOCUMENTS.length + 1, ...data, number: `DOC-${Date.now()}`, authorId: 1, authorName: 'Admin', status: 'draft' as const, folderName: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; }
  async updateDocument(id: number, data: Partial<CreateDocumentDto>) { await delay(300); const d = DOCUMENTS.find((d) => d.id === id); if (!d) throw new Error('Not found'); return { ...d, ...data }; }
  async deleteDocument(_id: number) { await delay(200); }
  async getFolders() { await delay(200); return FOLDERS; }
}
