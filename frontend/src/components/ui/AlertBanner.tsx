import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';

type AlertVariant = 'info' | 'warning' | 'error' | 'success';

interface AlertBannerProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  className?: string;
}

const config: Record<AlertVariant, { bg: string; icon: typeof Info; iconColor: string }> = {
  info: { bg: 'bg-info-light border-blue-200', icon: Info, iconColor: 'text-blue-600' },
  warning: { bg: 'bg-warning-light border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600' },
  error: { bg: 'bg-error-light border-red-200', icon: AlertCircle, iconColor: 'text-red-600' },
  success: { bg: 'bg-success-light border-green-200', icon: CheckCircle2, iconColor: 'text-green-600' },
};

export function AlertBanner({ variant = 'info', title, message, dismissible = false, className }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const { bg, icon: Icon, iconColor } = config[variant];

  return (
    <div className={cn('flex items-start gap-3 px-4 py-3 rounded-lg border', bg, className)}>
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {dismissible && (
        <button type="button" onClick={() => setDismissed(true)} className="p-0.5 hover:bg-black/5 rounded shrink-0">
          <X className="h-4 w-4 text-muted" />
        </button>
      )}
    </div>
  );
}
