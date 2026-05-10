// NewPages.jsx — Forgot/2FA, Teacher profile, Exams, Library, HR, Orders, Settings, Notifications, Student wizard

// ========= FORGOT / 2FA =========
const ForgotPasswordPage = ({ onBack, onDone }) => {
  const [step, setStep] = React.useState(1); // 1=email, 2=code, 3=new pw
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const inputs = React.useRef([]);
  const updateCode = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const nc = [...code]; nc[i] = v; setCode(nc);
    if (v && i < 5) inputs.current[i+1]?.focus();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg,#ECFDF5 0%,#F8FAFB 50%,#EFF6FF 100%)', padding: 20,
                  fontFamily: "'Inter',sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 20, padding: 36,
                    boxShadow: '0 25px 50px rgba(0,0,0,.08)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 13, display: 'inline-flex', gap: 6, alignItems: 'center', padding: 0, marginBottom: 20, fontFamily: 'inherit' }}>
          <Icon name="arrowLeft" size={14} /> Kirish sahifasi
        </button>

        <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? '#2DB976' : '#E2E8F0', transition: 'background 200ms ease' }} />
          ))}
        </div>

        {step === 1 && <>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>Parolni tiklash</h2>
          <p style={{ margin: '0 0 22px', fontSize: 13.5, color: '#64748B' }}>Email manzilingizni kiriting — sizga tasdiqlash kodi yuboramiz.</p>
          <Input label="Email" type="email" placeholder="siz@uni.uz" leftIcon="mail" />
          <div style={{ marginTop: 20 }}>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => setStep(2)}>Kodni yuborish</Button>
          </div>
        </>}

        {step === 2 && <>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>Kodni kiriting</h2>
          <p style={{ margin: '0 0 22px', fontSize: 13.5, color: '#64748B' }}>siz@uni.uz manziliga yuborilgan 6 raqamli kod.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginBottom: 18 }}>
            {code.map((d, i) => (
              <input key={i} ref={el => inputs.current[i] = el} value={d} onChange={e => updateCode(i, e.target.value)}
                maxLength={1} inputMode="numeric"
                style={{ width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                         border: `2px solid ${d ? '#2DB976' : '#E2E8F0'}`, borderRadius: 10, outline: 'none',
                         fontFamily: 'inherit', color: '#0F172A' }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 14 }}>
            Kod kelmadi? <a href="#" style={{ color: '#2DB976', fontWeight: 600, textDecoration: 'none' }}>Qayta yuborish (00:42)</a>
          </div>
          <Button variant="primary" style={{ width: '100%' }} onClick={() => setStep(3)}>Tasdiqlash</Button>
        </>}

        {step === 3 && <>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>Yangi parol</h2>
          <p style={{ margin: '0 0 22px', fontSize: 13.5, color: '#64748B' }}>Kamida 8 belgi, bitta katta harf va raqam.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Yangi parol" type="password" placeholder="••••••••" />
            <Input label="Parolni takrorlang" type="password" placeholder="••••••••" />
          </div>
          <div style={{ marginTop: 20 }}>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => { window.showToast?.('Parol yangilandi. Endi kirishingiz mumkin.'); onDone?.(); }}>Parolni saqlash</Button>
          </div>
        </>}
      </div>
    </div>
  );
};

