import type { Document as Doc, DocumentListParams, CreateDocumentDto, Folder } from '@/types/admin';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { DmsMockService } from '../mock/dms.mock';

export interface IDmsService {
  getDocuments(params: DocumentListParams): Promise<PaginatedResponse<Doc>>;
  getDocumentById(id: number): Promise<Doc>;
  createDocument(data: CreateDocumentDto): Promise<Doc>;
  updateDocument(id: number, data: Partial<CreateDocumentDto>): Promise<Doc>;
  deleteDocument(id: number): Promise<void>;
  getFolders(): Promise<Folder[]>;
}

class DmsApiService implements IDmsService {
  async getDocuments(params: DocumentListParams) {
    return apiClient.get<PaginatedResponse<Doc>>(ENDPOINTS.admin.documents, {
      params: { page: params.page, page_size: params.pageSize, search: params.search, folder_id: params.folderId, status: params.status, priority: params.priority, category: params.category },
    });
  }
  async getDocumentById(id: number) { return apiClient.get<Doc>(ENDPOINTS.admin.documentDetail(id)); }
  async createDocument(data: CreateDocumentDto) { return apiClient.post<Doc>(ENDPOINTS.admin.documents, data); }
  async updateDocument(id: number, data: Partial<CreateDocumentDto>) { return apiClient.patch<Doc>(ENDPOINTS.admin.documentDetail(id), data); }
  async deleteDocument(id: number) { return apiClient.delete<void>(ENDPOINTS.admin.documentDetail(id)); }
  async getFolders() { return apiClient.get<Folder[]>(ENDPOINTS.admin.folders); }
}

export const dmsService: IDmsService = USE_MOCK
  ? new DmsMockService()
  : new DmsApiService();
