import type {
  Employee,
  EmployeeListItem,
  EmployeeListParams,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  HrDepartment,
  HrOrder,
  CreateOrderDto,
  Leave,
  CreateLeaveDto,
  EmployeeAttendanceRow,
  HrDashboardStats,
} from '@/types/hr';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated, drfListToArray } from '../client';
import { HrMockService } from '../mock/hr.mock';

export interface IHrService {
  getEmployees(params?: EmployeeListParams): Promise<PaginatedResponse<EmployeeListItem>>;
  getEmployeeById(id: number): Promise<Employee>;
  createEmployee(dto: CreateEmployeeDto): Promise<Employee>;
  updateEmployee(id: number, dto: UpdateEmployeeDto): Promise<Employee>;
  deleteEmployee(id: number): Promise<void>;
  getDepartments(): Promise<HrDepartment[]>;
  getOrders(): Promise<HrOrder[]>;
  createOrder(dto: CreateOrderDto): Promise<HrOrder>;
  getLeaves(): Promise<Leave[]>;
  createLeave(dto: CreateLeaveDto): Promise<Leave>;
  updateLeave(id: string, patch: Partial<Pick<Leave, 'status'>>): Promise<Leave>;
  getAttendance(departmentId?: number): Promise<EmployeeAttendanceRow[]>;
  getDashboardStats(): Promise<HrDashboardStats>;
}

class HrApiService implements IHrService {
  async getEmployees(params?: EmployeeListParams): Promise<PaginatedResponse<EmployeeListItem>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: EmployeeListItem[] }>(ENDPOINTS.hr.employees, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        department_id: params?.departmentId,
        position_code: params?.positionCode,
        status: params?.status,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getEmployeeById(id: number): Promise<Employee> {
    return apiClient.get<Employee>(ENDPOINTS.hr.employeeDetail(id));
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<Employee> {
    return apiClient.post<Employee>(ENDPOINTS.hr.employees, dto);
  }

  async updateEmployee(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    return apiClient.patch<Employee>(ENDPOINTS.hr.employeeDetail(id), dto);
  }

  async deleteEmployee(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.hr.employeeDetail(id));
  }

  async getDepartments(): Promise<HrDepartment[]> {
    return apiClient.get<HrDepartment[]>(ENDPOINTS.hr.departments);
  }

  async getOrders(): Promise<HrOrder[]> {
    const res = await apiClient.get<{ results: HrOrder[] } | HrOrder[]>(ENDPOINTS.hr.orders);
    return drfListToArray(res as { count: number; next: null; previous: null; results: HrOrder[] });
  }

  async createOrder(dto: CreateOrderDto): Promise<HrOrder> {
    return apiClient.post<HrOrder>(ENDPOINTS.hr.orders, dto);
  }

  async getLeaves(): Promise<Leave[]> {
    const res = await apiClient.get<{ results: Leave[] } | Leave[]>(ENDPOINTS.hr.leaves);
    return drfListToArray(res as { count: number; next: null; previous: null; results: Leave[] });
  }

  async createLeave(dto: CreateLeaveDto): Promise<Leave> {
    return apiClient.post<Leave>(ENDPOINTS.hr.leaves, dto);
  }

  async updateLeave(id: string, patch: Partial<Pick<Leave, 'status'>>): Promise<Leave> {
    return apiClient.patch<Leave>(`${ENDPOINTS.hr.leaves}/${id}`, patch);
  }

  async getAttendance(departmentId?: number): Promise<EmployeeAttendanceRow[]> {
    return apiClient.get<EmployeeAttendanceRow[]>(ENDPOINTS.hr.attendance, {
      params: { department_id: departmentId },
    });
  }

  async getDashboardStats(): Promise<HrDashboardStats> {
    return apiClient.get<HrDashboardStats>(ENDPOINTS.hr.dashboard);
  }
}

export const hrService: IHrService = USE_MOCK ? new HrMockService() : new HrApiService();
