import { delay } from './delay';
import { generateName, pick, rnum } from './shared-data';
import type {
  DormBuilding, DormRoom, DormRoomListParams,
  Equipment, EquipmentListParams, CreateEquipmentDto,
  Vehicle, VehicleListParams, CreateVehicleDto,
} from '@/types/infrastructure';
import type { PaginatedResponse } from '@/types/common';
import type { IInfrastructureService } from '../services/infrastructure.service';

const BUILDINGS: DormBuilding[] = [
  { id: 1, name: '1-yotoqxona', address: 'Universitet shaharchasi, 1-bino', floors: 5, totalRooms: 80, occupancy: 92 },
  { id: 2, name: '2-yotoqxona', address: 'Universitet shaharchasi, 2-bino', floors: 4, totalRooms: 60, occupancy: 87 },
];

const ROOMS: DormRoom[] = Array.from({ length: 48 }, (_, i) => {
  const capacity = 4;
  const rawOcc = rnum(i * 3, 0, 5);
  const isRepair = rawOcc === 5;
  const occupied = isRepair ? 0 : Math.min(rawOcc, capacity);
  const status = isRepair ? 'repair' : occupied === 0 ? 'available' : occupied === capacity ? 'full' : 'partial';
  return { id: i + 1, buildingId: i < 24 ? 1 : 2, number: 201 + i, floor: Math.floor((i % 24) / 6) + 2, capacity, occupied, status: status as DormRoom['status'], supervisorName: generateName(i + 500, 0.4).short };
});

const EQ_CATEGORIES = ['Kompyuter', 'Printer', 'Proyektor', 'Mebel', 'Server', 'Laboratoriya jihozi'];
const EQ_STATUSES: Equipment['status'][] = ['working', 'repair', 'written_off', 'storage'];
const LOCATIONS = ['1-bino, 101-xona', '2-bino, 205-xona', '3-bino, Lab-1', 'Kutubxona', 'Server xona', 'Konferens-zal'];

const EQUIPMENT: Equipment[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `${pick(EQ_CATEGORIES, i)} #${i + 1}`,
  inventoryNumber: `INV-${String(2024000 + i)}`,
  category: pick(EQ_CATEGORIES, i + 1),
  location: pick(LOCATIONS, i + 2),
  responsiblePerson: generateName(i + 600, 0.3).short,
  purchaseDate: `202${rnum(i, 2, 5)}-0${rnum(i, 1, 9)}-${String(rnum(i, 1, 28)).padStart(2, '0')}`,
  cost: rnum(i + 5, 500000, 15000000),
  status: pick(EQ_STATUSES, i + 3),
  lastMaintenanceDate: i % 3 === 0 ? `2026-0${rnum(i, 1, 4)}-15` : undefined,
}));

const BRANDS = ['Isuzu', 'Hyundai', 'Chevrolet', 'Mercedes', 'MAN', 'Ford'];
const V_STATUSES: Vehicle['status'][] = ['available', 'in_use', 'repair', 'decommissioned'];

const VEHICLES: Vehicle[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  brand: pick(BRANDS, i),
  model: `Model-${rnum(i, 100, 999)}`,
  plateNumber: `01${String.fromCharCode(65 + (i % 26))}${String(rnum(i, 100, 999))}${String.fromCharCode(66 + (i % 25))}${String.fromCharCode(67 + (i % 24))}`,
  year: rnum(i + 2, 2018, 2025),
  driverName: generateName(i + 800, 0.1).short,
  route: i % 2 === 0 ? `Marshrut #${i + 1}` : undefined,
  status: pick(V_STATUSES, i + 1),
  mileage: rnum(i, 10000, 150000),
  lastServiceDate: `2026-0${rnum(i, 1, 4)}-${String(rnum(i, 1, 28)).padStart(2, '0')}`,
}));

export class InfrastructureMockService implements IInfrastructureService {
  async getBuildings() { await delay(200); return BUILDINGS; }

  async getRooms(params: DormRoomListParams): Promise<PaginatedResponse<DormRoom>> {
    await delay(300);
    let data = [...ROOMS];
    if (params.buildingId) data = data.filter((r) => r.buildingId === params.buildingId);
    if (params.floor) data = data.filter((r) => r.floor === params.floor);
    if (params.status) data = data.filter((r) => r.status === params.status);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 50;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }

  async getEquipment(params: EquipmentListParams): Promise<PaginatedResponse<Equipment>> {
    await delay(300);
    let data = [...EQUIPMENT];
    if (params.search) { const q = params.search.toLowerCase(); data = data.filter((e) => e.name.toLowerCase().includes(q) || e.inventoryNumber.toLowerCase().includes(q)); }
    if (params.category) data = data.filter((e) => e.category === params.category);
    if (params.status) data = data.filter((e) => e.status === params.status);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 20;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }

  async getEquipmentById(id: number) { await delay(200); const e = EQUIPMENT.find((e) => e.id === id); if (!e) throw new Error('Not found'); return e; }
  async createEquipment(data: CreateEquipmentDto) { await delay(300); return { id: EQUIPMENT.length + 1, ...data, status: 'working' as const }; }
  async updateEquipment(id: number, data: Partial<CreateEquipmentDto>) { await delay(300); const e = EQUIPMENT.find((e) => e.id === id); if (!e) throw new Error('Not found'); return { ...e, ...data }; }
  async deleteEquipment(_id: number) { await delay(200); }

  async getVehicles(params: VehicleListParams): Promise<PaginatedResponse<Vehicle>> {
    await delay(300);
    let data = [...VEHICLES];
    if (params.search) { const q = params.search.toLowerCase(); data = data.filter((v) => v.brand.toLowerCase().includes(q) || v.plateNumber.toLowerCase().includes(q)); }
    if (params.status) data = data.filter((v) => v.status === params.status);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 20;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }

  async createVehicle(data: CreateVehicleDto) { await delay(300); return { id: VEHICLES.length + 1, ...data, status: 'available' as const, mileage: 0 }; }
  async updateVehicle(id: number, data: Partial<CreateVehicleDto>) { await delay(300); const v = VEHICLES.find((v) => v.id === id); if (!v) throw new Error('Not found'); return { ...v, ...data }; }
}
