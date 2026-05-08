import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button } from '@/components/ui';
import { DataTable, type Column } from '@/components/table';
import { Building2, Users, DoorOpen, FileText, Plus, Map, List } from 'lucide-react';
import { rnum, generateName } from '@/api/mock/shared-data';
import { cn } from '@/lib/utils';

// --- Types ---

interface Room {
  id: number;
  num: number;
  floor: number;
  capacity: number;
  occupied: number;
  type: 'empty' | 'partial' | 'full' | 'repair';
  supervisor: string;
}

// --- Mock Data ---

const ROOMS: Room[] = Array.from({ length: 48 }, (_, i) => {
  const capacity = 4;
  const rawOcc = rnum(i * 3, 0, 5);
  const isRepair = rawOcc === 5;
  const occupied = isRepair ? 0 : Math.min(rawOcc, capacity);
  const type: Room['type'] = isRepair
    ? 'repair'
    : occupied === 0
      ? 'empty'
      : occupied === capacity
        ? 'full'
        : 'partial';
  const name = generateName(i + 500, 0.4);
  return {
    id: i + 1,
    num: 201 + i,
    floor: Math.floor(i / 12) + 2,
    capacity,
    occupied,
    type,
    supervisor: name.short,
  };
});

const TOTAL_ROOMS = 142;
const OCCUPANCY_PERCENT = '90%';
const OCCUPANCY_SUB = '1,156 joy band';
const FREE_PLACES = 114;
const WAITLIST = 38;

// --- Room style helpers ---

const ROOM_STYLES = {
  empty: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  partial: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
  full: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800' },
  repair: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-500' },
} as const;

// --- Table Columns ---

const roomColumns: Column<Room>[] = [
  {
    key: 'num',
    header: 'Xona',
    render: (row) => <span className="font-semibold text-slate-900 tabular-nums">{row.num}</span>,
  },
  {
    key: 'floor',
    header: 'Qavat',
    render: (row) => <span className="text-slate-600">{row.floor}-qavat</span>,
  },
  {
    key: 'capacity',
    header: "Sig'im",
    render: (row) => <span className="text-slate-600 tabular-nums">{row.capacity} o&apos;rinli</span>,
  },
  {
    key: 'occupied',
    header: 'Band',
    render: (row) => (
      <span className="font-medium tabular-nums">
        {row.occupied}/{row.capacity}
      </span>
    ),
  },
  {
    key: 'type',
    header: 'Holat',
    render: (row) => {
      const labels: Record<Room['type'], string> = {
        empty: "Bo'sh",
        partial: 'Qisman',
        full: "To'liq",
        repair: "Ta'mirda",
      };
      const variants: Record<Room['type'], 'default' | 'success' | 'warning' | 'error'> = {
        empty: 'default',
        partial: 'warning',
        full: 'success',
        repair: 'error',
      };
      return (
        <Badge variant={variants[row.type]} dot>
          {labels[row.type]}
        </Badge>
      );
    },
  },
  {
    key: 'supervisor',
    header: 'Nazoratchi',
    render: (row) => <span className="text-slate-600">{row.supervisor}</span>,
  },
];

// --- Component ---

export function DormitoryPage() {
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <PageContent>
      <PageHeader
        title="TTJ (yotoqxona)"
        subtitle="Talabalar turar joyi boshqaruvi"
        breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'TTJ' }]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>Joylashtirish</Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Jami xonalar"
          value={TOTAL_ROOMS}
          icon={<Building2 className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
        />
        <StatCard
          label="Bandligi"
          value={OCCUPANCY_PERCENT}
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#1B7A4E"
          sub={OCCUPANCY_SUB}
        />
        <StatCard
          label="Bo'sh joylar"
          value={FREE_PLACES}
          icon={<DoorOpen className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Kutish ro'yxati"
          value={WAITLIST}
          icon={<FileText className="h-[18px] w-[18px]" />}
          iconBg="#EF4444"
        />
      </div>

      {/* View Toggle + Legend */}
      <Card noPadding>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
          {/* Toggle */}
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
                  view === id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Building select */}
          <select className="h-8 px-2.5 pr-7 border border-border rounded-md text-xs bg-white">
            <option>TTJ-2 (asosiy)</option>
            <option>TTJ-1</option>
            <option>TTJ-3</option>
          </select>

          <div className="flex-1" />

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-50 border border-emerald-200" />
              Bo&apos;sh
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-50 border border-amber-300" />
              Qisman
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-green-100 border border-green-400" />
              To&apos;liq
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-slate-100 border border-slate-300" />
              Ta&apos;mirda
            </span>
          </div>
        </div>

        {view === 'map' ? <MapView /> : <ListView />}
      </Card>
    </PageContent>
  );
}

function MapView() {
  const floors = [2, 3, 4, 5];

  return (
    <div className="p-5 space-y-5">
      {floors.map((floor) => (
        <div key={floor}>
          <h4 className="text-[13px] font-semibold text-slate-900 mb-2.5">
            {floor}-qavat
          </h4>
          <div className="grid grid-cols-12 gap-2">
            {ROOMS.filter((r) => r.floor === floor).map((room) => {
              const style = ROOM_STYLES[room.type];
              return (
                <div
                  key={room.num}
                  className={cn(
                    'aspect-[1.2] border-[1.5px] rounded-lg p-1.5 cursor-pointer flex flex-col justify-between hover:opacity-80 transition-opacity',
                    style.bg,
                    style.border,
                  )}
                >
                  <span className={cn('text-[13px] font-bold tabular-nums', style.text)}>
                    {room.num}
                  </span>
                  <span className={cn('text-[10px] font-medium', style.text)}>
                    {room.occupied}/{room.capacity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView() {
  return (
    <DataTable
      data={ROOMS}
      columns={roomColumns}
      keyField="id"
      emptyMessage="Xonalar topilmadi"
    />
  );
}
