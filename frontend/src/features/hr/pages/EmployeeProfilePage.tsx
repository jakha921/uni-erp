import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Plus, ArrowUp, ArrowLeft, CheckCircle, Star, Upload } from 'lucide-react';
import { FileUpload } from '@/components/form/FileUpload';
import { PageContent } from '@/components/layout';
import { Spinner } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { Card } from '@/components/data-display';
import { EmployeeProfileHeader } from '../components/EmployeeProfileHeader';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployee, useUpdateEmployee, useDepartments } from '@/api/hooks/useHr';
import { formatDate, formatMoney, formatPhone } from '@/lib/utils';
import type { EmployeeFormData } from '../schemas/employee.schema';

const CAREER_EVENTS = [
  { date: '01.09.2018', event: 'Ishga qabul qilindi', detail: "Informatika kafedrasi — O'qituvchi", color: '#2DB976', Icon: Plus },
  { date: '15.02.2020', event: "Lavozim ko'tarildi", detail: "Katta o'qituvchi → Dotsent", color: '#4F46E5', Icon: ArrowUp },
  { date: '01.09.2022', event: 'Ilmiy daraja oldi', detail: 'PhD (falsafa doktori)', color: '#7C3AED', Icon: CheckCircle },
  { date: '10.01.2024', event: 'Mukofotlandi', detail: "Eng yaxshi o'qituvchi — 2024", color: '#F59E0B', Icon: Star },
];

const DOCS_DATA = [
  { name: 'Mehnat shartnomasi', date: '01.09.2018' },
  { name: 'Diplom nusxasi', date: '01.09.2018' },
  { name: 'Pasport nusxasi', date: '01.09.2018' },
  { name: "Tibbiy ko'rik", date: '15.01.2026' },
  { name: 'PhD dissertatsiya', date: '01.09.2022' },
  { name: 'Buyruq (qabul)', date: '01.09.2018' },
];

const TABS_CONFIG = [
  { id: 'info', label: "Asosiy ma'lumotlar" },
  { id: 'career', label: 'Ish faoliyati', count: CAREER_EVENTS.length },
  { id: 'salary', label: 'Maosh' },
  { id: 'docs', label: 'Hujjatlar', count: DOCS_DATA.length },
];

export function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info');
  const [editOpen, setEditOpen] = useState(false);

  const { data: employee, isLoading } = useEmployee(employeeId);
  const updateMutation = useUpdateEmployee();
  const { data: departments = [] } = useDepartments();

  if (isLoading || !employee) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <button
        onClick={() => navigate('/hr/employees')}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-slate-700 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </button>

      <EmployeeProfileHeader employee={employee} onEdit={() => setEditOpen(true)} />

      <div className="mt-6">
        <Tabs tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-4">
          {activeTab === 'info' && <InfoTab employee={employee} />}
          {activeTab === 'career' && <CareerTab />}
          {activeTab === 'salary' && <SalaryTab salary={employee.salary} />}
          {activeTab === 'docs' && <DocsTab />}
        </div>
      </div>

      <EmployeeForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={(formData: EmployeeFormData) => {
          updateMutation.mutate(
            {
              id: employeeId,
              dto: {
                firstName: formData.firstName,
                secondName: formData.secondName,
                thirdName: formData.thirdName,
                gender: formData.gender,
                birthDate: formData.birthDate,
                departmentId: Number(formData.departmentId),
                positionCode: formData.positionCode,
                academicDegree: formData.academicDegree,
                academicRank: formData.academicRank,
                employmentForm: formData.employmentForm,
                hireDate: formData.hireDate,
                phone: formData.phone,
                email: formData.email,
                passport: formData.passport,
                pinfl: formData.pinfl,
                salary: Number(formData.salary),
              },
            },
            { onSuccess: () => setEditOpen(false) },
          );
        }}
        employee={employee}
        departments={departments}
        loading={updateMutation.isPending}
      />
    </PageContent>
  );
}

