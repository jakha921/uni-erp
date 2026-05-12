import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, FileText, CheckCircle, Clock, File } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Pagination } from '@/components/table';
import { Button, Spinner, AlertBanner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { OrderTable } from '../components/OrderTable';
import { OrderForm } from '../components/OrderForm';
import { useOrders, useCreateOrder, useUpdateOrderStatus, useDeleteOrder, useEmployees } from '@/api/hooks/useHr';
import type { OrderFormData } from '../schemas/order.schema';
import type { HrOrder, OrderType, OrderStatus } from '@/types/hr';

export function OrdersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState<HrOrder | null>(null);

  const { data: ordersData, isLoading, error } = useOrders();
  const { data: employeesData } = useEmployees({ pageSize: 100 });
  const createMutation = useCreateOrder();
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();

  const filteredOrders = (ordersData ?? []).filter((order) => {
    if (search && !order.employeeName.toLowerCase().includes(search.toLowerCase()) &&
        !order.number.toLowerCase().includes(search.toLowerCase()) &&
        !order.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (typeFilter && order.type !== typeFilter) return false;
    if (statusFilter && order.status !== statusFilter) return false;
    return true;
  });

  const pageSize = 20;
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const handleCreate = useCallback(
    (formData: OrderFormData) => {
      createMutation.mutate(
        {
          type: formData.type as OrderType,
          employeeId: Number(formData.employeeId),
          effectiveDate: formData.effectiveDate,
          basis: formData.basis,
          title: formData.title,
        },
        { onSuccess: () => setFormOpen(false) },
      );
    },
    [createMutation],
  );

  const allOrders = ordersData ?? [];
  const signedCount = useMemo(() => allOrders.filter((o) => o.status === 'signed').length, [allOrders]);
  const reviewCount = useMemo(() => allOrders.filter((o) => o.status === 'review').length, [allOrders]);
  const draftCount = useMemo(() => allOrders.filter((o) => o.status === 'draft').length, [allOrders]);

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title={t('hr.hrOrders')}
        subtitle={`${t('common.total')}: ${filteredOrders.length}`}
        breadcrumbs={[{ label: t('nav.hr'), path: '/hr' }, { label: t('nav.orders') }]}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label={t('hr.totalOrders')} value={allOrders.length} icon={<FileText className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label={t('statuses.signed')} value={signedCount} icon={<CheckCircle className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
        <StatCard label={t('statuses.review')} value={reviewCount} icon={<Clock className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label={t('hr.drafts')} value={draftCount} icon={<File className="h-[18px] w-[18px]" />} iconBg="#6366F1" />
      </div>

      {/* Card-toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('hr.searchOrderPlaceholder')}
              className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as OrderType | ''); setPage(1); }}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">{t('hr.orderType')}</option>
            <option value="hire">{t('hr.orderHire')}</option>
            <option value="fire">{t('hr.orderFire')}</option>
            <option value="promotion">{t('hr.orderPromotion')}</option>
            <option value="salary_change">{t('hr.orderSalaryChange')}</option>
            <option value="leave">{t('hr.orderLeave')}</option>
            <option value="business_trip">{t('hr.orderBusinessTrip')}</option>
            <option value="bonus">{t('hr.orderBonus')}</option>
            <option value="penalty">{t('hr.orderPenalty')}</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | ''); setPage(1); }}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">{t('common.status')}</option>
            <option value="draft">{t('statuses.draft')}</option>
            <option value="review">{t('statuses.review')}</option>
            <option value="signed">{t('statuses.signed')}</option>
            <option value="cancelled">{t('statuses.cancelled')}</option>
          </select>
          <div className="flex-1" />
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setFormOpen(true)}
          >
            {t('hr.newOrder')}
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center"><Spinner /></div>
        ) : (
          <>
            <OrderTable
              data={pagedOrders}
              onStatusChange={(order, status) => updateStatusMutation.mutate({ id: order.id, status })}
              onDelete={setDeleteOrder}
            />
            {totalPages > 1 && (
              <div className="border-t border-[#F1F5F9] px-4 py-3">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={filteredOrders.length}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <OrderForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        employees={employeesData?.data ?? []}
        loading={createMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteOrder}
        onClose={() => setDeleteOrder(null)}
        onConfirm={() => {
          if (!deleteOrder) return;
          deleteMutation.mutate(deleteOrder.id, { onSuccess: () => setDeleteOrder(null) });
        }}
        title={t('hr.deleteOrder')}
        message={t('hr.deleteOrderConfirm', { number: deleteOrder?.number })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </PageContent>
  );
}
