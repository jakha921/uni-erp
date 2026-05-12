import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Upload } from 'lucide-react';
import type { Employee } from '@/types/hr';
import { formatDate, formatMoney, formatPhone } from '@/lib/utils';
import { FileUpload } from '@/components/form/FileUpload';
import { PageContent } from '@/components/layout';
import { Spinner, AlertBanner } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { Card } from '@/components/data-display';
import { EmployeeProfileHeader } from '../components/EmployeeProfileHeader';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployee, useUpdateEmployee, useDepartments, useOrders } from '@/api/hooks/useHr';
import { usePayroll } from '@/api/hooks/usePayroll';
import type { EmployeeFormData } from '../schemas/employee.schema';


function printEmployeeCard(e: Employee) {
  const win = window.open('', '_blank', 'width=794,height=1123');
  if (!win) return;
  const d = win.document;
  const style = d.createElement('style');
  style.textContent = `
    body { font-family: 'Times New Roman', serif; margin: 0; padding: 40px 60px; color: #000; }
    h1 { text-align: center; font-size: 18px; text-transform: uppercase; margin-bottom: 4px; }
    h2 { text-align: center; font-size: 14px; margin-bottom: 30px; }
    .title { text-align: center; font-size: 22px; font-weight: bold; text-transform: uppercase; margin: 30px 0 8px; }
    .subtitle { text-align: center; font-size: 14px; margin-bottom: 30px; color: #555; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    td { padding: 7px 12px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
    td:first-child { color: #64748b; width: 42%; }
    td:last-child { font-weight: 600; }
    .footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 13px; }
    @media print { @page { margin: 0; } body { padding: 40px 60px; } }
  `;
  d.head.appendChild(style);
  const today = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

  const h1 = d.createElement('h1'); h1.textContent = "O'zbekiston Respublikasi"; d.body.appendChild(h1);
  const h2 = d.createElement('h2'); h2.textContent = 'Buxoro innovatsion texnologiyalar universiteti'; d.body.appendChild(h2);
  const title = d.createElement('div'); title.className = 'title'; title.textContent = "XODIM KARTOCHKASI"; d.body.appendChild(title);
  const sub = d.createElement('div'); sub.className = 'subtitle'; sub.textContent = `Sana: ${today}`; d.body.appendChild(sub);

  const rows: [string, string][] = [
    ['F.I.Sh.', e.fullName],
    ['Xodim ID', e.employeeIdNumber],
    ["Bo'lim", e.department.name],
    ['Lavozim', e.position.name],
    ['Ilmiy daraja', e.academicDegree.name],
    ['Ilmiy unvon', e.academicRank.name],
    ['Ish turi', e.employmentForm.name],
    ['Ishga qabul', formatDate(e.hireDate)],
    ['Shartnoma №', e.contractNumber],
    ['Telefon', formatPhone(e.phone)],
    ['Email', e.email],
    ['Maosh', formatMoney(e.salary)],
  ];
  const table = d.createElement('table');
  rows.forEach(([label, value]) => {
    const tr = d.createElement('tr');
    const td1 = d.createElement('td'); td1.textContent = label;
    const td2 = d.createElement('td'); td2.textContent = value || '—';
    tr.appendChild(td1); tr.appendChild(td2);
    table.appendChild(tr);
  });
  d.body.appendChild(table);

  const footer = d.createElement('div'); footer.className = 'footer';
  const sig = d.createElement('div');
  const p1 = d.createElement('p'); p1.textContent = "Kadrlar bo'limi boshlig'i: _______________________";
  const p2 = d.createElement('p'); p2.textContent = `Sana: ${today}`;
  sig.appendChild(p1); sig.appendChild(p2);
  footer.appendChild(sig);
  d.body.appendChild(footer);

  d.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 250);
}

/* TABS_CONFIG moved inside component for i18n */

