import {
  BarChart3,
  Users,
  Building2,
  FileText,
  Plus,
  Calendar,
  Download,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Resolver } from 'react-hook-form';
import { PageContent, PageHeader } from '@/components/layout';
import { Button, Spinner } from '@/components/ui';
import { SearchInput } from '@/components/form/SearchInput';
import { Modal } from '@/components/overlays';
import { useReportTemplates, useGenerateReport } from '@/api/hooks/useReports';
import { useState, useMemo } from 'react';

interface ReportItem {
  name: string;
  lastDate: string;
}

interface ReportGroup {
  label: string;
  color: string;
  icon: ReactNode;
  items: ReportItem[];
}

const REPORT_GROUPS: ReportGroup[] = [
  {
    label: 'Akademika',
    color: '#2DB976',
    icon: <BarChart3 className="h-4 w-4" />,
    items: [
      { name: "Talabalar reyting ro'yxati", lastDate: '22.04.2026' },
      { name: "Guruhlar bo'yicha GPA", lastDate: '22.04.2026' },
      { name: 'Davomat tahlili', lastDate: '22.04.2026' },
      { name: 'Imtihon natijalari', lastDate: '22.04.2026' },
      { name: "Fakultet bo'yicha statistika", lastDate: '22.04.2026' },
      { name: "O'qituvchi yuklamasi", lastDate: '22.04.2026' },
    ],
  },
  {
    label: 'Moliya',
    color: '#3B82F6',
    icon: <Building2 className="h-4 w-4" />,
    items: [
      { name: 'Kontrakt tushumlari', lastDate: '22.04.2026' },
      { name: "Qarzdorlar ro'yxati", lastDate: '22.04.2026' },
      { name: 'Oylik moliyaviy hisobot', lastDate: '22.04.2026' },
      { name: "Stipendiya to'lovlari", lastDate: '22.04.2026' },
      { name: "TTJ to'lovlari", lastDate: '22.04.2026' },
    ],
  },
  {
    label: 'HR',
    color: '#F59E0B',
    icon: <Users className="h-4 w-4" />,
    items: [
      { name: "O'qituvchilar ro'yxati", lastDate: '22.04.2026' },
      { name: 'Kadrlar harakati', lastDate: '22.04.2026' },
      { name: 'Soatbay hisob-kitob', lastDate: '22.04.2026' },
      { name: 'Malaka oshirish', lastDate: '22.04.2026' },
    ],
  },
  {
    label: "Ma'muriy",
    color: '#8B5CF6',
    icon: <FileText className="h-4 w-4" />,
    items: [
      { name: 'Yillik universitet hisoboti', lastDate: '22.04.2026' },
      { name: 'Filiallararo taqqoslash', lastDate: '22.04.2026' },
      { name: 'Buyruqlar reestri', lastDate: '22.04.2026' },
    ],
  },
];

const reportParamsSchema = z.object({
  startDate: z.string().min(1, 'Boshlanish sanasini tanlang'),
  endDate: z.string().min(1, 'Tugash sanasini tanlang'),
  format: z.enum(['pdf', 'excel']),
  department: z.string().optional(),
}).refine((d) => !d.startDate || !d.endDate || d.startDate <= d.endDate, {
  message: 'Tugash sanasi boshlanish sanasidan keyin bo\'lishi kerak',
  path: ['endDate'],
});

type ReportParamsFormData = z.infer<typeof reportParamsSchema>;

interface ReportParamsModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

