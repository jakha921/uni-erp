import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Spinner, AlertBanner } from '@/components/ui';
import { DataTable, type Column } from '@/components/table';
import { ConfirmDialog, SlideOver } from '@/components/overlays';
import { Building2, Users, DoorOpen, FileText, Plus, Map, List, Pencil, Trash2, UserPlus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDormBuildings, useDormRooms, useCreateDormRoom, useUpdateDormRoom, useDeleteDormRoom, useDormResidents, useCheckIn, useCheckOut } from '@/api/hooks/useInfrastructure';
import { DormRoomForm } from '../components/DormRoomForm';
import type { DormRoom } from '@/types/infrastructure';
import type { DormRoomFormData } from '../schemas/dormRoom.schema';

const ROOM_STYLES = {
  available: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  partial: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
  full: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800' },
  repair: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-500' },
} as const;

const STATUS_LABEL_KEYS: Record<DormRoom['status'], string> = {
  available: 'infrastructure.roomStatusAvailable',
  partial: 'infrastructure.roomStatusPartial',
  full: 'infrastructure.roomStatusFull',
  repair: 'infrastructure.roomStatusRepair',
};

const STATUS_VARIANTS: Record<DormRoom['status'], 'default' | 'success' | 'warning' | 'error'> = {
  available: 'default',
  partial: 'warning',
  full: 'success',
  repair: 'error',
};

export function DormitoryPage() {
  const { t } = useTranslation();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [buildingId, setBuildingId] = useState<number>(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<DormRoom | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<DormRoom | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<DormRoom | null>(null);
  const [checkInName, setCheckInName] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data: buildings } = useDormBuildings();
  const { data: roomsData, isLoading, error } = useDormRooms({ buildingId, page: 1, pageSize: 100 });

  const createRoom = useCreateDormRoom();
  const updateRoom = useUpdateDormRoom();
  const deleteRoomMutation = useDeleteDormRoom();
  const { data: residents, isLoading: residentsLoading } = useDormResidents(selectedRoom?.id ?? 0);
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

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
    { key: 'number', header: t('infrastructure.roomLabel'), render: (row) => <span className="font-semibold text-slate-900 tabular-nums">{row.number}</span> },
    { key: 'floor', header: t('infrastructure.floorLabel'), render: (row) => <span className="text-slate-600">{row.floor}{t('infrastructure.floorSuffix')}</span> },
    { key: 'capacity', header: t('infrastructure.capacityLabel'), render: (row) => <span className="text-slate-600 tabular-nums">{row.capacity} {t('infrastructure.capacitySuffix')}</span> },
    { key: 'occupied', header: t('infrastructure.occupiedLabel'), render: (row) => <span className="font-medium tabular-nums">{row.occupied}/{row.capacity}</span> },
    { key: 'status', header: t('infrastructure.statusLabel'), render: (row) => <Badge variant={STATUS_VARIANTS[row.status]} dot>{t(STATUS_LABEL_KEYS[row.status])}</Badge> },
    { key: 'supervisorName', header: t('infrastructure.supervisorLabel'), render: (row) => <span className="text-slate-600">{row.supervisorName ?? '—'}</span> },
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
        title={t('infrastructure.dormTitle')}
        subtitle={t('infrastructure.dormSubtitle')}
        breadcrumbs={[{ label: t('nav.infrastructure') }, { label: t('nav.dormitory') }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
            {t('infrastructure.addRoom')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label={t('infrastructure.totalRooms')} value={totalRooms} icon={<Building2 className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
        <StatCard label={t('infrastructure.occupancy')} value={`${occupancy}%`} icon={<Users className="h-[18px] w-[18px]" />} iconBg="#1B7A4E" />
        <StatCard label={t('infrastructure.freeRooms')} value={freeRooms} icon={<DoorOpen className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label={t('infrastructure.underRepair')} value={repairRooms} icon={<FileText className="h-[18px] w-[18px]" />} iconBg="#EF4444" />
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
        title={t('infrastructure.deleteRoom')}
        message={t('infrastructure.deleteRoomConfirm', { number: deleteRoom?.number })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteRoomMutation.isPending}
      />

      <Card noPadding>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {([
              { id: 'map' as const, label: t('infrastructure.mapView'), icon: Map },
              { id: 'list' as const, label: t('infrastructure.listView'), icon: List },
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
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-50 border border-emerald-200" />{t('infrastructure.roomStatusAvailable')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-50 border border-amber-300" />{t('infrastructure.roomStatusPartial')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green-100 border border-green-400" />{t('infrastructure.roomStatusFull')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-100 border border-slate-300" />{t('infrastructure.roomStatusRepair')}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : view === 'map' ? (
          <RoomMapView rooms={rooms} onRoomClick={setSelectedRoom} />
        ) : (
          <DataTable data={rooms} columns={roomColumns} keyField="id" emptyMessage={t('infrastructure.roomsNotFound')} />
        )}
      </Card>

      <SlideOver
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        title={selectedRoom ? `${selectedRoom.number}-${t('infrastructure.roomLabel')} — ${selectedRoom.floor}${t('infrastructure.floorSuffix')}` : ''}
      >
        {selectedRoom && (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_VARIANTS[selectedRoom.status]} dot>{t(STATUS_LABEL_KEYS[selectedRoom.status])}</Badge>
              <span className="text-sm text-slate-600">{selectedRoom.occupied}/{selectedRoom.capacity} {t('infrastructure.studentCount')}</span>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-3">
              <h4 className="text-[13px] font-semibold text-slate-900">{t('infrastructure.checkInStudent')}</h4>
              <input
                type="text"
                value={checkInName}
                onChange={(e) => setCheckInName(e.target.value)}
                placeholder={t('infrastructure.studentNamePlaceholder')}
                className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
              />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="h-9 w-full rounded-lg border border-border px-3 text-sm"
              />
              <Button
                size="sm"
                leftIcon={<UserPlus className="h-3.5 w-3.5" />}
                disabled={!checkInName.trim()}
                loading={checkIn.isPending}
                onClick={() => {
                  if (!checkInName.trim()) return;
                  checkIn.mutate(
                    { roomId: selectedRoom.id, studentId: Date.now(), studentName: checkInName.trim(), checkInDate },
                    { onSuccess: () => setCheckInName('') },
                  );
                }}
              >
                {t('infrastructure.checkIn')}
              </Button>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-slate-900 mb-2">{t('infrastructure.currentResidents')}</h4>
              {residentsLoading ? (
                <div className="flex justify-center py-6"><Spinner /></div>
              ) : (residents ?? []).length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">{t('infrastructure.noResidents')}</p>
              ) : (
                <div className="space-y-2">
                  {(residents ?? []).map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                      <div>
                        <p className="text-[13px] font-medium text-slate-900">{r.studentName}</p>
                        <p className="text-[11px] text-slate-400">{t('infrastructure.checkInDate')}: {r.checkInDate}</p>
                      </div>
                      <button
                        title={t('infrastructure.checkOut')}
                        onClick={() => checkOut.mutate({ residentId: r.id, roomId: selectedRoom.id })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SlideOver>
    </PageContent>
  );
}

function RoomMapView({ rooms, onRoomClick }: { rooms: DormRoom[]; onRoomClick: (room: DormRoom) => void }) {
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
                  onClick={() => onRoomClick(room)}
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
