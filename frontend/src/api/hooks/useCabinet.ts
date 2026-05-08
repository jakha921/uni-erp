import { useQuery } from '@tanstack/react-query';
import { cabinetService } from '../services/cabinet.service';

const KEYS = {
  all: ['cabinet'] as const,
  student: () => [...KEYS.all, 'student'] as const,
  teacher: () => [...KEYS.all, 'teacher'] as const,
};

export function useStudentCabinet() {
  return useQuery({ queryKey: KEYS.student(), queryFn: () => cabinetService.getStudentCabinet() });
}

export function useTeacherCabinet() {
  return useQuery({ queryKey: KEYS.teacher(), queryFn: () => cabinetService.getTeacherCabinet() });
}
