import { useState, useMemo, Fragment } from 'react';
import { ChevronDown, ChevronRight, Building2, BookOpen, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui';
import { Card } from '@/components/data-display';
import { cn } from '@/lib/utils';
import type { HrDepartment, DepartmentType } from '@/types/hr';

interface DepartmentTreeProps {
  departments: HrDepartment[];
}

const ICON_MAP: Record<DepartmentType, typeof Building2> = {
  rektorat: Briefcase,
  fakultet: Building2,
  kafedra: BookOpen,
  bolim: Briefcase,
};

export function DepartmentTree({ departments }: DepartmentTreeProps) {
  const rootDepts = useMemo(
    () => departments.filter((d) => d.parentId === null),
    [departments],
  );
  const [expanded, setExpanded] = useState<Set<number>>(
    () => new Set(rootDepts.map((d) => d.id)),
  );

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const childrenOf = (id: number) =>
    departments.filter((d) => d.parentId === id);

  const renderNode = (dept: HrDepartment, level: number = 0) => {
    const kids = childrenOf(dept.id);
    const isOpen = expanded.has(dept.id);
    const Icon = ICON_MAP[dept.type] ?? Briefcase;

    return (
      <Fragment key={dept.id}>
        <div
          onClick={() => kids.length > 0 && toggle(dept.id)}
          className={cn(
            'flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 transition-colors',
            kids.length > 0 && 'cursor-pointer hover:bg-slate-50',
            level === 0 && 'bg-slate-50/70',
          )}
          style={{ paddingLeft: 16 + level * 24 }}
        >
          {kids.length > 0 ? (
            isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted shrink-0" />
            )
          ) : (
            <span className="w-3.5 shrink-0" />
          )}
          <Icon className="h-4 w-4 text-muted shrink-0" />
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                'text-sm',
                level === 0 ? 'font-semibold text-slate-900' : 'text-slate-700',
              )}
            >
              {dept.name}
            </div>
            <div className="text-xs text-muted mt-0.5">{dept.code}</div>
          </div>
          <Badge>{dept.employeeCount} xodim</Badge>
        </div>
        {isOpen && kids.map((k) => renderNode(k, level + 1))}
      </Fragment>
    );
  };

  return (
    <Card noPadding>
      <div className="px-4 py-3 border-b border-slate-200 flex justify-between text-xs text-muted font-semibold uppercase tracking-wider">
        <span>Tarkibiy bo&apos;linma</span>
        <span>Xodimlar</span>
      </div>
      {rootDepts.map((d) => renderNode(d))}
    </Card>
  );
}
