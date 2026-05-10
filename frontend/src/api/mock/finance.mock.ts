import { delay } from './delay';
import type {
  Contract,
  ContractListParams,
  ContractType,
  CreateContractDto,
  CreatePaymentDto,
  CreateScholarshipDto,
  FinanceDashboardStats,
  Payment,
  PaymentListParams,
  PaymentMethod,
  PaymentScheduleItem,
  Scholarship,
  ScholarshipType,
} from '@/types/finance';
import type { PaginatedResponse } from '@/types/common';
import type { IFinanceService } from '../services/finance.service';
import { generateId } from '@/lib/utils';

// ============ SEED DATA ============

interface Faculty {
  id: number;
  name: string;
}

const FACULTIES: Faculty[] = [
  { id: 1, name: "Filologiya va tillarni o'qitish" },
  { id: 13, name: 'Aniq, tabiiy va texnik' },
  { id: 14, name: 'Iqtisodiyot va axborot texnologiyalari' },
  { id: 18, name: 'Ijtimoiy-gumanitar' },
  { id: 22, name: "Pedagogika va psixologiya" },
];

const UZBEK_NAMES: [string, string, string][] = [
  ['Karimov', 'Jasur', "Bahodir o'g'li"],
  ['Rahimov', 'Sardor', "Anvar o'g'li"],
  ['Toshmatov', 'Bekzod', "Rustam o'g'li"],
  ['Xolmatova', 'Madina', 'Akmal qizi'],
  ['Yusupova', 'Dilnoza', 'Sanjar qizi'],
  ['Mirzayev', 'Otabek', "Nodir o'g'li"],
  ['Saidova', 'Nilufar', 'Bobur qizi'],
  ['Abdullayev', 'Aziz', "Shavkat o'g'li"],
  ['Norqulov', 'Jahongir', "Davron o'g'li"],
  ['Ergasheva', 'Sevara', "Ulug'bek qizi"],
  ['Tursunov', 'Akbar', "Farxod o'g'li"],
  ['Sobirova', 'Gulnora', 'Tohir qizi'],
  ['Qodirov', 'Ravshan', "Ilxom o'g'li"],
  ['Najmiddinova', 'Shahnoza', 'Murod qizi'],
  ['Hasanov', 'Doniyor', "Olim o'g'li"],
  ['Ismoilova', 'Marjona', 'Ergash qizi'],
  ['Komilov', 'Sanjarbek', "Yusuf o'g'li"],
  ['Rashidova', 'Zilola', 'Komil qizi'],
  ['Olimov', 'Bobur', "Hakim o'g'li"],
  ['Xudoyberdiyeva', 'Mohira', 'Salim qizi'],
  ['Mamatkulov', 'Asilbek', "Botir o'g'li"],
  ['Inoyatova', 'Sevinch', 'Jamol qizi'],
  ['Sodiqov', 'Mirzohid', "Toir o'g'li"],
  ['Salimova', 'Iroda', 'Vohid qizi'],
  ['Bekmurodov', 'Nurbek', "Karim o'g'li"],
  ['Xolmurodova', 'Nigora', 'Said qizi'],
  ['Tojiddinov', 'Shoxrux', "Olim o'g'li"],
  ['Aliyeva', 'Feruza', 'Bahrom qizi'],
  ['Nurmatov', 'Eldor', "Qaxxor o'g'li"],
  ['Pardayeva', 'Lola', 'Doniyor qizi'],
];

const GROUPS = [
  'ENG-1306-25',
  'IIT-2105-25',
  'MAT-1801-24',
  'ECO-2103-24',
  'PHY-1810-23',
  'CHM-1304-25',
  'INF-2104-25',
  'BIO-1801-24',
  'TUR-1306-25',
  'HIS-1810-25',
];

const SPECIALTIES = [
  "Filologiya va tillarni o'qitish (ingliz tili)",
  'Axborot xavfsizligi',
  'Matematika va informatika',
  'Iqtisodiyot va menejment',
  'Fizika va astronomiya',
  'Kimyo',
  'Dasturiy injiniring',
  'Biologiya',
  'Turizm',
  'Tarix',
];

