import { delay } from './delay';
import { generateName, rnum } from './shared-data';
import type {
  ChatThread,
  ChatMessage,
} from '@/types/operations';
import type { ListParams } from '@/types/common';
import type { IMessageService } from '../services/message.service';

const MESSAGE_CONTENTS = [
  "Salom, dars jadvali bo'yicha gaplashsak bo'ladimi?",
  "Stipendiya ro'yxati tayyor bo'ldi, tekshirib ko'ring.",
  "Konferensiya materiallari qachon tayyor bo'ladi?",
  "Imtihon natijalari kiritildi, tasdiqlashingiz kerak.",
  "O'quv rejaga o'zgartirish kiritish kerak, vaqtingiz bormi?",
  "Kutubxonadan kerakli kitoblar buyurtma qilindi.",
  "Laboratoriya jihozlari yetkazib berildi.",
  "Fakultet yig'ilishi vaqti o'zgartirildi.",
  "Yangi o'quv dasturi loyihasi tayyor.",
  "Talabalar anketa natijalari tahlil qilindi.",
  "Xalqaro hamkorlik shartnomasi imzolandi.",
  "Amaliyot o'rinlarini muvofiqlashtirish kerak.",
  "Rahmat, hamma narsa tayyor.",
  "Tushundim, ertaga gaplashamiz.",
  "Hujjatlarni yuborib bering, ko'rib chiqaman.",
];

function generateThreads(): ChatThread[] {
  const threads: ChatThread[] = [];

  for (let i = 0; i < 5; i++) {
    const p1 = generateName(i + 1100);
    const p2 = generateName(i + 1200);
    const p3 = i % 2 === 0 ? generateName(i + 1300) : null;

    const participantIds = p3 ? [1000 + i, 1100 + i, 1200 + i] : [1000 + i, 1100 + i];
    const participantNames = p3 ? [p1.short, p2.short, p3.short] : [p1.short, p2.short];

    const lastDate = new Date();
    lastDate.setHours(lastDate.getHours() - rnum(i * 3, 1, 48));

    threads.push({
      id: 11000 + i,
      participantIds,
      participantNames,
      lastMessage: MESSAGE_CONTENTS[i % MESSAGE_CONTENTS.length]!,
      lastMessageDate: lastDate.toISOString(),
      unreadCount: rnum(i * 7, 0, 5),
    });
  }
  return threads;
}

function generateMessages(threadId: number): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const threadIdx = threadId - 11000;
  const sender1 = generateName(threadIdx + 1100);
  const sender2 = generateName(threadIdx + 1200);
  const now = new Date();

  const count = rnum(threadIdx * 5, 6, 12);
  for (let i = 0; i < count; i++) {
    const isSender1 = i % 2 === 0;
    const sender = isSender1 ? sender1 : sender2;
    const created = new Date(now);
    created.setMinutes(created.getMinutes() - (count - i) * rnum(threadIdx * 7 + i, 5, 60));

    messages.push({
      id: 12000 + threadIdx * 100 + i,
      threadId,
      senderId: isSender1 ? 1100 + threadIdx : 1200 + threadIdx,
      senderName: sender.short,
      content: MESSAGE_CONTENTS[(threadIdx * 3 + i) % MESSAGE_CONTENTS.length]!,
      createdAt: created.toISOString(),
      isRead: i < count - rnum(threadIdx * 11, 0, 2),
    });
  }
  return messages;
}

const allThreads = generateThreads();

export class MessageMockService implements IMessageService {
  async getThreads(params: ListParams): Promise<ChatThread[]> {
    await delay(200);
    let filtered = [...allThreads];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.participantNames.some((n) => n.toLowerCase().includes(q)) ||
          t.lastMessage.toLowerCase().includes(q),
      );
    }
    return filtered;
  }

  async getMessages(threadId: number): Promise<ChatMessage[]> {
    await delay(200);
    return generateMessages(threadId);
  }

  async sendMessage(threadId: number, content: string): Promise<ChatMessage> {
    await delay(300);
    const sender = generateName(1100);
    return {
      id: 12000 + Date.now() % 10000,
      threadId,
      senderId: 1000,
      senderName: sender.short,
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
  }
}
