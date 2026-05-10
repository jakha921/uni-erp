// MoliyaStore.jsx — finance state, seed data, HEMIS API helper

// ============ SHARED HELPERS ============
// StatGrid — wraps StatCard children in a 4-column responsive grid
const StatGrid = ({ children, cols = 4 }) => (
  <div className={`grid-${cols}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
    {children}
  </div>
);
window.StatGrid = StatGrid;

const HEMIS_API = 'https://student.niiedu.uz/rest';
const HEMIS_TOKEN = 'gehoOdNBAV-DQlAZZaefmb5WCBQQLaox';

async function fetchHemis(endpoint, params = {}) {
  const url = new URL(endpoint.replace(/^\//, ''), HEMIS_API + '/');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${HEMIS_TOKEN}` }
  });
  if (!res.ok) throw new Error('API xatosi: ' + res.status);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Noma'lum xato");
  return json.data;
}

// ============ FORMATTERS ============
const formatMoney = (n) => new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0)) + " so'm";
const formatNum = (n) => new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0));
const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// ============ SEED DATA ============
const FACULTIES = [
  { id: 1, name: "Filologiya va tillarni o'qitish" },
  { id: 13, name: "Aniq, tabiiy va texnik" },
  { id: 14, name: "Iqtisodiyot va axborot texnologiyalari" },
  { id: 18, name: "Ijtimoiy-gumanitar" },
];

const UZBEK_NAMES = [
  ['Karimov', 'Jasur', 'Bahodir o\'g\'li'], ['Rahimov', 'Sardor', 'Anvar o\'g\'li'],
  ['Toshmatov', 'Bekzod', 'Rustam o\'g\'li'], ['Xolmatova', 'Madina', 'Akmal qizi'],
  ['Yusupova', 'Dilnoza', 'Sanjar qizi'], ['Mirzayev', 'Otabek', 'Nodir o\'g\'li'],
  ['Saidova', 'Nilufar', 'Bobur qizi'], ['Abdullayev', 'Aziz', 'Shavkat o\'g\'li'],
  ['Norqulov', 'Jahongir', 'Davron o\'g\'li'], ['Ergasheva', 'Sevara', 'Ulug\'bek qizi'],
  ['Tursunov', 'Akbar', 'Farxod o\'g\'li'], ['Sobirova', 'Gulnora', 'Tohir qizi'],
  ['Qodirov', 'Ravshan', 'Ilxom o\'g\'li'], ['Najmiddinova', 'Shahnoza', 'Murod qizi'],
  ['Hasanov', 'Doniyor', 'Olim o\'g\'li'], ['Ismoilova', 'Marjona', 'Ergash qizi'],
  ['Komilov', 'Sanjarbek', 'Yusuf o\'g\'li'], ['Rashidova', 'Zilola', 'Komil qizi'],
  ['Olimov', 'Bobur', 'Hakim o\'g\'li'], ['Xudoyberdiyeva', 'Mohira', 'Salim qizi'],
  ['Mamatkulov', 'Asilbek', 'Botir o\'g\'li'], ['Inoyatova', 'Sevinch', 'Jamol qizi'],
  ['Sodiqov', 'Mirzohid', 'Toir o\'g\'li'], ['Salimova', 'Iroda', 'Vohid qizi'],
  ['Bekmurodov', 'Nurbek', 'Karim o\'g\'li'], ['Xolmurodova', 'Nigora', 'Said qizi'],
  ['Tojiddinov', 'Shoxrux', 'Olim o\'g\'li'], ['Aliyeva', 'Feruza', 'Bahrom qizi'],
  ['Nurmatov', 'Eldor', 'Qaxxor o\'g\'li'], ['Pardayeva', 'Lola', 'Doniyor qizi'],
];

const GROUPS = ['ENG-1306-25', 'IIT-2105-25', 'MAT-1801-24', 'ECO-2103-24', 'PHY-1810-23',
  'CHM-1304-25', 'INF-2104-25', 'BIO-1801-24', 'TUR-1306-25', 'HIS-1810-25'];
const SPECIALTIES = [
  "Filologiya va tillarni o'qitish (ingliz tili)",
  "Axborot xavfsizligi",
  "Matematika va informatika",
  "Iqtisodiyot va menejment",
  "Fizika va astronomiya",
  "Kimyo",
  "Dasturiy injiniring",
  "Biologiya",
  "Turizm",
  "Tarix",
];
const LEVELS = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'];
const LEVEL_CODES = ['11', '12', '13', '14'];
const CONTRACT_TYPES = ['bazoviy', 'tabaqalashtirilgan', 'grant', 'xorijiy'];
const PAY_METHODS = ['bank', 'naqd', 'online', 'click', 'payme'];
const SCHOLARSHIP_TYPES = ['davlat', 'prezident', 'rektor', 'ijtimoiy', 'maxsus'];

