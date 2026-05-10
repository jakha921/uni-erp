import { delay } from './delay';
import type {
  Student,
  StudentListItem,
  StudentListParams,
  CreateStudentDto,
  UpdateStudentDto,
  StudentGrade,
  StudentAttendance,
  StudentDocument,
  StudentStatistics,
  Faculty,
  Department,
  Specialty,
  Group,
  StudentStatus,
} from '@/types/student';
import type { PaginatedResponse, CodeName } from '@/types/common';
import type { IStudentsService } from '../services/students.service';

// ---------- Seeded random ----------
function seedRand(i: number): number {
  return ((i * 2654435761) % 2 ** 32) / 2 ** 32;
}
function pick<T>(arr: readonly T[], i: number): T {
  return arr[Math.floor(seedRand(i) * arr.length)]!;
}
function rnum(i: number, min: number, max: number): number {
  return Math.floor(seedRand(i) * (max - min + 1)) + min;
}

// ---------- Reference data ----------
const FACULTIES: Faculty[] = [
  { id: 1, name: 'Kompyuter fanlari', code: 'KF' },
  { id: 2, name: 'Iqtisodiyot', code: 'IQ' },
  { id: 3, name: 'Pedagogika', code: 'PD' },
  { id: 4, name: 'Filologiya', code: 'FL' },
  { id: 5, name: 'Matematika', code: 'MT' },
];

const DEPARTMENTS: Department[] = [
  { id: 1, name: 'Dasturiy injiniring', code: 'DI', facultyId: 1 },
  { id: 2, name: 'Axborot xavfsizligi', code: 'AX', facultyId: 1 },
  { id: 3, name: 'Sun\'iy intellekt', code: 'SI', facultyId: 1 },
  { id: 4, name: 'Axborot tizimlari', code: 'AT', facultyId: 1 },
  { id: 5, name: 'Iqtisodiyot nazariyasi', code: 'IN', facultyId: 2 },
  { id: 6, name: 'Menejment', code: 'MN', facultyId: 2 },
  { id: 7, name: 'Moliya va buxgalteriya', code: 'MB', facultyId: 2 },
  { id: 8, name: 'Boshlang\'ich ta\'lim', code: 'BT', facultyId: 3 },
  { id: 9, name: 'Pedagogika va psixologiya', code: 'PP', facultyId: 3 },
  { id: 10, name: 'Maktabgacha ta\'lim', code: 'MK', facultyId: 3 },
  { id: 11, name: 'O\'zbek tili va adabiyoti', code: 'OT', facultyId: 4 },
  { id: 12, name: 'Ingliz tili va adabiyoti', code: 'IT', facultyId: 4 },
  { id: 13, name: 'Tarjimashunoslik', code: 'TR', facultyId: 4 },
  { id: 14, name: 'Amaliy matematika', code: 'AM', facultyId: 5 },
  { id: 15, name: 'Matematik tahlil', code: 'MH', facultyId: 5 },
  { id: 16, name: 'Statistika', code: 'ST', facultyId: 5 },
];

const SPECIALTIES: Specialty[] = [
  { id: 1, name: 'Dasturiy injiniring', code: '60510200', departmentId: 1 },
  { id: 2, name: 'Axborot xavfsizligi', code: '60510300', departmentId: 2 },
  { id: 3, name: 'Sun\'iy intellekt', code: '60510400', departmentId: 3 },
  { id: 4, name: 'Axborot tizimlari', code: '60510500', departmentId: 4 },
  { id: 5, name: 'Iqtisodiyot', code: '60310100', departmentId: 5 },
  { id: 6, name: 'Menejment', code: '60310200', departmentId: 6 },
  { id: 7, name: 'Moliya', code: '60310300', departmentId: 7 },
  { id: 8, name: 'Boshlang\'ich ta\'lim', code: '60110100', departmentId: 8 },
  { id: 9, name: 'Pedagogika', code: '60110200', departmentId: 9 },
  { id: 10, name: 'Maktabgacha ta\'lim', code: '60110300', departmentId: 10 },
  { id: 11, name: 'O\'zbek filologiyasi', code: '60220100', departmentId: 11 },
  { id: 12, name: 'Ingliz filologiyasi', code: '60220200', departmentId: 12 },
  { id: 13, name: 'Tarjimashunoslik', code: '60220300', departmentId: 13 },
  { id: 14, name: 'Amaliy matematika', code: '60540100', departmentId: 14 },
  { id: 15, name: 'Matematik tahlil', code: '60540200', departmentId: 15 },
  { id: 16, name: 'Statistika', code: '60540300', departmentId: 16 },
];

