import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { TaskListParams, CreateTaskDto, TaskStatus } from '@/types/operations';

const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: TaskListParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
};

export function useTasksList(params: TaskListParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => taskService.getList(params),
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.getById(id),
    enabled: id > 0,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTaskDto> }) =>
      taskService.update(id, data),
    onSuccess: (_result, variables) => {
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
      void qc.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
      taskService.updateStatus(id, status),
    onSuccess: (_result, variables) => {
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
      void qc.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => taskService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
