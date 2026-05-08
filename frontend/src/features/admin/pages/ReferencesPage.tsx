import { useState } from 'react';
import {
  GraduationCap,
  FileText,
  Globe,
  Users,
  BookOpen,
  MapPin,
  Home,
  Briefcase,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';

interface DictEntry {
  code: string;
  name: string;
  count: number;
  status: 'active' | 'inactive';
}

interface ReferenceDict {
  icon: LucideIcon;
  name: string;
  count: number;
  color: string;
  entries: DictEntry[];
}

const REFERENCE_DICTS: ReferenceDict[] = [
  {
    icon: GraduationCap,
    name: "Yo'nalishlar",
    count: 24,
    color: '#2DB976',
    entries: [
      { code: '60110100', name: 'Matematika', count: 120, status: 'active' },
      { code: '60110200', name: "Fizika va astronomiya", count: 98, status: 'active' },
      { code: '60510100', name: 'Informatika va axborot texnologiyalari', count: 215, status: 'active' },
      { code: '60510200', name: 'Dasturiy injiniring', count: 187, status: 'active' },
      { code: '60310100', name: 'Iqtisodiyot', count: 143, status: 'active' },
      { code: '60310200', name: 'Menejment', count: 89, status: 'inactive' },
    ],
  },
  {
    icon: FileText,
    name: 'Dasturlar',
    count: 18,
    color: '#3B82F6',
    entries: [
      { code: 'BACH', name: 'Bakalavr', count: 450, status: 'active' },
      { code: 'MAST', name: 'Magistratura', count: 120, status: 'active' },
      { code: 'DOCT', name: 'Doktorantura (PhD)', count: 35, status: 'active' },
      { code: 'DSC', name: 'Doktorantura (DSc)', count: 12, status: 'inactive' },
    ],
  },
  {
    icon: Globe,
    name: 'Tillar',
    count: 5,
    color: '#06B6D4',
    entries: [
      { code: 'UZ', name: "O'zbek tili", count: 580, status: 'active' },
      { code: 'RU', name: 'Rus tili', count: 120, status: 'active' },
      { code: 'EN', name: 'Ingliz tili', count: 45, status: 'active' },
      { code: 'KR', name: 'Qoraqalpoq tili', count: 8, status: 'inactive' },
      { code: 'KZ', name: 'Qozoq tili', count: 3, status: 'inactive' },
    ],
  },
  {
    icon: Users,
    name: 'Millatlar',
    count: 12,
    color: '#F59E0B',
    entries: [
      { code: 'UZB', name: "O'zbek", count: 680, status: 'active' },
      { code: 'RUS', name: 'Rus', count: 45, status: 'active' },
      { code: 'TAJ', name: 'Tojik', count: 28, status: 'active' },
      { code: 'QQP', name: 'Qoraqalpoq', count: 15, status: 'active' },
    ],
  },
  {
    icon: BookOpen,
    name: 'Fan turlari',
    count: 8,
    color: '#8B5CF6',
    entries: [
      { code: 'COMP', name: 'Majburiy', count: 320, status: 'active' },
      { code: 'ELEC', name: 'Tanlash', count: 180, status: 'active' },
      { code: 'FREE', name: 'Erkin', count: 95, status: 'active' },
    ],
  },
  {
    icon: MapPin,
    name: 'Tumanlar',
    count: 186,
    color: '#EC4899',
    entries: [
      { code: '1701', name: 'Toshkent shahar', count: 210, status: 'active' },
      { code: '1702', name: 'Toshkent viloyati', count: 145, status: 'active' },
      { code: '1703', name: 'Samarqand viloyati', count: 98, status: 'active' },
      { code: '1704', name: 'Farg\'ona viloyati', count: 87, status: 'active' },
      { code: '1705', name: 'Andijon viloyati', count: 76, status: 'active' },
    ],
  },
  {
    icon: Home,
    name: 'Oila holati',
    count: 4,
    color: '#10B981',
    entries: [
      { code: 'MARR', name: 'Turmush qurgan', count: 120, status: 'active' },
      { code: 'SING', name: 'Turmush qurmagan', count: 580, status: 'active' },
      { code: 'DIVC', name: 'Ajrashgan', count: 15, status: 'active' },
      { code: 'WDOW', name: 'Beva', count: 8, status: 'active' },
    ],
  },
  {
    icon: Briefcase,
    name: 'Mutaxassisliklar',
    count: 32,
    color: '#EF4444',
    entries: [
      { code: 'SE', name: 'Dasturiy injiner', count: 215, status: 'active' },
      { code: 'DS', name: 'Ma\'lumotlar fanlari', count: 98, status: 'active' },
      { code: 'CS', name: 'Kiberxavfsizlik', count: 76, status: 'active' },
      { code: 'AI', name: "Sun'iy intellekt", count: 54, status: 'active' },
    ],
  },
];

function DictionaryDetail({ dict, onBack }: { dict: ReferenceDict; onBack: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Orqaga
        </Button>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: dict.color + '18', color: dict.color }}
        >
          <dict.icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{dict.name}</h2>
          <p className="text-sm text-slate-500">{dict.count} ta yozuv</p>
        </div>
      </div>

      <div className="rounded-[14px] border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                KOD
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                NOMI
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                SONI
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">
                HOLAT
              </th>
            </tr>
          </thead>
          <tbody>
            {dict.entries.map((e, i) => (
              <tr key={e.code} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-3 text-[13px] font-mono text-slate-600">{e.code}</td>
                <td className="px-4 py-3 text-[13px] text-slate-900 font-medium">{e.name}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600 text-right">{e.count}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      e.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {e.status === 'active' ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ReferencesPage() {
  const [activeDict, setActiveDict] = useState<ReferenceDict | null>(null);

  return (
    <PageContent>
      <PageHeader
        title={activeDict ? activeDict.name : "Ma'lumotnomalar"}
        subtitle={
          activeDict ? `${activeDict.count} ta yozuv` : "Tizim lug'atlari va klassifikatorlari"
        }
        breadcrumbs={[
          { label: 'Admin' },
          { label: "Ma'lumotnomalar", path: activeDict ? '/references' : undefined },
          ...(activeDict ? [{ label: activeDict.name }] : []),
        ]}
      />

      {activeDict ? (
        <DictionaryDetail dict={activeDict} onBack={() => setActiveDict(null)} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {REFERENCE_DICTS.map((d) => (
            <button
              key={d.name}
              onClick={() => setActiveDict(d)}
              className="rounded-[14px] border border-border bg-white p-5 text-left transition-all hover:shadow-md cursor-pointer"
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
      )}
    </PageContent>
  );
}
