import {
  Menu,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Search,
  User,
  Settings,
  HelpCircle,
  RefreshCw,
  Check,
  DollarSign,
  Users,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useAppStore } from '@/stores/app.store';
import { Avatar } from '@/components/ui/Avatar';
import { ROLES_DEF } from '@/config/roles';
import type { RoleKey } from '@/types/auth';
import { useTranslation } from 'react-i18next';

interface SearchResult {
  kind: string;
  label: string;
  sub: string;
  route: string;
}

interface Notification {
  id: string;
  title: string;
  text: string;
  time: string;
  icon: 'dollar' | 'users' | 'file' | 'graduation';
  unread: boolean;
}

const LANG_FLAGS: Record<string, string> = { uz: '🇺🇿', ru: '🇷🇺', en: '🇬🇧' };
const LANG_LABELS: Record<string, string> = { uz: "O'zbekcha", ru: 'Русский', en: 'English' };

const MOCK_SEARCH_DATA: SearchResult[] = [
  { kind: 'talaba', label: 'Azimov Javohir', sub: 'Kompyuter injiniringi, 3-kurs', route: '/students/1' },
  { kind: 'talaba', label: 'Karimova Nilufar', sub: 'Iqtisodiyot, 2-kurs', route: '/students/2' },
  { kind: 'xodim', label: 'Rahimov Sherzod', sub: "Informatika kafedrasi, dotsent", route: '/hr/employees/1' },
  { kind: 'kontrakt', label: 'K-2024-001542', sub: 'Azimov Javohir — 12 000 000 soʻm', route: '/finance/contracts/1' },
  { kind: 'xodim', label: 'Toshmatova Dilorom', sub: 'Buxgalteriya, bosh hisobchi', route: '/hr/employees/2' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: "To'lov qabul qilindi", text: "Azimov J. — 2 000 000 so'm kontrakt to'lovi", time: '5 daqiqa', icon: 'dollar', unread: true },
  { id: '2', title: "Yangi talaba ro'yxatdan o'tdi", text: "Karimova Nilufar — Iqtisodiyot fakulteti", time: '1 soat', icon: 'graduation', unread: true },
  { id: '3', title: 'Buyruq imzolandi', text: "№142 Ishga qabul qilish buyrug'i", time: '3 soat', icon: 'file', unread: false },
  { id: '4', title: 'Xodim ta\'tili tasdiqlandi', text: "Rahimov Sh. — 14 kun mehnat ta'tili", time: '5 soat', icon: 'users', unread: false },
];

