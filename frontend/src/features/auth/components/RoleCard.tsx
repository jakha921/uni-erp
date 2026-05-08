import {
  Shield,
  Wallet,
  Building2,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import type { RoleKey, RoleDef, User } from '@/types/auth';
import { cn } from '@/lib/utils';

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  wallet: Wallet,
  building: Building2,
  book: BookOpen,
  graduation: GraduationCap,
};

interface RoleCardProps {
  roleDef: RoleDef;
  roleKey: RoleKey;
  demoUser: User;
  onClick: () => void;
}

export function RoleCard({ roleDef, demoUser, onClick }: RoleCardProps) {
  const IconComp = ROLE_ICONS[roleDef.icon];

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-5',
        'text-left transition-all duration-200 min-h-[220px]',
        'hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500',
      )}
    >
      {/* Icon */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
        style={{
          background: `linear-gradient(135deg, ${roleDef.color} 0%, ${roleDef.color}CC 100%)`,
          boxShadow: `0 4px 14px ${roleDef.color}40`,
        }}
      >
        {IconComp && <IconComp className="h-5 w-5" />}
      </div>

      {/* Title + desc */}
      <div>
        <div className="text-[17px] font-bold tracking-tight text-slate-900">
          {roleDef.label}
        </div>
        <div className="mt-1 text-xs leading-relaxed text-slate-500">{roleDef.desc}</div>
      </div>

      {/* User preview */}
      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: roleDef.color }}
        >
          {demoUser.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-slate-900">{demoUser.name}</div>
        </div>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
