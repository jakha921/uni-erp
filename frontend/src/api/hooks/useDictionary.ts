import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DictionaryType, DictionaryListParams, CreateDictionaryItemDto } from '@/types/admin';
import { dictionaryService } from '../services/dictionary.service';

const KEYS = {
  all: ['dictionary'] as const,
  items: (type: DictionaryType) => [...KEYS.all, type] as const,
};

export function useDictionaryItems(type: DictionaryType, params?: DictionaryListParams) {
  return useQuery({ queryKey: KEYS.items(type), queryFn: () => dictionaryService.getItems(type, params), staleTime: 5 * 60 * 1000 });
}

export function useCreateDictionaryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, data }: { type: DictionaryType; data: CreateDictionaryItemDto }) => dictionaryService.createItem(type, data),
    onSuccess: (_result, variables) => { void qc.invalidateQueries({ queryKey: KEYS.items(variables.type) }); },
  });
}

export function useUpdateDictionaryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id, data }: { type: DictionaryType; id: number; data: Partial<CreateDictionaryItemDto> }) => dictionaryService.updateItem(type, id, data),
    onSuccess: (_result, variables) => { void qc.invalidateQueries({ queryKey: KEYS.items(variables.type) }); },
  });
}

export function useDeleteDictionaryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id }: { type: DictionaryType; id: number }) => dictionaryService.deleteItem(type, id),
    onSuccess: (_result, variables) => { void qc.invalidateQueries({ queryKey: KEYS.items(variables.type) }); },
  });
}
