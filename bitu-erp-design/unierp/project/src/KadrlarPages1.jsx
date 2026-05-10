// KadrlarPages1.jsx — HR module pages 1-3: Panel, Xodimlar, Bo'limlar

const fmtUZSHr = (n) => new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0));

// ============ KADRLAR PANELI ============
const HrDashboardPage = () => {
  const auth = useAuth();
  const { employees, departments, orders, leaves } = useHr();

  const visible = React.useMemo(() => {
    if (auth.user?.role === 'dekan') {
      // Dekan sees employees of own faculty & its kafedras
      const facDeptIds = departments
        .filter((d) => d.id === auth.user.facultyId || d.parent === auth.user.facultyId)
        .map((d) => d.id);
      return employees.filter((e) => facDeptIds.includes(e.department?.id));
    }
    return employees;
  }, [employees, departments, auth.user]);

  const total = visible.length;
  const active = visible.filter((e) => e.status === 'active').length;
  const onLeave = visible.filter((e) => e.status === 'leave').length;
  const onTrip = visible.filter((e) => e.status === 'business-trip').length;

  const fakultetCount = departments.filter((d) => d.structureType === 'fakultet').length;
  const kafedraCount = departments.filter((d) => d.structureType === 'kafedra').length;

  const phdCount = visible.filter((e) => e.academicDegree?.code === 'phd').length;
  const dscCount = visible.filter((e) => e.academicDegree?.code === 'dsc').length;
  const profCount = visible.filter((e) => e.academicRank?.code === 'professor').length;
  const dotsCount = visible.filter((e) => e.academicRank?.code === 'dotsent').length;

  const recentOrders = orders.slice(0, 5);
  const pendingLeaves = leaves.filter((l) => l.status === 'pending').slice(0, 5);

  // Age distribution
  const now = new Date();
  const ageBuckets = { '<30': 0, '30-40': 0, '40-50': 0, '50-60': 0, '60+': 0 };
  visible.forEach((e) => {
    if (!e.birth_date) return;
    const age = now.getFullYear() - new Date(e.birth_date).getFullYear();
    if (age < 30) ageBuckets['<30']++;
    else if (age < 40) ageBuckets['30-40']++;
    else if (age < 50) ageBuckets['40-50']++;
    else if (age < 60) ageBuckets['50-60']++;
    else ageBuckets['60+']++;
  });

  const Bar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: '#475569' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${(value / Math.max(max, 1)) * 100}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  );

  return (
    <BituPage>
      <PageHeader
        title="Kadrlar paneli"
        subtitle={auth.user?.role === 'dekan' ? auth.user.facultyName : 'Universitet kadrlari ma\'lumoti'}
      />

      <StatGrid>
        <StatCard label="Jami xodimlar" value={total} icon="users" />
        <StatCard label="Faol" value={active} icon="check" trend={`${Math.round(active / total * 100)}%`} trendDir="up" />
        <StatCard label="Ta'tilda" value={onLeave} icon="calendar" />
        <StatCard label="Xizmat safarida" value={onTrip} icon="briefcase" />
      </StatGrid>

      <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card hover>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>Yosh bo'yicha taqsimot</h3>
            {Object.entries(ageBuckets).map(([k, v]) => (
              <Bar key={k} label={k + ' yosh'} value={v} max={Math.max(...Object.values(ageBuckets))} color="#4F46E5" />
            ))}
          </Card>

          <Card hover>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 600 }}>So'nggi buyruqlar</h3>
            {recentOrders.map((o) => (
              <div key={o.id} style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>№{o.number} — {o.typeLabel}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{o.employeeName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{o.date}</div>
                    <div style={{ marginTop: 4 }}><OrderStatusBadge status={o.status} /></div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card hover>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>Tuzilma</h3>
            <KpiMiniRow label="Fakultetlar" value={fakultetCount} />
            <KpiMiniRow label="Kafedralar" value={kafedraCount} />
            <KpiMiniRow label="Bo'limlar" value={departments.filter((d) => d.structureType === 'admin').length} />
          </Card>

          <Card hover>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>Ilmiy salohiyat</h3>
            <KpiMiniRow label="DSc" value={dscCount} accent="#7C3AED" />
            <KpiMiniRow label="PhD" value={phdCount} accent="#4F46E5" />
            <KpiMiniRow label="Professorlar" value={profCount} accent="#EC4899" />
            <KpiMiniRow label="Dotsentlar" value={dotsCount} accent="#0EA5E9" />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Tasdiqlash kutmoqda</h3>
              <Badge variant="warning">{pendingLeaves.length}</Badge>
            </div>
            {pendingLeaves.length === 0 ? (
              <div style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 16 }}>Tasdiqlash uchun arizalar yo'q</div>
            ) : pendingLeaves.map((l) => (
              <div key={l.id} style={{ padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>{l.employeeName}</div>
                <div style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                  {l.typeLabel} · {l.days} kun · {l.startDate}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </BituPage>
  );
};

const KpiMiniRow = ({ label, value, accent = '#4F46E5' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
    <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
    <span style={{ fontSize: 16, fontWeight: 700, color: accent }}>{value}</span>
  </div>
);

// ============ XODIMLAR ============
const HrEmployeesPage = ({ onOpenEmployee }) => {
  const auth = useAuth();
  const { employees, departments, loadFromHemis, loading, hemisLoaded } = useHr();
  const [search, setSearch] = React.useState('');
  const [deptFilter, setDeptFilter] = React.useState('all');
  const [posFilter, setPosFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 20;

  const baseList = React.useMemo(() => {
    if (auth.user?.role === 'dekan') {
      const facDeptIds = departments
        .filter((d) => d.id === auth.user.facultyId || d.parent === auth.user.facultyId)
        .map((d) => d.id);
      return employees.filter((e) => facDeptIds.includes(e.department?.id));
    }
    return employees;
  }, [employees, departments, auth.user]);

  const filtered = baseList.filter((e) => {
    if (search && !e.full_name.toLowerCase().includes(search.toLowerCase()) && !e.employee_id_number.includes(search)) return false;
    if (deptFilter !== 'all' && e.department?.id !== Number(deptFilter)) return false;
    if (posFilter !== 'all' && e.position?.code !== posFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  React.useEffect(() => { setPage(1); }, [search, deptFilter, posFilter, statusFilter]);

  const cols = [
    { key: 'idx', label: '№', width: 50, render: (_, __, i) => (page - 1) * PER_PAGE + i + 1 },
    {
      key: 'name', label: 'F.I.SH',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.full_name}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{r.employee_id_number}</div>
        </div>
      ),
    },
    { key: 'pos', label: 'Lavozimi', render: (r) => r.position?.name || '—' },
    {
      key: 'dept', label: "Bo'lim",
      render: (r) => <span style={{ fontSize: 13 }}>{(r.department?.name || '—').slice(0, 28)}{(r.department?.name || '').length > 28 ? '…' : ''}</span>
    },
    { key: 'rank', label: 'Daraja', render: (r) => r.academicDegree?.name || '—' },
    { key: 'phone', label: 'Telefon', render: (r) => r.phone },
    { key: 'status', label: 'Holat', render: (r) => <EmployeeStatusBadge status={r.status} /> },
    {
      key: 'actions', label: '', width: 60,
      render: (r) => (
        <Button variant="ghost" size="sm" icon="eye" onClick={(e) => { e.stopPropagation(); onOpenEmployee?.(r); }}>Ko'rish</Button>
      ),
    },
  ];

  const visibleDepts = auth.user?.role === 'dekan'
    ? departments.filter((d) => d.id === auth.user.facultyId || d.parent === auth.user.facultyId)
    : departments;

  return (
    <BituPage>
      <PageHeader
        title="Xodimlar"
        subtitle={`Jami: ${filtered.length} ta`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            {auth.user?.role === 'admin' && !hemisLoaded && (
              <Button variant="secondary" icon="download" onClick={loadFromHemis} disabled={loading}>
                {loading ? 'Yuklanmoqda…' : 'HEMIS dan yuklash'}
              </Button>
            )}
            {auth.user?.role === 'admin' && (
              <Button variant="primary" icon="plus" onClick={() => window.showToast?.('Yangi xodim qo\'shish', 'info')}>
                Yangi xodim
              </Button>
            )}
          </div>
        }
      />

      <Card padding={16}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 280px', minWidth: 240 }}>
            <Input placeholder="F.I.SH yoki ID raqam bo'yicha qidirish…" value={search} onChange={setSearch} icon="search" />
          </div>
          <Select
            label="Bo'lim"
            value={deptFilter}
            onChange={setDeptFilter}
            options={[{ value: 'all', label: 'Hammasi' }, ...visibleDepts.map((d) => ({ value: String(d.id), label: d.name.slice(0, 32) }))]}
          />
          <Select
            label="Lavozimi"
            value={posFilter}
            onChange={setPosFilter}
            options={[{ value: 'all', label: 'Hammasi' }, ...POSITIONS.map((p) => ({ value: p.code, label: p.name }))]}
          />
          <Select
            label="Holat"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'Hammasi' },
              { value: 'active', label: 'Faol' },
              { value: 'leave', label: "Ta'tilda" },
              { value: 'business-trip', label: 'Safarda' },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: 16 }}>
        <DataTable columns={cols} rows={pageData} loading={loading}
          empty={filtered.length === 0 && !loading ? { icon: 'search', title: 'Xodimlar topilmadi', message: 'Qidiruv yoki filtrlarni o\'zgartiring' } : null}
          selectable={false} onRowClick={(r) => onOpenEmployee?.(r)} />
        <Pagination page={page} total={pages} onChange={setPage} pageSize={PER_PAGE} totalRows={filtered.length} />
      </div>

    </BituPage>
  );
};

// ============ EMPLOYEE PROFILE PAGE (full-page detail) ============
const _heroBtnHr = {
  padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.3)',
  background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(4px)',
  color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
};

const DetailRowHr = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
    <span style={{ color: '#64748B' }}>{label}</span>
    <span style={{ color: '#0F172A', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
  </div>
);

const KadrlarEmployeeProfilePage = ({ employee, onBack }) => {
  const e = employee;
  const [tab, setTab] = React.useState('main');

  if (!e) return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Xodim tanlanmagan</div>;

  const initials = (e.first_name?.[0] || '') + (e.second_name?.[0] || '');

  const CAREER_MOCK = [
    { date: '01.09.2018', event: 'Ishga qabul qilindi', detail: `${e.department?.name || 'Bo\'lim'} — ${e.position?.name || 'Lavozim'}`, icon: 'plus', color: '#2DB976' },
    { date: '15.02.2020', event: 'Lavozim ko\'tarildi', detail: 'Katta o\'qituvchi → Dotsent', icon: 'arrowRight', color: '#4F46E5' },
    { date: '01.09.2022', event: 'Ilmiy daraja oldi', detail: 'PhD (falsafa doktori)', icon: 'check', color: '#7C3AED' },
    { date: '10.01.2024', event: 'Mukofotlandi', detail: 'Eng yaxshi o\'qituvchi — 2024', icon: 'star', color: '#F59E0B' },
  ];

  const SALARY_HISTORY = [
    { month: 'Yanvar 2026', base: e.salary || 5200000, bonus: 800000, tax: 720000, net: (e.salary || 5200000) + 800000 - 720000 },
    { month: 'Dekabr 2025', base: e.salary || 5200000, bonus: 1200000, tax: 768000, net: (e.salary || 5200000) + 1200000 - 768000 },
    { month: 'Noyabr 2025', base: e.salary || 5200000, bonus: 600000, tax: 696000, net: (e.salary || 5200000) + 600000 - 696000 },
    { month: 'Oktabr 2025', base: e.salary || 5200000, bonus: 0, tax: 624000, net: (e.salary || 5200000) - 624000 },
  ];

  const DOCS_MOCK = [
    { name: 'Mehnat shartnomasi', date: '01.09.2018', icon: 'doc' },
    { name: 'Diplom nusxasi', date: '01.09.2018', icon: 'doc' },
    { name: 'Pasport nusxasi', date: '01.09.2018', icon: 'doc' },
    { name: 'Tibbiy ko\'rik', date: '15.01.2026', icon: 'doc' },
    { name: 'PhD dissertatsiya', date: '01.09.2022', icon: 'doc' },
    { name: 'Buyruq (qabul)', date: '01.09.2018', icon: 'doc' },
  ];

  const tabs = [
    { v: 'main', l: 'Asosiy ma\'lumotlar', icon: 'user' },
    { v: 'career', l: 'Ish faoliyati', icon: 'briefcase', n: CAREER_MOCK.length },
    { v: 'salary', l: 'Maosh', icon: 'wallet', n: SALARY_HISTORY.length },
    { v: 'docs', l: 'Hujjatlar', icon: 'doc', n: DOCS_MOCK.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6,
                 background: 'transparent', border: 'none', color: '#64748B', fontSize: 13,
                 cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        <Icon name="arrowLeft" size={14} /> Xodimlar ro'yxati
      </button>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ height: 90, background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, right: 18, display: 'flex', gap: 8 }}>
            <button style={_heroBtnHr}><Icon name="edit" size={13} /> Tahrirlash</button>
            <button style={_heroBtnHr}><Icon name="mail" size={13} /> Xabar</button>
            <button style={_heroBtnHr}><Icon name="doc" size={13} /> Buyruq</button>
          </div>
        </div>
        <div style={{ padding: '0 32px 24px', marginTop: -36, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 92, height: 92, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0891B2, #0E7490)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 32, fontWeight: 700, border: '4px solid #fff',
                          boxShadow: '0 4px 14px rgba(0,0,0,.1)' }}>
              {initials}
            </div>
            <div style={{ flex: 1, marginBottom: 6, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>{e.full_name}</h2>
                <EmployeeStatusBadge status={e.status} />
                {e.employmentForm && (
                  <Badge variant="info">{e.employmentForm.name}</Badge>
                )}
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#64748B', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{e.employee_id_number}</span>
                <span>·</span>
                <span>{e.position?.name}</span>
                <span>·</span>
                <span>{e.department?.name}</span>
              </div>
            </div>
          </div>

          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 22 }}>
            {[
              { l: 'Bo\'lim', v: (e.department?.name || '—').slice(0, 28) + ((e.department?.name || '').length > 28 ? '…' : '') },
              { l: 'Lavozim', v: e.position?.name || '—' },
              { l: 'Ish staji', v: e.experience?.years ? `${e.experience.years} yil` : '—' },
              { l: 'Maosh', v: e.salary ? `${fmtUZSHr(e.salary)} so'm` : '—' },
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
                       borderBottom: `2px solid ${tab === t.v ? '#0891B2' : 'transparent'}`,
                       marginBottom: -1, fontSize: 13.5, fontFamily: 'inherit',
                       color: tab === t.v ? '#0F172A' : '#64748B',
                       fontWeight: tab === t.v ? 600 : 500, whiteSpace: 'nowrap' }}>
              <Icon name={t.icon} size={15} /> {t.l}
              {t.n != null && (
                <span style={{ padding: '1px 8px', borderRadius: 99, background: tab === t.v ? '#CFFAFE' : '#F1F5F9',
                               color: tab === t.v ? '#0E7490' : '#64748B', fontSize: 11, fontWeight: 600 }}>{t.n}</span>
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
                <DetailRowHr label="F.I.Sh." value={e.full_name} />
                <DetailRowHr label="Jinsi" value={e.gender?.name} />
                <DetailRowHr label="Tug'ilgan sana" value={e.birth_date} />
                <DetailRowHr label="Pasport" value={e.passport} />
                <DetailRowHr label="JSHSHIR" value={e.pinfl} />
                <DetailRowHr label="Telefon" value={e.phone} />
                <DetailRowHr label="Email" value={e.email} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Ish ma'lumotlari
                </h4>
                <DetailRowHr label="Bo'lim" value={e.department?.name} />
                <DetailRowHr label="Lavozimi" value={e.position?.name} />
                <DetailRowHr label="Ish turi" value={e.employmentForm?.name} />
                <DetailRowHr label="Stavka" value={e.employmentStaff?.name} />
                <DetailRowHr label="Ilmiy daraja" value={e.academicDegree?.name} />
                <DetailRowHr label="Ilmiy unvon" value={e.academicRank?.name} />
                <DetailRowHr label="Ish staji" value={e.experience?.years ? `${e.experience.years} yil` : '—'} />
                <DetailRowHr label="Ishga qabul" value={e.hireDate} />
                <DetailRowHr label="Shartnoma №" value={e.contractNumber} />
                <DetailRowHr label="Maoshi" value={e.salary ? `${fmtUZSHr(e.salary)} so'm` : '—'} />
              </div>
            </div>
          )}

          {tab === 'career' && (
            <div>
              <h4 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Ish faoliyati tarixi</h4>
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 2, background: '#E2E8F0' }} />
                {CAREER_MOCK.map((item, i) => (
                  <div key={i} style={{ position: 'relative', paddingBottom: i < CAREER_MOCK.length - 1 ? 28 : 0 }}>
                    <div style={{ position: 'absolute', left: -24, top: 2, width: 16, height: 16, borderRadius: '50%',
                                  background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={item.icon} size={9} style={{ color: '#fff' }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 3 }}>{item.date}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{item.event}</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'salary' && (
            <div>
              <div style={{ padding: '18px 22px', background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
                            borderRadius: 14, color: '#fff', marginBottom: 20 }}>
                <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 500, marginBottom: 4 }}>Joriy oylik maosh</div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtUZSHr(e.salary || 5200000)} so'm
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 24, fontSize: 13, opacity: 0.85 }}>
                  <span>Stavka: {e.employmentStaff?.name || '1.0'}</span>
                  <span>·</span>
                  <span>Daraja: {e.academicDegree?.name || '—'}</span>
                </div>
              </div>

              <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: '#475569' }}>Maosh tarixi</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFB' }}>
                    {['Oy', 'Asosiy', 'Bonus', 'Soliq', 'Qo\'lga'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Oy' ? 'left' : 'right',
                                            fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SALARY_HISTORY.map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>{row.month}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{fmtUZSHr(row.base)}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontVariantNumeric: 'tabular-nums', color: '#2DB976' }}>+{fmtUZSHr(row.bonus)}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontVariantNumeric: 'tabular-nums', color: '#EF4444' }}>−{fmtUZSHr(row.tax)}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtUZSHr(row.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'docs' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {DOCS_MOCK.map((d, i) => (
                <div key={i} className="hover-bg" style={{ padding: '16px 14px', border: '1px solid #F1F5F9', borderRadius: 12,
                              cursor: 'pointer', textAlign: 'center', transition: 'border-color .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDFA', color: '#0891B2',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Icon name={d.icon} size={18} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{d.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// ============ BO'LIMLAR ============
const HrDepartmentsPage = () => {
  const { departments, employees } = useHr();
  const [expanded, setExpanded] = React.useState(() => new Set(departments.filter((d) => !d.parent).map((d) => d.id)));

  const toggle = (id) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  const root = departments.filter((d) => !d.parent);
  const childrenOf = (id) => departments.filter((d) => d.parent === id);
  const empCount = (deptId) => employees.filter((e) => e.department?.id === deptId).length;

  const renderNode = (dept, level = 0) => {
    const kids = childrenOf(dept.id);
    const isOpen = expanded.has(dept.id);
    return (
      <React.Fragment key={dept.id}>
        <div
          onClick={() => kids.length && toggle(dept.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            paddingLeft: 16 + level * 24,
            background: level === 0 ? '#F8FAFC' : '#fff',
            borderBottom: '1px solid #F1F5F9',
            cursor: kids.length ? 'pointer' : 'default',
            fontWeight: level === 0 ? 600 : 400,
          }}
        >
          {kids.length ? (
            <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={14} />
          ) : <span style={{ width: 14 }} />}
          <Icon name={dept.structureType === 'fakultet' ? 'building' : dept.structureType === 'kafedra' ? 'book' : 'briefcase'} size={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14 }}>{dept.name}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{dept.code}</div>
          </div>
          <Badge variant="neutral">{empCount(dept.id)} xodim</Badge>
        </div>
        {isOpen && kids.map((k) => renderNode(k, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <BituPage>
      <PageHeader
        title="Bo'limlar va kafedralar"
        subtitle={`Jami: ${departments.length} ta tarkibiy bo'linma`}
        actions={
          <Button variant="primary" icon="plus" onClick={() => window.showToast?.('Yangi bo\'lim qo\'shish', 'info')}>
            Yangi bo'lim
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Fakultetlar" value={departments.filter((d) => d.structureType === 'fakultet').length} icon="building" />
        <StatCard label="Kafedralar" value={departments.filter((d) => d.structureType === 'kafedra').length} icon="book" />
        <StatCard label="Bo'limlar" value={departments.filter((d) => d.structureType === 'admin').length} icon="briefcase" />
        <StatCard label="Jami xodimlar" value={employees.length} icon="users" />
      </StatGrid>

      <div style={{ marginTop: 24 }}>
        <Card padding={0}>
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid #E2E8F0',
            display: 'flex', justifyContent: 'space-between', fontSize: 12,
            color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6,
          }}>
            <span>Tarkibiy bo'linma</span>
            <span>Xodimlar</span>
          </div>
          {root.map((d) => renderNode(d))}
        </Card>
      </div>
    </BituPage>
  );
};

Object.assign(window, {
  HrDashboardPage, HrEmployeesPage, HrDepartmentsPage,
  KadrlarEmployeeProfilePage,
});