const LEVELS = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'];
const CONTRACT_TYPES: ContractType[] = ['bazoviy', 'tabaqalashtirilgan', 'grant', 'xorijiy'];
const PAY_METHODS: PaymentMethod[] = ['bank', 'naqd', 'online', 'click', 'payme'];
const SCHOLARSHIP_TYPES: ScholarshipType[] = [
  'davlat',
  'prezident',
  'fanlar',
  'ijtimoiy',
  'maxsus',
];

const SCHOLARSHIP_TYPE_LABELS: Record<ScholarshipType, string> = {
  davlat: 'Davlat',
  prezident: 'Prezident',
  fanlar: 'Fanlar',
  ijtimoiy: 'Ijtimoiy',
  maxsus: 'Maxsus',
};

function seedRand(i: number, mod: number): number {
  return Math.abs(((i * 9301 + 49297) % 233280)) % mod;
}

function generateSeed() {
  // 30 contracts
  const contracts: Contract[] = [];
  for (let i = 0; i < 30; i++) {
    const nameEntry = UZBEK_NAMES[i % UZBEK_NAMES.length]!;
    const fac = FACULTIES[i % FACULTIES.length]!;
    const lvlIdx = i % 4;
    const studentName = `${nameEntry[0]} ${nameEntry[1]} ${nameEntry[2]}`;
    const studentId = 100000 + i;

    const amount = (12 + seedRand(i, 6)) * 1000000 + seedRand(i + 13, 10) * 100000;
    const payRatios = [0, 0.25, 0.5, 0.5, 0.6, 0.75, 1.0, 1.0, 0.4, 0.85];
    const payRatio = payRatios[i % 10]!;
    const paid = Math.round((amount * payRatio) / 100000) * 100000;
    const date = new Date(2025, 7 + (i % 3), 1 + (i % 28));

    const monthsCount = 2 + (i % 3);
    const installment = Math.round(amount / monthsCount / 100000) * 100000;
    const schedule: PaymentScheduleItem[] = [];
    let remaining = paid;
    for (let m = 0; m < monthsCount; m++) {
      const due = new Date(2025, 8 + m * 3, 15);
      const isPaid = remaining >= installment;
      if (isPaid) remaining -= installment;
      const dueStr = due.toISOString().slice(0, 10);
      const today = '2026-02-01';
      const overdue = !isPaid && dueStr < today;
      schedule.push({
        dueDate: dueStr,
        amount: m === monthsCount - 1 ? amount - installment * (monthsCount - 1) : installment,
        status: isPaid ? 'paid' : overdue ? 'overdue' : 'pending',
        paidDate: isPaid ? dueStr : undefined,
      });
    }

    contracts.push({
      id: 'CNT-' + String(i + 1).padStart(3, '0'),
      studentId,
      studentName,
      studentIdNumber: '46' + String(220000 + i * 137).slice(0, 6),
      facultyName: fac.name,
      facultyId: fac.id,
      groupName: GROUPS[i % GROUPS.length]!,
      level: LEVELS[lvlIdx]!,
      specialty: SPECIALTIES[i % SPECIALTIES.length]!,
      contractNumber: `SH-2025/${String(i + 1).padStart(3, '0')}`,
      contractDate: date.toISOString().slice(0, 10),
      contractType: CONTRACT_TYPES[i % 4]!,
      educationYear: '2025-2026',
      contractAmount: amount,
      paidAmount: paid,
      debtAmount: amount - paid,
      status: i % 13 === 0 ? 'cancelled' : i % 11 === 0 ? 'completed' : 'active',
      paymentSchedule: schedule,
      createdAt: date.toISOString().slice(0, 10),
    });
  }

  // 45 payments
  const payments: Payment[] = [];
  let payIdx = 0;
  for (const c of contracts) {
    if (c.paidAmount <= 0) continue;
    const paidSchedules = c.paymentSchedule.filter((s) => s.status === 'paid');
    for (let pi = 0; pi < paidSchedules.length; pi++) {
      if (payIdx >= 45) break;
      const sched = paidSchedules[pi]!;
      const d = new Date(sched.dueDate);
      d.setDate(d.getDate() - seedRand(payIdx + 7, 10));
      const payDate = d.toISOString().slice(0, 10);
      const ci = contracts.indexOf(c);
      payments.push({
        id: 'PAY-' + String(payIdx + 1).padStart(3, '0'),
        contractId: c.id,
        studentId: c.studentId,
        studentName: c.studentName,
        facultyName: c.facultyName,
        amount: sched.amount,
        paymentDate: payDate,
        paymentMethod: PAY_METHODS[(ci + pi) % 5]!,
        receiptNumber: `QT-${payDate.replace(/-/g, '')}-${String(payIdx + 1).padStart(3, '0')}`,
        note: '',
        createdAt: payDate,
      });
      payIdx++;
    }
  }

  // 10 scholarships
  const scholarships: Scholarship[] = [];
  const scholarshipAmounts: Record<ScholarshipType, number> = {
    davlat: 920000,
    prezident: 2500000,
    fanlar: 1500000,
    ijtimoiy: 600000,
    maxsus: 1200000,
  };
  for (let i = 0; i < 10; i++) {
    const nameEntry = UZBEK_NAMES[(i * 2) % UZBEK_NAMES.length]!;
    const fac = FACULTIES[i % FACULTIES.length]!;
    const sType = SCHOLARSHIP_TYPES[i % 5]!;
    const bases: Record<ScholarshipType, string> = {
      davlat: 'GPA 86+ ball',
      prezident: "Prezident qarori №PF-187",
      fanlar: "Fan olimpiadasi g'olibi",
      ijtimoiy: "Ijtimoiy ko'mak",
      maxsus: "Maxsus ko'rsatkichlar",
    };
    scholarships.push({
      id: 'STI-' + String(i + 1).padStart(3, '0'),
      studentId: 100000 + i * 2,
      studentName: `${nameEntry[0]} ${nameEntry[1]} ${nameEntry[2]}`,
      facultyName: fac.name,
      groupName: GROUPS[i % GROUPS.length]!,
      type: sType,
      typeLabel: SCHOLARSHIP_TYPE_LABELS[sType],
      amount: scholarshipAmounts[sType],
      startDate: '2025-09-01',
      endDate: '2026-06-30',
      status: i % 7 === 0 ? 'paused' : i % 9 === 0 ? 'completed' : 'active',
      basis: bases[sType],
    });
  }

  return { contracts, payments, scholarships };
}

