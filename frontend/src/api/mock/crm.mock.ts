import { delay } from './delay';
import type {
  Lead,
  LeadListItem,
  LeadListParams,
  CreateLeadDto,
  UpdateLeadDto,
  LeadStatus,
  LeadSource,
  CrmStats,
} from '@/types/crm';
import type { PaginatedResponse } from '@/types/common';
import type { ICrmService } from '../services/crm.service';
import { generateName, generatePhone, generateEmail, pick, rnum, seed, DIRECTIONS } from './shared-data';

// ---------- Reference data ----------
const LEAD_SOURCES: LeadSource[] = ['website', 'telegram', 'instagram', 'referral', 'event', 'call'];

const ASSIGNEES = [
  { id: 1, name: 'Olimov B.' },
  { id: 2, name: 'Nazarova M.' },
  { id: 3, name: 'Saidov R.' },
  { id: 4, name: 'Xolmatova D.' },
  { id: 5, name: 'Karimov U.' },
];

const NOTES_TEMPLATES = [
  "Telefon orqali bog'landi, qiziqish bildirdi",
  "Telegram guruhdan keldi, yo'nalishni tanlashda yordam kerak",
  "Instagram reklamadan, IT yo'nalishiga qiziqadi",
  "Do'sti tavsiya qilgan, hujjatlarni tayyorlayapti",
  "Ochiq eshiklar kunida qatnashgan",
  "Veb-saytdagi formani to'ldirgan",
  "Qo'ng'iroq qildi, narxlar haqida so'radi",
  "Onlayn konsultatsiyaga yozilgan",
  "Imtihon natijalari kutilmoqda",
  "Hujjatlar topshirildi, ko'rib chiqilmoqda",
];

// ---------- Generate 30 leads ----------
function generateLeads(): Lead[] {
  const result: Lead[] = [];

  for (let i = 0; i < 30; i++) {
    const name = generateName(i + 300, 0.48);
    const assignee = pick(ASSIGNEES, i + 401);

    // Status distribution: 25% new, 20% contacted, 20% interested, 15% applied, 10% enrolled, 10% rejected
    let status: LeadStatus;
    const statusRoll = seed(i * 17 + 500);
    if (statusRoll < 0.25) status = 'new';
    else if (statusRoll < 0.45) status = 'contacted';
    else if (statusRoll < 0.65) status = 'interested';
    else if (statusRoll < 0.80) status = 'applied';
    else if (statusRoll < 0.90) status = 'enrolled';
    else status = 'rejected';

    const source = pick(LEAD_SOURCES, i * 7 + 600);
    const createdDay = rnum(i * 23 + 700, 1, 28);
    const createdMonth = rnum(i * 29 + 800, 1, 4);
    const createdAt = `2026-${String(createdMonth).padStart(2, '0')}-${String(createdDay).padStart(2, '0')}`;

    const hasLastContact = status !== 'new';
    const lastContactDay = rnum(i * 31 + 900, 1, 28);
    const lastContactDate = hasLastContact
      ? `2026-${String(Math.min(createdMonth + 1, 5)).padStart(2, '0')}-${String(lastContactDay).padStart(2, '0')}`
      : undefined;

    const hasNextContact = status === 'contacted' || status === 'interested';
    const nextContactDay = rnum(i * 37 + 1000, 1, 28);
    const nextContactDate = hasNextContact
      ? `2026-${String(Math.min(createdMonth + 2, 6)).padStart(2, '0')}-${String(nextContactDay).padStart(2, '0')}`
      : undefined;

    const email = seed(i * 41 + 1100) > 0.4 ? generateEmail(name) : undefined;
    const score = rnum(i * 43 + 1200, 10, 100);

    result.push({
      id: 5000 + i,
      firstName: name.first,
      lastName: name.last,
      phone: generatePhone(i + 305),
      email,
      direction: pick(DIRECTIONS, i + 310),
      source,
      status,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      notes: pick(NOTES_TEMPLATES, i + 315),
      score,
      createdAt,
      updatedAt: lastContactDate ?? createdAt,
      lastContactDate,
      nextContactDate,
    });
  }

  return result;
}

function toListItem(lead: Lead): LeadListItem {
  return {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    phone: lead.phone,
    direction: lead.direction,
    source: lead.source,
    status: lead.status,
    assigneeName: lead.assigneeName,
    score: lead.score,
    createdAt: lead.createdAt,
  };
}

// ---------- Mock Service ----------
const ALL_LEADS = generateLeads();

export class CrmMockService implements ICrmService {
  private leads: Lead[] = [...ALL_LEADS];

