import { ChartCard } from '@/components/data-display';
import { formatMoney } from '@/lib/utils';

interface FacultyRevenue {
  faculty: string;
  total: number;
  paid: number;
  debt: number;
}

interface RevenueByFacultyProps {
  data: FacultyRevenue[];
  onFacultyClick?: (faculty: string) => void;
}

export function RevenueByFaculty({ data, onFacultyClick }: RevenueByFacultyProps) {
  return (
    <ChartCard title="Fakultetlar bo'yicha yig'im" subtitle="Kliklang — kontrakt filtrini qo'llash">
      <div className="flex flex-col gap-4">
        {data.map((f) => {
          const pct = f.total > 0 ? Math.round((f.paid / f.total) * 100) : 0;
          const label = f.faculty.split(' ').slice(0, 2).join(' ');
          return (
            <div
              key={f.faculty}
              onClick={() => onFacultyClick?.(f.faculty)}
              className={onFacultyClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
            >
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="tabular-nums text-slate-500">
                  {formatMoney(f.paid).replace(" so'm", '')} /{' '}
                  <strong className="text-slate-900">{pct}%</strong>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