function buildGroups(): Group[] {
  const groups: Group[] = [];
  let gid = 1;
  for (const fac of FACULTIES) {
    for (let course = 1; course <= 4; course++) {
      for (let g = 1; g <= 2; g++) {
        groups.push({
          id: gid,
          name: `${fac.code}-${course}${g}`,
          code: `${fac.code}-${course}${g}`,
          specialtyId: SPECIALTIES.find(
            (s) =>
              DEPARTMENTS.find((d) => d.id === s.departmentId)?.facultyId ===
              fac.id,
          )?.id ?? 1,
          course,
          capacity: 30,
          currentCount: rnum(gid * 13, 22, 30),
        });
        gid++;
      }
    }
  }
  return groups;
}
const GROUPS: Group[] = buildGroups();

// ---------- Names ----------
const MALE_FIRST = [
  'Jasur', 'Sardor', 'Bekzod', 'Otabek', 'Aziz', 'Jahongir', 'Akbar',
  'Ravshan', 'Doniyor', 'Sanjarbek', 'Bobur', 'Asilbek', 'Mirzohid',
  'Nurbek', 'Shoxrux', 'Eldor', 'Azizbek', 'Shahzod', 'Bahrombek',
  'Asror', 'Davron', 'Rustam', 'Sherzod', 'Kamoliddin', 'Akmal',
  'Javohir', 'Nodir', 'Oybek', 'Shavkat', 'Dilshod',
] as const;

const FEMALE_FIRST = [
  'Madina', 'Dilnoza', 'Nilufar', 'Sevara', 'Gulnora', 'Shahnoza',
  'Marjona', 'Zilola', 'Mohira', 'Sevinch', 'Iroda', 'Nigora',
  'Feruza', 'Lola', 'Munisa', 'Komila', 'Sabina', 'Diyora',
  'Malika', 'Zarina', 'Muhayyo', 'Kamola', 'Nozima', 'Laylo',
  'Sanobar', 'Shaxlo', 'Nodira', 'Zuhra', 'Barno', 'Ozoda',
] as const;

const SURNAMES = [
  'Karimov', 'Rahimov', 'Toshmatov', 'Xolmatov', 'Yusupov', 'Mirzayev',
  'Saidov', 'Abdullayev', 'Norqulov', 'Ergashev', 'Tursunov', 'Sobirov',
  'Qodirov', 'Hasanov', 'Ismoilov', 'Komilov', 'Olimov', 'Bekmurodov',
  'Salimov', 'Tojiddinov', 'Aliyev', 'Nurmatov', 'Sharipov', 'Yoqubov',
  'Latipov', 'Mahmudov', 'Rasulov', 'Shukurov', 'Xudoyberdiyev',
  'Mamatkulov', 'Inoyatov', 'Sodiqov', 'Najmidinov', 'Tojibaev',
  'Xojiyev', 'Sayfullaev', 'Usmonov', 'Jalilov', 'Nazarov', 'Shodiyev',
] as const;

const PATRONYMICS_MALE = [
  'Kamoliddinovich', 'Bahodirovich', 'Rashidovich', 'Sobirovich',
  'Mahmudovich', 'Abdullayevich', 'Nematovich', 'Shokirovich',
  'Fayzullayevich', 'Toxirovich', 'Baxtiyor o\'g\'li', 'Dilmurod o\'g\'li',
  'Anvar o\'g\'li', 'Ravshan o\'g\'li', 'Shuhrat o\'g\'li',
] as const;

