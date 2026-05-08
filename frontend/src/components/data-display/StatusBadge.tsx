import { cn } from '@/lib/utils';

interface StatusConfig {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
}

interface StatusBadgeProps {
  status: string;
  config: Record<string, StatusConfig>;
  className?: string;
}

const variantStyles = {
  success: 'bg-success-light text-green-700',
  warning: 'bg-warning-light text-amber-700',
  error: 'bg-error-light text-red-700',
  info: 'bg-info-light text-blue-700',
  default: 'bg-slate-100 text-slate-700',
} as const;

const dotStyles = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  default: 'bg-slate-400',
} as const;

export function StatusBadge({ status, config, className }: StatusBadgeProps) {
  const cfg = config[status] ?? { label: status, variant: 'default' as const };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        variantStyles[cfg.variant],
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[cfg.variant])} />
      {cfg.label}
    </span>
  );
}
