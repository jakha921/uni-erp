import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DormRoomListParams, CreateRoomDto, EquipmentListParams, CreateEquipmentDto, VehicleListParams, CreateVehicleDto } from '@/types/infrastructure';
import { infrastructureService } from '../services/infrastructure.service';

const KEYS = {
  all: ['infrastructure'] as const,
  buildings: () => [...KEYS.all, 'buildings'] as const,
  rooms: (params: DormRoomListParams) => [...KEYS.all, 'rooms', params] as const,
  equipment: () => [...KEYS.all, 'equipment'] as const,
  equipmentList: (params: EquipmentListParams) => [...KEYS.equipment(), params] as const,
  equipmentDetail: (id: number) => [...KEYS.equipment(), 'detail', id] as const,
  vehicles: () => [...KEYS.all, 'vehicles'] as const,
  vehicleList: (params: VehicleListParams) => [...KEYS.vehicles(), params] as const,
};

export function useDormBuildings() {
  return useQuery({ queryKey: KEYS.buildings(), queryFn: () => infrastructureService.getBuildings(), staleTime: 5 * 60 * 1000 });
}

export function useDormRooms(params: DormRoomListParams) {
  return useQuery({ queryKey: KEYS.rooms(params), queryFn: () => infrastructureService.getRooms(params) });
}

export function useCreateDormRoom() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateRoomDto) => infrastructureService.createRoom(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.all }); } });
}

export function useUpdateDormRoom() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<CreateRoomDto> }) => infrastructureService.updateRoom(id, data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.all }); } });
}

export function useDeleteDormRoom() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => infrastructureService.deleteRoom(id), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.all }); } });
}

export function useEquipment(params: EquipmentListParams) {
  return useQuery({ queryKey: KEYS.equipmentList(params), queryFn: () => infrastructureService.getEquipment(params) });
}

export function useEquipmentById(id: number) {
  return useQuery({ queryKey: KEYS.equipmentDetail(id), queryFn: () => infrastructureService.getEquipmentById(id), enabled: id > 0 });
}

export function useCreateEquipment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateEquipmentDto) => infrastructureService.createEquipment(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.equipment() }); } });
}

export function useUpdateEquipment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<CreateEquipmentDto> }) => infrastructureService.updateEquipment(id, data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.equipment() }); } });
}

export function useDeleteEquipment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => infrastructureService.deleteEquipment(id), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.equipment() }); } });
}

export function useVehicles(params: VehicleListParams) {
  return useQuery({ queryKey: KEYS.vehicleList(params), queryFn: () => infrastructureService.getVehicles(params) });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateVehicleDto) => infrastructureService.createVehicle(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.vehicles() }); } });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<CreateVehicleDto> }) => infrastructureService.updateVehicle(id, data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.vehicles() }); } });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => infrastructureService.deleteVehicle(id), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.vehicles() }); } });
}
