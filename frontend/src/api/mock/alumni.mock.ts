import { delay } from './delay';
import { pick, rnum, generateName, generatePhone, generateEmail, FACULTIES } from './shared-data';
import type {
  Alumni,
  AlumniListParams,
  AlumniStatus,
  CreateAlumniDto,
  UpdateAlumniDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import type { IAlumniService } from '../services/alumni.service';

const SPECIALTIES = [
  'Dasturiy injiniring', 'Axborot xavfsizligi', 'Iqtisodiyot',
  'Menejment', 'Pedagogika', 'Matematika', 'Filologiya',
  'Moliya', 'Tabiiy fanlar', 'Ekologiya',
];

const WORKPLACES = [
  'Uzum Market', 'Payme', 'Click', 'Humans', 'Epam Systems',
  'IT Park', 'UzAuto Motors', 'Artel Electronics', 'Milliy bank',
  'Ipoteka bank', 'Anor bank', 'Aloqa bank', 'Beeline Uzbekistan',
  'Ucell', 'Uzmobile', 'Tashkent City Mall', 'Mega Planet',
  'Navoiy kon-metallurgiya kombinati', 'O\'zbekiston temir yo\'llari',
  'Soliq qo\'mitasi',
];

const POSITIONS = [
  'Dasturchi', 'Katta dasturchi', 'Frontend dasturchi', 'Backend dasturchi',
  'DevOps muhandis', 'Loyiha menejeri', 'Buxgalter', 'Iqtisodchi',
  'O\'qituvchi', 'Katta o\'qituvchi', 'Menejer', 'Marketing mutaxassisi',
  'HR mutaxassisi', 'Moliyachi', 'Tahlilchi', 'Tibbiyot xodimi',
];

const ALUMNI_STATUSES: AlumniStatus[] = ['employed', 'unemployed', 'studying', 'unknown'];

function generateAlumni(): Alumni[] {
  const result: Alumni[] = [];
  for (let i = 0; i < 40; i++) {
    const name = generateName(i + 500);
    const statusIdx = i % 10 < 7 ? 0 : i % 10 < 8 ? 1 : i % 10 < 9 ? 2 : 3;
    const status = ALUMNI_STATUSES[statusIdx]!;
    result.push({
      id: i + 1,
      fullName: name.full,
      graduationYear: rnum(i * 7, 2018, 2025),
      faculty: pick(FACULTIES, i * 3),
      specialty: pick(SPECIALTIES, i * 5),
      workplace: status === 'employed' ? pick(WORKPLACES, i * 9) : '',
      position: status === 'employed' ? pick(POSITIONS, i * 11) : '',
      phone: generatePhone(i + 500),
      email: generateEmail(name),
      status,
    });
  }
  return result;
}

const ALL_ALUMNI = generateAlumni();

export class AlumniMockService implements IAlumniService {
  private alumni: Alumni[] = [...ALL_ALUMNI];

  async getAlumni(params?: AlumniListParams): Promise<PaginatedResponse<Alumni>> {
    await delay(300);
    let filtered = [...this.alumni];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.workplace.toLowerCase().includes(q) ||
          a.specialty.toLowerCase().includes(q),
      );
    }
    if (params?.graduationYear) {
      filtered = filtered.filter((a) => a.graduationYear === params.graduationYear);
    }
    if (params?.facultyId) {
      filtered = filtered.filter((a) => a.faculty === FACULTIES[params.facultyId! - 1]);
    }
    if (params?.status) {
      filtered = filtered.filter((a) => a.status === params.status);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getAlumniById(id: number): Promise<Alumni> {
    await delay(200);
    const alumni = this.alumni.find((a) => a.id === id);
    if (!alumni) throw new Error('Bitiruvchi topilmadi');
    return alumni;
  }

  async createAlumni(data: CreateAlumniDto): Promise<Alumni> {
    await delay(400);
    const maxId = Math.max(...this.alumni.map((a) => a.id));
    const alumni: Alumni = {
      id: maxId + 1,
      fullName: data.fullName,
      graduationYear: data.graduationYear,
      faculty: data.faculty,
      specialty: data.specialty,
      workplace: data.workplace ?? '',
      position: data.position ?? '',
      phone: data.phone,
      email: data.email ?? '',
      status: data.workplace ? 'employed' : 'unknown',
    };
    this.alumni.unshift(alumni);
    return alumni;
  }

  async updateAlumni(id: number, data: UpdateAlumniDto): Promise<Alumni> {
    await delay(400);
    const idx = this.alumni.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Bitiruvchi topilmadi');
    this.alumni[idx] = { ...this.alumni[idx]!, ...data } as Alumni;
    return this.alumni[idx]!;
  }

  async deleteAlumni(id: number): Promise<void> {
    await delay(400);
    const idx = this.alumni.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Bitiruvchi topilmadi');
    this.alumni.splice(idx, 1);
  }
}
