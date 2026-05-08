import { useQuery } from '@tanstack/react-query';
import type { TeacherListParams } from '@/types/teacher';
import { teacherService } from '../services/teacher.service';

const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (params: TeacherListParams) => [...teacherKeys.lists(), params] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (id: number) => [...teacherKeys.details(), id] as const,
};

export function useTeachersList(params: TeacherListParams) {
  return useQuery({
    queryKey: teacherKeys.list(params),
    queryFn: () => teacherService.getTeachers(params),
  });
}

export function useTeacher(id: number) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => teacherService.getTeacherById(id),
    enabled: id > 0,
  });
}
