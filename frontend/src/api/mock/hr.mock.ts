import { delay } from './delay';
import type {
  Employee,
  EmployeeListItem,
  EmployeeListParams,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  HrDepartment,
  HrOrder,
  CreateOrderDto,
  Leave,
  CreateLeaveDto,
  EmployeeAttendanceRow,
  HrDashboardStats,
  EmployeeStatus,
  OrderType,
  OrderStatus,
  LeaveType,
  LeaveStatus,
} from '@/types/hr';
import type { PaginatedResponse } from '@/types/common';
import type { IHrService } from '../services/hr.service';

// ===== Reference data =====

const POSITIONS = [
  { code: 'rektor', name: 'Rektor' },
  { code: 'prorektor', name: 'Prorektor' },
  { code: 'dekan', name: 'Dekan' },
  { code: 'kafedra-mudiri', name: 'Kafedra mudiri' },
  { code: 'professor', name: 'Professor' },
  { code: 'dotsent', name: 'Dotsent' },
  { code: 'katta-oqituvchi', name: "Katta o'qituvchi" },
  { code: 'oqituvchi', name: "O'qituvchi" },
  { code: 'assistent', name: 'Assistent' },
  { code: 'laborant', name: 'Laborant' },
  { code: 'buxgalter', name: 'Buxgalter' },
  { code: 'boshqaruvchi', name: 'Boshqaruvchi' },
];

const DEGREES = [
  { code: 'dsc', name: 'Fan doktori (DSc)' },
  { code: 'phd', name: 'PhD' },
  { code: 'fan-nomzodi', name: 'Fan nomzodi' },
  { code: 'magistr', name: 'Magistr' },
  { code: 'bakalavr', name: 'Bakalavr' },
  { code: 'no-degree', name: 'Ilmiy darajasiz' },
];

const RANKS = [
  { code: 'professor', name: 'Professor' },
  { code: 'dotsent', name: 'Dotsent' },
  { code: 'no-rank', name: "Yo'q" },
];

const EMPL_TYPES = [
  { code: 'full', name: 'Asosiy' },
  { code: 'partial', name: "O'rindosh" },
  { code: 'contract', name: 'Soatbay' },
];

// ===== Departments (22) =====

