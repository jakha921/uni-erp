import { useQuery } from '@tanstack/react-query';
import { coreService } from '../services/core.service';

const KEYS = {
  all: ['core'] as const,
  branches: () => [...KEYS.all, 'branches'] as const,
  faculties: (branchId?: number) => [...KEYS.all, 'faculties', branchId] as const,
  departments: (facultyId?: number) => [...KEYS.all, 'departments', facultyId] as const,
  specialties: (departmentId?: number) => [...KEYS.all, 'specialties', departmentId] as const,
  groups: (specialtyId?: number) => [...KEYS.all, 'groups', specialtyId] as const,
  academicYears: () => [...KEYS.all, 'academic-years'] as const,
  semesters: (academicYearId?: number) => [...KEYS.all, 'semesters', academicYearId] as const,
};

export function useBranches() {
  return useQuery({
    queryKey: KEYS.branches(),
    queryFn: () => coreService.getBranches(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFaculties(branchId?: number) {
  return useQuery({
    queryKey: KEYS.faculties(branchId),
    queryFn: () => coreService.getFaculties(branchId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDepartments(facultyId?: number) {
  return useQuery({
    queryKey: KEYS.departments(facultyId),
    queryFn: () => coreService.getDepartments(facultyId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpecialties(departmentId?: number) {
  return useQuery({
    queryKey: KEYS.specialties(departmentId),
    queryFn: () => coreService.getSpecialties(departmentId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGroups(specialtyId?: number) {
  return useQuery({
    queryKey: KEYS.groups(specialtyId),
    queryFn: () => coreService.getGroups(specialtyId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAcademicYears() {
  return useQuery({
    queryKey: KEYS.academicYears(),
    queryFn: () => coreService.getAcademicYears(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSemesters(academicYearId?: number) {
  return useQuery({
    queryKey: KEYS.semesters(academicYearId),
    queryFn: () => coreService.getSemesters(academicYearId),
    staleTime: 10 * 60 * 1000,
  });
}
