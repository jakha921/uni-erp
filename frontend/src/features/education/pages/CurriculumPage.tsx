import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button } from '@/components/ui';
import { Upload, Plus } from 'lucide-react';
import { DIRECTIONS } from '@/api/mock/shared-data';

// --- Types ---

interface Subject {
  name: string;
  credits: number;
  hours: number;
  control: 'Imtihon' | 'Sinov';
  type: 'Majburiy' | 'Tanlov' | 'Amaliyot';
}

interface Semester {
  semester: number;
  course: number;
  subjects: Subject[];
}

// --- Mock Data ---

const SEMESTERS: Semester[] = [
  {
    semester: 1, course: 1, subjects: [
      { name: 'Matematik analiz 1', credits: 6, hours: 180, control: 'Imtihon', type: 'Majburiy' },
      { name: 'Lotin tili', credits: 3, hours: 90, control: 'Sinov', type: 'Majburiy' },
      { name: 'Fizika asoslari', credits: 4, hours: 120, control: 'Imtihon', type: 'Majburiy' },
      { name: "O'zbek tili", credits: 2, hours: 60, control: 'Sinov', type: 'Majburiy' },
      { name: 'Jismoniy tarbiya', credits: 1, hours: 30, control: 'Sinov', type: 'Majburiy' },
    ],
  },
  {
    semester: 2, course: 1, subjects: [
      { name: 'Matematik analiz 2', credits: 6, hours: 180, control: 'Imtihon', type: 'Majburiy' },
      { name: 'Diskret matematika', credits: 5, hours: 150, control: 'Imtihon', type: 'Majburiy' },
      { name: 'Iqtisodiyot asoslari', credits: 4, hours: 120, control: 'Imtihon', type: 'Majburiy' },
      { name: 'Dasturlash asoslari', credits: 3, hours: 90, control: 'Sinov', type: 'Tanlov' },
    ],
  },
  {
    semester: 3, course: 2, subjects: [
      { name: "Algoritmlar va ma'lumotlar tuzilmasi", credits: 6, hours: 180, control: 'Imtihon', type: 'Majburiy' },
      { name: "Ma'lumotlar bazasi 1", credits: 4, hours: 120, control: 'Imtihon', type: 'Majburiy' },
      { name: 'Veb-dasturlash asoslari', credits: 5, hours: 150, control: 'Imtihon', type: 'Majburiy' },
      { name: 'Ishlab chiqarish amaliyoti', credits: 3, hours: 90, control: 'Sinov', type: 'Amaliyot' },
    ],
  },
];

const TYPE_BADGE_MAP: Record<Subject['type'], 'success' | 'info' | 'warning'> = {
  Majburiy: 'success',
  Tanlov: 'info',
  Amaliyot: 'warning',
};

const YEARS = ['2024-2025', '2023-2024', '2022-2023'];

// --- Component ---

export function CurriculumPage() {
  const [selectedDirection, setSelectedDirection] = useState(DIRECTIONS[0]);
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);

  const totalSubjects = SEMESTERS.reduce((sum, s) => sum + s.subjects.length, 0);
  const mandatoryCount = SEMESTERS.reduce((sum, s) => sum + s.subjects.filter((sub) => sub.type === 'Majburiy').length, 0);
  const electiveCount = SEMESTERS.reduce((sum, s) => sum + s.subjects.filter((sub) => sub.type === 'Tanlov').length, 0);

  return (
    <PageContent>
      <PageHeader
        title="O'quv rejalar"
        subtitle={`${selectedDirection} yo'nalishi`}
        breadcrumbs={[{ label: "Ta'lim" }, { label: "O'quv rejalar" }]}
      />

      {/* Direction and year selectors + buttons */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            {DIRECTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />}>
            Eksport PDF
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Yangi reja
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Yo'nalishlar" value="5" sub="faol" />
        <StatCard label="Jami kreditlar" value="240" sub="6 yil davomida" />
        <StatCard label="Majburiy fanlar" value={mandatoryCount} sub={`${Math.round((mandatoryCount / totalSubjects) * 100)}% jami`} />
        <StatCard label="Tanlov fanlar" value={electiveCount} sub={`${Math.round((electiveCount / totalSubjects) * 100)}% jami`} />
      </div>

      {/* Semester sections */}
      <div className="space-y-4">
        {SEMESTERS.map((sem) => {
          const totalSemCredits = sem.subjects.reduce((a, b) => a + b.credits, 0);
          const totalSemHours = sem.subjects.reduce((a, b) => a + b.hours, 0);

          return (
            <Card key={sem.semester} noPadding>
              {/* Semester header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {sem.course}-kurs
                  </p>
                  <h3 className="mt-0.5 text-base font-bold text-slate-900">
                    {sem.semester}-semestr
                  </h3>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-[11px] text-muted">Kreditlar</p>
                    <p className="text-lg font-bold text-green-700 tabular-nums">{totalSemCredits}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted">Soatlar</p>
                    <p className="text-lg font-bold text-slate-900 tabular-nums">{totalSemHours}</p>
                  </div>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-muted text-left">
                    <th className="border-b border-[#F1F5F9] px-3 py-2">Fan nomi</th>
                    <th className="border-b border-[#F1F5F9] px-3 py-2 w-[100px]">Turi</th>
                    <th className="border-b border-[#F1F5F9] px-3 py-2 w-[80px] text-right">Kredit</th>
                    <th className="border-b border-[#F1F5F9] px-3 py-2 w-[80px] text-right">Soat</th>
                    <th className="border-b border-[#F1F5F9] px-3 py-2 w-[100px]">Nazorat</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((sub) => (
                    <tr key={sub.name} className="text-[13.5px]">
                      <td className="border-b border-[#F8FAFC] px-3 py-2.5 font-medium text-slate-900">{sub.name}</td>
                      <td className="border-b border-[#F8FAFC] px-3 py-2.5">
                        <Badge variant={TYPE_BADGE_MAP[sub.type]}>{sub.type}</Badge>
                      </td>
                      <td className="border-b border-[#F8FAFC] px-3 py-2.5 text-right tabular-nums">{sub.credits}</td>
                      <td className="border-b border-[#F8FAFC] px-3 py-2.5 text-right tabular-nums text-muted">{sub.hours}</td>
                      <td className="border-b border-[#F8FAFC] px-3 py-2.5 text-[12.5px] text-slate-600">{sub.control}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          );
        })}
      </div>
    </PageContent>
  );
}
