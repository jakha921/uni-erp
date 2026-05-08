import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'px-3 py-2 rounded-md border text-sm transition-colors resize-y min-h-[80px] placeholder:text-muted',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        error ? 'border-error bg-error-light' : 'border-border bg-white',
        className,
      )}
      {...props}
    />
  ),
);
FormTextarea.displayName = 'FormTextarea';
