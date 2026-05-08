import type {
  DormBuilding, DormRoom, DormRoomListParams,
  Equipment, EquipmentListParams, CreateEquipmentDto,
  Vehicle, VehicleListParams, CreateVehicleDto,
} from '@/types/infrastructure';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { InfrastructureMockService } from '../mock/infrastructure.mock';

export interface IInfrastructureService {
  getBuildings(): Promise<DormBuilding[]>;
  getRooms(params: DormRoomListParams): Promise<PaginatedResponse<DormRoom>>;
  getEquipment(params: EquipmentListParams): Promise<PaginatedResponse<Equipment>>;
  getEquipmentById(id: number): Promise<Equipment>;
  createEquipment(data: CreateEquipmentDto): Promise<Equipment>;
  updateEquipment(id: number, data: Partial<CreateEquipmentDto>): Promise<Equipment>;
  deleteEquipment(id: number): Promise<void>;
  getVehicles(params: VehicleListParams): Promise<PaginatedResponse<Vehicle>>;
  createVehicle(data: CreateVehicleDto): Promise<Vehicle>;
  updateVehicle(id: number, data: Partial<CreateVehicleDto>): Promise<Vehicle>;
}

class InfrastructureApiService implements IInfrastructureService {
  async getBuildings() { return apiClient.get<DormBuilding[]>(ENDPOINTS.infrastructure.buildings); }
  async getRooms(params: DormRoomListParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: DormRoom[] }>(ENDPOINTS.infrastructure.rooms, {
      params: { page, page_size: pageSize, building_id: params.buildingId, floor: params.floor, status: params.status },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async getEquipment(params: EquipmentListParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Equipment[] }>(ENDPOINTS.infrastructure.equipment, {
      params: { page, page_size: pageSize, search: params.search, category: params.category, status: params.status },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async getEquipmentById(id: number) { return apiClient.get<Equipment>(ENDPOINTS.infrastructure.equipmentDetail(id)); }
  async createEquipment(data: CreateEquipmentDto) { return apiClient.post<Equipment>(ENDPOINTS.infrastructure.equipment, data); }
  async updateEquipment(id: number, data: Partial<CreateEquipmentDto>) { return apiClient.patch<Equipment>(ENDPOINTS.infrastructure.equipmentDetail(id), data); }
  async deleteEquipment(id: number) { return apiClient.delete<void>(ENDPOINTS.infrastructure.equipmentDetail(id)); }
  async getVehicles(params: VehicleListParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Vehicle[] }>(ENDPOINTS.infrastructure.vehicles, {
      params: { page, page_size: pageSize, search: params.search, status: params.status },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async createVehicle(data: CreateVehicleDto) { return apiClient.post<Vehicle>(ENDPOINTS.infrastructure.vehicles, data); }
  async updateVehicle(id: number, data: Partial<CreateVehicleDto>) { return apiClient.patch<Vehicle>(ENDPOINTS.infrastructure.vehicleDetail(id), data); }
}

export const infrastructureService: IInfrastructureService = USE_MOCK
  ? new InfrastructureMockService()
  : new InfrastructureApiService();
