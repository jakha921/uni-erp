import { delay } from './delay';
import type {
  PayrollEmployee,
  PayrollListParams,
  PayrollSummary,
} from '@/types/finance';
import type { PaginatedResponse } from '@/types/common';
import type { IPayrollService } from '../services/payroll.service';

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
const DEPARTMENTS = [
  { id: 1, name: 'Kompyuter fanlari' },
  { id: 2, name: 'Iqtisodiyot' },
  { id: 3, name: 'Pedagogika' },
  { id: 4, name: 'Filologiya' },
  { id: 5, name: 'Matematika' },
  { id: 6, name: "Rektor devoni" },
  { id: 7, name: 'Buxgalteriya' },
  { id: 8, name: "Xo'jalik bo'limi" },
] as const;

const POSITIONS = [
  'Professor',
  'Dotsent',
  'Katta o\'qituvchi',
  'O\'qituvchi',
  'Assistent',
  'Laborant',
  'Buxgalter',
  'Muhandis',
  'Kutubxonachi',
  'Texnik xodim',
] as const;

const FIRST_NAMES = [
  'Jasur', 'Sardor', 'Bekzod', 'Otabek', 'Aziz',
  'Madina', 'Dilnoza', 'Nilufar', 'Sevara', 'Gulnora',
  'Jahongir', 'Akbar', 'Ravshan', 'Doniyor', 'Sanjarbek',
  'Shahnoza', 'Marjona', 'Zilola', 'Mohira', 'Sevinch',
  'Bobur', 'Asilbek', 'Mirzohid', 'Nurbek', 'Shoxrux',
  'Iroda', 'Nigora', 'Feruza', 'Lola', 'Munisa',
] as const;

const SURNAMES = [
  'Karimov', 'Rahimov', 'Toshmatov', 'Xolmatov', 'Yusupov',
  'Mirzayev', 'Saidov', 'Abdullayev', 'Norqulov', 'Ergashev',
  'Tursunov', 'Sobirova', 'Qodirov', 'Hasanov', 'Ismoilov',
  'Komilov', 'Olimov', 'Bekmurodov', 'Salimov', 'Tojiddinov',
  'Aliyev', 'Nurmatov', 'Sharipov', 'Yoqubov', 'Latipov',
  'Mahmudov', 'Rasulov', 'Shukurov', 'Nazarov', 'Shodiyev',
] as const;

// ---------- Generate 30 payroll employees ----------
function generatePayrollEmployees(): PayrollEmployee[] {
  const result: PayrollEmployee[] = [];
  const statuses: PayrollEmployee['status'][] = ['paid', 'pending', 'processing'];

  for (let i = 0; i < 30; i++) {
    const dept = DEPARTMENTS[i % DEPARTMENTS.length]!;
    const position = pick(POSITIONS, i * 7);
    const firstName = pick(FIRST_NAMES, i * 11);
    const surname = pick(SURNAMES, i * 13);

    // Realistic salary ranges based on position (in UZS)
    let baseSalary: number;
    if (position === 'Professor') {
      baseSalary = rnum(i * 17, 8000000, 12000000);
    } else if (position === 'Dotsent') {
      baseSalary = rnum(i * 17, 6000000, 9000000);
    } else if (position === 'Katta o\'qituvchi') {
      baseSalary = rnum(i * 17, 5000000, 7500000);
    } else if (position === 'O\'qituvchi' || position === 'Assistent') {
      baseSalary = rnum(i * 17, 4000000, 6000000);
    } else {
      baseSalary = rnum(i * 17, 3000000, 5000000);
    }

    const bonus = rnum(i * 19, 0, 3) > 0 ? rnum(i * 23, 500000, 2500000) : 0;
    const deductions = rnum(i * 29, 200000, 800000);
    const netSalary = baseSalary + bonus - deductions;

    // 60% paid, 25% pending, 15% processing
    const statusRoll = seedRand(i * 31);
    const status: PayrollEmployee['status'] =
      statusRoll < 0.6 ? 'paid' : statusRoll < 0.85 ? 'pending' : 'processing';

    // Suppress unused variable warning
    void statuses;

    result.push({
      id: i + 1,
      employeeId: 5000 + i,
      employeeName: `${surname} ${firstName}`,
      department: dept.name,
      position,
      baseSalary,
      bonus,
      deductions,
      netSalary,
      status,
    });
  }

  return result;
}

const ALL_PAYROLL = generatePayrollEmployees();

export class PayrollMockService implements IPayrollService {
  async getPayroll(params: PayrollListParams): Promise<PaginatedResponse<PayrollEmployee>> {
    await delay(300);

    let filtered = [...ALL_PAYROLL];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.employeeName.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q),
      );
    }

    if (params.departmentId) {
      const dept = DEPARTMENTS.find((d) => d.id === params.departmentId);
      if (dept) {
        filtered = filtered.filter((e) => e.department === dept.name);
      }
    }

    if (params.status) {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getPayrollSummary(_month: number, _year: number): Promise<PayrollSummary> {
    await delay(300);

    const employees = ALL_PAYROLL;
    const totalBase = employees.reduce((s, e) => s + e.baseSalary, 0);
    const totalBonus = employees.reduce((s, e) => s + e.bonus, 0);
    const totalDeductions = employees.reduce((s, e) => s + e.deductions, 0);
    const totalNet = employees.reduce((s, e) => s + e.netSalary, 0);
    const paidCount = employees.filter((e) => e.status === 'paid').length;
    const pendingCount = employees.filter((e) => e.status !== 'paid').length;

    return {
      totalEmployees: employees.length,
      totalBase,
      totalBonus,
      totalDeductions,
      totalNet,
      paidCount,
      pendingCount,
    };
  }

  async processPayroll(_month: number, _year: number): Promise<{ processed: number }> {
    await delay(500);
    const pendingCount = ALL_PAYROLL.filter((e) => e.status === 'pending').length;
    // Simulate processing: mark all pending as paid
    for (const e of ALL_PAYROLL) {
      if (e.status === 'pending') {
        e.status = 'paid';
      }
    }
    return { processed: pendingCount };
  }
}
