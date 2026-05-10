import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { DataTable, type Column } from '@/components/table';
import { ConfirmDialog } from '@/components/overlays';
import { Building2, Users, DoorOpen, FileText, Plus, Map, List, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDormBuildings, useDormRooms, useCreateDormRoom, useUpdateDormRoom, useDeleteDormRoom } from '@/api/hooks/useInfrastructure';
import { DormRoomForm } from '../components/DormRoomForm';
import type { DormRoom } from '@/types/infrastructure';
import type { DormRoomFormData } from '../schemas/dormRoom.schema';

const ROOM_STYLES = {
  available: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  partial: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
  full: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800' },
  repair: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-500' },
} as const;

const STATUS_LABELS: Record<DormRoom['status'], string> = {
  available: "Bo'sh",
  partial: 'Qisman',
  full: "To'liq",
  repair: "Ta'mirda",
};

const STATUS_VARIANTS: Record<DormRoom['status'], 'default' | 'success' | 'warning' | 'error'> = {
  available: 'default',
  partial: 'warning',
  full: 'success',
  repair: 'error',
};

export function DormitoryPage() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [buildingId, setBuildingId] = useState<number>(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<DormRoom | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<DormRoom | null>(null);

  const { data: buildings } = useDormBuildings();
  const { data: roomsData, isLoading } = useDormRooms({ buildingId, page: 1, pageSize: 100 });

  const createRoom = useCreateDormRoom();
  const updateRoom = useUpdateDormRoom();
  const deleteRoomMutation = useDeleteDormRoom();

  const rooms = roomsData?.data ?? [];
  const currentBuilding = buildings?.find((b) => b.id === buildingId);

  const totalRooms = currentBuilding?.totalRooms ?? 0;
  const occupancy = currentBuilding?.occupancy ?? 0;
  const freeRooms = rooms.filter((r) => r.status === 'available').length;
  const repairRooms = rooms.filter((r) => r.status === 'repair').length;

  const handleOpenCreate = () => { setEditRoom(null); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditRoom(null); };

  const handleSubmit = (data: DormRoomFormData) => {
    if (editRoom) {
      updateRoom.mutate({ id: editRoom.id, data }, { onSuccess: handleClose });
    } else {
      createRoom.mutate(data, { onSuccess: handleClose });
    }
  };

  const roomColumns: Column<DormRoom>[] = [
    { key: 'number', header: 'Xona', render: (row) => <span className="font-semibold text-slate-900 tabular-nums">{row.number}</span> },
    { key: 'floor', header: 'Qavat', render: (row) => <span className="text-slate-600">{row.floor}-qavat</span> },
    { key: 'capacity', header: "Sig'im", render: (row) => <span className="text-slate-600 tabular-nums">{row.capacity} o&apos;rinli</span> },
    { key: 'occupied', header: 'Band', render: (row) => <span className="font-medium tabular-nums">{row.occupied}/{row.capacity}</span> },
    { key: 'status', header: 'Holat', render: (row) => <Badge variant={STATUS_VARIANTS[row.status]} dot>{STATUS_LABELS[row.status]}</Badge> },
    { key: 'supervisorName', header: 'Nazoratchi', render: (row) => <span className="text-slate-600">{row.supervisorName ?? '—'}</span> },
    {
      key: 'id', header: '', width: '70px',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => { setEditRoom(row); setFormOpen(true); }} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setDeleteRoom(row)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="TTJ (yotoqxona)"
        subtitle="Talabalar turar joyi boshqaruvi"
        breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'TTJ' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
            Xona qo&apos;shish
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami xonalar" value={totalRooms} icon={<Building2 className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
        <StatCard label="Bandligi" value={`${occupancy}%`} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#1B7A4E" />
        <StatCard label="Bo'sh xonalar" value={freeRooms} icon={<DoorOpen className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Ta'mirda" value={repairRooms} icon={<FileText className="h-[18px] w-[18px]" />} iconBg="#EF4444" />
      </div>

      <DormRoomForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        room={editRoom}
        buildings={buildings ?? []}
        loading={createRoom.isPending || updateRoom.isPending}
      />
      <ConfirmDialog
        open={!!deleteRoom}
        onClose={() => setDeleteRoom(null)}
        onConfirm={() => {
          if (!deleteRoom) return;
          deleteRoomMutation.mutate(deleteRoom.id, { onSuccess: () => setDeleteRoom(null) });
        }}
        title="Xonani o'chirish"
        message={`${deleteRoom?.number}-xonani o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteRoomMutation.isPending}
      />

      <Card noPadding>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {([
              { id: 'map' as const, label: 'Xarita', icon: Map },
              { id: 'list' as const, label: "Ro'yxat", icon: List },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  view === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <select
            value={buildingId}
            onChange={(e) => setBuildingId(Number(e.target.value))}
            className="h-8 px-2.5 pr-7 border border-border rounded-md text-xs bg-white"
          >
            {(buildings ?? []).map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <div className="flex-1" />

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-50 border border-emerald-200" />Bo&apos;sh</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-50 border border-amber-300" />Qisman</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green-100 border border-green-400" />To&apos;liq</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-100 border border-slate-300" />Ta&apos;mirda</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : view === 'map' ? (
          <RoomMapView rooms={rooms} />
        ) : (
          <DataTable data={rooms} columns={roomColumns} keyField="id" emptyMessage="Xonalar topilmadi" />
        )}
      </Card>
    </PageContent>
  );
}

function RoomMapView({ rooms }: { rooms: DormRoom[] }) {
  const floors = [...new Set(rooms.map((r) => r.floor))].sort();

  return (
    <div className="p-5 space-y-5">
      {floors.map((floor) => (
        <div key={floor}>
          <h4 className="text-[13px] font-semibold text-slate-900 mb-2.5">{floor}-qavat</h4>
          <div className="grid grid-cols-12 gap-2">
            {rooms.filter((r) => r.floor === floor).map((room) => {
              const style = ROOM_STYLES[room.status];
              return (
                <div
                  key={room.number}
                  className={cn(
                    'aspect-[1.2] border-[1.5px] rounded-lg p-1.5 cursor-pointer flex flex-col justify-between hover:opacity-80 transition-opacity',
                    style.bg, style.border,
                  )}
                >
                  <span className={cn('text-[13px] font-bold tabular-nums', style.text)}>{room.number}</span>
                  <span className={cn('text-[10px] font-medium', style.text)}>{room.occupied}/{room.capacity}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
