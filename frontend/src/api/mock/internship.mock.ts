import { delay } from './delay';
import { pick, rnum, generateName } from './shared-data';
import type {
  Internship,
  InternshipListParams,
  InternshipType,
  InternshipStatus,
  CreateInternshipDto,
  UpdateInternshipDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import type { IInternshipService } from '../services/internship.service';

const COMPANIES = [
  'Uzum Market', 'Payme', 'Click', 'Humans', 'Epam Systems',
  'IT Park', 'UzAuto Motors', 'Artel Electronics', 'Milliy bank',
  'Ipoteka bank', 'Beeline Uzbekistan', 'Ucell', 'Uzmobile',
  'Navoiy kon-metallurgiya kombinati', 'Soliq qo\'mitasi',
];

const SUPERVISORS = [
  'Karimov U.B.', 'Nazarova M.A.', 'Xolmatov A.S.', 'Tursunova F.R.',
  'Yusupov J.K.', 'Hasanova D.B.', 'Mirzayev O.T.', 'Saidova N.I.',
  'Rahimov B.D.', 'Ergasheva Z.M.',
];

const INTERNSHIP_TYPES: InternshipType[] = ['production', 'pre_diploma'];
const INTERNSHIP_STATUSES: InternshipStatus[] = ['planned', 'active', 'completed'];

function generateInternships(): Internship[] {
  const result: Internship[] = [];
  for (let i = 0; i < 15; i++) {
    const name = generateName(i + 300);
    const statusIdx = i < 5 ? 2 : i < 10 ? 1 : 0;
    const status = INTERNSHIP_STATUSES[statusIdx]!;
    const startMonth = rnum(i * 7, 2, 6);
    const endMonth = Math.min(startMonth + rnum(i * 11, 1, 3), 12);

    result.push({
      id: i + 1,
      studentId: 1000 + i,
      studentName: name.full,
      companyName: pick(COMPANIES, i * 3),
      supervisorName: pick(SUPERVISORS, i * 5),
      startDate: `2026-${String(startMonth).padStart(2, '0')}-01`,
      endDate: `2026-${String(endMonth).padStart(2, '0')}-28`,
      type: INTERNSHIP_TYPES[i % 2]!,
      status,
      grade: status === 'completed' ? rnum(i * 9, 60, 100) : undefined,
      reportSubmitted: status === 'completed' ? rnum(i * 13, 0, 1) === 1 : false,
    });
  }
  return result;
}

const ALL_INTERNSHIPS = generateInternships();

export class InternshipMockService implements IInternshipService {
  private internships: Internship[] = [...ALL_INTERNSHIPS];

  async getInternships(params?: InternshipListParams): Promise<PaginatedResponse<Internship>> {
    await delay(300);
    let filtered = [...this.internships];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.studentName.toLowerCase().includes(q) ||
          i.companyName.toLowerCase().includes(q) ||
          i.supervisorName.toLowerCase().includes(q),
      );
    }
    if (params?.status) {
      filtered = filtered.filter((i) => i.status === params.status);
    }
    if (params?.type) {
      filtered = filtered.filter((i) => i.type === params.type);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getInternshipById(id: number): Promise<Internship> {
    await delay(200);
    const internship = this.internships.find((i) => i.id === id);
    if (!internship) throw new Error('Amaliyot topilmadi');
    return internship;
  }

  async createInternship(data: CreateInternshipDto): Promise<Internship> {
    await delay(400);
    const maxId = Math.max(...this.internships.map((i) => i.id));
    const name = generateName(data.studentId);
    const internship: Internship = {
      id: maxId + 1,
      ...data,
      studentName: name.full,
      status: 'planned',
      reportSubmitted: false,
    };
    this.internships.unshift(internship);
    return internship;
  }

  async updateInternship(id: number, data: UpdateInternshipDto): Promise<Internship> {
    await delay(400);
    const idx = this.internships.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Amaliyot topilmadi');
    this.internships[idx] = { ...this.internships[idx]!, ...data } as Internship;
    return this.internships[idx]!;
  }

  async deleteInternship(id: number): Promise<void> {
    await delay(400);
    const idx = this.internships.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Amaliyot topilmadi');
    this.internships.splice(idx, 1);
  }
}
