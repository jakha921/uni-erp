import { delay } from './delay';
import { generateName, pick, rnum, DEPARTMENTS, SUBJECTS } from './shared-data';
import type {
  ResearchProject,
  Article,
  Grant,
  Conference,
  Thesis,
  Patent,
  ProjectListParams,
  ArticleListParams,
  ConferenceListParams,
  ThesisListParams,
  PatentListParams,
  CreateProjectDto,
  CreateArticleDto,
  CreateConferenceDto,
  CreateThesisDto,
  CreatePatentDto,
} from '@/types/science';
import type { PaginatedResponse, ListParams } from '@/types/common';
import type { IScienceService } from '../services/science.service';

// ===== Reference data =====

const PROJECT_TITLES = [
  "Sun'iy intellekt yordamida til tahlili",
  "Kvant hisoblash algoritmlari",
  "Neyrotarmoqlar asosida tasvirni tanib olish",
  "Kichik biznes uchun raqamli transformatsiya",
  "Qayta tiklanadigan energiya tizimlari optimizatsiyasi",
  "O'zbek tilini mashina tarjima qilish",
  "Blokcheyn texnologiyalari ta'limda",
  "IoT asosida aqlli qishloq xo'jaligi",
  "Katta ma'lumotlar tahlili sog'liqni saqlashda",
  "Robototexnika asoslari va amaliy qo'llanilishi",
  "Bulutli hisoblash infratuzilmasi",
  "Kiberxavfsizlik tahdidlarini aniqlash",
];

const JOURNALS = [
  'Journal of Applied Mathematics',
  'Computer Science Review',
  'International Journal of Economics',
  'Pedagogical Sciences Bulletin',
  "O'zbekiston Fanlar Akademiyasi Axborotnomasi",
  'IEEE Transactions on AI',
  'Nature Communications',
  'ACM Computing Surveys',
  'Springer Lecture Notes',
  "Ta'lim va innovatsiyalar jurnali",
];

const SPONSORS = [
  "O'zbekiston Respublikasi Innovatsion rivojlanish vazirligi",
  'UNDP O\'zbekiston',
  'Osiyo taraqqiyot banki',
  'ERASMUS+ dasturi',
  "Fan va texnologiya vazirligi",
  'UNESCO',
  'TEMPUS',
  'British Council',
];

const CONFERENCE_NAMES = [
  "Zamonaviy ta'lim texnologiyalari",
  'International Conference on AI and Machine Learning',
  "Raqamli iqtisodiyot: muammolar va yechimlar",
  'IEEE International Symposium on Computing',
  "Yosh olimlar ilmiy-amaliy konferensiyasi",
  "O'zbek tili va adabiyoti: an'ana va zamonaviylik",
  'ACM Conference on Computer Systems',
  "Pedagogika va psixologiya dolzarb masalalari",
];

const LOCATIONS = [
  'Toshkent, NIU',
  'Samarqand, SamDU',
  'Seoul, South Korea',
  'Istanbul, Turkey',
  'Berlin, Germany',
  'Buxoro, BuxDU',
  'Online / Zoom',
  'London, UK',
];

const THESIS_TITLES = [
  "Sun'iy intellekt asosida talabalar bilimini baholash tizimi",
  "Elektron tijorat platformalarining samaradorlik tahlili",
  "O'zbek tilining morfologik tahlili algoritmlari",
  "Kichik korxonalar moliyaviy barqarorligini baholash usullari",
  "Masofaviy ta'limda interaktiv texnologiyalardan foydalanish",
  "Neyrotarmoqlar yordamida tibbiy tasvirlarni segmentatsiya qilish",
  "Raqamli marketing strategiyalari va iste'molchi xulq-atvori",
  "Dasturiy ta'minot sifatini ta'minlash metodlari",
  "Matematik modellashtirish va optimizatsiya masalalari",
  "Pedagogik psixologiyada motivatsiya nazariyalari",
  "Blokcheyn texnologiyalari bank tizimida",
  "IoT qurilmalari uchun energiya samaradorligi",
];

const PATENT_TITLES = [
  "Sun'iy intellekt asosida ovozni tanib olish tizimi",
  "Qishloq xo'jaligida suv sarfini boshqarish qurilmasi",
  "Avtomatlashtirilgan dars jadvalini tuzish dasturi",
  "Energiya tejamkor issiqlik almashtirish qurilmasi",
  "Talabalar davomatini biometrik nazorat qilish tizimi",
  "Qurilish materiallarini sinash usuli",
  "Suv sifatini real vaqtda monitoring qilish sensori",
  "O'quv jarayonini boshqarish platformasi",
];

const PATENT_CATEGORIES = ["Dasturiy ta'minot", 'Qurilma', 'Usul', "Biotexnologiya", 'Energetika'];

