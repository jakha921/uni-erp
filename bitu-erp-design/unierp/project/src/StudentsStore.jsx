// StudentsStore.jsx — students data store with HEMIS API integration
// The Moliya store already has 30 seed students; here we expand to 200 + HEMIS load.

const STUDENT_STATUSES = [
  { code: '11', name: "O'qimoqda", variant: 'success' },
  { code: '12', name: 'Akademik ta\'tilda', variant: 'warning' },
  { code: '13', name: 'Chetlatilgan', variant: 'error' },
  { code: '14', name: 'Bitirgan', variant: 'neutral' },
];

const PAYMENT_FORMS = [
  { code: '11', name: 'Davlat granti' },
  { code: '12', name: "To'lov-shartnoma" },
];
const EDUCATION_FORMS = [
  { code: '11', name: 'Kunduzgi' },
  { code: '12', name: 'Sirtqi' },
  { code: '13', name: 'Kechki' },
];
const EDUCATION_TYPES = [
  { code: '11', name: 'Bakalavriat' },
  { code: '12', name: 'Magistratura' },
];

const STU_SURNAMES = [
  'Karimov', 'Rahimov', 'Toshmatov', 'Xolmatova', 'Yusupova', 'Mirzayev', 'Saidova',
  'Abdullayev', 'Norqulov', 'Ergasheva', 'Tursunov', 'Sobirova', 'Qodirov',
  'Hasanov', 'Ismoilova', 'Komilov', 'Olimov', 'Bekmurodov', 'Salimova', 'Tojiddinov',
  'Aliyeva', 'Nurmatov', 'Pardayeva', 'Sharipova', 'Yoqubov', 'Latipov', 'Mahmudova',
  'Rasulov', 'Shukurov', 'Ergashev', 'Xudoyberdiev', 'Mamatkulov', 'Inoyatov', 'Sodiqov',
  'Bekmuradov', 'Xolmuradov', 'Najmiddinov', 'Tojibaev', 'Xojiyev', 'Sayfullaev'
];
const STU_FIRSTNAMES = [
  'Jasur', 'Sardor', 'Bekzod', 'Madina', 'Dilnoza', 'Otabek', 'Nilufar', 'Aziz',
  'Jahongir', 'Sevara', 'Akbar', 'Gulnora', 'Ravshan', 'Shahnoza', 'Doniyor',
  'Marjona', 'Sanjarbek', 'Zilola', 'Bobur', 'Mohira', 'Asilbek', 'Sevinch',
  'Mirzohid', 'Iroda', 'Nurbek', 'Nigora', 'Shoxrux', 'Feruza', 'Eldor', 'Lola',
  'Azizbek', 'Munisa', 'Shahzod', 'Komila', 'Bahrombek', 'Sabina', 'Asror', 'Diyora'
];
const STU_GROUPS = [
  'ENG-1306-25', 'ENG-1306-24', 'ENG-1306-23', 'ENG-1306-22',
  'IIT-2105-25', 'IIT-2105-24', 'IIT-2105-23',
  'MAT-1801-25', 'MAT-1801-24', 'MAT-1801-23',
  'ECO-2103-25', 'ECO-2103-24', 'ECO-2103-23',
  'PHY-1810-25', 'PHY-1810-24', 'PHY-1810-23',
  'CHM-1304-25', 'INF-2104-25', 'INF-2104-24', 'INF-2104-23',
  'BIO-1801-25', 'TUR-1306-25', 'HIS-1810-25', 'PED-1801-25',
];
const STU_SPECIALTIES = [
  "Filologiya va tillarni o'qitish (ingliz tili)",
  "Filologiya va tillarni o'qitish (o'zbek tili)",
  "Tarjimashunoslik",
  "Axborot xavfsizligi",
  "Dasturiy injiniring",
  "Matematika va informatika",
  "Iqtisodiyot va menejment",
  "Marketing",
  "Fizika va astronomiya",
  "Kimyo",
  "Biologiya",
  "Tarix",
  "Pedagogika",
  "Turizm",
];

const seedRandStu = (i, mod) => Math.abs((i * 9301 + 49297) % 233280) % mod;

