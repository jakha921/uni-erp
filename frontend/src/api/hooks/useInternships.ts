import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  InternshipListParams,
  CreateInternshipDto,
  UpdateInternshipDto,
} from '@/types/education';
import { internshipService } from '../services/internship.service';

const KEYS = {
  all: ['internships'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params?: InternshipListParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, 'detail'] as const,
  detail: (id: number) => [...KEYS.details(), id] as const,
};

export function useInternshipsList(params?: InternshipListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => internshipService.getInternships(params),
  });
}

export function useInternship(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => internshipService.getInternshipById(id),
    enabled: id > 0,
  });
}

export function useCreateInternship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInternshipDto) => internshipService.createInternship(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateInternship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInternshipDto }) =>
      internshipService.updateInternship(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: KEYS.detail(variables.id),
      });
    },
  });
}
