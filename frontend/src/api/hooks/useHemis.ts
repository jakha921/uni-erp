import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '@/config/api';

type SyncType = 'references' | 'students' | 'employees' | 'all';

interface HemisSyncResult {
  status: string;
  output?: string;
  detail?: string;
}

export function useHemisSync() {
  return useMutation<HemisSyncResult, Error, SyncType>({
    mutationFn: (type) =>
      apiClient.post<HemisSyncResult>(ENDPOINTS.core.hemisSync, { type }),
  });
}