const NOTIF_ICON_MAP = {
  dollar: { Icon: DollarSign, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  users: { Icon: Users, bg: 'bg-blue-100', color: 'text-blue-600' },
  file: { Icon: FileText, bg: 'bg-amber-100', color: 'text-amber-600' },
  graduation: { Icon: GraduationCap, bg: 'bg-purple-100', color: 'text-purple-600' },
};

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export function Topbar() {
  const { t, i18n } = useTranslation();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const setSidebarMobileOpen = useAppStore((s) => s.setSidebarMobileOpen);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeLang = useCallback(() => setLangOpen(false), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeUser = useCallback(() => setUserMenuOpen(false), []);

  useClickOutside(searchRef, closeSearch);
  useClickOutside(langRef, closeLang);
  useClickOutside(notifRef, closeNotif);
  useClickOutside(userRef, closeUser);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return MOCK_SEARCH_DATA.filter(
      (r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q) || r.kind.includes(q),
    );
  }, [searchQuery]);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleLangSelect = (key: string) => {
    setLang(key as 'uz' | 'ru' | 'en');
    void i18n.changeLanguage(key);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSelect = (route: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(route);
  };

  const roleDef = currentUser ? ROLES_DEF[currentUser.role] : null;

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left: mobile menu + greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t('auth.welcome')}, {currentUser?.name.split(' ')[0]}
          </h1>
        </div>
      </div>

      {/* Center: Global Search */}
      <div ref={searchRef} className="relative hidden md:block w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-slate-400 pointer-events-none" />
        <input
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Qidirish: talaba, o'qituvchi, kontrakt…"
          className="w-full h-[38px] pl-[34px] pr-3 border border-border rounded-lg text-[13px] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
        {searchOpen && searchResults && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-surface border border-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] max-h-[380px] overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
            {searchResults.length === 0 ? (
              <div className="py-5 px-3.5 text-[13px] text-slate-400 text-center">
                Hech narsa topilmadi
              </div>
            ) : (
              searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSearchSelect(r.route)}
                  className="flex items-center gap-2.5 w-full p-2 px-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase tracking-wide">
                    {r.kind}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-900 dark:text-slate-100">{r.label}</div>
                    <div className="text-[11.5px] text-slate-400 truncate">{r.sub}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Language dropdown */}
        <div ref={langRef} className="relative hidden sm:block">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="h-9 px-2.5 rounded-lg border border-border bg-surface hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-200"
          >
            <span className="text-sm">{LANG_FLAGS[lang]}</span>
            <span className="uppercase text-[11px] tracking-wide">{lang}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
          {langOpen && (
            <div className="absolute top-[calc(100%+4px)] right-0 z-50 bg-surface border border-border rounded-[10px] shadow-[0_10px_25px_rgba(0,0,0,0.12)] p-1 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-150">
              {Object.keys(LANG_LABELS).map((key) => (
                <button
                  key={key}
                  onClick={() => handleLangSelect(key)}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] transition-colors',
                    lang === key
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                  )}
                >
                  <span className="text-base">{LANG_FLAGS[key]}</span>
                  <span>{LANG_LABELS[key]}</span>
                  {lang === key && <Check className="h-3.5 w-3.5 ml-auto" strokeWidth={3} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="h-9 w-9 rounded-lg border border-border bg-surface hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 inline-flex items-center justify-center"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Notifications dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Bildirishnomalar"
            className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 inline-flex items-center justify-center relative"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-surface px-0.5">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-[calc(100%+6px)] right-0 z-50 bg-surface border border-border rounded-xl w-[380px] shadow-[0_12px_40px_rgba(0,0,0,0.16)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="px-[18px] py-3.5 border-b border-border/60 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bildirishnomalar</span>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-primary hover:text-primary/80 bg-transparent border-none cursor-pointer"
                >
                  Hammasini o&#39;qilgan deb belgilash
                </button>
              </div>
              {/* List */}
              <div className="max-h-[380px] overflow-y-auto">
                {notifications.map((n) => {
                  const iconDef = NOTIF_ICON_MAP[n.icon];
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        'px-[18px] py-3 flex gap-3 border-b border-border/40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors',
                        n.unread && 'bg-emerald-50/50 dark:bg-emerald-900/10',
                      )}
                    >
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', iconDef.bg)}>
                        <iconDef.Icon className={cn('h-4 w-4', iconDef.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.text}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{n.time} oldin</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Footer */}
              <button
                onClick={() => { setNotifOpen(false); navigate('/notifications'); }}
                className="block w-full py-3 text-center text-[13px] font-medium text-primary hover:text-primary/80 border-t border-border/60 bg-transparent cursor-pointer"
              >
                Barcha bildirishnomalarni ko&#39;rish
              </button>
            </div>
          )}
        </div>

        {/* User menu dropdown */}
        <div ref={userRef} className="relative ml-1.5">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="h-9 pl-0.5 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer inline-flex items-center gap-2 transition-colors"
          >
            <Avatar name={currentUser?.name ?? ''} size="sm" />
            {roleDef && (
              <span
                className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: roleDef.bg, color: roleDef.fg }}
              >
                {roleDef.short}
              </span>
            )}
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-surface border border-border rounded-xl w-[280px] shadow-[0_12px_40px_rgba(0,0,0,0.16)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Profile header */}
              <div className="px-4 py-3.5 border-b border-border/60 flex gap-2.5 items-center">
                <Avatar name={currentUser?.name ?? ''} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {currentUser?.name ?? 'Admin'}
                  </div>
                  <div className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {currentUser?.email ?? 'admin@uni.uz'}
                  </div>
                  {roleDef && (
                    <span
                      className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: roleDef.bg, color: roleDef.fg }}
                    >
                      {roleDef.short}
                    </span>
                  )}
                </div>
              </div>
              {/* Menu items */}
              <div className="p-1">
                {[
                  { icon: User, label: 'Profil', route: '/profile' },
                  { icon: Settings, label: 'Sozlamalar', route: '/settings' },
                  { icon: HelpCircle, label: 'Yordam markazi', route: null },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (item.route) navigate(item.route);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                  >
                    <item.icon className="h-[15px] w-[15px] text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              {/* Bottom section */}
              <div className="p-1 border-t border-border/60">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    const switchRole = useAuthStore.getState().switchRole;
                    const roles: RoleKey[] = ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'];
                    const currentRole = currentUser?.role ?? 'admin';
                    const idx = roles.indexOf(currentRole);
                    const nextRole = roles[(idx + 1) % roles.length] ?? 'admin';
                    switchRole(nextRole);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                  <RefreshCw className="h-[15px] w-[15px] text-slate-400" />
                  <span>Rolni almashtirish</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[13px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                >
                  <LogOut className="h-[15px] w-[15px]" />
                  <span>Chiqish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
