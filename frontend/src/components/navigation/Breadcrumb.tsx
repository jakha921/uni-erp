import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted" />}
          {item.path && i < items.length - 1 ? (
            <Link
              to={item.path}
              className="text-muted hover:text-slate-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                i === items.length - 1 ? 'text-slate-900 font-medium' : 'text-muted',
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
