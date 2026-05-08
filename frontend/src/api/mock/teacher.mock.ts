import { delay } from './delay';
import {
  generateName,
  generatePhone,
  generateEmail,
  pick,
  rnum,
  DEPARTMENTS,
  SUBJECTS,
} from './shared-data';
import type {
  Teacher,
  TeacherListItem,
  TeacherListParams,
} from '@/types/teacher';
import type { PaginatedResponse } from '@/types/common';
import type { ITeacherService } from '../services/teacher.service';

const DEGREES = ['Fan doktori (DSc)', 'PhD', 'Fan nomzodi', 'Magistr', 'Bakalavr', 'Ilmiy darajasiz'];
const RANKS = ['Professor', 'Dotsent', "Yo'q"];
const POSITIONS = ['Professor', 'Dotsent', "Katta o'qituvchi", "O'qituvchi", 'Assistent'];
const EMPLOYMENT_FORMS: Array<Teacher['employmentForm']> = ['shtatliy', 'sovmestitel', 'soatbay'];
function generateTeachers(): Teacher[] {
  const teachers: Teacher[] = [];

  for (let i = 0; i < 25; i++) {
    const name = generateName(i + 500, 0.4);
    const dept = pick(DEPARTMENTS, i * 3);
    const deptIdx = DEPARTMENTS.indexOf(dept);
    const posIdx = i % POSITIONS.length;
    const degreeIdx = posIdx === 0 ? 0 : posIdx === 1 ? 1 : posIdx === 2 ? 2 : rnum(i * 17, 3, 5);
    const rankIdx = posIdx <= 1 ? posIdx : 2;

    const subjectCount = rnum(i * 7, 1, 3);
    const subjects: string[] = [];
    for (let s = 0; s < subjectCount; s++) {
      subjects.push(pick(SUBJECTS, i * 11 + s));
    }

    const maxLoad = rnum(i * 13, 400, 800);
    const load = rnum(i * 19, Math.floor(maxLoad * 0.5), maxLoad);

    const statusRoll = rnum(i * 23, 0, 99);
    const status: Teacher['status'] = statusRoll < 85 ? 'active' : statusRoll < 93 ? 'leave' : 'inactive';

    teachers.push({
      id: 2000 + i,
      employeeId: 1000 + i,
      fullName: name.full,
      shortName: name.short,
      department: dept,
      departmentId: deptIdx + 1,
      position: POSITIONS[posIdx]!,
      academicDegree: DEGREES[degreeIdx]!,
      academicRank: RANKS[rankIdx]!,
      subjects,
      loadHours: load,
      maxLoadHours: maxLoad,
      phone: generatePhone(i + 500),
      email: generateEmail(name),
      image: undefined,
      employmentForm: pick(EMPLOYMENT_FORMS, i * 29),
      status,
    });
  }

  return teachers;
}

function toListItem(t: Teacher): TeacherListItem {
  return {
    id: t.id,
    fullName: t.fullName,
    shortName: t.shortName,
    department: t.department,
    position: t.position,
    academicDegree: t.academicDegree,
    academicRank: t.academicRank,
    employmentForm: t.employmentForm,
    status: t.status,
    image: t.image,
  };
}

const ALL_TEACHERS = generateTeachers();

export class TeacherMockService implements ITeacherService {
  async getTeachers(params: TeacherListParams): Promise<PaginatedResponse<TeacherListItem>> {
    await delay(300);

    let filtered = [...ALL_TEACHERS];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.fullName.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q) ||
          t.subjects.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (params.departmentId) {
      filtered = filtered.filter((t) => t.departmentId === params.departmentId);
    }
    if (params.degreeCode) {
      filtered = filtered.filter((t) => t.academicDegree.toLowerCase().includes(params.degreeCode!.toLowerCase()));
    }
    if (params.rankCode) {
      filtered = filtered.filter((t) => t.academicRank.toLowerCase().includes(params.rankCode!.toLowerCase()));
    }
    if (params.employmentForm) {
      filtered = filtered.filter((t) => t.employmentForm === params.employmentForm);
    }

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize).map(toListItem);

    return { data, total, page, pageSize, totalPages };
  }

  async getTeacherById(id: number): Promise<Teacher> {
    await delay(200);
    const teacher = ALL_TEACHERS.find((t) => t.id === id);
    if (!teacher) throw new Error("O'qituvchi topilmadi");
    return teacher;
  }
}