// ============ MOCK SERVICE ============

const seed = generateSeed();
let contracts = [...seed.contracts];
let payments = [...seed.payments];
let scholarships = [...seed.scholarships];

export class FinanceMockService implements IFinanceService {
  // --- Contracts ---
  async getContracts(params?: ContractListParams): Promise<PaginatedResponse<Contract>> {
    await delay(300);
    let filtered = [...contracts];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.contractNumber.toLowerCase().includes(q) ||
          c.studentName.toLowerCase().includes(q) ||
          c.studentIdNumber.includes(q),
      );
    }
    if (params?.facultyId) {
      filtered = filtered.filter((c) => c.facultyId === params.facultyId);
    }
    if (params?.studentId) {
      filtered = filtered.filter((c) => c.studentId === params.studentId);
    }
    if (params?.status) {
      filtered = filtered.filter((c) => c.status === params.status);
    }
    if (params?.contractType) {
      filtered = filtered.filter((c) => c.contractType === params.contractType);
    }
    if (params?.educationYear) {
      filtered = filtered.filter((c) => c.educationYear === params.educationYear);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getContractById(id: string): Promise<Contract> {
    await delay(200);
    const contract = contracts.find((c) => c.id === id);
    if (!contract) throw new Error('Kontrakt topilmadi');
    return contract;
  }

  async createContract(dto: CreateContractDto): Promise<Contract> {
    await delay(400);
    const id = 'CNT-' + generateId();
    const schedule: PaymentScheduleItem[] = dto.paymentSchedule.map((s) => ({
      dueDate: s.dueDate,
      amount: s.amount,
      status: 'pending' as const,
    }));
    const contract: Contract = {
      id,
      studentId: dto.studentId,
      studentName: 'Yangi talaba',
      studentIdNumber: '46' + String(dto.studentId).slice(0, 6),
      facultyName: '',
      facultyId: 0,
      groupName: '',
      level: '',
      specialty: '',
      contractNumber: `SH-2025/${String(contracts.length + 1).padStart(3, '0')}`,
      contractDate: dto.contractDate,
      contractType: dto.contractType,
      educationYear: dto.educationYear,
      contractAmount: dto.contractAmount,
      paidAmount: 0,
      debtAmount: dto.contractAmount,
      status: 'active',
      paymentSchedule: schedule,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    contracts = [contract, ...contracts];
    return contract;
  }

  async updateContract(id: string, patch: Partial<Contract>): Promise<Contract> {
    await delay(300);
    const idx = contracts.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Kontrakt topilmadi');
    const existing = contracts[idx]!;
    const updated: Contract = {
      ...existing,
      ...patch,
      debtAmount:
        (patch.contractAmount ?? existing.contractAmount) -
        (patch.paidAmount ?? existing.paidAmount),
    };
    contracts = contracts.map((c) => (c.id === id ? updated : c));
    return updated;
  }

  async deleteContract(id: string): Promise<void> {
    await delay(200);
    contracts = contracts.filter((c) => c.id !== id);
    payments = payments.filter((p) => p.contractId !== id);
  }

  // --- Payments ---
  async getPayments(params?: PaymentListParams): Promise<PaginatedResponse<Payment>> {
    await delay(300);
    let filtered = [...payments];
    const today = new Date();

    if (params?.period && params.period !== 'all') {
      filtered = filtered.filter((p) => {
        const d = new Date(p.paymentDate);
        if (params.period === 'today') return d.toDateString() === today.toDateString();
        if (params.period === 'week') {
          const wkStart = new Date(today);
          wkStart.setDate(today.getDate() - 7);
          return d >= wkStart;
        }
        if (params.period === 'month') {
          return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
        }
        return true;
      });
    }
    if (params?.dateFrom) {
      filtered = filtered.filter((p) => p.paymentDate >= params.dateFrom!);
    }
    if (params?.dateTo) {
      filtered = filtered.filter((p) => p.paymentDate <= params.dateTo!);
    }
    if (params?.paymentMethod) {
      filtered = filtered.filter((p) => p.paymentMethod === params.paymentMethod);
    }
    if (params?.facultyId) {
      const facContracts = contracts
        .filter((c) => c.facultyId === params.facultyId)
        .map((c) => c.id);
      filtered = filtered.filter((p) => facContracts.includes(p.contractId));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.studentName.toLowerCase().includes(q) || p.receiptNumber.toLowerCase().includes(q),
      );
    }

    filtered.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 50;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    await delay(400);
    const contract = contracts.find((c) => c.id === dto.contractId);
    const id = 'PAY-' + generateId();
    const payment: Payment = {
      id,
      contractId: dto.contractId,
      studentId: contract?.studentId ?? 0,
      studentName: contract?.studentName ?? '',
      facultyName: contract?.facultyName ?? '',
      amount: dto.amount,
      paymentDate: dto.paymentDate,
      paymentMethod: dto.paymentMethod,
      receiptNumber: dto.receiptNumber,
      note: dto.note ?? '',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    payments = [payment, ...payments];

    // Update contract
    if (contract) {
      const newPaid = contract.paidAmount + dto.amount;
      contracts = contracts.map((c) =>
        c.id === dto.contractId
          ? { ...c, paidAmount: newPaid, debtAmount: Math.max(0, c.contractAmount - newPaid) }
          : c,
      );
    }

    return payment;
  }

  async deletePayment(id: string): Promise<void> {
    await delay(200);
    const payment = payments.find((p) => p.id === id);
    if (payment) {
      payments = payments.filter((p) => p.id !== id);
      contracts = contracts.map((c) => {
        if (c.id !== payment.contractId) return c;
        const newPaid = Math.max(0, c.paidAmount - payment.amount);
        return { ...c, paidAmount: newPaid, debtAmount: c.contractAmount - newPaid };
      });
    }
  }

  // --- Scholarships ---
  async getScholarships(params?: {
    type?: ScholarshipType;
    status?: string;
  }): Promise<Scholarship[]> {
    await delay(300);
    let filtered = [...scholarships];
    if (params?.type) {
      filtered = filtered.filter((s) => s.type === params.type);
    }
    if (params?.status) {
      filtered = filtered.filter((s) => s.status === params.status);
    }
    return filtered;
  }

  async createScholarship(dto: CreateScholarshipDto): Promise<Scholarship> {
    await delay(400);
    const id = 'STI-' + generateId();
    const sType = dto.type;
    const scholarship: Scholarship = {
      id,
      studentId: dto.studentId,
      studentName: '',
      facultyName: '',
      groupName: '',
      type: sType,
      typeLabel: SCHOLARSHIP_TYPE_LABELS[sType],
      amount: dto.amount,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: 'active',
      basis: dto.basis,
    };
    scholarships = [scholarship, ...scholarships];
    return scholarship;
  }

  async updateScholarship(id: string, patch: Partial<Scholarship>): Promise<Scholarship> {
    await delay(200);
    const idx = scholarships.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Stipendiya topilmadi');
    const existing = scholarships[idx]!;
    const updated = { ...existing, ...patch };
    scholarships = scholarships.map((s) => (s.id === id ? updated : s));
    return updated;
  }

  async deleteScholarship(id: string): Promise<void> {
    await delay(200);
    scholarships = scholarships.filter((s) => s.id !== id);
  }

  // --- Dashboard ---
  async getDashboardStats(): Promise<FinanceDashboardStats> {
    await delay(300);
    const total = contracts.reduce((s, c) => s + c.contractAmount, 0);
    const paid = contracts.reduce((s, c) => s + c.paidAmount, 0);
    const debt = total - paid;
    const collectionRate = total > 0 ? Math.round((paid / total) * 1000) / 10 : 0;
    const debtorCount = contracts.filter((c) => c.debtAmount > 0 && c.status === 'active').length;

    let full = 0;
    let partial = 0;
    let none = 0;
    for (const c of contracts) {
      if (c.paidAmount >= c.contractAmount) full++;
      else if (c.paidAmount > 0) partial++;
      else none++;
    }

    const byFaculty = FACULTIES.map((f) => {
      const facContracts = contracts.filter((c) => c.facultyId === f.id);
      const t = facContracts.reduce((s, c) => s + c.contractAmount, 0);
      const p = facContracts.reduce((s, c) => s + c.paidAmount, 0);
      return { faculty: f.name, total: t, paid: p, debt: t - p };
    });

    const now = new Date(2026, 1, 1);
    const byMonth: { month: string; amount: number }[] = [];
    const monthNames = [
      'Yan',
      'Fev',
      'Mar',
      'Apr',
      'May',
      'Iyn',
      'Iyl',
      'Avg',
      'Sen',
      'Okt',
      'Noy',
      'Dek',
    ];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const sum = payments
        .filter((p) => p.paymentDate.startsWith(key))
        .reduce((s, p) => s + p.amount, 0);
      byMonth.push({ month: monthNames[d.getMonth()]!, amount: sum });
    }

    const scholarshipTotal = scholarships
      .filter((s) => s.status === 'active')
      .reduce((s, sc) => s + sc.amount, 0);

    return {
      totalContracts: contracts.length,
      totalContractAmount: total,
      totalPaid: paid,
      totalDebt: debt,
      collectionRate,
      debtorCount,
      scholarshipCount: scholarships.length,
      scholarshipTotal,
      byFaculty,
      byMonth,
      byStatus: [
        { status: "To'liq to'langan", count: full, amount: 0 },
        { status: 'Qisman', count: partial, amount: 0 },
        { status: "To'lanmagan", count: none, amount: 0 },
      ],
    };
  }
}