function InfoTab({ employee }: { employee: NonNullable<ReturnType<typeof useEmployee>['data']> }) {
  const e = employee;

  const sections = [
    {
      title: "Shaxsiy ma'lumotlar",
      fields: [
        { label: 'F.I.Sh.', value: e.fullName },
        { label: 'Jinsi', value: e.gender.name },
        { label: "Tug'ilgan sana", value: formatDate(e.birthDate) },
        { label: 'Pasport', value: e.passport },
        { label: 'JSHSHIR', value: e.pinfl },
        { label: 'Telefon', value: formatPhone(e.phone) },
        { label: 'Email', value: e.email },
      ],
    },
    {
      title: "Ish ma'lumotlari",
      fields: [
        { label: "Bo'lim", value: e.department.name },
        { label: 'Lavozimi', value: e.position.name },
        { label: 'Ish turi', value: e.employmentForm.name },
        { label: 'Stavka', value: e.employmentForm.name },
        { label: 'Ilmiy daraja', value: e.academicDegree.name },
        { label: 'Ilmiy unvon', value: e.academicRank.name },
        { label: 'Ish staji', value: e.experience.years ? `${e.experience.years} yil` : '—' },
        { label: 'Ishga qabul', value: formatDate(e.hireDate) },
        { label: 'Shartnoma №', value: e.contractNumber },
        { label: 'Maoshi', value: formatMoney(e.salary) },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {sections.map((section) => (
        <Card key={section.title} title={section.title}>
          <dl className="space-y-3">
            {section.fields.map((f) => (
              <div key={f.label} className="flex items-start justify-between">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="text-sm font-medium text-slate-900 text-right max-w-[60%]">
                  {f.value || '—'}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}

function CareerTab() {
  return (
    <Card title="Ish faoliyati tarixi">
      <div className="relative pl-7">
        <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-slate-200" />
        {CAREER_EVENTS.map((item, i) => (
          <div key={i} className="relative pb-7 last:pb-0">
            <div
              className="absolute -left-[20px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: item.color }}
            >
              <item.Icon className="h-[9px] w-[9px] text-white" strokeWidth={3} />
            </div>
            <p className="text-[11px] font-semibold text-slate-400 mb-0.5">{item.date}</p>
            <p className="text-sm font-semibold text-slate-900">{item.event}</p>
            <p className="text-[13px] text-slate-500 mt-0.5">{item.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SalaryTab({ salary }: { salary: number }) {
  const base = salary || 5200000;
  const rows = [
    { month: 'Yanvar 2026', base, bonus: 800000, tax: 720000, net: base + 800000 - 720000 },
    { month: 'Dekabr 2025', base, bonus: 1200000, tax: 768000, net: base + 1200000 - 768000 },
    { month: 'Noyabr 2025', base, bonus: 600000, tax: 696000, net: base + 600000 - 696000 },
    { month: 'Oktabr 2025', base, bonus: 0, tax: 624000, net: base - 624000 },
  ];

  return (
    <div className="space-y-4">
      {/* Current salary highlight */}
      <div className="rounded-[14px] p-5 text-white" style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}>
        <p className="text-xs font-medium opacity-80 mb-1">Joriy oylik maosh</p>
        <p className="text-[28px] font-bold tracking-tight tabular-nums">{formatMoney(base)}</p>
      </div>

      {/* Salary history table */}
      <Card title="Maosh tarixi" noPadding>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {['Oy', 'Asosiy', 'Bonus', 'Soliq', "Qo'lga"].map((h) => (
                <th key={h} className="px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 text-right first:text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-3.5 py-2.5 text-[13px] font-medium text-slate-900">{r.month}</td>
                <td className="px-3.5 py-2.5 text-[13px] text-right tabular-nums">{formatMoney(r.base)}</td>
                <td className="px-3.5 py-2.5 text-[13px] text-right tabular-nums text-emerald-600">+{formatMoney(r.bonus)}</td>
                <td className="px-3.5 py-2.5 text-[13px] text-right tabular-nums text-red-500">−{formatMoney(r.tax)}</td>
                <td className="px-3.5 py-2.5 text-sm text-right tabular-nums font-bold text-slate-900">{formatMoney(r.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function DocsTab() {
  const [extraDocs, setExtraDocs] = useState<{ name: string; date: string }[]>([]);
  void Upload;

  const handleUpload = (files: File[]) => {
    const today = new Date().toISOString().slice(0, 10);
    setExtraDocs((prev) => [...prev, ...files.map((f) => ({ name: f.name, date: today }))]);
  };

  const allDocs = [...DOCS_DATA, ...extraDocs];

  return (
    <div className="space-y-4">
      <FileUpload
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        maxSize={10 * 1024 * 1024}
        multiple
        onUpload={handleUpload}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {allDocs.map((d, i) => (
          <div
            key={i}
            className="p-4 border border-slate-100 rounded-xl cursor-pointer text-center hover:border-cyan-200 hover:bg-cyan-50/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-[10px] bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-2.5">
              <FileText className="h-[18px] w-[18px]" />
            </div>
            <p className="text-[13px] font-medium text-slate-900">{d.name}</p>
            <p className="text-[11px] text-slate-400 mt-1">{d.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
