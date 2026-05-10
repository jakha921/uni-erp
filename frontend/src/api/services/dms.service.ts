import type { Document as Doc, DocumentListParams, CreateDocumentDto, Folder } from '@/types/admin';
import type { PaginatedResponse } from '@/types/common';
import { DmsMockService } from '../mock/dms.mock';

export interface IDmsService {
  getDocuments(params: DocumentListParams): Promise<PaginatedResponse<Doc>>;
  getDocumentById(id: number): Promise<Doc>;
  createDocument(data: CreateDocumentDto): Promise<Doc>;
  updateDocument(id: number, data: Partial<CreateDocumentDto>): Promise<Doc>;
  deleteDocument(id: number): Promise<void>;
  getFolders(): Promise<Folder[]>;
}

export const dmsService: IDmsService = new DmsMockService();
