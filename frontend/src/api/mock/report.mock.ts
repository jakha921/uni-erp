import { delay } from './delay';
import type { ReportTemplate } from '@/types/operations';
import type { IReportService } from '../services/report.service';

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 1,
    name: "Talabalar ro'yxati",
    description: "Fakultet va kurs bo'yicha talabalar ro'yxati",
    category: "Ta'lim",
    format: 'excel',
    parameters: [
      { key: 'faculty_id', label: 'Fakultet', type: 'select', options: ['Barcha', 'KF', 'IQ', 'PD', 'FL', 'MT'], required: true },
      { key: 'course', label: 'Kurs', type: 'select', options: ['Barcha', '1', '2', '3', '4'], required: false },
    ],
  },
  {
    id: 2,
    name: "Moliyaviy hisobot",
    description: "Davriy moliyaviy hisobot — daromad va xarajatlar",
    category: 'Moliya',
    format: 'pdf',
    parameters: [
      { key: 'start_date', label: 'Boshlanish sanasi', type: 'date', required: true },
      { key: 'end_date', label: 'Tugash sanasi', type: 'date', required: true },
    ],
  },
  {
    id: 3,
    name: "Xodimlar statistikasi",
    description: "Bo'limlar bo'yicha xodimlar soni va tarkibi",
    category: 'Kadrlar',
    format: 'excel',
    parameters: [
      { key: 'department_id', label: "Bo'lim", type: 'select', options: ['Barcha'], required: false },
    ],
  },
  {
    id: 4,
    name: "Imtihon natijalari",
    description: "Semestr imtihon natijalari jadvali",
    category: "Ta'lim",
    format: 'excel',
    parameters: [
      { key: 'semester', label: 'Semestr', type: 'select', options: ['1', '2'], required: true },
      { key: 'year', label: "O'quv yili", type: 'number', required: true },
    ],
  },
  {
    id: 5,
    name: "Stipendiyalar hisoboti",
    description: "Stipendiya oluvchilar va miqdorlari",
    category: 'Moliya',
    format: 'pdf',
    parameters: [
      { key: 'month', label: 'Oy', type: 'number', required: true },
      { key: 'year', label: 'Yil', type: 'number', required: true },
    ],
  },
  {
    id: 6,
    name: "Ilmiy faoliyat hisoboti",
    description: "Maqolalar, loyihalar va patentlar statistikasi",
    category: 'Ilmiy',
    format: 'pdf',
    parameters: [
      { key: 'start_date', label: 'Boshlanish', type: 'date', required: true },
      { key: 'end_date', label: 'Tugash', type: 'date', required: true },
    ],
  },
  {
    id: 7,
    name: "Davomat hisoboti",
    description: "Kunlik/haftalik davomat statistikasi",
    category: "Ta'lim",
    format: 'excel',
    parameters: [
      { key: 'group_id', label: 'Guruh', type: 'select', options: ['Barcha'], required: false },
      { key: 'start_date', label: 'Boshlanish', type: 'date', required: true },
      { key: 'end_date', label: 'Tugash', type: 'date', required: true },
    ],
  },
  {
    id: 8,
    name: "Shartnomalar holati",
    description: "Talabalar shartnomalarining to'lov holati",
    category: 'Moliya',
    format: 'excel',
    parameters: [
      { key: 'faculty_id', label: 'Fakultet', type: 'select', options: ['Barcha', 'KF', 'IQ', 'PD', 'FL', 'MT'], required: false },
      { key: 'status', label: 'Holat', type: 'select', options: ["Barcha", "Qarzdor", "To'langan"], required: false },
    ],
  },
];

export class ReportMockService implements IReportService {
  async getTemplates(): Promise<ReportTemplate[]> {
    await delay(200);
    return [...REPORT_TEMPLATES];
  }

  async generateReport(_templateId: number, _params: Record<string, string | number>): Promise<Blob> {
    await delay(1000);
    // Return a dummy blob
    return new Blob(['Mock report content'], { type: 'application/pdf' });
  }
}
