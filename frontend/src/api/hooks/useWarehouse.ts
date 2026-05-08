import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WarehouseListParams, CreateItemDto, CreateMovementDto } from '@/types/warehouse';
import { warehouseService } from '../services/warehouse.service';

const KEYS = {
  all: ['warehouse'] as const,
  items: () => [...KEYS.all, 'items'] as const,
  itemList: (params: WarehouseListParams) => [...KEYS.items(), params] as const,
  itemDetail: (id: number) => [...KEYS.items(), 'detail', id] as const,
  movements: (itemId?: number) => [...KEYS.all, 'movements', itemId] as const,
  stats: () => [...KEYS.all, 'stats'] as const,
};

export function useWarehouseItems(params: WarehouseListParams) {
  return useQuery({ queryKey: KEYS.itemList(params), queryFn: () => warehouseService.getItems(params) });
}

export function useWarehouseItem(id: number) {
  return useQuery({ queryKey: KEYS.itemDetail(id), queryFn: () => warehouseService.getItemById(id), enabled: id > 0 });
}

export function useCreateWarehouseItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateItemDto) => warehouseService.createItem(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.items() }); void qc.invalidateQueries({ queryKey: KEYS.stats() }); } });
}

export function useUpdateWarehouseItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<CreateItemDto> }) => warehouseService.updateItem(id, data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.items() }); } });
}

export function useDeleteWarehouseItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => warehouseService.deleteItem(id), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.items() }); void qc.invalidateQueries({ queryKey: KEYS.stats() }); } });
}

export function useStockMovements(itemId?: number) {
  return useQuery({ queryKey: KEYS.movements(itemId), queryFn: () => warehouseService.getMovements(itemId) });
}

export function useCreateMovement() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateMovementDto) => warehouseService.createMovement(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.all }); } });
}

export function useWarehouseStats() {
  return useQuery({ queryKey: KEYS.stats(), queryFn: () => warehouseService.getStats() });
}
