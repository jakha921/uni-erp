import { useState } from 'react';
import { Search, Paperclip, Send, MoreHorizontal } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface Thread {
  id: number;
  name: string;
  role: string;
  initials: string;
  online: boolean;
  group: boolean;
  unread: number;
  lastMessage: string;
  time: string;
}

interface Message {
  from: 'me' | 'them';
  text: string;
  time: string;
}

const THREADS: Thread[] = [
  { id: 0, name: 'Karimov Umid Baxtiyorovich', role: 'Professor, Algoritmlar', initials: 'KU', online: true, group: false, unread: 2, lastMessage: "Ertangi imtihon biletlari bo'yicha...", time: '14:32' },
  { id: 1, name: 'Nazarova Madina', role: "Dotsent, Ma'lumotlar bazasi", initials: 'NM', online: true, group: false, unread: 0, lastMessage: 'Rahmat, tushundim', time: '13:15' },
  { id: 2, name: '301-A guruh kuratori', role: 'Guruh chat', initials: '3A', online: false, group: true, unread: 5, lastMessage: "Abdullayev J: men kasal bo'ldim, ertaga kela...", time: '12:48' },
  { id: 3, name: 'Tursunova Farida (ota-ona)', role: 'Rahimova L. onasi', initials: 'TF', online: false, group: false, unread: 0, lastMessage: "Qizimni bugun erta qo'yib yuborsangiz...", time: 'kecha' },
  { id: 4, name: "Rektorat e'lonlari", role: 'Rasmiy kanal', initials: 'RE', online: false, group: true, unread: 1, lastMessage: '[Admin] 2026 yil qabul kvotalari...', time: 'kecha' },
  { id: 5, name: 'Saidov Rustam', role: 'Assistent, Tarmoqlar', initials: 'SR', online: false, group: false, unread: 0, lastMessage: 'Labor. jihozlari keldi', time: '2 kun' },
  { id: 6, name: "HR bo'lim", role: 'Xodimlar resurslari', initials: 'HR', online: false, group: false, unread: 0, lastMessage: "Ta'til arizangiz tasdiqlandi", time: '3 kun' },
  { id: 7, name: 'Jalilov Bekzod', role: 'Texnik qo\'llab-quvvatlash', initials: 'JB', online: true, group: false, unread: 0, lastMessage: 'Tizim yangilandi, tekshirib ko\'ring', time: '5 kun' },
];

const MESSAGES_MAP: Record<number, Message[]> = {
  0: [
    { from: 'them', text: 'Assalomu alaykum, Admin. Bir masala bor edi.', time: '14:20' },
    { from: 'me', text: 'Vaalaykum assalom, Umid Baxtiyorovich. Eshitaman.', time: '14:22' },
    { from: 'them', text: "Ertangi algoritmlar imtihoniga biletlarni yangilab qo'ysak bo'larmidi? O'tgan yilgi biletlar ba'zi talabalarga oldindan tarqalib ketgan.", time: '14:28' },
    { from: 'them', text: "Yangi 20 ta bilet tayyorladim, sizga yuboraman.", time: '14:29' },
    { from: 'me', text: "Albatta, yuboring. Men tizimga yuklayman va 22-iyun uchun tayinlayman.", time: '14:30' },
    { from: 'them', text: "Rahmat! Yana bir savol -- imtihon o'rniga yangi auditoriya beriladimi? 301-xona kichik.", time: '14:32' },
  ],
  1: [
    { from: 'them', text: "Salom! Ma'lumotlar bazasi fani bo'yicha dars rejasini tasdiqlab berdingizmi?", time: '12:45' },
    { from: 'me', text: 'Ha, kecha kechqurun tasdiqladim. Elektron pochtangizga yubordim.', time: '13:01' },
    { from: 'them', text: 'Rahmat, tushundim', time: '13:15' },
  ],
  2: [
    { from: 'them', text: "Abdullayev J: men kasal bo'ldim, ertaga kela olmayman.", time: '12:40' },
    { from: 'them', text: "Saidova N: men ham bugun kechirak kelaman.", time: '12:43' },
    { from: 'me', text: "Tushundim, barchasi sog'lik haqida arizalarini topshirsin.", time: '12:48' },
  ],
  3: [
    { from: 'them', text: "Assalomu alaykum! Qizimni bugun erta qo'yib yuborsangiz mumkinmi? Doktorga olib borish kerak.", time: '09:30' },
    { from: 'me', text: "Vaalaykum assalom! Albatta, arizani o'qituvchiga topshiring.", time: '09:45' },
  ],
  4: [
    { from: 'them', text: '[Admin] 2026 yil qabul kvotalari tasdiqlandi. Batafsil rektorat saytida.', time: 'kecha' },
  ],
  5: [
    { from: 'them', text: 'Labor. jihozlari keldi. Laboratoriyaga olib borishda yordam kerak.', time: '10:00' },
    { from: 'me', text: "Xo'jalik bo'limiga gapirdim, bugun olib boradi.", time: '10:15' },
  ],
  6: [
    { from: 'them', text: "Ta'til arizangiz tasdiqlandi. 15-iyuldan 28-iyulgacha.", time: '09:00' },
    { from: 'me', text: 'Rahmat!', time: '09:05' },
  ],
  7: [
    { from: 'them', text: "Tizim yangilandi, tekshirib ko'ring. Yangi versiya 2.4.1.", time: '15:00' },
    { from: 'me', text: "Tekshirdim, hammasi ishlayapti. Rahmat!", time: '15:20' },
  ],
};

