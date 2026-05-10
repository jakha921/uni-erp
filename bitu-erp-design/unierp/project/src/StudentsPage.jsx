// StudentsPage.jsx — list + profile

const StudentsListPage = ({ onOpen, onAdd }) => {
  const [selected, setSelected] = React.useState(new Set());
  const [search, setSearch] = React.useState('');
  const [faculty, setFaculty] = React.useState('Barchasi');
  const [course, setCourse] = React.useState('Barcha kurslar');
  const [status, setStatus] = React.useState('Barchasi');

  const filtered = STUDENTS.filter(s => {
    if (search && !s.name.full.toLowerCase().includes(search.toLowerCase()) && !s.id.includes(search)) return false;
    if (faculty !== 'Barchasi' && s.faculty !== faculty) return false;
    if (course !== 'Barcha kurslar' && String(s.course) !== course.replace('-kurs','')) return false;
    if (status !== 'Barchasi' && s.status !== status) return false;
    return true;
  });

  return (
    <>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { l: 'Jami talabalar', v: '3,247', d: '+124 bu yil', c: '#2DB976' },
          { l: 'Kunduzgi', v: '2,180', d: '67%', c: '#3B82F6' },
          { l: 'Sirtqi', v: '1,067', d: '33%', c: '#8B5CF6' },
          { l: 'Akademik ta\'tilda', v: '48', d: '1.5%', c: '#F59E0B' },
        ].map((k, i) => (
          <Card key={i} padding={18}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
            <div style={{ marginTop: 6, fontSize: 26, fontWeight: 700, color: k.c, letterSpacing: '-0.02em' }}>{k.v}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{k.d}</div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
              <Icon name="search" size={14} />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="F.I.Sh. yoki ID bo'yicha qidirish…"
              style={{ width: '100%', height: 36, padding: '0 10px 0 32px', border: '1px solid #E2E8F0',
                       borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={faculty} onChange={e => setFaculty(e.target.value)}
            style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
            <option>Barchasi</option>
            {FACULTIES.map(f => <option key={f}>{f}</option>)}
          </select>
          <select value={course} onChange={e => setCourse(e.target.value)}
            style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
            <option>Barcha kurslar</option>
            {[1,2,3,4,5,6].map(c => <option key={c}>{c}-kurs</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
            <option>Barchasi</option>
            <option>Faol</option>
            <option>Akademik ta'til</option>
            <option>Chetlashtirilgan</option>
          </select>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" icon="upload">Eksport</Button>
          <Button variant="primary" size="sm" icon="plus" onClick={onAdd}>Yangi talaba</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFB' }}>
              <th style={{ width: 40, padding: '10px 16px' }}>
                <Checkbox checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={v => setSelected(v ? new Set(filtered.map(s => s.id)) : new Set())} />
              </th>
              {['ID', 'F.I.Sh.', 'Fakultet', 'Guruh', 'Kurs', 'Shakl', 'GPA', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B',
                                      textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => <StudentRow key={s.id} s={s} checked={selected.has(s.id)}
              onCheck={v => { const ns = new Set(selected); v ? ns.add(s.id) : ns.delete(s.id); setSelected(ns); }}
              onClick={() => onOpen?.(s)} />)}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid #F1F5F9' }}>
          <Pagination page={1} total={13} totalRows={3247} />
        </div>
      </Card>
    </>
  );
};

const StudentRow = ({ s, checked, onCheck, onClick }) => {
  const [hover, setHover] = React.useState(false);
  const statusVariant = s.status === 'Faol' ? 'success' : s.status === 'Akademik ta\'til' ? 'warning' : 'error';
  return (
    <tr onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}
      style={{ background: hover ? '#F8FAFB' : '#fff', cursor: 'pointer', transition: 'background 120ms ease' }}>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9' }} onClick={e => e.stopPropagation()}>
        <Checkbox checked={checked} onChange={onCheck} />
      </td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{s.id}</td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={s.name.initials} size={30} color={s.name.isFemale ? 'amber' : 'blue'} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.name.full}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{s.phone}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 13, color: '#334155' }}>{s.faculty}</td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 13, color: '#334155', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{s.group}</td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 13, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{s.course}</td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 13, color: '#334155' }}>{s.eduForm}</td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 13, fontWeight: 600, color: parseFloat(s.gpa) >= 3.5 ? '#1B7A4E' : parseFloat(s.gpa) >= 3 ? '#334155' : '#B45309', fontVariantNumeric: 'tabular-nums' }}>{s.gpa}</td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9' }}><Badge variant={statusVariant} dot>{s.status}</Badge></td>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
        <IconButton icon="more" label="Amallar" size={28} />
      </td>
    </tr>
  );
};