const seedRand = (i, mod) => Math.abs(((i * 9301 + 49297) % 233280)) % mod;

const generateSeed = () => {
  // seed students from name list
  const students = UZBEK_NAMES.map((n, i) => {
    const fac = FACULTIES[i % 4];
    const lvlIdx = i % 4;
    return {
      id: 100000 + i,
      full_name: `${n[0].toUpperCase()} ${n[1].toUpperCase()} ${n[2].toUpperCase()}`,
      student_id_number: '46' + (220000 + i * 137).toString().slice(0, 10),
      department: { id: fac.id, name: fac.name },
      group: { id: 500 + i, name: GROUPS[i % GROUPS.length] },
      specialty: { code: '60' + (200000 + i * 1000), name: SPECIALTIES[i % SPECIALTIES.length] },
      level: { code: LEVEL_CODES[lvlIdx], name: LEVELS[lvlIdx] },
      educationForm: { code: '11', name: 'Kunduzgi' },
      paymentForm: { code: '12', name: "To'lov-shartnoma" },
      studentStatus: { code: '11', name: "O'qimoqda" },
      educationYear: { code: '2025', name: '2025-2026', current: true },
    };
  });

  // 30 contracts
  const contracts = [];
  for (let i = 0; i < 30; i++) {
    const stu = students[i % students.length];
    const amount = (12 + seedRand(i, 6)) * 1000000 + seedRand(i + 13, 10) * 100000;
    const payRatio = [0, 0.25, 0.5, 0.5, 0.6, 0.75, 1.0, 1.0, 0.4, 0.85][i % 10];
    const paid = Math.round(amount * payRatio / 100000) * 100000;
    const date = new Date(2025, 7 + (i % 3), 1 + (i % 28));
    const monthsCount = 2 + (i % 3);
    const installment = Math.round(amount / monthsCount / 100000) * 100000;
    const schedule = [];
    let remaining = paid;
    for (let m = 0; m < monthsCount; m++) {
      const due = new Date(2025, 8 + m * 3, 15);
      const isPaid = remaining >= installment;
      if (isPaid) remaining -= installment;
      schedule.push({
        dueDate: due.toISOString().slice(0, 10),
        amount: m === monthsCount - 1 ? amount - installment * (monthsCount - 1) : installment,
        paid: isPaid,
      });
    }
    contracts.push({
      id: 'CNT-' + String(i + 1).padStart(3, '0'),
      studentId: stu.id,
      studentName: stu.full_name,
      studentIdNumber: stu.student_id_number,
      studentImage: null,
      departmentName: stu.department.name,
      departmentId: stu.department.id,
      groupName: stu.group.name,
      level: stu.level.name,
      specialty: stu.specialty.name,
      contractNumber: `SH-2025/${String(i + 1).padStart(3, '0')}`,
      contractDate: date.toISOString().slice(0, 10),
      contractType: CONTRACT_TYPES[i % 4],
      educationYear: '2025-2026',
      contractAmount: amount,
      paidAmount: paid,
      debtAmount: amount - paid,
      status: i % 13 === 0 ? 'cancelled' : i % 11 === 0 ? 'completed' : 'active',
      paymentSchedule: schedule,
      createdAt: date.toISOString().slice(0, 10),
    });
  }

  // 45 payments — derived from contracts that have paidAmount > 0
  const payments = [];
  let payIdx = 0;
  contracts.forEach((c, ci) => {
    if (c.paidAmount <= 0) return;
    const pieces = c.paymentSchedule.filter((s) => s.paid);
    pieces.forEach((p, pi) => {
      if (payIdx >= 45) return;
      const d = new Date(p.dueDate);
      d.setDate(d.getDate() - seedRand(payIdx + 7, 10));
      payments.push({
        id: 'PAY-' + String(payIdx + 1).padStart(3, '0'),
        contractId: c.id,
        studentId: c.studentId,
        studentName: c.studentName,
        amount: p.amount,
        paymentDate: d.toISOString().slice(0, 10),
        paymentMethod: PAY_METHODS[(ci + pi) % 5],
        receiptNumber: `QT-${d.toISOString().slice(0, 10).replace(/-/g, '')}-${String(payIdx + 1).padStart(3, '0')}`,
        note: '',
        createdAt: d.toISOString().slice(0, 10),
      });
      payIdx++;
    });
  });

  // 10 scholarships
  const scholarships = [];
  for (let i = 0; i < 10; i++) {
    const stu = students[i * 2 % students.length];
    const type = SCHOLARSHIP_TYPES[i % 5];
    const amounts = { davlat: 920000, prezident: 2500000, rektor: 1500000, ijtimoiy: 600000, maxsus: 1200000 };
    scholarships.push({
      id: 'STI-' + String(i + 1).padStart(3, '0'),
      studentId: stu.id,
      studentName: stu.full_name,
      departmentName: stu.department.name,
      groupName: stu.group.name,
      type,
      amount: amounts[type],
      startDate: '2025-09-01',
      endDate: '2026-06-30',
      status: i % 7 === 0 ? 'paused' : i % 9 === 0 ? 'completed' : 'active',
      basis: type === 'davlat' ? 'GPA 86+ ball' :
        type === 'prezident' ? 'Prezident qarori №PF-187' :
        type === 'rektor' ? 'Rektor buyrug\'i №42' :
        type === 'ijtimoiy' ? 'Ijtimoiy ko\'mak' : 'Maxsus ko\'rsatkichlar',
    });
  }

  return { students, contracts, payments, scholarships };
};