function ReportParamsModal({ report, onClose }: ReportParamsModalProps) {
  const generateReport = useGenerateReport();
  const generating = generateReport.isPending;
  const today = new Date().toISOString().slice(0, 10);
  const firstOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportParamsFormData>({
    resolver: zodResolver(reportParamsSchema) as unknown as Resolver<ReportParamsFormData>,
    defaultValues: { startDate: firstOfYear, endDate: today, format: 'excel', department: '' },
  });

  const onGenerate = (data: ReportParamsFormData) => {
    generateReport.mutate(
      { templateId: 0, params: { start_date: data.startDate, end_date: data.endDate, format: data.format, department: data.department ?? '' } },
      {
        onSuccess: (blob: Blob) => {
          const ext = data.format === 'pdf' ? 'pdf' : 'xlsx';
          const fileName = `${report?.name ?? 'hisobot'}.${ext}`;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={!!report}
      onClose={onClose}
      title={report?.name ?? ''}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={generating}>Bekor qilish</Button>
          <Button
            leftIcon={generating ? <Spinner size="sm" /> : <Download className="h-4 w-4" />}
            onClick={() => void handleSubmit(onGenerate)()}
            disabled={generating}
          >
            {generating ? 'Yaratilmoqda...' : 'Yaratish'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Boshlanish sanasi</label>
            <input
              type="date"
              {...register('startDate')}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
            {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Tugash sanasi</label>
            <input
              type="date"
              {...register('endDate')}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
            {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Fayl formati</label>
          <div className="flex gap-3">
            {(['excel', 'pdf'] as const).map((fmt) => (
              <label key={fmt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input type="radio" value={fmt} {...register('format')} className="accent-primary-500" />
                {fmt === 'excel' ? 'Excel (.xlsx)' : 'PDF (.pdf)'}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Bo&apos;lim (ixtiyoriy)</label>
          <select
            {...register('department')}
            className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
          >
            <option value="">Barcha bo&apos;limlar</option>
            <option value="1">Axborot texnologiyalari</option>
            <option value="2">Iqtisodiyot va boshqaruv</option>
            <option value="3">Muhandislik</option>
            <option value="4">Tabiiy fanlar</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}

const CATEGORY_CONFIG: Record<string, { color: string; icon: ReactNode }> = {
  "Ta'lim": { color: '#2DB976', icon: <BarChart3 className="h-4 w-4" /> },
  'Moliya': { color: '#3B82F6', icon: <Building2 className="h-4 w-4" /> },
  'HR': { color: '#F59E0B', icon: <Users className="h-4 w-4" /> },
  "Ma'muriy": { color: '#8B5CF6', icon: <FileText className="h-4 w-4" /> },
};
const DEFAULT_CONFIG = { color: '#64748B', icon: <FileText className="h-4 w-4" /> };

export function ReportsPage() {
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const { data: templates } = useReportTemplates();

  const allGroups: ReportGroup[] = useMemo(() => {
    if (!templates || templates.length === 0) return REPORT_GROUPS;
    const groupMap = new Map<string, ReportGroup>();
    templates.forEach((t) => {
      const existing = groupMap.get(t.category);
      const cfg = CATEGORY_CONFIG[t.category] ?? DEFAULT_CONFIG;
      const item: ReportItem = { name: t.name, lastDate: '—' };
      if (existing) {
        existing.items.push(item);
      } else {
        groupMap.set(t.category, { label: t.category, color: cfg.color, icon: cfg.icon, items: [item] });
      }
    });
    return Array.from(groupMap.values());
  }, [templates]);

  const filteredGroups = useMemo(() => {
    if (!search) return allGroups;
    const q = search.toLowerCase();
    return allGroups.map((g) => ({
      ...g,
      items: g.items.filter((it) => it.name.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [search, allGroups]);

  return (
    <PageContent>
      <PageHeader
        title="Hisobotlar"
        subtitle="Barcha turdagi hisobotlarni yaratish va yuklab olish"
        breadcrumbs={[{ label: 'Boshqaruv' }, { label: 'Hisobotlar' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<Calendar className="h-4 w-4" />}>
              Rejalashtirilgan
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Maxsus hisobot
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-5">
        <SearchInput
          placeholder="Hisobot nomini kiriting..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          className="w-80"
        />
      </div>

      {/* Report groups */}
      {filteredGroups.map((g) => (
        <div key={g.label} className="mb-6">
          {/* Group header */}
          <div className="mb-3 flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ background: g.color }}
            >
              {g.icon}
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900">{g.label}</h3>
            <span className="text-[11px] text-slate-400">{g.items.length} ta hisobot</span>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-3 gap-3">
            {g.items.map((item) => (
              <div
                key={item.name}
                className="cursor-pointer rounded-2xl bg-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="flex h-[44px] w-9 shrink-0 items-center justify-center rounded-md bg-slate-100"
                    style={{ color: g.color }}
                  >
                    <FileText className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-tight text-slate-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">Oxirgi: {item.lastDate}</p>

                    {/* Actions */}
                    <div className="mt-2.5 flex gap-1.5">
                      <button className="rounded-md border border-border bg-white px-2.5 py-1 text-[11px] text-slate-500 transition-colors hover:bg-slate-50">
                        PDF
                      </button>
                      <button className="rounded-md border border-border bg-white px-2.5 py-1 text-[11px] text-slate-500 transition-colors hover:bg-slate-50">
                        Excel
                      </button>
                      <button
                        className="rounded-md border-none bg-green-50 px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-green-100"
                        style={{ color: '#1B7A4E' }}
                        onClick={(e) => { e.stopPropagation(); setSelectedReport(item); }}
                      >
                        Ochish &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredGroups.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16">
          <FileText className="h-10 w-10 text-slate-200" />
          <p className="text-sm font-medium text-slate-500">Hisobotlar topilmadi</p>
          <p className="text-xs text-slate-400">Qidiruv so{"'"}zini o{"'"}zgartirib ko{"'"}ring</p>
        </div>
      )}

      <ReportParamsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </PageContent>
  );
}