const PATRONYMICS_FEMALE = [
  'Kamoliddinovna', 'Bahodirovna', 'Rashidovna', 'Sobirovna',
  'Mahmudovna', 'Abdullayevna', 'Nematovna', 'Shokirovna',
  'Fayzullayevna', 'Toxirovna', 'Baxtiyor qizi', 'Dilmurod qizi',
  'Anvar qizi', 'Ravshan qizi', 'Shuhrat qizi',
] as const;

const EDUCATION_FORMS: CodeName[] = [
  { code: 'kunduzgi', name: 'Kunduzgi' },
  { code: 'sirtqi', name: 'Sirtqi' },
  { code: 'kechki', name: 'Kechki' },
];

const EDUCATION_TYPES: CodeName[] = [
  { code: 'bakalavr', name: 'Bakalavriat' },
  { code: 'magistr', name: 'Magistratura' },
];

const PAYMENT_FORMS: CodeName[] = [
  { code: 'grant', name: 'Davlat granti' },
  { code: 'kontrakt', name: 'To\'lov-shartnoma' },
];

const STUDENT_STATUS_OPTIONS: StudentStatus[] = [
  'active',
  'academic_leave',
  'expelled',
  'graduated',
  'transferred',
];

const ADDRESSES = [
  'Toshkent sh., Chilonzor t., 7-mavze',
  'Samarqand v., Samarqand sh., Registon ko\'chasi',
  'Buxoro v., Buxoro sh., Labi hovuz ko\'chasi',
  'Farg\'ona v., Farg\'ona sh., Mustaqllik ko\'chasi',
  'Navoiy v., Navoiy sh., Galaba ko\'chasi',
  'Andijon v., Andijon sh., Babur ko\'chasi',
  'Namangan v., Namangan sh., Navro\'z ko\'chasi',
  'Qashqadaryo v., Qarshi sh., Ipak yo\'li ko\'chasi',
  'Surxondaryo v., Termiz sh., O\'zbekiston ko\'chasi',
  'Xorazm v., Urganch sh., Al-Xorazmiy ko\'chasi',
  'Jizzax v., Jizzax sh., Sharaf Rashidov ko\'chasi',
  'Sirdaryo v., Guliston sh., Mustaqillik ko\'chasi',
] as const;

const SUBJECTS_MAP: Record<string, string[]> = {
  KF: [
    'Algoritmlar va ma\'lumotlar tuzilmasi',
    'Ma\'lumotlar bazalari',
    'Veb-dasturlash',
    'Dasturlash tillari',
    'Kompyuter tarmoqlari',
    'Operatsion tizimlar',
  ],
  IQ: [
    'Iqtisodiyot nazariyasi',
    'Mikroiqtisodiyot',
    'Makroiqtisodiyot',
    'Moliyaviy hisob',
    'Marketing asoslari',
    'Menejment',
  ],
  PD: [
    'Pedagogika asoslari',
    'Umumiy psixologiya',
    'Didaktika',
    'Ta\'lim texnologiyalari',
    'Pedagogik mahorat',
    'Rivojlanish psixologiyasi',
  ],
  FL: [
    'Tilshunoslikka kirish',
    'Adabiyotshunoslik',
    'Ingliz tili amaliyoti',
    'Tarjima nazariyasi',
    'Stilistika',
    'Leksikologiya',
  ],
  MT: [
    'Matematik tahlil',
    'Algebra',
    'Geometriya',
    'Ehtimollar nazariyasi',
    'Differensial tenglamalar',
    'Diskret matematika',
  ],
};

const TEACHERS = [
  'Karimov U.B.', 'Nazarova M.A.', 'Xolmatov A.S.', 'Tursunova F.R.',
  'Yusupov J.K.', 'Hasanova D.B.', 'Mirzayev O.T.', 'Saidova N.I.',
  'Rahimov B.D.', 'Ergasheva Z.M.', 'Toshmatov R.Q.', 'Qodirova L.A.',
];

