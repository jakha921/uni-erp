import { useState, useMemo } from 'react';
import { Calculator, Download, Wallet, TrendingUp, Users, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { Button, Badge, Spinner, AlertBanner } from '@/components/ui';
import { StatCard, Card } from '@/components/data-display';
import { formatMoney } from '@/lib/utils';
import { usePayroll, usePayrollSummary, useProcessPayroll } from '@/api/hooks/usePayroll';
import type { PayrollEmployee } from '@/types/finance';

const MONTHS = [
  { value: 1, label: 'Yanvar' },
  { value: 2, label: 'Fevral' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Iyun' },
  { value: 7, label: 'Iyul' },
  { value: 8, label: 'Avgust' },
  { value: 9, label: 'Sentyabr' },
  { value: 10, label: 'Oktyabr' },
  { value: 11, label: 'Noyabr' },
  { value: 12, label: 'Dekabr' },
];

function generateYears(count = 4): { value: number; label: string }[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const y = currentYear - i;
    return { value: y, label: String(y) };
  });
}

export function PayrollPage() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const YEARS = generateYears();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const { data: payrollData, isLoading: isLoadingPayroll, error: payrollError } = usePayroll({
    month,
    year,
    search: search || undefined,
    departmentId: deptFilter ? Number(deptFilter) : undefined,
  });

  const { data: summary, isLoading: isLoadingSummary } = usePayrollSummary(month, year);
  const processPayroll = useProcessPayroll();

  const employees = payrollData?.data ?? [];
  const totalCount = payrollData?.total ?? 0;

  const totals = useMemo(() => {
    return employees.reduce(
      (acc, e) => ({
        base: acc.base + e.baseSalary,
        bonus: acc.bonus + e.bonus,
        deductions: acc.deductions + e.deductions,
        net: acc.net + e.netSalary,
      }),
      { base: 0, bonus: 0, deductions: 0, net: 0 },
    );
  }, [employees]);

  const totalFond = summary?.totalNet ?? totals.net;
  const avgSalary = summary ? (summary.totalEmployees > 0 ? Math.round(summary.totalNet / summary.totalEmployees) : 0) : (employees.length > 0 ? Math.round(totals.net / employees.length) : 0);
  const totalDeductions = summary?.totalDeductions ?? totals.deductions;
  const totalGross = totalFond + totalDeductions;
  const taxPercent = totalGross > 0 ? ((totalDeductions / totalGross) * 100).toFixed(0) : '0';
  const employeeCount = summary?.totalEmployees ?? totalCount;

  const selectedMonth = MONTHS.find((m) => m.value === month)?.label ?? String(month);

  // Collect unique departments for filter dropdown
  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return Array.from(depts).sort();
  }, [employees]);

  const columns: Column<PayrollEmployee>[] = [
    {
      key: 'idx',
      header: '№',
      width: '50px',
      render: (_, index) => <span className="text-slate-500">{index + 1}</span>,
    },
    {
      key: 'employeeName',
      header: t('hr.employee'),
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.employeeName}</p>
          <p className="text-xs text-slate-500">{row.position}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: t('hr.department'),
      render: (row) => <span className="text-slate-700">{row.department}</span>,
    },
    {
      key: 'baseSalary',
      header: t('finance.baseSalary'),
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums font-medium text-slate-900">{formatMoney(row.baseSalary)}</span>
      ),
    },
    {
      key: 'bonus',
      header: t('finance.bonus'),
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums text-green-700">+{formatMoney(row.bonus)}</span>
      ),
    },
    {
      key: 'deductions',
      header: 'Ushlanmalar',
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums text-red-700">-{formatMoney(row.deductions)}</span>
      ),
    },
    {
      key: 'netSalary',
      header: "Qo'lga",
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-bold text-slate-900">{formatMoney(row.netSalary)}</span>
      ),
    },
  ];

  const isLoading = isLoadingPayroll || isLoadingSummary;

  if (payrollError) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(payrollError as Error).message} />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title="Maosh"
        subtitle={`${selectedMonth} ${year} · Xodimlar ish haqi`}
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: 'Maosh' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = `/api/v1/hr/payroll/export/?month=${month}&year=${year}`;
                a.download = `maosh-${year}-${month}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              Excel
            </Button>
            <Button
              leftIcon={<Calculator className="h-4 w-4" />}
              loading={processPayroll.isPending}
              onClick={() => processPayroll.mutate({ month, year })}
            >
              Hisoblash
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-5">
        <StatCard
          label="Jami fond"
          value={formatMoney(totalFond)}
          icon={<Wallet className="h-5 w-5" />}
          iconBg="bg-emerald-500"
          trend={{ value: 4, label: "o'tgan oyga" }}
        />
        <StatCard
          label="O'rtacha maosh"
          value={formatMoney(avgSalary)}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBg="bg-blue-500"
          trend={{ value: 2, label: "o'tgan oyga" }}
        />
        <StatCard
          label="Xodimlar soni"
          value={employeeCount}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-violet-500"
        />
        <StatCard
          label="Soliq ulushi"
          value={`${taxPercent}%`}
          icon={<Percent className="h-5 w-5" />}
          iconBg="bg-amber-500"
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="h-9 rounded-md border border-border px-3 text-sm"
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="h-9 rounded-md border border-border px-3 text-sm"
        >
          {YEARS.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Xodim ismi yoki lavozim..."
        activeFilterCount={deptFilter ? 1 : 0}
        onClearFilters={() => {
          setDeptFilter('');
          setSearch('');
        }}
        filters={
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 rounded-md border border-border px-3 text-sm"
          >
            <option value="">Barcha bo&apos;limlar</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        }
        actions={<Badge variant="default">{totalCount} ta xodim</Badge>}
      />

      <Card noPadding className="mt-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <DataTable
              data={employees}
              columns={columns}
              keyField="id"
              emptyMessage="Xodimlar topilmadi"
            />

            {employees.length > 0 && (
              <div className="border-t border-slate-200 bg-slate-50 px-3 py-3">
                <div className="flex items-center text-sm font-semibold text-slate-900">
                  <span className="flex-1">Jami:</span>
                  <span className="w-[120px] text-right tabular-nums">{formatMoney(totals.base)}</span>
                  <span className="w-[120px] text-right tabular-nums text-green-700">
                    +{formatMoney(totals.bonus)}
                  </span>
                  <span className="w-[100px] text-right tabular-nums text-red-700">
                    -{formatMoney(totals.deductions)}
                  </span>
                  <span className="w-[120px] text-right tabular-nums font-bold">
                    {formatMoney(totals.net)}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </PageContent>
  );
}