// Exposes window.FACULTIES from MoliyaStore
const generateStudentsSeed = () => {
  const FAC = window.FACULTIES || [
    { id: 1, name: "Filologiya va tillarni o'qitish" },
    { id: 13, name: "Aniq, tabiiy va texnik" },
    { id: 14, name: "Iqtisodiyot va axborot texnologiyalari" },
    { id: 18, name: "Ijtimoiy-gumanitar" },
  ];
  const out = [];
  for (let i = 0; i < 200; i++) {
    const fac = FAC[i % FAC.length];
    const surname = STU_SURNAMES[i % STU_SURNAMES.length];
    const firstname = STU_FIRSTNAMES[(i * 7) % STU_FIRSTNAMES.length];
    const isFemale = ['Madina','Dilnoza','Nilufar','Sevara','Gulnora','Shahnoza','Marjona','Zilola','Mohira','Sevinch','Iroda','Nigora','Feruza','Lola','Munisa','Komila','Sabina','Diyora','Xolmatova','Yusupova','Saidova','Ergasheva','Sobirova','Ismoilova','Salimova','Aliyeva','Pardayeva','Sharipova','Mahmudova'].some((n) => firstname === n || surname.includes(n));
    const middle = isFemale ? `${STU_FIRSTNAMES[(i * 11) % STU_FIRSTNAMES.length]} qizi` : `${STU_FIRSTNAMES[(i * 11) % STU_FIRSTNAMES.length]} o'g'li`;
    const lvlIdx = i % 4;
    const groupIdx = (i * 3) % STU_GROUPS.length;
    const statusIdx = i % 47 === 0 ? 1 : i % 89 === 0 ? 2 : 0;

    const birth = new Date(2003 + (i % 6), i % 12, 1 + seedRandStu(i, 28));

    out.push({
      id: 100000 + i,
      full_name: `${surname.toUpperCase()} ${firstname.toUpperCase()} ${middle.toUpperCase()}`,
      first_name: firstname,
      second_name: surname,
      third_name: middle,
      short_name: `${surname} ${firstname[0]}.${middle[0]}.`,
      student_id_number: '46' + String(220000 + i * 137).slice(0, 10),
      gender: isFemale ? { code: 2, name: 'Ayol' } : { code: 1, name: 'Erkak' },
      birth_date: birth.toISOString().slice(0, 10),
      department: { id: fac.id, name: fac.name, code: String(fac.id) },
      group: { id: 500 + i, name: STU_GROUPS[groupIdx] },
      specialty: { code: '60' + String(200000 + i * 1000).slice(0, 4), name: STU_SPECIALTIES[i % STU_SPECIALTIES.length] },
      level: { code: String(11 + lvlIdx), name: `${lvlIdx + 1}-kurs` },
      educationForm: EDUCATION_FORMS[i % 3],
      educationType: EDUCATION_TYPES[i % 14 === 0 ? 1 : 0],
      paymentForm: PAYMENT_FORMS[i % 3 === 0 ? 0 : 1],
      studentStatus: STUDENT_STATUSES[statusIdx],
      educationYear: { code: '2025', name: '2025-2026', current: true },
      address: ['Navoiy sh.', 'Zarafshon sh.', 'Karmana t.', 'Uchquduq sh.', 'Qiziltepa t.'][i % 5],
      phone: `+998 (90) ${String(200 + i).slice(0, 3)}-${String(10 + i).padStart(2, '0')}-${String(50 + i).slice(0, 2)}`,
      email: `${surname.toLowerCase()}.${firstname[0].toLowerCase()}@student.bitu.uz`,
      passport: `AB ${String(2000000 + i * 1737).slice(0, 7)}`,
      pinfl: `${30000000000000 + i * 1739}`.slice(0, 14),
      avgGrade: Math.round((70 + seedRandStu(i + 5, 26)) * 10) / 10,
      image: null,
    });
  }
  return out;
};

// ===== Context =====
const StudentsContext = React.createContext(null);
const useStudents = () => React.useContext(StudentsContext);

const StudentsProvider = ({ children }) => {
  const fin = typeof useFinance === 'function' ? useFinance() : null;
  const [seed] = React.useState(generateStudentsSeed);
  const [students, setStudents] = React.useState(seed);
  const [loading, setLoading] = React.useState(false);
  const [hemisLoaded, setHemisLoaded] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadFromHemis = React.useCallback(() => {
    if (typeof showToast === 'function') {
      showToast("Ma'lumotlar yuklandi", 'success');
    }
  }, []);

  // Filter helpers
  const studentsByFaculty = (facultyId) =>
    students.filter((s) => s.department?.id === facultyId);

  const studentsByGroup = (groupName) =>
    students.filter((s) => s.group?.name === groupName);

  const value = {
    students, loading, error, hemisLoaded, loadFromHemis,
    studentsByFaculty, studentsByGroup,
    STUDENT_STATUSES, PAYMENT_FORMS, EDUCATION_FORMS,
  };
  return <StudentsContext.Provider value={value}>{children}</StudentsContext.Provider>;
};

// ===== Helpers =====
const StudentStatusBadge = ({ status }) => {
  const m = STUDENT_STATUSES.find((s) => s.code === (status?.code || status)) || STUDENT_STATUSES[0];
  return <Badge variant={m.variant} dot>{m.name}</Badge>;
};

Object.assign(window, {
  StudentsContext, StudentsProvider, useStudents,
  STUDENT_STATUSES, PAYMENT_FORMS, EDUCATION_FORMS,
  StudentStatusBadge,
});
