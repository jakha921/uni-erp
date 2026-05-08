import type { ListParams } from './common';

// Tasks
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description: string;
  assigneeId: number;
  assigneeName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskListParams extends ListParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  assigneeId: number;
  priority: TaskPriority;
  dueDate: string;
  tags?: string[];
}

// Notifications
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationListParams extends ListParams {
  type?: NotificationType;
  isRead?: boolean;
}

// Messages
export interface ChatThread {
  id: number;
  participantIds: number[];
  participantNames: string[];
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  threadId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

// Appeals
export type AppealStatus = 'new' | 'in_progress' | 'resolved' | 'closed';
export type AppealCategory = 'complaint' | 'request' | 'suggestion' | 'question';

export interface AppealComment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Appeal {
  id: number;
  title: string;
  description: string;
  category: AppealCategory;
  status: AppealStatus;
  authorId: number;
  authorName: string;
  assigneeId?: number;
  assigneeName?: string;
  comments: AppealComment[];
  createdAt: string;
  updatedAt: string;
}

export interface AppealListParams extends ListParams {
  status?: AppealStatus;
  category?: AppealCategory;
}

export interface CreateAppealDto {
  title: string;
  description: string;
  category: AppealCategory;
}

// News
export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  isPinned: boolean;
  publishedAt: string;
}

export interface NewsListParams extends ListParams {
  category?: string;
  tag?: string;
}

export interface CreateNewsDto {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

// Reports
export interface ReportParam {
  key: string;
  label: string;
  type: 'date' | 'select' | 'number';
  options?: string[];
  required: boolean;
}

export interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  format: 'pdf' | 'excel';
  parameters: ReportParam[];
}
