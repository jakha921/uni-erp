import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ExamListParams,
  CreateExamDto,
  UpdateExamDto,
} from '@/types/education';
import { examService } from '../services/exam.service';

const KEYS = {
  all: ['exams'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params?: ExamListParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, 'detail'] as const,
  detail: (id: number) => [...KEYS.details(), id] as const,
};

export function useExamsList(params?: ExamListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => examService.getExams(params),
  });
}

export function useExam(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => examService.getExamById(id),
    enabled: id > 0,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExamDto) => examService.createExam(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExamDto }) =>
      examService.updateExam(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => examService.deleteExam(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}
