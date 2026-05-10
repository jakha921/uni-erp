import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hrService } from '../services/hr.service';
import type {
  EmployeeListParams,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  HrDepartment,
  CreateOrderDto,
  CreateLeaveDto,
  Leave,
} from '@/types/hr';

type DepartmentDto = Omit<HrDepartment, 'id' | 'headName' | 'employeeCount'>;

const hrKeys = {
  all: ['hr'] as const,
  employees: (params?: EmployeeListParams) => [...hrKeys.all, 'employees', params] as const,
  employee: (id: number) => [...hrKeys.all, 'employee', id] as const,
  departments: () => [...hrKeys.all, 'departments'] as const,
  orders: () => [...hrKeys.all, 'orders'] as const,
  leaves: () => [...hrKeys.all, 'leaves'] as const,
  attendance: (deptId?: number) => [...hrKeys.all, 'attendance', deptId] as const,
  dashboard: () => [...hrKeys.all, 'dashboard'] as const,
};

export function useEmployees(params?: EmployeeListParams) {
  return useQuery({
    queryKey: hrKeys.employees(params),
    queryFn: () => hrService.getEmployees(params),
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: hrKeys.employee(id),
    queryFn: () => hrService.getEmployeeById(id),
    enabled: id > 0,
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEmployeeDto) => hrService.createEmployee(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: hrKeys.all });
    },
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateEmployeeDto }) =>
      hrService.updateEmployee(id, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: hrKeys.all });
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hrService.deleteEmployee(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: hrKeys.all });
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: hrKeys.departments(),
    queryFn: () => hrService.getDepartments(),
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: DepartmentDto) => hrService.createDepartment(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.departments() }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: DepartmentDto }) => hrService.updateDepartment(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.departments() }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hrService.deleteDepartment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.departments() }),
  });
}

export function useOrders() {
  return useQuery({
    queryKey: hrKeys.orders(),
    queryFn: () => hrService.getOrders(),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOrderDto) => hrService.createOrder(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: hrKeys.orders() });
    },
  });
}

export function useLeaves() {
  return useQuery({
    queryKey: hrKeys.leaves(),
    queryFn: () => hrService.getLeaves(),
  });
}

export function useCreateLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateLeaveDto) => hrService.createLeave(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: hrKeys.leaves() });
    },
  });
}

export function useUpdateLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<Leave, 'status'>> }) =>
      hrService.updateLeave(id, patch),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: hrKeys.leaves() });
    },
  });
}

export function useAttendance(departmentId?: number) {
  return useQuery({
    queryKey: hrKeys.attendance(departmentId),
    queryFn: () => hrService.getAttendance(departmentId),
  });
}

export function useHrDashboard() {
  return useQuery({
    queryKey: hrKeys.dashboard(),
    queryFn: () => hrService.getDashboardStats(),
  });
}
