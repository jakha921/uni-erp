import type { Branch, Faculty, Department, Specialty, Group, AcademicYear, Semester } from '@/types/core';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, drfListToArray } from '../client';
import { CoreMockService } from '../mock/core.mock';

export interface ICoreService {
  getBranches(): Promise<Branch[]>;
  getFaculties(branchId?: number): Promise<Faculty[]>;
  getDepartments(facultyId?: number): Promise<Department[]>;
  getSpecialties(departmentId?: number): Promise<Specialty[]>;
  getGroups(specialtyId?: number): Promise<Group[]>;
  getAcademicYears(): Promise<AcademicYear[]>;
  getSemesters(academicYearId?: number): Promise<Semester[]>;
}

class CoreApiService implements ICoreService {
  async getBranches(): Promise<Branch[]> {
    const res = await apiClient.get<{ results: Branch[] } | Branch[]>(ENDPOINTS.core.branches);
    return drfListToArray(res as { count: number; next: null; previous: null; results: Branch[] });
  }

  async getFaculties(branchId?: number): Promise<Faculty[]> {
    const res = await apiClient.get<{ results: Faculty[] } | Faculty[]>(ENDPOINTS.core.faculties, {
      params: { branch_id: branchId },
    });
    return drfListToArray(res as { count: number; next: null; previous: null; results: Faculty[] });
  }

  async getDepartments(facultyId?: number): Promise<Department[]> {
    const res = await apiClient.get<{ results: Department[] } | Department[]>(ENDPOINTS.core.departments, {
      params: { faculty_id: facultyId },
    });
    return drfListToArray(res as { count: number; next: null; previous: null; results: Department[] });
  }

  async getSpecialties(departmentId?: number): Promise<Specialty[]> {
    const res = await apiClient.get<{ results: Specialty[] } | Specialty[]>(ENDPOINTS.core.specialties, {
      params: { department_id: departmentId },
    });
    return drfListToArray(res as { count: number; next: null; previous: null; results: Specialty[] });
  }

  async getGroups(specialtyId?: number): Promise<Group[]> {
    const res = await apiClient.get<{ results: Group[] } | Group[]>(ENDPOINTS.core.groups, {
      params: { specialty_id: specialtyId },
    });
    return drfListToArray(res as { count: number; next: null; previous: null; results: Group[] });
  }

  async getAcademicYears(): Promise<AcademicYear[]> {
    const res = await apiClient.get<{ results: AcademicYear[] } | AcademicYear[]>(ENDPOINTS.core.academicYears);
    return drfListToArray(res as { count: number; next: null; previous: null; results: AcademicYear[] });
  }

  async getSemesters(academicYearId?: number): Promise<Semester[]> {
    const res = await apiClient.get<{ results: Semester[] } | Semester[]>(ENDPOINTS.core.semesters, {
      params: { academic_year_id: academicYearId },
    });
    return drfListToArray(res as { count: number; next: null; previous: null; results: Semester[] });
  }
}

export const coreService: ICoreService = USE_MOCK
  ? new CoreMockService()
  : new CoreApiService();
