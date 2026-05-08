import { useState, useMemo } from 'react';
import { Calculator, Download, Wallet, TrendingUp, Users, Percent } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { Button, Badge } from '@/components/ui';
import { StatCard, Card } from '@/components/data-display';
import { generateName, pick, rnum, DEPARTMENTS } from '@/api/mock/shared-data';
import { formatMoney } from '@/lib/utils';

interface PayrollEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  rate: number;
  base: number;
  bonus: number;
  tax: number;
  net: number;
}

const POSITIONS = [
  'Professor',
  'Dotsent',
  'Katta o\'qituvchi',
  'O\'qituvchi',
  'Assistent',
  'Laborant',
  'Buxgalter',
  'Dekan',
  'Kafedra mudiri',
  'Metodist',
  'Dasturchi',
  'Texnik',
  'Farrosh',
  'Kutubxonachi',
  'Sekretar',
];

const MONTHS = [
  { value: '01', label: 'Yanvar' },
  { value: '02', label: 'Fevral' },
  { value: '03', label: 'Mart' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Iyun' },
  { value: '07', label: 'Iyul' },
  { value: '08', label: 'Avgust' },
  { value: '09', label: 'Sentyabr' },
  { value: '10', label: 'Oktyabr' },
  { value: '11', label: 'Noyabr' },
  { value: '12', label: 'Dekabr' },
];

const YEARS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
];

function generateEmployees(): PayrollEmployee[] {
  return Array.from({ length: 15 }, (_, i) => {
    const person = generateName(i + 500, 0.4);
    const rate = rnum(i + 510, 3000000, 8000000);
    const base = rate;
    const bonus = rnum(i + 520, 200000, 2000000);
    const gross = base + bonus;
    const tax = Math.round(gross * 0.12);
    const net = gross - tax;
    return {
      id: i + 1,
      name: person.full,
      position: pick(POSITIONS, i + 530),
      department: pick(DEPARTMENTS, i + 540),
      rate,
      base,
      bonus,
      tax,
      net,
    };
  });
}

export function PayrollPage() {
  const [month, setMonth] = useState('04');
  const [year, setYear] = useState('2026');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const employees = useMemo(() => generateEmployees(), []);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (search) {
        const q = search.toLowerCase();
        if (!e.name.toLowerCase().includes(q) && !e.position.toLowerCase().includes(q)) return false;
      }
      if (deptFilter && e.department !== deptFilter) return false;
      return true;
    });
  }, [employees, search, deptFilter]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, e) => ({
        base: acc.base + e.base,
        bonus: acc.bonus + e.bonus,
        tax: acc.tax + e.tax,
        net: acc.net + e.net,
      }),
      { base: 0, bonus: 0, tax: 0, net: 0 },
    );
  }, [filtered]);

  const totalFond = employees.reduce((s, e) => s + e.net, 0);
  const avgSalary = employees.length > 0 ? Math.round(totalFond / employees.length) : 0;
  const taxTotal = employees.reduce((s, e) => s + e.tax, 0);
  const taxPercent = totalFond > 0 ? ((taxTotal / (totalFond + taxTotal)) * 100).toFixed(0) : '0';

  const selectedMonth = MONTHS.find((m) => m.value === month)?.label ?? month;

  const columns: Column<PayrollEmployee>[] = [
    {
      key: 'idx',
      header: '№',
      width: '50px',
      render: (_, index) => <span className="text-slate-500">{index + 1}</span>,
    },
    {
      key: 'name',
      header: 'Xodim',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.position}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: "Bo'lim",
      render: (row) => <span className="text-slate-700">{row.department}</span>,
    },
    {
      key: 'rate',
      header: 'Stavka',
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums text-slate-600">{formatMoney(row.rate)}</span>
      ),
    },
    {
      key: 'base',
      header: 'Asosiy',
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums font-medium text-slate-900">{formatMoney(row.base)}</span>
      ),
    },
    {
      key: 'bonus',
      header: "Qo'shimcha",
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums text-green-700">+{formatMoney(row.bonus)}</span>
      ),
    },
    {
      key: 'tax',
      header: 'Soliq',
      className: 'text-right',
      render: (row) => (
        <span className="tabular-nums text-red-700">-{formatMoney(row.tax)}</span>
      ),
    },
    {
      key: 'net',
      header: "Qo'lga",
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-bold text-slate-900">{formatMoney(row.net)}</span>
      ),
    },
  ];

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
            <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
              Excel
            </Button>
            <Button leftIcon={<Calculator className="h-4 w-4" />}>Hisoblash</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
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
          value={employees.length}
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
          onChange={(e) => setMonth(e.target.value)}
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
          onChange={(e) => setYear(e.target.value)}
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
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        }
        actions={<Badge variant="default">{filtered.length} ta xodim</Badge>}
      />

      <Card noPadding className="mt-4">
        <DataTable
          data={filtered}
          columns={columns}
          keyField="id"
          emptyMessage="Xodimlar topilmadi"
        />

        {filtered.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-3 py-3">
            <div className="flex items-center text-sm font-semibold text-slate-900">
              <span className="flex-1">Jami:</span>
              <span className="w-[120px] text-right tabular-nums">{formatMoney(totals.base)}</span>
              <span className="w-[120px] text-right tabular-nums text-green-700">
                +{formatMoney(totals.bonus)}
              </span>
              <span className="w-[100px] text-right tabular-nums text-red-700">
                -{formatMoney(totals.tax)}
              </span>
              <span className="w-[120px] text-right tabular-nums font-bold">
                {formatMoney(totals.net)}
              </span>
            </div>
          </div>
        )}
      </Card>
    </PageContent>
  );
}