// ===== Data generators =====

function generateProjects(): ResearchProject[] {
  const projects: ResearchProject[] = [];
  const statuses: ResearchProject['status'][] = ['active', 'completed', 'suspended'];

  for (let i = 0; i < 12; i++) {
    const leader = generateName(i + 100);
    const startYear = 2023 + rnum(i * 3, 0, 2);
    const duration = rnum(i * 5, 1, 3);

    projects.push({
      id: 3000 + i,
      title: PROJECT_TITLES[i % PROJECT_TITLES.length]!,
      leaderId: 1000 + i,
      leaderName: leader.short,
      department: pick(DEPARTMENTS, i * 7),
      teamSize: rnum(i * 11, 3, 12),
      fundAmount: rnum(i * 13, 50, 500) * 1_000_000,
      startDate: `${startYear}-0${rnum(i * 17, 1, 9)}-01`,
      endDate: `${startYear + duration}-0${rnum(i * 19, 1, 9)}-30`,
      status: statuses[i % 3]!,
      progress: statuses[i % 3] === 'completed' ? 100 : rnum(i * 23, 10, 90),
      description: `${PROJECT_TITLES[i % PROJECT_TITLES.length]} bo'yicha tadqiqot loyihasi.`,
    });
  }
  return projects;
}

function generateArticles(): Article[] {
  const articles: Article[] = [];
  const types: Article['type'][] = ['scopus', 'wos', 'vak', 'local'];

  for (let i = 0; i < 20; i++) {
    const author1 = generateName(i + 200);
    const author2 = generateName(i + 300);
    const type = types[i % 4]!;

    articles.push({
      id: 4000 + i,
      title: `${pick(SUBJECTS, i * 3)} sohasida zamonaviy yondashuvlar — ${i + 1}`,
      authors: `${author1.short}, ${author2.short}`,
      journal: pick(JOURNALS, i * 5),
      year: 2022 + rnum(i * 7, 0, 3),
      type,
      doi: type === 'scopus' || type === 'wos' ? `10.1000/j.${1000 + i}` : undefined,
      citations: rnum(i * 9, 0, 45),
    });
  }
  return articles;
}

function generateGrants(): Grant[] {
  const grants: Grant[] = [];
  const statuses: Grant['status'][] = ['active', 'completed', 'pending'];

  for (let i = 0; i < 8; i++) {
    const startYear = 2023 + rnum(i * 3, 0, 2);
    grants.push({
      id: 5000 + i,
      projectName: PROJECT_TITLES[i % PROJECT_TITLES.length]!,
      sponsor: pick(SPONSORS, i * 5),
      amount: rnum(i * 7, 100, 1000) * 1_000_000,
      status: statuses[i % 3]!,
      startDate: `${startYear}-01-01`,
      endDate: `${startYear + rnum(i * 11, 1, 3)}-12-31`,
    });
  }
  return grants;
}

function generateConferences(): Conference[] {
  const conferences: Conference[] = [];
  const types: Conference['type'][] = ['international', 'national', 'university'];
  const statuses: Conference['status'][] = ['upcoming', 'active', 'completed'];

  for (let i = 0; i < 8; i++) {
    const month = rnum(i * 3, 1, 12);
    const day = rnum(i * 5, 1, 28);
    const year = 2025 + rnum(i * 7, 0, 1);

    conferences.push({
      id: 6000 + i,
      name: CONFERENCE_NAMES[i % CONFERENCE_NAMES.length]!,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      endDate: `${year}-${String(month).padStart(2, '0')}-${String(Math.min(28, day + rnum(i * 9, 1, 3))).padStart(2, '0')}`,
      location: pick(LOCATIONS, i * 11),
      type: types[i % 3]!,
      participantCount: rnum(i * 13, 30, 500),
      status: statuses[i % 3]!,
      description: `${CONFERENCE_NAMES[i % CONFERENCE_NAMES.length]} — ilmiy-amaliy anjuman.`,
    });
  }
  return conferences;
}

function generateTheses(): Thesis[] {
  const theses: Thesis[] = [];
  const stages: Thesis['stage'][] = ['topic_approved', 'in_progress', 'review', 'defense', 'completed'];
  const types: Thesis['type'][] = ['bakalavr', 'magistr'];

  for (let i = 0; i < 15; i++) {
    const student = generateName(i + 400, 0.5);
    const supervisor = generateName(i + 600, 0.3);
    const stage = stages[i % 5]!;

    theses.push({
      id: 7000 + i,
      title: THESIS_TITLES[i % THESIS_TITLES.length]!,
      studentId: 1000 + i,
      studentName: student.full,
      supervisorId: 2000 + (i % 10),
      supervisorName: supervisor.short,
      department: pick(DEPARTMENTS, i * 7),
      stage,
      grade: stage === 'completed' ? rnum(i * 11, 70, 100) : undefined,
      defenseDate: stage === 'completed' || stage === 'defense'
        ? `2026-0${rnum(i * 13, 1, 6)}-${String(rnum(i * 17, 10, 28)).padStart(2, '0')}`
        : undefined,
      type: types[i % 2]!,
    });
  }
  return theses;
}

