import { useState, useCallback } from 'react';
import { Plus, Users } from 'lucide-react';
import { Modal } from '@/components/overlays';
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
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkType, setBulkType] = useState<ScholarshipType>('davlat');
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkStart, setBulkStart] = useState('');
  const [bulkEnd, setBulkEnd] = useState('');
  const [bulkGroup, setBulkGroup] = useState('');

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
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Users className="h-4 w-4" />}
              onClick={() => setBulkOpen(true)}
            >
              Ommaviy tayinlash
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
              Stipendiya tayinlash
            </Button>
          </div>
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

      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Ommaviy stipendiya tayinlash"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setBulkOpen(false)}>Bekor qilish</Button>
            <Button
              disabled={!bulkAmount || !bulkStart || !bulkEnd}
              onClick={() => setBulkOpen(false)}
            >
              Tayinlash
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Tanlangan guruh yoki barcha talabalar uchun stipendiya tayinlash.
          </p>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Stipendiya turi</label>
            <select
              value={bulkType}
              onChange={(e) => setBulkType(e.target.value as ScholarshipType)}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            >
              {(Object.keys(TYPE_LABELS) as ScholarshipType[]).map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Guruh (ixtiyoriy)</label>
            <input
              type="text"
              value={bulkGroup}
              onChange={(e) => setBulkGroup(e.target.value)}
              placeholder="Masalan: IT-22"
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Miqdor (so&apos;m)</label>
            <input
              type="number"
              value={bulkAmount}
              onChange={(e) => setBulkAmount(e.target.value)}
              placeholder="350000"
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Boshlanish sanasi</label>
              <input
                type="date"
                value={bulkStart}
                onChange={(e) => setBulkStart(e.target.value)}
                className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Tugash sanasi</label>
              <input
                type="date"
                value={bulkEnd}
                onChange={(e) => setBulkEnd(e.target.value)}
                className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
              />
            </div>
          </div>
        </div>
      </Modal>
    </PageContent>
  );
}
