import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, BookOpen, Clock, Users } from 'lucide-react';
import { PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Avatar, Spinner } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { useTeacher } from '@/api/hooks/useTeachers';

const EMPLOYMENT_LABELS: Record<string, string> = {
  shtatliy: 'Shtatli',
  sovmestitel: 'Sovmestitel',
  soatbay: 'Soatbay',
};

const TABS_CONFIG = [
  { id: 'info', label: "Asosiy ma'lumotlar" },
  { id: 'schedule', label: 'Dars jadvali' },
  { id: 'load', label: 'Yuklanma' },
  { id: 'publications', label: 'Nashrlar' },
];

export function TeacherProfilePage() {
  const { id } = useParams<{ id: string }>();
  const teacherId = Number(id);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  const { data: teacher, isLoading } = useTeacher(teacherId);

  if (isLoading || !teacher) {
    return (
      <PageContent>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </PageContent>
    );
  }

  const statusVariant = teacher.status === 'active' ? 'success' : teacher.status === 'leave' ? 'warning' : 'error';
  const statusLabel = teacher.status === 'active' ? 'Faol' : teacher.status === 'leave' ? "Ta'tilda" : 'Nofaol';
  const loadPct = teacher.maxLoadHours > 0 ? Math.round((teacher.loadHours / teacher.maxLoadHours) * 100) : 0;

  return (
    <PageContent>
      <button
        onClick={() => navigate('/teachers')}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-slate-700 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </button>

      {/* Profile header */}
      <Card className="mb-6">
        <div className="p-6 flex flex-wrap items-start gap-5">
          <Avatar name={teacher.fullName} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{teacher.fullName}</h1>
              <Badge variant={statusVariant} dot>{statusLabel}</Badge>
            </div>
            <p className="text-sm text-muted mb-2">{teacher.position} · {teacher.department}</p>
            <div className="flex flex-wrap gap-2">
              {teacher.academicDegree && <Badge variant="info">{teacher.academicDegree}</Badge>}
              {teacher.academicRank && <Badge variant="warning">{teacher.academicRank}</Badge>}
              <Badge variant="success">{EMPLOYMENT_LABELS[teacher.employmentForm] ?? teacher.employmentForm}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
              {teacher.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />{teacher.phone}
                </span>
              )}
              {teacher.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />{teacher.email}
                </span>
              )}
            </div>
          </div>
          {/* Load mini stat */}
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400 mb-1">Yuklanma</p>
            <p className="text-2xl font-bold text-slate-900">{teacher.loadHours}<span className="text-base font-normal text-muted">/{teacher.maxLoadHours}</span></p>
            <p className="text-xs text-muted">soat</p>
            <div className="mt-2 h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, loadPct)}%`,
                  backgroundColor: loadPct > 90 ? '#EF4444' : loadPct > 70 ? '#F59E0B' : '#2DB976',
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Tabs tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'info' && <InfoTab teacher={teacher} />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'load' && <LoadTab teacher={teacher} />}
        {activeTab === 'publications' && <PublicationsTab />}
      </div>
    </PageContent>
  );
}

function InfoTab({ teacher }: { teacher: ReturnType<typeof useTeacher>['data'] }) {
  if (!teacher) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Umumiy ma'lumotlar">
        <dl className="space-y-3">
          {[
            { label: 'To\'liq ismi', value: teacher.fullName },
            { label: 'Kafedra', value: teacher.department },
            { label: 'Lavozim', value: teacher.position },
            { label: 'Ilmiy daraja', value: teacher.academicDegree || '—' },
            { label: 'Ilmiy unvon', value: teacher.academicRank || '—' },
            { label: 'Ish shakli', value: EMPLOYMENT_LABELS[teacher.employmentForm] ?? teacher.employmentForm },
          ].map((f) => (
            <div key={f.label} className="flex items-start justify-between">
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="text-sm font-medium text-slate-900 text-right max-w-[60%]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <Card title="Fanlar">
        <div className="space-y-2">
          {teacher.subjects.length === 0 ? (
            <p className="text-sm text-slate-400">Fanlar topilmadi</p>
          ) : (
            teacher.subjects.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <BookOpen className="h-4 w-4 text-primary-500 shrink-0" />
                <span className="text-[13px] text-slate-900">{s}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function ScheduleTab() {
  const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];
  const hours = ["8:00–9:30", "9:45–11:15", "11:30–13:00", "14:00–15:30", "15:45–17:15"];
  return (
    <Card title="Haftalik dars jadvali" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">Vaqt</th>
              {days.map((d) => (
                <th key={d} className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h} className="border-b border-slate-50">
                <td className="px-4 py-3 text-[12px] font-medium text-slate-500 whitespace-nowrap">{h}</td>
                {days.map((d) => (
                  <td key={d} className="px-2 py-2 text-center">
                    <span className="text-[11px] text-slate-300">—</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function LoadTab({ teacher }: { teacher: ReturnType<typeof useTeacher>['data'] }) {
  if (!teacher) return null;
  const loadPct = teacher.maxLoadHours > 0 ? Math.round((teacher.loadHours / teacher.maxLoadHours) * 100) : 0;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Yuklanma holati">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-medium text-slate-900">Joriy yuklanma</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{teacher.loadHours}/{teacher.maxLoadHours} soat</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, loadPct)}%`,
                backgroundColor: loadPct > 90 ? '#EF4444' : loadPct > 70 ? '#F59E0B' : '#2DB976',
              }}
            />
          </div>
          <p className="text-sm text-muted text-right">{loadPct}% band</p>
        </div>
      </Card>
      <Card title="Guruhlar">
        <div className="flex items-center gap-2 text-muted">
          <Users className="h-4 w-4" />
          <span className="text-sm">Guruhlar ma'lumotlari yuklanmoqda...</span>
        </div>
      </Card>
    </div>
  );
}

function PublicationsTab() {
  return (
    <Card>
      <p className="text-sm text-slate-400 text-center py-8">Nashrlar ma&apos;lumotlari mavjud emas</p>
    </Card>
  );
}
