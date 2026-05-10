import { delay } from './delay';
import { pick, rnum, SUBJECTS } from './shared-data';
import type {
  Curriculum,
  CurriculumSubject,
  CurriculumListParams,
  CreateCurriculumDto,
  UpdateCurriculumDto,
  ControlForm,
} from '@/types/education';
import type { ICurriculumService } from '../services/curriculum.service';

const SPECIALTIES = [
  'Dasturiy injiniring',
  'Axborot xavfsizligi',
  'Iqtisodiyot',
  'Pedagogika',
  'Matematika',
];

const CONTROL_FORMS: ControlForm[] = ['exam', 'credit', 'diff_credit'];

function generateCurriculumSubjects(currId: number): CurriculumSubject[] {
  const subjects: CurriculumSubject[] = [];
  let sid = currId * 100;
  for (let sem = 1; sem <= 8; sem++) {
    const count = rnum(sid + sem, 4, 6);
    for (let j = 0; j < count; j++) {
      sid++;
      subjects.push({
        id: sid,
        subjectId: (sid % SUBJECTS.length) + 1,
        subjectName: pick(SUBJECTS, sid * 3),
        semester: sem,
        credits: rnum(sid * 7, 2, 6),
        hoursLecture: rnum(sid * 11, 16, 48),
        hoursPractice: rnum(sid * 13, 8, 32),
        hoursLab: rnum(sid * 17, 0, 16),
        controlForm: pick(CONTROL_FORMS, sid * 19),
        isElective: rnum(sid * 23, 0, 4) === 0,
      });
    }
  }
  return subjects;
}

function generateCurriculums(): Curriculum[] {
  const result: Curriculum[] = [];
  for (let i = 0; i < 5; i++) {
    const subjects = generateCurriculumSubjects(i + 1);
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    result.push({
      id: i + 1,
      specialtyId: i + 1,
      specialtyName: SPECIALTIES[i]!,
      year: 2024 + (i % 3),
      totalCredits,
      subjects,
    });
  }
  return result;
}

const ALL_CURRICULUMS = generateCurriculums();

export class CurriculumMockService implements ICurriculumService {
  private curriculums: Curriculum[] = [...ALL_CURRICULUMS];

  async getCurriculums(params?: CurriculumListParams): Promise<Curriculum[]> {
    await delay(300);
    let filtered = [...this.curriculums];

    if (params?.specialtyId) {
      filtered = filtered.filter((c) => c.specialtyId === params.specialtyId);
    }
    if (params?.year) {
      filtered = filtered.filter((c) => c.year === params.year);
    }

    return filtered;
  }

  async getCurriculumById(id: number): Promise<Curriculum> {
    await delay(200);
    const curriculum = this.curriculums.find((c) => c.id === id);
    if (!curriculum) throw new Error("O'quv rejasi topilmadi");
    return curriculum;
  }

  async createCurriculum(data: CreateCurriculumDto): Promise<Curriculum> {
    await delay(400);
    const maxId = Math.max(...this.curriculums.map((c) => c.id));
    const subjects: CurriculumSubject[] = data.subjects.map((s, idx) => ({
      ...s,
      id: maxId * 100 + idx + 1,
      subjectName: pick(SUBJECTS, s.subjectId),
    }));
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const curriculum: Curriculum = {
      id: maxId + 1,
      specialtyId: data.specialtyId,
      specialtyName: pick(SPECIALTIES, data.specialtyId),
      year: data.year,
      totalCredits,
      subjects,
    };
    this.curriculums.unshift(curriculum);
    return curriculum;
  }

  async updateCurriculum(id: number, data: UpdateCurriculumDto): Promise<Curriculum> {
    await delay(400);
    const idx = this.curriculums.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("O'quv rejasi topilmadi");
    const existing = this.curriculums[idx]!;

    let subjects = existing.subjects;
    if (data.subjects) {
      subjects = data.subjects.map((s, i) => ({
        ...s,
        id: existing.id * 100 + i + 1,
        subjectName: pick(SUBJECTS, s.subjectId),
      }));
    }

    const updated: Curriculum = {
      ...existing,
      specialtyId: data.specialtyId ?? existing.specialtyId,
      specialtyName: data.specialtyId
        ? pick(SPECIALTIES, data.specialtyId)
        : existing.specialtyName,
      year: data.year ?? existing.year,
      totalCredits: subjects.reduce((sum, s) => sum + s.credits, 0),
      subjects,
    };
    this.curriculums[idx] = updated;
    return updated;
  }

  async deleteCurriculum(id: number): Promise<void> {
    await delay(200);
    const idx = this.curriculums.findIndex((c) => c.id === id);
    if (idx !== -1) this.curriculums.splice(idx, 1);
  }
}
