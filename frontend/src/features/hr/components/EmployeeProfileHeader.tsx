import { Pencil, Mail, FileText, Printer } from 'lucide-react';
import { Badge } from '@/components/ui';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import { formatMoney, getInitials, formatDate, formatPhone } from '@/lib/utils';
import type { Employee } from '@/types/hr';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEdit?: () => void;
  onPrint?: () => void;
}

export function EmployeeProfileHeader({ employee, onEdit, onPrint }: EmployeeProfileHeaderProps) {
  const initials = getInitials(employee.fullName);
  const e = employee;
  void formatDate; void formatPhone;

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Gradient banner */}
      <div className="h-[90px] bg-gradient-to-r from-cyan-600 to-cyan-700 relative">
        <div className="absolute top-3 right-4 flex gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/30 bg-white/15 backdrop-blur text-white text-xs font-semibold hover:bg-white/25 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" /> Tahrirlash
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/30 bg-white/15 backdrop-blur text-white text-xs font-semibold hover:bg-white/25 transition-colors">
            <Mail className="h-3.5 w-3.5" /> Xabar
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/30 bg-white/15 backdrop-blur text-white text-xs font-semibold hover:bg-white/25 transition-colors">
            <FileText className="h-3.5 w-3.5" /> Buyruq
          </button>
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/30 bg-white/15 backdrop-blur text-white text-xs font-semibold hover:bg-white/25 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" /> Chop etish
          </button>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-8 pb-6 -mt-9 relative">
        <div className="flex items-end gap-5 flex-wrap">
          {/* Avatar */}
          {e.image ? (
            <img
              src={e.image}
              alt={e.fullName}
              className="h-[92px] w-[92px] rounded-full border-4 border-white shadow-md object-cover"
            />
          ) : (
            <div className="h-[92px] w-[92px] rounded-full bg-gradient-to-br from-cyan-600 to-cyan-700 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
              {initials}
            </div>
          )}

          {/* Name + meta */}
          <div className="flex-1 mb-1.5 min-w-[200px]">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {e.fullName}
              </h2>
              <EmployeeStatusBadge status={e.status} />
              <Badge variant="info">{e.employmentForm.name}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted flex-wrap">
              <span className="font-mono text-xs">{e.employeeIdNumber}</span>
              <span>·</span>
              <span>{e.position.name}</span>
              <span>·</span>
              <span>{e.department.name}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3.5 mt-5">
          {[
            {
              label: "Bo'lim",
              value:
                e.department.name.length > 28
                  ? e.department.name.slice(0, 28) + '...'
                  : e.department.name,
            },
            { label: 'Lavozim', value: e.position.name },
            {
              label: 'Ish staji',
              value: e.experience.years ? `${e.experience.years} yil` : '—',
            },
            { label: 'Maosh', value: formatMoney(e.salary) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-2.5 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="text-[11px] text-muted uppercase tracking-wide font-semibold">
                {stat.label}
              </div>
              <div className="text-sm text-slate-900 mt-1 font-medium">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
