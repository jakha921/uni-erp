import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { EmployeeAttendanceRow, EmployeeAttendanceDay } from '@/types/hr';

interface AttendanceCalendarProps {
  rows: EmployeeAttendanceRow[];
  month: string; // YYYY-MM
}

const STATUS_COLORS: Record<EmployeeAttendanceDay['status'], string> = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  leave: 'bg-blue-500',
  sick: 'bg-orange-500',
  business_trip: 'bg-purple-500',
  weekend: 'bg-slate-200',
};

const STATUS_LABELS: Record<EmployeeAttendanceDay['status'], string> = {
  present: 'Keldi',
  absent: 'Kelmadi',
  leave: "Ta'til",
  sick: 'Kasallik',
  business_trip: 'Xizmat safari',
  weekend: 'Dam olish',
};

export function AttendanceCalendar({ rows, month }: AttendanceCalendarProps) {
  const daysInMonth = useMemo(() => {
    const parts = month.split('-');
    const year = Number(parts[0]);
    const m = Number(parts[1]);
    return new Date(year, m, 0).getDate();
  }, [month]);

  const dayNumbers = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Legend */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-4">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className={cn(
                'h-3 w-3 rounded-sm',
                STATUS_COLORS[status as EmployeeAttendanceDay['status']],
              )}
            />
            {label}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left font-medium text-muted min-w-[180px]">
                Xodim
              </th>
              {dayNumbers.map((d) => (
                <th
                  key={d}
                  className="px-1 py-2 text-center font-medium text-muted w-7"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.employeeId} className="hover:bg-slate-50/50">
                <td className="sticky left-0 z-10 bg-surface px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                  <div className="truncate max-w-[170px]" title={row.employeeName}>
                    {row.employeeName}
                  </div>
                  <div className="text-[10px] text-muted font-normal">{row.department}</div>
                </td>
                {dayNumbers.map((d) => {
                  const day = row.days.find(
                    (dd) => new Date(dd.date).getDate() === d,
                  );
                  const status = day?.status ?? 'weekend';
                  return (
                    <td key={d} className="px-1 py-2 text-center">
                      <span
                        className={cn(
                          'inline-block h-5 w-5 rounded-sm',
                          STATUS_COLORS[status],
                        )}
                        title={`${d}-kun: ${STATUS_LABELS[status]}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={daysInMonth + 1}
                  className="px-4 py-12 text-center text-muted text-sm"
                >
                  Davomat ma&apos;lumotlari topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
