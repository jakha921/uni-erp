import { delay } from './delay';
import type {
  BudgetCategory,
  BudgetListParams,
  BudgetSummary,
} from '@/types/finance';
import type { IBudgetService } from '../services/budget.service';

// ---------- Seeded random ----------
function seedRand(i: number): number {
  return ((i * 2654435761) % 2 ** 32) / 2 ** 32;
}
function rnum(i: number, min: number, max: number): number {
  return Math.floor(seedRand(i) * (max - min + 1)) + min;
}

// ---------- Budget categories ----------
const CATEGORY_DATA: { name: string; code: string; parentId: number | null }[] = [
  { name: "Ish haqi fondi", code: 'BDG-01', parentId: null },
  { name: "O'quv xarajatlari", code: 'BDG-02', parentId: null },
  { name: "Kommunal xarajatlar", code: 'BDG-03', parentId: null },
  { name: "Ilmiy tadqiqotlar", code: 'BDG-04', parentId: null },
  { name: "Kapital ta'mirlash", code: 'BDG-05', parentId: null },
  { name: "Jihozlar va texnika", code: 'BDG-06', parentId: null },
  { name: "Transport xarajatlari", code: 'BDG-07', parentId: null },
  { name: "IT infratuzilma", code: 'BDG-08', parentId: null },
  { name: "Kutubxona fondi", code: 'BDG-09', parentId: null },
  { name: "Sport va madaniyat", code: 'BDG-10', parentId: null },
  { name: "Xavfsizlik", code: 'BDG-11', parentId: null },
  { name: "Boshqa xarajatlar", code: 'BDG-12', parentId: null },
  // Sub-categories
  { name: "Professor-o'qituvchilar", code: 'BDG-01-01', parentId: 1 },
  { name: "Ma'muriy xodimlar", code: 'BDG-01-02', parentId: 1 },
  { name: "Texnik xodimlar", code: 'BDG-01-03', parentId: 1 },
  { name: "Darsliklar va qo'llanmalar", code: 'BDG-02-01', parentId: 2 },
  { name: "Laboratoriya jihozlari", code: 'BDG-02-02', parentId: 2 },
  { name: "Elektr energiya", code: 'BDG-03-01', parentId: 3 },
  { name: "Gaz va isitish", code: 'BDG-03-02', parentId: 3 },
  { name: "Suv ta'minoti", code: 'BDG-03-03', parentId: 3 },
];

function generateCategories(): BudgetCategory[] {
  return CATEGORY_DATA.map((cat, i) => {
    const planned = cat.parentId
      ? rnum(i * 7, 50000000, 500000000)
      : rnum(i * 7, 500000000, 5000000000);
    const spentRatio = seedRand(i * 13) * 0.7 + 0.1; // 10-80% spent
    const spent = Math.round(planned * spentRatio);
    const remaining = planned - spent;
    const percentUsed = Math.round((spent / planned) * 1000) / 10;

    return {
      id: i + 1,
      name: cat.name,
      code: cat.code,
      planned,
      spent,
      remaining,
      percentUsed,
      parentId: cat.parentId,
    };
  });
}

const ALL_CATEGORIES = generateCategories();

export class BudgetMockService implements IBudgetService {
  async getCategories(params: BudgetListParams): Promise<BudgetCategory[]> {
    await delay(300);

    // If quarter is specified, adjust the spent proportionally
    if (params.quarter) {
      const quarterRatio = params.quarter / 4;
      return ALL_CATEGORIES.map((cat) => {
        const adjustedSpent = Math.round(cat.spent * quarterRatio);
        return {
          ...cat,
          spent: adjustedSpent,
          remaining: cat.planned - adjustedSpent,
          percentUsed: Math.round((adjustedSpent / cat.planned) * 1000) / 10,
        };
      });
    }

    return [...ALL_CATEGORIES];
  }

  async getSummary(year: number): Promise<BudgetSummary> {
    await delay(300);

    const totalPlanned = ALL_CATEGORIES
      .filter((c) => c.parentId === null)
      .reduce((s, c) => s + c.planned, 0);
    const totalSpent = ALL_CATEGORIES
      .filter((c) => c.parentId === null)
      .reduce((s, c) => s + c.spent, 0);
    const totalRemaining = totalPlanned - totalSpent;

    const byQuarter = [1, 2, 3, 4].map((q) => {
      const qRatio = q / 4;
      const planned = Math.round(totalPlanned * 0.25);
      const spent = Math.round(totalSpent * qRatio * (0.2 + seedRand(year * 10 + q) * 0.1));
      return { quarter: q, planned, spent };
    });

    return { totalPlanned, totalSpent, totalRemaining, byQuarter };
  }

  async updateCategory(id: number, planned: number): Promise<BudgetCategory> {
    await delay(300);
    const cat = ALL_CATEGORIES.find((c) => c.id === id);
    if (!cat) throw new Error('Budget category not found');
    cat.planned = planned;
    return { ...cat };
  }
}
