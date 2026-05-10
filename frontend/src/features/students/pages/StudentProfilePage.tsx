import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  FileText,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContent } from '@/components/layout/PageContent';
import { Card } from '@/components/data-display/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/navigation/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { StudentStatusBadge } from '../components/StudentStatusBadge';
import {
  useStudent,
  useStudentGrades,
  useStudentAttendance,
} from '@/api/hooks/useStudents';
import { useContracts } from '@/api/hooks/useFinance';
import { formatMoney } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { useStudentDocuments } from '@/api/hooks/useStudents';
import type { StudentGrade, StudentAttendance, StudentDocument } from '@/types/student';

// ---------- Detail row ----------
function DetailRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right max-w-[60%]">
        {value || '—'}
      </span>
    </div>
  );
}

// ---------- Grade mark ----------
function gradeLabel(score: number): { text: string; variant: 'success' | 'info' | 'warning' | 'error' } {
  if (score >= 86) return { text: "A'lo", variant: 'success' };
  if (score >= 71) return { text: 'Yaxshi', variant: 'info' };
  if (score >= 55) return { text: 'Qoniqarli', variant: 'warning' };
  return { text: 'Qoniqarsiz', variant: 'error' };
}

// ---------- Grades tab ----------
function GradesTab({ grades }: { grades: StudentGrade[] }) {
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const finals = grades.filter((g) => g.gradeType === 'final');
  const midterms = grades.filter((g) => g.gradeType === 'midterm');
  const maxSemester = Math.max(...grades.map((g) => g.semester), 1);
  const semester = selectedSemester ?? maxSemester;

  const currentGrades = finals.filter((g) => g.semester === semester);
  const currentMidterms = midterms.filter((g) => g.semester === semester);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-900">
          Baholar ({semester}-semestr)
        </h4>
        <select
          value={semester}
          onChange={(e) => setSelectedSemester(Number(e.target.value))}
          className="h-8 px-2 rounded-md border border-border text-sm"
        >
          {Array.from({ length: maxSemester }, (_, i) => i + 1).map((s) => (
            <option key={s} value={s}>{s}-semestr</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              {['Fan', "O'qituvchi", 'JN1', 'JN2', 'YN', 'Jami', 'Baho'].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentGrades.map((g) => {
              const mid = currentMidterms.find(
                (m) => m.subjectName === g.subjectName,
              );
              const jn1 = mid?.score ?? 0;
              const jn2 = Math.round(jn1 * 0.9);
              const yn = g.score;
              const total = Math.round(jn1 * 0.3 + jn2 * 0.3 + yn * 0.4);
              const mark = gradeLabel(total);
              return (
                <tr key={g.id}>
                  <td className="px-3 py-3 font-medium text-slate-900">{g.subjectName}</td>
                  <td className="px-3 py-3 text-slate-600">{g.teacherName}</td>
                  <td className="px-3 py-3 font-semibold tabular-nums">{jn1 || '—'}</td>
                  <td className="px-3 py-3 font-semibold tabular-nums">{jn2 || '—'}</td>
                  <td className="px-3 py-3 font-semibold tabular-nums">{yn}</td>
                  <td className="px-3 py-3 font-bold tabular-nums">{total}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${mark.variant}`}>
                      {mark.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {currentGrades.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">
          Bu semestr uchun baholar topilmadi
        </p>
      )}
    </div>
  );
}

// ---------- Attendance tab ----------
function AttendanceTab({ attendance }: { attendance: StudentAttendance[] }) {
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === 'present').length;
  const absent = attendance.filter((a) => a.status === 'absent').length;
  const late = attendance.filter((a) => a.status === 'late').length;
  const excused = attendance.filter((a) => a.status === 'excused').length;

  const stats = [
    { label: 'Umumiy darslar', value: total, color: 'text-slate-900' },
    { label: 'Qatnashilgan', value: present, color: 'text-green-700' },
    { label: 'Kechikkan', value: late, color: 'text-amber-700' },
    { label: 'Sababli qoldirilgan', value: excused, color: 'text-blue-700' },
    { label: 'Sababsiz qoldirilgan', value: absent, color: 'text-red-700' },
  ];

  const statusColors: Record<StudentAttendance['status'], string> = {
    present: 'bg-green-500',
    absent: 'bg-red-500',
    late: 'bg-amber-500',
    excused: 'bg-blue-500',
  };

  // Recent absences
  const recentAbsences = attendance
    .filter((a) => a.status === 'absent' || a.status === 'late')
    .slice(-10)
    .reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xs text-muted">{s.label}</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${s.color}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">
          Davomat xaritasi (oxirgi 80 kun)
        </h4>
        <div className="flex flex-wrap gap-1">
          {attendance.slice(-80).map((a, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-sm ${statusColors[a.status]}`}
              title={`${a.date}: ${a.subjectName} - ${a.status}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-green-500" /> Qatnashdi
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> Kelmadi
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Kechikdi
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Sababli
          </span>
        </div>
      </div>

      {recentAbsences.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">
            Oxirgi qoldirilgan darslar
          </h4>
          <div className="space-y-2">
            {recentAbsences.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg text-sm"
              >
                <span
                  className={`h-2 w-2 rounded-full ${statusColors[a.status]}`}
                />
                <span className="text-muted tabular-nums w-24">
                  {a.date}
                </span>
                <span className="font-medium text-slate-900">
                  {a.subjectName}
                </span>
                <span className="text-muted">
                  {a.status === 'absent' ? 'Sababsiz' : 'Kechikdi'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Contracts tab ----------
function ContractsTab({ studentId }: { studentId: number }) {
  const { data, isLoading } = useContracts({ studentId, page: 1, pageSize: 10 });
  const contracts = data?.data ?? [];

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-muted">Yuklanmoqda...</div>;
  }

  if (contracts.length === 0) {
    return <div className="py-8 text-center text-sm text-muted">Kontraktlar topilmadi</div>;
  }

  return (
    <div className="space-y-3">
      {contracts.map((c) => {
        const paidAmount = c.paymentSchedule?.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0) ?? 0;
        const debtAmount = c.contractAmount - paidAmount;
        const paidPct = c.contractAmount > 0 ? Math.round((paidAmount / c.contractAmount) * 100) : 0;
        return (
          <div key={c.id} className="p-4 bg-slate-50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">{c.contractNumber}</span>
              <span className="text-xs text-muted">{c.educationYear}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Yillik summa</span>
              <span className="font-semibold tabular-nums">{formatMoney(c.contractAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">To&apos;langan</span>
              <span className="font-semibold text-green-700 tabular-nums">{formatMoney(paidAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Qoldiq</span>
              <span className={`font-semibold tabular-nums ${debtAmount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatMoney(debtAmount)}
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${paidPct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Main component ----------
export function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = Number(id);
  const [activeTab, setActiveTab] = useState('main');

  const { data: student, isLoading } = useStudent(studentId);
  const { data: grades } = useStudentGrades(studentId);
  const { data: attendance } = useStudentAttendance(studentId);

  const tabs = useMemo(
    () => [
      { id: 'main', label: "Asosiy ma'lumotlar" },
      { id: 'grades', label: "O'zlashtirish", count: grades?.length },
      { id: 'attendance', label: 'Davomat' },
      { id: 'contracts', label: 'Kontrakt' },
      { id: 'docs', label: 'Hujjatlar' },
    ],
    [grades?.length],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center text-muted">Talaba topilmadi</div>
    );
  }

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Talabalar', path: '/students' },
          { label: student.shortName },
        ]}
        actions={
          <button
            onClick={() => navigate('/students')}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </button>
        }
      />

      {/* Profile hero card */}
      <Card noPadding>
        <div className="h-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-lg relative">
          <div className="absolute top-3 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
              onClick={() => navigate(`/students/${student.id}/edit`)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Tahrirlash
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileText className="h-3.5 w-3.5" />}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Ma&apos;lumotnoma
            </Button>
          </div>
        </div>
        <div className="px-6 pb-6 -mt-8 relative">
          <div className="flex items-end gap-5 flex-wrap">
            <Avatar
              src={student.image}
              name={student.fullName}
              size="lg"
              className="h-20 w-20 text-2xl border-4 border-white shadow-md"
            />
            <div className="flex-1 mb-1 min-w-[200px]">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">
                  {student.fullName}
                </h2>
                <StudentStatusBadge status={student.status} />
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    student.paymentForm.code === 'grant'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {student.paymentForm.code === 'grant'
                    ? 'Grant'
                    : 'Kontrakt'}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted flex items-center gap-3 flex-wrap">
                <span className="font-mono">{student.studentIdNumber}</span>
                <span>&middot;</span>
                <span>{student.faculty.name}</span>
                <span>&middot;</span>
                <span>{student.group.name}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Fakultet', value: student.faculty.name },
              { label: 'Guruh', value: student.group.name },
              { label: 'Kurs', value: `${student.course}-kurs` },
              {
                label: "O'rtacha baho",
                value: `${(Number(student.avgGrade) || 0).toFixed(1)} ball`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="text-[11px] font-semibold text-muted uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-medium text-slate-900">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs content */}
      <Card noPadding>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="px-2"
        />
        <div className="p-6">
          {activeTab === 'main' && (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Shaxsiy ma&apos;lumotlar
                </h4>
                <DetailRow label="F.I.Sh." value={student.fullName} />
                <DetailRow label="Jinsi" value={student.gender.name} />
                <DetailRow
                  label="Tug'ilgan sana"
                  value={formatDate(student.birthDate)}
                />
                <DetailRow label="Pasport" value={student.passport} />
                <DetailRow label="JSHSHIR" value={student.pinfl} />
                <DetailRow label="Telefon" value={student.phone} />
                <DetailRow label="Email" value={student.email} />
                <DetailRow label="Manzil" value={student.address} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  O&apos;quv ma&apos;lumotlari
                </h4>
                <DetailRow label="Fakultet" value={student.faculty.name} />
                <DetailRow
                  label="Mutaxassislik"
                  value={student.specialty.name}
                />
                <DetailRow label="Kafedra" value={student.department.name} />
                <DetailRow label="Guruh" value={student.group.name} />
                <DetailRow label="Kurs" value={`${student.course}-kurs`} />
                <DetailRow
                  label="Ta'lim shakli"
                  value={student.educationForm.name}
                />
                <DetailRow
                  label="To'lov shakli"
                  value={student.paymentForm.name}
                />
                <DetailRow
                  label="O'rtacha baho"
                  value={`${(Number(student.avgGrade) || 0).toFixed(1)} ball`}
                />
              </div>
            </div>
          )}

          {activeTab === 'grades' && grades && <GradesTab grades={grades} />}
          {activeTab === 'grades' && !grades && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {activeTab === 'attendance' && attendance && (
            <AttendanceTab attendance={attendance} />
          )}
          {activeTab === 'attendance' && !attendance && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {activeTab === 'contracts' && <ContractsTab studentId={studentId} />}
          {activeTab === 'docs' && <StudentDocsTab studentId={studentId} />}
        </div>
      </Card>
    </PageContent>
  );
}

function StudentDocsTab({ studentId }: { studentId: number }) {
  const { data: documents, isLoading } = useStudentDocuments(studentId);
  const docs: StudentDocument[] = documents ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 border border-slate-100 rounded-xl text-center animate-pulse">
            <div className="w-10 h-10 rounded-[10px] bg-slate-100 mx-auto mb-2.5" />
            <div className="h-3 bg-slate-100 rounded mx-auto w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {docs.map((d) => (
        <div
          key={d.id}
          className="p-4 border border-slate-100 rounded-xl cursor-pointer text-center hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-[10px] bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
            <FileText className="h-[18px] w-[18px]" />
          </div>
          <p className="text-[13px] font-medium text-slate-900">{d.name}</p>
          <p className="text-[11px] text-slate-400 mt-1">{d.uploadedAt}</p>
        </div>
      ))}
    </div>
  );
}
