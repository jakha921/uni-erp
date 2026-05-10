import type { ListParams } from './common';

export type RoomStatus = 'available' | 'partial' | 'full' | 'repair';

export interface DormBuilding {
  id: number;
  name: string;
  address: string;
  floors: number;
  totalRooms: number;
  occupancy: number;
}

export interface DormRoom {
  id: number;
  buildingId: number;
  number: number;
  floor: number;
  capacity: number;
  occupied: number;
  status: RoomStatus;
  supervisorName?: string;
}

export interface DormResident {
  id: number;
  roomId: number;
  studentId: number;
  studentName: string;
  checkInDate: string;
  checkOutDate?: string;
}

export interface CheckInDto {
  roomId: number;
  studentId: number;
  studentName: string;
  checkInDate: string;
}

export interface DormRoomListParams extends ListParams {
  buildingId?: number;
  floor?: number;
  status?: RoomStatus;
}

export interface CreateRoomDto {
  buildingId: number;
  number: number;
  floor: number;
  capacity: number;
  status: RoomStatus;
}

export type EquipmentStatus = 'working' | 'repair' | 'written_off' | 'storage';

export interface Equipment {
  id: number;
  name: string;
  inventoryNumber: string;
  category: string;
  location: string;
  responsiblePerson: string;
  purchaseDate: string;
  cost: number;
  status: EquipmentStatus;
  lastMaintenanceDate?: string;
}

export interface EquipmentListParams extends ListParams {
  category?: string;
  status?: EquipmentStatus;
  location?: string;
}

export interface CreateEquipmentDto {
  name: string;
  inventoryNumber: string;
  category: string;
  location: string;
  responsiblePerson: string;
  purchaseDate: string;
  cost: number;
}

export type VehicleStatus = 'available' | 'in_use' | 'repair' | 'decommissioned';

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  year: number;
  driverName: string;
  route?: string;
  status: VehicleStatus;
  mileage: number;
  lastServiceDate?: string;
}

export interface VehicleListParams extends ListParams {
  status?: VehicleStatus;
}

export interface CreateVehicleDto {
  brand: string;
  model: string;
  plateNumber: string;
  year: number;
  driverName: string;
  route?: string;
}
