import { delay } from './delay';
import { generateName, pick, rnum } from './shared-data';
import type {
  NewsArticle,
  NewsListParams,
  CreateNewsDto,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import type { INewsService } from '../services/news.service';

const NEWS_TAGS = ["ta'lim", 'ilmiy', 'sport', 'madaniyat', 'texnologiya', "xalqaro aloqalar", 'talabalar', 'bayram'];

const NEWS_DATA = [
  {
    title: "Universitet xalqaro reytingda 15 o'ringa ko'tarildi",
    excerpt: "QS World University Rankings 2026 natijalariga ko'ra universitetimiz salmoqli yutuqqa erishdi.",
    category: 'Universitet',
  },
  {
    title: "Yangi o'quv dasturlari ishlab chiqildi",
    excerpt: "2026-2027 o'quv yili uchun yangi o'quv dasturlari tasdiqlandi.",
    category: "Ta'lim",
  },
  {
    title: "Xalqaro ilmiy konferensiya muvaffaqiyatli o'tdi",
    excerpt: "10 mamlakatdan 200 dan ortiq olim ishtirok etdi.",
    category: 'Ilmiy',
  },
  {
    title: "Talabalar sportchilari respublika musobaqasida g'olib",
    excerpt: "Basketbol jamoamiz respublika chempionatida birinchi o'rinni egalladi.",
    category: 'Sport',
  },
  {
    title: "Navro'z bayrami tantanali nishonlandi",
    excerpt: "Universitet hududida Navro'z bayrami keng nishonlandi.",
    category: 'Madaniyat',
  },
  {
    title: "Germaniya universitetlari bilan hamkorlik shartnomasi imzolandi",
    excerpt: "3 ta Germaniya universiteti bilan ikki tomonlama hamkorlik shartnomasi imzolandi.",
    category: 'Xalqaro',
  },
  {
    title: "Raqamli kutubxona ishga tushirildi",
    excerpt: "50 000 dan ortiq elektron kitob va maqolalar bazasi ochildi.",
    category: "Ta'lim",
  },
  {
    title: "Yosh olimlar forumi bo'lib o'tdi",
    excerpt: "Forum doirasida 45 ta ilmiy loyiha taqdim etildi.",
    category: 'Ilmiy',
  },
  {
    title: "Yangi sport majmuasi qurilishi boshlandi",
    excerpt: "Zamonaviy sport majmuasi 2027 yilga qadar foydalanishga topshiriladi.",
    category: 'Sport',
  },
  {
    title: "Talabalar Koreya universitetlarida malaka oshirdi",
    excerpt: "15 nafar talaba ikki haftalik dastur doirasida Seulda bo'ldi.",
    category: 'Xalqaro',
  },
  {
    title: "IT sohasida yangi magistratura dasturi ochildi",
    excerpt: "Sun'iy intellekt va ma'lumotlar fani yo'nalishida magistratura ochildi.",
    category: "Ta'lim",
  },
  {
    title: "Universitet tashkil etilganining 30 yilligi nishonlandi",
    excerpt: "Bayram tadbirlari bir hafta davom etdi.",
    category: 'Madaniyat',
  },
];

function generateNews(): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const data = NEWS_DATA[i]!;
    const author = generateName(i + 1600);
    const published = new Date(now);
    published.setDate(published.getDate() - rnum(i * 3, 0, 60));

    const tagCount = rnum(i * 5, 1, 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = pick(NEWS_TAGS, i * 7 + t);
      if (!tags.includes(tag)) tags.push(tag);
    }

    articles.push({
      id: 14000 + i,
      title: data.title,
      content: `${data.excerpt}\n\nBatafsil ma'lumot: ${data.title.toLowerCase()} bo'yicha barcha ma'lumotlar universitet veb-saytida e'lon qilinadi. Barcha manfaatdor tomonlar tegishli bo'limlarga murojaat qilishlari mumkin.`,
      excerpt: data.excerpt,
      author: author.short,
      category: data.category,
      tags,
      isPinned: i < 2,
      publishedAt: published.toISOString().slice(0, 10),
    });
  }
  return articles;
}

let allNews = generateNews();

export class NewsMockService implements INewsService {
  async getList(params: NewsListParams): Promise<PaginatedResponse<NewsArticle>> {
    await delay(300);

    let filtered = [...allNews];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q),
      );
    }
    if (params.category) filtered = filtered.filter((n) => n.category === params.category);
    if (params.tag) filtered = filtered.filter((n) => n.tags.includes(params.tag!));

    // Pinned first
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getById(id: number): Promise<NewsArticle> {
    await delay(200);
    const article = allNews.find((n) => n.id === id);
    if (!article) throw new Error('Yangilik topilmadi');
    return article;
  }

  async create(data: CreateNewsDto): Promise<NewsArticle> {
    await delay(400);
    const author = generateName(allNews.length + 1600);
    const article: NewsArticle = {
      id: Math.max(...allNews.map((n) => n.id), 14000) + 1,
      title: data.title,
      content: data.content,
      excerpt: data.content.slice(0, 120) + '...',
      author: author.short,
      category: data.category,
      tags: data.tags,
      isPinned: false,
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    allNews = [article, ...allNews];
    return article;
  }

  async update(id: number, data: Partial<CreateNewsDto>): Promise<NewsArticle> {
    await delay(300);
    const idx = allNews.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error('Yangilik topilmadi');
    const updated = { ...allNews[idx]!, ...data };
    allNews[idx] = updated;
    return updated;
  }

  async delete(id: number): Promise<void> {
    await delay(200);
    allNews = allNews.filter((n) => n.id !== id);
  }
}
