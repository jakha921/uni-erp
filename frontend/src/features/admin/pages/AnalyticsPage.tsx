import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, ChartCard, LineChartSimple, BarChartSimple, DonutChart } from '@/components/data-display';
import { Users, UserCog, FileText, Percent } from 'lucide-react';

// --- Mock Data ---

const MONTHLY_DATA = [
  { name: 'Yan', value: 120 },
  { name: 'Fev', value: 135 },
  { name: 'Mar', value: 142 },
  { name: 'Apr', value: 158 },
  { name: 'May', value: 167 },
  { name: 'Iyn', value: 145 },
  { name: 'Iyl', value: 132 },
  { name: 'Avg', value: 178 },
  { name: 'Sen', value: 245 },
  { name: 'Okt', value: 287 },
  { name: 'Noy', value: 234 },
  { name: 'Dek', value: 198 },
];

const FACULTY_DATA = [
  { name: 'AT', value: 1248 },
  { name: 'Iqtisodiyot', value: 612 },
  { name: 'Tog\'-kon', value: 487 },
  { name: 'Energetika', value: 423 },
  { name: 'Pedagogika', value: 287 },
  { name: 'Boshqa', value: 190 },
];

const PAYMENT_DONUT = [
  { name: 'Davlat granti', value: 1876, color: '#2DB976' },
  { name: 'Kontrakt', value: 2980, color: '#3B82F6' },
];

const TOP_GROUPS = [
  { group: '301-A · Axborot tizimlari', gpa: 4.32, students: 28 },
  { group: '402-B · Iqtisodiyot', gpa: 4.18, students: 24 },
  { group: '203-A · Dasturiy injiniring', gpa: 4.07, students: 30 },
  { group: '305-V · Energetika', gpa: 3.95, students: 26 },
  { group: '404-A · Tog\'-kon ishi', gpa: 3.89, students: 22 },
];

// --- Component ---

export function AnalyticsPage() {
  return (
    <PageContent>
      <PageHeader
        title="Analitika"
        subtitle="Universitet bo'yicha umumiy statistik tahlil"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Analitika' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Jami talabalar"
          value="3,247"
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#ECFDF5"
          trend={{ value: 8.2, label: "" }}
        />
        <StatCard
          label="Yillik tushum"
          value="34.7 mlrd"
          sub="so'm"
          icon={<FileText className="h-[18px] w-[18px]" />}
          iconBg="#ECFDF5"
          trend={{ value: 14.5, label: "" }}
        />
        <StatCard
          label="O'qituvchilar"
          value={247}
          icon={<UserCog className="h-[18px] w-[18px]" />}
          iconBg="#ECFDF5"
          trend={{ value: 3, label: "" }}
        />
        <StatCard
          label="O'rtacha GPA"
          value="3.84"
          icon={<Percent className="h-[18px] w-[18px]" />}
          iconBg="#ECFDF5"
          trend={{ value: -0.04, label: "" }}
        />
      </div>

      {/* 2x2 Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart: Monthly Growth */}
        <ChartCard title="Oylik o'sish" subtitle="Talabalar qabuli · 2024-2025">
          <LineChartSimple data={MONTHLY_DATA} showArea color="#2DB976" height={240} />
        </ChartCard>

        {/* Bar Chart: Faculty Breakdown */}
        <ChartCard title="Fakultetlar" subtitle="Talabalar soni bo'yicha">
          <BarChartSimple data={FACULTY_DATA} horizontal color="#3B82F6" height={240} />
        </ChartCard>

        {/* Donut: Payment Status */}
        <ChartCard title="To'lov holati" subtitle="Grant vs Kontrakt taqsimoti">
          <DonutChart data={PAYMENT_DONUT} size={220} innerRadius={60} />
        </ChartCard>

        {/* Top Groups Table */}
        <ChartCard title="Top guruhlar" subtitle="Eng yuqori GPA ko'rsatkichlari">
          <div className="flex flex-col gap-2.5">
            {TOP_GROUPS.map((g, i) => (
              <div key={g.group} className="flex items-center gap-3">
                <div
                  className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    i < 3 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-900">{g.group}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{g.students} talaba</p>
                </div>
                <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${(g.gpa / 5) * 100}%` }}
                  />
                </div>
                <span className="min-w-[40px] text-right text-sm font-bold text-green-700 tabular-nums">
                  {g.gpa.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </PageContent>
  );
}
