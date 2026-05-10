import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { DataTable, type Column } from '@/components/table';
import { Tabs } from '@/components/navigation';
import { Button, Spinner, Badge } from '@/components/ui';
import { DropdownMenu, ConfirmDialog } from '@/components/overlays';
import {
  useScholarships,
  useCreateScholarship,
  useUpdateScholarship,
  useDeleteScholarship,
} from '@/api/hooks/useFinance';
import { formatMoney, formatDate } from '@/lib/utils';
import { ScholarshipForm } from '../components/ScholarshipForm';
import type { Scholarship, ScholarshipType } from '@/types/finance';
import type { ScholarshipFormData } from '../schemas/scholarship.schema';

const TYPE_LABELS: Record<ScholarshipType, { variant: 'info' | 'success' | 'warning' | 'default'; label: string }> = {
  davlat: { variant: 'info', label: 'Davlat' },
  prezident: { variant: 'warning', label: 'Prezident' },
  fanlar: { variant: 'success', label: 'Fanlar' },
  ijtimoiy: { variant: 'default', label: 'Ijtimoiy' },
  maxsus: { variant: 'info', label: 'Maxsus' },
};

const STATUS_LABELS: Record<string, { variant: 'success' | 'warning' | 'default'; label: string }> = {
  active: { variant: 'success', label: 'Faol' },
  paused: { variant: 'warning', label: "To'xtatilgan" },
  completed: { variant: 'default', label: 'Yakunlangan' },
};

const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'Barcha turlari' },
  { value: 'davlat', label: 'Davlat' },
  { value: 'prezident', label: 'Prezident' },
  { value: 'fanlar', label: 'Fanlar' },
  { value: 'ijtimoiy', label: 'Ijtimoiy' },
  { value: 'maxsus', label: 'Maxsus' },
];

// PAGE_TABS is built dynamically to include scholarship count

export function ScholarshipsPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [typeFilter, setTypeFilter] = useState<ScholarshipType | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Scholarship | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Scholarship | null>(null);

  const { data: scholarships, isLoading } = useScholarships({
    type: typeFilter || undefined,
  });

  const createMutation = useCreateScholarship();
  const updateMutation = useUpdateScholarship();
  const deleteMutation = useDeleteScholarship();

  const handleCreate = useCallback(
    (formData: ScholarshipFormData) => {
      createMutation.mutate(
        {
          studentId: formData.studentId,
          type: formData.type,
          amount: formData.amount,
          startDate: formData.startDate,
          endDate: formData.endDate,
          basis: formData.basis,
        },
        { onSuccess: () => setFormOpen(false) },
      );
    },
    [createMutation],
  );

  const handleEdit = useCallback(
    (formData: ScholarshipFormData) => {
      if (!editTarget) return;
      updateMutation.mutate(
        { id: editTarget.id, patch: { type: formData.type, amount: formData.amount, startDate: formData.startDate, endDate: formData.endDate, basis: formData.basis } },
        { onSuccess: () => setEditTarget(null) },
      );
    },
    [editTarget, updateMutation],
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteMutation]);

  const allScholarships = (scholarships ?? []) as Scholarship[];
  const filtered = allScholarships.filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false;
    return true;
  });

  const totalMonthly = filtered
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const columns: Column<Scholarship>[] = [
    {
      key: 'idx',
      header: '#',
      width: '50px',
      render: (_, index) => <span className="text-slate-500">{index + 1}</span>,
    },
    {
      key: 'studentName',
      header: 'Talaba',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.studentName}</p>
          <p className="text-[11.5px] text-muted">{row.basis}</p>
        </div>
      ),
    },
    {
      key: 'groupName',
      header: 'Guruh',
      render: (row) => <span>{row.groupName}</span>,
    },
    {
      key: 'facultyName',
      header: 'Fakultet',
      render: (row) => (
        <span className="text-[12.5px]">
          {row.facultyName?.split(' ').slice(0, 2).join(' ')}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Turi',
      render: (row) => {
        const cfg = TYPE_LABELS[row.type];
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: 'amount',
      header: 'Summa/oy',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="font-semibold tabular-nums text-slate-900">
          {formatMoney(row.amount)}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Davr',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {formatDate(row.startDate)} — {formatDate(row.endDate)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => {
        const cfg = STATUS_LABELS[row.status] ?? { variant: 'default' as const, label: row.status };
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
  ];

  if (isLoading) {
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
      <PageHeader
        title="Stipendiyalar"
        subtitle={`Faol oylik summa: ${formatMoney(totalMonthly)}`}
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: 'Stipendiyalar' },
        ]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Stipendiya tayinlash
          </Button>
        }
      />

      <Tabs
        tabs={[
          { id: 'list', label: 'Stipendiya oluvchilar', count: allScholarships.length },
          { id: 'assign', label: 'Tayinlash' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'list' && (
        <>
          <div className="mt-4 flex gap-2.5 mb-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ScholarshipType | '')}
              className="h-9 w-[200px] rounded-lg border border-border px-3 text-sm"
            >
              {TYPE_FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-[180px] rounded-lg border border-border px-3 text-sm"
            >
              <option value="">Barcha holatlar</option>
              <option value="active">Faol</option>
              <option value="paused">To&apos;xtatilgan</option>
              <option value="completed">Yakunlangan</option>
            </select>
          </div>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
            <DataTable
              data={filtered}
              columns={columns}
              keyField="id"
              emptyMessage="Stipendiyalar topilmadi"
              actions={(row) => (
                <DropdownMenu
                  items={[
                    { label: 'Tahrirlash', onClick: () => setEditTarget(row) },
                    { label: 'Faol qilish', onClick: () => {} },
                    { label: "To'xtatish", onClick: () => {} },
                    { label: "O'chirish", onClick: () => setDeleteTarget(row), danger: true },
                  ]}
                />
              )}
            />
          </div>
        </>
      )}

      {activeTab === 'assign' && (
        <div className="mt-4">
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Stipendiya tayinlash
          </Button>
        </div>
      )}

      <ScholarshipForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={createMutation.isPending}
      />

      <ScholarshipForm
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        scholarship={editTarget}
        loading={updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Stipendiyani o'chirish"
        message={`${deleteTarget?.studentName} stipendiyasini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </PageContent>
  );
}
