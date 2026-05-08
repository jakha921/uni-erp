import { useState } from 'react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { DataTable, type Column } from '@/components/table';
import { Badge, Spinner } from '@/components/ui';
import { Users, Briefcase, GraduationCap } from 'lucide-react';
import { useAlumniList } from '@/api/hooks/useAlumni';
import type { Alumni } from '@/types/education';

const STATUS_LABELS: Record<string, string> = {
  employed: 'Ishlamoqda',
  unemployed: 'Ish qidiryapti',
  studying: 'Magistraturada',
  unknown: "Noma'lum",
};

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  employed: 'success',
  studying: 'info',
  unemployed: 'default',
  unknown: 'warning',
};

const columns: Column<Alumni>[] = [
  { key: 'idx', header: 'No', width: '50px', render: (_, index) => <span className="text-slate-500">{index + 1}</span> },
  { key: 'fullName', header: 'F.I.Sh', render: (row) => <span className="font-medium text-slate-900">{row.fullName}</span> },
  { key: 'graduationYear', header: 'Bitirgan yili', render: (row) => <span className="tabular-nums">{row.graduationYear}</span> },
  { key: 'faculty', header: 'Fakultet' },
  { key: 'specialty', header: 'Yo\'nalish' },
  { key: 'workplace', header: 'Ish joyi' },
  {
    key: 'status', header: 'Holat',
    render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'} dot>{STATUS_LABELS[row.status] ?? row.status}</Badge>,
  },
];

export function AlumniPage() {
  const [params] = useState({ page: 1, pageSize: 50 });
  const { data, isLoading } = useAlumniList(params);

  const alumni = data?.data ?? [];
  const total = data?.total ?? 0;
  const employed = alumni.filter((a) => a.status === 'employed').length;
  const studying = alumni.filter((a) => a.status === 'studying').length;

  return (
    <PageContent>
      <PageHeader
        title="Bitiruvchilar"
        subtitle="Universitet bitiruvchilari ma'lumotlari"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Bitiruvchilar' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <StatCard label="Jami bitiruvchilar" value={total} icon={<GraduationCap className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Ishga joylashgan" value={employed} icon={<Briefcase className="h-[18px] w-[18px]" />} iconBg="#2DB976" sub={total > 0 ? `${((employed / total) * 100).toFixed(1)}% band` : ''} />
        <StatCard label="Magistraturada" value={studying} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#8B5CF6" />
      </div>

      <Card noPadding>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <DataTable data={alumni} columns={columns} keyField="id" emptyMessage="Bitiruvchilar topilmadi" />
        )}
      </Card>
    </PageContent>
  );
}
