import { delay } from './delay';
import { generateName, pick, rnum } from './shared-data';
import type {
  Task,
  TaskListParams,
  CreateTaskDto,
  TaskStatus,
  TaskPriority,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import type { ITaskService } from '../services/task.service';

const TASK_TITLES = [
  "O'quv rejani yangilash",
  "Imtihon natijalarini kiritish",
  "Konferensiya materiallarini tayyorlash",
  "Stipendiya ro'yxatini tekshirish",
  "Talabalar bilan suhbat o'tkazish",
  "Dars jadvalini tuzish",
  "Kutubxona fondini inventarizatsiya qilish",
  "Amaliyot hisobotlarini tekshirish",
  "Xalqaro hamkorlik shartnomasi",
  "Ilmiy maqola taqrizini yozish",
  "Laboratoriya jihozlarini yangilash",
  "Diplom ishlarini tekshirish",
  "Onlayn kurs materiallarini tayyorlash",
  "Kafedra yig'ilishi bayonnomasini rasmiylashtirish",
  "Talabalar anketa so'rovnomasini o'tkazish",
];

const TAGS_POOL = ["ta'lim", 'moliya', 'ilmiy', 'tashkiliy', "ma'muriy", 'texnik', 'kadrlar'];

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

function generateTasks(): Task[] {
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const assignee = generateName(i + 900);
    const created = new Date(now);
    created.setDate(created.getDate() - rnum(i * 3, 1, 30));
    const due = new Date(now);
    due.setDate(due.getDate() + rnum(i * 5, 1, 14));

    const tagCount = rnum(i * 7, 1, 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = pick(TAGS_POOL, i * 11 + t);
      if (!tags.includes(tag)) tags.push(tag);
    }

    tasks.push({
      id: 9000 + i,
      title: TASK_TITLES[i % TASK_TITLES.length]!,
      description: `${TASK_TITLES[i % TASK_TITLES.length]} bo'yicha vazifa.`,
      assigneeId: 1000 + (i % 20),
      assigneeName: assignee.short,
      priority: PRIORITIES[i % 4]!,
      status: STATUSES[i % 4]!,
      dueDate: due.toISOString().slice(0, 10),
      tags,
      createdAt: created.toISOString().slice(0, 10),
      updatedAt: created.toISOString().slice(0, 10),
    });
  }
  return tasks;
}

let allTasks = generateTasks();

export class TaskMockService implements ITaskService {
  async getList(params: TaskListParams): Promise<PaginatedResponse<Task>> {
    await delay(300);

    let filtered = [...allTasks];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.assigneeName.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    if (params.status) filtered = filtered.filter((t) => t.status === params.status);
    if (params.priority) filtered = filtered.filter((t) => t.priority === params.priority);
    if (params.assigneeId) filtered = filtered.filter((t) => t.assigneeId === params.assigneeId);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getById(id: number): Promise<Task> {
    await delay(200);
    const task = allTasks.find((t) => t.id === id);
    if (!task) throw new Error('Vazifa topilmadi');
    return task;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    await delay(400);
    const assignee = generateName(allTasks.length + 900);
    const now = new Date().toISOString().slice(0, 10);
    const task: Task = {
      id: Math.max(...allTasks.map((t) => t.id), 9000) + 1,
      title: data.title,
      description: data.description ?? '',
      assigneeId: data.assigneeId,
      assigneeName: assignee.short,
      priority: data.priority,
      status: 'todo',
      dueDate: data.dueDate,
      tags: data.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    allTasks = [task, ...allTasks];
    return task;
  }

  async update(id: number, data: Partial<CreateTaskDto>): Promise<Task> {
    await delay(300);
    const idx = allTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Vazifa topilmadi');
    const updated = {
      ...allTasks[idx]!,
      ...data,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    allTasks[idx] = updated;
    return updated;
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    await delay(200);
    const idx = allTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Vazifa topilmadi');
    const updated = {
      ...allTasks[idx]!,
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    allTasks[idx] = updated;
    return updated;
  }

  async delete(id: number): Promise<void> {
    await delay(200);
    allTasks = allTasks.filter((t) => t.id !== id);
  }
}
