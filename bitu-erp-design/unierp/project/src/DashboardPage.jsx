// DashboardPage.jsx

const fmtDash = (n) => new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0));

const DashboardPage = ({ variant = 'cards' }) => {
  if (variant === 'narrative') return <DashboardNarrative />;
  return <DashboardCards />;
};

const DashboardCards = () => {
  const fin = typeof useFinance === 'function' ? useFinance() : null;
  const { students } = typeof useStudents === 'function' ? useStudents() : { students: [] };
  const hr = typeof useHr === 'function' ? useHr() : null;

  const totalStudents = students.length;
  const totalEmployees = hr?.employees?.length || 0;
  const totalContracts = fin?.contracts?.length || 0;
  const totalRevenue = (fin?.contracts || []).reduce((s, c) => s + (c.paidAmount || 0), 0);
  const debtorCount = (fin?.contracts || []).filter((c) => (c.debtAmount || 0) > 0).length;
  const totalDebt = (fin?.contracts || []).reduce((s, c) => s + (c.debtAmount || 0), 0);
  const uniqueGroups = new Set(students.map((s) => s.group?.name).filter(Boolean)).size;
  const uniqueDepts = new Set(students.map((s) => s.department?.name).filter(Boolean)).size;

  const recentPayments = (fin?.payments || []).sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5);

  const stats1 = [
    { icon: 'briefcase', label: 'Fakultetlar', value: '8', iconBg: '#2DB976' },
    { icon: 'doc', label: 'Kafedralar', value: String(uniqueDepts || 24), iconBg: '#10B981' },
    { icon: 'users', label: "O'qituvchilar", value: fmtDash(totalEmployees), iconBg: '#3B82F6' },
    { icon: 'user', label: 'Talabalar', value: fmtDash(totalStudents), iconBg: '#1B7A4E' },
    { icon: 'grid', label: 'Xonalar', value: '142', iconBg: '#F59E0B' },
    { icon: 'users', label: 'Guruhlar', value: String(uniqueGroups || 89), iconBg: '#8B5CF6' },
  ];

  const stats2 = [
    { icon: 'wallet', label: 'Tushumlar', value: `${fmtDash(totalRevenue / 1e6)}M`, iconBg: '#10B981' },
    { icon: 'warning', label: 'Qarzdorlar', value: String(debtorCount), iconBg: '#EF4444' },
    { icon: 'doc', label: 'Kontraktlar', value: String(totalContracts), iconBg: '#3B82F6' },
    { icon: 'money', label: 'Jami qarz', value: `${fmtDash(totalDebt / 1e6)}M`, iconBg: '#F59E0B' },
    { icon: 'doc', label: "Stipendiyalar", value: String(fin?.scholarships?.length || 0), iconBg: '#14B8A6' },
    { icon: 'calendar', label: "Buyruqlar", value: String(hr?.orders?.length || 0), iconBg: '#8B5CF6' },
  ];

  const activityItems = recentPayments.map((p, i) => {
    const student = (fin?.seedStudents || students).find((s) => s.id === p.studentId);
    const timeLabels = ['12 daq.', '34 daq.', '1 soat', '2 soat', '3 soat'];
    return {
      icon: 'doc', color: '#3B82F6', bg: '#EFF6FF',
      title: `To'lov: ${fmtDash(p.amount)} so'm`,
      sub: `${student?.full_name || 'Talaba'} · ${p.method}`,
      time: timeLabels[i] || `${i + 1} soat`,
    };
  });

  if (activityItems.length < 5) {
    activityItems.push(
      { icon: 'inbox', color: '#F59E0B', bg: '#FFFBEB', title: 'Yangi CRM ariza', sub: "IT yo'nalishi — Telegram manbaidan", time: '1 soat' },
      { icon: 'check', color: '#8B5CF6', bg: '#F3E8FF', title: 'Davomat belgilandi', sub: "301-A guruhi — Algoritmlar", time: '2 soat' },
    );
  }

  return (
    <>
      <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px',
                        background: '#ECFDF5', color: '#1B7A4E', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#2DB976' }} />
            Navoiy (bosh filial) · 2025-2026 · 2-semester
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon="doc">Eksport</Button>
          <Button variant="primary" icon="plus">Tezkor amal</Button>
        </div>
      </div>

      <div className="grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16, marginBottom: 16 }}>
        {stats1.map((s, i) => <StatCard key={i} {...s} className={`slide-up stagger-${i + 1}`} />)}
      </div>
      <div className="grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16, marginBottom: 24 }}>
        {stats2.map((s, i) => <StatCard key={i} {...s} className={`slide-up stagger-${i + 1}`} />)}
      </div>

      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <ChartCard title="Viloyatlar bo'yicha" period="Barcha">
          <DonutChart size={160} centerValue={totalStudents > 999 ? (totalStudents / 1000).toFixed(1) + 'k' : String(totalStudents)} centerLabel="Talaba"
            segments={[
              { label: 'Navoiy', value: 1240, color: '#2DB976' },
              { label: 'Zarafshon', value: 520, color: '#34D399' },
              { label: 'Uchquduq', value: 480, color: '#6EE7B7' },
              { label: 'Qashqadaryo', value: 410, color: '#A7F3D0' },
              { label: 'Boshqa', value: 597, color: '#D1FAE5' },
            ]} />
        </ChartCard>
        <ChartCard title="Jinsi bo'yicha" period="2025-26">
          <DonutChart size={160} centerValue="56%" centerLabel="Ayol"
            segments={[
              { label: 'Ayol', value: 1818, color: '#EC4899' },
              { label: 'Erkak', value: 1429, color: '#3B82F6' },
            ]} />
        </ChartCard>
        <ChartCard title="Yoshi bo'yicha" period="2025-26">
          <DonutChart size={160} centerValue="21.4" centerLabel="O'rtacha"
            segments={[
              { label: '17-20 yosh', value: 1580, color: '#2DB976' },
              { label: '21-24 yosh', value: 1340, color: '#F59E0B' },
              { label: '25+ yosh', value: 327, color: '#64748B' },
            ]} />
        </ChartCard>
      </div>

      <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        <ChartCard title="Talabalar dinamikasi" period="12 oy"
          right={<Badge variant="success" dot>+8.4% YoY</Badge>}>
          <LineChart id="dash-line" points={[2780, 2820, 2890, 2950, 2990, 3040, 3100, 3140, 3180, 3200, 3220, totalStudents || 3247]} height={200} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#94A3B8' }}>
            {['May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek','Yan','Fev','Mar','Apr'].map(m => <span key={m}>{m}</span>)}
          </div>
        </ChartCard>
        <ChartCard title="So'nggi faoliyat">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activityItems.slice(0, 5).map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: a.bg, color: a.color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={a.icon} size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{a.sub}</div>
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>{a.time}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </>
  );
};

