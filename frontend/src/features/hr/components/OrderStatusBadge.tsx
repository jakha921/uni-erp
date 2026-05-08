import { Badge } from '@/components/ui';
import type { OrderStatus } from '@/types/hr';

const STATUS_MAP: Record<OrderStatus, { variant: 'default' | 'warning' | 'success' | 'error'; label: string }> = {
  draft: { variant: 'default', label: 'Loyiha' },
  review: { variant: 'warning', label: "Ko'rib chiqishda" },
  signed: { variant: 'success', label: 'Imzolangan' },
  cancelled: { variant: 'error', label: 'Bekor qilingan' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.draft;
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
