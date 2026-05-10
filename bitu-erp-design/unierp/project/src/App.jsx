// App.jsx — router + main shell (full routes)

const App = () => {
  const [route, setRoute] = React.useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'login';
  });
  const [loginVariant, setLoginVariant] = React.useState('split');
  const [dashVariant, setDashVariant] = React.useState('cards');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [selectedTeacher, setSelectedTeacher] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [selectedTalaba, setSelectedTalaba] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [wizardOpen, setWizardOpen] = React.useState(false);

  React.useEffect(() => { window.location.hash = route; }, [route]);
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || 'login');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === 'login') {
    return (
      <>
        <LoginPage variant={loginVariant} onEnter={() => setRoute('role-select')} onForgot={() => setRoute('forgot')} />
        <VariantSwitcher label="Login stili" value={loginVariant} onChange={setLoginVariant}
          options={[{v:'split',l:'Split'}, {v:'centered',l:'Kartochka'}]} />
        <ToastContainer />
      </>
    );
  }
  if (route === 'forgot') {
    return <><ForgotPasswordPage onBack={() => setRoute('login')} onDone={() => setRoute('login')} /><ToastContainer /></>;
  }
  if (route === 'role-select') {
    return <><RoleSelectPageNew onSelect={() => setRoute('dashboard')} onLogout={() => setRoute('login')} /><ToastContainer /></>;
  }

  const titles = {
    dashboard: { t: 'Asosiy panel', greeting: 'Xush kelibsiz, Admin!', b: ['Asosiy'] },
    crm: { t: 'CRM — Arizalar', b: ['Academic', 'CRM'] },
    'crm-kanban': { t: 'CRM Voronka', b: ['Academic', 'CRM', 'Voronka'] },
    teachers: { t: 'O\'qituvchilar', b: ['Academic', 'O\'qituvchilar'] },
    students: { t: 'Talabalar', b: ['Academic', 'Talabalar'] },
    'student-profile': { t: selectedStudent?.name?.full || 'Talaba profili', b: ['Academic', 'Talabalar', 'Profil'] },
    'teacher-profile': { t: selectedTeacher?.name?.full || 'O\'qituvchi profili', b: ['Academic', 'O\'qituvchilar', 'Profil'] },
    attendance: { t: 'Davomat', b: ['Academic', 'Davomat'] },
    grading: { t: 'Baholash', b: ['Academic', 'Baholash'] },
    schedule: { t: 'Dars jadvali', b: ['Academic', 'Dars jadvali'] },
    exams: { t: 'Imtihonlar', b: ['Academic+', 'Imtihonlar'] },
    library: { t: 'Kutubxona', b: ['Academic+', 'Kutubxona'] },
    contracts: { t: 'Kontraktlar', b: ['Finance', 'Kontraktlar'] },
    'contract-details': { t: 'Kontrakt batafsil', b: ['Finance', 'Kontraktlar', 'K-2024-1847'] },
    finance: { t: 'Moliyaviy panel', b: ['Moliya', 'Panel'] },
    'moliya-contracts': { t: 'Kontraktlar', b: ['Moliya', 'Kontraktlar'] },
    'moliya-debtors': { t: 'Qarzdorlar', b: ['Moliya', 'Qarzdorlar'] },
    'moliya-payments': { t: "To'lovlar", b: ['Moliya', "To'lovlar"] },
    'moliya-scholarship': { t: 'Stipendiya', b: ['Moliya', 'Stipendiya'] },
    'finance-report': { t: 'Moliyaviy hisobot', b: ['Moliya', 'Hisobot'] },
    'students-list': { t: 'Talabalar', b: ['Talabalar', "Ro'yxat"] },
    'students-stat': { t: 'Talabalar statistikasi', b: ['Talabalar', 'Statistika'] },
    'my-students': { t: 'Mening talabalarim', b: ['Talabalar', 'Mening talabalarim'] },
    hr: { t: 'Kadrlar paneli', b: ['Kadrlar', 'Panel'] },
    'hr-employees': { t: 'Xodimlar', b: ['Kadrlar', 'Xodimlar'] },
    'hr-departments': { t: "Bo'limlar va kafedralar", b: ['Kadrlar', "Bo'limlar"] },
    'hr-orders': { t: 'Kadrlar buyruqlari', b: ['Kadrlar', 'Buyruqlar'] },
    'hr-attendance': { t: 'Xodimlar davomati', b: ['Kadrlar', 'Davomad'] },
    'hr-leaves': { t: "Ta'tillar va safar", b: ['Kadrlar', "Ta'tillar"] },
    profile: { t: 'Shaxsiy kabinet', b: ['Profil'] },
    dormitory: { t: 'Talabalar turar joyi', b: ['Finance', 'TTJ'] },
    tasks: { t: 'Topshiriqlar', b: ['Operations', 'Topshiriqlar'] },
    reports: { t: 'Hisobotlar', b: ['Operations', 'Hisobotlar'] },
    messages: { t: 'Xabarlar', b: ['Operations', 'Xabarlar'] },
    notifications: { t: 'Bildirishnomalar', b: ['Operations', 'Bildirishnomalar'] },
    orders: { t: 'Buyruqlar', b: ['Admin', 'Buyruqlar'] },
    staffing: { t: 'Shtatlash jadvali', b: ['Xodimlar', 'Shtatlash'] },
    'crm-report': { t: 'CRM Hisobot', b: ['CRM', 'Hisobot'] },
    transport: { t: 'Transport', b: ['Infratuzilma', 'Transport'] },
    conferences: { t: 'Konferensiyalar', b: ['Ilmiy faoliyat', 'Konferensiyalar'] },
    patents: { t: 'Patentlar', b: ['Ilmiy faoliyat', 'Patentlar'] },
    news: { t: 'Yangiliklar', b: ['Boshqaruv', 'Yangiliklar'] },
    'my-schedule': { t: 'Mening jadvalim', b: ['Talaba', 'Jadval'] },
    'my-grades': { t: 'Mening baholarim', b: ['Talaba', 'Baholar'] },
    'my-payments': { t: 'Mening to\'lovlarim', b: ['Talaba', 'To\'lovlar'] },
    'my-attendance': { t: 'Mening davomatim', b: ['Talaba', 'Davomat'] },
    settings: { t: 'Sozlamalar', b: ['Admin', 'Sozlamalar'] },
    curriculum: { t: 'O\'quv rejalar', b: ['Academic', 'O\'quv rejalar'] },
    departments: { t: 'Kafedralar', b: ['Academic', 'Kafedralar'] },
    research: { t: 'Ilmiy ishlar', b: ['Academic+', 'Ilmiy ishlar'] },
    theses: { t: 'Diplom ishlari', b: ['Academic+', 'Diplom ishlari'] },
    scholarship: { t: 'Stipendiya', b: ['Finance', 'Stipendiya'] },
    dms: { t: 'Hujjat aylanishi', b: ['Admin', 'DMS'] },
    analytics: { t: 'Analytics', b: ['Admin', 'Analytics'] },
    'student-cabinet': { t: 'Talaba kabineti', b: ['Cabinets', 'Talaba'] },
    'teacher-cabinet': { t: 'O\'qituvchi kabineti', b: ['Cabinets', 'O\'qituvchi'] },
    users: { t: 'Foydalanuvchilar', b: ['Tizim', 'Foydalanuvchilar'] },
    'user-profile': { t: selectedUser?.name?.full || 'Foydalanuvchi profili', b: ['Tizim', 'Foydalanuvchilar', 'Profil'] },
    'student-detail': { t: selectedTalaba?.full_name || 'Talaba profili', b: ['Talabalar', "Ro'yxat", 'Profil'] },
    'employee-detail': { t: selectedEmployee?.full_name || 'Xodim profili', b: ['Kadrlar', 'Xodimlar', 'Profil'] },
    roles: { t: 'Rollar va ruxsatlar', b: ['Tizim', 'Rollar'] },
    permissions: { t: 'Ruxsatlar matritsasi', b: ['Tizim', 'Ruxsatlar matritsasi'] },
    audit: { t: 'Audit log', b: ['Tizim', 'Audit log'] },
  };
  const meta = titles[route] || titles.dashboard;
  const openStudent = (s) => { setSelectedStudent(s); setRoute('student-profile'); };
  const openTeacher = (t) => { setSelectedTeacher(t); setRoute('teacher-profile'); };
  const openUser = (u) => { setSelectedUser(u); setRoute('user-profile'); };
  const openTalaba = (s) => { setSelectedTalaba(s); setRoute('student-detail'); };
  const openEmployee = (e) => { setSelectedEmployee(e); setRoute('employee-detail'); };

  // map sub-routes to parent sidebar ids
  const sidebarActive = route === 'student-profile' ? 'students'
    : route === 'teacher-profile' ? 'teachers'
    : route === 'contract-details' ? 'contracts'
    : route === 'user-profile' ? 'users'
    : route === 'student-detail' ? 'students-list'
    : route === 'employee-detail' ? 'hr-employees'
    : route;

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFB',
                  fontFamily: "'Inter',system-ui,sans-serif", color: '#1E293B' }}>
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={() => setMobileOpen(false)} />
      <BituSidebar active={sidebarActive} onNav={setRoute} collapsed={sidebarCollapsed}
        onLogout={() => setRoute('login')} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <BituTopbar title={meta.t} breadcrumb={meta.b} greeting={meta.greeting}
          onNav={setRoute} onLogout={() => setRoute('login')}
          onToggleSidebar={() => {
            if (window.innerWidth < 768) { setMobileOpen(o => !o); }
            else { setSidebarCollapsed(c => !c); }
          }} />
        <BituPage>
          {route === 'dashboard' && <DashboardPage variant={dashVariant} />}
          {route === 'crm' && <CrmListPage />}
          {route === 'crm-kanban' && <CrmKanbanPage />}
          {route === 'teachers' && <TeachersListPage />}
          {route === 'students' && <StudentsListPage onOpen={openStudent} onAdd={() => setWizardOpen(true)} />}
          {route === 'student-profile' && <StudentProfilePage student={selectedStudent} onBack={() => setRoute('students')} />}
          {route === 'teacher-profile' && <TeacherProfilePage teacher={selectedTeacher} onBack={() => setRoute('teachers')} />}
          {route === 'attendance' && <AttendancePage />}
          {route === 'grading' && <GradingPage />}
          {route === 'schedule' && <SchedulePage />}
          {route === 'exams' && <ExamsPage />}
          {route === 'library' && <LibraryPage />}
          {route === 'contracts' && <ContractsPage onOpen={() => setRoute('contract-details')} />}
          {route === 'contract-details' && <ContractDetailsPage onBack={() => setRoute('contracts')} />}
          {route === 'dormitory' && <DormitoryPage />}
          {route === 'tasks' && <TasksPage />}
          {route === 'reports' && <ReportsPage />}
          {route === 'messages' && <MessagesPage />}
          {route === 'notifications' && <NotificationsPage />}
          {route === 'hr' && <HrDashboardPage />}
          {route === 'orders' && <OrdersPage />}
          {route === 'settings' && <ProfilSettingsPage />}
          {route === 'curriculum' && <CurriculumPage />}
          {route === 'departments' && <DepartmentsPage />}
          {route === 'research' && <ResearchPage />}
          {route === 'theses' && <ThesesPage />}
          {route === 'scholarship' && <ScholarshipPage />}
          {route === 'dms' && <DmsPage />}
          {route === 'analytics' && <AnalyticsPage />}
          {route === 'student-cabinet' && <StudentCabinetPage />}
          {route === 'teacher-cabinet' && <TeacherCabinetPage />}
          {route === 'users' && <UsersListPage onOpen={openUser} />}
          {route === 'user-profile' && <UserProfilePage user={selectedUser} onBack={() => setRoute('users')} />}
          {route === 'roles' && <RolesPage onOpenMatrix={() => setRoute('permissions')} />}
          {route === 'permissions' && <PermissionMatrixPage />}
          {route === 'audit' && <AuditLogPage />}
          {route === 'warehouse' && <OmborPage />}
          {route === 'payroll' && <MaoshPage />}
          {route === 'debtors' && <QarzdorlarPage />}
          {route === 'appeals' && <MurojaatlarPage />}
          {route === 'news' && <YangiliklarPage />}
          {route === 'reference' && <MalumotnomalarPage />}
          {route === 'equipment' && <JihozlarPage />}
          {route === 'subjects' && <FanlarPage />}
          {route === 'alumni' && <BitiruvchilarPage />}
          {route === 'internship' && <AmaliyotPage />}
          {route === 'budget' && <ByudjetPage />}
          {route === 'finance' && <FinancePanelPage onNav={setRoute} />}
          {route === 'moliya-contracts' && <MoliyaContractsPage />}
          {route === 'moliya-debtors' && <MoliyaDebtorsPage />}
          {route === 'moliya-payments' && <PaymentsPage />}
          {route === 'moliya-scholarship' && <MoliyaScholarshipPage />}
          {route === 'finance-report' && <FinanceReportPage />}
          {/* Talabalar (role-aware) */}
          {route === 'students-stat' && <StudentsStatPage />}
          {route === 'students-list' && <TalabalarListPage onOpenStudent={openTalaba} />}
          {route === 'my-students' && <TalabalarListPage onOpenStudent={openTalaba} />}
          {route === 'student-detail' && <TalabalarStudentProfilePage student={selectedTalaba} onBack={() => setRoute('students-list')} />}
          {/* Kadrlar */}
          {route === 'hr-employees' && <HrEmployeesPage onOpenEmployee={openEmployee} />}
          {route === 'employee-detail' && <KadrlarEmployeeProfilePage employee={selectedEmployee} onBack={() => setRoute('hr-employees')} />}
          {route === 'hr-departments' && <HrDepartmentsPage />}
          {route === 'hr-orders' && <HrOrdersPage />}
          {route === 'hr-attendance' && <HrAttendancePage />}
          {route === 'hr-leaves' && <HrLeavesPage />}
          {/* Profil (role-aware) */}
          {route === 'profile' && <ProfilePage />}
          {/* Stubs */}
          {route === 'staffing' && <StaffingPage />}
          {route === 'crm-report' && <CrmReportPage />}
          {route === 'transport' && <TransportPage />}
          {route === 'conferences' && <ConferencesPage />}
          {route === 'patents' && <PatentsPage />}
        </BituPage>
      </div>
      {route === 'dashboard' && (
        <VariantSwitcher label="Dashboard" value={dashVariant} onChange={setDashVariant}
          options={[{v:'cards',l:'KPI grid'}, {v:'narrative',l:'Hero'}]} />
      )}
      <ToastContainer />
      {wizardOpen && <StudentWizard onClose={() => setWizardOpen(false)} onDone={() => setWizardOpen(false)} />}
    </div>
  );
};

const VariantSwitcher = ({ label, value, onChange, options }) => (
  <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100,
                background: '#fff', padding: '10px 12px', borderRadius: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,.12)', border: '1px solid #E2E8F0',
                display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Inter',sans-serif" }}>
    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
      {options.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)}
          style={{ padding: '5px 10px', borderRadius: 6, border: 'none',
                   background: value === o.v ? '#fff' : 'transparent',
                   color: value === o.v ? '#0F172A' : '#64748B',
                   fontSize: 12, fontWeight: value === o.v ? 600 : 500,
                   cursor: 'pointer', fontFamily: 'inherit',
                   boxShadow: value === o.v ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>
          {o.l}
        </button>
      ))}
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider><AppProvider><FinanceProvider><StudentsProvider><HrProvider><App /></HrProvider></StudentsProvider></FinanceProvider></AppProvider></AuthProvider>
);
