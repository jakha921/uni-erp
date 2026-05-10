// AppState.jsx — global store, i18n, theme, CRUD primitives

// ========= THEME =========
const THEMES = {
  light: {
    bg: '#F8FAFB', card: '#fff', border: '#E2E8F0', borderLight: '#F1F5F9',
    text: '#0F172A', textMuted: '#64748B', textLight: '#94A3B8',
    primary: '#2DB976', primaryDark: '#1B7A4E', primaryBg: '#ECFDF5',
    hover: '#F1F5F9', inputBg: '#F8FAFB',
  },
  dark: {
    bg: '#0B1220', card: '#111827', border: '#1F2937', borderLight: '#1F2937',
    text: '#F1F5F9', textMuted: '#94A3B8', textLight: '#64748B',
    primary: '#34D399', primaryDark: '#10B981', primaryBg: '#064E3B',
    hover: '#1F2937', inputBg: '#0F172A',
  },
};

// ========= I18N =========
const I18N = {
  uz: {
    dashboard: 'Asosiy', crm: 'CRM — Arizalar', crmKanban: 'CRM Voronka',
    teachers: "O'qituvchilar", students: 'Talabalar', attendance: 'Davomat',
    grading: 'Baholash', schedule: 'Dars jadvali', exams: 'Imtihonlar',
    library: 'Kutubxona', contracts: 'Kontraktlar', dormitory: 'TTJ',
    tasks: 'Topshiriqlar', reports: 'Hisobotlar', messages: 'Xabarlar',
    notifications: 'Bildirishnomalar', hr: 'HR', orders: 'Buyruqlar',
    settings: 'Sozlamalar', curriculum: "O'quv rejalar", subjects: 'Fanlar / Silabus',
    departments: 'Kafedralar', research: 'Ilmiy ishlar', theses: 'Diplom ishlari',
    scholarship: 'Stipendiya', dms: 'Hujjat aylanishi', analytics: 'Analytics',
    search: "Qidirish...", new: 'Yangi', edit: 'Tahrirlash', delete: "O'chirish",
    view: "Ko'rish", save: 'Saqlash', cancel: 'Bekor qilish', confirm: 'Tasdiqlash',
    selected: 'ta tanlandi', export: 'Eksport', filter: 'Filtr',
    logout: 'Chiqish', profile: 'Profil', myAccount: 'Mening hisobim',
    welcome: 'Xush kelibsiz',
    academic: 'Academic', academicPlus: 'Academic+', finance: 'Finance',
    operations: 'Operations', admin: 'Admin', cabinets: 'Kabinetlar',
    studentCabinet: 'Talaba kabineti', teacherCabinet: "O'qituvchi kabineti",
  },
  ru: {
    dashboard: 'Главная', crm: 'CRM — Заявки', crmKanban: 'CRM Воронка',
    teachers: 'Преподаватели', students: 'Студенты', attendance: 'Посещаемость',
    grading: 'Оценки', schedule: 'Расписание', exams: 'Экзамены',
    library: 'Библиотека', contracts: 'Контракты', dormitory: 'Общежитие',
    tasks: 'Задачи', reports: 'Отчёты', messages: 'Сообщения',
    notifications: 'Уведомления', hr: 'HR', orders: 'Приказы',
    settings: 'Настройки', curriculum: 'Учебные планы', subjects: 'Предметы',
    departments: 'Кафедры', research: 'Научная работа', theses: 'Дипломы',
    scholarship: 'Стипендия', dms: 'Документооборот', analytics: 'Аналитика',
    search: 'Поиск...', new: 'Новый', edit: 'Изменить', delete: 'Удалить',
    view: 'Просмотр', save: 'Сохранить', cancel: 'Отмена', confirm: 'Подтвердить',
    selected: 'выбрано', export: 'Экспорт', filter: 'Фильтр',
    logout: 'Выход', profile: 'Профиль', myAccount: 'Мой аккаунт',
    welcome: 'Добро пожаловать',
    academic: 'Учебная часть', academicPlus: 'Academic+', finance: 'Финансы',
    operations: 'Операции', admin: 'Админ', cabinets: 'Кабинеты',
    studentCabinet: 'Кабинет студента', teacherCabinet: 'Кабинет преподавателя',
  },
  en: {
    dashboard: 'Dashboard', crm: 'CRM — Applications', crmKanban: 'CRM Funnel',
    teachers: 'Teachers', students: 'Students', attendance: 'Attendance',
    grading: 'Grading', schedule: 'Schedule', exams: 'Exams',
    library: 'Library', contracts: 'Contracts', dormitory: 'Dormitory',
    tasks: 'Tasks', reports: 'Reports', messages: 'Messages',
    notifications: 'Notifications', hr: 'HR', orders: 'Orders',
    settings: 'Settings', curriculum: 'Curricula', subjects: 'Subjects',
    departments: 'Departments', research: 'Research', theses: 'Theses',
    scholarship: 'Scholarship', dms: 'Document flow', analytics: 'Analytics',
    search: 'Search...', new: 'New', edit: 'Edit', delete: 'Delete',
    view: 'View', save: 'Save', cancel: 'Cancel', confirm: 'Confirm',
    selected: 'selected', export: 'Export', filter: 'Filter',
    logout: 'Logout', profile: 'Profile', myAccount: 'My account',
    welcome: 'Welcome',
    academic: 'Academic', academicPlus: 'Academic+', finance: 'Finance',
    operations: 'Operations', admin: 'Admin', cabinets: 'Cabinets',
    studentCabinet: 'Student cabinet', teacherCabinet: 'Teacher cabinet',
  },
};

