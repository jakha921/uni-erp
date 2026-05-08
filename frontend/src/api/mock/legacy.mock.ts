import { delay } from './delay';
import { generateName, pick, rnum, DEPARTMENTS } from './shared-data';
import type { LegacyOrder, LegacyOrderListParams, StaffingPosition, StaffingListParams } from '@/types/legacy';
import type { PaginatedResponse } from '@/types/common';
import type { ILegacyService } from '../services/legacy.service';

const ORDER_TYPES: LegacyOrder['type'][] = ['hire', 'fire', 'reward', 'leave', 'penalty'];
const TYPE_LABELS: Record<string, string> = { hire: 'Ishga qabul', fire: "Bo'shatish", reward: 'Mukofot', leave: "Ta'til", penalty: 'Jazo' };

const ORDERS: LegacyOrder[] = Array.from({ length: 12 }, (_, i) => {
  const type = pick(ORDER_TYPES, i);
  const name = generateName(i + 900, 0.4);
  return {
    id: i + 1, number: `B-${2024000 + i}`, date: `2024-0${rnum(i, 1, 9)}-${String(rnum(i, 1, 28)).padStart(2, '0')}`,
    type, typeLabel: TYPE_LABELS[type] ?? type, employeeName: name.full,
    department: pick(DEPARTMENTS, i + 1), content: `${TYPE_LABELS[type]} buyrug'i`,
    status: i > 8 ? 'archived' as const : 'active' as const,
  };
});

const POSITIONS = ['Professor', 'Dotsent', 'Katta o\'qituvchi', 'O\'qituvchi', 'Laborant', 'Buxgalter', 'Menejer'];

const STAFFING: StaffingPosition[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1, departmentId: (i % 4) + 1, departmentName: pick(DEPARTMENTS, i),
  positionName: pick(POSITIONS, i + 1), totalSlots: rnum(i, 2, 8), filledSlots: rnum(i + 1, 1, 7),
  salary: rnum(i + 3, 3000000, 15000000),
}));

export class LegacyMockService implements ILegacyService {
  async getOrders(params: LegacyOrderListParams): Promise<PaginatedResponse<LegacyOrder>> {
    await delay(300);
    let data = [...ORDERS];
    if (params.search) { const q = params.search.toLowerCase(); data = data.filter((o) => o.employeeName.toLowerCase().includes(q) || o.number.includes(q)); }
    if (params.type) data = data.filter((o) => o.type === params.type);
    if (params.status) data = data.filter((o) => o.status === params.status);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 20;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }
  async getStaffing(params: StaffingListParams) {
    await delay(300);
    let data = [...STAFFING];
    if (params.departmentId) data = data.filter((s) => s.departmentId === params.departmentId);
    return data;
  }
}
