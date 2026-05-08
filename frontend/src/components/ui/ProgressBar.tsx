import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  color?: string;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

export function ProgressBar({ value, color = 'bg-primary-500', size = 'md', label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted">{label}</span>
          <span className="text-xs font-medium">{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-slate-100', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
