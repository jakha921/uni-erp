import type {
  ChatThread,
  ChatMessage,
} from '@/types/operations';
import type { ListParams } from '@/types/common';
import { MessageMockService } from '../mock/message.mock';

export interface IMessageService {
  getThreads(params: ListParams): Promise<ChatThread[]>;
  getMessages(threadId: number): Promise<ChatMessage[]>;
  sendMessage(threadId: number, content: string): Promise<ChatMessage>;
}

export const messageService: IMessageService = new MessageMockService();
