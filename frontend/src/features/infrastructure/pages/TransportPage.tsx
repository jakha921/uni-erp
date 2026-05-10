import { useState } from 'react';
import { Truck, CheckCircle, Wrench, MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '@/api/hooks/useInfrastructure';
import { VehicleForm } from '../components/VehicleForm';
import type { Vehicle, VehicleStatus } from '@/types/infrastructure';
import type { VehicleFormData } from '../schemas/vehicle.schema';

type FilterStatus = VehicleStatus | 'all';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: 'Faol', color: 'bg-emerald-50 text-emerald-700' },
  in_use: { label: 'Foydalanishda', color: 'bg-blue-50 text-blue-700' },
  repair: { label: "Ta'mirda", color: 'bg-amber-50 text-amber-700' },
  decommissioned: { label: 'Nofaol', color: 'bg-slate-100 text-slate-500' },
};

export function TransportPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);

  const { data, isLoading } = useVehicles({
    page: 1, pageSize: 50,
    status: filter === 'all' ? undefined : filter as VehicleStatus,
  });

  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const vehicles = data?.data ?? [];
  const total = data?.total ?? 0;
  const available = vehicles.filter((v) => v.status === 'available').length;
  const inRepair = vehicles.filter((v) => v.status === 'repair').length;

  const handleOpenCreate = () => { setEditVehicle(null); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditVehicle(null); };

  const handleSubmit = (formData: VehicleFormData) => {
    if (editVehicle) {
      updateVehicle.mutate({ id: editVehicle.id, data: formData }, { onSuccess: handleClose });
    } else {
      createVehicle.mutate(formData, { onSuccess: handleClose });
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Transport"
        subtitle="Universitet transport vositalari boshqaruvi"
        breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'Transport' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
            Transport qo&apos;shish
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami transport" value={String(total)} icon={<Truck className="h-5 w-5" />} />
        <StatCard label="Faol" value={String(available)} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard label="Ta'mirda" value={String(inRepair)} icon={<Wrench className="h-5 w-5" />} />
        <StatCard label="Yo'nalishlar" value={String(vehicles.filter((v) => v.route).length)} icon={<MapPin className="h-5 w-5" />} />
      </div>

      <VehicleForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        vehicle={editVehicle}
        loading={createVehicle.isPending || updateVehicle.isPending}
      />
      <ConfirmDialog
        open={!!deleteVehicle}
        onClose={() => setDeleteVehicle(null)}
        onConfirm={() => {
          if (!deleteVehicle) return;
          deleteVehicleMutation.mutate(deleteVehicle.id, { onSuccess: () => setDeleteVehicle(null) });
        }}
        title="Transportni o'chirish"
        message={`"${deleteVehicle?.brand} ${deleteVehicle?.model}" transportni o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteVehicleMutation.isPending}
      />

      <Card title="" className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          {(['all', 'available', 'in_use', 'repair', 'decommissioned'] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === s ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s === 'all' ? 'Barchasi' : STATUS_LABELS[s]?.label ?? s}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                {['MARKA', "DAVLAT RAQAMI", 'HAYDOVCHI', "YO'NALISH", 'HOLAT', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => {
                const st = STATUS_LABELS[v.status] ?? { label: v.status, color: 'bg-slate-100 text-slate-500' };
                return (
                  <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{v.brand} {v.model}</td>
                    <td className="px-4 py-3 text-[13px] font-mono text-slate-600">{v.plateNumber}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-700">{v.driverName}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{v.route ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => { setEditVehicle(v); setFormOpen(true); }} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setDeleteVehicle(v)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!isLoading && vehicles.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">Ma'lumot topilmadi</div>
        )}
      </Card>
    </PageContent>
  );
}
