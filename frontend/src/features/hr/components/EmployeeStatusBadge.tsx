import { Badge } from '@/components/ui';
import type { EmployeeStatus } from '@/types/hr';

const STATUS_MAP: Record<EmployeeStatus, { variant: 'success' | 'warning' | 'info' | 'default'; label: string }> = {
  active: { variant: 'success', label: 'Faol' },
  leave: { variant: 'warning', label: "Ta'tilda" },
  business_trip: { variant: 'info', label: 'Safarda' },
  inactive: { variant: 'default', label: 'Faol emas' },
};

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.active;
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
