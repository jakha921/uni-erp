import { useState, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Pagination } from '@/components/table';
import { Button, Spinner } from '@/components/ui';
import { Card } from '@/components/data-display';
import { ConfirmDialog } from '@/components/overlays';
import { useContracts, useCreateContract, useDeleteContract } from '@/api/hooks/useFinance';
import { useFaculties } from '@/api/hooks/useCore';
import { ContractTable } from '../components/ContractTable';
import { ContractForm } from '../components/ContractForm';
import { ContractDetailSlide } from '../components/ContractDetailSlide';
import type { Contract, ContractStatus, ContractType } from '@/types/finance';
import type { ContractFormData } from '../schemas/contract.schema';

export function ContractsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContractStatus | ''>('');
  const [contractType, setContractType] = useState<ContractType | ''>('');
  const [fYear, setFYear] = useState('');
  const [faculty, setFaculty] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);
  const [slideContract, setSlideContract] = useState<Contract | null>(null);

  const { data, isLoading } = useContracts({
    page,
    pageSize: 10,
    search: search || undefined,
    status: status || undefined,
    contractType: contractType || undefined,
  });

  const createMutation = useCreateContract();
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
        title="Kontraktlar"
        subtitle={`Jami: ${total} ta`}
        breadcrumbs={[
          { label: 'Moliya', path: '/finance' },
          { label: 'Kontraktlar' },
        ]}
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
                placeholder="Kontrakt №, talaba nomi..."
                className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
              />
            </div>
          </div>
          <select
            value={contractType}
            onChange={(e) => { setContractType(e.target.value as ContractType | ''); setPage(1); }}
            className="h-9 w-[180px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha turlari</option>
            <option value="bazoviy">Bazoviy</option>
            <option value="tabaqalashtirilgan">Tabaqalashtirilgan</option>
            <option value="grant">Grant</option>
            <option value="xorijiy">Xorijiy</option>
          </select>
          <select
            value={fYear}
            onChange={(e) => { setFYear(e.target.value); setPage(1); }}
            className="h-9 w-[140px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha yillar</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>
          <select
            className="h-9 w-[180px] rounded-lg border border-border px-3 text-sm"
            value={faculty}
            onChange={(e) => { setFaculty(e.target.value); setPage(1); }}
          >
            <option value="">Barcha fakultetlar</option>
            {(faculties ?? []).map((f) => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as ContractStatus | ''); setPage(1); }}
            className="h-9 w-[150px] rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="completed">Yakunlangan</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>
          <div className="flex-1" />
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Yangi kontrakt
          </Button>
        </div>
      </Card>

      {/* Table in Card */}
      <Card noPadding className="overflow-hidden">
        <ContractTable
          data={contracts}
          page={page}
          pageSize={10}
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Kontraktni o'chirish"
        message={`"${deleteTarget?.contractNumber}" kontraktni o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
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
