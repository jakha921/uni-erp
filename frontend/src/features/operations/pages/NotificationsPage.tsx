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
import { Spinner } from '@/components/ui';
import { Tabs } from '@/components/navigation/Tabs';
import { useNotificationsList, useMarkAllNotificationsRead } from '@/api/hooks/useNotifications';
import type { Notification, NotificationType } from '@/types/operations';
import type { ReactNode } from 'react';

// --- Icon & color mapping ---

const TYPE_ICON: Record<NotificationType, ReactNode> = {
  info: <Bell className="h-[17px] w-[17px]" />,
  warning: <AlertTriangle className="h-[17px] w-[17px]" />,
  success: <CheckCircle2 className="h-[17px] w-[17px]" />,
  error: <Clock className="h-[17px] w-[17px]" />,
  system: <Settings className="h-[17px] w-[17px]" />,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  info: '#3B82F6',
  warning: '#F59E0B',
  success: '#2DB976',
  error: '#EF4444',
  system: '#64748B',
};

type FilterId = 'all' | 'unread' | 'system' | 'success' | 'warning';

export function NotificationsPage() {
  const [filter, setFilter] = useState<FilterId>('all');

  const { data: notifData, isLoading } = useNotificationsList({ page: 1, pageSize: 50 });
  const markAllRead = useMarkAllNotificationsRead();

  const items = notifData?.data ?? [];

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  const tabs = useMemo(
    () => [
      { id: 'all' as const, label: 'Barchasi', count: items.length },
      { id: 'unread' as const, label: "O'qilmagan", count: unreadCount },
      { id: 'system' as const, label: 'Tizim', count: items.filter((n) => n.type === 'system').length },
      { id: 'success' as const, label: "To'lov", count: items.filter((n) => n.type === 'success').length },
      { id: 'warning' as const, label: 'Akademik', count: items.filter((n) => n.type === 'warning' || n.type === 'info').length },
    ],
    [items, unreadCount],
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'unread') return items.filter((n) => !n.isRead);
    if (filter === 'system') return items.filter((n) => n.type === 'system');
    if (filter === 'success') return items.filter((n) => n.type === 'success');
    return items.filter((n) => n.type === 'warning' || n.type === 'info');
  }, [items, filter]);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <PageContent>
      <PageHeader
        title="Bildirishnomalar"
        subtitle="Tizim bildirishnomalari va ogohlantirishlar"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Bildirishnomalar' }]}
        actions={
          <button
            onClick={handleMarkAllRead}
            className="text-[13px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Hammasini o{"'"}qilgan
          </button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
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
              <NotificationRow key={n.id} notification={n} isFirst={i === 0} />
            ))}
          </Card>
        </div>
      )}
    </PageContent>
  );
}

function NotificationRow({ notification: n, isFirst }: { notification: Notification; isFirst: boolean }) {
  const color = TYPE_COLOR[n.type] ?? '#64748B';
  const icon = TYPE_ICON[n.type] ?? <Bell className="h-[17px] w-[17px]" />;

  // Compute relative time from createdAt
  const timeAgo = useMemo(() => {
    const date = new Date(n.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin} daqiqa oldin`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} soat oldin`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} kun oldin`;
  }, [n.createdAt]);

  return (
    <div
      className="relative flex gap-3.5 px-[18px] py-4"
      style={{
        borderTop: !isFirst ? '1px solid #F1F5F9' : 'none',
        background: n.isRead ? '#fff' : 'linear-gradient(90deg,#F0FDF5 0%,#fff 80%)',
      }}
    >
      {/* Unread dot */}
      {!n.isRead && (
        <span className="absolute left-1.5 top-6 h-1.5 w-1.5 rounded-full bg-primary-500" />
      )}

      {/* Icon */}
      <div
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px]"
        style={{
          background: color + '20',
          color: color,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <p
            className={`text-[13.5px] ${n.isRead ? 'font-medium' : 'font-semibold'} text-slate-900`}
          >
            {n.title}
          </p>
          <span className="ml-auto shrink-0 whitespace-nowrap text-[11px] text-slate-400">
            {timeAgo}
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] leading-[1.45] text-slate-500">{n.message}</p>
      </div>
    </div>
  );
}
