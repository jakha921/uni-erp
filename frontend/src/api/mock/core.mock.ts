import { delay } from './delay';
import { FACULTIES, DEPARTMENTS } from './shared-data';
import type { Branch, Faculty, Department, Specialty, Group, AcademicYear, Semester } from '@/types/core';
import type { ICoreService } from '../services/core.service';

const BRANCHES: Branch[] = [
  { id: 1, name: 'Bosh ofis', code: 'HQ', address: "Toshkent sh., Mirzo Ulug'bek tumani" },
  { id: 2, name: 'Navoi filiali', code: 'NAV', address: 'Navoi sh., Markaz tumani' },
];

const MOCK_FACULTIES: Faculty[] = FACULTIES.map((name, i) => ({
  id: i + 1,
  name,
  code: `FAC-${String(i + 1).padStart(2, '0')}`,
  branchId: 1,
}));

const HEAD_NAMES = [
  "Karimov Bahrom", "Yusupova Zulfiya", "Toshmatov Ravshan", "Nazarova Nilufar",
  "Xoliqov Sardor", "Mirzayeva Gulnora", "Rahimov Ulugbek", "Saidova Dildora",
  "Ergashev Jasur", "Qodirov Mansur", "Aliyeva Shahlo", "Hasanov Timur",
];

const MOCK_DEPARTMENTS: Department[] = DEPARTMENTS.map((name, i) => ({
  id: i + 1,
  name,
  code: `DEP-${String(i + 1).padStart(2, '0')}`,
  facultyId: (i % MOCK_FACULTIES.length) + 1,
  headName: HEAD_NAMES[i % HEAD_NAMES.length],
  staffCount: 8 + (i * 7 % 20),
  studentCount: 80 + (i * 31 % 200),
  avgGrade: Math.round((3.2 + (i * 17 % 18) / 10) * 10) / 10,
}));

const SPECIALTIES_DATA = [
  "Dasturiy injiniring",
  "Axborot tizimlari",
  "Kiberxavfsizlik",
  "Sun'iy intellekt",
  "Menejment",
  "Iqtisodiyot",
  "Moliya va buxgalteriya",
  "Pedagogika",
  "Filologiya",
  "Energetika",
];

const MOCK_SPECIALTIES: Specialty[] = SPECIALTIES_DATA.map((name, i) => ({
  id: i + 1,
  name,
  code: `SPEC-${String(i + 1).padStart(2, '0')}`,
  departmentId: (i % MOCK_DEPARTMENTS.length) + 1,
}));

const GROUP_NAMES = ['101-21', '102-21', '201-21', '202-21', '301-22', '302-22', '401-22', '402-22', '103-23', '203-23', '303-23', '403-23'];

const MOCK_GROUPS: Group[] = GROUP_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  code: name,
  specialtyId: (i % MOCK_SPECIALTIES.length) + 1,
  course: Math.floor(i / 4) + 1,
  capacity: 30,
  currentCount: 22 + (i % 9),
}));

const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 1, name: '2024-2025', startDate: '2024-09-02', endDate: '2025-06-30', isCurrent: false },
  { id: 2, name: '2025-2026', startDate: '2025-09-01', endDate: '2026-06-30', isCurrent: true },
  { id: 3, name: '2026-2027', startDate: '2026-09-01', endDate: '2027-06-30', isCurrent: false },
];

const MOCK_SEMESTERS: Semester[] = [
  { id: 1, name: '2025-2026 1-semestr', academicYearId: 2, number: 1, startDate: '2025-09-01', endDate: '2026-01-25', isCurrent: false },
  { id: 2, name: '2025-2026 2-semestr', academicYearId: 2, number: 2, startDate: '2026-02-03', endDate: '2026-06-30', isCurrent: true },
  { id: 3, name: '2024-2025 1-semestr', academicYearId: 1, number: 1, startDate: '2024-09-02', endDate: '2025-01-25', isCurrent: false },
  { id: 4, name: '2024-2025 2-semestr', academicYearId: 1, number: 2, startDate: '2025-02-03', endDate: '2025-06-30', isCurrent: false },
];

export class CoreMockService implements ICoreService {
  async getBranches(): Promise<Branch[]> {
    await delay(200);
    return BRANCHES;
  }

  async getFaculties(branchId?: number): Promise<Faculty[]> {
    await delay(200);
    if (branchId) return MOCK_FACULTIES.filter((f) => f.branchId === branchId);
    return MOCK_FACULTIES;
  }

  async getDepartments(facultyId?: number): Promise<Department[]> {
    await delay(200);
    if (facultyId) return MOCK_DEPARTMENTS.filter((d) => d.facultyId === facultyId);
    return MOCK_DEPARTMENTS;
  }

  async getSpecialties(departmentId?: number): Promise<Specialty[]> {
    await delay(200);
    if (departmentId) return MOCK_SPECIALTIES.filter((s) => s.departmentId === departmentId);
    return MOCK_SPECIALTIES;
  }

  async getGroups(specialtyId?: number): Promise<Group[]> {
    await delay(200);
    if (specialtyId) return MOCK_GROUPS.filter((g) => g.specialtyId === specialtyId);
    return MOCK_GROUPS;
  }

  async getAcademicYears(): Promise<AcademicYear[]> {
    await delay(200);
    return MOCK_ACADEMIC_YEARS;
  }

  async getSemesters(academicYearId?: number): Promise<Semester[]> {
    await delay(200);
    if (academicYearId) return MOCK_SEMESTERS.filter((s) => s.academicYearId === academicYearId);
    return MOCK_SEMESTERS;
  }
}
