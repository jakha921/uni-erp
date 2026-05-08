import { PageContent, PageHeader } from '@/components/layout';
import {
  GraduationCap,
  FileText,
  Globe,
  Users,
  BookOpen,
  MapPin,
  Home,
  Briefcase,
} from 'lucide-react';

// --- Data ---

const REFERENCE_DICTS = [
  { icon: GraduationCap, name: "Yo'nalishlar", count: 24, color: '#2DB976' },
  { icon: FileText, name: 'Dasturlar', count: 18, color: '#3B82F6' },
  { icon: Globe, name: 'Tillar', count: 5, color: '#06B6D4' },
  { icon: Users, name: 'Millatlar', count: 12, color: '#F59E0B' },
  { icon: BookOpen, name: 'Fan turlari', count: 8, color: '#8B5CF6' },
  { icon: MapPin, name: 'Tumanlar', count: 186, color: '#EC4899' },
  { icon: Home, name: 'Oila holati', count: 4, color: '#10B981' },
  { icon: Briefcase, name: 'Mutaxassisliklar', count: 32, color: '#EF4444' },
] as const;

// --- Component ---

export function ReferencesPage() {
  return (
    <PageContent>
      <PageHeader
        title="Ma'lumotnomalar"
        subtitle="Tizim lug'atlari va klassifikatorlari"
        breadcrumbs={[{ label: 'Admin' }, { label: "Ma'lumotnomalar" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REFERENCE_DICTS.map((d) => (
          <button
            key={d.name}
            className="rounded-[14px] border border-border bg-white p-5 text-left transition-all hover:shadow-md hover:border-opacity-60 cursor-pointer"
            style={{ '--hover-border': d.color + '60' } as React.CSSProperties}
          >
            <div
              className="flex h-[46px] w-[46px] items-center justify-center rounded-xl mb-3.5"
              style={{ backgroundColor: d.color + '18', color: d.color }}
            >
              <d.icon className="h-[22px] w-[22px]" />
            </div>
            <p className="text-[15px] font-semibold text-slate-900 mb-1">{d.name}</p>
            <p className="text-xs text-slate-500">{d.count} ta yozuv</p>
          </button>
        ))}
      </div>
    </PageContent>
  );
}