// Profile
const StudentProfilePage = ({ student, onBack }) => {
  const [tab, setTab] = React.useState('main');
  const s = student || STUDENTS[0];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="arrowLeft" size={14} /> Talabalar ro'yxati
        </button>
      </div>

      <Card padding={24} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <Avatar initials={s.name.initials} size={80} color={s.name.isFemale ? 'amber' : 'blue'} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{s.name.full}</h2>
              <Badge variant={s.status === 'Faol' ? 'success' : 'warning'} dot>{s.status}</Badge>
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 14 }}>
              {s.id} · {s.faculty} · {s.direction}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,auto)', gap: '10px 28px', fontSize: 13 }}>
              <InfoPair icon="users" label="Guruh" value={`${s.group}, ${s.course}-kurs`} />
              <InfoPair icon="calendar" label="Tug'ilgan" value={s.birthDate} />
              <InfoPair icon="phone" label="Telefon" value={s.phone} />
              <InfoPair icon="mail" label="Email" value={s.email} />
              <InfoPair icon="briefcase" label="Ta'lim shakli" value={s.eduForm} />
              <InfoPair icon="grid" label="Viloyat" value={s.region} />
              <InfoPair icon="chart" label="GPA" value={s.gpa} />
              <InfoPair icon="doc" label="Kontrakt" value="To'liq to'langan" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
            <Button variant="primary" icon="edit" size="sm">Tahrirlash</Button>
            <Button variant="secondary" icon="doc" size="sm">Ma'lumotnoma</Button>
            <Button variant="secondary" icon="more" size="sm">Ko'proq</Button>
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: '0 20px', borderBottom: '1px solid #E2E8F0' }}>
          <Tabs active={tab} onChange={setTab} tabs={[
            { id: 'main', label: 'Asosiy ma\'lumotlar' },
            { id: 'grades', label: 'O\'zlashtirish', count: 42 },
            { id: 'attendance', label: 'Davomat' },
            { id: 'contract', label: 'Kontrakt' },
            { id: 'docs', label: 'Hujjatlar', count: 8 },
            { id: 'dorm', label: 'TTJ' },
            { id: 'history', label: 'Tarix' },
          ]} />
        </div>

        <div style={{ padding: 24 }}>
          {tab === 'main' && <ProfileMain s={s} />}
          {tab === 'grades' && <ProfileGrades s={s} />}
          {tab === 'attendance' && <ProfileAttendance s={s} />}
          {tab === 'contract' && <ProfileContract s={s} />}
          {tab === 'docs' && <ProfileDocs />}
          {tab === 'dorm' && <ProfileDorm s={s} />}
          {tab === 'history' && <ProfileHistory />}
        </div>
      </Card>
    </>
  );
};

const InfoPair = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
    <span style={{ color: '#94A3B8', marginTop: 2 }}><Icon name={icon} size={14} /></span>
    <div>
      <div style={{ fontSize: 11, color: '#94A3B8' }}>{label}</div>
      <div style={{ fontSize: 13, color: '#1E293B', fontWeight: 500 }}>{value}</div>
    </div>
  </div>
);

