import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appealService } from '../services/appeal.service';
import type { AppealListParams, CreateAppealDto, AppealStatus } from '@/types/operations';

const appealKeys = {
  all: ['appeals'] as const,
  lists: () => [...appealKeys.all, 'list'] as const,
  list: (params: AppealListParams) => [...appealKeys.lists(), params] as const,
  details: () => [...appealKeys.all, 'detail'] as const,
  detail: (id: number) => [...appealKeys.details(), id] as const,
};

export function useAppealsList(params: AppealListParams) {
  return useQuery({
    queryKey: appealKeys.list(params),
    queryFn: () => appealService.getList(params),
  });
}

export function useAppeal(id: number) {
  return useQuery({
    queryKey: appealKeys.detail(id),
    queryFn: () => appealService.getById(id),
    enabled: id > 0,
  });
}

export function useCreateAppeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppealDto) => appealService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appealKeys.lists() });
    },
  });
}

export function useUpdateAppealStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppealStatus }) =>
      appealService.updateStatus(id, status),
    onSuccess: (_result, variables) => {
      void qc.invalidateQueries({ queryKey: appealKeys.lists() });
      void qc.invalidateQueries({ queryKey: appealKeys.detail(variables.id) });
    },
  });
}

export function useAddAppealComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      appealService.addComment(id, content),
    onSuccess: (_result, variables) => {
      void qc.invalidateQueries({ queryKey: appealKeys.detail(variables.id) });
    },
  });
}

export function useDeleteAppeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appealService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appealKeys.lists() });
    },
  });
}
