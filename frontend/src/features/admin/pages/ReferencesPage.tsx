import { useState } from 'react';
import {
  GraduationCap, FileText, Globe, Users, BookOpen, MapPin, Home, Briefcase, ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Button, Spinner } from '@/components/ui';
import { useDictionaryItems } from '@/api/hooks/useDictionary';
import type { DictionaryType, DictionaryItem } from '@/types/admin';

interface DictConfig {
  type: DictionaryType;
  icon: LucideIcon;
  name: string;
  color: string;
}

const DICT_CONFIGS: DictConfig[] = [
  { type: 'directions', icon: GraduationCap, name: "Yo'nalishlar", color: '#2DB976' },
  { type: 'programs', icon: FileText, name: 'Dasturlar', color: '#3B82F6' },
  { type: 'languages', icon: Globe, name: 'Tillar', color: '#06B6D4' },
  { type: 'nationalities', icon: Users, name: 'Millatlar', color: '#F59E0B' },
  { type: 'subject_types', icon: BookOpen, name: 'Fan turlari', color: '#8B5CF6' },
  { type: 'districts', icon: MapPin, name: 'Tumanlar', color: '#EC4899' },
  { type: 'marital_status', icon: Home, name: 'Oila holati', color: '#10B981' },
  { type: 'specialties', icon: Briefcase, name: 'Mutaxassisliklar', color: '#EF4444' },
];

function DictionaryDetail({ config, onBack }: { config: DictConfig; onBack: () => void }) {
  const { data: items, isLoading } = useDictionaryItems(config.type);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />Orqaga
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: config.color + '18', color: config.color }}>
          <config.icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{config.name}</h2>
          <p className="text-sm text-slate-500">{items?.length ?? 0} ta yozuv</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="rounded-[14px] border border-border bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">KOD</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">NOMI</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">TARTIB</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">HOLAT</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((e: DictionaryItem, i: number) => (
                <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 text-[13px] font-mono text-slate-600">{e.code}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-900 font-medium">{e.name}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600 text-right">{e.sortOrder}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${e.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {e.isActive ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function ReferencesPage() {
  const [activeConfig, setActiveConfig] = useState<DictConfig | null>(null);

  return (
    <PageContent>
      <PageHeader
        title={activeConfig ? activeConfig.name : "Ma'lumotnomalar"}
        subtitle={activeConfig ? undefined : "Tizim lug'atlari va klassifikatorlari"}
        breadcrumbs={[
          { label: 'Admin' },
          { label: "Ma'lumotnomalar", path: activeConfig ? '/references' : undefined },
          ...(activeConfig ? [{ label: activeConfig.name }] : []),
        ]}
      />

      {activeConfig ? (
        <DictionaryDetail config={activeConfig} onBack={() => setActiveConfig(null)} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DICT_CONFIGS.map((d) => (
            <button key={d.type} onClick={() => setActiveConfig(d)}
              className="rounded-[14px] border border-border bg-white p-5 text-left transition-all hover:shadow-md cursor-pointer">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-xl mb-3.5" style={{ backgroundColor: d.color + '18', color: d.color }}>
                <d.icon className="h-[22px] w-[22px]" />
              </div>
              <p className="text-[15px] font-semibold text-slate-900 mb-1">{d.name}</p>
            </button>
          ))}
        </div>
      )}
    </PageContent>
  );
}
