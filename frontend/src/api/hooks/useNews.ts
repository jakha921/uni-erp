import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../services/news.service';
import type { NewsListParams, CreateNewsDto } from '@/types/operations';

const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (params: NewsListParams) => [...newsKeys.lists(), params] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: number) => [...newsKeys.details(), id] as const,
};

export function useNewsList(params: NewsListParams) {
  return useQuery({
    queryKey: newsKeys.list(params),
    queryFn: () => newsService.getList(params),
  });
}

export function useNewsArticle(id: number) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsService.getById(id),
    enabled: id > 0,
  });
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsDto) => newsService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: newsKeys.lists() });
    },
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateNewsDto> }) =>
      newsService.update(id, data),
    onSuccess: (_result, variables) => {
      void qc.invalidateQueries({ queryKey: newsKeys.lists() });
      void qc.invalidateQueries({ queryKey: newsKeys.detail(variables.id) });
    },
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: newsKeys.lists() });
    },
  });
}