  async getLeads(params: LeadListParams): Promise<PaginatedResponse<LeadListItem>> {
    await delay(300);

    let filtered = [...this.leads];

    // Search
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.firstName.toLowerCase().includes(q) ||
          l.lastName.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.direction.toLowerCase().includes(q),
      );
    }

    // Filters
    if (params.status) {
      filtered = filtered.filter((l) => l.status === params.status);
    }
    if (params.source) {
      filtered = filtered.filter((l) => l.source === params.source);
    }
    if (params.assigneeId) {
      filtered = filtered.filter((l) => l.assigneeId === params.assigneeId);
    }
    if (params.dateFrom) {
      filtered = filtered.filter((l) => l.createdAt >= params.dateFrom!);
    }
    if (params.dateTo) {
      filtered = filtered.filter((l) => l.createdAt <= params.dateTo!);
    }

    // Sort
    if (params.sortBy) {
      const dir = params.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[params.sortBy as keyof Lead];
        const bVal = b[params.sortBy as keyof Lead];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * dir;
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * dir;
        }
        return 0;
      });
    }

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize).map(toListItem);

    return { data, total, page, pageSize, totalPages };
  }

  async getLeadById(id: number): Promise<Lead> {
    await delay(200);
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) throw new Error('Ariza topilmadi');
    return lead;
  }

  async createLead(data: CreateLeadDto): Promise<Lead> {
    await delay(400);
    const maxId = Math.max(...this.leads.map((l) => l.id));
    const assignee = data.assigneeId
      ? ASSIGNEES.find((a) => a.id === data.assigneeId) ?? ASSIGNEES[0]!
      : ASSIGNEES[0]!;

    const now = new Date().toISOString().slice(0, 10);
    const lead: Lead = {
      id: maxId + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      direction: data.direction,
      source: data.source,
      status: 'new',
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      notes: data.notes ?? '',
      score: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.leads.unshift(lead);
    return lead;
  }

  async updateLead(id: number, data: UpdateLeadDto): Promise<Lead> {
    await delay(400);
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('Ariza topilmadi');

    const existing = this.leads[idx]!;
    const assignee = data.assigneeId
      ? ASSIGNEES.find((a) => a.id === data.assigneeId)
      : undefined;

    const updated: Lead = {
      ...existing,
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      phone: data.phone ?? existing.phone,
      email: data.email !== undefined ? data.email : existing.email,
      direction: data.direction ?? existing.direction,
      source: data.source ?? existing.source,
      status: data.status ?? existing.status,
      assigneeId: assignee?.id ?? existing.assigneeId,
      assigneeName: assignee?.name ?? existing.assigneeName,
      notes: data.notes ?? existing.notes,
      nextContactDate: data.nextContactDate ?? existing.nextContactDate,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    this.leads[idx] = updated;
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    await delay(300);
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('Ariza topilmadi');
    this.leads.splice(idx, 1);
  }

  async getStats(): Promise<CrmStats> {
    await delay(300);

    const leads = this.leads;
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === 'new').length;
    const enrolledLeads = leads.filter((l) => l.status === 'enrolled').length;
    const conversionRate = totalLeads > 0
      ? Math.round((enrolledLeads / totalLeads) * 100 * 10) / 10
      : 0;

    const bySourceMap: Record<string, number> = {};
    for (const l of leads) {
      bySourceMap[l.source] = (bySourceMap[l.source] ?? 0) + 1;
    }
    const bySource = Object.entries(bySourceMap).map(([source, count]) => ({ source, count }));

    const byStatusMap: Record<string, number> = {};
    for (const l of leads) {
      byStatusMap[l.status] = (byStatusMap[l.status] ?? 0) + 1;
    }
    const byStatus = Object.entries(byStatusMap).map(([status, count]) => ({ status, count }));

    const funnelStages: LeadStatus[] = ['new', 'contacted', 'interested', 'applied', 'enrolled'];
    const funnelCounts = funnelStages.map((stage) =>
      leads.filter((l) => {
        const stageIdx = funnelStages.indexOf(stage);
        const leadIdx = funnelStages.indexOf(l.status);
        return leadIdx >= stageIdx || l.status === 'rejected';
      }).length,
    );

    // Cumulative funnel: each stage shows how many leads reached at least that stage
    const cumulativeCounts = funnelStages.map((stage) => {
      const stageIdx = funnelStages.indexOf(stage);
      return leads.filter((l) => {
        const leadIdx = funnelStages.indexOf(l.status);
        // Lead reached this stage if its current stage index >= this stage index
        return leadIdx >= stageIdx;
      }).length;
    });

    const funnel = funnelStages.map((stage, i) => ({
      stage,
      count: cumulativeCounts[i]!,
      percent: totalLeads > 0
        ? Math.round((cumulativeCounts[i]! / totalLeads) * 100)
        : 0,
    }));

    // Suppress unused variable
    void funnelCounts;

    return {
      totalLeads,
      newLeads,
      enrolledLeads,
      conversionRate,
      bySource,
      byStatus,
      funnel,
    };
  }

  async bulkUpdateStatus(ids: number[], status: LeadStatus): Promise<void> {
    await delay(400);
    for (const id of ids) {
      const idx = this.leads.findIndex((l) => l.id === id);
      if (idx !== -1) {
        this.leads[idx] = {
          ...this.leads[idx]!,
          status,
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      }
    }
  }
}
