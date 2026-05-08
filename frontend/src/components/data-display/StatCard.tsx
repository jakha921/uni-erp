import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label?: string; raw?: string };
  iconBg?: string;
  iconColor?: string;
  sub?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  iconBg,
  sub,
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] p-5',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className,
      )}
      onClick={onClick}
    >
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-full text-white mb-3.5 shrink-0',
            iconBg && !iconBg.startsWith('#') && iconBg,
          )}
          style={iconBg?.startsWith('#') ? { backgroundColor: iconBg } : undefined}
        >
          {icon}
        </div>
      )}
      <p className="text-[13px] text-muted mb-1">{label}</p>
      <p className="text-[28px] font-bold text-slate-900 leading-tight tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
      {trend && (
        <div
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-xs font-medium',
            trend.value >= 0 ? 'text-green-700' : 'text-red-700',
          )}
        >
          {trend.value >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>
            {trend.raw
              ? trend.raw
              : `${trend.value > 0 ? '+' : ''}${trend.value}%`}
          </span>
          {trend.label && <span className="font-normal text-muted">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
