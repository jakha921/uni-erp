import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationService } from '../services/education.service';
import type { SubjectDto } from '../services/education.service';
import type {
  SubjectListParams,
  ScheduleListParams,
  GradeListParams,
  BulkAttendanceDto,
  BulkGradesDto,
} from '@/types/education';

const KEYS = {
  subjects: (p?: SubjectListParams) => ['education', 'subjects', p] as const,
  schedules: (p?: ScheduleListParams) => ['education', 'schedules', p] as const,
  grades: (p?: GradeListParams) => ['education', 'grades', p] as const,
};

export function useSubjects(params?: SubjectListParams) {
  return useQuery({
    queryKey: KEYS.subjects(params),
    queryFn: () => educationService.getSubjects(params),
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: SubjectDto) => educationService.createSubject(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education', 'subjects'] }),
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: SubjectDto }) => educationService.updateSubject(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education', 'subjects'] }),
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => educationService.deleteSubject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education', 'subjects'] }),
  });
}

export function useSchedules(params?: ScheduleListParams) {
  return useQuery({
    queryKey: KEYS.schedules(params),
    queryFn: () => educationService.getSchedules(params),
  });
}

export function useGrades(params?: GradeListParams) {
  return useQuery({
    queryKey: KEYS.grades(params),
    queryFn: () => educationService.getGrades(params),
  });
}

export function useBulkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: BulkAttendanceDto) => educationService.bulkAttendance(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education', 'attendance'] }),
  });
}

export function useBulkGrades() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: BulkGradesDto) => educationService.bulkGrades(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education', 'grades'] }),
  });
}
