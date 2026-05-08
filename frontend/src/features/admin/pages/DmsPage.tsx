import { useState } from 'react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge } from '@/components/ui';
import {
  Inbox,
  Send,
  FileEdit,
  FileCheck,
  Briefcase,
  MoreHorizontal,
} from 'lucide-react';

// --- Types ---

interface FolderTab {
  id: string;
  label: string;
  count: number;
  icon: typeof Inbox;
}

interface Document {
  id: string;
  number: string;
  sender: string;
  subject: string;
  date: string;
  priority: 'Yuqori' | 'O\'rta' | 'Oddiy';
  status: 'Yangi' | 'Ko\'rib chiqilmoqda' | 'Bajarilmoqda' | 'Imzolangan' | 'Rad etilgan';
  deadline: string;
}

// --- Mock Data ---

const FOLDERS: FolderTab[] = [
  { id: 'inbox', label: 'Kiruvchi', count: 12, icon: Inbox },
  { id: 'outbox', label: 'Chiquvchi', count: 8, icon: Send },
  { id: 'drafts', label: 'Loyihalar', count: 3, icon: FileEdit },
  { id: 'archive', label: 'Arxiv', count: 247, icon: Briefcase },
];

const DOCUMENTS: Document[] = [
  { id: '1', number: 'KH-2024-1456', sender: 'Vazirlik', subject: 'Sessiya rejasi tasdiqlash haqida', date: '23.04.2026', priority: 'Yuqori', status: 'Yangi', deadline: '25.04.2026' },
  { id: '2', number: 'KH-2024-1455', sender: 'Rektorat', subject: 'Yangi o\'qituvchi qabul qilish to\'g\'risida', date: '22.04.2026', priority: 'O\'rta', status: 'Ko\'rib chiqilmoqda', deadline: '30.04.2026' },
  { id: '3', number: 'KH-2024-1454', sender: 'Hokimiyat', subject: 'Yoshlar siyosati bo\'yicha hisobot', date: '22.04.2026', priority: 'Yuqori', status: 'Bajarilmoqda', deadline: '28.04.2026' },
  { id: '4', number: 'KH-2024-1453', sender: 'Buxgalteriya', subject: 'Aprel oyi xarajatlar smetasi', date: '21.04.2026', priority: 'O\'rta', status: 'Imzolangan', deadline: '—' },
  { id: '5', number: 'KH-2024-1452', sender: 'Akademik kengash', subject: 'Yangi o\'quv reja muhokamasi', date: '20.04.2026', priority: 'Oddiy', status: 'Imzolangan', deadline: '—' },
  { id: '6', number: 'KH-2024-1451', sender: 'Kadrlar bo\'limi', subject: 'Xodimlar uchun attestatsiya jadvali', date: '19.04.2026', priority: 'O\'rta', status: 'Bajarilmoqda', deadline: '26.04.2026' },
  { id: '7', number: 'KH-2024-1450', sender: 'IT bo\'lim', subject: 'Server xavfsizligi auditi natijalari', date: '18.04.2026', priority: 'Yuqori', status: 'Yangi', deadline: '24.04.2026' },
  { id: '8', number: 'KH-2024-1449', sender: 'Dekanat', subject: 'Stipendiya ro\'yxati tasdiqlash', date: '17.04.2026', priority: 'O\'rta', status: 'Ko\'rib chiqilmoqda', deadline: '27.04.2026' },
  { id: '9', number: 'KH-2024-1448', sender: 'Moliya bo\'limi', subject: 'Kvartal hisoboti', date: '16.04.2026', priority: 'Oddiy', status: 'Imzolangan', deadline: '—' },
  { id: '10', number: 'KH-2024-1447', sender: 'Ta\'lim bo\'limi', subject: 'Amaliyot rejasi 2026-yil uchun', date: '15.04.2026', priority: 'Oddiy', status: 'Rad etilgan', deadline: '—' },
];

const STATUS_VARIANT: Record<Document['status'], 'info' | 'warning' | 'success' | 'default' | 'error'> = {
  Yangi: 'info',
  'Ko\'rib chiqilmoqda': 'default',
  Bajarilmoqda: 'warning',
  Imzolangan: 'success',
  'Rad etilgan': 'error',
};

const PRIORITY_DOT: Record<Document['priority'], string> = {
  Yuqori: 'bg-red-500',
  'O\'rta': 'bg-amber-500',
  Oddiy: 'bg-green-500',
};

// --- Component ---

export function DmsPage() {
  const [activeFolder, setActiveFolder] = useState('inbox');

  return (
    <PageContent>
      <PageHeader
        title="Hujjat aylanishi"
        subtitle="Elektron hujjat boshqaruv tizimi"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Hujjat aylanishi' }]}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Kiruvchi" value={24} icon={<Inbox className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Chiquvchi" value={18} icon={<Send className="h-[18px] w-[18px]" />} iconBg="#8B5CF6" />
        <StatCard label="Loyihalar" value={5} icon={<FileEdit className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Imzolangan" value={42} icon={<FileCheck className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
      </div>

      {/* 2-col layout: folder sidebar + document table */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Folder Sidebar */}
        <Card className="h-fit">
          <div className="flex flex-col gap-1">
            {FOLDERS.map((folder) => {
              const isActive = activeFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-slate-600 font-medium hover:bg-slate-50'
                  }`}
                >
                  <folder.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{folder.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-px text-[11px] font-semibold ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {folder.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Document Table */}
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFB]">
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Raqami</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Kimdan</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Mavzu</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Holat</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Muddat</th>
                  <th className="w-12 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {DOCUMENTS.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#F8FAFB] hover:bg-[#F8FAFB] transition-colors cursor-pointer">
                    <td className="px-3 py-3">
                      <p className="text-[12.5px] font-semibold text-slate-900">{doc.number}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{doc.date}</p>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-slate-600">{doc.sender}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[doc.priority]}`} />
                        <span className="text-[13px] font-medium text-slate-900">{doc.subject}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={STATUS_VARIANT[doc.status]} dot>{doc.status}</Badge>
                    </td>
                    <td className="px-3 py-3 text-[12.5px] text-slate-500 tabular-nums">
                      {doc.deadline}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContent>
  );
}
