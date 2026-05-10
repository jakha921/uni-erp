import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  StudentListParams,
  CreateStudentDto,
  UpdateStudentDto,
} from '@/types/student';
import { studentsService } from '../services/students.service';

const KEYS = {
  all: ['students'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params: StudentListParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, 'detail'] as const,
  detail: (id: number) => [...KEYS.details(), id] as const,
  statistics: () => [...KEYS.all, 'statistics'] as const,
  grades: (id: number) => [...KEYS.all, 'grades', id] as const,
  attendance: (id: number) => [...KEYS.all, 'attendance', id] as const,
  documents: (id: number) => [...KEYS.all, 'documents', id] as const,
};

export function useStudentsList(params: StudentListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => studentsService.getList(params),
  });
}

export function useStudent(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => studentsService.getById(id),
    enabled: id > 0,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentDto) => studentsService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: KEYS.statistics() });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentDto }) =>
      studentsService.update(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: KEYS.detail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: KEYS.statistics() });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentsService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: KEYS.statistics() });
    },
  });
}

export function useStudentStatistics() {
  return useQuery({
    queryKey: KEYS.statistics(),
    queryFn: () => studentsService.getStatistics(),
  });
}

export function useStudentGrades(id: number) {
  return useQuery({
    queryKey: KEYS.grades(id),
    queryFn: () => studentsService.getGrades(id),
    enabled: id > 0,
  });
}

export function useStudentAttendance(id: number) {
  return useQuery({
    queryKey: KEYS.attendance(id),
    queryFn: () => studentsService.getAttendance(id),
    enabled: id > 0,
  });
}

export function useStudentDocuments(id: number) {
  return useQuery({
    queryKey: KEYS.documents(id),
    queryFn: () => studentsService.getDocuments(id),
    enabled: id > 0,
  });
}
