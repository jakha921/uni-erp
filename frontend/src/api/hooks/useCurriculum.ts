import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CurriculumListParams,
  CreateCurriculumDto,
  UpdateCurriculumDto,
} from '@/types/education';
import { curriculumService } from '../services/curriculum.service';

const KEYS = {
  all: ['curriculum'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params?: CurriculumListParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, 'detail'] as const,
  detail: (id: number) => [...KEYS.details(), id] as const,
};

export function useCurriculumList(params?: CurriculumListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => curriculumService.getCurriculums(params),
  });
}

export function useCurriculum(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => curriculumService.getCurriculumById(id),
    enabled: id > 0,
  });
}

export function useCreateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCurriculumDto) => curriculumService.createCurriculum(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCurriculumDto }) =>
      curriculumService.updateCurriculum(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: KEYS.detail(variables.id),
      });
    },
  });
}
