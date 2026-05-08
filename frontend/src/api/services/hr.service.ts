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

export const hrService: IHrService = new HrMockService();
