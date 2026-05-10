// TalabalarPages.jsx — Students module: Statistika, Ro'yxat, Mening talabalarim

const fmtUZSStu = (n) => new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0));

// ============ TALABALAR STATISTIKASI (admin, dekan) ============
const StudentsStatPage = () => {
  const auth = useAuth();
  const { students } = useStudents();
  const FAC = window.FACULTIES || [];

  // Dekan sees only own faculty
  const visible = React.useMemo(() => {
    if (auth.user?.role === 'dekan') {
      return students.filter((s) => s.department?.id === auth.user.facultyId);
    }
    return students;
  }, [students, auth.user]);

  const total = visible.length;
  const active = visible.filter((s) => s.studentStatus?.code === '11').length;
  const academic = visible.filter((s) => s.studentStatus?.code === '12').length;
  const expelled = visible.filter((s) => s.studentStatus?.code === '13').length;

  const byGender = visible.reduce((acc, s) => {
    const k = s.gender?.name || '—';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const byForm = visible.reduce((acc, s) => {
    const k = s.educationForm?.name || '—';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const byPayment = visible.reduce((acc, s) => {
    const k = s.paymentForm?.name || '—';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const byCourse = visible.reduce((acc, s) => {
    const k = s.level?.name || '—';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const byFaculty = visible.reduce((acc, s) => {
    const k = s.department?.name || '—';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const max = (obj) => Math.max(...Object.values(obj), 1);

  const Bar = ({ label, value, max: m, color = '#4F46E5' }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: '#475569' }}>{label}</span>
        <span style={{ fontWeight: 600, color: '#0F172A' }}>{value}</span>
      </div>
      <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${(value / m) * 100}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  );

  return (
    <BituPage>
      <PageHeader
        title="Talabalar statistikasi"
        subtitle={auth.user?.role === 'dekan' ? `${auth.user.facultyName}` : 'Universitet bo\'yicha umumiy ma\'lumot'}
      />

      <StatGrid>
        <StatCard label="Jami talabalar" value={total} icon="users" trend='+24' trendDir="up" />
        <StatCard label="Faol o'qiyotgan" value={active} icon="check" trend={`${Math.round(active / total * 100)}%`} trendDir="up" />
        <StatCard label="Akademik ta'tilda" value={academic} icon="warning" />
        <StatCard label="Chetlatilgan" value={expelled} icon="x" />
      </StatGrid>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <Card hover>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Kurslar bo'yicha</h3>
          {Object.entries(byCourse).sort().map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={max(byCourse)} color="#4F46E5" />
          ))}
        </Card>

        <Card hover>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Jinsi bo'yicha</h3>
          {Object.entries(byGender).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={max(byGender)} color={k === 'Ayol' ? '#EC4899' : '#0EA5E9'} />
          ))}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600 }}>Ta'lim shakli</h4>
            {Object.entries(byForm).map(([k, v]) => (
              <Bar key={k} label={k} value={v} max={max(byForm)} color="#10B981" />
            ))}
          </div>
        </Card>

        <Card hover>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>To'lov shakli</h3>
          {Object.entries(byPayment).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={max(byPayment)} color={k.includes('grant') || k.includes('Davlat') ? '#2DB976' : '#F59E0B'} />
          ))}
        </Card>

        {auth.user?.role !== 'dekan' && (
          <Card hover>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Fakultetlar bo'yicha</h3>
            {Object.entries(byFaculty).slice(0, 8).map(([k, v]) => (
              <Bar key={k} label={k.length > 36 ? k.slice(0, 36) + '…' : k} value={v} max={max(byFaculty)} color="#8B5CF6" />
            ))}
          </Card>
        )}
      </div>
    </BituPage>
  );
};

