import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutGrid,
  Users,
  TrendingUp,
  GraduationCap,
  Wallet,
  FileText,
  AlertTriangle,
  CircleDollarSign,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Inbox,
  Home,
  Shield,
  Truck,
  Package,
  Warehouse,
  BookOpen,
  ClipboardList,
  Layers,
  Pen,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Bell,
  Flag,
  Star,
  User,
  Mail,
  HelpCircle,
  Search,
  Eye,
  FolderOpen,
  Megaphone,
  Key,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_GROUPS } from '@/config/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useAppStore } from '@/stores/app.store';

const ICON_MAP: Record<string, LucideIcon> = {
  grid: LayoutGrid,
  users: Users,
  chart: TrendingUp,
  graduation: GraduationCap,
  wallet: Wallet,
  doc: FileText,
  warning: AlertTriangle,
  money: CircleDollarSign,
  award: Award,
  briefcase: Briefcase,
  building: Building2,
  calendar: Calendar,
  check: CheckCircle,
  inbox: Inbox,
  home: Home,
  shield: Shield,
  truck: Truck,
  box: Package,
  warehouse: Warehouse,
  book: BookOpen,
  clipboard: ClipboardList,
  layers: Layers,
  edit: Pen,
  settings: Settings,
  bell: Bell,
  flag: Flag,
  star: Star,
  user: User,
  mail: Mail,
  help: HelpCircle,
  search: Search,
  eye: Eye,
  folder: FolderOpen,
  megaphone: Megaphone,
  key: Key,
};

const STORAGE_KEY = 'uni-erp-sidebar-groups';

function loadGroupState(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Record<string, boolean>;
  } catch { /* ignore */ }
  return {};
}

function saveGroupState(state: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentUser = useAuthStore((s) => s.currentUser);
  const role = currentUser?.role ?? 'admin';
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const mobileOpen = useAppStore((s) => s.sidebarMobileOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setSidebarMobileOpen = useAppStore((s) => s.setSidebarMobileOpen);

  const filteredGroups = NAV_GROUPS.filter((g) => !g.roles || g.roles.includes(role))
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((g) => g.items.length > 0);

  // Determine which group contains the active route
  const activeGroupKey = filteredGroups.find((g) =>
    g.items.some((item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/')),
  )?.key;

  // Group open/closed state with localStorage persistence
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const saved = loadGroupState();
    // Ensure the active group is open by default
    const initial: Record<string, boolean> = {};
    filteredGroups.forEach((g) => {
      if (g.label) {
        initial[g.key] = saved[g.key] !== undefined ? Boolean(saved[g.key]) : g.key === activeGroupKey;
      }
    });
    return initial;
  });

  // Auto-expand group when navigating into it
  useEffect(() => {
    if (activeGroupKey && !openGroups[activeGroupKey]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenGroups((prev) => ({ ...prev, [activeGroupKey]: true }));
    }
  }, [activeGroupKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage
  useEffect(() => {
    saveGroupState(openGroups);
  }, [openGroups]);

  const toggleGroup = useCallback((key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo + Branch */}
      <div className={cn('shrink-0 border-b border-border', collapsed ? 'px-2 py-4' : 'px-3 py-4')}>
        {/* Logo */}
        <div className={cn('flex items-center gap-2.5 px-2', collapsed && 'justify-center px-0')}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-[11px] tracking-tight shrink-0">
            NIU
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
                ERP
              </div>
              <div className="text-[10.5px] text-slate-400 mt-0.5">Raqamli universitet</div>
            </div>
          )}
        </div>

        {/* Branch selector */}
        {!collapsed && (
          <button className="w-full mt-3 px-3 py-2.5 rounded-[10px] border border-border bg-slate-50 dark:bg-slate-800 flex items-center gap-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold shrink-0">
              NV
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-[11px] text-slate-400">Filial</div>
              <div className="text-[12.5px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                Navoiy (bosh)
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {filteredGroups.map((group) => {
          const isOpen = !group.label || openGroups[group.key];
          const hasActive = group.items.some(
            (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'),
          );
          const totalCount = group.items.reduce((sum, it) => sum + (it.count ?? 0), 0);

          return (
            <div key={group.key} className={cn('mb-1', group.label && 'mb-1.5')}>
              {/* Group label with collapse toggle */}
              {group.label && !collapsed && (
                <button
                  onClick={() => toggleGroup(group.key)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] cursor-pointer rounded-md transition-colors',
                    hasActive
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
                  )}
                >
                  <ChevronDown
                    className={cn(
                      'h-[11px] w-[11px] transition-transform duration-150',
                      !isOpen && '-rotate-90',
                      hasActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400',
                    )}
                  />
                  <span className="flex-1 text-left">{t(group.label).toUpperCase()}</span>
                  {!isOpen && totalCount > 0 && (
                    <span className="text-[9.5px] font-bold px-1.5 py-px rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 tabular-nums normal-case tracking-normal">
                      {totalCount > 999 ? `${(totalCount / 1000).toFixed(1)}k` : totalCount}
                    </span>
                  )}
                </button>
              )}

              {/* Collapsed state: group divider */}
              {collapsed && group.label && <div className="h-px bg-border mx-2 my-2" />}

              {/* Items - render only when group is open (or sidebar is collapsed) */}
              {(isOpen || collapsed) &&
                group.items.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? LayoutGrid;
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setSidebarMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-colors mb-0.5',
                        collapsed
                          ? cn(
                              'justify-center px-0 h-10 w-10 mx-auto',
                              isActive
                                ? 'bg-emerald-500 text-white rounded-xl shadow-sm'
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200',
                            )
                          : isActive
                            ? 'bg-emerald-50 text-green-800 font-semibold dark:bg-primary-900/30 dark:text-primary-300'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100',
                      )}
                      title={collapsed ? t(item.label) : undefined}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          collapsed && isActive ? 'text-white' : isActive ? 'text-green-700 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500',
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{t(item.label)}</span>
                          {item.count !== undefined && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-error text-white">
                              {item.count}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:flex items-center justify-center py-3 border-t border-border shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-muted"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-surface border-r border-border h-screen fixed left-0 top-0 z-30 transition-all duration-200',
          collapsed ? 'w-[72px]' : 'w-60',
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-60 bg-surface shadow-xl z-50">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setSidebarMobileOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
