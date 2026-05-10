import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import type { NotificationListParams } from '@/types/operations';

const notifKeys = {
  all: ['notifications'] as const,
  lists: () => [...notifKeys.all, 'list'] as const,
  list: (params: NotificationListParams) => [...notifKeys.lists(), params] as const,
};

export function useNotificationsList(params: NotificationListParams) {
  return useQuery({
    queryKey: notifKeys.list(params),
    queryFn: () => notificationService.getList(params),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: notifKeys.lists() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: notifKeys.lists() });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.deleteNotification(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: notifKeys.lists() });
    },
  });
}
