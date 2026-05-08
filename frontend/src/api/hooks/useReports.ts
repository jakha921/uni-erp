import { useQuery, useMutation } from '@tanstack/react-query';
import { reportService } from '../services/report.service';

const reportKeys = {
  all: ['reports'] as const,
  templates: () => [...reportKeys.all, 'templates'] as const,
};

export function useReportTemplates() {
  return useQuery({
    queryKey: reportKeys.templates(),
    queryFn: () => reportService.getTemplates(),
  });
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: ({ templateId, params }: { templateId: number; params: Record<string, string | number> }) =>
      reportService.generateReport(templateId, params),
  });
}
