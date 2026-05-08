import type {
  ChatThread,
  ChatMessage,
} from '@/types/operations';
import type { ListParams } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { MessageMockService } from '../mock/message.mock';

export interface IMessageService {
  getThreads(params: ListParams): Promise<ChatThread[]>;
  getMessages(threadId: number): Promise<ChatMessage[]>;
  sendMessage(threadId: number, content: string): Promise<ChatMessage>;
}

class MessageApiService implements IMessageService {
  async getThreads(params: ListParams): Promise<ChatThread[]> {
    return apiClient.get<ChatThread[]>(ENDPOINTS.operations.threads, {
      params: { search: params.search },
    });
  }

  async getMessages(threadId: number): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(ENDPOINTS.operations.messages(threadId));
  }

  async sendMessage(threadId: number, content: string): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>(ENDPOINTS.operations.messages(threadId), { content });
  }
}

export const messageService: IMessageService = USE_MOCK
  ? new MessageMockService()
  : new MessageApiService();
