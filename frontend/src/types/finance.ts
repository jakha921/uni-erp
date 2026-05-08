import type { ListParams } from './common';

export type ContractType = 'bazoviy' | 'tabaqalashtirilgan' | 'grant' | 'xorijiy';
export type ContractStatus = 'active' | 'completed' | 'cancelled';
export type PaymentMethod = 'bank' | 'naqd' | 'online' | 'click' | 'payme';
export type ScholarshipType =
  | 'davlat'
  | 'ijtimoiy'
  | 'fanlar'
  | 'prezident'
  | 'maxsus';

export interface PaymentScheduleItem {
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

export interface Contract {
  id: string;
  studentId: number;
  studentName: string;
  studentIdNumber: string;
  facultyName: string;
  facultyId: number;
  groupName: string;
  level: string;
  specialty: string;
  contractNumber: string;
  contractDate: string;
  contractType: ContractType;
  educationYear: string;
  contractAmount: number;
  paidAmount: number;
  debtAmount: number;
  status: ContractStatus;
  paymentSchedule: PaymentScheduleItem[];
  createdAt: string;
}

export type ContractListItem = Pick<
  Contract,
  | 'id'
  | 'studentName'
  | 'studentIdNumber'
  | 'contractNumber'
  | 'contractType'
  | 'contractAmount'
  | 'paidAmount'
  | 'debtAmount'
  | 'status'
  | 'facultyName'
>;

export interface ContractListParams extends ListParams {
  facultyId?: number;
  status?: ContractStatus;
  contractType?: ContractType;
  educationYear?: string;
}

export interface CreateContractDto {
  studentId: number;
  contractType: ContractType;
  contractAmount: number;
  contractDate: string;
  educationYear: string;
  paymentSchedule: { dueDate: string; amount: number }[];
}

export interface Payment {
  id: string;
  contractId: string;
  studentId: number;
  studentName: string;
  facultyName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  note: string;
  createdAt: string;
}

export interface PaymentListParams extends ListParams {
  facultyId?: number;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  period?: 'today' | 'week' | 'month' | 'all';
}

export interface CreatePaymentDto {
  contractId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  note?: string;
}

export interface Scholarship {
  id: string;
  studentId: number;
  studentName: string;
  facultyName: string;
  groupName: string;
  type: ScholarshipType;
  typeLabel: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed';
  basis: string;
}

export interface CreateScholarshipDto {
  studentId: number;
  type: ScholarshipType;
  amount: number;
  startDate: string;
  endDate: string;
  basis: string;
}

export interface FinanceDashboardStats {
  totalContracts: number;
  totalContractAmount: number;
  totalPaid: number;
  totalDebt: number;
  collectionRate: number;
  debtorCount: number;
  scholarshipCount: number;
  scholarshipTotal: number;
  byFaculty: {
    faculty: string;
    total: number;
    paid: number;
    debt: number;
  }[];
  byMonth: { month: string; amount: number }[];
  byStatus: { status: string; count: number; amount: number }[];
}

// ---- Payroll ----

export interface PayrollEmployee {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'processing';
}

export interface PayrollListParams extends ListParams {
  month: number;
  year: number;
  departmentId?: number;
  status?: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalBase: number;
  totalBonus: number;
  totalDeductions: number;
  totalNet: number;
  paidCount: number;
  pendingCount: number;
}

// ---- Budget ----

export interface BudgetCategory {
  id: number;
  name: string;
  code: string;
  planned: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  parentId: number | null;
}

export interface BudgetListParams {
  year: number;
  quarter?: number;
}

export interface BudgetSummary {
  totalPlanned: number;
  totalSpent: number;
  totalRemaining: number;
  byQuarter: { quarter: number; planned: number; spent: number }[];
}
