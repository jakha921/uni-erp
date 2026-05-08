import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DocumentListParams, CreateDocumentDto } from '@/types/admin';
import { dmsService } from '../services/dms.service';

const KEYS = {
  all: ['dms'] as const,
  docs: () => [...KEYS.all, 'documents'] as const,
  docList: (params: DocumentListParams) => [...KEYS.docs(), params] as const,
  docDetail: (id: number) => [...KEYS.docs(), 'detail', id] as const,
  folders: () => [...KEYS.all, 'folders'] as const,
};

export function useDocuments(params: DocumentListParams) {
  return useQuery({ queryKey: KEYS.docList(params), queryFn: () => dmsService.getDocuments(params) });
}

export function useDocument(id: number) {
  return useQuery({ queryKey: KEYS.docDetail(id), queryFn: () => dmsService.getDocumentById(id), enabled: id > 0 });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateDocumentDto) => dmsService.createDocument(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.docs() }); } });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<CreateDocumentDto> }) => dmsService.updateDocument(id, data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.docs() }); } });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => dmsService.deleteDocument(id), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.docs() }); } });
}

export function useFolders() {
  return useQuery({ queryKey: KEYS.folders(), queryFn: () => dmsService.getFolders(), staleTime: 5 * 60 * 1000 });
}
