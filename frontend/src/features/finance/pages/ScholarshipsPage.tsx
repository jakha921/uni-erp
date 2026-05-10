import { useState, useCallback } from 'react';
import { Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

const TYPE_VARIANTS: Record<ScholarshipType, 'info' | 'success' | 'warning' | 'default'> = {
  davlat: 'info',
  prezident: 'warning',
  fanlar: 'success',
  ijtimoiy: 'default',
  maxsus: 'info',
};

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'default'> = {
  active: 'success',
  paused: 'warning',
  completed: 'default',
};

const SCHOLARSHIP_TYPE_KEYS: ScholarshipType[] = ['davlat', 'prezident', 'fanlar', 'ijtimoiy', 'maxsus'];

export function ScholarshipsPage() {
  const { t } = useTranslation();
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
      header: t('education.student'),
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
      header: t('students.group'),
      render: (row) => <span>{row.groupName}</span>,
    },
    {
      key: 'facultyName',
      header: t('students.faculty'),
      render: (row) => (
        <span className="text-[12.5px]">
          {row.facultyName?.split(' ').slice(0, 2).join(' ')}
        </span>
      ),
    },
    {
      key: 'type',
      header: t('common.type'),
      render: (row) => (
        <Badge variant={TYPE_VARIANTS[row.type] ?? 'default'} dot>
          {t(`finance.scholarshipTypes.${row.type}`, { defaultValue: row.type })}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: t('finance.amountPerMonth'),
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
      header: t('finance.period'),
      render: (row) => (
        <span className="text-xs text-slate-600">
          {formatDate(row.startDate)} — {formatDate(row.endDate)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => (
        <Badge variant={STATUS_VARIANTS[row.status] ?? 'default'} dot>
          {t(`statuses.${row.status}`, { defaultValue: row.status })}
        </Badge>
      ),
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
        title={t('finance.scholarshipsTitle')}
        subtitle={t('finance.scholarshipsActiveMonthly', { amount: formatMoney(totalMonthly) })}
        breadcrumbs={[
          { label: t('nav.finance'), path: '/finance' },
          { label: t('finance.scholarshipsTitle') },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Users className="h-4 w-4" />}
              onClick={() => setBulkOpen(true)}
            >
              {t('finance.bulkAssign')}
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
              {t('finance.assignScholarship')}
            </Button>
          </div>
        }
      />

      <Tabs
        tabs={[
          { id: 'list', label: t('finance.scholarshipRecipients'), count: allScholarships.length },
          { id: 'assign', label: t('finance.assignTab') },
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
              <option value="">{t('finance.allTypes')}</option>
              {SCHOLARSHIP_TYPE_KEYS.map((k) => (
                <option key={k} value={k}>{t(`finance.scholarshipTypes.${k}`)}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-[180px] rounded-lg border border-border px-3 text-sm"
            >
              <option value="">{t('finance.allStatuses')}</option>
              <option value="active">{t('statuses.active')}</option>
              <option value="paused">{t('statuses.paused')}</option>
              <option value="completed">{t('statuses.completed')}</option>
            </select>
          </div>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
            <DataTable
              data={filtered}
              columns={columns}
              keyField="id"
              emptyMessage={t('finance.scholarshipsNotFound')}
              actions={(row) => (
                <DropdownMenu
                  items={[
                    { label: t('common.edit'), onClick: () => setEditTarget(row) },
                    { label: t('finance.activate'), onClick: () => {} },
                    { label: t('finance.pause'), onClick: () => {} },
                    { label: t('common.delete'), onClick: () => setDeleteTarget(row), danger: true },
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
            {t('finance.assignScholarship')}
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
        title={t('finance.deleteScholarshipTitle')}
        message={t('finance.deleteScholarshipConfirm', { name: deleteTarget?.studentName ?? '' })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteMutation.isPending}
      />

      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title={t('finance.bulkAssignTitle')}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setBulkOpen(false)}>{t('common.cancel')}</Button>
            <Button
              disabled={!bulkAmount || !bulkStart || !bulkEnd}
              onClick={() => setBulkOpen(false)}
            >
              {t('finance.assignScholarship')}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">{t('finance.bulkAssignHint')}</p>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">{t('finance.scholarshipTypeLabel')}</label>
            <select
              value={bulkType}
              onChange={(e) => setBulkType(e.target.value as ScholarshipType)}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            >
              {SCHOLARSHIP_TYPE_KEYS.map((k) => (
                <option key={k} value={k}>{t(`finance.scholarshipTypes.${k}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">{t('finance.groupOptional')}</label>
            <input
              type="text"
              value={bulkGroup}
              onChange={(e) => setBulkGroup(e.target.value)}
              placeholder="Masalan: IT-22"
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">{t('finance.amountSom')}</label>
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
              <label className="mb-1 block text-xs font-medium text-slate-700">{t('finance.startDate')}</label>
              <input
                type="date"
                value={bulkStart}
                onChange={(e) => setBulkStart(e.target.value)}
                className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">{t('finance.endDate')}</label>
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