// ---------- Generate 200 students ----------
function generateStudents(): Student[] {
  const result: Student[] = [];

  for (let i = 0; i < 200; i++) {
    const isFemale = seedRand(i * 3) < 0.45;
    const firstName = isFemale
      ? pick(FEMALE_FIRST, i * 7)
      : pick(MALE_FIRST, i * 7);
    const surname = pick(SURNAMES, i * 11);
    const patronymic = isFemale
      ? pick(PATRONYMICS_FEMALE, i * 13)
      : pick(PATRONYMICS_MALE, i * 13);

    const femaleSurname = surname + 'a';
    const actualSurname = isFemale ? femaleSurname : surname;

    const fac = FACULTIES[i % FACULTIES.length]!;
    const facDepts = DEPARTMENTS.filter((d) => d.facultyId === fac.id);
    const dept = facDepts[i % facDepts.length]!;
    const spec = SPECIALTIES.find((s) => s.departmentId === dept.id)!;
    const facGroups = GROUPS.filter(
      (g) => g.name.startsWith(fac.code),
    );
    const group = facGroups[i % facGroups.length]!;
    const course = group.course;

    // Status distribution: 85% active, 5% academic_leave, 4% expelled, 4% graduated, 2% transferred
    let status: StudentStatus = 'active';
    const statusRoll = seedRand(i * 17);
    if (statusRoll > 0.98) status = 'transferred';
    else if (statusRoll > 0.94) status = 'graduated';
    else if (statusRoll > 0.9) status = 'expelled';
    else if (statusRoll > 0.85) status = 'academic_leave';

    const edFormIdx = i % 10 < 7 ? 0 : i % 10 < 9 ? 1 : 2;
    const payFormIdx = i % 3 === 0 ? 0 : 1;

    const birthYear = 2003 + rnum(i * 19, 0, 4);
    const birthMonth = rnum(i * 23, 1, 12);
    const birthDay = rnum(i * 29, 1, 28);
    const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    const phoneCode = ['90', '91', '93', '94', '97', '99'][i % 6]!;
    const phoneNum = String(rnum(i * 31, 1000000, 9999999));
    const phone = `+998 (${phoneCode}) ${phoneNum.slice(0, 3)}-${phoneNum.slice(3, 5)}-${phoneNum.slice(5, 7)}`;

    const gpa = Math.round((20 + seedRand(i * 37) * 30) * 10) / 10; // 2.0 - 5.0

    result.push({
      id: 1000 + i,
      fullName: `${actualSurname} ${firstName} ${patronymic}`,
      firstName,
      secondName: actualSurname,
      thirdName: patronymic,
      shortName: `${actualSurname} ${firstName[0]}.`,
      studentIdNumber: `46${String(220000 + i * 137).slice(0, 6)}`,
      gender: isFemale
        ? { code: '2', name: 'Ayol' }
        : { code: '1', name: 'Erkak' },
      birthDate,
      faculty: fac,
      department: dept,
      specialty: spec,
      group,
      course,
      level: { code: String(course), name: `${course}-kurs` },
      educationForm: EDUCATION_FORMS[edFormIdx]!,
      educationType: EDUCATION_TYPES[0]!,
      paymentForm: PAYMENT_FORMS[payFormIdx]!,
      status,
      educationYear: '2025-2026',
      address: pick(ADDRESSES, i * 41),
      phone,
      email: `${actualSurname.toLowerCase()}.${firstName[0]!.toLowerCase()}@student.uni.uz`,
      passport: `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 7) % 26))} ${String(2000000 + i * 1737).slice(0, 7)}`,
      pinfl: `3${String(rnum(i * 43, 1000000000000, 9999999999999)).slice(0, 13)}`,
      avgGrade: gpa,
      image: null,
      createdAt: `2024-09-0${rnum(i * 47, 1, 9)}`,
    });
  }

  return result;
}

function toListItem(s: Student): StudentListItem {
  return {
    id: s.id,
    fullName: s.fullName,
    shortName: s.shortName,
    studentIdNumber: s.studentIdNumber,
    faculty: s.faculty,
    group: s.group,
    course: s.course,
    status: s.status,
    avgGrade: s.avgGrade,
    image: s.image,
    paymentForm: s.paymentForm,
    educationForm: s.educationForm,
  };
}

