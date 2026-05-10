import {
  Users,
  CheckCircle,
  AlertTriangle,
  X,
  FileDown,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContent } from '@/components/layout/PageContent';
import { StatCard } from '@/components/data-display/StatCard';
import { Card } from '@/components/data-display/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useStudentStatistics } from '@/api/hooks/useStudents';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from 'react-i18next';

const GENDER_COLORS: Record<string, string> = {
  Erkak: '#0EA5E9',
  Ayol: '#EC4899',
};

const EDUCATION_FORM_COLORS: Record<string, string> = {
  Kunduzgi: '#10B981',
  Sirtqi: '#8B5CF6',
  Kechki: '#F59E0B',
};

const PAYMENT_FORM_COLORS: Record<string, string> = {
  'Davlat granti': '#2DB976',
  "To'lov-shartnoma": '#F59E0B',
};

function ProgressBar({ label, value, max, color = '#4F46E5' }: { label: string; value: number; max: number; color?: string }) {
  return (
    <div className="mb-3.5">
      <div className="flex justify-between text-[13px] mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-2 w-full rounded bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function StudentsStatPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((s) => s.currentUser);
  const role = currentUser?.role;
  const { data: stats, isLoading } = useStudentStatistics();

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const activeCount = stats.byStatus.find((s) => s.status === "O'qimoqda")?.count ?? 0;
  const leaveCount = stats.byStatus.find((s) => s.status === "Akademik ta'tilda")?.count ?? 0;
  const expelledCount = stats.byStatus.find((s) => s.status === 'Chetlatilgan')?.count ?? 0;

  const courseMax = Math.max(...stats.byCourse.map((c) => c.count), 1);
  const genderMax = Math.max(...stats.byGender.map((g) => g.count), 1);
  const eduFormMax = Math.max(...stats.byEducationForm.map((f) => f.count), 1);
  const paymentMax = Math.max(...stats.byPaymentForm.map((p) => p.count), 1);
  const facultyMax = Math.max(...stats.byFaculty.map((f) => f.count), 1);

  return (
    <PageContent className="space-y-6">
      <PageHeader
        title={t('students.statistics')}
        subtitle={role === 'dekan' ? (currentUser?.facultyName ?? '') : t('students.universityWide')}
        actions={
          <Button
            variant="secondary"
            leftIcon={<FileDown className="h-4 w-4" />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = '/api/v1/students/export-pdf/';
              a.download = 'talabalar-statistika.pdf';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            PDF
          </Button>
        }
      />

      {/* 2×2 StatCards grid — matching prototype */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label={t('dashboard.totalStudents')}
          value={stats.totalStudents}
          icon={<Users className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          trend={{ value: 24, raw: '+24' }}
        />
        <StatCard
          label={t('students.activeLearning')}
          value={activeCount}
          icon={<CheckCircle className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
          trend={{
            value: stats.totalStudents > 0 ? Math.round((activeCount / stats.totalStudents) * 100) : 0,
            raw: `${stats.totalStudents > 0 ? Math.round((activeCount / stats.totalStudents) * 100) : 0}%`,
          }}
        />
        <StatCard
          label={t('students.academicLeave')}
          value={leaveCount}
          icon={<AlertTriangle className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label={t('students.expelled')}
          value={expelledCount}
          icon={<X className="h-[18px] w-[18px]" />}
          iconBg="#EF4444"
        />
      </div>

      {/* Charts 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4.5">{t('students.byCourse')}</h3>
          {stats.byCourse.map((c) => (
            <ProgressBar key={c.course} label={`${c.course}-kurs`} value={c.count} max={courseMax} color="#4F46E5" />
          ))}
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4.5">{t('students.byGender')}</h3>
          {stats.byGender.map((g) => (
            <ProgressBar key={g.gender} label={g.gender} value={g.count} max={genderMax} color={GENDER_COLORS[g.gender] ?? '#94A3B8'} />
          ))}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-3.5">{t('students.educationForm')}</h4>
            {stats.byEducationForm.map((f) => (
              <ProgressBar key={f.form} label={f.form} value={f.count} max={eduFormMax} color={EDUCATION_FORM_COLORS[f.form] ?? '#94A3B8'} />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4.5">{t('students.byPaymentForm')}</h3>
          {stats.byPaymentForm.map((p) => (
            <ProgressBar key={p.form} label={p.form} value={p.count} max={paymentMax} color={PAYMENT_FORM_COLORS[p.form] ?? '#94A3B8'} />
          ))}
        </Card>

        {role !== 'dekan' && (
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4.5">{t('students.byFaculty')}</h3>
            {stats.byFaculty.slice(0, 8).map((f) => (
              <ProgressBar key={f.faculty} label={f.faculty.length > 36 ? f.faculty.slice(0, 36) + '…' : f.faculty} value={f.count} max={facultyMax} color="#8B5CF6" />
            ))}
          </Card>
        )}
      </div>
    </PageContent>
  );
}
