import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { DataTable, type Column } from '@/components/table';
import { Badge } from '@/components/ui';
import { Users, Briefcase, GraduationCap } from 'lucide-react';
import { generateName, pick, FACULTIES, DIRECTIONS, rnum } from '@/api/mock/shared-data';

// --- Types ---

interface Alumnus {
  id: number;
  name: string;
  graduationYear: number;
  faculty: string;
  direction: string;
  workplace: string;
  status: 'Ishlamoqda' | 'Magistraturada' | 'Tadqiqotchi' | 'Ish qidiryapti';
}

// --- Mock Data ---

const WORKPLACES = [
  'EPAM Systems',
  'Uzcard',
  'Uztelecom',
  'Uzum Bank',
  'Click',
  'Payme',
  'INHA University',
  'Almalyk MMK',
  'Navoiy KMK',
  'O\'zbekiston Temir yo\'llari',
];

const ALUMNI: Alumnus[] = Array.from({ length: 10 }, (_, i) => {
  const name = generateName(i + 300);
  const statuses: Alumnus['status'][] = ['Ishlamoqda', 'Magistraturada', 'Tadqiqotchi', 'Ish qidiryapti'];
  return {
    id: i + 1,
    name: name.full,
    graduationYear: rnum(i + 40, 2019, 2025),
    faculty: pick(FACULTIES, i + 50),
    direction: pick(DIRECTIONS, i + 60),
    workplace: pick(WORKPLACES, i + 70),
    status: statuses[rnum(i + 80, 0, 3)] as Alumnus['status'],
  };
});

const STATUS_VARIANT: Record<Alumnus['status'], 'success' | 'info' | 'warning' | 'default'> = {
  Ishlamoqda: 'success',
  Magistraturada: 'info',
  Tadqiqotchi: 'warning',
  'Ish qidiryapti': 'default',
};

const columns: Column<Alumnus>[] = [
  {
    key: 'idx',
    header: 'No',
    width: '50px',
    render: (_, index) => <span className="text-slate-500">{index + 1}</span>,
  },
  {
    key: 'name',
    header: 'F.I.Sh',
    render: (row) => <span className="font-medium text-slate-900">{row.name}</span>,
  },
  {
    key: 'graduationYear',
    header: 'Bitirgan yili',
    render: (row) => <span className="tabular-nums">{row.graduationYear}</span>,
  },
  { key: 'faculty', header: 'Fakultet' },
  { key: 'direction', header: 'Yo\'nalish' },
  { key: 'workplace', header: 'Ish joyi' },
  {
    key: 'status',
    header: 'Holat',
    render: (row) => (
      <Badge variant={STATUS_VARIANT[row.status]} dot>
        {row.status}
      </Badge>
    ),
  },
];

// --- Component ---

export function AlumniPage() {
  return (
    <PageContent>
      <PageHeader
        title="Bitiruvchilar"
        subtitle="Universitet bitiruvchilari ma'lumotlari"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Bitiruvchilar' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <StatCard
          label="Jami bitiruvchilar"
          value="1 240"
          icon={<GraduationCap className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Ishga joylashgan"
          value={876}
          icon={<Briefcase className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          sub="70.6% band"
        />
        <StatCard
          label="Magistraturada"
          value={186}
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
      </div>

      <Card noPadding>
        <DataTable data={ALUMNI} columns={columns} keyField="id" />
      </Card>
    </PageContent>
  );
}
