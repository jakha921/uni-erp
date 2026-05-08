import { delay } from './delay';
import { generateName, rnum } from './shared-data';
import type {
  Appeal,
  AppealListParams,
  CreateAppealDto,
  AppealStatus,
  AppealCategory,
  AppealComment,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import type { IAppealService } from '../services/appeal.service';

const APPEAL_TITLES: Array<{ title: string; category: AppealCategory }> = [
  { title: "Dars jadvalini o'zgartirish so'rovi", category: 'request' },
  { title: "Kutubxona ish vaqti haqida shikoyat", category: 'complaint' },
  { title: "Onlayn ta'lim platformasini yaxshilash", category: 'suggestion' },
  { title: "Stipendiya hisoblash tartibi haqida savol", category: 'question' },
  { title: "Laboratoriya jihozlari ishlamayapti", category: 'complaint' },
  { title: "Qo'shimcha dars soatlari so'rovi", category: 'request' },
  { title: "Sport zali ish tartibini o'zgartirish", category: 'suggestion' },
  { title: "Akademik ta'til rasmiylashtirish", category: 'question' },
  { title: "Yotoqxona ta'mirlash so'rovi", category: 'request' },
  { title: "Imtihon natijalariga e'tiroz", category: 'complaint' },
];

const COMMENT_TEXTS = [
  "Murojaatingiz ko'rib chiqilmoqda.",
  "Qo'shimcha ma'lumot taqdim etishingiz kerak.",
  "Masala hal qilindi, natijani tekshiring.",
  "Tegishli bo'limga yo'naltirildi.",
  "Rahmat, tez orada javob beramiz.",
];

function generateAppeals(): Appeal[] {
  const appeals: Appeal[] = [];
  const statuses: AppealStatus[] = ['new', 'in_progress', 'resolved', 'closed'];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const data = APPEAL_TITLES[i]!;
    const author = generateName(i + 1400);
    const assignee = i % 3 !== 0 ? generateName(i + 1500) : null;

    const created = new Date(now);
    created.setDate(created.getDate() - rnum(i * 3, 1, 30));
    const updated = new Date(created);
    updated.setDate(updated.getDate() + rnum(i * 5, 0, 5));

    const status = statuses[i % 4]!;
    const commentCount = status === 'new' ? 0 : rnum(i * 7, 1, 3);
    const comments: AppealComment[] = [];
    for (let c = 0; c < commentCount; c++) {
      const commentAuthor = c % 2 === 0 ? (assignee ?? author) : author;
      const commentDate = new Date(created);
      commentDate.setDate(commentDate.getDate() + c + 1);
      comments.push({
        id: i * 100 + c,
        authorName: commentAuthor.short,
        content: COMMENT_TEXTS[c % COMMENT_TEXTS.length]!,
        createdAt: commentDate.toISOString().slice(0, 10),
      });
    }

    appeals.push({
      id: 13000 + i,
      title: data.title,
      description: `${data.title} bo'yicha batafsil ma'lumot.`,
      category: data.category,
      status,
      authorId: 1000 + i,
      authorName: author.full,
      assigneeId: assignee ? 2000 + i : undefined,
      assigneeName: assignee?.short,
      comments,
      createdAt: created.toISOString().slice(0, 10),
      updatedAt: updated.toISOString().slice(0, 10),
    });
  }
  return appeals;
}

let allAppeals = generateAppeals();

export class AppealMockService implements IAppealService {
  async getList(params: AppealListParams): Promise<PaginatedResponse<Appeal>> {
    await delay(300);

    let filtered = [...allAppeals];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q),
      );
    }
    if (params.status) filtered = filtered.filter((a) => a.status === params.status);
    if (params.category) filtered = filtered.filter((a) => a.category === params.category);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getById(id: number): Promise<Appeal> {
    await delay(200);
    const appeal = allAppeals.find((a) => a.id === id);
    if (!appeal) throw new Error('Murojaat topilmadi');
    return appeal;
  }

  async create(data: CreateAppealDto): Promise<Appeal> {
    await delay(400);
    const author = generateName(allAppeals.length + 1400);
    const now = new Date().toISOString().slice(0, 10);
    const appeal: Appeal = {
      id: Math.max(...allAppeals.map((a) => a.id), 13000) + 1,
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'new',
      authorId: 1000,
      authorName: author.full,
      comments: [],
      createdAt: now,
      updatedAt: now,
    };
    allAppeals = [appeal, ...allAppeals];
    return appeal;
  }

  async updateStatus(id: number, status: AppealStatus): Promise<Appeal> {
    await delay(200);
    const idx = allAppeals.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Murojaat topilmadi');
    const updated = {
      ...allAppeals[idx]!,
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    allAppeals[idx] = updated;
    return updated;
  }

  async addComment(id: number, content: string): Promise<AppealComment> {
    await delay(300);
    const idx = allAppeals.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Murojaat topilmadi');
    const author = generateName(1000);
    const comment: AppealComment = {
      id: Date.now() % 100000,
      authorName: author.short,
      content,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    allAppeals[idx] = {
      ...allAppeals[idx]!,
      comments: [...allAppeals[idx]!.comments, comment],
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    return comment;
  }

  async delete(id: number): Promise<void> {
    await delay(200);
    allAppeals = allAppeals.filter((a) => a.id !== id);
  }
}