const AppContext = React.createContext(null);

const useApp = () => React.useContext(AppContext);
const useT = () => {
  const { lang } = useApp();
  return I18N[lang] || I18N.uz;
};
const useTheme = () => {
  const { theme } = useApp();
  return THEMES[theme] || THEMES.light;
};

const AppProvider = ({ children }) => {
  const [lang, setLang] = React.useState('uz');
  const [theme, setTheme] = React.useState('light');
  const [role, setRole] = React.useState('admin'); // admin | teacher | student | parent
  // in-memory CRUD data (not persisted)
  const [dataVersion, setDataVersion] = React.useState(0);
  const bump = () => setDataVersion(v => v + 1);

  React.useEffect(() => {
    document.body.style.background = THEMES[theme].bg;
    document.body.style.color = THEMES[theme].text;
  }, [theme]);

  const value = { lang, setLang, theme, setTheme, role, setRole, dataVersion, bump };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ========= DROPDOWN MENU =========
const DropdownMenu = ({ trigger, items, align = 'right' }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    setTimeout(() => document.addEventListener('click', close), 0);
    return () => document.removeEventListener('click', close);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <span onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>{trigger}</span>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', [align]: 0, zIndex: 50,
          background: '#fff', borderRadius: 10, minWidth: 180,
          boxShadow: '0 10px 25px rgba(0,0,0,.12)', border: '1px solid #E2E8F0',
          padding: 6, animation: 'fadeIn 120ms ease',
        }}>
          {items.map((it, i) => it.divider ? (
            <div key={i} style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />
          ) : (
            <button key={i} onClick={(e) => { e.stopPropagation(); setOpen(false); it.onClick?.(); }}
              disabled={it.disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '8px 12px', border: 'none', borderRadius: 6,
                background: 'transparent', cursor: it.disabled ? 'not-allowed' : 'pointer',
                fontSize: 13, fontFamily: 'inherit', textAlign: 'left',
                color: it.danger ? '#B91C1C' : it.disabled ? '#CBD5E1' : '#0F172A',
              }}
              onMouseEnter={(e) => !it.disabled && (e.currentTarget.style.background = it.danger ? '#FEF2F2' : '#F1F5F9')}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              {it.icon && <Icon name={it.icon} size={14} />}
              <span>{it.label}</span>
              {it.shortcut && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94A3B8' }}>{it.shortcut}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ========= BULK ACTIONS BAR =========
const BulkActionsBar = ({ count, onClear, actions }) => {
  if (count === 0) return null;
  return (
    <div style={{
      position: 'sticky', top: 70, zIndex: 30,
      background: '#0F172A', color: '#fff', borderRadius: 12, padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14,
      boxShadow: '0 10px 25px rgba(15,23,42,.25)',
      animation: 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#2DB976', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>ta tanlandi</div>
      </div>
      <div style={{ width: 1, height: 18, background: '#334155' }} />
      <div style={{ display: 'flex', gap: 6 }}>
        {actions.map((a, i) => (
          <button key={i} onClick={a.onClick} style={{
            background: a.danger ? '#DC2626' : 'rgba(255,255,255,.1)', color: '#fff',
            border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12.5, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {a.icon && <Icon name={a.icon} size={13} />} {a.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={onClear} style={{ background: 'transparent', color: '#CBD5E1', border: 'none', cursor: 'pointer', fontSize: 12.5, fontFamily: 'inherit' }}>Bekor qilish</button>
    </div>
  );
};

// ========= CONFIRM DIALOG =========
const ConfirmDialog = ({ open, title, message, confirmLabel = "O'chirish", onConfirm, onCancel, danger = true }) => (
  <Modal open={open} onClose={onCancel} title={title} width={440}
    footer={<>
      <Button variant="secondary" onClick={onCancel}>Bekor qilish</Button>
      <button onClick={() => { onConfirm?.(); onCancel?.(); }} style={{
        background: danger ? '#DC2626' : '#2DB976', color: '#fff', border: 'none',
        padding: '9px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <Icon name={danger ? 'x' : 'check'} size={14} stroke={3} /> {confirmLabel}
      </button>
    </>}>
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 999, background: danger ? '#FEF2F2' : '#ECFDF5', color: danger ? '#B91C1C' : '#1B7A4E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={danger ? 'x' : 'check'} size={20} stroke={3} />
      </div>
      <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.55 }}>{message}</div>
    </div>
  </Modal>
);

Object.assign(window, { AppContext, AppProvider, useApp, useT, useTheme, THEMES, I18N,
  DropdownMenu, BulkActionsBar, ConfirmDialog });
