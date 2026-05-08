import { useState } from 'react';
import { Presentation, Calendar, Users, Globe, MapPin } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';

type Tab = 'upcoming' | 'past';

interface Conference {
  id: number;
  title: string;
  date: string;
  location: string;
  type: 'Xalqaro' | 'Respublika' | 'Universitet';
  participants: number;
  organizer: string;
  status: 'upcoming' | 'past';
}

const CONFERENCES: Conference[] = [
  { id: 1, title: 'Innovatsion texnologiyalar va sun\'iy intellekt', date: '2025-06-15', location: 'Toshkent, BITU', type: 'Xalqaro', participants: 320, organizer: 'IT fakulteti', status: 'upcoming' },
  { id: 2, title: 'Raqamli iqtisodiyot va moliyaviy texnologiyalar', date: '2025-07-08', location: 'Samarqand', type: 'Respublika', participants: 180, organizer: 'Iqtisodiyot kafedrasi', status: 'upcoming' },
  { id: 3, title: 'Kiberxavfsizlik: zamonaviy muammolar', date: '2025-09-20', location: 'BITU, Konferensiya zali', type: 'Xalqaro', participants: 250, organizer: 'Xavfsizlik markazi', status: 'upcoming' },
  { id: 4, title: 'Yoshlar ilmiy konferensiyasi — 2025', date: '2025-04-25', location: 'BITU', type: 'Universitet', participants: 140, organizer: 'Ilmiy kengash', status: 'upcoming' },
  { id: 5, title: 'Axborot tizimlari va dasturlash', date: '2024-11-12', location: 'Toshkent, Hilton', type: 'Xalqaro', participants: 410, organizer: 'IT fakulteti', status: 'past' },
  { id: 6, title: 'Bakalavr ilmiy ishlari taqdimoti', date: '2024-06-10', location: 'BITU, Aktoviy zal', type: 'Universitet', participants: 220, organizer: 'Dekanat', status: 'past' },
  { id: 7, title: 'Ekologik texnologiyalar: muammo va yechimlar', date: '2024-03-18', location: 'Nukus', type: 'Respublika', participants: 155, organizer: 'Ekologiya kafedrasi', status: 'past' },
  { id: 8, title: 'Matematik modellashtirish va simulatsiya', date: '2023-10-05', location: 'BITU', type: 'Xalqaro', participants: 280, organizer: 'Matematika kafedrasi', status: 'past' },
];

const TYPE_COLOR: Record<string, string> = {
  'Xalqaro': 'bg-purple-50 text-purple-700',
  'Respublika': 'bg-blue-50 text-blue-700',
  'Universitet': 'bg-emerald-50 text-emerald-700',
};

export function ConferencesPage() {
  const [tab, setTab] = useState<Tab>('upcoming');

  const list = CONFERENCES.filter((c) => c.status === tab);
  const upcoming = CONFERENCES.filter((c) => c.status === 'upcoming');
  const totalParticipants = CONFERENCES.reduce((s, c) => s + c.participants, 0);
  const international = CONFERENCES.filter((c) => c.type === 'Xalqaro').length;

  return (
    <PageContent>
      <PageHeader
        title="Konferensiyalar"
        subtitle="Ilmiy konferensiyalar va tadbirlarni boshqarish"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Konferensiyalar' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Jami" value={CONFERENCES.length.toString()} icon={<Presentation className="h-5 w-5" />} />
        <StatCard label="Rejalashtirilgan" value={upcoming.length.toString()} icon={<Calendar className="h-5 w-5" />} trend={{ value: 2 }} />
        <StatCard label="Jami ishtirokchilar" value={totalParticipants.toLocaleString()} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Xalqaro" value={international.toString()} icon={<Globe className="h-5 w-5" />} trend={{ value: 1 }} />
      </div>

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
                ({CONFERENCES.filter((c) => c.status === t).length})
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {list.map((conf) => (
            <div key={conf.id} className="rounded-xl border border-border bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-[14px] font-semibold text-slate-900 leading-snug">{conf.title}</h3>
                <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_COLOR[conf.type] ?? ''}`}>
                  {conf.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{conf.organizer}</p>
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
                  {conf.participants} ishtirokchi
                </span>
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">Ma'lumot topilmadi</div>
        )}
      </Card>
    </PageContent>
  );
}