// ============ TALABALAR RO'YXATI (admin, dekan, oqituvchi) ============
const TalabalarListPage = ({ onOpenStudent }) => {
  const auth = useAuth();
  const { students, loading } = useStudents();
  const [search, setSearch] = React.useState('');
  const [facultyFilter, setFacultyFilter] = React.useState('all');
  const [courseFilter, setCourseFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [paymentFilter, setPaymentFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 25;

  const FAC = window.FACULTIES || [];
  const role = auth.user?.role;

  // Role-based filter
  const baseList = React.useMemo(() => {
    if (role === 'dekan') {
      return students.filter((s) => s.department?.id === auth.user.facultyId);
    }
    if (role === 'oqituvchi') {
      // teacher sees students from their assigned groups (simulated: 4 groups)
      const teacherGroups = ['ENG-1306-25', 'ENG-1306-24', 'IIT-2105-25', 'IIT-2105-24'];
      return students.filter((s) => teacherGroups.includes(s.group?.name));
    }
    return students;
  }, [students, role, auth.user]);

  const filtered = React.useMemo(() => {
    return baseList.filter((s) => {
      if (search && !s.full_name.toLowerCase().includes(search.toLowerCase())
        && !s.student_id_number.includes(search)
        && !(s.group?.name || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (facultyFilter !== 'all' && s.department?.id !== Number(facultyFilter)) return false;
      if (courseFilter !== 'all' && s.level?.code !== courseFilter) return false;
      if (statusFilter !== 'all' && s.studentStatus?.code !== statusFilter) return false;
      if (paymentFilter !== 'all' && s.paymentForm?.code !== paymentFilter) return false;
      return true;
    });
  }, [baseList, search, facultyFilter, courseFilter, statusFilter, paymentFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  React.useEffect(() => { setPage(1); }, [search, facultyFilter, courseFilter, statusFilter, paymentFilter]);

  const cols = [
    { key: 'idx', label: '№', width: 50, render: (_, __, i) => (page - 1) * PER_PAGE + i + 1 },
    {
      key: 'name', label: 'F.I.SH',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0F172A' }}>{r.full_name}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{r.student_id_number}</div>
        </div>
      )
    },
    { key: 'group', label: 'Guruh', render: (r) => r.group?.name || '—' },
    { key: 'course', label: 'Kurs', render: (r) => r.level?.name || '—' },
    {
      key: 'faculty', label: 'Fakultet',
      render: (r) => <span style={{ fontSize: 13 }}>{(r.department?.name || '—').slice(0, 26)}{(r.department?.name || '').length > 26 ? '…' : ''}</span>
    },
    {
      key: 'payment', label: "To'lov",
      render: (r) => (
        <Badge variant={r.paymentForm?.code === '11' ? 'success' : 'warning'}>
          {r.paymentForm?.code === '11' ? 'Grant' : 'Kontrakt'}
        </Badge>
      )
    },
    { key: 'status', label: 'Holat', render: (r) => <StudentStatusBadge status={r.studentStatus} /> },
    {
      key: 'actions', label: '', width: 60,
      render: (r) => (
        <Button variant="ghost" size="sm" icon="eye" onClick={(e) => { e.stopPropagation(); onOpenStudent?.(r); }}>Ko'rish</Button>
      )
    },
  ];

  return (
    <BituPage>
      <PageHeader
        title={role === 'oqituvchi' ? 'Mening talabalarim' : "Talabalar ro'yxati"}
        subtitle={`Jami: ${filtered.length} ta`}
        actions={null}
      />

      <Card padding={16}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 280px', minWidth: 240 }}>
            <Input placeholder="F.I.SH, ID raqam yoki guruh bo'yicha qidirish…" value={search} onChange={setSearch} icon="search" />
          </div>
          {role !== 'dekan' && (
            <Select
              label="Fakultet"
              value={facultyFilter}
              onChange={setFacultyFilter}
              options={[{ value: 'all', label: 'Hammasi' }, ...FAC.map((f) => ({ value: String(f.id), label: f.name.slice(0, 30) }))]}
            />
          )}
          <Select
            label="Kurs"
            value={courseFilter}
            onChange={setCourseFilter}
            options={[
              { value: 'all', label: 'Hammasi' },
              { value: '11', label: '1-kurs' }, { value: '12', label: '2-kurs' },
              { value: '13', label: '3-kurs' }, { value: '14', label: '4-kurs' },
            ]}
          />
          <Select
            label="Holat"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: 'all', label: 'Hammasi' }, ...STUDENT_STATUSES.map((s) => ({ value: s.code, label: s.name }))]}
          />
          <Select
            label="To'lov"
            value={paymentFilter}
            onChange={setPaymentFilter}
            options={[
              { value: 'all', label: 'Hammasi' },
              { value: '11', label: 'Grant' }, { value: '12', label: 'Kontrakt' }
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={cols}
          rows={pageData}
          loading={loading}
          empty={filtered.length === 0 && !loading ? { icon: 'search', title: 'Talabalar topilmadi', message: 'Qidiruv yoki filtrlarni o\'zgartiring' } : null}
          selectable={false}
          onRowClick={(r) => onOpenStudent?.(r)}
        />
        <Pagination page={page} total={pages} onChange={setPage} pageSize={PER_PAGE} totalRows={filtered.length} />
      </div>

    </BituPage>
  );
};

// ============ STUDENT PROFILE PAGE (full-page detail) ============
const _heroBtnStu = {
  padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.3)',
  background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(4px)',
  color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
};

const DetailRowStu = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
    <span style={{ color: '#64748B' }}>{label}</span>
    <span style={{ color: '#0F172A', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
  </div>
);

const TalabalarStudentProfilePage = ({ student, onBack }) => {
  const s = student;
  const [tab, setTab] = React.useState('main');
  const fin = useFinance();
  const contracts = (fin?.contracts || []).filter((c) => c.studentId === s?.id);

  if (!s) return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Talaba tanlanmagan</div>;

  const initials = (s.first_name?.[0] || '') + (s.second_name?.[0] || '');

  const SUBJECTS_MOCK = ['Algoritmlar', 'Ma\'lumotlar bazasi', 'Veb-dasturlash', 'Diskret matematika', 'Iqtisodiyot nazariyasi', 'Ingliz tili'];
  const TEACHERS_MOCK = ['Karimov U.B.', 'Nazarova M.', 'Xolmatov A.', 'Tursunova F.', 'Yusupov J.', 'Hasanova D.'];
  const gradesMock = SUBJECTS_MOCK.map((sub, i) => {
    const jn1 = 60 + Math.floor(seed(i * 7) * 35);
    const jn2 = 60 + Math.floor(seed(i * 11) * 35);
    const yn = 55 + Math.floor(seed(i * 13) * 40);
    const jami = Math.round(jn1 * 0.2 + jn2 * 0.2 + yn * 0.6);
    return { sub, teacher: TEACHERS_MOCK[i], jn1, jn2, yn, jami };
  });

  const DOCS_MOCK = [
    { name: 'Ariza', date: '01.09.2024', icon: 'doc' },
    { name: 'Pasport nusxasi', date: '01.09.2024', icon: 'doc' },
    { name: 'Diplom (attestat)', date: '05.09.2024', icon: 'doc' },
    { name: 'Tibbiy ma\'lumotnoma', date: '10.09.2024', icon: 'doc' },
    { name: 'Foto 3x4', date: '01.09.2024', icon: 'doc' },
    { name: 'Shartnoma', date: '15.09.2024', icon: 'doc' },
  ];

  const tabs = [
    { v: 'main', l: 'Asosiy ma\'lumotlar', icon: 'user' },
    { v: 'grades', l: 'O\'zlashtirish', icon: 'chart', n: SUBJECTS_MOCK.length },
    { v: 'contracts', l: 'Kontrakt', icon: 'wallet', n: contracts.length },
    { v: 'docs', l: 'Hujjatlar', icon: 'doc', n: DOCS_MOCK.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6,
                 background: 'transparent', border: 'none', color: '#64748B', fontSize: 13,
                 cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        <Icon name="arrowLeft" size={14} /> Talabalar ro'yxati
      </button>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ height: 90, background: 'linear-gradient(135deg, #2DB976 0%, #1B7A4E 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, right: 18, display: 'flex', gap: 8 }}>
            <button style={_heroBtnStu}><Icon name="edit" size={13} /> Tahrirlash</button>
            <button style={_heroBtnStu}><Icon name="doc" size={13} /> Ma'lumotnoma</button>
          </div>
        </div>
        <div style={{ padding: '0 32px 24px', marginTop: -36, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 92, height: 92, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 32, fontWeight: 700, border: '4px solid #fff',
                          boxShadow: '0 4px 14px rgba(0,0,0,.1)' }}>
              {initials}
            </div>
            <div style={{ flex: 1, marginBottom: 6, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>{s.full_name}</h2>
                <StudentStatusBadge status={s.studentStatus} />
                <Badge variant={s.paymentForm?.code === '11' ? 'success' : 'warning'}>
                  {s.paymentForm?.code === '11' ? 'Grant' : 'Kontrakt'}
                </Badge>
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#64748B', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{s.student_id_number}</span>
                <span>·</span>
                <span>{s.department?.name}</span>
                <span>·</span>
                <span>{s.group?.name}</span>
              </div>
            </div>
          </div>

          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 22 }}>
            {[
              { l: 'Fakultet', v: s.department?.name?.split(' ').slice(0, 3).join(' ') || '—' },
              { l: 'Guruh', v: s.group?.name || '—' },
              { l: 'Kurs', v: s.level?.name || '—' },
              { l: 'O\'rtacha baho', v: s.avgGrade ? `${s.avgGrade} ball` : '—' },
            ].map((st, i) => (
              <div key={i} style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{st.l}</div>
                <div style={{ fontSize: 13.5, color: '#0F172A', marginTop: 4, fontWeight: 500 }}>{st.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ borderBottom: '1px solid #F1F5F9', padding: '0 8px', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.v} onClick={() => setTab(t.v)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 18px',
                       background: 'transparent', border: 'none', cursor: 'pointer',
                       borderBottom: `2px solid ${tab === t.v ? '#2DB976' : 'transparent'}`,
                       marginBottom: -1, fontSize: 13.5, fontFamily: 'inherit',
                       color: tab === t.v ? '#0F172A' : '#64748B',
                       fontWeight: tab === t.v ? 600 : 500, whiteSpace: 'nowrap' }}>
              <Icon name={t.icon} size={15} /> {t.l}
              {t.n != null && (
                <span style={{ padding: '1px 8px', borderRadius: 99, background: tab === t.v ? '#D1FAE5' : '#F1F5F9',
                               color: tab === t.v ? '#047857' : '#64748B', fontSize: 11, fontWeight: 600 }}>{t.n}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {tab === 'main' && (
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Shaxsiy ma'lumotlar
                </h4>
                <DetailRowStu label="F.I.Sh." value={s.full_name} />
                <DetailRowStu label="Jinsi" value={s.gender?.name} />
                <DetailRowStu label="Tug'ilgan sana" value={s.birth_date} />
                <DetailRowStu label="Pasport" value={s.passport} />
                <DetailRowStu label="JSHSHIR" value={s.pinfl} />
                <DetailRowStu label="Telefon" value={s.phone} />
                <DetailRowStu label="Email" value={s.email} />
                <DetailRowStu label="Manzil" value={s.address} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  O'quv ma'lumotlari
                </h4>
                <DetailRowStu label="Fakultet" value={s.department?.name} />
                <DetailRowStu label="Mutaxassislik" value={s.specialty?.name} />
                <DetailRowStu label="Guruh" value={s.group?.name} />
                <DetailRowStu label="Kurs" value={s.level?.name} />
                <DetailRowStu label="Ta'lim shakli" value={s.educationForm?.name} />
                <DetailRowStu label="To'lov shakli" value={s.paymentForm?.name} />
                <DetailRowStu label="O'rtacha baho" value={s.avgGrade ? `${s.avgGrade} ball` : '—'} />
              </div>
            </div>
          )}

          {tab === 'grades' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Joriy semestr baholari</h4>
                <select style={{ height: 34, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
                  <option>2025-2026 · 2-semestr</option>
                  <option>2025-2026 · 1-semestr</option>
                </select>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFB' }}>
                    {['Fan', 'O\'qituvchi', 'JN1', 'JN2', 'YN', 'Jami', 'Baho'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Fan' || h === "O'qituvchi" ? 'left' : 'center',
                                            fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gradesMock.map((g, i) => {
                    const mark = g.jami >= 86 ? "A'lo" : g.jami >= 71 ? 'Yaxshi' : g.jami >= 55 ? 'Qoniqarli' : 'Qoniqarsiz';
                    const mv = g.jami >= 86 ? 'success' : g.jami >= 71 ? 'info' : g.jami >= 55 ? 'warning' : 'error';
                    return (
                      <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{g.sub}</td>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B' }}>{g.teacher}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{g.jn1}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{g.jn2}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{g.yn}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{g.jami}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}><Badge variant={mv}>{mark}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'contracts' && (
            <div>
              {contracts.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Kontraktlar topilmadi</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {contracts.map((c) => {
                    const paid = c.paidAmount || 0;
                    const total = c.amount || 1;
                    const pct = Math.min(100, Math.round(paid / total * 100));
                    return (
                      <div key={c.id} style={{ padding: 18, background: '#F8FAFC', borderRadius: 12, border: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>Shartnoma №{c.number}</div>
                            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{c.educationYear} · {c.contractType?.name || 'Kontrakt'}</div>
                          </div>
                          <Badge variant={c.balance > 0 ? 'error' : 'success'} dot>
                            {c.balance > 0 ? 'Qarz mavjud' : 'To\'langan'}
                          </Badge>
                        </div>
                        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
                          <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Jami summa</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{fmtUZSStu(c.amount)}</div>
                          </div>
                          <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>To'langan</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>{fmtUZSStu(paid)}</div>
                          </div>
                          <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Qoldiq</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: c.balance > 0 ? '#EF4444' : '#10B981' }}>{fmtUZSStu(c.balance || 0)}</div>
                          </div>
                        </div>
                        <div style={{ height: 6, background: '#E2E8F0', borderRadius: 99 }}>
                          <div style={{ height: 6, background: pct >= 100 ? '#10B981' : '#F59E0B', borderRadius: 99, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, textAlign: 'right' }}>{pct}% to'langan</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'docs' && (
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {DOCS_MOCK.map((d, i) => (
                <div key={i} style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9',
                                       display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}
                     className="hover-lift">
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EFF6FF', color: '#3B82F6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={d.icon} size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{d.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

Object.assign(window, {
  StudentsStatPage, TalabalarListPage, TalabalarStudentProfilePage,
});