// ========= O'QITUVCHI PROFIL =========
const TeacherProfilePage = ({ teacher, onBack }) => {
  const [tab, setTab] = React.useState('overview');
  const t = teacher || TEACHERS[0];

  const loadData = [
    { subj: 'Algoritmlar', hours: 124, type: 'Maʼruza', groups: '301-A, 301-B, 302-A' },
    { subj: 'Algoritmlar', hours: 96, type: 'Labor.', groups: '201-A, 201-B' },
    { subj: 'Ma\'lumotlar bazasi', hours: 48, type: 'Seminar', groups: '402-A' },
    { subj: 'Ishlab chiqarish amaliyoti', hours: 72, type: 'Amaliy', groups: '501-A, 501-B' },
  ];

  return (
    <>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 13, display: 'inline-flex', gap: 6, alignItems: 'center', padding: 0, marginBottom: 14, fontFamily: 'inherit' }}>
        <Icon name="arrowLeft" size={14} /> O'qituvchilar ro'yxati
      </button>

      <Card padding={20} style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <Avatar initials={t.name.initials} size={76} color={t.name.isFemale ? 'amber' : 'blue'} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{t.name.full}</h2>
              <Badge variant="success" dot>Faol</Badge>
              <Badge variant={t.mode === 'Shtatli' ? 'info' : 'neutral'}>{t.mode}</Badge>
            </div>
            <div style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>{t.title} · {t.dept}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,auto)', gap: '12px 28px', marginTop: 16 }}>
              <InfoCell label="ID" value={`TCH-${String(t.id).padStart(4,'0')}`} />
              <InfoCell label="Daraja" value={t.degree} />
              <InfoCell label="Staj" value={`${t.experience} yil`} />
              <InfoCell label="Yillik soat" value={t.hours} />
              <InfoCell label="Telefon" value={t.phone} />
              <InfoCell label="Email" value={t.email} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" icon="mail">Xabar</Button>
            <Button variant="primary" size="sm" icon="edit">Tahrirlash</Button>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0', marginBottom: 18 }}>
        {[['overview','Umumiy'],['load','Yuklama'],['schedule','Jadval'],['students','Talabalar'],['docs','Hujjatlar']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)}
            style={{ padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                     borderBottom: `2px solid ${tab === v ? '#2DB976' : 'transparent'}`, marginBottom: -1,
                     fontSize: 13.5, fontFamily: 'inherit', color: tab === v ? '#2DB976' : '#64748B',
                     fontWeight: tab === v ? 600 : 500 }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          <StatCard icon="users" label="Joriy talabalar" value="128" iconBg="#2DB976" />
          <StatCard icon="chart" label="O'rt. GPA guruhlari" value="4.12" iconBg="#3B82F6" />
          <StatCard icon="check" label="Davomat foizi" value="94%" iconBg="#F59E0B" />
          <StatCard icon="trendUp" label="Reyting" value="4.8 / 5" iconBg="#8B5CF6" />
        </div>
      )}

      {tab === 'load' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>
              {['Fan','Tur','Soat','Guruhlar'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {loadData.map((l, i) => (
                <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13.5, fontWeight: 500, color: '#0F172A' }}>{l.subj}</td>
                  <td style={{ padding: '12px 14px' }}><Badge variant={l.type === 'Maʼruza' ? 'success' : l.type === 'Labor.' ? 'info' : l.type === 'Seminar' ? 'warning' : 'neutral'}>{l.type}</Badge></td>
                  <td style={{ padding: '12px 14px', fontSize: 13.5, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{l.hours} soat</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>{l.groups}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #E2E8F0', background: '#F8FAFB' }}>
                <td colSpan={2} style={{ padding: '12px 14px', fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>Jami yillik yuklama</td>
                <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#1B7A4E', fontVariantNumeric: 'tabular-nums' }}>{loadData.reduce((s,x)=>s+x.hours,0)} soat</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'schedule' && (
        <Card padding={20}>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>O'qituvchining haftalik jadvali</div>
          <SchedulePage />
        </Card>
      )}

      {tab === 'students' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['Talaba','Guruh','Fan','Joriy baho','Davomat'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {STUDENTS.slice(0, 10).map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={s.name.initials} size={28} color={s.name.isFemale ? 'amber' : 'blue'} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.name.short}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>{s.group}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>Algoritmlar</td>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{(3.5 + seed(s.id+19)*1.4).toFixed(1)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <ProgressBar value={rnum(s.id+21, 78, 99)} showLabel />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'docs' && (
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {['Mehnat shartnomasi','Diplom nusxasi','Malaka oshirish sertifikati','Pasport nusxasi','Ilmiy ishlar ro\'yxati','Buyruq №145'].map((d, i) => (
            <Card key={i} padding={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 44, borderRadius: 6, background: '#FEF2F2', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="doc" size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', lineHeight: 1.3 }}>{d}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>PDF · {rnum(i+1, 120, 890)} KB</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

const InfoCell = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 13.5, color: '#0F172A', fontWeight: 500 }}>{value}</div>
  </div>
);

// ========= IMTIHONLAR =========
const ExamsPage = () => {
  const [tab, setTab] = React.useState('sessions');
  const sessions = [
    { id: 1, name: 'Bahorgi sessiya 2025-2026', period: '15.05 — 30.06.2026', status: 'Faol', exams: 48, students: 2847 },
    { id: 2, name: 'Kuzgi sessiya 2025-2026', period: '20.12.2025 — 15.01.2026', status: 'Yakunlangan', exams: 52, students: 2912 },
    { id: 3, name: 'Qayta topshirish (bahor)', period: '01.07 — 15.07.2026', status: 'Rejalashtirilgan', exams: 0, students: 0 },
  ];
  const exams = [
    { id: 1, subj: 'Algoritmlar', fac: 'Axborot texnologiyalari', course: 1, date: '22.05.2026', time: '09:00', room: '301', teacher: 'Karimov U.B.', studs: 128, type: 'Yozma' },
    { id: 2, subj: 'Ma\'lumotlar bazasi', fac: 'Axborot texnologiyalari', course: 2, date: '24.05.2026', time: '10:30', room: '204', teacher: 'Nazarova M.', studs: 112, type: 'Og\'zaki' },
    { id: 3, subj: 'Iqtisodiy tahlil', fac: 'Iqtisodiyot', course: 2, date: '26.05.2026', time: '09:00', room: 'Lab-2', teacher: 'Saidov R.', studs: 94, type: 'Test' },
    { id: 4, subj: 'Moliya', fac: 'Iqtisodiyot', course: 3, date: '28.05.2026', time: '14:00', room: '112', teacher: 'Xolmatov A.', studs: 86, type: 'Yozma' },
    { id: 5, subj: 'Tog\'-kon ishi', fac: 'Tog\'-kon ishi', course: 5, date: '30.05.2026', time: '09:00', room: 'Karyer', teacher: 'Rahimov S.', studs: 74, type: 'Amaliy' },
    { id: 6, subj: 'Pedagogika', fac: 'Pedagogika', course: 4, date: '02.06.2026', time: '10:00', room: '115', teacher: 'Hasanova D.', studs: 68, type: 'Og\'zaki' },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {[['sessions','Sessiyalar'],['calendar','Imtihonlar jadvali'],['tickets','Biletlar'],['vedomost','Vedomostlar']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)}
            style={{ padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                     borderBottom: `2px solid ${tab === v ? '#2DB976' : 'transparent'}`, marginBottom: -1,
                     fontSize: 13.5, fontFamily: 'inherit', color: tab === v ? '#2DB976' : '#64748B',
                     fontWeight: tab === v ? 600 : 500 }}>{l}</button>
        ))}
      </div>

      {tab === 'sessions' && (
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {sessions.map(s => (
            <Card key={s.id} hover padding={18}>
              <Badge variant={s.status === 'Faol' ? 'success' : s.status === 'Yakunlangan' ? 'neutral' : 'info'} dot>{s.status}</Badge>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginTop: 12, lineHeight: 1.3 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{s.period}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                <div><div style={{ fontSize: 11, color: '#94A3B8' }}>Imtihonlar</div><div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{s.exams}</div></div>
                <div><div style={{ fontSize: 11, color: '#94A3B8' }}>Talabalar</div><div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{s.students.toLocaleString()}</div></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'calendar' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['Fan','Fakultet','Kurs','Sana','Vaqt','Xona','O\'qituvchi','Tur','Talabalar'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {exams.map(e => (
                <tr key={e.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13.5, fontWeight: 500, color: '#0F172A' }}>{e.subj}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12.5, color: '#475569' }}>{e.fac}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569', fontVariantNumeric: 'tabular-nums' }}>{e.course}-kurs</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{e.date}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569', fontVariantNumeric: 'tabular-nums' }}>{e.time}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>№ {e.room}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>{e.teacher}</td>
                  <td style={{ padding: '12px 14px' }}><Badge variant={e.type === 'Yozma' ? 'info' : e.type === 'Og\'zaki' ? 'warning' : e.type === 'Test' ? 'success' : 'neutral'}>{e.type}</Badge></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{e.studs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'tickets' && (
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {Array.from({length: 9}, (_, i) => ({
            num: i + 1,
            q1: ['Algoritmlarning predmeti va vazifalari', 'Daraxt strukturalari va funksiyasi', 'Tarmoq protokollari', 'Ma\'lumotlar bazasi normalashtirish', 'Dasturlash paradigmalari', 'Kompilyator bosqichlari', 'Operatsion tizim arxitekturasi', 'Veb-xavfsizlik asoslari', 'Mashinaviy o\'rganish kirish'][i],
            q2: ['Murakkablik nazariyasi', 'Iqtisodiyot asoslari', 'OOP prinsiplari', 'Algoritmlar klassifikatsiyasi', 'Operatsion tizimlar funksiyalari', 'Tarmoq topologiyalari', 'Bulutli xizmatlar', 'REST API dizayni', 'Neyron tarmoqlar'][i],
            q3: 'Amaliy masala'
          })).map(t => (
            <Card key={t.num} padding={16}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ECFDF5', color: '#1B7A4E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>№ {t.num}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Bilet {t.num}</div>
                <div style={{ flex: 1 }} />
                <IconButton icon="more" label="" size={26} />
              </div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                <div><b style={{ color: '#334155' }}>1.</b> {t.q1}</div>
                <div style={{ marginTop: 4 }}><b style={{ color: '#334155' }}>2.</b> {t.q2}</div>
                <div style={{ marginTop: 4 }}><b style={{ color: '#334155' }}>3.</b> {t.q3}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'vedomost' && (
        <Card padding={0}>
          <div style={{ padding: 18, borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Algoritmlar — 301-A guruhi</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>Imtihon: 22.05.2026 · O'qituvchi: Karimov U.B.</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['№','Talaba','Bilet','Og\'zaki','Yozma','Test','Baho','Imzo'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {STUDENTS.slice(0, 12).map((s, i) => {
                const og = rnum(i+31, 40, 50), yo = rnum(i+32, 38, 50), ts = rnum(i+33, 40, 50);
                const tot = og + yo + ts;
                const grade = tot >= 135 ? 5 : tot >= 120 ? 4 : tot >= 100 ? 3 : 2;
                return (
                  <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{i+1}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{s.name.full}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#475569' }}>№ {((i % 9) + 1)}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{og}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{yo}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{ts}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
                                     background: grade >= 5 ? '#D1FAE5' : grade === 4 ? '#ECFDF5' : grade === 3 ? '#FFFBEB' : '#FEF2F2',
                                     color: grade >= 5 ? '#065F46' : grade === 4 ? '#1B7A4E' : grade === 3 ? '#B45309' : '#B91C1C' }}>{grade}</span>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>_______</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
};

// ========= KUTUBXONA =========
const LibraryPage = () => {
  const [tab, setTab] = React.useState('catalog');
  const books = [
    { id: 1, title: 'Algoritmlar va ma\'lumotlar tuzilmasi', author: 'Z.M. Sulaymonov', year: 2022, copies: 45, avail: 12, cat: 'Informatika' },
    { id: 2, title: 'Iqtisodiy tahlil asoslari', author: 'N.R. Orifjonova', year: 2023, copies: 30, avail: 8, cat: 'Iqtisodiyot' },
    { id: 3, title: 'Pedagogika qo\'llanmasi', author: 'D.A. Hasanova', year: 2021, copies: 28, avail: 0, cat: 'Pedagogika' },
    { id: 4, title: 'Ma\'lumotlar bazasi nazariyasi', author: 'R.S. Saidov', year: 2022, copies: 36, avail: 15, cat: 'Informatika' },
    { id: 5, title: 'Tog\'-kon ishi amaliy kursi', author: 'S.B. Rahimov', year: 2023, copies: 22, avail: 6, cat: 'Tog\'-kon' },
    { id: 6, title: 'Veb-dasturlash: ma\'ruzalar kursi', author: 'M.K. Nazarova', year: 2020, copies: 40, avail: 18, cat: 'Informatika' },
    { id: 7, title: 'Moliya va kredit asoslari', author: 'J.U. Yusupov', year: 2023, copies: 25, avail: 4, cat: 'Iqtisodiyot' },
    { id: 8, title: 'Energetika atlasi', author: 'F.T. Tursunova', year: 2021, copies: 18, avail: 2, cat: 'Energetika' },
  ];

  return (
    <>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { l: 'Jami kitoblar', v: '12,486', c: '#2DB976' },
          { l: 'Ijarada', v: '3,127', c: '#F59E0B' },
          { l: 'Muddati o\'tgan', v: '48', c: '#EF4444' },
          { l: 'Faol o\'quvchilar', v: '2,104', c: '#3B82F6' },
        ].map((k, i) => (
          <Card key={i} hover padding={18}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: k.c, letterSpacing: '-0.02em' }}>{k.v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0', marginBottom: 18 }}>
        {[['catalog','Katalog'],['loans','Ijara ro\'yxati'],['queue','Zayavkalar'],['readers','O\'quvchilar']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${tab === v ? '#2DB976' : 'transparent'}`, marginBottom: -1, fontSize: 13.5, fontFamily: 'inherit', color: tab === v ? '#2DB976' : '#64748B', fontWeight: tab === v ? 600 : 500 }}>{l}</button>
        ))}
      </div>

      {tab === 'catalog' && (
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {books.map(b => (
            <Card key={b.id} padding={14}>
              <div style={{ height: 140, borderRadius: 8, background: `linear-gradient(135deg,${['#2DB976','#3B82F6','#F59E0B','#8B5CF6'][b.id % 4]},${['#1B7A4E','#1D4ED8','#B45309','#6B21A8'][b.id % 4]})`, color: '#fff',
                            display: 'flex', alignItems: 'flex-end', padding: 12, marginBottom: 10 }}>
                <Icon name="doc" size={22} />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A', lineHeight: 1.3, minHeight: 36 }}>{b.title}</div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 4 }}>{b.author} · {b.year}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                <Badge variant={b.avail > 0 ? 'success' : 'error'} dot>{b.avail > 0 ? `${b.avail} / ${b.copies}` : 'Yo\'q'}</Badge>
                <button style={{ background: '#ECFDF5', color: '#1B7A4E', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Band qilish</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'loans' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['Kitob','O\'quvchi','Olingan','Qaytarish','Holat'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {STUDENTS.slice(0, 10).map((s, i) => {
                const b = books[i % books.length];
                const overdue = i % 5 === 0;
                return (
                  <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{b.title}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>{s.name.short} · {s.group}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{rnum(i+1, 1, 18)}.04.2026</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: overdue ? '#B91C1C' : '#64748B', fontVariantNumeric: 'tabular-nums' }}>{rnum(i+5, 1, 28)}.05.2026</td>
                    <td style={{ padding: '12px 14px' }}><Badge variant={overdue ? 'error' : 'success'} dot>{overdue ? 'Muddati o\'tgan' : 'Faol'}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'queue' && (
        <EmptyState icon="inbox" title="Zayavkalar yo'q" hint="Kutishda bo'lgan kitob so'rovlari bu yerda paydo bo'ladi" action={<Button variant="primary" size="sm" icon="plus">Zayavka qo'shish</Button>} />
      )}

      {tab === 'readers' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['O\'quvchi','Toifa','Hozir ijarada','Jami olingan','Muddati o\'tgan'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {STUDENTS.slice(0, 12).map((s, i) => (
                <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar initials={s.name.initials} size={28} color={s.name.isFemale ? 'amber' : 'blue'} /><div><div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.name.short}</div><div style={{ fontSize: 11, color: '#64748B' }}>{s.group}</div></div></div></td>
                  <td style={{ padding: '12px 14px' }}><Badge variant="info">Talaba</Badge></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{rnum(i+1, 0, 4)}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{rnum(i+3, 8, 42)}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: i % 7 === 0 ? '#B91C1C' : '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>{i % 7 === 0 ? '1' : '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
};

// ========= HR =========
const HrPage = () => {
  const [tab, setTab] = React.useState('staff');
  const vac = [
    { id: 1, emp: 'Karimov U.B.', from: '12.05.2026', to: '02.06.2026', days: 21, type: 'Mehnat taʼtili', status: 'Tasdiqlangan' },
    { id: 2, emp: 'Nazarova M.', from: '20.04.2026', to: '27.04.2026', days: 7, type: 'Bemorlik', status: 'Jarayonda' },
    { id: 3, emp: 'Saidov R.', from: '01.07.2026', to: '15.07.2026', days: 14, type: 'Mehnat taʼtili', status: 'Tasdiqlangan' },
    { id: 4, emp: 'Xolmatov A.', from: '15.04.2026', to: '17.04.2026', days: 3, type: 'Shaxsiy', status: 'Rad etilgan' },
  ];
  const salaries = TEACHERS.slice(0, 10).map((t, i) => ({
    emp: t,
    baseRate: rnum(i+501, 4, 12) * 500000,
    hours: rnum(i+503, 120, 280),
    bonus: rnum(i+505, 0, 3000000),
    tax: 0.12,
  }));

  return (
    <>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { l: 'Jami xodimlar', v: '487', c: '#2DB976' },
          { l: 'O\'qituvchilar', v: '312', c: '#1B7A4E' },
          { l: 'Taʼtilda', v: '24', c: '#F59E0B' },
          { l: 'Oylik fond', v: '1.42 mlrd', s: 'so\'m', c: '#3B82F6' },
        ].map((k, i) => (
          <Card key={i} hover padding={18}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: k.c, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{k.v}</div>
            {k.s && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{k.s}</div>}
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0', marginBottom: 18 }}>
        {[['staff','Xodimlar'],['vacation','Taʼtillar'],['salary','Oylik maosh'],['training','Malaka oshirish']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${tab === v ? '#2DB976' : 'transparent'}`, marginBottom: -1, fontSize: 13.5, fontFamily: 'inherit', color: tab === v ? '#2DB976' : '#64748B', fontWeight: tab === v ? 600 : 500 }}>{l}</button>
        ))}
      </div>

      {tab === 'staff' && <TeachersListPage />}

      {tab === 'vacation' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['Xodim','Turi','Boshlanish','Tugash','Kunlar','Status',''].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {vac.map(v => (
                <tr key={v.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{v.emp}</td>
                  <td style={{ padding: '12px 14px' }}><Badge variant={v.type === 'Bemorlik' ? 'warning' : v.type === 'Shaxsiy' ? 'neutral' : 'info'}>{v.type}</Badge></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569', fontVariantNumeric: 'tabular-nums' }}>{v.from}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569', fontVariantNumeric: 'tabular-nums' }}>{v.to}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v.days} kun</td>
                  <td style={{ padding: '12px 14px' }}><Badge variant={v.status === 'Tasdiqlangan' ? 'success' : v.status === 'Rad etilgan' ? 'error' : 'warning'} dot>{v.status}</Badge></td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}><IconButton icon="more" label="" size={26} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'salary' && (
        <Card padding={0}>
          <div style={{ padding: 18, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Aprel 2026 — maosh vedomosti</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Hisoblash sanasi: 25.04.2026 · Holat: Tayyor</div>
            </div>
            <div style={{ flex: 1 }} />
            <Button variant="secondary" size="sm" icon="upload">Eksport</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['Xodim','Lavozim','Stavka','Soat','Asosiy','Premiya','Soliq','Qo\'lga'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {salaries.map((s, i) => {
                const gross = s.baseRate + s.bonus;
                const net = Math.round(gross * (1 - s.tax));
                return (
                  <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#0F172A' }}>{s.emp.name.short}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B' }}>{s.emp.title}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{s.baseRate.toLocaleString('ru-RU')}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{s.hours}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12.5, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{s.baseRate.toLocaleString('ru-RU')}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12.5, color: '#1B7A4E', fontVariantNumeric: 'tabular-nums' }}>{s.bonus ? '+' + s.bonus.toLocaleString('ru-RU') : '—'}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12.5, color: '#B91C1C', fontVariantNumeric: 'tabular-nums' }}>−{Math.round(gross * s.tax).toLocaleString('ru-RU')}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{net.toLocaleString('ru-RU')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'training' && (
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { title: 'Zamonaviy ta\'lim texnologiyalari', dur: '72 soat', date: '15.05.2026', seats: 24, filled: 18, org: 'TSU' },
            { title: 'Sun\'iy intellekt va ML metodlari', dur: '120 soat', date: '01.06.2026', seats: 16, filled: 16, org: 'Xalqaro markaz' },
            { title: 'Elektron ta\'lim tizimlari', dur: '36 soat', date: '20.04.2026', seats: 40, filled: 32, org: 'NIU' },
          ].map((c, i) => (
            <Card key={i} padding={16}>
              <Badge variant="info" dot>{c.org}</Badge>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginTop: 10, lineHeight: 1.3 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{c.dur} · Boshlanish {c.date}</div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748B', marginBottom: 4 }}>
                  <span>Joylar to'ldi</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{c.filled}/{c.seats}</span>
                </div>
                <ProgressBar value={c.filled} max={c.seats} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

// ========= BUYRUQLAR =========
const OrdersPage = () => {
  const orders = [
    { id: '01-145', date: '22.04.2026', title: 'Bahorgi sessiyani tashkil etish to\'g\'risida', cat: 'O\'quv', signer: 'Rektor Ibragimov O.M.', status: 'Imzolangan' },
    { id: '02-144', date: '20.04.2026', title: 'Xodimlarga premiya tayinlash haqida', cat: 'Moliyaviy', signer: 'Rektor Ibragimov O.M.', status: 'Imzolangan' },
    { id: '03-143', date: '18.04.2026', title: '2026-yilgi qabul kvotasini tasdiqlash', cat: 'Ma\'muriy', signer: 'Rektor Ibragimov O.M.', status: 'Imzolangan' },
    { id: '04-142', date: '15.04.2026', title: 'Xalqaro konferensiya o\'tkazish', cat: 'Ilmiy', signer: 'Ilmiy prorektor', status: 'Imzolangan' },
    { id: '05-141', date: '14.04.2026', title: 'Talaba Karimov J.ni chetlashtirish', cat: 'Intizomiy', signer: 'O\'quv prorektor', status: 'Imzoda' },
    { id: '06-140', date: '12.04.2026', title: 'TTJ-2 binoni taʼmirlash', cat: 'Xo\'jalik', signer: 'Rektor Ibragimov O.M.', status: 'Imzolangan' },
    { id: '07-139', date: '10.04.2026', title: 'Yangi fakultet ochish to\'g\'risida', cat: 'Strategik', signer: 'Rektor Ibragimov O.M.', status: 'Loyiha' },
    { id: '08-138', date: '08.04.2026', title: 'O\'qituvchi Nazarova M.ga rahmat', cat: 'Rag\'bat', signer: 'Rektor Ibragimov O.M.', status: 'Imzolangan' },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 320 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}><Icon name="search" size={15} /></span>
          <input placeholder="Buyruq raqami yoki matn bo'yicha..." style={{ width: '100%', height: 38, padding: '0 12px 0 36px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select style={{ height: 38, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
          <option>Barcha kategoriyalar</option><option>O'quv</option><option>Moliyaviy</option><option>Intizomiy</option>
        </select>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="sm" icon="plus">Yangi buyruq</Button>
      </div>

      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFB' }}>{['№','Sana','Mavzu','Kategoriya','Imzolovchi','Status',''].map(h => <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px', fontSize: 13, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{o.id}</td>
                <td style={{ padding: '14px', fontSize: 12.5, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{o.date}</td>
                <td style={{ padding: '14px', fontSize: 13.5, color: '#0F172A' }}>{o.title}</td>
                <td style={{ padding: '14px' }}><Badge variant={o.cat === 'Intizomiy' ? 'error' : o.cat === 'Moliyaviy' ? 'warning' : o.cat === 'Rag\'bat' ? 'success' : 'neutral'}>{o.cat}</Badge></td>
                <td style={{ padding: '14px', fontSize: 12.5, color: '#475569' }}>{o.signer}</td>
                <td style={{ padding: '14px' }}><Badge variant={o.status === 'Imzolangan' ? 'success' : o.status === 'Imzoda' ? 'warning' : 'neutral'} dot>{o.status}</Badge></td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <button style={{ background: '#ECFDF5', color: '#1B7A4E', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// ========= SOZLAMALAR =========
const SettingsPage = () => {
  const [tab, setTab] = React.useState('general');
  const roles = [
    { name: 'Super admin', users: 3, perms: 'Barcha ruxsatlar', color: '#EF4444' },
    { name: 'Rektor', users: 1, perms: 'Strategik boshqaruv, imzo', color: '#8B5CF6' },
    { name: 'Prorektor', users: 4, perms: 'O\'z bo\'limi bo\'yicha to\'liq', color: '#3B82F6' },
    { name: 'Dekan', users: 8, perms: 'Fakultet boshqaruvi', color: '#2DB976' },
    { name: 'Kafedra mudiri', users: 24, perms: 'Kafedra boshqaruvi', color: '#F59E0B' },
    { name: 'O\'qituvchi', users: 312, perms: 'Dars, baho, davomat', color: '#64748B' },
    { name: 'Talaba', users: 3247, perms: 'O\'qish hujjatlari', color: '#94A3B8' },
  ];
  const integrations = [
    { name: 'HEMIS', desc: 'Oliy ta\'lim yagona axborot tizimi', status: 'Ulangan', icon: 'graduation', color: '#2DB976' },
    { name: 'Click / Payme', desc: 'Onlayn to\'lov tizimlari', status: 'Ulangan', icon: 'wallet', color: '#3B82F6' },
    { name: 'Telegram Bot', desc: 'Talabalar va ota-onalar uchun', status: 'Ulangan', icon: 'mail', color: '#06B6D4' },
    { name: 'MyID', desc: 'Raqamli identifikatsiya', status: 'Ulangan', icon: 'shield', color: '#10B981' },
    { name: 'E-Imzo', desc: 'Elektron raqamli imzo', status: 'Sozlash', icon: 'edit', color: '#F59E0B' },
    { name: 'SMS shlyuz', desc: 'Ommaviy SMS yuborish', status: 'Ulangan', icon: 'mail', color: '#0EA5E9' },
    { name: 'Google Workspace', desc: 'Pochta va kalendar', status: 'O\'chiq', icon: 'mail', color: '#94A3B8' },
    { name: 'Moodle', desc: 'Distant ta\'lim platformasi', status: 'Ulangan', icon: 'laptop', color: '#8B5CF6' },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {[['general','Umumiy'],['roles','Ro\'llar va ruxsatlar'],['integrations','Integratsiyalar'],['branches','Filiallar'],['audit','Audit jurnali']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${tab === v ? '#2DB976' : 'transparent'}`, marginBottom: -1, fontSize: 13.5, fontFamily: 'inherit', color: tab === v ? '#2DB976' : '#64748B', fontWeight: tab === v ? 600 : 500 }}>{l}</button>
        ))}
      </div>

      {tab === 'general' && (
        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={20}>
            <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600 }}>Universitet ma'lumotlari</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="To'liq nom" defaultValue="Navoiy innovatsiyalar universiteti" />
              <Input label="Qisqa nom" defaultValue="NIU" />
              <Input label="Rektor" defaultValue="Ibragimov O.M." />
              <Input label="Litsenziya raqami" defaultValue="LS-2019-0847" />
            </div>
          </Card>
          <Card padding={20}>
            <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600 }}>Tizim sozlamalari</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Ikki bosqichli autentifikatsiya', 'Barcha adminlar uchun majburiy', true],
                ['Email bildirishnomalari', 'Muhim voqealar haqida xabar', true],
                ['Avtomatik rezerv nusxa', 'Har kuni 03:00 da', true],
                ['Dark mode', 'Foydalanuvchilar uchun yoqish', false],
              ].map(([l, d, v], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: '#0F172A' }}>{l}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{d}</div>
                  </div>
                  <Toggle on={v} onChange={() => {}} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'roles' && (
        <Card padding={0}>
          <div style={{ padding: 18, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Ro'llar ({roles.length})</div>
            <div style={{ flex: 1 }} />
            <Button variant="primary" size="sm" icon="plus">Yangi ro'l</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['Ro\'l','Foydalanuvchilar','Ruxsatlar',''].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {roles.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, background: r.color }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontSize: 14, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{r.users.toLocaleString()}</td>
                  <td style={{ padding: '14px', fontSize: 13, color: '#64748B' }}>{r.perms}</td>
                  <td style={{ padding: '14px', textAlign: 'right' }}><IconButton icon="edit" label="Tahrirlash" size={28} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'integrations' && (
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {integrations.map((it, i) => (
            <Card key={i} padding={18}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: it.color ? it.color + '20' : '#F1F5F9', color: it.color || '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={it.icon} size={20} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>{it.desc}</div>
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant={it.status === 'Ulangan' ? 'success' : it.status === 'Sozlash' ? 'warning' : 'neutral'} dot>{it.status}</Badge>
                <button style={{ background: 'none', border: 'none', color: '#2DB976', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Sozlamalar →</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'branches' && (
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {[
            { name: 'Navoiy (bosh)', addr: 'Navoiy, Galaba shoh ko\'chasi, 27', students: 3247, teachers: 312, main: true },
            { name: 'Zarafshon filiali', addr: 'Zarafshon, Mustaqillik, 5', students: 842, teachers: 68 },
            { name: 'Uchquduq filiali', addr: 'Uchquduq, A. Navoiy, 12', students: 487, teachers: 42 },
            { name: 'Qiziltepa filiali', addr: 'Qiziltepa, Yoshlik, 8', students: 326, teachers: 28 },
          ].map((b, i) => (
            <Card key={i} padding={18}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#D1FAE5', color: '#1B7A4E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{b.name.slice(0,2).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#0F172A' }}>{b.name}</div>
                    {b.main && <Badge variant="success">Bosh</Badge>}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{b.addr}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                <div><div style={{ fontSize: 11, color: '#94A3B8' }}>Talabalar</div><div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{b.students.toLocaleString()}</div></div>
                <div><div style={{ fontSize: 11, color: '#94A3B8' }}>O'qituvchilar</div><div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{b.teachers}</div></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>{['Vaqt','Foydalanuvchi','Amal','Obyekt','IP'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['24.04 14:32','Admin','LOGIN','—','192.168.1.42'],
                ['24.04 14:28','Karimov U.B.','UPDATE','Baho STU-2024-0847','10.0.12.5'],
                ['24.04 14:15','Nazarova M.','CREATE','Davomat 301-A','10.0.12.8'],
                ['24.04 13:58','Rektor','SIGN','Buyruq 01-145','192.168.1.10'],
                ['24.04 13:42','Saidov R.','DELETE','Bilet №4 (qayta qo\'shildi)','10.0.12.14'],
                ['24.04 13:20','Xolmatov A.','EXPORT','Kontraktlar.xlsx','10.0.12.22'],
                ['24.04 12:55','Admin','UPDATE','Ro\'l: Dekan','192.168.1.42'],
                ['24.04 11:40','Hasanova D.','CREATE','Topshiriq #4 tayinlash','10.0.12.30'],
              ].map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace' }}>{r[0]}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{r[1]}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: r[2] === 'LOGIN' ? '#EFF6FF' : r[2] === 'DELETE' ? '#FEF2F2' : r[2] === 'CREATE' ? '#ECFDF5' : '#FFFBEB',
                                   color: r[2] === 'LOGIN' ? '#1D4ED8' : r[2] === 'DELETE' ? '#B91C1C' : r[2] === 'CREATE' ? '#1B7A4E' : '#B45309',
                                   padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}>{r[2]}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12.5, color: '#475569' }}>{r[3]}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
};

Object.assign(window, { ForgotPasswordPage, TeacherProfilePage, ExamsPage, LibraryPage, HrPage, OrdersPage, SettingsPage });
