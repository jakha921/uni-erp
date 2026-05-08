import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  LeadListParams,
  CreateLeadDto,
  UpdateLeadDto,
  LeadStatus,
} from '@/types/crm';
import { crmService } from '../services/crm.service';

const KEYS = {
  all: ['crm'] as const,
  leads: () => [...KEYS.all, 'leads'] as const,
  leadList: (params: LeadListParams) => [...KEYS.leads(), 'list', params] as const,
  leadDetails: () => [...KEYS.leads(), 'detail'] as const,
  leadDetail: (id: number) => [...KEYS.leadDetails(), id] as const,
  stats: () => [...KEYS.all, 'stats'] as const,
};

export function useLeads(params: LeadListParams) {
  return useQuery({
    queryKey: KEYS.leadList(params),
    queryFn: () => crmService.getLeads(params),
  });
}

export function useLead(id: number) {
  return useQuery({
    queryKey: KEYS.leadDetail(id),
    queryFn: () => crmService.getLeadById(id),
    enabled: id > 0,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadDto) => crmService.createLead(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.leads() });
      void queryClient.invalidateQueries({ queryKey: KEYS.stats() });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadDto }) =>
      crmService.updateLead(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: KEYS.leads() });
      void queryClient.invalidateQueries({
        queryKey: KEYS.leadDetail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: KEYS.stats() });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => crmService.deleteLead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.leads() });
      void queryClient.invalidateQueries({ queryKey: KEYS.stats() });
    },
  });
}

export function useCrmStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => crmService.getStats(),
  });
}

export function useBulkUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: LeadStatus }) =>
      crmService.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.leads() });
      void queryClient.invalidateQueries({ queryKey: KEYS.stats() });
    },
  });
}
