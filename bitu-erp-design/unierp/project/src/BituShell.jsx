// BituShell.jsx — BITU-specific sidebar with grouped navigation

// roles: array of role keys that can see this group/item.
// undefined = visible to all (admin always sees everything).
const BITU_NAV_GROUPS = [
{
  label: null, key: 'main',
  roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi'],
  items: [
  { id: 'dashboard', label: 'Asosiy', icon: 'grid', roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi'] }]

},
{
  label: 'TALABALAR', key: 'tal',
  roles: ['admin', 'dekan', 'oqituvchi'],
  items: [
  { id: 'students-stat', label: 'Statistika', icon: 'chart', roles: ['admin', 'dekan'] },
  { id: 'students-list', label: "Ro'yxat", icon: 'users', roles: ['admin', 'dekan'] },
  { id: 'my-students', label: 'Mening talabalarim', icon: 'graduation', roles: ['oqituvchi'] }]

},
{
  label: "TA'LIM", key: 'edu',
  roles: ['admin'],
  items: [
  { id: 'teachers', label: "O'qituvchilar", icon: 'briefcase' },
  { id: 'attendance', label: 'Davomat', icon: 'check' },
  { id: 'grading', label: 'Baholash', icon: 'edit' },
  { id: 'schedule', label: 'Dars jadvali', icon: 'calendar' },
  { id: 'exams', label: 'Imtihonlar', icon: 'award' },
  { id: 'alumni', label: 'Bitiruvchilar', icon: 'graduation' },
  { id: 'internship', label: 'Amaliyot', icon: 'clipboard' }]

},
{
  label: "O'QUV JARAYONI", key: 'curr',
  roles: ['admin'],
  items: [
  { id: 'curriculum', label: "O'quv rejalar", icon: 'doc' },
  { id: 'departments', label: 'Kafedralar', icon: 'building' },
  { id: 'subjects', label: 'Fanlar', icon: 'book' },
  { id: 'library', label: 'Kutubxona', icon: 'book' }]

},
{
  label: 'QABUL (CRM)', key: 'crm',
  roles: ['admin'],
  items: [
  { id: 'crm', label: 'Arizalar', icon: 'inbox', count: 23 },
  { id: 'crm-kanban', label: 'Voronka', icon: 'chart' },
  { id: 'crm-report', label: 'CRM hisobot', icon: 'chart' }]

},
{
  label: 'MOLIYA', key: 'fin',
  roles: ['admin', 'buxgalter', 'dekan'],
  items: [
  { id: 'finance', label: 'Moliyaviy panel', icon: 'wallet', roles: ['admin', 'buxgalter', 'dekan'] },
  { id: 'moliya-contracts', label: 'Kontraktlar', icon: 'doc', roles: ['admin', 'buxgalter'] },
  { id: 'moliya-debtors', label: 'Qarzdorlar', icon: 'warning', roles: ['admin', 'buxgalter'] },
  { id: 'moliya-payments', label: "To'lovlar", icon: 'money', roles: ['admin', 'buxgalter'] },
  { id: 'moliya-scholarship', label: 'Stipendiya', icon: 'award', roles: ['admin', 'buxgalter'] },
  { id: 'finance-report', label: 'Hisobot', icon: 'chart', roles: ['admin', 'buxgalter', 'dekan'] },
  { id: 'payroll', label: 'Maosh', icon: 'money', roles: ['admin'] },
  { id: 'budget', label: 'Byudjet', icon: 'wallet', roles: ['admin'] }]

},
{
  label: 'KADRLAR', key: 'hr',
  roles: ['admin', 'dekan'],
  items: [
  { id: 'hr', label: 'Kadrlar paneli', icon: 'chart' },
  { id: 'hr-employees', label: 'Xodimlar', icon: 'users' },
  { id: 'hr-departments', label: "Bo'limlar", icon: 'building' },
  { id: 'hr-orders', label: 'Buyruqlar', icon: 'doc' },
  { id: 'hr-attendance', label: 'Davomad', icon: 'calendar' },
  { id: 'hr-leaves', label: "Ta'tillar va safar", icon: 'briefcase' }]

},
{
  label: 'XODIMLAR (eski)', key: 'hrold',
  roles: ['admin'],
  items: [
  { id: 'orders', label: 'Buyruqlar (eski)', icon: 'doc' },
  { id: 'staffing', label: 'Shtatlash jadvali', icon: 'layers' }]

},
{
  label: 'INFRATUZILMA', key: 'infra',
  roles: ['admin'],
  items: [
  { id: 'dormitory', label: 'TTJ (yotoqxona)', icon: 'home' },
  { id: 'warehouse', label: 'Ombor', icon: 'warehouse' },
  { id: 'equipment', label: 'Jihozlar', icon: 'box' },
  { id: 'transport', label: 'Transport', icon: 'truck' }]

},
{
  label: 'ILMIY FAOLIYAT', key: 'sci',
  roles: ['admin'],
  items: [
  { id: 'research', label: 'Ilmiy ishlar', icon: 'chart' },
  { id: 'theses', label: 'Diplom ishlari', icon: 'doc' },
  { id: 'conferences', label: 'Konferensiyalar', icon: 'megaphone' },
  { id: 'patents', label: 'Patentlar', icon: 'star' }]

},
{
  label: 'KABINETLAR', key: 'cab',
  roles: ['admin'],
  items: [
  { id: 'student-cabinet', label: 'Talaba kabineti', icon: 'user' },
  { id: 'teacher-cabinet', label: "O'qituvchi kabineti", icon: 'user' }]

},
{
  label: 'BOSHQARUV', key: 'ops',
  roles: ['admin'],
  items: [
  { id: 'tasks', label: 'Topshiriqlar', icon: 'check', count: 14 },
  { id: 'appeals', label: 'Murojaatlar', icon: 'inbox', count: 12 },
  { id: 'messages', label: 'Xabarlar', icon: 'mail', count: 8 },
  { id: 'notifications', label: 'Bildirishnomalar', icon: 'bell', count: 5 },
  { id: 'news', label: 'Yangiliklar', icon: 'megaphone' }]

},
{
  label: 'ADMIN', key: 'adm',
  roles: ['admin'],
  items: [
  { id: 'dms', label: 'Hujjat aylanishi', icon: 'folder' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'reports', label: 'Hisobotlar', icon: 'doc' },
  { id: 'reference', label: "Ma'lumotnomalar", icon: 'book' }]

},
{
  label: 'PROFIL', key: 'pro',
  roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  items: [
  { id: 'profile', label: 'Shaxsiy kabinet', icon: 'user' },
  { id: 'settings', label: 'Sozlamalar', icon: 'settings' }]

},
{
  label: 'TIZIM', key: 'sys',
  roles: ['admin'],
  items: [
  { id: 'users', label: 'Foydalanuvchilar', icon: 'users', count: 32 },
  { id: 'roles', label: 'Rollar', icon: 'shield' },
  { id: 'permissions', label: 'Ruxsatlar', icon: 'key' },
  { id: 'audit', label: 'Audit log', icon: 'eye' }]

}];


// find which group key contains a given route
const findGroupForRoute = (routeId) => {
  for (const g of BITU_NAV_GROUPS) {
    if (g.items.some((it) => it.id === routeId)) return g.key;
  }
  return null;
};

const BituSidebar = ({ active, onNav, collapsed, onLogout, mobileOpen, onCloseMobile }) => {
  const [showBranch, setShowBranch] = React.useState(false);
  const app = typeof useApp === 'function' ? useApp() : null;
  const auth = typeof useAuth === 'function' ? useAuth() : null;
  const role = auth?.currentUser?.role || 'admin';

  // Filter groups & items by role
  const visibleGroups = React.useMemo(() => {
    return BITU_NAV_GROUPS
      .map((g) => {
        if (g.roles && !g.roles.includes(role)) return null;
        const items = g.items.filter((it) => !it.roles || it.roles.includes(role));
        if (items.length === 0) return null;
        return { ...g, items };
      })
      .filter(Boolean);
  }, [role]);
  const isDark = app?.theme === 'dark';
  const t = isDark ? THEMES.dark : THEMES.light;

  // Group open/closed state with localStorage persistence
  const activeGroup = findGroupForRoute(active);
  const [openGroups, setOpenGroups] = React.useState(() => {
    try {
      const saved = localStorage.getItem('bitu.sidebar.openGroups');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const init = {};
    BITU_NAV_GROUPS.forEach((g) => {init[g.key] = g.key === activeGroup;});
    return init;
  });

  React.useEffect(() => {
    if (activeGroup && !openGroups[activeGroup]) {
      setOpenGroups((o) => ({ ...o, [activeGroup]: true }));
    }
  }, [activeGroup]);

  React.useEffect(() => {
    try {localStorage.setItem('bitu.sidebar.openGroups', JSON.stringify(openGroups));} catch (e) {}
  }, [openGroups]);

  const toggleGroup = (key) => setOpenGroups((o) => ({ ...o, [key]: !o[key] }));

  const handleNav = (id) => {
    onNav?.(id);
    onCloseMobile?.();
  };

  return (
    <aside className={`bitu-sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{
      width: collapsed ? 72 : 248, background: t.card, borderRight: `1px solid ${t.border}`,
      padding: '18px 10px 14px', display: 'flex', flexDirection: 'column',
      flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      transition: 'width 200ms ease', overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 16px',
        borderBottom: `1px solid ${t.borderLight}`, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#2DB976,#1B7A4E)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 11, letterSpacing: '-0.02em', flexShrink: 0 }}>NIU
        </div>
        {!collapsed &&
        <div className="sidebar-label" style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text, letterSpacing: '-0.01em', lineHeight: 1.1 }}>ERP</div>
            <div style={{ fontSize: 10.5, color: t.textMuted, marginTop: 2 }}>Raqamli universitet</div>
          </div>
        }
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 2, marginRight: -2 }}>
        {visibleGroups.map((group, gi) => {
          const isOpen = !group.label || openGroups[group.key];
          const totalCount = group.items.reduce((s, it) => s + (it.count || 0), 0);
          const hasActive = group.items.some((it) => it.id === active);
          return (
            <div key={gi} style={{ marginBottom: group.label ? 4 : 2 }}>
            {group.label && !collapsed &&
              <button onClick={() => toggleGroup(group.key)} type="button"
              className="sidebar-group-label"
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '10px 12px 6px', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 10, fontWeight: 600,
                color: hasActive ? t.primaryDark : t.textLight,
                textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Icon name="chevronDown" size={11}
                style={{ transition: 'transform 150ms ease',
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                  color: hasActive ? t.primary : t.textLight }} />
                <span style={{ flex: 1, textAlign: 'left' }}>{group.label}</span>
                {!isOpen && totalCount > 0 &&
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 9999,
                  background: t.primaryBg, color: t.primaryDark,
                  fontVariantNumeric: 'tabular-nums', textTransform: 'none', letterSpacing: 0 }}>
                    {totalCount > 999 ? (totalCount / 1000).toFixed(1) + 'k' : totalCount}
                  </span>
                }
              </button>
              }
            {(isOpen || collapsed) && group.items.map((item) =>
              <BituNavItem key={item.id} item={item} active={item.id === active} collapsed={collapsed}
              onClick={() => handleNav(item.id)} theme={t} />
              )}
          </div>);
        })}
      </div>

      {!collapsed &&
      <div className="sidebar-user-info" style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.borderLight}` }}>
          <button className="sidebar-branch" onClick={() => setShowBranch(!showBranch)}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`,
          background: t.inputBg, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'inherit' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#D1FAE5', color: '#1B7A4E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>NV</div>
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{ fontSize: 11, color: t.textMuted }}>Filial</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Navoiy (bosh)</div>
            </div>
            <Icon name="chevronDown" size={14} style={{ color: t.textLight }} />
          </button>

          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px' }}>
            <Avatar initials={auth?.currentUser?.initials || 'AD'} size={32} color="primary" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {auth?.currentUser?.name?.split(' ').slice(0, 2).join(' ') || 'Admin'}
              </div>
              <div style={{ fontSize: 10.5, color: t.textMuted }}>
                {ROLES_DEF[role]?.label || 'Super admin'}
              </div>
            </div>
            <IconButton icon="logout" label="Chiqish" size={28} onClick={onLogout} />
          </div>
        </div>
      }
    </aside>);

};

const BituNavItem = ({ item, active, onClick, collapsed, theme }) => {
  const t = theme || THEMES.light;
  const bg = active ? t.primary : 'transparent';
  const fg = active ? '#fff' : t.text;
  return (
    <button onClick={onClick} type="button"
    data-nav-id={item.id} data-active={active ? '1' : '0'}
    className={`sidebar-nav-item ${active ? '' : 'hover-bg'}`}
    title={collapsed ? item.label : ''}
    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '9px 12px',
      justifyContent: collapsed ? 'center' : 'flex-start',
      borderRadius: 8, fontSize: 13.5, width: '100%', textAlign: 'left',
      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      backgroundColor: bg, color: fg,
      fontWeight: active ? 600 : 450,
      transition: 'background-color 150ms ease' }}>
      <Icon name={item.icon} size={17} />
      {!collapsed && <span className="sidebar-nav-text" style={{ flex: 1 }}>{item.label}</span>}
      {!collapsed && item.count != null &&
      <span className="sidebar-nav-text" style={{ backgroundColor: active ? 'rgba(255,255,255,.22)' : t.primaryBg,
        color: active ? '#fff' : t.primaryDark,
        fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
        fontVariantNumeric: 'tabular-nums' }}>
          {item.count > 999 ? (item.count / 1000).toFixed(1) + 'k' : item.count}
        </span>
      }
    </button>);

};

const BituTopbar = ({ title, breadcrumb, greeting, actions, onToggleSidebar, onNav, onLogout }) => {
  const app = typeof useApp === 'function' ? useApp() : null;
  const auth = typeof useAuth === 'function' ? useAuth() : null;
  const cu = auth?.currentUser;
  const role = cu?.role || 'admin';
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const searchRef = React.useRef(null);
  const notifRef = React.useRef(null);
  const userRef = React.useRef(null);
  const langRef = React.useRef(null);

  React.useEffect(() => {
    const close = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const sResults = React.useMemo(() => {
    if (!globalSearch || globalSearch.length < 2) return null;
    const q = globalSearch.toLowerCase();
    const stu = (window.STUDENTS || []).filter((s) => s.name.full.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)).slice(0, 4).
    map((s) => ({ kind: 'Talaba', label: s.name.full, sub: `${s.id} · ${s.group} · ${s.faculty}`, route: 'students' }));
    const tea = (window.TEACHERS || []).filter((t) => t.name.full.toLowerCase().includes(q)).slice(0, 3).
    map((t) => ({ kind: "O'qituvchi", label: t.name.full, sub: `${t.dept || ''}`, route: 'teachers' }));
    const con = (window.CONTRACTS || []).filter((c) => c.id.toLowerCase().includes(q) || (c.student || '').toLowerCase().includes(q)).slice(0, 3).
    map((c) => ({ kind: 'Kontrakt', label: c.id, sub: c.student, route: 'contracts' }));
    return [...stu, ...tea, ...con];
  }, [globalSearch]);

  const notifs = window.RECENT_NOTIFS || [
  { id: 1, icon: 'inbox', color: '#3B82F6', bg: '#EFF6FF', title: 'Yangi ariza', text: "Karimov J. — CRM'ga kirdi", time: '3 min', unread: true },
  { id: 2, icon: 'doc', color: '#F59E0B', bg: '#FFFBEB', title: "Kontrakt to'lovi kechikmoqda", text: 'K-2024-1672 — 7 kun', time: '12 min', unread: true },
  { id: 3, icon: 'check', color: '#2DB976', bg: '#ECFDF5', title: 'Davomat tasdiqlandi', text: '301-A guruhi · Algoritmlar', time: '1 soat', unread: true },
  { id: 4, icon: 'users', color: '#8B5CF6', bg: '#F5F3FF', title: 'Yangi xabar', text: "Rektorat — yig'ilish 18:00", time: '3 soat', unread: false },
  { id: 5, icon: 'bell', color: '#EF4444', bg: '#FEF2F2', title: 'Sessiya boshlanmoqda', text: '24-may da kech.', time: '1 kun', unread: false }];

  const unreadCount = notifs.filter((n) => n.unread).length;

  const lang = app?.lang || 'uz';
  const setLang = app?.setLang || (() => {});
  const theme = app?.theme || 'light';
  const setTheme = app?.setTheme || (() => {});
  const isDark = theme === 'dark';
  const t = isDark ? THEMES.dark : THEMES.light;

  const langLabels = { uz: "O'zbekcha", ru: 'Русский', en: 'English' };
  const langFlags = { uz: '🇺🇿', ru: '🇷🇺', en: '🇬🇧' };

  return (
    <div className="bitu-topbar" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px',
      background: t.card, borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, zIndex: 20,
      transition: 'background 200ms ease, border-color 200ms ease' }}>

      {/* Hamburger — visible only on mobile via CSS */}
      <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Menu"
        style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent',
          color: t.textMuted, cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="menu" size={20} />
      </button>

      <button onClick={onToggleSidebar} aria-label="Toggle sidebar" className="hide-mobile icon-btn-hover" style={{
        width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent',
        color: t.textMuted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon name="more" size={18} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb &&
        <div className="hide-mobile" style={{ fontSize: 12, color: t.textMuted, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
            {breadcrumb.map((b, i) =>
          <React.Fragment key={i}>
                {i > 0 && <span style={{ color: t.textLight }}>/</span>}
                <span style={{ color: i === breadcrumb.length - 1 ? t.text : t.textMuted,
              fontWeight: i === breadcrumb.length - 1 ? 500 : 400 }}>{b}</span>
              </React.Fragment>
          )}
          </div>
        }
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text, letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
          {greeting && <span className="hide-mobile" style={{ fontWeight: 400, color: t.textMuted, marginLeft: 10, fontSize: 14 }}>{greeting}</span>}
        </h1>
      </div>

      {/* Global search */}
      <div ref={searchRef} className="topbar-search" style={{ position: 'relative', width: 320 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.textLight, pointerEvents: 'none' }}>
          <Icon name="search" size={15} />
        </span>
        <input
          value={globalSearch}
          onChange={(e) => {setGlobalSearch(e.target.value);setSearchOpen(true);}}
          onFocus={() => setSearchOpen(true)}
          placeholder="Qidirish: talaba, o'qituvchi, kontrakt…"
          style={{ width: '100%', height: 38, padding: '0 12px 0 34px',
            border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
            background: t.inputBg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
        {searchOpen && sResults &&
        <div className="slide-down" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,.12)', maxHeight: 380, overflowY: 'auto', padding: 6 }}>
            {sResults.length === 0 ?
          <div style={{ padding: '20px 14px', fontSize: 13, color: t.textMuted, textAlign: 'center' }}>Hech narsa topilmadi</div> :
          sResults.map((r, i) =>
          <button key={i} className="hover-bg" onClick={() => {setSearchOpen(false);setGlobalSearch('');onNav?.(r.route);}}
          style={{ display: 'flex', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none',
            background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit',
            alignItems: 'center' }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: '#ECFDF5', color: '#1B7A4E', textTransform: 'uppercase', letterSpacing: '.04em' }}>{r.kind}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, color: t.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</div>
                </div>
              </button>
          )}
          </div>
        }
      </div>

      {/* Lang switcher */}
      <div ref={langRef} className="hide-mobile" style={{ position: 'relative' }}>
        <button onClick={(e) => {e.stopPropagation();setLangOpen((o) => !o);}}
        style={{ height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${t.border}`,
          background: t.card, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12.5, fontWeight: 500, color: t.text, fontFamily: 'inherit' }}>
          <span style={{ fontSize: 14 }}>{langFlags[lang]}</span>
          <span style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.05em' }}>{lang}</span>
          <Icon name="chevronDown" size={12} style={{ color: t.textMuted }} />
        </button>
        {langOpen &&
        <div className="slide-down" style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50,
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 10,
          boxShadow: '0 10px 25px rgba(0,0,0,.12)', padding: 4, minWidth: 160 }}>
            {Object.keys(langLabels).map((k) =>
          <button key={k} className="hover-bg" onClick={() => {setLang(k);setLangOpen(false);}}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 10px',
            borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: lang === k ? t.primaryBg : 'transparent',
            color: lang === k ? t.primaryDark : t.text, fontSize: 13, fontWeight: lang === k ? 600 : 450 }}>
                <span style={{ fontSize: 16 }}>{langFlags[k]}</span>
                <span>{langLabels[k]}</span>
                {lang === k && <Icon name="check" size={13} stroke={3} style={{ marginLeft: 'auto' }} />}
              </button>
          )}
          </div>
        }
      </div>

      {/* Theme toggle */}
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Theme" className="icon-btn-hover"
      style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.border}`,
        background: t.card, color: t.textMuted, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isDark ?
          <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></> :

          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          }
        </svg>
      </button>

      {/* Notifications */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button onClick={(e) => {e.stopPropagation();setNotifOpen((o) => !o);}} aria-label="Bildirishnomalar"
        className="icon-btn-hover"
        style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent',
          color: t.textMuted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative' }}>
          <Icon name="bell" size={18} />
          {unreadCount > 0 &&
          <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 999,
            background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.card}` }}>{unreadCount}</span>
          }
        </button>
        {notifOpen &&
        <div className="slide-down" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, width: 380,
          boxShadow: '0 12px 40px rgba(0,0,0,.16)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${t.borderLight}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Bildirishnomalar</div>
              <button style={{ background: 'transparent', border: 'none', color: t.primary,
              fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Hammasini o'qilgan deb belgilash</button>
            </div>
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {notifs.map((n) =>
            <div key={n.id} className="hover-bg" style={{ padding: '12px 18px', display: 'flex', gap: 12,
              borderBottom: `1px solid ${t.borderLight}`,
              background: n.unread ? isDark ? '#0B2A1A' : '#F8FCFA' : 'transparent', cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: n.bg, color: n.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={n.icon} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{n.title}</div>
                      {n.unread && <span style={{ width: 6, height: 6, borderRadius: 999, background: '#EF4444' }} />}
                    </div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: t.textLight, marginTop: 4 }}>{n.time} oldin</div>
                  </div>
                </div>
            )}
            </div>
            <button onClick={() => {setNotifOpen(false);onNav?.('notifications');}}
          style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'center',
            background: 'transparent', border: 'none', borderTop: `1px solid ${t.borderLight}`,
            color: t.primary, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Barcha bildirishnomalarni ko'rish
            </button>
          </div>
        }
      </div>

      {/* User menu */}
      <div ref={userRef} style={{ position: 'relative' }}>
        <button onClick={(e) => {e.stopPropagation();setUserOpen((o) => !o);}}
        style={{ height: 36, padding: '2px 10px 2px 2px', borderRadius: 999, border: 'none',
          background: t.hover, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'inherit' }}>
          <Avatar initials={cu?.initials || 'AD'} size={32} color="primary" />
          <span className="hide-mobile">{typeof RolePill === 'function' && <RolePill role={role} size="sm" />}</span>
          <Icon name="chevronDown" size={12} style={{ color: t.textMuted, marginLeft: 2 }} />
        </button>
        {userOpen &&
        <div className="slide-down" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 12,
          width: 280, boxShadow: '0 12px 40px rgba(0,0,0,.16)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.borderLight}`,
            display: 'flex', gap: 10, alignItems: 'center' }}>
              <Avatar initials={cu?.initials || 'AD'} size={40} color="primary" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cu?.name || 'Admin'}
                </div>
                <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cu?.email || 'admin@bitu.uz'}
                </div>
                <div style={{ marginTop: 6 }}>
                  {typeof RolePill === 'function' && <RolePill role={role} size="sm" />}
                </div>
              </div>
            </div>
            <div style={{ padding: 4 }}>
              {[
            { icon: 'user', label: 'Mening profilim', route: 'profile' },
            { icon: 'settings', label: 'Sozlamalar', route: 'settings' },
            { icon: 'help', label: 'Yordam markazi', route: null }].
            map((it, i) =>
            <button key={i} className="hover-bg" onClick={() => {setUserOpen(false);if (it.route) onNav?.(it.route);}}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px',
              borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 13, color: t.text, fontFamily: 'inherit', textAlign: 'left' }}>
                  <Icon name={it.icon} size={15} style={{ color: t.textMuted }} />
                  <span>{it.label}</span>
                </button>
            )}
            </div>
            <div style={{ padding: 4, borderTop: `1px solid ${t.borderLight}` }}>
              <button onClick={() => {setUserOpen(false);onLogout?.();}}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px',
              borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 13, color: '#DC2626', fontFamily: 'inherit', textAlign: 'left' }}>
                <Icon name="logout" size={15} />
                <span>Rolni almashtirish</span>
              </button>
            </div>
          </div>
        }
      </div>
      {actions}
    </div>);

};

const BituPage = ({ children }) => {
  const app = typeof useApp === 'function' ? useApp() : null;
  const isDark = app?.theme === 'dark';
  const t = isDark ? THEMES.dark : THEMES.light;
  return (
    <main className="bitu-page" style={{ flex: 1, padding: '24px 28px 40px', maxWidth: 1600, width: '100%', boxSizing: 'border-box',
      background: t.bg, color: t.text, transition: 'background 200ms ease' }}>
      {children}
    </main>);

};

Object.assign(window, { BituSidebar, BituTopbar, BituPage, BITU_NAV_GROUPS });
