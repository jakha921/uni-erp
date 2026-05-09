import { useState, useMemo } from 'react';
import { Plus, Clock, Briefcase, Calendar, Search, BarChart3 } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { StatCard } from '@/components/data-display/StatCard';
import { Tabs } from '@/components/navigation/Tabs';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { LeaveTable } from '../components/LeaveTable';
import { LeaveForm } from '../components/LeaveForm';
import { useLeaves, useCreateLeave, useUpdateLeave, useEmployees } from '@/api/hooks/useHr';
import type { CreateLeaveDto, LeaveStatus } from '@/types/hr';

export function LeavesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const { data: leaves, isLoading } = useLeaves();
  const { data: employeesData } = useEmployees();
  const createMutation = useCreateLeave();
  const updateMutation = useUpdateLeave();

  const employees = employeesData?.data ?? [];

  const filtered = useMemo(() => {
    if (!leaves) return [];
    return leaves.filter((l) => {
      if (search && !l.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
      if (tab === 'leaves' && l.type === 'business_trip') return false;
      if (tab === 'trips' && l.type !== 'business_trip') return false;
      if (tab === 'pending' && l.status !== 'pending') return false;
      return true;
    });
  }, [leaves, tab, search]);

  const onLeaveCount = leaves?.filter(l => l.status === 'approved' && l.type !== 'business_trip').length ?? 0;
  const onTripCount = leaves?.filter(l => l.status === 'approved' && l.type === 'business_trip').length ?? 0;
  const pendingCount = leaves?.filter(l => l.status === 'pending').length ?? 0;

  const handleApprove = (leave: { id: string }) => {
    updateMutation.mutate({ id: leave.id, patch: { status: 'approved' as LeaveStatus } });
  };

  const handleReject = (leave: { id: string }) => {
    updateMutation.mutate({ id: leave.id, patch: { status: 'rejected' as LeaveStatus } });
  };

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title="Ta'tillar va xizmat safarlari"
        subtitle={`Jami: ${filtered.length} ta`}
        breadcrumbs={[
          { label: 'Kadrlar', path: '/hr' },
          { label: "Ta'tillar" },
        ]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Yangi ariza
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Hozir ta'tilda" value={onLeaveCount} icon={<Calendar className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Hozir safarda" value={onTripCount} icon={<Briefcase className="h-[18px] w-[18px]" />} iconBg="#8B5CF6" />
        <StatCard label="Tasdiqlash kutmoqda" value={pendingCount} icon={<Clock className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Bu oy jami" value={leaves?.length ?? 0} icon={<BarChart3 className="h-[18px] w-[18px]" />} iconBg="#6366F1" />
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            { id: 'all', label: 'Hammasi', count: leaves?.length ?? 0 },
            { id: 'leaves', label: "Ta'tillar", count: leaves?.filter((l) => l.type !== 'business_trip').length ?? 0 },
            { id: 'trips', label: 'Xizmat safarlari', count: leaves?.filter((l) => l.type === 'business_trip').length ?? 0 },
            { id: 'pending', label: 'Tasdiqlash kutmoqda', count: pendingCount },
          ]}
          activeTab={tab}
          onTabChange={setTab}
        />

        {/* Search */}
        <Card className="mt-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Xodim ismi bo'yicha qidirish…"
              className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
          </div>
        </Card>

        {/* Table */}
        <Card noPadding className="overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <LeaveTable
            data={filtered}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </Card>
      </div>

      <LeaveForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => {
          createMutation.mutate(data as unknown as CreateLeaveDto, {
            onSuccess: () => setFormOpen(false),
          });
        }}
        employees={employees}
        loading={createMutation.isPending}
      />
    </PageContent>
  );
}
