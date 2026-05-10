// ExtraPages.jsx — additional university modules
// Curriculum, Departments, Research, Theses, Scholarship, DMS, Analytics, StudentCabinet, TeacherCabinet

const _ePadCard = { background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 18 };
const _eHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 };

// ============== O'QUV REJALAR (Curriculum) ==============
const CurriculumPage = () => {
  const [direction, setDirection] = React.useState('Axborot tizimlari');
  const [year, setYear] = React.useState('2024-2025');
  const semesters = [
    { sem: 1, course: 1, subjects: [
      { name: 'Matematik analiz 1', credits: 6, type: 'Majburiy', hours: 180, exam: 'Imtihon' },
      { name: 'Lotin tili', credits: 3, type: 'Majburiy', hours: 90, exam: 'Sinov' },
      { name: 'Fizika asoslari', credits: 4, type: 'Majburiy', hours: 120, exam: 'Imtihon' },
      { name: "O'zbek tili", credits: 2, type: 'Majburiy', hours: 60, exam: 'Sinov' },
      { name: 'Jismoniy tarbiya', credits: 1, type: 'Majburiy', hours: 30, exam: 'Sinov' },
    ]},
    { sem: 2, course: 1, subjects: [
      { name: 'Matematik analiz 2', credits: 6, type: 'Majburiy', hours: 180, exam: 'Imtihon' },
      { name: 'Diskret matematika', credits: 5, type: 'Majburiy', hours: 150, exam: 'Imtihon' },
      { name: 'Iqtisodiyot asoslari', credits: 4, type: 'Majburiy', hours: 120, exam: 'Imtihon' },
      { name: 'Dasturlash asoslari', credits: 3, type: 'Tanlov', hours: 90, exam: 'Sinov' },
    ]},
    { sem: 3, course: 2, subjects: [
      { name: 'Algoritmlar va ma\'lumotlar tuzilmasi', credits: 6, type: 'Majburiy', hours: 180, exam: 'Imtihon' },
      { name: 'Ma\'lumotlar bazasi 1', credits: 4, type: 'Majburiy', hours: 120, exam: 'Imtihon' },
      { name: 'Veb-dasturlash asoslari', credits: 5, type: 'Majburiy', hours: 150, exam: 'Imtihon' },
      { name: 'Ishlab chiqarish amaliyoti', credits: 3, type: 'Amaliyot', hours: 90, exam: 'Sinov' },
    ]},
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={_eHeader}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Select value={direction} onChange={setDirection}
            options={['Axborot tizimlari','Iqtisodiyot','Tog\'-kon ishi','Energetika','Pedagogika']} />
          <Select value={year} onChange={setYear}
            options={['2024-2025','2023-2024','2022-2023']} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="upload">Eksport PDF</Button>
          <Button icon="plus">Yangi reja</Button>
        </div>
      </div>

      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: "Yo'nalishlar", v: '5', s: 'faol' },
          { l: 'Jami kreditlar', v: '240', s: '6 yil davomida' },
          { l: 'Majburiy fanlar', v: '52', s: '85% jami' },
          { l: 'Tanlov fanlar', v: '14', s: '15% jami' },
        ].map((s, i) => (
          <div key={i} style={_ePadCard}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{s.l}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {semesters.map((s, i) => {
        const totalCredits = s.subjects.reduce((a, b) => a + b.credits, 0);
        const totalHours = s.subjects.reduce((a, b) => a + b.hours, 0);
        return (
          <div key={i} style={_ePadCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.course}-kurs</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{s.sem}-semestr</div>
              </div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Kreditlar</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1B7A4E', fontVariantNumeric: 'tabular-nums' }}>{totalCredits}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Soatlar</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{totalHours}</div>
                </div>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9' }}>Fan nomi</th>
                  <th style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', width: 100 }}>Turi</th>
                  <th style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', width: 80, textAlign: 'right' }}>Kredit</th>
                  <th style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', width: 80, textAlign: 'right' }}>Soat</th>
                  <th style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', width: 100 }}>Nazorat</th>
                </tr>
              </thead>
              <tbody>
                {s.subjects.map((sub, j) => (
                  <tr key={j} style={{ fontSize: 13.5 }}>
                    <td style={{ padding: '10px', color: '#0F172A', fontWeight: 500, borderBottom: '1px solid #F8FAFC' }}>{sub.name}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #F8FAFC' }}>
                      <Badge variant={sub.type === 'Majburiy' ? 'success' : sub.type === 'Tanlov' ? 'info' : 'warning'}>{sub.type}</Badge>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid #F8FAFC' }}>{sub.credits}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#64748B', borderBottom: '1px solid #F8FAFC' }}>{sub.hours}</td>
                    <td style={{ padding: '10px', fontSize: 12.5, color: '#475569', borderBottom: '1px solid #F8FAFC' }}>{sub.exam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

// ============== KAFEDRALAR ==============
const DepartmentsPage = () => {
  const depts = [
    { name: 'Dasturiy injiniring kafedrasi', faculty: 'Axborot texnologiyalari', head: 'prof. Tursunov R.M.', staff: 24, students: 412, subjects: 8, color: '#2DB976' },
    { name: 'Axborot tizimlari kafedrasi', faculty: 'Axborot texnologiyalari', head: 'prof. Saidov A.B.', staff: 31, students: 567, subjects: 6, color: '#3B82F6' },
    { name: 'Kompyuter tarmoqlari kafedrasi', faculty: 'Axborot texnologiyalari', head: 'dots. Karimov F.X.', staff: 22, students: 389, subjects: 5, color: '#F59E0B' },
    { name: 'Iqtisodiyot nazariyasi kafedrasi', faculty: 'Iqtisodiyot', head: 'prof. Yusupova M.K.', staff: 28, students: 445, subjects: 7, color: '#8B5CF6' },
    { name: 'Moliya va kredit kafedrasi', faculty: 'Iqtisodiyot', head: 'dots. Nazarov H.S.', staff: 18, students: 298, subjects: 5, color: '#EC4899' },
    { name: 'Tog\'-kon texnologiyalari kafedrasi', faculty: 'Tog\'-kon ishi', head: 'prof. Ergasheva D.N.', staff: 26, students: 412, subjects: 9, color: '#06B6D4' },
    { name: 'Energetika kafedrasi', faculty: 'Energetika', head: 'dots. Hasanov B.O.', staff: 14, students: 234, subjects: 4, color: '#EF4444' },
    { name: 'Pedagogika kafedrasi', faculty: 'Pedagogika', head: 'dots. Qodirova L.S.', staff: 12, students: 198, subjects: 3, color: '#10B981' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={_eHeader}>
        <div style={{ position: 'relative', width: 320 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
            <Icon name="search" size={15} />
          </span>
          <input placeholder="Kafedra qidirish…" style={{ width: '100%', height: 38, padding: '0 12px 0 34px',
            border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <Button icon="plus">Yangi kafedra</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
        {depts.map((d, i) => (
          <div key={i} style={{ ..._ePadCard, padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 4, background: d.color }} />
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>{d.faculty}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginTop: 4, lineHeight: 1.3 }}>{d.name}</div>
                </div>
                <IconButton icon="more" size={28} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8FAFB', borderRadius: 8, marginBottom: 12 }}>
                <Avatar initials={d.head.split(' ')[1].slice(0,1) + d.head.split(' ')[2].slice(0,1)} size={32} color="primary" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Mudir</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>{d.head}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { l: 'Xodimlar', v: d.staff },
                  { l: 'Talabalar', v: d.students },
                  { l: 'Fanlar', v: d.subjects },
                ].map((s, j) => (
                  <div key={j} style={{ textAlign: 'center', padding: 8, background: '#F8FAFB', borderRadius: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                    <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============== ILMIY ISHLAR (Research) ==============
const ResearchPage = () => {
  const [tab, setTab] = React.useState('projects');
  const projects = [
    { id: 'IL-2024-08', title: 'Navoiy viloyatida raqamli iqtisodiyot va elektron tijorat rivojlanishi', leader: 'prof. Saidov A.B.', dept: 'Iqtisodiyot nazariyasi', team: 6, fund: 250_000_000, fundCur: 'UZS', start: '01.2024', end: '12.2026', status: 'Davom etmoqda', progress: 35 },
    { id: 'IL-2024-12', title: 'Sun\'iy intellekt asosida talabalar o\'zlashtirishini bashorat qilish', leader: 'dots. Karimov F.X.', dept: 'Axborot tizimlari', team: 4, fund: 180_000_000, fundCur: 'UZS', start: '03.2024', end: '06.2025', status: 'Davom etmoqda', progress: 62 },
    { id: 'IL-2023-21', title: "Tog'-kon sanoatida energiya samaradorligini oshirish texnologiyalari", leader: 'dots. Nazarov H.S.', dept: 'Tog\'-kon texnologiyalari', team: 8, fund: 420_000_000, fundCur: 'UZS', start: '01.2023', end: '12.2025', status: 'Davom etmoqda', progress: 78 },
    { id: 'IL-2023-05', title: 'Smart-kampus: IoT asosida universitet infrastrukturasini boshqarish', leader: 'prof. Yusupova M.K.', dept: 'Dasturiy injiniring', team: 5, fund: 160_000_000, fundCur: 'UZS', start: '02.2023', end: '02.2025', status: 'Yakunlandi', progress: 100 },
  ];
  const publications = [
    { title: 'Digital economy adoption in Central Asia: 5-year cohort study', journal: 'Journal of Economic Studies', year: 2024, type: 'Q1 Scopus', authors: 'Saidov A.B., Tursunov R.M., et al.', cite: 12 },
    { title: 'Dasturlash fanlarini o\'qitishda zamonaviy metodlar', journal: 'NIU Ilmiy axborotnomasi', year: 2024, type: 'OAK', authors: 'Nazarov H.S.', cite: 3 },
    { title: 'Predictive analytics in higher education: 18-month study', journal: 'Computers & Education', year: 2023, type: 'Q1 Scopus', authors: 'Karimov F.X., Hasanov B.O.', cite: 47 },
    { title: 'Tog\'-kon sanoatida avtomatlashtirish tizimlari', journal: 'Texnika va texnologiya', year: 2023, type: 'OAK', authors: 'Yusupova M.K., Qodirova L.S.', cite: 8 },
  ];
  const tabs = [
    { id: 'projects', l: 'Loyihalar', n: projects.length },
    { id: 'pubs', l: 'Publikatsiyalar', n: publications.length },
    { id: 'grants', l: 'Grantlar', n: 6 },
    { id: 'conf', l: 'Konferentsiyalar', n: 12 },
  ];
  const fmt = (n) => n.toLocaleString('ru-RU');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Faol loyihalar', v: '14', s: '+3 yil', col: '#2DB976' },
          { l: 'Jami moliyalashuv', v: '2.4 mlrd', s: 'so\'m', col: '#3B82F6' },
          { l: '2024 publikatsiyalar', v: '47', s: '12 Q1/Q2', col: '#F59E0B' },
          { l: 'Hirsh indeksi (jami)', v: '23.4', s: 'kafedra o\'rtacha', col: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} style={_ePadCard}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: s.col + '15', color: s.col,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon name="chart" size={18} />
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{s.l}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{s.s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E2E8F0' }}>
        {tabs.map(tt => (
          <button key={tt.id} onClick={() => setTab(tt.id)}
            style={{ padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                     fontSize: 13, fontFamily: 'inherit', fontWeight: tab === tt.id ? 600 : 500,
                     color: tab === tt.id ? '#0F172A' : '#64748B',
                     borderBottom: `2px solid ${tab === tt.id ? '#2DB976' : 'transparent'}`,
                     marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {tt.l}
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 999,
                           background: tab === tt.id ? '#ECFDF5' : '#F1F5F9',
                           color: tab === tt.id ? '#1B7A4E' : '#64748B' }}>{tt.n}</span>
          </button>
        ))}
      </div>

      {tab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map((p, i) => (
            <div key={i} style={_ePadCard}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1B7A4E', background: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>{p.id}</span>
                    <Badge variant={p.status === 'Yakunlandi' ? 'neutral' : 'success'} dot>{p.status}</Badge>
                    <span style={{ fontSize: 11.5, color: '#64748B' }}>{p.start} → {p.end}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, marginBottom: 8 }}>{p.title}</div>
                  <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: '#64748B' }}>
                    <span><b style={{ color: '#0F172A' }}>{p.leader}</b> · {p.dept}</span>
                    <span>{p.team} ishtirokchi</span>
                    <span>{fmt(p.fund)} {p.fundCur}</span>
                  </div>
                </div>
                <div style={{ width: 140, textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{p.progress}%</div>
                  <div style={{ height: 6, background: '#F1F5F9', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${p.progress}%`, height: '100%', background: p.progress === 100 ? '#94A3B8' : '#2DB976' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'pubs' && (
        <div style={_ePadCard}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9' }}>Maqola</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9' }}>Jurnal</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9', width: 100 }}>Tur</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9', width: 80, textAlign: 'right' }}>Yil</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9', width: 80, textAlign: 'right' }}>Iqtibos</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((p, i) => (
                <tr key={i} style={{ fontSize: 13 }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #F8FAFC' }}>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{p.title}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3 }}>{p.authors}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#475569', borderBottom: '1px solid #F8FAFC' }}>{p.journal}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #F8FAFC' }}>
                    <Badge variant={p.type.includes('Q1') ? 'success' : p.type.includes('OAK') ? 'info' : 'neutral'}>{p.type}</Badge>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#64748B', borderBottom: '1px solid #F8FAFC' }}>{p.year}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#0F172A', borderBottom: '1px solid #F8FAFC' }}>{p.cite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(tab === 'grants' || tab === 'conf') && (
        <div style={_ePadCard}>
          <EmptyState icon="doc" title={tab === 'grants' ? 'Grantlar ro\'yxati' : 'Konferentsiyalar'}
            hint="Yaqinda qo'shiladi. Hozircha demo rejimda." action={<Button icon="plus">Yangi qo'shish</Button>} />
        </div>
      )}
    </div>
  );
};

// ============== DIPLOM ISHLARI ==============
const ThesesPage = () => {
  const theses = [
    { id: 'DIP-24-001', student: 'Karimov Sherzod Rashidovich', topic: 'Navoiy viloyatida raqamli iqtisodiyot rivojlanishining iqtisodiy samarasi', supervisor: 'prof. Yusupova M.K.', stage: 'Himoyaga ruxsat', defense: '15.06.2024', grade: null, color: '#2DB976' },
    { id: 'DIP-24-002', student: 'Aliyeva Nilufar Abdullayevna', topic: "Mashina o'rganish algoritmlari yordamida talabalar muvaffaqiyatini bashorat qilish", supervisor: 'dots. Karimov F.X.', stage: 'Tahrirlash', defense: '20.06.2024', grade: null, color: '#3B82F6' },
    { id: 'DIP-24-003', student: 'Tursunov Bekzod Sobirovich', topic: 'Korxonalarni boshqarishda CRM tizimlarining samaradorligi', supervisor: 'prof. Saidov A.B.', stage: 'Birinchi sharx', defense: '22.06.2024', grade: null, color: '#F59E0B' },
    { id: 'DIP-24-004', student: 'Yusupova Madina Bahodirovna', topic: "Tog'-kon korxonalarida xavfsizlik tizimlarini avtomatlashtirish", supervisor: 'dots. Qodirova L.S.', stage: 'Himoyaga ruxsat', defense: '15.06.2024', grade: null, color: '#2DB976' },
    { id: 'DIP-23-187', student: 'Nazarov Sardor Mahmudovich', topic: 'Energetika sohasida quyosh panellarini joriy etish samaradorligi', supervisor: 'prof. Ergasheva D.N.', stage: 'Himoyalandi', defense: '24.05.2023', grade: 92, color: '#94A3B8' },
    { id: 'DIP-23-156', student: 'Mirzayeva Sevinch Nematovna', topic: 'Pedagogik faoliyatda raqamli vositalar samaradorligi', supervisor: 'dots. Hasanov B.O.', stage: 'Himoyalandi', defense: '20.05.2023', grade: 87, color: '#94A3B8' },
  ];
  const [filter, setFilter] = React.useState('Barchasi');
  const filtered = filter === 'Barchasi' ? theses : theses.filter(t => t.stage === filter);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={_eHeader}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: '#F1F5F9', borderRadius: 8 }}>
          {['Barchasi', 'Birinchi sharx', 'Tahrirlash', 'Himoyaga ruxsat', 'Himoyalandi'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                       background: filter === f ? '#fff' : 'transparent',
                       color: filter === f ? '#0F172A' : '#64748B',
                       fontSize: 12.5, fontWeight: filter === f ? 600 : 500, fontFamily: 'inherit',
                       boxShadow: filter === f ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>{f}</button>
          ))}
        </div>
        <Button icon="plus">Yangi diplom</Button>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {filtered.map((t, i) => (
          <div key={i} style={{ ..._ePadCard, padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 3, background: t.color }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4 }}>{t.id}</span>
                <Badge variant={t.stage === 'Himoyalandi' ? 'neutral' : t.stage === 'Himoyaga ruxsat' ? 'success' : t.stage === 'Tahrirlash' ? 'warning' : 'info'} dot>{t.stage}</Badge>
                {t.grade && <Badge variant="success">Baho: {t.grade}/100</Badge>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, marginBottom: 10 }}>{t.topic}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Avatar initials={t.student.split(' ')[0][0] + t.student.split(' ')[1][0]} size={28} color="primary" />
                <div style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 500 }}>{t.student}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748B' }}>
                <span>Rahbar: <b style={{ color: '#475569' }}>{t.supervisor}</b></span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={11} /> {t.defense}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============== STIPENDIYA ==============
const ScholarshipPage = () => {
  const months = ['Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr', 'Yanvar', 'Fevral'];
  const types = [
    { name: 'Davlat stipendiyasi', count: 1247, amount: 1_283_400, total: 1_600_000_000, color: '#2DB976' },
    { name: 'Oshirilgan stipendiya', count: 234, amount: 1_540_080, total: 360_000_000, color: '#3B82F6' },
    { name: 'Prezident stipendiyasi', count: 12, amount: 4_278_000, total: 51_300_000, color: '#F59E0B' },
    { name: 'Nomli stipendiya', count: 28, amount: 2_566_800, total: 71_900_000, color: '#8B5CF6' },
  ];
  const recipients = Array.from({ length: 8 }, (_, i) => {
    const s = (window.STUDENTS || [])[i] || { name: { full: 'Talaba ' + i, initials: 'TT' }, group: '301-A', faculty: 'Axborot texnologiyalari' };
    return { ...s, type: types[i % types.length].name, amount: types[i % types.length].amount, gpa: (3.5 + (i*0.07) % 1.5).toFixed(2) };
  });
  const fmt = (n) => n.toLocaleString('ru-RU');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={_eHeader}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Select value="Fevral 2025" onChange={() => {}} options={months.map(m => m + ' 2025')} />
          <Select value="Barcha fakultet" onChange={() => {}} options={['Barcha fakultet', ...(window.FACULTIES || [])]} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="upload">Hisobot</Button>
          <Button icon="check">To'lovlarni hisoblash</Button>
        </div>
      </div>

      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {types.map((t, i) => (
          <div key={i} style={{ ..._ePadCard, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: t.color }} />
            <div style={{ paddingLeft: 8 }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{t.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{t.count} <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>talaba</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11.5, color: '#64748B' }}>
                <span>Bir kishiga</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{fmt(t.amount)} so'm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11.5, color: '#64748B' }}>
                <span>Oylik jami</span>
                <span style={{ color: t.color, fontWeight: 700 }}>{fmt(t.total)} so'm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={_ePadCard}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Stipendiya oluvchilar</div>
          <Badge variant="success">{recipients.length} ta</Badge>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #F1F5F9' }}>Talaba</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #F1F5F9' }}>Guruh</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #F1F5F9' }}>Stipendiya turi</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #F1F5F9', textAlign: 'right' }}>GPA</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #F1F5F9', textAlign: 'right' }}>Miqdori</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #F1F5F9', width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {recipients.map((r, i) => (
              <tr key={i} style={{ fontSize: 13 }}>
                <td style={{ padding: '10px', borderBottom: '1px solid #F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={r.name.initials} size={30} color="primary" />
                    <span style={{ fontWeight: 500, color: '#0F172A' }}>{r.name.full}</span>
                  </div>
                </td>
                <td style={{ padding: '10px', color: '#475569', borderBottom: '1px solid #F8FAFC' }}>{r.group}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #F8FAFC' }}>
                  <span style={{ fontSize: 12, color: '#475569' }}>{r.type}</span>
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#1B7A4E', borderBottom: '1px solid #F8FAFC' }}>{r.gpa}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#0F172A', borderBottom: '1px solid #F8FAFC' }}>{fmt(r.amount)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #F8FAFC', textAlign: 'center' }}>
                  <IconButton icon="more" size={28} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============== HUJJAT AYLANISHI (DMS) ==============
const DmsPage = () => {
  const [tab, setTab] = React.useState('inbox');
  const docs = [
    { id: 'KH-2024-1456', from: 'Vazirlik', subj: 'Sessiya rejasi tasdiqlash haqida', date: '23.04.2026', priority: 'Yuqori', status: 'Yangi', deadline: '25.04.2026' },
    { id: 'KH-2024-1455', from: 'Rektorat', subj: 'Yangi o\'qituvchi qabul qilish to\'g\'risida', date: '22.04.2026', priority: 'O\'rta', status: 'Ko\'rib chiqilmoqda', deadline: '30.04.2026' },
    { id: 'KH-2024-1454', from: 'Hokimiyat', subj: 'Yoshlar siyosati bo\'yicha hisobot', date: '22.04.2026', priority: 'Yuqori', status: 'Bajarilmoqda', deadline: '28.04.2026' },
    { id: 'KH-2024-1453', from: 'Buxgalteriya', subj: 'Aprel oyi xarajatlar smetasi', date: '21.04.2026', priority: 'O\'rta', status: 'Imzolangan', deadline: '—' },
    { id: 'KH-2024-1452', from: 'Akademik kengash', subj: 'Yangi o\'quv reja muhokamasi', date: '20.04.2026', priority: 'Past', status: 'Imzolangan', deadline: '—' },
  ];
  const tabs = [
    { id: 'inbox', l: 'Kiruvchi', n: 12, icon: 'inbox' },
    { id: 'outbox', l: 'Chiquvchi', n: 8, icon: 'mail' },
    { id: 'draft', l: 'Loyihalar', n: 3, icon: 'edit' },
    { id: 'archive', l: 'Arxiv', n: 247, icon: 'briefcase' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={_eHeader}>
        <div style={{ position: 'relative', width: 320 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}><Icon name="search" size={15} /></span>
          <input placeholder="Hujjat raqami yoki mavzu…" style={{ width: '100%', height: 38, padding: '0 12px 0 34px',
            border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="filter">Filtr</Button>
          <Button icon="plus">Yangi hujjat</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>
        <div style={{ ..._ePadCard, padding: 8, height: 'fit-content' }}>
          {tabs.map(tt => (
            <button key={tt.id} onClick={() => setTab(tt.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                       border: 'none', borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
                       background: tab === tt.id ? '#ECFDF5' : 'transparent',
                       color: tab === tt.id ? '#1B7A4E' : '#475569', fontWeight: tab === tt.id ? 600 : 500,
                       cursor: 'pointer', textAlign: 'left' }}>
              <Icon name={tt.icon} size={15} />
              <span style={{ flex: 1 }}>{tt.l}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: tab === tt.id ? '#1B7A4E' : '#94A3B8',
                             background: tab === tt.id ? 'rgba(45,185,118,.15)' : '#F1F5F9',
                             padding: '1px 7px', borderRadius: 999 }}>{tt.n}</span>
            </button>
          ))}
        </div>

        <div style={{ ..._ePadCard, padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>Raqami</th>
                <th style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>Kimdan</th>
                <th style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>Mavzu</th>
                <th style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>Holat</th>
                <th style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>Muddat</th>
                <th style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={i} className="row-hover" style={{ fontSize: 13, cursor: 'pointer' }}>
                  <td style={{ padding: '14px', borderBottom: '1px solid #F8FAFC' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 12.5 }}>{d.id}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{d.date}</div>
                  </td>
                  <td style={{ padding: '14px', color: '#475569', borderBottom: '1px solid #F8FAFC' }}>{d.from}</td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #F8FAFC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {d.priority === 'Yuqori' && <span style={{ width: 6, height: 6, borderRadius: 999, background: '#EF4444' }} />}
                      <span style={{ fontWeight: 500, color: '#0F172A' }}>{d.subj}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #F8FAFC' }}>
                    <Badge variant={d.status === 'Yangi' ? 'info' : d.status === 'Imzolangan' ? 'success' : d.status === 'Bajarilmoqda' ? 'warning' : 'neutral'} dot>{d.status}</Badge>
                  </td>
                  <td style={{ padding: '14px', color: d.deadline === '—' ? '#94A3B8' : '#475569', fontSize: 12.5, borderBottom: '1px solid #F8FAFC' }}>{d.deadline}</td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #F8FAFC' }}>
                    <IconButton icon="more" size={28} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============== ANALYTICS ==============
const AnalyticsPage = () => {
  // simple svg charts
  const months = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
  const enroll = [120, 135, 142, 158, 167, 145, 132, 178, 245, 287, 234, 198];
  const revenue = [2.1, 2.3, 2.5, 2.8, 3.1, 2.7, 2.4, 3.2, 4.5, 5.2, 4.3, 3.6]; // mlrd
  const fakultas = [
    { f: 'Axborot texnologiyalari', count: 1248, color: '#2DB976' },
    { f: 'Iqtisodiyot', count: 612, color: '#3B82F6' },
    { f: 'Tog\'-kon ishi', count: 487, color: '#F59E0B' },
    { f: 'Energetika', count: 423, color: '#8B5CF6' },
    { f: 'Pedagogika', count: 287, color: '#EC4899' },
    { f: 'Boshqa', count: 190, color: '#94A3B8' },
  ];
  const totalStu = fakultas.reduce((a,b) => a + b.count, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPIs */}
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Jami talabalar', v: '3,247', d: '+8.2%', dColor: '#1B7A4E', icon: 'users' },
          { l: 'Yillik tushum', v: '34.7 mlrd', d: '+14.5%', dColor: '#1B7A4E', icon: 'chart', s: "so'm" },
          { l: 'O\'qituvchilar', v: '247', d: '+3', dColor: '#1B7A4E', icon: 'briefcase' },
          { l: 'O\'rtacha GPA', v: '3.84', d: '−0.04', dColor: '#B91C1C', icon: 'edit' },
        ].map((k, i) => (
          <div key={i} style={_ePadCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ECFDF5', color: '#1B7A4E',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={k.icon} size={18} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: k.dColor }}>{k.d}</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 14 }}>{k.l}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
              {k.v}{k.s && <span style={{ fontSize: 13, fontWeight: 500, color: '#64748B', marginLeft: 4 }}>{k.s}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Enrollment + Revenue charts */}
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={_ePadCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Talabalar qabuli</div>
          <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>Oylar bo'yicha · 2024-2025</div>
          <svg viewBox="0 0 600 240" style={{ width: '100%', height: 240, marginTop: 14 }}>
            {[0, 60, 120, 180, 240].map((y, i) => (
              <line key={i} x1="40" x2="590" y1={y + 10} y2={y + 10} stroke="#F1F5F9" />
            ))}
            {[300, 200, 100, 0].map((v, i) => (
              <text key={i} x="32" y={i * 60 + 14} fontSize="9" fill="#94A3B8" textAnchor="end" fontFamily="Inter">{v}</text>
            ))}
            {(() => {
              const max = Math.max(...enroll);
              const pts = enroll.map((v, i) => `${40 + i * 46},${230 - (v / max) * 200}`).join(' ');
              return <>
                <polyline points={pts} fill="none" stroke="#2DB976" strokeWidth="2.5" />
                <polygon points={`40,230 ${pts} ${40 + 11 * 46},230`} fill="rgba(45,185,118,0.12)" />
                {enroll.map((v, i) => (
                  <circle key={i} cx={40 + i * 46} cy={230 - (v / max) * 200} r="3.5" fill="#2DB976" />
                ))}
              </>;
            })()}
            {months.map((m, i) => (
              <text key={i} x={40 + i * 46} y="248" fontSize="9.5" fill="#64748B" textAnchor="middle" fontFamily="Inter">{m}</text>
            ))}
          </svg>
        </div>

        <div style={_ePadCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Moliyaviy tushum</div>
          <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>Oylar bo'yicha · mlrd so'm</div>
          <svg viewBox="0 0 600 240" style={{ width: '100%', height: 240, marginTop: 14 }}>
            {[0, 60, 120, 180, 240].map((y, i) => (
              <line key={i} x1="40" x2="590" y1={y + 10} y2={y + 10} stroke="#F1F5F9" />
            ))}
            {[6, 4, 2, 0].map((v, i) => (
              <text key={i} x="32" y={i * 60 + 14} fontSize="9" fill="#94A3B8" textAnchor="end" fontFamily="Inter">{v}</text>
            ))}
            {(() => {
              const max = 6;
              return revenue.map((v, i) => {
                const h = (v / max) * 200;
                return <rect key={i} x={45 + i * 46} y={230 - h} width="32" height={h} fill="#3B82F6" rx="3" />;
              });
            })()}
            {months.map((m, i) => (
              <text key={i} x={61 + i * 46} y="248" fontSize="9.5" fill="#64748B" textAnchor="middle" fontFamily="Inter">{m}</text>
            ))}
          </svg>
        </div>
      </div>

      {/* Faculty breakdown donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 14 }}>
        <div style={_ePadCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Fakultetlar bo'yicha taqsimot</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
            {(() => {
              const r = 60, c = 2 * Math.PI * r;
              let off = 0;
              return (
                <svg viewBox="0 0 160 160" style={{ width: 160, height: 160 }}>
                  {fakultas.map((f, i) => {
                    const len = (f.count / totalStu) * c;
                    const dash = `${len} ${c - len}`;
                    const el = <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={f.color} strokeWidth="22"
                      strokeDasharray={dash} strokeDashoffset={-off} transform="rotate(-90 80 80)" />;
                    off += len;
                    return el;
                  })}
                  <text x="80" y="78" fontSize="22" fontWeight="700" fill="#0F172A" textAnchor="middle" fontFamily="Inter">{(totalStu/1000).toFixed(1)}k</text>
                  <text x="80" y="96" fontSize="10" fill="#64748B" textAnchor="middle" fontFamily="Inter">talaba</text>
                </svg>
              );
            })()}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {fakultas.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: f.color }} />
                  <span style={{ flex: 1, color: '#475569' }}>{f.f}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#0F172A' }}>{f.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={_ePadCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Eng yaxshi guruhlar (GPA)</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { g: '301-A · Axborot tizimlari', gpa: 4.32, n: 28 },
              { g: '402-B · Iqtisodiyot', gpa: 4.18, n: 24 },
              { g: '203-A · Dasturiy injiniring', gpa: 4.07, n: 30 },
              { g: '305-V · Energetika', gpa: 3.95, n: 26 },
              { g: '404-A · Tog\'-kon ishi', gpa: 3.89, n: 22 },
            ].map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: i < 3 ? '#FFFBEB' : '#F1F5F9',
                              color: i < 3 ? '#B45309' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: 12 }}>#{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{g.g}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{g.n} talaba</div>
                </div>
                <div style={{ width: 100, height: 6, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${(g.gpa/5)*100}%`, height: '100%', background: '#2DB976' }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1B7A4E', fontVariantNumeric: 'tabular-nums', minWidth: 40, textAlign: 'right' }}>{g.gpa.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== TALABA KABINETI ==============
const StudentCabinetPage = () => {
  const me = (window.STUDENTS || [])[0] || { name: { full: 'Karimov Sherzod', initials: 'KS' }, group: '301-A', course: 3, faculty: 'Axborot texnologiyalari', gpa: 3.92 };
  const today = [
    { time: '08:30', subj: 'Algoritmlar', room: 'A-204', teacher: 'prof. Tursunov R.M.', type: 'Ma\'ruza' },
    { time: '10:10', subj: 'Ma\'lumotlar bazasi', room: 'B-115', teacher: 'dots. Saidov A.B.', type: 'Amaliyot' },
    { time: '12:00', subj: 'Veb-dasturlash', room: 'A-301', teacher: 'dots. Nazarov H.S.', type: 'Ma\'ruza' },
    { time: '13:40', subj: 'Tarmoqlar', room: 'C-208', teacher: 'dots. Hasanov B.O.', type: 'Laboratoriya' },
  ];
  const grades = [
    { subj: 'Algoritmlar', grade: 92, status: 'A\'lo' },
    { subj: 'Ma\'lumotlar bazasi', grade: 88, status: 'Yaxshi' },
    { subj: 'Veb-dasturlash', grade: 95, status: 'A\'lo' },
    { subj: 'Tarmoqlar', grade: 78, status: 'Yaxshi' },
    { subj: 'Iqtisodiyot nazariyasi', grade: 85, status: 'Yaxshi' },
    { subj: 'Ishlab chiqarish amaliyoti', grade: 91, status: 'A\'lo' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #2DB976 0%, #1B7A4E 100%)', borderRadius: 16, padding: 26, color: '#fff', display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700 }}>{me.name.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>Xush kelibsiz</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{me.name.full}</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{me.faculty} · {me.course}-kurs · {me.group} guruh · ID: {me.id || 'STU-2024-0847'}</div>
        </div>
        <div style={{ display: 'flex', gap: 30 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{me.gpa}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>O'rtacha GPA</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>147</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Kreditlar</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>94%</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Davomat</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { icon: 'doc', label: 'Spravka olish', color: '#2DB976' },
          { icon: 'edit', label: 'Test topshirish', color: '#3B82F6' },
          { icon: 'doc', label: 'To\'lov tarixi', color: '#F59E0B' },
          { icon: 'mail', label: 'Xabarlar', color: '#8B5CF6', n: 3 },
        ].map((a, i) => (
          <button key={i} style={{ ..._ePadCard, cursor: 'pointer', border: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'inherit', textAlign: 'left' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: a.color + '15', color: a.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Icon name={a.icon} size={20} />
              {a.n && <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 999,
                background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{a.n}</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{a.label}</div>
          </button>
        ))}
      </div>

      <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        {/* Today schedule */}
        <div style={_ePadCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Bugungi dars jadvali</div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>Chorshanba, 24 aprel 2026</div>
            </div>
            <Badge variant="success" dot>4 ta dars</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {today.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12,
                                     background: i === 0 ? '#ECFDF5' : '#F8FAFB', borderRadius: 10,
                                     border: i === 0 ? '1px solid #A7F3D0' : '1px solid transparent' }}>
                <div style={{ width: 56, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{c.time}</div>
                </div>
                <div style={{ width: 1, height: 36, background: '#E2E8F0' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{c.subj}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{c.teacher} · {c.room}</div>
                </div>
                <Badge variant={c.type === 'Ma\'ruza' ? 'info' : c.type === 'Amaliyot' ? 'success' : 'warning'}>{c.type}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent grades */}
        <div style={_ePadCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 14 }}>Joriy semestr baholari</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {grades.map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{g.subj}</div>
                </div>
                <div style={{ width: 80, height: 4, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${g.grade}%`, height: '100%', background: g.grade >= 90 ? '#2DB976' : g.grade >= 80 ? '#3B82F6' : '#F59E0B' }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums', minWidth: 30, textAlign: 'right' }}>{g.grade}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== O'QITUVCHI KABINETI ==============
const TeacherCabinetPage = () => {
  const me = (window.TEACHERS || [])[0] || { name: { full: 'prof. Tursunov R.M.', initials: 'TR' }, dept: 'Dasturiy injiniring kafedrasi', position: 'Professor' };
  const today = [
    { time: '08:30', subj: 'Algoritmlar', group: '301-A', room: 'A-204', students: 28 },
    { time: '10:10', subj: 'Algoritmlar', group: '302-B', room: 'A-204', students: 26 },
    { time: '13:40', subj: 'Ma\'lumotlar bazasi', group: '203-A', room: 'A-208', students: 30 },
  ];
  const tasks = [
    { txt: 'Algoritmlar — 301-A baholar (oraliq nazorat)', due: 'Bugun', priority: 'high' },
    { txt: 'Diplom rahbarligi — Aliyeva N.A. tahriri', due: 'Ertaga', priority: 'med' },
    { txt: 'Ilmiy maqola tahriri (CACM)', due: '3 kun', priority: 'low' },
    { txt: 'Kafedra yig\'ilishi — chorshanba 14:00', due: '5 kun', priority: 'low' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)', borderRadius: 16, padding: 26, color: '#fff', display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700 }}>{me.name.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>O'qituvchi kabineti</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{me.name.full}</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{me.dept} · {me.position} · 23 yil tajriba</div>
        </div>
        <div style={{ display: 'flex', gap: 30 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>3</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Bugungi darslar</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>184</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Talabalar</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>14</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Vazifalar</div>
          </div>
        </div>
      </div>

      <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={_ePadCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Bugungi dars jadvali</div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>Chorshanba, 24 aprel</div>
            </div>
            <Button variant="secondary" size="sm" icon="check">Davomat olish</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {today.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12,
                background: '#F8FAFB', borderRadius: 10 }}>
                <div style={{ width: 56, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{c.time}</div>
                </div>
                <div style={{ width: 1, height: 36, background: '#E2E8F0' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{c.subj}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{c.group} · {c.room} · {c.students} talaba</div>
                </div>
                <Button variant="secondary" size="sm">Boshlash</Button>
              </div>
            ))}
          </div>
        </div>

        <div style={_ePadCard}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 14 }}>Mening vazifalarim</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 8, background: '#F8FAFB' }}>
                <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 999,
                              background: t.priority === 'high' ? '#EF4444' : t.priority === 'med' ? '#F59E0B' : '#94A3B8' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.4 }}>{t.txt}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={10} /> {t.due}</div>
                </div>
                <Checkbox checked={false} onChange={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  CurriculumPage, DepartmentsPage, ResearchPage, ThesesPage,
  ScholarshipPage, DmsPage, AnalyticsPage,
  StudentCabinetPage, TeacherCabinetPage,
});