const ProfileMain = ({ s }) => (
  <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
    <div>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Shaxsiy ma'lumotlar</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['F.I.O', s.name.full],
          ['Jinsi', s.name.isFemale ? 'Ayol' : 'Erkak'],
          ['Tug\'ilgan sana', s.birthDate],
          ['Millati', 'O\'zbek'],
          ['JShShIR', '3'+String(rnum(s.course*7, 100000000000, 999999999999))],
          ['Pasport', 'AA '+String(rnum(s.course*11, 1000000, 9999999))],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', padding: '10px 12px', background: '#F8FAFB', borderRadius: 8 }}>
            <div style={{ flex: '0 0 160px', fontSize: 12, color: '#64748B' }}>{k}</div>
            <div style={{ flex: 1, fontSize: 13, color: '#1E293B', fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Akademik ma'lumotlar</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Fakultet', s.faculty],
          ['Yo\'nalish', s.direction],
          ['Guruh', s.group],
          ['Kurs', `${s.course}-kurs`],
          ['Qabul yili', `${2026 - s.course}`],
          ['Ta\'lim shakli', s.eduForm],
          ['Kontrakt turi', 'To\'lov-kontrakt'],
          ['Status', s.status],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', padding: '10px 12px', background: '#F8FAFB', borderRadius: 8 }}>
            <div style={{ flex: '0 0 160px', fontSize: 12, color: '#64748B' }}>{k}</div>
            <div style={{ flex: 1, fontSize: 13, color: '#1E293B', fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfileGrades = ({ s }) => {
  const grades = SUBJECTS.slice(0, 8).map((sub, i) => ({
    subject: sub,
    teacher: fullName(i + 201, 0.4).short,
    midterm: rnum(i * 3, 55, 95),
    final: rnum(i * 5, 55, 95),
    rating: rnum(i * 7, 0, 10),
  }));

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <select style={{ height: 34, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
          <option>2025-2026 · 2-semester</option>
          <option>2025-2026 · 1-semester</option>
        </select>
        <div style={{ flex: 1 }} />
        <Badge variant="success" dot>GPA: {s.gpa}</Badge>
        <Button variant="secondary" size="sm" icon="doc">Transkript</Button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8FAFB' }}>
            {['Fan', 'O\'qituvchi', 'Oraliq', 'Yakuniy', 'Reyting', 'Jami', 'Baho'].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B',
                                    textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grades.map((g, i) => {
            const total = g.midterm * 0.3 + g.final * 0.5 + g.rating * 2;
            const mark = total >= 86 ? "A'lo" : total >= 71 ? 'Yaxshi' : total >= 55 ? 'Qoniqarli' : 'Qoniqarsiz';
            const variant = total >= 86 ? 'success' : total >= 71 ? 'info' : total >= 55 ? 'warning' : 'error';
            return (
              <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{g.subject}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155' }}>{g.teacher}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{g.midterm}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{g.final}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{g.rating}/10</td>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{total.toFixed(1)}</td>
                <td style={{ padding: '12px 14px' }}><Badge variant={variant}>{mark}</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ProfileAttendance = ({ s }) => (
  <div>
    <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
      {[
        { l: 'Umumiy soatlar', v: '348', c: '#0F172A' },
        { l: 'Qatnashilgan', v: '312', c: '#1B7A4E' },
        { l: 'Qoldirilgan (uzrli)', v: '14', c: '#F59E0B' },
        { l: 'Qoldirilgan (uzrsiz)', v: '22', c: '#EF4444' },
      ].map((k, i) => (
        <div key={i} style={{ padding: 14, background: '#F8FAFB', borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700, color: k.c, fontVariantNumeric: 'tabular-nums' }}>{k.v}</div>
        </div>
      ))}
    </div>
    <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Oxirgi 14 hafta</h3>
    <Heatmap weeks={14} />
  </div>
);

const ProfileContract = ({ s }) => (
  <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
    <div>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Joriy kontrakt</h3>
      <div style={{ padding: 16, background: '#F8FAFB', borderRadius: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>Kontrakt raqami</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>KNT-2024-0847</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>Yillik summa</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>14,000,000 so'm</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>To'langan</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1B7A4E', fontVariantNumeric: 'tabular-nums' }}>14,000,000 so'm</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>Qoldiq</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>0 so'm</span>
        </div>
        <ProgressBar value={100} showLabel />
        <Badge variant="success" dot style={{ marginTop: 12 }}>To'liq to'langan</Badge>
      </div>
    </div>
    <div>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>To'lov tarixi</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['15.01.2026', '4,500,000', 'Plastik karta'],
          ['10.10.2025', '4,500,000', 'Bank o\'tkazma'],
          ['05.07.2025', '5,000,000', 'Plastik karta'],
        ].map(([d, a, m], i) => (
          <div key={i} style={{ padding: 12, background: '#F8FAFB', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ECFDF5', color: '#1B7A4E',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{a} so'm</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{m} · {d}</div>
            </div>
            <Button variant="ghost" size="sm">Kvitansiya</Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfileDocs = () => (
  <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
    {['Pasport nusxasi', 'Attestat', 'DTM natijasi', '086 tibbiy spravka', 'Harbiy bilet', '3x4 surat', 'Ariza', 'Kontrakt (skan)'].map((d, i) => (
      <div key={i} style={{ padding: 14, border: '1px solid #E2E8F0', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 36, height: 44, borderRadius: 6, background: '#EFF6FF', color: '#3B82F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="doc" size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>PDF · {(Math.random()*2+0.3).toFixed(1)} MB</div>
        </div>
        <IconButton icon="more" label="Amallar" size={28} />
      </div>
    ))}
  </div>
);

const ProfileDorm = ({ s }) => (
  <div style={{ padding: 20, background: '#F8FAFB', borderRadius: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 10, background: '#2DB976', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="briefcase" size={20} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>TTJ-2 · Xona 314</div>
        <div style={{ fontSize: 13, color: '#64748B' }}>4 o'rinli · 3-qavat · Kiritilgan: 01.09.2025</div>
      </div>
    </div>
    <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
      {[
        ['Oylik to\'lov', '350,000 so\'m'],
        ['To\'langan', 'Aprel, 2026'],
        ['Qo\'shni xonadoshlar', '3 kishi'],
      ].map(([k, v]) => (
        <div key={k} style={{ padding: 10, background: '#fff', borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#64748B' }}>{k}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileHistory = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {[
      ['15.04.2026', 'Kontrakt to\'lovi qabul qilindi', 'check', 'success'],
      ['02.02.2026', '2-semester guruhiga o\'tkazildi', 'arrowRight', 'info'],
      ['15.01.2026', '1-semester imtihonlari yakunlandi', 'doc', 'neutral'],
      ['01.09.2025', 'TTJ-2 xona 314 ga kiritildi', 'briefcase', 'info'],
      ['28.08.2025', '3-kursga o\'tkazildi', 'arrowUp', 'success'],
      ['15.07.2025', '1-kurs yakunida GPA: 3.62', 'chart', 'success'],
    ].map(([d, t, i, v], idx) => (
      <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', width: 80, fontVariantNumeric: 'tabular-nums', paddingTop: 8 }}>{d}</div>
        <div style={{ width: 32, height: 32, borderRadius: 999,
                      background: { success: '#ECFDF5', info: '#EFF6FF', neutral: '#F1F5F9' }[v],
                      color: { success: '#1B7A4E', info: '#1D4ED8', neutral: '#475569' }[v],
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={i} size={14} />
        </div>
        <div style={{ flex: 1, padding: '6px 0', fontSize: 13, color: '#1E293B' }}>{t}</div>
      </div>
    ))}
  </div>
);

Object.assign(window, { StudentsListPage, StudentProfilePage });