// ============ STORE (singleton-ish) ============
const FinanceContext = React.createContext(null);
const useFinance = () => React.useContext(FinanceContext);

const FinanceProvider = ({ children }) => {
  const [seed] = React.useState(generateSeed);
  const [contracts, setContracts] = React.useState(seed.contracts);
  const [payments, setPayments] = React.useState(seed.payments);
  const [scholarships, setScholarships] = React.useState(seed.scholarships);
  const [seedStudents] = React.useState(seed.students);

  // CRUD: contracts
  const addContract = (c) => {
    const id = 'CNT-' + String(contracts.length + 1).padStart(3, '0');
    setContracts((x) => [...x, { ...c, id, paidAmount: 0, debtAmount: c.contractAmount, status: 'active', createdAt: new Date().toISOString().slice(0, 10) }]);
    return id;
  };
  const updateContract = (id, patch) => {
    setContracts((x) => x.map((c) => c.id === id ? { ...c, ...patch, debtAmount: (patch.contractAmount ?? c.contractAmount) - (patch.paidAmount ?? c.paidAmount) } : c));
  };
  const deleteContract = (id) => {
    setContracts((x) => x.filter((c) => c.id !== id));
    setPayments((p) => p.filter((p) => p.contractId !== id));
  };

  // CRUD: payments — keeps contract.paidAmount in sync
  const addPayment = (p) => {
    const id = 'PAY-' + String(payments.length + 1).padStart(3, '0');
    const newPay = { ...p, id, createdAt: new Date().toISOString().slice(0, 10) };
    setPayments((x) => [...x, newPay]);
    setContracts((cs) => cs.map((c) => {
      if (c.id !== p.contractId) return c;
      const newPaid = c.paidAmount + p.amount;
      return { ...c, paidAmount: newPaid, debtAmount: Math.max(0, c.contractAmount - newPaid) };
    }));
    return id;
  };
  const deletePayment = (id) => {
    const pay = payments.find((p) => p.id === id);
    if (!pay) return;
    setPayments((x) => x.filter((p) => p.id !== id));
    setContracts((cs) => cs.map((c) => {
      if (c.id !== pay.contractId) return c;
      const newPaid = Math.max(0, c.paidAmount - pay.amount);
      return { ...c, paidAmount: newPaid, debtAmount: c.contractAmount - newPaid };
    }));
  };

  // CRUD: scholarships
  const addScholarship = (s) => {
    const id = 'STI-' + String(scholarships.length + 1).padStart(3, '0');
    setScholarships((x) => [...x, { ...s, id, status: 'active' }]);
    return id;
  };
  const updateScholarship = (id, patch) => setScholarships((x) => x.map((s) => s.id === id ? { ...s, ...patch } : s));
  const deleteScholarship = (id) => setScholarships((x) => x.filter((s) => s.id !== id));

  const value = {
    contracts, payments, scholarships, seedStudents,
    addContract, updateContract, deleteContract,
    addPayment, deletePayment,
    addScholarship, updateScholarship, deleteScholarship,
    fetchHemis,
  };
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

// ============ SHARED UI HELPERS ============
const KpiCard = ({ icon, label, value, sub, gradient, iconBg = '#2DB976', onClick, accent }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: gradient || '#fff', borderRadius: 16, padding: 22,
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,.10)' : '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default', transition: 'all 200ms ease',
        transform: hover && onClick ? 'translateY(-2px)' : 'none',
        color: gradient ? '#fff' : '#0F172A',
        position: 'relative', overflow: 'hidden',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: gradient ? 'rgba(255,255,255,.22)' : iconBg,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} />
        </div>
        {accent && !gradient && <span style={{ fontSize: 11, fontWeight: 600, color: '#1B7A4E', background: '#ECFDF5', padding: '4px 9px', borderRadius: 999 }}>{accent}</span>}
      </div>
      <div style={{ fontSize: 12.5, color: gradient ? 'rgba(255,255,255,.85)' : '#64748B', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: gradient ? 'rgba(255,255,255,.85)' : '#64748B', marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

const ProgressMini = ({ value, max, height = 6, color }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const c = color || (pct < 30 ? '#EF4444' : pct < 70 ? '#F59E0B' : '#2DB976');
  return (
    <div style={{ width: '100%', height, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 999, transition: 'width 300ms' }} />
    </div>
  );
};

const ContractTypeBadge = ({ type }) => {
  const map = {
    bazoviy: { variant: 'info', label: 'Bazoviy' },
    tabaqalashtirilgan: { variant: 'warning', label: 'Tabaqalashtirilgan' },
    grant: { variant: 'success', label: 'Grant' },
    xorijiy: { variant: 'neutral', label: 'Xorijiy' },
  };
  const m = map[type] || map.bazoviy;
  return <Badge variant={m.variant} dot>{m.label}</Badge>;
};

const ContractStatusBadge = ({ status }) => {
  const map = {
    active: { variant: 'success', label: 'Faol' },
    completed: { variant: 'neutral', label: 'Yakunlangan' },
    cancelled: { variant: 'error', label: 'Bekor qilingan' },
  };
  const m = map[status] || map.active;
  return <Badge variant={m.variant} dot>{m.label}</Badge>;
};

const PayMethodBadge = ({ method }) => {
  const map = {
    bank: { variant: 'info', label: "Bank o'tkazmasi" },
    naqd: { variant: 'neutral', label: 'Naqd' },
    online: { variant: 'success', label: 'Online' },
    click: { variant: 'success', label: 'Click' },
    payme: { variant: 'warning', label: 'Payme' },
  };
  const m = map[method] || map.bank;
  return <Badge variant={m.variant} dot>{m.label}</Badge>;
};

const StudentSearchInput = ({ onSelect, placeholder = "Talaba ismi yoki ID..." }) => {
  const { seedStudents, fetchHemis } = useFinance();
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const tRef = React.useRef(null);

  React.useEffect(() => {
    if (q.length < 3) { setResults([]); return; }
    clearTimeout(tRef.current);
    tRef.current = setTimeout(async () => {
      setLoading(true);
      // local first
      const localMatch = seedStudents.filter((s) =>
        s.full_name.toLowerCase().includes(q.toLowerCase()) ||
        s.student_id_number.includes(q)
      ).slice(0, 8);
      setResults(localMatch);
      // try HEMIS
      try {
        const data = await fetchHemis('v1/data/student-list', { search: q, limit: 10 });
        const items = (data?.items || []).map((s) => ({
          id: s.id,
          full_name: s.full_name,
          student_id_number: s.student_id_number,
          image: s.image,
          department: s.department,
          group: s.group,
          specialty: s.specialty,
          level: s.level,
        }));
        if (items.length > 0) setResults(items);
      } catch (e) {
        // keep local results
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(tRef.current);
  }, [q]);

  return (
    <div style={{ position: 'relative' }}>
      <Input leftIcon="search" placeholder={placeholder}
        value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} />
      {open && q.length >= 3 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
          boxShadow: '0 10px 25px rgba(0,0,0,.12)', maxHeight: 320, overflowY: 'auto' }}>
          {loading && <div style={{ padding: 14, fontSize: 13, color: '#64748B', textAlign: 'center' }}>Qidirilmoqda...</div>}
          {!loading && results.length === 0 && <div style={{ padding: 14, fontSize: 13, color: '#64748B', textAlign: 'center' }}>Topilmadi</div>}
          {results.map((s) => (
            <button key={s.id} onClick={() => { onSelect(s); setQ(''); setOpen(false); setResults([]); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit', borderBottom: '1px solid #F1F5F9' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Avatar initials={s.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('')} size={32} src={s.image} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.full_name}</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>{s.student_id_number} · {s.group?.name} · {s.department?.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  HEMIS_API, HEMIS_TOKEN, fetchHemis, formatMoney, formatNum, formatDate,
  FACULTIES, CONTRACT_TYPES, PAY_METHODS, SCHOLARSHIP_TYPES,
  FinanceContext, useFinance, FinanceProvider,
  KpiCard, ProgressMini, ContractTypeBadge, ContractStatusBadge, PayMethodBadge,
  StudentSearchInput,
});
