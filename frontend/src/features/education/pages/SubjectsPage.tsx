import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { DataTable, FilterBar, type Column } from '@/components/table';
import { ConfirmDialog } from '@/components/overlays';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '@/api/hooks/useEducation';
import { useDepartments } from '@/api/hooks/useCore';
import { SubjectForm } from '../components/SubjectForm';
import type { Subject } from '@/types/education';
import type { SubjectFormData } from '../schemas/subject.schema';

export function SubjectsPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null);

  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects({ search: search || undefined });
  const { data: departmentsData, isLoading: deptsLoading } = useDepartments();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();

  const subjects = subjectsData?.data ?? [];
  const departments = departmentsData ?? [];
  const isLoading = subjectsLoading || deptsLoading;

  const DEPT_FILTER_OPTIONS = useMemo(() => [
    { value: '', label: 'Barcha kafedralar' },
    ...departments.map((d) => ({ value: String(d.id), label: d.name })),
  ], [departments]);

  const filtered = useMemo(() =>
    subjects.filter((s) => !deptFilter || String(s.departmentId) === deptFilter),
  [subjects, deptFilter]);

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const avgCredits = subjects.length > 0 ? (totalCredits / subjects.length).toFixed(1) : '0';

  const handleOpenCreate = () => { setEditSubject(null); setFormOpen(true); };
  const handleOpenEdit = (s: Subject) => { setEditSubject(s); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditSubject(null); };

  const handleSubmit = (data: SubjectFormData) => {
    if (editSubject) {
      updateSubject.mutate({ id: editSubject.id, dto: data }, { onSuccess: handleClose });
    } else {
      createSubject.mutate(data, { onSuccess: handleClose });
    }
  };

  const subjectColumns: Column<Subject>[] = [
    {
      key: 'code', header: 'Kod', width: '100px',
      render: (row) => <span className="font-medium text-slate-900 tabular-nums">{row.code}</span>,
    },
    {
      key: 'name', header: 'Fan nomi', sortable: true,
      render: (row) => <span className="text-slate-900">{row.name}</span>,
    },
    { key: 'credits', header: 'Kredit', width: '80px', className: 'text-center', render: (row) => <span className="font-semibold tabular-nums">{row.credits}</span> },
    { key: 'hoursLecture', header: 'Lek.', width: '70px', className: 'text-center', render: (row) => <span className="tabular-nums">{row.hoursLecture}</span> },
    { key: 'hoursPractice', header: 'Amaliy', width: '70px', className: 'text-center', render: (row) => <span className="tabular-nums">{row.hoursPractice}</span> },
    {
      key: 'departmentName', header: 'Kafedra',
      render: (row) => <span className="text-muted">{row.departmentName}</span>,
    },
    {
      key: 'id', header: '', width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => handleOpenEdit(row)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setDeleteSubject(row)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Fanlar"
        subtitle="O'quv fanlari va dasturlari katalogi"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Fanlar' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
            Yangi fan
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <StatCard label="Jami fanlar" value={subjects.length} />
            <StatCard label="Kafedralar" value={departments.length} />
            <StatCard label="Jami kreditlar" value={totalCredits} />
            <StatCard label="O'rtacha kredit" value={avgCredits} />
          </div>

          <div className="mb-4">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Fan nomi yoki kod..."
              activeFilterCount={deptFilter ? 1 : 0}
              onClearFilters={() => { setDeptFilter(''); setSearch(''); }}
              filters={
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="h-9 rounded-md border border-border px-3 text-sm"
                >
                  {DEPT_FILTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              }
              actions={
                <Badge variant="default">{filtered.length} ta fan</Badge>
              }
            />
          </div>

          <Card noPadding>
            <DataTable
              data={filtered}
              columns={subjectColumns}
              keyField="id"
              emptyMessage="Fanlar topilmadi"
            />
          </Card>
        </>
      )}

      <SubjectForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        subject={editSubject}
        departments={departments}
        loading={createSubject.isPending || updateSubject.isPending}
      />

      <ConfirmDialog
        open={!!deleteSubject}
        onClose={() => setDeleteSubject(null)}
        onConfirm={() => {
          if (!deleteSubject) return;
          deleteSubjectMutation.mutate(deleteSubject.id, { onSuccess: () => setDeleteSubject(null) });
        }}
        title="Fanni o'chirish"
        message={`"${deleteSubject?.name}" fanini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteSubjectMutation.isPending}
      />
    </PageContent>
  );
}