// ---------- Generate grades for a student ----------
function generateGrades(student: Student): StudentGrade[] {
  const facCode = student.faculty.code;
  const subjects = SUBJECTS_MAP[facCode] ?? SUBJECTS_MAP['KF']!;
  const grades: StudentGrade[] = [];
  let gid = student.id * 100;

  for (let sem = 1; sem <= student.course * 2; sem++) {
    const semSubjects = subjects.slice(0, rnum(gid + sem, 4, 6));
    for (const sub of semSubjects) {
      const midScore = rnum(gid++, 40, 100);
      const finalScore = rnum(gid++, 40, 100);

      grades.push({
        id: gid++,
        subjectName: sub,
        subjectCode: `${facCode}${String(100 + grades.length).slice(0, 3)}`,
        gradeType: 'midterm',
        gradeTypeLabel: 'Oraliq nazorat',
        score: midScore,
        maxScore: 100,
        semester: sem,
        date: `2025-${String(sem <= 1 ? 12 : (sem * 2) % 12 + 1).padStart(2, '0')}-${String(rnum(gid, 10, 25)).padStart(2, '0')}`,
        teacherName: pick(TEACHERS, gid),
      });

      grades.push({
        id: gid++,
        subjectName: sub,
        subjectCode: `${facCode}${String(100 + grades.length).slice(0, 3)}`,
        gradeType: 'final',
        gradeTypeLabel: 'Yakuniy nazorat',
        score: finalScore,
        maxScore: 100,
        semester: sem,
        date: `2025-${String(sem <= 1 ? 12 : (sem * 2 + 1) % 12 + 1).padStart(2, '0')}-${String(rnum(gid, 10, 25)).padStart(2, '0')}`,
        teacherName: pick(TEACHERS, gid),
      });
    }
  }

  return grades;
}

// ---------- Generate attendance for a student ----------
function generateAttendance(student: Student): StudentAttendance[] {
  const facCode = student.faculty.code;
  const subjects = SUBJECTS_MAP[facCode] ?? SUBJECTS_MAP['KF']!;
  const attendance: StudentAttendance[] = [];
  const statuses: StudentAttendance['status'][] = [
    'present',
    'absent',
    'late',
    'excused',
  ];

  for (let week = 1; week <= 16; week++) {
    for (let day = 1; day <= 5; day++) {
      const subIdx = (week * 5 + day) % subjects.length;
      const sub = subjects[subIdx]!;
      const seed = student.id * 1000 + week * 10 + day;
      // 85% present, 5% absent, 5% late, 5% excused
      const roll = seedRand(seed);
      let st: StudentAttendance['status'] = 'present';
      if (roll > 0.95) st = 'excused';
      else if (roll > 0.9) st = 'late';
      else if (roll > 0.85) st = 'absent';

      const monthOffset = Math.floor(week / 4);
      const dateStr = `2025-${String(9 + monthOffset).padStart(2, '0')}-${String(Math.min(28, week * 2 + day)).padStart(2, '0')}`;

      attendance.push({ date: dateStr, status: st, subjectName: sub });
    }
  }

  // Suppress unused variable warning
  void statuses;

  return attendance;
}

// ---------- Mock Service ----------
const ALL_STUDENTS = generateStudents();

export class StudentsMockService implements IStudentsService {
  private students: Student[] = [...ALL_STUDENTS];

