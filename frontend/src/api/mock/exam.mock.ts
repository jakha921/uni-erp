import { delay } from './delay';
import { pick, rnum, SUBJECTS } from './shared-data';
import type {
  Exam,
  ExamListParams,
  ExamType,
  ExamStatus,
  CreateExamDto,
  UpdateExamDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import type { IExamService } from '../services/exam.service';

const GROUPS = [
  'KF-11', 'KF-12', 'KF-21', 'KF-22', 'KF-31', 'KF-32',
  'IQ-11', 'IQ-12', 'IQ-21', 'IQ-22',
  'PD-11', 'PD-12', 'PD-21',
  'FL-11', 'FL-12',
  'MT-11', 'MT-12', 'MT-21',
];

const ROOMS = [
  '101-A', '102-A', '201-A', '202-A', '301-B', '302-B',
  '103-C', '204-C', '305-D', 'Akt-zal',
];

const TEACHERS = [
  'Karimov U.B.', 'Nazarova M.A.', 'Xolmatov A.S.', 'Tursunova F.R.',
  'Yusupov J.K.', 'Hasanova D.B.', 'Mirzayev O.T.', 'Saidova N.I.',
  'Rahimov B.D.', 'Ergasheva Z.M.', 'Toshmatov R.Q.', 'Qodirova L.A.',
];

const EXAM_TYPES: ExamType[] = ['midterm', 'final'];
const EXAM_STATUSES: ExamStatus[] = ['scheduled', 'active', 'completed'];

function generateExams(): Exam[] {
  const result: Exam[] = [];
  for (let i = 0; i < 20; i++) {
    const day = rnum(i * 7, 1, 28);
    const month = rnum(i * 11, 1, 6);
    const statusIdx = i < 8 ? 2 : i < 14 ? 1 : 0;
    result.push({
      id: i + 1,
      subjectId: (i % SUBJECTS.length) + 1,
      subjectName: pick(SUBJECTS, i * 3),
      groupId: (i % GROUPS.length) + 1,
      groupName: pick(GROUPS, i * 5),
      examDate: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      room: pick(ROOMS, i * 9),
      type: EXAM_TYPES[i % 2]!,
      semesterId: i < 10 ? 1 : 2,
      teacherId: (i % TEACHERS.length) + 1,
      teacherName: pick(TEACHERS, i * 13),
      status: EXAM_STATUSES[statusIdx]!,
    });
  }
  return result;
}

const ALL_EXAMS = generateExams();

export class ExamMockService implements IExamService {
  private exams: Exam[] = [...ALL_EXAMS];

  async getExams(params?: ExamListParams): Promise<PaginatedResponse<Exam>> {
    await delay(300);
    let filtered = [...this.exams];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subjectName.toLowerCase().includes(q) ||
          e.groupName.toLowerCase().includes(q) ||
          e.teacherName.toLowerCase().includes(q),
      );
    }
    if (params?.semesterId) {
      filtered = filtered.filter((e) => e.semesterId === params.semesterId);
    }
    if (params?.groupId) {
      filtered = filtered.filter((e) => e.groupId === params.groupId);
    }
    if (params?.subjectId) {
      filtered = filtered.filter((e) => e.subjectId === params.subjectId);
    }
    if (params?.type) {
      filtered = filtered.filter((e) => e.type === params.type);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getExamById(id: number): Promise<Exam> {
    await delay(200);
    const exam = this.exams.find((e) => e.id === id);
    if (!exam) throw new Error('Imtihon topilmadi');
    return exam;
  }

  async createExam(data: CreateExamDto): Promise<Exam> {
    await delay(400);
    const maxId = Math.max(...this.exams.map((e) => e.id));
    const exam: Exam = {
      id: maxId + 1,
      ...data,
      subjectName: pick(SUBJECTS, data.subjectId),
      groupName: pick(GROUPS, data.groupId),
      teacherName: pick(TEACHERS, data.teacherId),
      semesterId: 1,
      status: 'scheduled',
    };
    this.exams.unshift(exam);
    return exam;
  }

  async updateExam(id: number, data: UpdateExamDto): Promise<Exam> {
    await delay(400);
    const idx = this.exams.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Imtihon topilmadi');
    this.exams[idx] = { ...this.exams[idx]!, ...data };
    return this.exams[idx]!;
  }

  async deleteExam(id: number): Promise<void> {
    await delay(300);
    const idx = this.exams.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Imtihon topilmadi');
    this.exams.splice(idx, 1);
  }
}
