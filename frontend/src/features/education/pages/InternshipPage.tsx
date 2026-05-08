import { useState } from 'react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { DataTable, type Column } from '@/components/table';
import { Badge, Spinner } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { Users, Clock, CheckCircle } from 'lucide-react';
import { useInternships } from '@/api/hooks/useInternships';
import type { Internship } from '@/types/education';

const STATUS_LABELS: Record<string, string> = { planned: 'Rejalashtirilgan', active: 'Joriy', completed: 'Yakunlangan' };
const STATUS_VARIANT: Record<string, 'info' | 'success' | 'default'> = { planned: 'default', active: 'info', completed: 'success' };

const columns: Column<Internship>[] = [
  { key: 'idx', header: 'No', width: '50px', render: (_, index) => <span className="text-slate-500">{index + 1}</span> },
  { key: 'studentName', header: 'Talaba', render: (row) => <span className="font-medium text-slate-900">{row.studentName}</span> },
  { key: 'companyName', header: 'Tashkilot' },
  { key: 'startDate', header: 'Boshlangan', render: (row) => <span className="tabular-nums">{row.startDate}</span> },
  { key: 'endDate', header: 'Tugash', render: (row) => <span className="tabular-nums">{row.endDate}</span> },
  { key: 'supervisorName', header: 'Rahbar' },
  {
    key: 'status', header: 'Holat',
    render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'} dot>{STATUS_LABELS[row.status] ?? row.status}</Badge>,
  },
];

export function InternshipPage() {
  const [activeTab, setActiveTab] = useState('active');
  const statusFilter = activeTab === 'all' ? undefined : activeTab;
  const { data, isLoading } = useInternships({ page: 1, pageSize: 50, status: statusFilter });

  const internships = data?.data ?? [];
  const total = data?.total ?? 0;
  const activeCount = internships.filter((i) => i.status === 'active').length;
  const completedCount = internships.filter((i) => i.status === 'completed').length;

  const tabs = [
    { id: 'active', label: 'Joriy', count: activeCount },
    { id: 'completed', label: 'Yakunlangan', count: completedCount },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Amaliyot"
        subtitle="Ishlab chiqarish amaliyoti ma'lumotlari"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Amaliyot' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <StatCard label="Jami amaliyotchilar" value={total} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Joriy" value={activeCount} icon={<Clock className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Yakunlangan" value={completedCount} icon={<CheckCircle className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <Card noPadding>
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : (
            <DataTable data={internships} columns={columns} keyField="id" emptyMessage="Amaliyotlar topilmadi" />
          )}
        </Card>
      </div>
    </PageContent>
  );
}
