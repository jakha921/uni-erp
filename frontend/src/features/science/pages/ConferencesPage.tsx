import { useState, useMemo } from 'react';
import { Presentation, Calendar, Users, Globe, MapPin } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Spinner } from '@/components/ui';
import { useConferences } from '@/api/hooks/useScience';
import type { Conference } from '@/types/science';

type Tab = 'upcoming' | 'past';

const TYPE_LABELS: Record<Conference['type'], string> = {
  international: 'Xalqaro',
  national: 'Respublika',
  university: 'Universitet',
};

const TYPE_COLOR: Record<string, string> = {
  international: 'bg-purple-50 text-purple-700',
  national: 'bg-blue-50 text-blue-700',
  university: 'bg-emerald-50 text-emerald-700',
};

export function ConferencesPage() {
  const [tab, setTab] = useState<Tab>('upcoming');

  const { data: conferencesData, isLoading } = useConferences({ page: 1, pageSize: 50 });

  const allConferences = conferencesData?.data ?? [];

  const upcomingList = useMemo(
    () => allConferences.filter((c) => c.status === 'upcoming'),
    [allConferences],
  );
  const pastList = useMemo(
    () => allConferences.filter((c) => c.status === 'completed' || c.status === 'active'),
    [allConferences],
  );

  const list = tab === 'upcoming' ? upcomingList : pastList;
  const totalParticipants = allConferences.reduce((s, c) => s + c.participantCount, 0);
  const international = allConferences.filter((c) => c.type === 'international').length;

  return (
    <PageContent>
      <PageHeader
        title="Konferensiyalar"
        subtitle="Ilmiy konferensiyalar va tadbirlarni boshqarish"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Konferensiyalar' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami" value={(conferencesData?.total ?? allConferences.length).toString()} icon={<Presentation className="h-5 w-5" />} />
        <StatCard label="Rejalashtirilgan" value={upcomingList.length.toString()} icon={<Calendar className="h-5 w-5" />} trend={{ value: 2 }} />
        <StatCard label="Jami ishtirokchilar" value={totalParticipants.toLocaleString()} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Xalqaro" value={international.toString()} icon={<Globe className="h-5 w-5" />} trend={{ value: 1 }} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card title="" className="overflow-hidden">
          <div className="border-b border-border px-4 flex items-center gap-1">
            {([['upcoming', 'Rejalashtirilgan'], ['past', "O'tkazilgan"]] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
                <span className="ml-2 text-xs text-slate-400">
                  ({(t === 'upcoming' ? upcomingList : pastList).length})
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {list.map((conf) => (
              <div key={conf.id} className="rounded-xl border border-border bg-white p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[14px] font-semibold text-slate-900 leading-snug">{conf.name}</h3>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_COLOR[conf.type] ?? ''}`}>
                    {TYPE_LABELS[conf.type] ?? conf.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{conf.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {conf.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {conf.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {conf.participantCount} ishtirokchi
                  </span>
                </div>
              </div>
            ))}
          </div>

          {list.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">Ma'lumot topilmadi</div>
          )}
        </Card>
      )}
    </PageContent>
  );
}
