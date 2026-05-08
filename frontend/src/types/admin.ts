import type { ListParams } from './common';

export type DocPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DocStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export interface Document {
  id: number;
  title: string;
  number: string;
  category: string;
  folderId: number;
  folderName: string;
  priority: DocPriority;
  status: DocStatus;
  authorId: number;
  authorName: string;
  fileUrl?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  documentCount: number;
}

export interface DocumentListParams extends ListParams {
  folderId?: number;
  status?: DocStatus;
  priority?: DocPriority;
  category?: string;
}

export interface CreateDocumentDto {
  title: string;
  category: string;
  folderId: number;
  priority: DocPriority;
  fileUrl?: string;
}

export interface AnalyticsData {
  studentTrend: { month: string; count: number }[];
  revenueTrend: { month: string; amount: number }[];
  attendanceRate: { month: string; rate: number }[];
  topGroups: { group: string; avgGrade: number; attendanceRate: number }[];
  byFaculty: { faculty: string; students: number; revenue: number; avgGrade: number }[];
}

export interface AnalyticsParams {
  period: 'month' | 'quarter' | 'year';
  yearFrom?: number;
  yearTo?: number;
}

export type DictionaryType = 'directions' | 'programs' | 'languages' | 'nationalities' | 'subject_types' | 'districts' | 'marital_status' | 'specialties';

export interface DictionaryItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface DictionaryListParams {
  type: DictionaryType;
  search?: string;
}

export interface CreateDictionaryItemDto {
  code: string;
  name: string;
  description?: string;
  sortOrder?: number;
}
