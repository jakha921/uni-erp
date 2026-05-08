import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number[];
  className?: string;
}

export function Accordion({ items, defaultOpen = [], className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set(defaultOpen));

  const toggle = (index: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-border rounded-lg border border-border', className)}>
      {items.map((item, i) => {
        const isOpen = openIds.has(i);
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-slate-50 transition-colors"
            >
              {item.title}
              <ChevronDown className={cn('h-4 w-4 text-muted transition-transform', isOpen && 'rotate-180')} />
            </button>
            {isOpen && <div className="px-4 pb-3 text-sm">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
