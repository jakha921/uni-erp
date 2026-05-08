import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

type Preset = 'today' | 'week' | 'month' | 'quarter' | 'year';

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  presets?: boolean;
  className?: string;
}

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'today', label: 'Bugun' },
  { key: 'week', label: 'Hafta' },
  { key: 'month', label: 'Oy' },
  { key: 'quarter', label: 'Chorak' },
  { key: 'year', label: 'Yil' },
];

function getPresetRange(preset: Preset): [string, string] {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const to = fmt(now);

  switch (preset) {
    case 'today':
      return [to, to];
    case 'week': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return [fmt(d), to];
    }
    case 'month': {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      return [fmt(d), to];
    }
    case 'quarter': {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 3);
      return [fmt(d), to];
    }
    case 'year': {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return [fmt(d), to];
    }
  }
}

export function DateRangePicker({
  from,
  to,
  onChange,
  presets = true,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4 text-muted" />
        <input
          type="date"
          value={from}
          onChange={(e) => onChange(e.target.value, to)}
          className="h-9 px-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
        <span className="text-sm text-muted">—</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onChange(from, e.target.value)}
          className="h-9 px-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>
      {presets && (
        <div className="flex gap-1">
          {PRESETS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                const [f, t] = getPresetRange(key);
                onChange(f, t);
              }}
              className="px-2 py-1 text-xs rounded-md border border-border text-muted hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