function generatePatents(): Patent[] {
  const patents: Patent[] = [];
  const statuses: Patent['status'][] = ['filed', 'under_review', 'granted', 'rejected'];

  for (let i = 0; i < 8; i++) {
    const status = statuses[i % 4]!;
    const appYear = 2023 + rnum(i * 3, 0, 2);

    patents.push({
      id: 8000 + i,
      title: PATENT_TITLES[i % PATENT_TITLES.length]!,
      inventors: `${generateName(i + 700).short}, ${generateName(i + 800).short}`,
      applicationDate: `${appYear}-${String(rnum(i * 5, 1, 12)).padStart(2, '0')}-${String(rnum(i * 7, 1, 28)).padStart(2, '0')}`,
      grantDate: status === 'granted' ? `${appYear + 1}-${String(rnum(i * 9, 1, 12)).padStart(2, '0')}-${String(rnum(i * 11, 1, 28)).padStart(2, '0')}` : undefined,
      patentNumber: status === 'granted' ? `UZ-IAP-${String(10000 + i * 137).slice(0, 5)}` : undefined,
      status,
      category: pick(PATENT_CATEGORIES, i * 13),
    });
  }
  return patents;
}

// ===== Seed data =====

let allProjects = generateProjects();
let allArticles = generateArticles();
const allGrants = generateGrants();
let allConferences = generateConferences();
let allTheses = generateTheses();
let allPatents = generatePatents();

// ===== Pagination helper =====

function paginate<T>(items: T[], params: ListParams): PaginatedResponse<T> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total, page, pageSize, totalPages };
}

function filterBySearch<T>(items: T[], search: string | undefined, fields: (keyof T)[]): T[] {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter((item) =>
    fields.some((f) => {
      const val = item[f];
      return typeof val === 'string' && val.toLowerCase().includes(q);
    }),
  );
}

// ===== Mock service =====

export class ScienceMockService implements IScienceService {
  // ---------- Projects ----------
  async getProjects(params: ProjectListParams): Promise<PaginatedResponse<ResearchProject>> {
    await delay(300);
    let filtered = filterBySearch(allProjects, params.search, ['title', 'leaderName', 'department']);
    if (params.status) filtered = filtered.filter((p) => p.status === params.status);
    if (params.departmentId) filtered = filtered.filter((p) => p.department === DEPARTMENTS[(params.departmentId ?? 1) - 1]);
    return paginate(filtered, params);
  }

  async getProjectById(id: number): Promise<ResearchProject> {
    await delay(200);
    const project = allProjects.find((p) => p.id === id);
    if (!project) throw new Error('Loyiha topilmadi');
    return project;
  }

  async createProject(data: CreateProjectDto): Promise<ResearchProject> {
    await delay(400);
    const leader = generateName(allProjects.length + 100);
    const project: ResearchProject = {
      id: Math.max(...allProjects.map((p) => p.id), 3000) + 1,
      title: data.title,
      leaderId: data.leaderId,
      leaderName: leader.short,
      department: pick(DEPARTMENTS, data.leaderId),
      teamSize: 1,
      fundAmount: data.fundAmount,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'active',
      progress: 0,
      description: data.description,
    };
    allProjects = [project, ...allProjects];
    return project;
  }

  async updateProject(id: number, data: Partial<CreateProjectDto>): Promise<ResearchProject> {
    await delay(300);
    const idx = allProjects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Loyiha topilmadi');
    const updated = { ...allProjects[idx]!, ...data };
    allProjects[idx] = updated;
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await delay(200);
    allProjects = allProjects.filter((p) => p.id !== id);
  }

  // ---------- Articles ----------
  async getArticles(params: ArticleListParams): Promise<PaginatedResponse<Article>> {
    await delay(300);
    let filtered = filterBySearch(allArticles, params.search, ['title', 'authors', 'journal']);
    if (params.type) filtered = filtered.filter((a) => a.type === params.type);
    if (params.year) filtered = filtered.filter((a) => a.year === params.year);
    return paginate(filtered, params);
  }

  async getArticleById(id: number): Promise<Article> {
    await delay(200);
    const article = allArticles.find((a) => a.id === id);
    if (!article) throw new Error('Maqola topilmadi');
    return article;
  }

