import type {
  DormBuilding, DormRoom, DormRoomListParams,
  Equipment, EquipmentListParams, CreateEquipmentDto,
  Vehicle, VehicleListParams, CreateVehicleDto,
} from '@/types/infrastructure';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
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
    return apiClient.get<PaginatedResponse<DormRoom>>(ENDPOINTS.infrastructure.rooms, {
      params: { page: params.page, page_size: params.pageSize, building_id: params.buildingId, floor: params.floor, status: params.status },
    });
  }
  async getEquipment(params: EquipmentListParams) {
    return apiClient.get<PaginatedResponse<Equipment>>(ENDPOINTS.infrastructure.equipment, {
      params: { page: params.page, page_size: params.pageSize, search: params.search, category: params.category, status: params.status },
    });
  }
  async getEquipmentById(id: number) { return apiClient.get<Equipment>(ENDPOINTS.infrastructure.equipmentDetail(id)); }
  async createEquipment(data: CreateEquipmentDto) { return apiClient.post<Equipment>(ENDPOINTS.infrastructure.equipment, data); }
  async updateEquipment(id: number, data: Partial<CreateEquipmentDto>) { return apiClient.patch<Equipment>(ENDPOINTS.infrastructure.equipmentDetail(id), data); }
  async deleteEquipment(id: number) { return apiClient.delete<void>(ENDPOINTS.infrastructure.equipmentDetail(id)); }
  async getVehicles(params: VehicleListParams) {
    return apiClient.get<PaginatedResponse<Vehicle>>(ENDPOINTS.infrastructure.vehicles, {
      params: { page: params.page, page_size: params.pageSize, search: params.search, status: params.status },
    });
  }
  async createVehicle(data: CreateVehicleDto) { return apiClient.post<Vehicle>(ENDPOINTS.infrastructure.vehicles, data); }
  async updateVehicle(id: number, data: Partial<CreateVehicleDto>) { return apiClient.patch<Vehicle>(ENDPOINTS.infrastructure.vehicleDetail(id), data); }
}

export const infrastructureService: IInfrastructureService = USE_MOCK
  ? new InfrastructureMockService()
  : new InfrastructureApiService();
