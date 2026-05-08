import { StatusBadge } from '@/components/data-display/StatusBadge';
import type { StudentStatus } from '@/types/student';

const STATUS_CONFIG: Record<
  StudentStatus,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }
> = {
  active: { label: "O'qimoqda", variant: 'success' },
  academic_leave: { label: "Akademik ta'tilda", variant: 'warning' },
  expelled: { label: 'Chetlatilgan', variant: 'error' },
  graduated: { label: 'Bitirgan', variant: 'info' },
  transferred: { label: "Ko'chirilgan", variant: 'default' },
};

interface StudentStatusBadgeProps {
  status: StudentStatus;
  className?: string;
}

export function StudentStatusBadge({ status, className }: StudentStatusBadgeProps) {
  return <StatusBadge status={status} config={STATUS_CONFIG} className={className} />;
}