  async getList(
    params: StudentListParams,
  ): Promise<PaginatedResponse<StudentListItem>> {
    await delay(300);

    let filtered = [...this.students];

    // Search
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.studentIdNumber.includes(q) ||
          s.group.name.toLowerCase().includes(q),
      );
    }

    // Filters
    if (params.facultyId) {
      filtered = filtered.filter((s) => s.faculty.id === params.facultyId);
    }
    if (params.departmentId) {
      filtered = filtered.filter(
        (s) => s.department.id === params.departmentId,
      );
    }
    if (params.course) {
      filtered = filtered.filter((s) => s.course === params.course);
    }
    if (params.status) {
      filtered = filtered.filter((s) => s.status === params.status);
    }
    if (params.educationForm) {
      filtered = filtered.filter(
        (s) => s.educationForm.code === params.educationForm,
      );
    }
    if (params.paymentForm) {
      filtered = filtered.filter(
        (s) => s.paymentForm.code === params.paymentForm,
      );
    }
    if (params.groupId) {
      filtered = filtered.filter((s) => s.group.id === params.groupId);
    }

    // Sort
    if (params.sortBy) {
      const dir = params.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[params.sortBy as keyof Student];
        const bVal = b[params.sortBy as keyof Student];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * dir;
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * dir;
        }
        return 0;
      });
    }

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize).map(toListItem);

    return { data, total, page, pageSize, totalPages };
  }

  async getById(id: number): Promise<Student> {
    await delay(200);
    const student = this.students.find((s) => s.id === id);
    if (!student) throw new Error('Talaba topilmadi');
    return student;
  }

  async create(data: CreateStudentDto): Promise<Student> {
    await delay(400);
    const maxId = Math.max(...this.students.map((s) => s.id));
    const fac = FACULTIES.find((f) => f.id === data.facultyId) ?? FACULTIES[0]!;
    const dept =
      DEPARTMENTS.find((d) => d.id === data.departmentId) ?? DEPARTMENTS[0]!;
    const spec =
      SPECIALTIES.find((s) => s.id === data.specialtyId) ?? SPECIALTIES[0]!;
    const group = GROUPS.find((g) => g.id === data.groupId) ?? GROUPS[0]!;

    const student: Student = {
      id: maxId + 1,
      fullName: `${data.secondName} ${data.firstName} ${data.thirdName}`,
      firstName: data.firstName,
      secondName: data.secondName,
      thirdName: data.thirdName,
      shortName: `${data.secondName} ${data.firstName[0]}.`,
      studentIdNumber: `46${String(Date.now()).slice(-6)}`,
      gender:
        data.gender === '2'
          ? { code: '2', name: 'Ayol' }
          : { code: '1', name: 'Erkak' },
      birthDate: data.birthDate,
      faculty: fac,
      department: dept,
      specialty: spec,
      group,
      course: group.course,
      level: {
        code: String(group.course),
        name: `${group.course}-kurs`,
      },
      educationForm:
        EDUCATION_FORMS.find((f) => f.code === data.educationForm) ??
        EDUCATION_FORMS[0]!,
      educationType:
        EDUCATION_TYPES.find((t) => t.code === data.educationType) ??
        EDUCATION_TYPES[0]!,
      paymentForm:
        PAYMENT_FORMS.find((p) => p.code === data.paymentForm) ??
        PAYMENT_FORMS[0]!,
      status: 'active',
      educationYear: '2025-2026',
      address: data.address,
      phone: data.phone,
      email: data.email,
      passport: data.passport,
      pinfl: data.pinfl,
      avgGrade: 0,
      image: null,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    this.students.unshift(student);
    return student;
  }

  async update(id: number, data: UpdateStudentDto): Promise<Student> {
    await delay(400);
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Talaba topilmadi');

    const existing = this.students[idx]!;

    const updated: Student = {
      ...existing,
      firstName: data.firstName ?? existing.firstName,
      secondName: data.secondName ?? existing.secondName,
      thirdName: data.thirdName ?? existing.thirdName,
      fullName: `${data.secondName ?? existing.secondName} ${data.firstName ?? existing.firstName} ${data.thirdName ?? existing.thirdName}`,
      shortName: `${data.secondName ?? existing.secondName} ${(data.firstName ?? existing.firstName)[0]}.`,
      gender: data.gender
        ? data.gender === '2'
          ? { code: '2', name: 'Ayol' }
          : { code: '1', name: 'Erkak' }
        : existing.gender,
      birthDate: data.birthDate ?? existing.birthDate,
      phone: data.phone ?? existing.phone,
      email: data.email ?? existing.email,
      passport: data.passport ?? existing.passport,
      pinfl: data.pinfl ?? existing.pinfl,
      address: data.address ?? existing.address,
      educationForm: data.educationForm
        ? (EDUCATION_FORMS.find((f) => f.code === data.educationForm) ??
            existing.educationForm)
        : existing.educationForm,
      paymentForm: data.paymentForm
        ? (PAYMENT_FORMS.find((p) => p.code === data.paymentForm) ??
            existing.paymentForm)
        : existing.paymentForm,
    };

    this.students[idx] = updated;
    return updated;
  }

  async delete(id: number): Promise<void> {
    await delay(300);
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Talaba topilmadi');
    this.students.splice(idx, 1);
  }

  async getStatistics(): Promise<StudentStatistics> {
    await delay(300);

    const students = this.students;

    const byFaculty = FACULTIES.map((f) => ({
      faculty: f.name,
      count: students.filter((s) => s.faculty.id === f.id).length,
    }));

    const byCourse = [1, 2, 3, 4].map((c) => ({
      course: c,
      count: students.filter((s) => s.course === c).length,
    }));

    const byGenderMap: Record<string, number> = {};
    for (const s of students) {
      const key = s.gender.name;
      byGenderMap[key] = (byGenderMap[key] ?? 0) + 1;
    }
    const byGender = Object.entries(byGenderMap).map(([gender, count]) => ({
      gender,
      count,
    }));

    const byEdFormMap: Record<string, number> = {};
    for (const s of students) {
      const key = s.educationForm.name;
      byEdFormMap[key] = (byEdFormMap[key] ?? 0) + 1;
    }
    const byEducationForm = Object.entries(byEdFormMap).map(
      ([form, count]) => ({ form, count }),
    );

    const byPayMap: Record<string, number> = {};
    for (const s of students) {
      const key = s.paymentForm.name;
      byPayMap[key] = (byPayMap[key] ?? 0) + 1;
    }
    const byPaymentForm = Object.entries(byPayMap).map(([form, count]) => ({
      form,
      count,
    }));

    const statusLabelMap: Record<StudentStatus, string> = {
      active: "O'qimoqda",
      academic_leave: "Akademik ta'tilda",
      expelled: 'Chetlatilgan',
      graduated: 'Bitirgan',
      transferred: "Ko'chirilgan",
    };

    const byStatusMap: Record<string, number> = {};
    for (const s of students) {
      const key = statusLabelMap[s.status];
      byStatusMap[key] = (byStatusMap[key] ?? 0) + 1;
    }
    const byStatus = Object.entries(byStatusMap).map(([status, count]) => ({
      status,
      count,
    }));

    return {
      totalStudents: students.length,
      byFaculty,
      byCourse,
      byGender,
      byEducationForm,
      byPaymentForm,
      byStatus,
    };
  }

  async getGrades(studentId: number): Promise<StudentGrade[]> {
    await delay(300);
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Talaba topilmadi');
    return generateGrades(student);
  }

  async getAttendance(studentId: number): Promise<StudentAttendance[]> {
    await delay(300);
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Talaba topilmadi');
    return generateAttendance(student);
  }

  async getDocuments(_studentId: number): Promise<StudentDocument[]> {
    await delay(200);
    return [
      { id: 1, name: 'Pasport nusxasi', uploadedAt: '01.09.2024' },
      { id: 2, name: 'Diplom (attestat)', uploadedAt: '01.09.2024' },
      { id: 3, name: "Tibbiy ma'lumotnoma", uploadedAt: '01.09.2024' },
      { id: 4, name: 'Ariza', uploadedAt: '02.09.2024' },
      { id: 5, name: 'Foto 3x4', uploadedAt: '01.09.2024' },
      { id: 6, name: 'Harbiy hisob varaqasi', uploadedAt: '05.09.2024' },
    ];
  }
}

export { FACULTIES, DEPARTMENTS, SPECIALTIES, GROUPS, EDUCATION_FORMS, PAYMENT_FORMS, STUDENT_STATUS_OPTIONS };
