import { useState } from 'react';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/data-display/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { AttendanceCalendar } from '../components/AttendanceCalendar';
import { useAttendance } from '@/api/hooks/useHr';

export function AttendancePage() {
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const { data: rows, isLoading } = useAttendance();

  const MONTH_NAMES = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Xodimlar davomati (Tabel)"
        subtitle={`${MONTH_NAMES[month - 1]} ${year}`}
        breadcrumbs={[
          { label: 'Kadrlar', path: '/hr' },
          { label: 'Davomat' },
        ]}
        actions={
          <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
            Excel ga eksport
          </Button>
        }
      />

      {/* Filters + legend */}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <select
            value={String(month - 1)}
            onChange={(e) => setMonth(Number(e.target.value) + 1)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={i} value={String(i)}>{m}</option>
            ))}
          </select>
          <select className="h-9 rounded-lg border border-border px-3 text-sm">
            <option value="">Bo&apos;lim</option>
            <option value="informatika">Informatika</option>
            <option value="iqtisodiyot">Iqtisodiyot</option>
            <option value="buxgalteriya">Buxgalteriya</option>
          </select>
          <div className="flex-1" />
          <div className="flex items-center gap-3.5 text-xs">
            {[
              { label: 'I — ishda', color: 'bg-emerald-500' },
              { label: 'X — kelmadi', color: 'bg-red-500' },
              { label: 'K — kasallik', color: 'bg-amber-500' },
              { label: "T — ta'til", color: 'bg-violet-500' },
            ].map((item) => (
              <div key={item.label} className="inline-flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                <span className="text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Attendance table */}
      <Card noPadding className="overflow-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : rows && rows.length > 0 ? (
          <AttendanceCalendar rows={rows} month={monthStr} />
        ) : (
          <div className="p-8 text-center text-muted">
            Davomat ma&apos;lumotlari topilmadi
          </div>
        )}
      </Card>
    </div>
  );
}
