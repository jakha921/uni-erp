// ProfilPages.jsx — Profile module: Shaxsiy kabinet (per role) + Sozlamalar

const fmtUZSPr = (n) => new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0));

// ============ SHAXSIY KABINET (router by role) ============
const ProfilePage = () => {
  const auth = useAuth();
  if (!auth?.currentUser) return null;

  const { role } = auth.currentUser;
  if (role === 'talaba') return <ProfilStudentCabinet />;
  if (role === 'oqituvchi') return <ProfilTeacherCabinet />;
  return <GenericProfilePage />;
};

// ============ Talaba kabineti ============
const ProfilStudentCabinet = () => {
  const auth = useAuth();
  const fin = useFinance();
  const { students } = useStudents();

  const me = students.find((s) => s.id === auth.currentUser?.studentId) || students[0];
  const myContracts = (fin?.contracts || []).filter((c) => c.studentId === me.id);
  const myPayments = (fin?.payments || []).filter((p) => p.studentId === me.id).sort((a, b) => b.date.localeCompare(a.date));
  const myDebt = myContracts.reduce((s, c) => s + (c.debtAmount || 0), 0);

  // Mock grades & attendance
  const subjects = [
    { name: "Ingliz tili amaliy kursi", credits: 6, mid1: 78, mid2: 82, final: 85, total: 82 },
    { name: "Lingvistika asoslari", credits: 4, mid1: 88, mid2: 91, final: 89, total: 89 },
    { name: "Pedagogik psixologiya", credits: 3, mid1: 72, mid2: 76, final: 80, total: 76 },
    { name: "Axborot texnologiyalari", credits: 4, mid1: 90, mid2: 92, final: 95, total: 92 },
    { name: "Falsafa", credits: 2, mid1: 70, mid2: 74, final: 72, total: 72 },
    { name: "Jismoniy tarbiya", credits: 2, mid1: 95, mid2: 98, final: 100, total: 98 },
  ];

  const avg = subjects.reduce((s, x) => s + x.total * x.credits, 0) / subjects.reduce((s, x) => s + x.credits, 0);

  const gradeColor = (n) => n >= 86 ? '#10B981' : n >= 71 ? '#3B82F6' : n >= 55 ? '#F59E0B' : '#EF4444';

  return (
    <BituPage>
      {/* Top: profile card */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        borderRadius: 16, padding: 32, color: '#fff',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{
            width: 88, height: 88, borderRadius: 44,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, border: '3px solid rgba(255,255,255,0.3)',
          }}>
            {(me.first_name?.[0] || '') + (me.second_name?.[0] || '')}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{me.full_name}</h2>
            <div style={{ marginTop: 8, opacity: 0.9, fontSize: 14 }}>
              {me.specialty?.name}
            </div>
            <div style={{ marginTop: 6, display: 'flex', gap: 16, fontSize: 13, opacity: 0.85 }}>
              <span>ID: {me.student_id_number}</span>
              <span>·</span>
              <span>{me.group?.name}</span>
              <span>·</span>
              <span>{me.level?.name}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.6 }}>O'rtacha ball</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{avg.toFixed(1)}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{avg >= 86 ? 'A\'lo' : avg >= 71 ? 'Yaxshi' : avg >= 55 ? 'Qoniqarli' : 'Qoniqarsiz'}</div>
          </div>
        </div>
      </div>

      <StatGrid>
        <StatCard label="Joriy semestr" value="II" icon="calendar" />
        <StatCard label="Olingan kreditlar" value={subjects.reduce((s, x) => s + x.credits, 0)} icon="book" />
        <StatCard label="Davomat" value="94%" icon="check" trend='+2%' trendDir="up" />
        <StatCard
          label="Qarzdorlik"
          value={myDebt > 0 ? `${fmtUZSPr(myDebt)} so'm` : 'Yo\'q'}
          icon={myDebt > 0 ? 'warning' : 'check'}
        />
      </StatGrid>

      <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 24 }}>
        {/* Grades */}
        <Card hover className="table-scroll">
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Joriy semestr baholari</h3>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ textAlign: 'left', padding: '10px 8px' }}>Fan</th>
                <th style={{ padding: '10px 8px' }}>Kredit</th>
                <th style={{ padding: '10px 8px' }}>JN1</th>
                <th style={{ padding: '10px 8px' }}>JN2</th>
                <th style={{ padding: '10px 8px' }}>YN</th>
                <th style={{ padding: '10px 8px' }}>Jami</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{s.credits}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{s.mid1}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{s.mid2}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{s.final}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', minWidth: 36, padding: '4px 8px',
                      background: gradeColor(s.total) + '15', color: gradeColor(s.total),
                      borderRadius: 6, fontWeight: 700,
                    }}>{s.total}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card hover>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>Mening kontraktim</h3>
            {myContracts.length === 0 ? (
              <div style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>Faol kontrakt yo'q</div>
            ) : myContracts.map((c) => (
              <div key={c.id} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>№{c.contractNumber}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{c.educationYear}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
                  <span style={{ color: '#475569' }}>Summa</span>
                  <span style={{ fontWeight: 600 }}>{fmtUZSPr(c.contractAmount)} so'm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13 }}>
                  <span style={{ color: '#475569' }}>To'langan</span>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>{fmtUZSPr(c.paidAmount)} so'm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13 }}>
                  <span style={{ color: '#475569' }}>Qarz</span>
                  <span style={{ color: c.debtAmount > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>{fmtUZSPr(c.debtAmount)} so'm</span>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 10, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(c.paidAmount / c.contractAmount) * 100}%`, height: '100%', background: '#10B981', borderRadius: 3 }} />
                </div>
                {c.debtAmount > 0 && (
                  <Button variant="primary" style={{ marginTop: 14, width: '100%' }} icon="money" onClick={() => window.showToast?.('To\'lov modulariga yo\'naltirilmoqda…', 'info')}>
                    To'lov qilish
                  </Button>
                )}
              </div>
            ))}
          </Card>

          <Card hover>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>So'nggi to'lovlar</h3>
            {myPayments.length === 0 ? (
              <div style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>To'lovlar yo'q</div>
            ) : myPayments.slice(0, 5).map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{fmtUZSPr(p.amount)} so'm</div>
                  <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>{p.date} · {p.method}</div>
                </div>
                <Badge variant={p.status === 'success' ? 'success' : 'warning'}>{p.status === 'success' ? 'Muvaffaqiyatli' : 'Kutmoqda'}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </BituPage>
  );
};

