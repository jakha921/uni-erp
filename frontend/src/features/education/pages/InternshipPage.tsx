import { useState } from 'react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { DataTable, type Column } from '@/components/table';
import { Badge } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { Users, Clock, CheckCircle } from 'lucide-react';
import { generateName, rnum } from '@/api/mock/shared-data';

// --- Types ---

interface Internship {
  id: number;
  student: string;
  organization: string;
  startDate: string;
  endDate: string;
  supervisor: string;
  status: 'Joriy' | 'Yakunlangan';
}

// --- Mock Data ---

const ORGANIZATIONS = [
  'EPAM Systems',
  'Uzcard',
  'Uztelecom',
  'Payme',
  'Click',
  'Uzum Bank',
  'Almalyk MMK',
  'Navoiy KMK',
];

const INTERNSHIPS: Internship[] = Array.from({ length: 8 }, (_, i) => {
  const student = generateName(i + 400);
  const supervisor = generateName(i + 500);
  const isActive = i < 4;
  const startMonth = rnum(i + 90, 1, 6);
  const endMonth = startMonth + rnum(i + 91, 2, 3);
  return {
    id: i + 1,
    student: student.full,
    organization: ORGANIZATIONS[i % ORGANIZATIONS.length] as string,
    startDate: `0${startMonth}.02.2026`.slice(-10),
    endDate: `0${endMonth}.05.2026`.slice(-10),
    supervisor: supervisor.short,
    status: isActive ? 'Joriy' : 'Yakunlangan',
  };
});

const PAGE_TABS = [
  { id: 'current', label: 'Joriy', count: INTERNSHIPS.filter((i) => i.status === 'Joriy').length },
  { id: 'completed', label: 'Yakunlangan', count: INTERNSHIPS.filter((i) => i.status === 'Yakunlangan').length },
];

const columns: Column<Internship>[] = [
  {
    key: 'idx',
    header: 'No',
    width: '50px',
    render: (_, index) => <span className="text-slate-500">{index + 1}</span>,
  },
  {
    key: 'student',
    header: 'Talaba',
    render: (row) => <span className="font-medium text-slate-900">{row.student}</span>,
  },
  { key: 'organization', header: 'Tashkilot' },
  {
    key: 'startDate',
    header: 'Boshlangan',
    render: (row) => <span className="tabular-nums">{row.startDate}</span>,
  },
  {
    key: 'endDate',
    header: 'Tugash',
    render: (row) => <span className="tabular-nums">{row.endDate}</span>,
  },
  { key: 'supervisor', header: 'Rahbar' },
  {
    key: 'status',
    header: 'Holat',
    render: (row) => (
      <Badge variant={row.status === 'Joriy' ? 'info' : 'success'} dot>
        {row.status}
      </Badge>
    ),
  },
];

// --- Component ---

export function InternshipPage() {
  const [activeTab, setActiveTab] = useState('current');

  const filtered = INTERNSHIPS.filter((i) =>
    activeTab === 'current' ? i.status === 'Joriy' : i.status === 'Yakunlangan',
  );

  return (
    <PageContent>
      <PageHeader
        title="Amaliyot"
        subtitle="Ishlab chiqarish amaliyoti ma'lumotlari"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Amaliyot' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <StatCard
          label="Jami amaliyotchilar"
          value={86}
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Joriy"
          value={34}
          icon={<Clock className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Yakunlangan"
          value={52}
          icon={<CheckCircle className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
        />
      </div>

      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <Card noPadding>
          <DataTable data={filtered} columns={columns} keyField="id" />
        </Card>
      </div>
    </PageContent>
  );
}
