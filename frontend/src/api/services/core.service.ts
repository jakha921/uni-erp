import type { Branch, Faculty, Department, Specialty, Group, AcademicYear, Semester } from '@/types/core';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
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
    return apiClient.get<Branch[]>(ENDPOINTS.core.branches);
  }

  async getFaculties(branchId?: number): Promise<Faculty[]> {
    return apiClient.get<Faculty[]>(ENDPOINTS.core.faculties, {
      params: { branch_id: branchId },
    });
  }

  async getDepartments(facultyId?: number): Promise<Department[]> {
    return apiClient.get<Department[]>(ENDPOINTS.core.departments, {
      params: { faculty_id: facultyId },
    });
  }

  async getSpecialties(departmentId?: number): Promise<Specialty[]> {
    return apiClient.get<Specialty[]>(ENDPOINTS.core.specialties, {
      params: { department_id: departmentId },
    });
  }

  async getGroups(specialtyId?: number): Promise<Group[]> {
    return apiClient.get<Group[]>(ENDPOINTS.core.groups, {
      params: { specialty_id: specialtyId },
    });
  }

  async getAcademicYears(): Promise<AcademicYear[]> {
    return apiClient.get<AcademicYear[]>(ENDPOINTS.core.academicYears);
  }

  async getSemesters(academicYearId?: number): Promise<Semester[]> {
    return apiClient.get<Semester[]>(ENDPOINTS.core.semesters, {
      params: { academic_year_id: academicYearId },
    });
  }
}

export const coreService: ICoreService = USE_MOCK
  ? new CoreMockService()
  : new CoreApiService();
