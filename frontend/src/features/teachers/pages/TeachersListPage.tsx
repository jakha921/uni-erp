import { useState, useMemo } from 'react';
import { Search, MoreHorizontal, Upload, Plus } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Avatar } from '@/components/ui';
import { DataTable, Pagination, type Column } from '@/components/table';
import {
  generateName,
  generatePhone,
  generateEmail,
  pick,
  rnum,
  seed,
  DEPARTMENTS,
} from '@/api/mock/shared-data';
import type { PersonName } from '@/types/shared';

type Degree = 'PhD' | 'DSc' | '—';
type TeacherMode = 'Shtatli' | 'Soatbay';

interface Teacher {
  id: number;
  name: PersonName;
  email: string;
  phone: string;
  department: string;
  degree: Degree;
  title: string;
  mode: TeacherMode;
  hours: number;
  experience: number;
}

const TITLES = ['Katta o\'qituvchi', 'Dotsent', 'Professor', 'Assistent', 'O\'qituvchi'];

function generateTeachers(count: number): Teacher[] {
  return Array.from({ length: count }, (_, i) => {
    const name = generateName(i + 100);
    const degreeRoll = seed(i * 19);
    const degree: Degree = degreeRoll > 0.7 ? 'PhD' : degreeRoll > 0.85 ? 'DSc' : '—';
    return {
      id: i + 1,
      name,
      email: generateEmail(name),
      phone: generatePhone(i + 100),
      department: pick(DEPARTMENTS, i + 50),
      degree,
      title: pick(TITLES, i + 30),
      mode: seed(i * 23) > 0.35 ? 'Shtatli' : 'Soatbay',
      hours: rnum(i * 17, 120, 640),
      experience: rnum(i * 13, 1, 25),
    };
  });
}

const teachers = generateTeachers(22);


export function TeachersListPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [mode, setMode] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      if (search && !t.name.full.toLowerCase().includes(search.toLowerCase())) return false;
      if (dept && t.department !== dept) return false;
      if (mode && t.mode !== mode) return false;
      return true;
    });
  }, [search, dept, mode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Column<Teacher>[] = [
    {
      key: 'name',
      header: 'F.I.Sh.',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name.full} size="sm" />
          <div>
            <div className="text-[13px] font-medium text-slate-900">{row.name.full}</div>
            <div className="text-[11px] text-muted">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Kafedra',
      render: (row) => <span className="text-[13px] text-slate-700">{row.department}</span>,
    },
    {
      key: 'title',
      header: 'Lavozim',
      render: (row) => <span className="text-[13px] text-slate-700">{row.title}</span>,
    },
    {
      key: 'degree',
      header: 'Daraja',
      render: (row) =>
        row.degree !== '—' ? (
          <Badge variant="info">{row.degree}</Badge>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: 'mode',
      header: 'Shakl',
      render: (row) => (
        <Badge variant={row.mode === 'Shtatli' ? 'success' : 'warning'} dot>
          {row.mode}
        </Badge>
      ),
    },
    {
      key: 'experience',
      header: 'Tajriba',
      render: (row) => (
        <span className="text-[13px] text-slate-700 tabular-nums">{row.experience} yil</span>
      ),
    },
    {
      key: 'hours',
      header: 'Soatlar',
      render: (row) => (
        <span className="text-[13px] text-slate-700 tabular-nums">{row.hours} s.</span>
      ),
    },
    {
      key: 'phone',
      header: 'Aloqa',
      render: (row) => (
        <span className="text-xs text-muted">{row.phone}</span>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="O'qituvchilar"
        subtitle="O'qituvchilar ro'yxati va statistikasi"
        breadcrumbs={[
          { label: 'Ta\'lim', path: '/teachers' },
          { label: 'O\'qituvchilar' },
        ]}
      />

      {/* KPI StatCards */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Jami o'qituvchilar" value="186" />
        <StatCard label="Shtatli" value="142" />
        <StatCard label="Soatbay" value="44" />
        <StatCard label="PhD / DSc" value="68" />
        <StatCard label="Professor" value="23" />
      </div>

      {/* Table with toolbar inside */}
      <Card noPadding className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#F1F5F9] px-4 py-3">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="F.I.Sh. bo'yicha qidirish..."
              className="h-9 w-full rounded-lg border border-border pl-8 pr-3 text-[13px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
          </div>
          <select
            value={dept}
            onChange={(e) => {
              setDept(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border px-3 text-[13px]"
          >
            <option value="">Barchasi</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border px-3 text-[13px]"
          >
            <option value="">Barchasi</option>
            <option value="Shtatli">Shtatli</option>
            <option value="Soatbay">Soatbay</option>
          </select>
          <div className="flex-1" />
          <Button variant="secondary" size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />}>
            Eksport
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Yangi o&apos;qituvchi
          </Button>
        </div>

        <DataTable<Teacher>
          data={paged}
          columns={columns}
          keyField="id"
          actions={() => (
            <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        />
        <div className="border-t border-[#F1F5F9] px-4 py-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            total={filtered.length}
            pageSize={pageSize}
          />
        </div>
      </Card>
    </PageContent>
  );
}