const HR_DEPARTMENTS_SEED: HrDepartment[] = [
  // Rektorat
  { id: 1, name: 'Rektorat', code: 'REK', type: 'rektorat', parentId: null, headId: 1000, headName: 'Ibragimov O.M.', employeeCount: 8 },
  // 5 Fakultetlar
  { id: 2, name: 'Filologiya fakulteti', code: 'FIL', type: 'fakultet', parentId: null, headId: 1003, headName: 'Toshmatov R.Q.', employeeCount: 42 },
  { id: 3, name: 'Aniq, tabiiy va texnik fanlar fakulteti', code: 'ATF', type: 'fakultet', parentId: null, headId: 1006, headName: 'Mirzayev A.S.', employeeCount: 56 },
  { id: 4, name: 'Iqtisodiyot va AT fakulteti', code: 'IAT', type: 'fakultet', parentId: null, headId: 1009, headName: 'Abdullayev J.K.', employeeCount: 51 },
  { id: 5, name: 'Ijtimoiy-gumanitar fanlar fakulteti', code: 'IGF', type: 'fakultet', parentId: null, headId: 1012, headName: 'Norqulov B.T.', employeeCount: 38 },
  { id: 6, name: "Pedagogika va psixologiya fakulteti", code: 'PPF', type: 'fakultet', parentId: null, headId: 1015, headName: 'Ergasheva D.N.', employeeCount: 34 },
  // 15 Kafedralar
  { id: 7, name: 'Ingliz tili kafedrasi', code: 'ING', type: 'kafedra', parentId: 2, headId: 1018, headName: 'Karimov J.A.', employeeCount: 18 },
  { id: 8, name: "O'zbek tili va adabiyoti kafedrasi", code: 'UZB', type: 'kafedra', parentId: 2, headId: 1021, headName: 'Saidova N.R.', employeeCount: 14 },
  { id: 9, name: 'Tarjimashunoslik kafedrasi', code: 'TRJ', type: 'kafedra', parentId: 2, headId: 1024, headName: 'Yusupova M.K.', employeeCount: 10 },
  { id: 10, name: 'Matematika kafedrasi', code: 'MAT', type: 'kafedra', parentId: 3, headId: 1027, headName: 'Tursunov S.B.', employeeCount: 16 },
  { id: 11, name: 'Informatika va dasturlash kafedrasi', code: 'INF', type: 'kafedra', parentId: 3, headId: 1030, headName: 'Sobirova G.I.', employeeCount: 22 },
  { id: 12, name: 'Fizika va astronomiya kafedrasi', code: 'FIZ', type: 'kafedra', parentId: 3, headId: 1033, headName: 'Qodirov R.M.', employeeCount: 12 },
  { id: 13, name: 'Iqtisodiyot nazariyasi kafedrasi', code: 'IQT', type: 'kafedra', parentId: 4, headId: 1036, headName: 'Hasanov A.B.', employeeCount: 19 },
  { id: 14, name: 'Menejment va marketing kafedrasi', code: 'MEN', type: 'kafedra', parentId: 4, headId: 1039, headName: 'Ismoilova F.T.', employeeCount: 14 },
  { id: 15, name: 'Axborot texnologiyalari kafedrasi', code: 'AXT', type: 'kafedra', parentId: 4, headId: 1042, headName: 'Komilov D.S.', employeeCount: 18 },
  { id: 16, name: 'Tarix kafedrasi', code: 'TAR', type: 'kafedra', parentId: 5, headId: 1045, headName: 'Olimov N.R.', employeeCount: 11 },
  { id: 17, name: 'Falsafa va sotsiologiya kafedrasi', code: 'FAL', type: 'kafedra', parentId: 5, headId: null, headName: null, employeeCount: 9 },
  { id: 18, name: 'Pedagogika kafedrasi', code: 'PED', type: 'kafedra', parentId: 6, headId: null, headName: null, employeeCount: 18 },
  { id: 19, name: 'Psixologiya kafedrasi', code: 'PSX', type: 'kafedra', parentId: 6, headId: null, headName: null, employeeCount: 12 },
  { id: 20, name: 'Jismoniy tarbiya kafedrasi', code: 'JTK', type: 'kafedra', parentId: 5, headId: null, headName: null, employeeCount: 8 },
  { id: 21, name: 'Kimyo va biologiya kafedrasi', code: 'KIM', type: 'kafedra', parentId: 3, headId: null, headName: null, employeeCount: 10 },
  // 1 Boshqa (admin)
  { id: 22, name: "Kadrlar bo'limi", code: 'KAD', type: 'bolim', parentId: 1, headId: null, headName: null, employeeCount: 5 },
];

// ===== Employee name data =====

const SURNAMES = [
  'Karimov', 'Rahimov', 'Toshmatov', 'Xolmatova', 'Yusupova',
  'Mirzayev', 'Saidova', 'Abdullayev', 'Norqulov', 'Ergasheva',
  'Tursunov', 'Sobirova', 'Qodirov', 'Hasanov', 'Ismoilova',
  'Komilov', 'Olimov', 'Bekmurodov', 'Salimova', 'Tojiddinov',
  'Aliyeva', 'Nurmatov', 'Pardayeva', 'Sharipova', 'Yoqubov',
  'Latipov', 'Mahmudova', 'Rasulov', 'Shukurov', 'Ergashev',
];

const FIRST_NAMES = [
  'Jasur', 'Sardor', 'Bekzod', 'Madina', 'Dilnoza',
  'Otabek', 'Nilufar', 'Aziz', 'Jahongir', 'Sevara',
  'Akbar', 'Gulnora', 'Ravshan', 'Doniyor', 'Marjona',
  'Sanjarbek', 'Bobur', 'Mohira', 'Asilbek', 'Sevinch',
  'Mirzohid', 'Iroda', 'Nurbek', 'Nigora', 'Shoxrux',
  'Feruza', 'Eldor', 'Lola', 'Botir', 'Komila',
  'Farhod', 'Dilshoda', 'Rustam', 'Zulfiya', 'Anvar',
  'Nafisa', 'Baxtiyor', 'Dilorom', 'Sherzod', 'Sabohat',
  'Ulugbek', 'Yulduz', 'Nodir', 'Malika', 'Timur',
  'Barno', 'Alisher', 'Kamola', 'Sanjar', 'Hilola',
];

