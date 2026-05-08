import { Wallet, Users, FileText, CheckCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '@/components/data-display';

interface ActivityItem {
  id: string;
  icon: 'money' | 'users' | 'doc' | 'check';
  color: string;
  bg: string;
  title: string;
  sub: string;
  time: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
}

const iconMap: Record<ActivityItem['icon'], ReactNode> = {
  money: <Wallet className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  doc: <FileText className="h-4 w-4" />,
  check: <CheckCircle className="h-4 w-4" />,
};

export function ActivityFeed({ items, title = "So'nggi faoliyat" }: ActivityFeedProps) {
  return (
    <Card title={title}>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              {iconMap[item.icon]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{item.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