const DashboardNarrative = () => {
  const fin = typeof useFinance === 'function' ? useFinance() : null;
  const { students } = typeof useStudents === 'function' ? useStudents() : { students: [] };

  const totalStudents = students.length || 3247;
  const totalRevenue = (fin?.contracts || []).reduce((s, c) => s + (c.paidAmount || 0), 0);
  const totalDebt = (fin?.contracts || []).reduce((s, c) => s + (c.debtAmount || 0), 0);
  const debtorCount = (fin?.contracts || []).filter((c) => (c.debtAmount || 0) > 0).length;
  const uniqueGroups = new Set(students.map((s) => s.group?.name).filter(Boolean)).size;
  const revenuePercent = totalRevenue > 0 ? Math.min(100, (totalRevenue / (totalRevenue + totalDebt)) * 100) : 77;

  return (
  <>
    {/* Hero KPI row */}
    <div className="grid-3-asym" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
      <div className="slide-up" style={{ background: 'linear-gradient(135deg,#1B7A4E,#0F4229)', color: '#fff',
                    borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', right: -30, bottom: -30, width: 220, height: 220, opacity: 0.1 }}
             viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#fff" fill="none"/><circle cx="50" cy="50" r="28" stroke="#fff" fill="none"/></svg>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bugungi kun</div>
          <div style={{ marginTop: 12, fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{fmtDash(totalStudents)}</div>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>faol talaba · 8 fakultet · {uniqueGroups || 89} guruh</div>
          <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,.18)', fontSize: 12, fontWeight: 500 }}>+124 bu yil</span>
            <span style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,.18)', fontSize: 12, fontWeight: 500 }}>67% kunduzgi</span>
          </div>
        </div>
      </div>
      <Card hover className="slide-up stagger-1">
        <div style={{ fontSize: 13, color: '#64748B' }}>Tushumlar (bu yil)</div>
        <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{fmtDash(totalRevenue / 1e6)}M <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>so'm</span></div>
        <div style={{ marginTop: 8 }}><ProgressBar value={revenuePercent} showLabel /></div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>{fmtDash((totalRevenue + totalDebt) / 1e6)}M rejadan · <span style={{ color: '#1B7A4E', fontWeight: 600 }}>+12% YoY</span></div>
      </Card>
      <Card hover className="slide-up stagger-2">
        <div style={{ fontSize: 13, color: '#64748B' }}>Qarzdorlar</div>
        <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700, color: '#B91C1C', letterSpacing: '-0.02em' }}>{debtorCount}</div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#1E293B' }}>{fmtDash(totalDebt / 1e6)}M so'm qarz</div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}><a href="#moliya-debtors" style={{ color: '#2DB976', fontWeight: 600, textDecoration: 'none' }}>Ko'rish →</a></div>
      </Card>
    </div>

    {/* Sections */}
    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      <ChartCard title="Fakultetlar bo'yicha talabalar" period="2025-26">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Axborot texnologiyalari', 890, '#2DB976'],
            ['Iqtisodiyot', 520, '#10B981'],
            ['Tog\'-kon ishi', 480, '#34D399'],
            ['Energetika', 420, '#6EE7B7'],
            ['Pedagogika', 380, '#A7F3D0'],
            ['Boshqa', 557, '#D1FAE5'],
          ].map(([name, val, color], i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: '#334155' }}>{name}</span>
                <span style={{ fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{val.toLocaleString()}</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: '#F1F5F9' }}>
                <div style={{ height: '100%', width: `${val/890*100}%`, background: color, borderRadius: 999, transition: 'width 600ms ease' }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
      <ChartCard title="Akademik holat" period="Jonli">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { l: 'Bugun darslar', v: '142', d: 'Rejalashtirilgan', color: '#2DB976' },
            { l: 'Kelgan talabalar', v: '87%', d: '2,824 / 3,247', color: '#3B82F6' },
            { l: 'Imtihonlar (bu hafta)', v: '23', d: '14 ta bugun', color: '#F59E0B' },
            { l: 'Yangi murojaatlar', v: '12', d: '5 ta kutilmoqda', color: '#EC4899' },
          ].map((k, i) => (
            <div key={i} style={{ padding: 14, background: '#F8FAFB', borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700, color: k.color, letterSpacing: '-0.02em' }}>{k.v}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{k.d}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>

    <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <ChartCard title="Jinsi" period="2025-26">
        <DonutChart size={150} centerValue="56%" centerLabel="Ayol"
          segments={[{ label: 'Ayol', value: 1818, color: '#EC4899' }, { label: 'Erkak', value: 1429, color: '#3B82F6' }]} />
      </ChartCard>
      <ChartCard title="Yosh taqsimoti" period="2025-26">
        <DonutChart size={150} centerValue="21.4" centerLabel="O'rtacha yosh"
          segments={[
            { label: '17-20', value: 1580, color: '#2DB976' },
            { label: '21-24', value: 1340, color: '#F59E0B' },
            { label: '25+', value: 327, color: '#64748B' },
          ]} />
      </ChartCard>
      <ChartCard title="TTJ holat" period="Bugun">
        <DonutChart size={150} centerValue="90%" centerLabel="Band"
          segments={[
            { label: 'Band', value: 1156, color: '#2DB976' },
            { label: 'Bo\'sh', value: 114, color: '#E2E8F0' },
            { label: 'Ta\'mirda', value: 10, color: '#F59E0B' },
          ]} />
      </ChartCard>
    </div>
  </>
  );
};

Object.assign(window, { DashboardPage });
