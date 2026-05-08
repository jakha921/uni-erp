import { Building2, BookOpen, Briefcase, Users } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { HrDepartment, DepartmentType } from '@/types/hr';

interface DepartmentCardProps {
  department: HrDepartment;
  className?: string;
}

const TYPE_CONFIG: Record<DepartmentType, { label: string; variant: 'info' | 'success' | 'warning' | 'default'; icon: typeof Building2 }> = {
  rektorat: { label: 'Rektorat', variant: 'default', icon: Briefcase },
  fakultet: { label: 'Fakultet', variant: 'info', icon: Building2 },
  kafedra: { label: 'Kafedra', variant: 'success', icon: BookOpen },
  bolim: { label: "Bo'lim", variant: 'warning', icon: Briefcase },
};

export function DepartmentCard({ department, className }: DepartmentCardProps) {
  const config = TYPE_CONFIG[department.type] ?? TYPE_CONFIG.bolim;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'bg-surface rounded-lg border border-border p-5 hover:shadow-md transition-shadow',
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-50 text-primary-600">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
        {department.name}
      </h3>
      <p className="text-xs text-muted mb-3">Kod: {department.code}</p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <Users className="h-4 w-4 text-muted" />
          <span className="font-medium">{department.employeeCount}</span>
          <span className="text-muted text-xs">xodim</span>
        </div>
        {department.headName && (
          <span className="text-xs text-muted truncate max-w-[120px]" title={department.headName}>
            {department.headName}
          </span>
        )}
      </div>
    </div>
  );
}
