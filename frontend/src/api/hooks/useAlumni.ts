import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  AlumniListParams,
  CreateAlumniDto,
  UpdateAlumniDto,
} from '@/types/education';
import { alumniService } from '../services/alumni.service';

const KEYS = {
  all: ['alumni'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params?: AlumniListParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, 'detail'] as const,
  detail: (id: number) => [...KEYS.details(), id] as const,
};

export function useAlumniList(params?: AlumniListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => alumniService.getAlumni(params),
  });
}

export function useAlumni(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => alumniService.getAlumniById(id),
    enabled: id > 0,
  });
}

export function useCreateAlumni() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAlumniDto) => alumniService.createAlumni(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateAlumni() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAlumniDto }) =>
      alumniService.updateAlumni(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: KEYS.detail(variables.id),
      });
    },
  });
}
