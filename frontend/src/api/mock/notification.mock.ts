import { delay } from './delay';
import { rnum } from './shared-data';
import type {
  Notification,
  NotificationListParams,
  NotificationType,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import type { INotificationService } from '../services/notification.service';

const NOTIF_DATA: Array<{ title: string; message: string; type: NotificationType }> = [
  { title: 'Yangi topshiriq', message: "Sizga yangi vazifa tayinlandi: O'quv rejani yangilash", type: 'info' },
  { title: 'Muddati yaqinlashmoqda', message: "Imtihon natijalarini kiritish muddati 2 kunga qoldi", type: 'warning' },
  { title: "To'lov qabul qilindi", message: "Talaba Karimov J. to'lovi muvaffaqiyatli qabul qilindi", type: 'success' },
  { title: 'Tizim xatosi', message: "Ma'lumotlar bazasiga ulanishda xatolik yuz berdi", type: 'error' },
  { title: 'Tizim yangilandi', message: 'ERP tizimi 2.5 versiyasiga yangilandi', type: 'system' },
  { title: 'Konferensiya eslatmasi', message: "Xalqaro konferensiya 3 kunga qoldi", type: 'info' },
  { title: "Ta'til so'rovi tasdiqlandi", message: "Sizning ta'til so'rovingiz rektor tomonidan tasdiqlandi", type: 'success' },
  { title: 'Stipendiya hisoblandi', message: 'Aprel oyi stipendiyalari hisoblandi', type: 'info' },
  { title: 'Muhim yangilik', message: "Universitet reytingi 15 o'ringa ko'tarildi", type: 'success' },
  { title: 'Server texnik ishi', message: 'Shanba kuni 22:00-02:00 texnik ish rejalashtirilgan', type: 'warning' },
  { title: 'Yangi xodim', message: 'IT bo\'limiga yangi xodim qabul qilindi', type: 'info' },
  { title: 'Hisobot tayyor', message: 'Choraklik moliyaviy hisobot tayyor', type: 'success' },
  { title: 'Xavfsizlik ogohlantirishlari', message: "Noma'lum qurilmadan tizimga kirish urinishi", type: 'error' },
  { title: 'Kutubxona yangiliklari', message: "50 ta yangi kitob kutubxona fondiga qo'shildi", type: 'info' },
  { title: "Dars jadvali o'zgardi", message: "Dushanba kungi darslar boshlanish vaqti o'zgardi", type: 'warning' },
  { title: 'Stipendiya muddati', message: "Stipendiya hujjatlarini topshirish muddati 5 kun qoldi", type: 'warning' },
  { title: 'Yangi modul', message: "Ilmiy tadqiqot moduli ishga tushirildi", type: 'system' },
  { title: "To'lov eslatmasi", message: "Shartnoma to'lovi muddati o'tib ketgan", type: 'error' },
  { title: 'Fakultet yig\'ilishi', message: "Chorshanba kuni soat 14:00 da fakultet yig'ilishi", type: 'info' },
  { title: 'Arxivlash tugadi', message: "O'tgan yil ma'lumotlari muvaffaqiyatli arxivlandi", type: 'system' },
];

function generateNotifications(): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const d = NOTIF_DATA[i]!;
    const created = new Date(now);
    created.setHours(created.getHours() - rnum(i * 3, 1, 720));

    notifications.push({
      id: 10000 + i,
      title: d.title,
      message: d.message,
      type: d.type,
      isRead: rnum(i * 7, 0, 1) === 1,
      link: i % 3 === 0 ? `/operations/tasks` : undefined,
      createdAt: created.toISOString(),
    });
  }
  return notifications;
}

let allNotifications = generateNotifications();

export class NotificationMockService implements INotificationService {
  async getList(params: NotificationListParams): Promise<PaginatedResponse<Notification>> {
    await delay(200);

    let filtered = [...allNotifications];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q),
      );
    }
    if (params.type) filtered = filtered.filter((n) => n.type === params.type);
    if (params.isRead !== undefined) filtered = filtered.filter((n) => n.isRead === params.isRead);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async markRead(id: number): Promise<void> {
    await delay(100);
    allNotifications = allNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
  }

  async markAllRead(): Promise<void> {
    await delay(200);
    allNotifications = allNotifications.map((n) => ({ ...n, isRead: true }));
  }

  async deleteNotification(id: number): Promise<void> {
    await delay(150);
    allNotifications = allNotifications.filter((n) => n.id !== id);
  }
}
