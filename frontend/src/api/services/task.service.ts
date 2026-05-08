import type {
  Task,
  TaskListParams,
  CreateTaskDto,
  TaskStatus,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { TaskMockService } from '../mock/task.mock';

export interface ITaskService {
  getList(params: TaskListParams): Promise<PaginatedResponse<Task>>;
  getById(id: number): Promise<Task>;
  create(data: CreateTaskDto): Promise<Task>;
  update(id: number, data: Partial<CreateTaskDto>): Promise<Task>;
  updateStatus(id: number, status: TaskStatus): Promise<Task>;
  delete(id: number): Promise<void>;
}

class TaskApiService implements ITaskService {
  async getList(params: TaskListParams): Promise<PaginatedResponse<Task>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Task[] }>(ENDPOINTS.operations.tasks, {
      params: {
        page,
        page_size: pageSize,
        search: params.search,
        status: params.status,
        priority: params.priority,
        assignee_id: params.assigneeId,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getById(id: number): Promise<Task> {
    return apiClient.get<Task>(ENDPOINTS.operations.taskDetail(id));
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return apiClient.post<Task>(ENDPOINTS.operations.tasks, data);
  }

  async update(id: number, data: Partial<CreateTaskDto>): Promise<Task> {
    return apiClient.patch<Task>(ENDPOINTS.operations.taskDetail(id), data);
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    return apiClient.patch<Task>(ENDPOINTS.operations.taskDetail(id), { status });
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.operations.taskDetail(id));
  }
}

export const taskService: ITaskService = USE_MOCK
  ? new TaskMockService()
  : new TaskApiService();