  async createArticle(data: CreateArticleDto): Promise<Article> {
    await delay(400);
    const article: Article = {
      id: Math.max(...allArticles.map((a) => a.id), 4000) + 1,
      title: data.title,
      authors: data.authors,
      journal: data.journal,
      year: data.year,
      type: data.type as Article['type'],
      doi: data.doi,
      citations: 0,
    };
    allArticles = [article, ...allArticles];
    return article;
  }

  async deleteArticle(id: number): Promise<void> {
    await delay(200);
    allArticles = allArticles.filter((a) => a.id !== id);
  }

  // ---------- Grants ----------
  async getGrants(params: ListParams): Promise<PaginatedResponse<Grant>> {
    await delay(300);
    const filtered = filterBySearch(allGrants, params.search, ['projectName', 'sponsor']);
    return paginate(filtered, params);
  }

  // ---------- Conferences ----------
  async getConferences(params: ConferenceListParams): Promise<PaginatedResponse<Conference>> {
    await delay(300);
    let filtered = filterBySearch(allConferences, params.search, ['name', 'location']);
    if (params.status) filtered = filtered.filter((c) => c.status === params.status);
    if (params.type) filtered = filtered.filter((c) => c.type === params.type);
    return paginate(filtered, params);
  }

  async getConferenceById(id: number): Promise<Conference> {
    await delay(200);
    const conf = allConferences.find((c) => c.id === id);
    if (!conf) throw new Error('Konferensiya topilmadi');
    return conf;
  }

  async createConference(data: CreateConferenceDto): Promise<Conference> {
    await delay(400);
    const conf: Conference = {
      id: Math.max(...allConferences.map((c) => c.id), 6000) + 1,
      name: data.name,
      date: data.date,
      endDate: data.endDate,
      location: data.location,
      type: data.type as Conference['type'],
      participantCount: 0,
      status: 'upcoming',
      description: data.description,
    };
    allConferences = [conf, ...allConferences];
    return conf;
  }

  async deleteConference(id: number): Promise<void> {
    await delay(200);
    allConferences = allConferences.filter((c) => c.id !== id);
  }

  // ---------- Theses ----------
  async getTheses(params: ThesisListParams): Promise<PaginatedResponse<Thesis>> {
    await delay(300);
    let filtered = filterBySearch(allTheses, params.search, ['title', 'studentName', 'supervisorName']);
    if (params.stage) filtered = filtered.filter((t) => t.stage === params.stage);
    if (params.type) filtered = filtered.filter((t) => t.type === params.type);
    if (params.supervisorId) filtered = filtered.filter((t) => t.supervisorId === params.supervisorId);
    return paginate(filtered, params);
  }

  async getThesisById(id: number): Promise<Thesis> {
    await delay(200);
    const thesis = allTheses.find((t) => t.id === id);
    if (!thesis) throw new Error('Bitiruv ishi topilmadi');
    return thesis;
  }

  async createThesis(data: CreateThesisDto): Promise<Thesis> {
    await delay(400);
    const student = generateName(allTheses.length + 400);
    const supervisor = generateName(allTheses.length + 600);
    const thesis: Thesis = {
      id: Math.max(...allTheses.map((t) => t.id), 7000) + 1,
      title: data.title,
      studentId: data.studentId,
      studentName: student.full,
      supervisorId: data.supervisorId,
      supervisorName: supervisor.short,
      department: pick(DEPARTMENTS, data.supervisorId),
      stage: 'topic_approved',
      type: data.type as Thesis['type'],
    };
    allTheses = [thesis, ...allTheses];
    return thesis;
  }

  async deleteThesis(id: number): Promise<void> {
    await delay(200);
    allTheses = allTheses.filter((t) => t.id !== id);
  }

  // ---------- Patents ----------
  async getPatents(params: PatentListParams): Promise<PaginatedResponse<Patent>> {
    await delay(300);
    let filtered = filterBySearch(allPatents, params.search, ['title', 'inventors']);
    if (params.status) filtered = filtered.filter((p) => p.status === params.status);
    return paginate(filtered, params);
  }

  async getPatentById(id: number): Promise<Patent> {
    await delay(200);
    const patent = allPatents.find((p) => p.id === id);
    if (!patent) throw new Error('Patent topilmadi');
    return patent;
  }

  async createPatent(data: CreatePatentDto): Promise<Patent> {
    await delay(400);
    const patent: Patent = {
      id: Math.max(...allPatents.map((p) => p.id), 8000) + 1,
      title: data.title,
      inventors: data.inventors,
      applicationDate: data.applicationDate,
      status: 'filed',
      category: data.category,
    };
    allPatents = [patent, ...allPatents];
    return patent;
  }

  async deletePatent(id: number): Promise<void> {
    await delay(200);
    allPatents = allPatents.filter((p) => p.id !== id);
  }
}