const FEMALE_NAMES = new Set([
  'Madina', 'Dilnoza', 'Nilufar', 'Sevara', 'Gulnora', 'Marjona',
  'Mohira', 'Sevinch', 'Iroda', 'Nigora', 'Feruza', 'Lola', 'Komila',
  'Dilshoda', 'Zulfiya', 'Nafisa', 'Dilorom', 'Sabohat', 'Yulduz',
  'Malika', 'Barno', 'Kamola', 'Hilola',
  'Xolmatova', 'Yusupova', 'Saidova', 'Ergasheva', 'Sobirova',
  'Ismoilova', 'Salimova', 'Aliyeva', 'Pardayeva', 'Sharipova', 'Mahmudova',
]);

// ===== Seed helpers =====

function seedRand(i: number, mod: number): number {
  return Math.abs((i * 9301 + 49297) % 233280) % mod;
}

function generateEmployees(): Employee[] {
  const targetDepts = HR_DEPARTMENTS_SEED.filter(
    (d) => d.type === 'kafedra' || d.type === 'bolim',
  );
  const employees: Employee[] = [];

  for (let i = 0; i < 50; i++) {
    const dept = targetDepts[i % targetDepts.length]!;
    const surname = SURNAMES[i % SURNAMES.length]!;
    const firstname = FIRST_NAMES[(i * 7) % FIRST_NAMES.length]!;
    const isFemale = FEMALE_NAMES.has(firstname) || FEMALE_NAMES.has(surname);
    const middleBase = FIRST_NAMES[(i * 11) % FIRST_NAMES.length]!;
    const thirdName = isFemale ? `${middleBase} qizi` : `${middleBase} o'g'li`;

    const posIdx =
      dept.type === 'bolim'
        ? 9 + (i % 3)
        : 4 + (i % 6);
    const position = POSITIONS[Math.min(posIdx, POSITIONS.length - 1)]!;

    const hireDate = new Date(2018 + (i % 8), i % 12, 1 + seedRand(i, 28));
    const birthDate = new Date(1965 + (i % 30), i % 12, 1 + seedRand(i + 1, 28));

    const degreeIdx =
      position.code === 'professor' ? 0
        : position.code === 'dotsent' ? 1
          : position.code === 'kafedra-mudiri' ? 1
            : position.code === 'katta-oqituvchi' ? 2
              : position.code === 'assistent' ? 3
                : 5;
    const rankIdx =
      position.code === 'professor' ? 0
        : position.code === 'dotsent' ? 1
          : 2;

    const baseSalary = 4_500_000 + seedRand(i + 3, 30) * 100_000;

    const statuses: EmployeeStatus[] = ['active', 'leave', 'business_trip', 'inactive'];
    const status: EmployeeStatus =
      i % 19 === 0 ? statuses[1]!
        : i % 23 === 0 ? statuses[2]!
          : i % 47 === 0 ? statuses[3]!
            : statuses[0]!;

    const degree = DEGREES[Math.min(degreeIdx, DEGREES.length - 1)]!;
    const rank = RANKS[Math.min(rankIdx, RANKS.length - 1)]!;
    const emplType = EMPL_TYPES[i % EMPL_TYPES.length]!;

    employees.push({
      id: 1000 + i,
      employeeIdNumber: '46' + String(330000 + i * 173).padStart(8, '0').slice(0, 8),
      fullName: `${surname} ${firstname} ${thirdName}`,
      firstName: firstname,
      secondName: surname,
      thirdName,
      shortName: `${surname} ${firstname[0]}.${thirdName[0]}.`,
      gender: isFemale ? { code: '2', name: 'Ayol' } : { code: '1', name: 'Erkak' },
      birthDate: birthDate.toISOString().slice(0, 10),
      department: dept,
      position: { code: position.code, name: position.name },
      academicDegree: { code: degree.code, name: degree.name },
      academicRank: { code: rank.code, name: rank.name },
      employmentForm: { code: emplType.code, name: emplType.name },
      hireDate: hireDate.toISOString().slice(0, 10),
      contractDate: hireDate.toISOString().slice(0, 10),
      contractNumber: `XK-${2018 + (i % 8)}/${String(i + 1).padStart(3, '0')}`,
      phone: `+998 (90) ${String(100 + i).slice(0, 3)}-${String(10 + i).padStart(2, '0')}-${String(50 + i).slice(0, 2)}`,
      email: `${surname.toLowerCase()}.${firstname[0]!.toLowerCase()}@uni.uz`,
      passport: `AB ${String(1000000 + i * 1737).slice(0, 7)}`,
      pinfl: String(30000000000000 + i * 1739).slice(0, 14),
      salary: baseSalary,
      experience: { years: 2026 - hireDate.getFullYear(), months: 0 },
      status,
      image: null,
    });
  }

  return employees;
}