export function EmployeeProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  const navigate = useNavigate();

  const TABS_CONFIG = [
    { id: 'info', label: t('hr.mainInfo') },
    { id: 'career', label: t('hr.workHistory') },
    { id: 'salary', label: t('hr.salary') },
    { id: 'docs', label: t('hr.documents') },
  ];

  const [activeTab, setActiveTab] = useState('info');
  const [editOpen, setEditOpen] = useState(false);

  const { data: employee, isLoading, error } = useEmployee(employeeId);
  const updateMutation = useUpdateEmployee();
  const { data: departments = [] } = useDepartments();

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

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
        {t('common.back')}
      </button>

      <EmployeeProfileHeader employee={employee} onEdit={() => setEditOpen(true)} onPrint={() => printEmployeeCard(employee)} />

      <div className="mt-6">
        <Tabs tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-4">
          {activeTab === 'info' && <InfoTab employee={employee} />}
          {activeTab === 'career' && <CareerTab employeeId={employeeId} />}
          {activeTab === 'salary' && <SalaryTab employeeId={employeeId} salary={employee.salary} />}
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
  const { t } = useTranslation();
  const e = employee;

  const sections = [
    {
      title: t('hr.personalInfo'),
      fields: [
        { label: t('hr.fullName'), value: e.fullName },
        { label: t('hr.gender'), value: e.gender.name },
        { label: t('hr.birthDate'), value: formatDate(e.birthDate) },
        { label: t('hr.passport'), value: e.passport },
        { label: t('hr.pinfl'), value: e.pinfl },
        { label: t('common.phone'), value: formatPhone(e.phone) },
        { label: t('common.email'), value: e.email },
      ],
    },
    {
      title: t('hr.workInfo'),
      fields: [
        { label: t('hr.department'), value: e.department.name },
        { label: t('hr.position'), value: e.position.name },
        { label: t('hr.employmentForm'), value: e.employmentForm.name },
        { label: t('hr.workRate'), value: e.employmentForm.name },
        { label: t('hr.academicDegree'), value: e.academicDegree.name },
        { label: t('hr.academicRank'), value: e.academicRank.name },
        { label: t('hr.experience'), value: e.experience.years ? `${e.experience.years} ${t('hr.years')}` : '—' },
        { label: t('hr.hireDate'), value: formatDate(e.hireDate) },
        { label: t('hr.contractNo'), value: e.contractNumber },
        { label: t('hr.salary'), value: formatMoney(e.salary) },
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

function CareerTab({ employeeId }: { employeeId: number }) {
  const { t } = useTranslation();
  const { data: ordersData } = useOrders();
  const orders = (ordersData ?? []).filter((o) => o.employeeId === employeeId);

  const events = orders.map((o) => ({
    date: o.date,
    event: o.typeLabel,
    detail: o.title,
    color: o.typeColor ?? '#2DB976',
    Icon: FileText,
  }));

  return (
    <Card title={t('hr.workHistoryTitle')}>
      <div className="relative pl-7">
        <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-slate-200" />
        {events.map((item, i) => (
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

function SalaryTab({ employeeId, salary }: { employeeId: number; salary: number }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const { data: payrollData } = usePayroll({ month: currentMonth, year: currentYear, employeeId, pageSize: 12 });

  const base = salary || 5200000;
  const payrollRows = payrollData?.data ?? [];

  const rows = payrollRows.length > 0
    ? payrollRows.map((r) => ({
        month: `${r.employeeName} — ${currentMonth}/${currentYear}`,
        base: r.baseSalary,
        bonus: r.bonus,
        tax: r.deductions,
        net: r.netSalary,
      }))
    : [
        { month: 'Yanvar 2026', base, bonus: 800000, tax: 720000, net: base + 800000 - 720000 },
        { month: 'Dekabr 2025', base, bonus: 1200000, tax: 768000, net: base + 1200000 - 768000 },
        { month: 'Noyabr 2025', base, bonus: 600000, tax: 696000, net: base + 600000 - 696000 },
        { month: 'Oktabr 2025', base, bonus: 0, tax: 624000, net: base - 624000 },
      ];

  return (
    <div className="space-y-4">
      {/* Current salary highlight */}
      <div className="rounded-[14px] p-5 text-white" style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}>
        <p className="text-xs font-medium opacity-80 mb-1">{t('hr.currentMonthlySalary')}</p>
        <p className="text-[28px] font-bold tracking-tight tabular-nums">{formatMoney(base)}</p>
      </div>

      {/* Salary history table */}
      <Card title={t('hr.salaryHistory')} noPadding>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {[t('hr.month'), t('hr.baseSalary'), t('hr.bonus'), t('hr.tax'), t('hr.netSalary')].map((h) => (
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

  const allDocs = extraDocs;

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
