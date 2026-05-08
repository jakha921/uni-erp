import { useState, useMemo } from 'react';
import {
  Bell,
  Wallet,
  Clock,
  CheckCircle2,
  Mail,
  Settings,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Tabs } from '@/components/navigation/Tabs';
import type { ReactNode } from 'react';

type NotificationType = 'payment' | 'alert' | 'task' | 'message' | 'system';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  color: string;
  icon: ReactNode;
}

const ICON_MAP: Record<string, ReactNode> = {
  wallet: <Wallet className="h-[17px] w-[17px]" />,
  bell: <Bell className="h-[17px] w-[17px]" />,
  check: <CheckCircle2 className="h-[17px] w-[17px]" />,
  clock: <Clock className="h-[17px] w-[17px]" />,
  mail: <Mail className="h-[17px] w-[17px]" />,
  settings: <Settings className="h-[17px] w-[17px]" />,
  users: <Users className="h-[17px] w-[17px]" />,
  alert: <AlertTriangle className="h-[17px] w-[17px]" />,
};

const NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'payment', title: "Yangi to'lov qabul qilindi", desc: "Abdullayev Jasur 4,500,000 so'm to'ladi (Kontrakt K-2024-1847)", time: '12 daqiqa oldin', read: false, color: '#2DB976', icon: ICON_MAP.wallet },
  { id: 2, type: 'alert', title: 'Davomat ogohlantirish', desc: '301-A guruhida 8 ta talaba darsga kelmadi (Algoritmlar)', time: '1 soat oldin', read: false, color: '#F59E0B', icon: ICON_MAP.bell },
  { id: 3, type: 'task', title: 'Yangi topshiriq tayinlandi', desc: "Rektor sizga \"Bahorgi sessiya hisoboti\" topshirig'ini yubordi", time: '2 soat oldin', read: false, color: '#3B82F6', icon: ICON_MAP.check },
  { id: 4, type: 'alert', title: 'Kontrakt muddati tugaydi', desc: '14 ta kontraktning muddati 7 kun ichida tugaydi', time: '3 soat oldin', read: false, color: '#EF4444', icon: ICON_MAP.clock },
  { id: 5, type: 'message', title: 'Karimov U.B. sizga xabar yubordi', desc: "\"Ertangi imtihon biletlari bo'yicha kelishib olsak...\"", time: '5 soat oldin', read: true, color: '#8B5CF6', icon: ICON_MAP.mail },
  { id: 6, type: 'payment', title: "To'lov kechiktirildi", desc: "STU-2024-2145 -- muddati 5 kun oldin o'tgan", time: '8 soat oldin', read: true, color: '#EF4444', icon: ICON_MAP.wallet },
  { id: 7, type: 'task', title: 'Topshiriq bajarildi', desc: "Nazarova M. \"Algoritmlar dars rejasi\" ni yakunladi", time: 'kecha 18:42', read: true, color: '#2DB976', icon: ICON_MAP.check },
  { id: 8, type: 'system', title: 'Tizim yangilanishi', desc: "Ertaga 03:00 -- 04:00 oralig'ida texnik ishlar rejalashtirilgan", time: 'kecha 14:20', read: true, color: '#64748B', icon: ICON_MAP.settings },
  { id: 9, type: 'message', title: 'Ota-ona xabari', desc: "Rahimova L. onasi Tursunova F. suhbat so'radi", time: 'kecha 11:15', read: true, color: '#8B5CF6', icon: ICON_MAP.users },
  { id: 10, type: 'payment', title: "Stipendiya to'landi", desc: "187 ta talabaga aprel stipendiyasi o'tkazildi (124.6 mln so'm)", time: '2 kun oldin', read: true, color: '#2DB976', icon: ICON_MAP.wallet },
  { id: 11, type: 'alert', title: "Imtihon jadvali o'zgartirildi", desc: 'Algoritmlar fani imtihoni 25-iyunga ko\'chirildi', time: '3 kun oldin', read: true, color: '#F59E0B', icon: ICON_MAP.alert },
  { id: 12, type: 'system', title: "Ma'lumotlar zaxiralandi", desc: 'Tizim ma\'lumotlari muvaffaqiyatli zaxiralandi (12.4 GB)', time: '4 kun oldin', read: true, color: '#64748B', icon: ICON_MAP.settings },
];

type FilterId = 'all' | 'unread' | 'system' | 'payment' | 'alert';

export function NotificationsPage() {
  const [filter, setFilter] = useState<FilterId>('all');
  const [items, setItems] = useState(NOTIFICATIONS);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const tabs = useMemo(
    () => [
      { id: 'all' as const, label: 'Barchasi', count: items.length },
      { id: 'unread' as const, label: "O'qilmagan", count: unreadCount },
      { id: 'system' as const, label: 'Tizim', count: items.filter((n) => n.type === 'system').length },
      { id: 'payment' as const, label: "To'lov", count: items.filter((n) => n.type === 'payment').length },
      { id: 'alert' as const, label: 'Akademik', count: items.filter((n) => n.type === 'alert' || n.type === 'task').length },
    ],
    [items, unreadCount],
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'unread') return items.filter((n) => !n.read);
    if (filter === 'system') return items.filter((n) => n.type === 'system');
    if (filter === 'payment') return items.filter((n) => n.type === 'payment');
    return items.filter((n) => n.type === 'alert' || n.type === 'task');
  }, [items, filter]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <PageContent>
      <PageHeader
        title="Bildirishnomalar"
        subtitle="Tizim bildirishnomalari va ogohlantirishlar"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Bildirishnomalar' }]}
        actions={
          <button
            onClick={markAllRead}
            className="text-[13px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Hammasini o{"'"}qilgan
          </button>
        }
      />

      <div className="max-w-3xl">
        <Tabs
          tabs={tabs}
          activeTab={filter}
          onTabChange={(id) => setFilter(id as FilterId)}
          className="mb-5"
        />

        <Card noPadding>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12">
              <Bell className="h-10 w-10 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">Bildirishnomalar yo{"'"}q</p>
              <p className="text-xs text-slate-400">Bu kategoriyada hali hech narsa yo{"'"}q</p>
            </div>
          )}
          {filtered.map((n, i) => (
            <div
              key={n.id}
              className="relative flex gap-3.5 px-[18px] py-4"
              style={{
                borderTop: i > 0 ? '1px solid #F1F5F9' : 'none',
                background: n.read ? '#fff' : 'linear-gradient(90deg,#F0FDF5 0%,#fff 80%)',
              }}
            >
              {/* Unread dot */}
              {!n.read && (
                <span className="absolute left-1.5 top-6 h-1.5 w-1.5 rounded-full bg-primary-500" />
              )}

              {/* Icon */}
              <div
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px]"
                style={{
                  background: n.color + '20',
                  color: n.color,
                }}
              >
                {n.icon}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2.5">
                  <p
                    className={`text-[13.5px] ${n.read ? 'font-medium' : 'font-semibold'} text-slate-900`}
                  >
                    {n.title}
                  </p>
                  <span className="ml-auto shrink-0 whitespace-nowrap text-[11px] text-slate-400">
                    {n.time}
                  </span>
                </div>
                <p className="mt-0.5 text-[12.5px] leading-[1.45] text-slate-500">{n.desc}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </PageContent>
  );
}