export function MessagesPage() {
  const [selectedId, setSelectedId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultThread: Thread = THREADS[0] ?? { id: 0, name: '', role: '', initials: '', online: false, group: false, unread: 0, lastMessage: '', time: '' };
  const current = THREADS.find((t) => t.id === selectedId) ?? defaultThread;
  const messages = MESSAGES_MAP[selectedId] ?? [];

  const filteredThreads = searchQuery
    ? THREADS.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : THREADS;

  return (
    <PageContent>
      <PageHeader
        title="Xabarlar"
        subtitle="Ichki yozishmalar va guruh chatlari"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Xabarlar' }]}
      />

      <div className="flex overflow-hidden rounded-xl border border-border bg-white" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Sidebar - Inbox */}
        <div className="flex w-80 flex-col border-r border-border">
          {/* Search */}
          <div className="border-b border-slate-100 p-3.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[34px] w-full rounded-lg border border-border bg-[#F8FAFB] pl-8 pr-3 text-[12.5px] placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 border-b border-[#F8FAFB] px-3.5 py-3 text-left transition-colors',
                  selectedId === t.id
                    ? 'border-l-[3px] border-l-primary-500 bg-green-50/70'
                    : 'border-l-[3px] border-l-transparent hover:bg-slate-50',
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar name={t.name} size="sm" />
                  {t.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline">
                    <span className="flex-1 truncate text-[12.5px] font-semibold text-slate-900">
                      {t.name}
                    </span>
                    <span className="ml-1.5 shrink-0 text-[10.5px] text-slate-400">{t.time}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="flex-1 truncate text-[11.5px] text-muted">{t.lastMessage}</span>
                    {t.unread > 0 && (
                      <span className="shrink-0 rounded-full bg-primary-500 px-1.5 py-px text-[10px] font-bold tabular-nums text-white">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-[18px] py-3">
            <Avatar name={current.name} size="sm" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{current.name}</p>
              <p className={cn('text-[11.5px]', current.online ? 'text-primary-500' : 'text-slate-400')}>
                {current.online ? 'Onlayn' : current.role}
              </p>
            </div>
            <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Search className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-[#F8FAFB] p-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[70%] px-3.5 py-2.5 shadow-sm',
                    m.from === 'me'
                      ? 'rounded-[14px_14px_4px_14px] bg-primary-500 text-white'
                      : 'rounded-[14px_14px_14px_4px] bg-white text-slate-900',
                  )}
                >
                  <p className="text-[13px] leading-relaxed">{m.text}</p>
                  <p
                    className={cn(
                      'mt-1 text-right text-[10px]',
                      m.from === 'me' ? 'opacity-70' : 'text-slate-400',
                    )}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2.5 border-t border-slate-100 px-3.5 py-3">
            <button className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              placeholder="Xabar yozing..."
              className="h-10 flex-1 rounded-[10px] border border-border bg-[#F8FAFB] px-3.5 text-[13px] placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <Button size="sm" leftIcon={<Send className="h-3.5 w-3.5" />}>
              Yuborish
            </Button>
          </div>
        </div>
      </div>
    </PageContent>
  );
}
