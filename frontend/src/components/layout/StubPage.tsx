import type { ReactNode } from 'react';
import { Construction } from 'lucide-react';
import { PageContent } from './PageContent';
import { PageHeader } from './PageHeader';
import { Card } from '@/components/data-display';

interface StubPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  icon?: ReactNode;
  items?: Array<{ label: string; description: string }>;
}

export function StubPage({ title, subtitle, breadcrumbs, icon, items }: StubPageProps) {
  return (
    <PageContent>
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <Card>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            {icon ?? <Construction className="h-8 w-8 text-slate-400" />}
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            {title}
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            {subtitle ?? "Bu modul tez orada ishga tushiriladi. Hozircha demo ma'lumotlar ko'rsatilmoqda."}
          </p>
        </div>
        {items && items.length > 0 && (
          <div className="border-t border-border mt-4 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageContent>
  );
}
