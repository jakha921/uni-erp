import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, Search, FileDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageContent } from '@/components/layout';
import { Pagination } from '@/components/table';
import { Button, Spinner, AlertBanner } from '@/components/ui';
import { Card } from '@/components/data-display';
import { ConfirmDialog } from '@/components/overlays';
import { useContracts, useCreateContract, useUpdateContract, useDeleteContract } from '@/api/hooks/useFinance';
import { useFaculties } from '@/api/hooks/useCore';
import { ContractTable } from '../components/ContractTable';
import { ContractForm } from '../components/ContractForm';
import { ContractEditModal } from '../components/ContractEditModal';
import { ContractDetailSlide } from '../components/ContractDetailSlide';
import type { Contract, ContractStatus, ContractType } from '@/types/finance';
import type { ContractFormData, ContractEditFormData } from '../schemas/contract.schema';

export function ContractsListPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContractStatus | ''>('');
  const [contractType, setContractType] = useState<ContractType | ''>('');
  const [fYear, setFYear] = useState('');
  const [faculty, setFaculty] = useState(() => searchParams.get('faculty') ?? '');

  useEffect(() => {
    const f = searchParams.get('faculty');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (f) setFaculty(f);
  }, [searchParams]);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Contract | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);
  const [slideContract, setSlideContract] = useState<Contract | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading, error } = useContracts({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    status: status || undefined,
    contractType: contractType || undefined,
  });

  const createMutation = useCreateContract();
  const updateMutation = useUpdateContract();
  const deleteMutation = useDeleteContract();
  const { data: faculties } = useFaculties();

  const handleCreate = useCallback(
    (formData: ContractFormData) => {
      createMutation.mutate(
        {
          studentId: formData.studentId,
          contractType: formData.contractType,
          contractAmount: formData.contractAmount,
          contractDate: formData.contractDate,
          educationYear: formData.educationYear,
          paymentSchedule: formData.paymentSchedule,
        },
        { onSuccess: () => setFormOpen(false) },
      );
    },
    [createMutation],
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteMutation]);

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  if (isLoading) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </PageContent>
    );
  }

  const contracts = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <PageContent>
      <PageHeader
        title={t('nav.contracts')}
        subtitle={`${t('common.total')}: ${total} ta`}
        breadcrumbs={[
          { label: t('nav.finance'), path: '/finance' },
          { label: t('nav.contracts') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/api/v1/finance/contracts/export/';
                a.download = 'kontraktlar.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              Excel
            </Button>
            <Button
              variant="secondary"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/api/v1/finance/contracts/export-pdf/';
                a.download = 'kontraktlar.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              PDF
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-2.5">
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t('common.search')}
                className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
              />
            </div>
          </div>
          <select
            value={contractType}
            onChange={(e) => { setContractType(e.target.value as ContractType | ''); setPage(1); }}
            className="h-9 w-[180px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">{t('finance.allTypes')}</option>
            <option value="bazoviy">{t('finance.contractTypes.bazoviy')}</option>
            <option value="tabaqalashtirilgan">{t('finance.contractTypes.tabaqalashtirilgan')}</option>
            <option value="grant">{t('finance.contractTypes.grant')}</option>
            <option value="xorijiy">{t('finance.contractTypes.xorijiy')}</option>
          </select>
          <select
            value={fYear}
            onChange={(e) => { setFYear(e.target.value); setPage(1); }}
            className="h-9 w-[140px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">{t('finance.allYears')}</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>
          <select
            className="h-9 w-[180px] rounded-lg border border-border px-3 text-sm"
            value={faculty}
            onChange={(e) => { setFaculty(e.target.value); setPage(1); }}
          >
            <option value="">{t('finance.allFaculties')}</option>
            {(faculties ?? []).map((f) => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as ContractStatus | ''); setPage(1); }}
            className="h-9 w-[150px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">{t('finance.allStatuses')}</option>
            <option value="active">{t('statuses.active')}</option>
            <option value="completed">{t('statuses.completed')}</option>
            <option value="cancelled">{t('statuses.cancelled')}</option>
          </select>
          <div className="flex-1" />
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            {t('finance.newContract')}
          </Button>
        </div>
      </Card>

      {/* Table in Card */}
      <Card noPadding className="overflow-hidden">
        <ContractTable
          data={contracts}
          page={page}
          pageSize={10}
          onEdit={(contract) => setEditTarget(contract)}
          onDelete={(contract) => setDeleteTarget(contract)}
          onRowClick={(contract) => setSlideContract(contract)}
        />
        <div className="border-t border-[#F1F5F9] px-4 py-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            total={total}
            pageSize={10}
          />
        </div>
      </Card>

      <ContractForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={createMutation.isPending}
      />

      <ContractEditModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={(data: ContractEditFormData) => {
          if (!editTarget) return;
          updateMutation.mutate(
            { id: editTarget.id, patch: { contractType: data.contractType, contractAmount: data.contractAmount } },
            { onSuccess: () => setEditTarget(null) },
          );
        }}
        contract={editTarget}
        loading={updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('finance.deleteContractTitle')}
        message={t('finance.deleteContractConfirm', { number: deleteTarget?.contractNumber ?? '' })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteMutation.isPending}
      />

      {slideContract && (
        <ContractDetailSlide
          contract={slideContract}
          onClose={() => setSlideContract(null)}
        />
      )}
    </PageContent>
  );
}
