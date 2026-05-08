import { Badge } from '@/components/ui';
import type { LeaveStatus } from '@/types/hr';

const STATUS_MAP: Record<LeaveStatus, { variant: 'warning' | 'success' | 'error'; label: string }> = {
  pending: { variant: 'warning', label: 'Kutmoqda' },
  approved: { variant: 'success', label: 'Tasdiqlangan' },
  rejected: { variant: 'error', label: 'Rad etilgan' },
};

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
}

export function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
