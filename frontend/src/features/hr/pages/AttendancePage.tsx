import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, CalendarX2 } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/overlays';
import { AttendanceCalendar } from '../components/AttendanceCalendar';
import { useAttendance, useDepartments } from '@/api/hooks/useHr';

export function AttendancePage() {
  const { t } = useTranslation();
  const MONTH_NAMES = t('education.months', { returnObjects: true }) as string[];
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [holidayDay, setHolidayDay] = useState('');
  const [holidayApplied, setHolidayApplied] = useState(false);

  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const { data: rows, isLoading } = useAttendance(departmentId);
  const { data: departments } = useDepartments();

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title={t('hr.attendanceTitle')}
        subtitle={`${MONTH_NAMES[month - 1]} ${year}`}
        breadcrumbs={[
          { label: t('nav.hr'), path: '/hr' },
          { label: t('nav.hrAttendance') },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<CalendarX2 className="h-4 w-4" />}
              onClick={() => setHolidayModalOpen(true)}
            >
              {t('hr.holiday')}
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = `/api/v1/hr/attendance/export/?year=${year}&month=${month}`;
                a.download = `davomat-${year}-${month}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              {t('common.exportExcel')}
            </Button>
          </div>
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
          <select
            value={departmentId ?? ''}
            onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">{t('hr.allDepartments')}</option>
            {(departments ?? []).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div className="flex-1" />
          <div className="flex items-center gap-3.5 text-xs">
            {[
              { label: t('hr.legendPresent'), color: 'bg-emerald-500' },
              { label: t('hr.legendAbsent'), color: 'bg-red-500' },
              { label: t('hr.legendSick'), color: 'bg-amber-500' },
              { label: t('hr.legendLeave'), color: 'bg-violet-500' },
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
            {t('hr.attendanceNotFound')}
          </div>
        )}
      </Card>
      <Modal
        open={holidayModalOpen}
        onClose={() => setHolidayModalOpen(false)}
        title={t('hr.setHoliday')}
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setHolidayModalOpen(false)}>{t('common.cancel')}</Button>
            <Button
              disabled={!holidayDay}
              onClick={() => {
                setHolidayApplied(true);
                setHolidayModalOpen(false);
                setHolidayDay('');
              }}
            >
              {t('hr.applyToAllEmployees')}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted">
            {t('hr.holidayDescription')}
          </p>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">{t('common.date')}</label>
            <input
              type="date"
              value={holidayDay}
              onChange={(e) => setHolidayDay(e.target.value)}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
          </div>
          {holidayApplied && (
            <p className="text-xs text-green-600">{t('hr.holidaySetSuccess')}</p>
          )}
        </div>
      </Modal>
    </PageContent>
  );
}