// ===== Orders (18) =====

interface OrderTypeInfo {
  code: OrderType;
  name: string;
  color: string;
}

const ORDER_TYPES: OrderTypeInfo[] = [
  { code: 'hire', name: 'Ishga qabul qilish', color: '#2DB976' },
  { code: 'fire', name: "Ishdan bo'shatish", color: '#EF4444' },
  { code: 'promotion', name: "Lavozimga ko'tarish", color: '#3B82F6' },
  { code: 'salary_change', name: "Maosh o'zgarishi", color: '#F59E0B' },
  { code: 'leave', name: "Ta'tilga jo'natish", color: '#8B5CF6' },
  { code: 'business_trip', name: 'Xizmat safari', color: '#0891B2' },
  { code: 'bonus', name: 'Mukofotlash', color: '#10B981' },
  { code: 'penalty', name: "Hayfsan e'lon qilish", color: '#DC2626' },
  { code: 'transfer', name: "Bo'limga ko'chirish", color: '#6366F1' },
];

function generateOrders(employees: Employee[]): HrOrder[] {
  const orders: HrOrder[] = [];
  const statusOptions: OrderStatus[] = ['draft', 'review', 'signed', 'cancelled'];

  for (let i = 0; i < 18; i++) {
    const t = ORDER_TYPES[i % ORDER_TYPES.length]!;
    const emp = employees[(i * 3) % employees.length]!;
    const date = new Date(2026, 3, 1 + i);

    const status: OrderStatus =
      i % 7 === 0 ? statusOptions[0]!
        : i % 11 === 0 ? statusOptions[1]!
          : i % 13 === 0 ? statusOptions[3]!
            : statusOptions[2]!;

    orders.push({
      id: `BUY-${String(i + 1).padStart(3, '0')}`,
      number: `${i + 145}-K`,
      type: t.code,
      typeLabel: t.name,
      typeColor: t.color,
      title: `${emp.fullName} ga doir buyruq — ${t.name}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      date: date.toISOString().slice(0, 10),
      effectiveDate: date.toISOString().slice(0, 10),
      signer: 'Rektor Ibragimov O.M.',
      basis:
        t.code === 'hire'
          ? 'Mehnat shartnomasi'
          : t.code === 'leave'
            ? 'Xodim arizasi'
            : 'Mehnat shartnomasi',
      status,
      createdAt: date.toISOString().slice(0, 10),
    });
  }
  return orders;
}

// ===== Leaves (14) =====

interface LeaveTypeInfo {
  code: LeaveType;
  name: string;
}

const LEAVE_TYPES: LeaveTypeInfo[] = [
  { code: 'annual', name: "Mehnat ta'tili" },
  { code: 'study', name: "O'qish ta'tili" },
  { code: 'maternity', name: "Tug'ruq ta'tili" },
  { code: 'unpaid', name: "Behaq ta'til" },
  { code: 'business_trip', name: 'Xizmat safari' },
  { code: 'sick', name: 'Kasallik varaqasi' },
];

function generateLeaves(employees: Employee[]): Leave[] {
  const leaves: Leave[] = [];
  const statusOptions: LeaveStatus[] = ['pending', 'approved', 'rejected'];

  for (let i = 0; i < 14; i++) {
    const t = LEAVE_TYPES[i % LEAVE_TYPES.length]!;
    const emp = employees[(i * 5) % employees.length]!;
    const start = new Date(2026, 3, 1 + i * 2);
    const days = 5 + (i % 20);
    const end = new Date(start);
    end.setDate(end.getDate() + days);

    const status: LeaveStatus =
      i % 5 === 0 ? statusOptions[0]!
        : i % 7 === 0 ? statusOptions[2]!
          : statusOptions[1]!;

    leaves.push({
      id: `TT-${String(i + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      departmentName: emp.department.name,
      type: t.code,
      typeLabel: t.name,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      days,
      destination: t.code === 'business_trip' ? 'Toshkent sh.' : null,
      reason:
        t.code === 'annual'
          ? "Yillik mehnat ta'tili"
          : t.code === 'business_trip'
            ? 'Konferensiyada qatnashish'
            : 'Shaxsiy sabab',
      status,
      createdAt: start.toISOString().slice(0, 10),
    });
  }
  return leaves;
}

// ===== Attendance =====

type AttendanceDayStatus = 'present' | 'absent' | 'leave' | 'sick' | 'business_trip' | 'weekend';

function generateAttendance(employees: Employee[]): EmployeeAttendanceRow[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return employees.map((emp) => {
    const days: { date: string; status: AttendanceDayStatus }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      if (dow === 0 || dow === 6) {
        days.push({ date: date.toISOString().slice(0, 10), status: 'weekend' });
        continue;
      }
      const v = (emp.id * 7 + d * 13) % 100;
      let status: AttendanceDayStatus;
      if (v < 4) status = 'absent';
      else if (v < 8) status = 'leave';
      else if (v < 11) status = 'sick';
      else if (v < 14) status = 'business_trip';
      else status = 'present';
      days.push({ date: date.toISOString().slice(0, 10), status });
    }
    return {
      employeeId: emp.id,
      employeeName: emp.shortName,
      department: emp.department.name,
      days,
    };
  });
}

// ===== Initialize seed data =====

const allEmployees = generateEmployees();
const allDepartments = [...HR_DEPARTMENTS_SEED];
let allOrders = generateOrders(allEmployees);
let allLeaves = generateLeaves(allEmployees);

// ===== Mock service implementation =====

export class HrMockService implements IHrService {
  async getEmployees(
    params?: EmployeeListParams,
  ): Promise<PaginatedResponse<EmployeeListItem>> {
    await delay(300);

    let filtered = [...allEmployees];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeIdNumber.includes(q),
      );
    }
    if (params?.departmentId) {
      filtered = filtered.filter(
        (e) => e.department.id === params.departmentId,
      );
    }
    if (params?.positionCode) {
      filtered = filtered.filter(
        (e) => e.position.code === params.positionCode,
      );
    }
    if (params?.degreeCode) {
      filtered = filtered.filter(
        (e) => e.academicDegree.code === params.degreeCode,
      );
    }
    if (params?.status) {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data: EmployeeListItem[] = filtered
      .slice(start, start + pageSize)
      .map((e) => ({
        id: e.id,
        fullName: e.fullName,
        shortName: e.shortName,
        employeeIdNumber: e.employeeIdNumber,
        department: e.department,
        position: e.position,
        academicDegree: e.academicDegree,
        academicRank: e.academicRank,
        status: e.status,
        image: e.image,
      }));

    return { data, total, page, pageSize, totalPages };
  }

  async getEmployeeById(id: number): Promise<Employee> {
    await delay(200);
    const emp = allEmployees.find((e) => e.id === id);
    if (!emp) throw new Error('Xodim topilmadi');
    return emp;
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<Employee> {
    await delay(300);
    const dept = allDepartments.find((d) => d.id === dto.departmentId);
    if (!dept) throw new Error("Bo'lim topilmadi");
    const pos = POSITIONS.find((p) => p.code === dto.positionCode);
    const degree = DEGREES.find((d) => d.code === dto.academicDegree);
    const rank = RANKS.find((r) => r.code === dto.academicRank);
    const emplType = EMPL_TYPES.find((e) => e.code === dto.employmentForm);

    const id = Math.max(...allEmployees.map((e) => e.id), 1000) + 1;
    const employee: Employee = {
      id,
      employeeIdNumber: '46' + String(Date.now()).slice(-8),
      fullName: `${dto.secondName} ${dto.firstName} ${dto.thirdName}`,
      firstName: dto.firstName,
      secondName: dto.secondName,
      thirdName: dto.thirdName,
      shortName: `${dto.secondName} ${dto.firstName[0]}.${dto.thirdName[0]}.`,
      gender: dto.gender === '2' ? { code: '2', name: 'Ayol' } : { code: '1', name: 'Erkak' },
      birthDate: dto.birthDate,
      department: dept,
      position: pos ? { code: pos.code, name: pos.name } : { code: dto.positionCode, name: dto.positionCode },
      academicDegree: degree ? { code: degree.code, name: degree.name } : { code: dto.academicDegree, name: dto.academicDegree },
      academicRank: rank ? { code: rank.code, name: rank.name } : { code: dto.academicRank, name: dto.academicRank },
      employmentForm: emplType ? { code: emplType.code, name: emplType.name } : { code: dto.employmentForm, name: dto.employmentForm },
      hireDate: dto.hireDate,
      contractDate: dto.hireDate,
      contractNumber: `XK-2026/${String(id).padStart(3, '0')}`,
      phone: dto.phone,
      email: dto.email,
      passport: dto.passport,
      pinfl: dto.pinfl,
      salary: dto.salary,
      experience: { years: 0, months: 0 },
      status: 'active',
      image: null,
    };
    allEmployees.push(employee);
    return employee;
  }

  async updateEmployee(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    await delay(200);
    const idx = allEmployees.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Xodim topilmadi');
    const existing = allEmployees[idx]!;
    const updated: Employee = { ...existing };

    if (dto.firstName !== undefined) updated.firstName = dto.firstName;
    if (dto.secondName !== undefined) updated.secondName = dto.secondName;
    if (dto.thirdName !== undefined) updated.thirdName = dto.thirdName;
    if (dto.firstName || dto.secondName || dto.thirdName) {
      updated.fullName = `${updated.secondName} ${updated.firstName} ${updated.thirdName}`;
      updated.shortName = `${updated.secondName} ${updated.firstName[0]}.${updated.thirdName[0]}.`;
    }
    if (dto.phone !== undefined) updated.phone = dto.phone;
    if (dto.email !== undefined) updated.email = dto.email;
    if (dto.salary !== undefined) updated.salary = dto.salary;

    allEmployees[idx] = updated;
    return updated;
  }

  async deleteEmployee(id: number): Promise<void> {
    await delay(200);
    const idx = allEmployees.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Xodim topilmadi');
    allEmployees.splice(idx, 1);
  }

  async getDepartments(): Promise<HrDepartment[]> {
    await delay(200);
    return [...allDepartments];
  }

  async getOrders(): Promise<HrOrder[]> {
    await delay(200);
    return [...allOrders];
  }

  async createOrder(dto: CreateOrderDto): Promise<HrOrder> {
    await delay(300);
    const emp = allEmployees.find((e) => e.id === dto.employeeId);
    const typeInfo = ORDER_TYPES.find((t) => t.code === dto.type);
    const id = `BUY-${String(allOrders.length + 1).padStart(3, '0')}`;
    const order: HrOrder = {
      id,
      number: `${allOrders.length + 145}-K`,
      type: dto.type,
      typeLabel: typeInfo?.name ?? dto.type,
      typeColor: typeInfo?.color ?? '#64748B',
      title: dto.title,
      employeeId: dto.employeeId,
      employeeName: emp?.fullName ?? 'Noma\'lum',
      date: new Date().toISOString().slice(0, 10),
      effectiveDate: dto.effectiveDate,
      signer: 'Rektor Ibragimov O.M.',
      basis: dto.basis,
      status: 'draft',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    allOrders = [...allOrders, order];
    return order;
  }

  async getLeaves(): Promise<Leave[]> {
    await delay(200);
    return [...allLeaves];
  }

  async createLeave(dto: CreateLeaveDto): Promise<Leave> {
    await delay(300);
    const emp = allEmployees.find((e) => e.id === dto.employeeId);
    const typeInfo = LEAVE_TYPES.find((t) => t.code === dto.type);
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const days = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const id = `TT-${String(allLeaves.length + 1).padStart(3, '0')}`;
    const leave: Leave = {
      id,
      employeeId: dto.employeeId,
      employeeName: emp?.fullName ?? 'Noma\'lum',
      departmentName: emp?.department.name ?? '',
      type: dto.type,
      typeLabel: typeInfo?.name ?? dto.type,
      startDate: dto.startDate,
      endDate: dto.endDate,
      days,
      destination: dto.destination ?? null,
      reason: dto.reason,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    allLeaves = [...allLeaves, leave];
    return leave;
  }

  async updateLeave(
    id: string,
    patch: Partial<Pick<Leave, 'status'>>,
  ): Promise<Leave> {
    await delay(200);
    const idx = allLeaves.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('Ariza topilmadi');
    const updated = { ...allLeaves[idx]!, ...patch };
    allLeaves = allLeaves.map((l) => (l.id === id ? updated : l));
    return updated;
  }

  async getAttendance(departmentId?: number): Promise<EmployeeAttendanceRow[]> {
    await delay(300);
    const emps = departmentId
      ? allEmployees.filter((e) => e.department.id === departmentId)
      : allEmployees;
    return generateAttendance(emps.slice(0, 30));
  }

  async getDashboardStats(): Promise<HrDashboardStats> {
    await delay(200);
    const total = allEmployees.length;
    const active = allEmployees.filter((e) => e.status === 'active').length;
    const onLeave = allEmployees.filter((e) => e.status === 'leave').length;
    const onTrip = allEmployees.filter(
      (e) => e.status === 'business_trip',
    ).length;
    const pendingOrders = allOrders.filter(
      (o) => o.status === 'draft' || o.status === 'review',
    ).length;
    const pendingLeaves = allLeaves.filter(
      (l) => l.status === 'pending',
    ).length;

    // By department
    const deptCounts = allDepartments
      .filter((d) => d.type === 'fakultet')
      .map((d) => ({
        department: d.name.replace(' fakulteti', ''),
        count: allEmployees.filter((e) => {
          if (e.department.id === d.id) return true;
          const childDepts = allDepartments
            .filter((ch) => ch.parentId === d.id)
            .map((ch) => ch.id);
          return childDepts.includes(e.department.id);
        }).length,
      }));

    // By age
    const now = new Date();
    const ageBuckets: Record<string, number> = {
      '<30': 0,
      '30-40': 0,
      '40-50': 0,
      '50-60': 0,
      '60+': 0,
    };
    for (const e of allEmployees) {
      const age = now.getFullYear() - new Date(e.birthDate).getFullYear();
      if (age < 30) ageBuckets['<30']!++;
      else if (age < 40) ageBuckets['30-40']!++;
      else if (age < 50) ageBuckets['40-50']!++;
      else if (age < 60) ageBuckets['50-60']!++;
      else ageBuckets['60+']!++;
    }

    const byAge = Object.entries(ageBuckets).map(([range, count]) => ({
      range,
      count,
    }));

    const recentOrders = allOrders.slice(0, 5);

    return {
      totalEmployees: total,
      activeEmployees: active,
      onLeave,
      onBusinessTrip: onTrip,
      pendingOrders,
      pendingLeaves,
      byDepartment: deptCounts,
      byAge,
      recentOrders,
    };
  }
}
