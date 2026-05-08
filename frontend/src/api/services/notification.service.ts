import type {
  Notification,
  NotificationListParams,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { NotificationMockService } from '../mock/notification.mock';

export interface INotificationService {
  getList(params: NotificationListParams): Promise<PaginatedResponse<Notification>>;
  markRead(id: number): Promise<void>;
  markAllRead(): Promise<void>;
}

class NotificationApiService implements INotificationService {
  async getList(params: NotificationListParams): Promise<PaginatedResponse<Notification>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Notification[] }>(ENDPOINTS.operations.notifications, {
      params: {
        page,
        page_size: pageSize,
        type: params.type,
        is_read: params.isRead,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async markRead(id: number): Promise<void> {
    await apiClient.post(ENDPOINTS.operations.markRead, { ids: [id] });
  }

  async markAllRead(): Promise<void> {
    await apiClient.post(ENDPOINTS.operations.markRead, { all: true });
  }
}

export const notificationService: INotificationService = USE_MOCK
  ? new NotificationMockService()
  : new NotificationApiService();