// ============ O'qituvchi kabineti ============
const ProfilTeacherCabinet = () => {
  const auth = useAuth();
  const { students } = useStudents();

  const teacherGroups = ['ENG-1306-25', 'ENG-1306-24', 'IIT-2105-25', 'IIT-2105-24'];
  const myStudents = students.filter((s) => teacherGroups.includes(s.group?.name));

  const todaySchedule = [
    { time: '08:30 — 09:50', subject: "Ingliz tili amaliy kursi", group: 'ENG-1306-25', room: '301', type: 'Amaliyot' },
    { time: '10:00 — 11:20', subject: "Akademik yozish", group: 'ENG-1306-24', room: '305', type: 'Ma\'ruza' },
    { time: '11:30 — 12:50', subject: "Ingliz tili amaliy kursi", group: 'IIT-2105-25', room: '208', type: 'Amaliyot' },
    { time: '14:00 — 15:20', subject: "Tarjima nazariyasi", group: 'IIT-2105-24', room: '402', type: 'Ma\'ruza' },
  ];

  return (
    <BituPage>
      <div style={{
        background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
        borderRadius: 16, padding: 32, color: '#fff', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{
            width: 88, height: 88, borderRadius: 44, background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, border: '3px solid rgba(255,255,255,0.3)',
          }}>{auth.currentUser?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('')}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{auth.currentUser?.name}</h2>
            <div style={{ marginTop: 8, opacity: 0.9, fontSize: 14 }}>O'qituvchi · Ingliz tili kafedrasi</div>
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>Filologiya fakulteti · 2024-2025 o'quv yili</div>
          </div>
        </div>
      </div>

      <StatGrid>
        <StatCard label="Mening guruhlarim" value={teacherGroups.length} icon="users" />
        <StatCard label="Talabalarim" value={myStudents.length} icon="graduation" />
        <StatCard label="Bugungi darslar" value={todaySchedule.length} icon="calendar" />
        <StatCard label="Haftalik soat" value="22" icon="clock" />
      </StatGrid>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <Card hover>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Bugungi dars jadvali</h3>
          {todaySchedule.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ minWidth: 90, fontWeight: 600, fontSize: 13, color: '#4F46E5' }}>{d.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.subject}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                  {d.group} · {d.room}-xona · {d.type}
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card hover>
          <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>Mening guruhlarim</h3>
          {teacherGroups.map((g) => {
            const cnt = myStudents.filter((s) => s.group?.name === g).length;
            return (
              <div key={g} onClick={() => { window.location.hash = '#students-list'; }} style={{
                padding: 14, marginBottom: 8, background: '#F8FAFC', borderRadius: 8,
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{g}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Ingliz tili amaliy kursi</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Badge variant="info">{cnt} talaba</Badge>
                  <Icon name="chevron-right" size={16} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </BituPage>
  );
};

// ============ Generic kabinet (admin/buxgalter/dekan) ============
const GenericProfilePage = () => {
  const auth = useAuth();
  const u = auth.currentUser;
  const fin = typeof useFinance === 'function' ? useFinance() : null;
  const { students } = typeof useStudents === 'function' ? useStudents() : { students: [] };
  const hr = typeof useHr === 'function' ? useHr() : null;

  const roleColors = {
    admin: { bg: 'linear-gradient(135deg, #DC2626, #991B1B)', label: 'Administrator' },
    buxgalter: { bg: 'linear-gradient(135deg, #059669, #047857)', label: 'Bosh buxgalter' },
    dekan: { bg: 'linear-gradient(135deg, #2563EB, #1E40AF)', label: 'Fakultet dekani' },
  };
  const r = roleColors[u?.role] || roleColors.admin;

  const totalStudents = students.length;
  const totalEmployees = hr?.employees?.length || 0;
  const totalContracts = fin?.contracts?.length || 0;
  const totalRevenue = (fin?.contracts || []).reduce((s, c) => s + (c.paidAmount || 0), 0);
  const totalDebt = (fin?.contracts || []).reduce((s, c) => s + (c.debtAmount || 0), 0);
  const debtorCount = (fin?.contracts || []).filter((c) => (c.debtAmount || 0) > 0).length;
  const recentPayments = (fin?.payments || []).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const myFacultyStudents = u?.facultyId ? students.filter((s) => s.department?.id === u.facultyId) : students;
  const myFacultyEmployees = u?.facultyId && hr ? hr.employees.filter((e) => e.department?.id === u.facultyId) : (hr?.employees || []);

  return (
    <BituPage>
      <div style={{ background: r.bg, borderRadius: 16, padding: 32, color: '#fff', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{
            width: 88, height: 88, borderRadius: 44, background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, border: '3px solid rgba(255,255,255,0.3)',
          }}>{u?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('')}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{u?.name}</h2>
            <div style={{ marginTop: 8, opacity: 0.9, fontSize: 14 }}>{r.label}</div>
            {u?.facultyName && (
              <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>{u.facultyName}</div>
            )}
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>{u?.email}</div>
          </div>
        </div>
      </div>

      {u?.role === 'admin' && (
        <StatGrid>
          <StatCard label="Talabalar" value={totalStudents} icon="users" iconBg="#2DB976" />
          <StatCard label="Xodimlar" value={totalEmployees} icon="briefcase" iconBg="#3B82F6" />
          <StatCard label="Kontraktlar" value={totalContracts} icon="doc" iconBg="#F59E0B" />
          <StatCard label="Tushumlar" value={`${fmtUZSPr(totalRevenue)} so'm`} icon="wallet" iconBg="#10B981" />
        </StatGrid>
      )}
      {u?.role === 'buxgalter' && (
        <StatGrid>
          <StatCard label="Tushumlar" value={`${fmtUZSPr(totalRevenue)} so'm`} icon="wallet" iconBg="#10B981" />
          <StatCard label="Qarzdorlar" value={debtorCount} icon="warning" iconBg="#EF4444" />
          <StatCard label="Jami qarz" value={`${fmtUZSPr(totalDebt)} so'm`} icon="money" iconBg="#F59E0B" />
          <StatCard label="Kontraktlar" value={totalContracts} icon="doc" iconBg="#3B82F6" />
        </StatGrid>
      )}
      {u?.role === 'dekan' && (
        <StatGrid>
          <StatCard label="Fakultet talabalari" value={myFacultyStudents.length} icon="users" iconBg="#7C3AED" />
          <StatCard label="Fakultet xodimlari" value={myFacultyEmployees.length} icon="briefcase" iconBg="#3B82F6" />
          <StatCard label="Buyruqlar" value={hr?.orders?.length || 0} icon="doc" iconBg="#F59E0B" />
          <StatCard label="Ta'tillar" value={hr?.leaves?.length || 0} icon="calendar" iconBg="#10B981" />
        </StatGrid>
      )}

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <Card hover>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Shaxsiy ma'lumotlar</h3>
          <DetailRowPr label="F.I.SH" value={u?.name} />
          <DetailRowPr label="Lavozim" value={r.label} />
          {u?.facultyName && <DetailRowPr label="Fakultet" value={u.facultyName} />}
          <DetailRowPr label="Email" value={u?.email} />
          <DetailRowPr label="Telefon" value={u?.phone || '+998 (90) 123-45-67'} />
          <DetailRowPr label="Tug'ilgan sana" value="1980-05-12" />
          <DetailRowPr label="Pasport" value="AB 1234567" />
          <Button variant="ghost" icon="edit" style={{ marginTop: 14 }}>Ma'lumotlarni tahrirlash</Button>
        </Card>

        {(u?.role === 'buxgalter' || u?.role === 'admin') && recentPayments.length > 0 ? (
          <Card hover>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>So'nggi to'lovlar</h3>
            {recentPayments.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{fmtUZSPr(p.amount)} so'm</div>
                  <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>{p.date} · {p.method}</div>
                </div>
                <Badge variant="success">Muvaffaqiyatli</Badge>
              </div>
            ))}
          </Card>
        ) : (
          <Card hover>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Tizim ma'lumotlari</h3>
            <DetailRowPr label="Foydalanuvchi ID" value={`USR-${1000 + (u?.id || 0)}`} />
            <DetailRowPr label="Oxirgi kirish" value="2026-05-03 09:14:32" />
            <DetailRowPr label="IP-manzil" value="192.168.1.45" />
            <DetailRowPr label="Brauzer" value="Chrome 124 · Windows 11" />
            <DetailRowPr label="Hisobot davri" value="2025-2026 o'quv yili" />
            <Button variant="ghost" icon="lock" style={{ marginTop: 14 }}>Parolni o'zgartirish</Button>
          </Card>
        )}
      </div>
    </BituPage>
  );
};

const DetailRowPr = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
    <span style={{ color: '#64748B' }}>{label}</span>
    <span style={{ color: '#0F172A', fontWeight: 500, textAlign: 'right' }}>{value || '—'}</span>
  </div>
);

// ============ SOZLAMALAR ============
const ProfilSettingsPage = () => {
  const auth = useAuth();
  const [activeTab, setActiveTab] = React.useState('account');

  const tabs = [
    { id: 'account', label: 'Hisob qaydnomasi' },
    { id: 'security', label: 'Xavfsizlik' },
    { id: 'notifications', label: 'Bildirishnomalar' },
    { id: 'appearance', label: 'Ko\'rinish' },
  ];

  return (
    <BituPage>
      <PageHeader title="Sozlamalar" subtitle="Hisob qaydnomasi va tizim parametrlarini sozlash" />

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'account' && (
        <Card>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Hisob qaydnomasi</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700 }}>
            <Input label="F.I.SH" defaultValue={auth.currentUser?.name} />
            <Input label="Email" defaultValue={auth.currentUser?.email} type="email" />
            <Input label="Telefon" defaultValue="+998 (90) 123-45-67" />
            <Input label="Lavozim" defaultValue={auth.currentUser?.role} disabled />
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
            <Button variant="primary" icon="check">Saqlash</Button>
            <Button variant="ghost">Bekor qilish</Button>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Parolni o'zgartirish</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, maxWidth: 480 }}>
            <Input label="Joriy parol" type="password" />
            <Input label="Yangi parol" type="password" />
            <Input label="Yangi parolni tasdiqlang" type="password" />
          </div>
          <div style={{ marginTop: 16, padding: 14, background: '#F8FAFC', borderRadius: 8, fontSize: 13, color: '#475569' }}>
            <strong>Parol talablari:</strong> kamida 8 ta belgi, kamida 1 ta katta harf, 1 ta raqam.
          </div>
          <div style={{ marginTop: 20 }}>
            <Button variant="primary" icon="lock">Parolni yangilash</Button>
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>Faol seanslar</h4>
            <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Chrome 124 · Windows 11</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>192.168.1.45 · Hozir faol</div>
                </div>
                <Badge variant="success" dot>Joriy seans</Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Bildirishnoma sozlamalari</h3>
          {[
            { id: 'email_payments', label: 'To\'lovlar haqida email', defaultChecked: true },
            { id: 'email_orders', label: 'Yangi buyruqlar haqida email', defaultChecked: true },
            { id: 'email_news', label: 'Universitet yangiliklari', defaultChecked: false },
            { id: 'sys_browser', label: 'Brauzer push-bildirishnomalar', defaultChecked: true },
            { id: 'sys_sound', label: 'Tovushli ogohlantirish', defaultChecked: false },
          ].map((s) => (
            <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={s.defaultChecked} style={{ width: 18, height: 18 }} />
              <span style={{ flex: 1, fontSize: 14 }}>{s.label}</span>
            </label>
          ))}
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Tashqi ko'rinish</h3>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Mavzu</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { id: 'light', label: 'Yorug\'', bg: '#fff', border: '#E2E8F0' },
                { id: 'dark', label: 'Tungi', bg: '#0F172A', border: '#334155' },
                { id: 'auto', label: 'Avto (tizim)', bg: 'linear-gradient(135deg, #fff 50%, #0F172A 50%)', border: '#94A3B8' },
              ].map((t) => (
                <div key={t.id} style={{
                  padding: 14, border: '2px solid ' + (t.id === 'light' ? '#4F46E5' : t.border),
                  borderRadius: 10, cursor: 'pointer', minWidth: 120, textAlign: 'center',
                }}>
                  <div style={{ width: 60, height: 40, background: t.bg, borderRadius: 6, margin: '0 auto 8px', border: '1px solid #E2E8F0' }} />
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Til</div>
            <Select value="uz" onChange={() => {}} options={[
              { value: 'uz', label: "O'zbekcha (lotin)" },
              { value: 'cyr', label: "Ўзбекча (кирилл)" },
              { value: 'ru', label: 'Русский' },
              { value: 'en', label: 'English' },
            ]} />
          </div>
        </Card>
      )}
    </BituPage>
  );
};

Object.assign(window, {
  ProfilePage, ProfilStudentCabinet, ProfilTeacherCabinet, GenericProfilePage, ProfilSettingsPage,
});
