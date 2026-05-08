import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  current: number;
  completed?: number[];
  className?: string;
}

export function Stepper({ steps, current, completed = [], className }: StepperProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((label, i) => {
        const isCompleted = completed.includes(i);
        const isCurrent = i === current;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors',
                  isCompleted && 'bg-primary-500 border-primary-500 text-white',
                  isCurrent && !isCompleted && 'border-primary-500 text-primary-600 bg-primary-50',
                  !isCurrent && !isCompleted && 'border-border text-muted bg-surface',
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn('text-xs whitespace-nowrap', isCurrent ? 'font-medium text-primary-600' : 'text-muted')}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={cn('flex-1 h-0.5 mx-2 mt-[-16px]', isCompleted ? 'bg-primary-500' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
