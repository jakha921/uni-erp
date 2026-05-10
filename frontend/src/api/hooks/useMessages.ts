import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/message.service';
import type { ListParams } from '@/types/common';

const messageKeys = {
  all: ['messages'] as const,
  threads: (params: ListParams) => [...messageKeys.all, 'threads', params] as const,
  messages: (threadId: number) => [...messageKeys.all, 'thread', threadId] as const,
};

export function useThreads(params: ListParams = {}) {
  return useQuery({
    queryKey: messageKeys.threads(params),
    queryFn: () => messageService.getThreads(params),
    refetchInterval: 10_000,
  });
}

export function useMessages(threadId: number) {
  return useQuery({
    queryKey: messageKeys.messages(threadId),
    queryFn: () => messageService.getMessages(threadId),
    enabled: threadId > 0,
    refetchInterval: threadId > 0 ? 10_000 : false,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, content }: { threadId: number; content: string }) =>
      messageService.sendMessage(threadId, content),
    onSuccess: (_result, variables) => {
      void qc.invalidateQueries({ queryKey: messageKeys.messages(variables.threadId) });
      void qc.invalidateQueries({ queryKey: [...messageKeys.all, 'threads'] });
    },
  });
}
