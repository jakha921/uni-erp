import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Users, Star, Clock } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Avatar, Spinner } from '@/components/ui';
import { useTeacherCabinet } from '@/api/hooks/useCabinet';
import { useStudentsList } from '@/api/hooks/useStudents';

function getAttendanceColor(v: number) {
  if (v >= 90) return 'text-emerald-600';
  if (v >= 75) return 'text-amber-600';
  return 'text-red-600';
}

export function MyStudentsPage() {
  const { t } = useTranslation();
  const { data: cabinet, isLoading: cabinetLoading } = useTeacherCabinet();
  const groups = cabinet?.myGroups ?? [];

  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [search, setSearch] = useState('');

  const activeGroup = groups[activeGroupIdx];

  const debouncedSearch = useDebounce(search);
  const { data: studentsData, isLoading: studentsLoading } = useStudentsList({
    page: 1, pageSize: 50, search: debouncedSearch || undefined,
  });

  const students = useMemo(() => {
    const list = studentsData?.data ?? [];
    if (!activeGroup) return list;
    return list.filter((s) => s.group.name === activeGroup.groupName);
  }, [studentsData, activeGroup]);

  const totalStudents = groups.reduce((s, g) => s + g.studentCount, 0);

  if (cabinetLoading) {
    return <PageContent><div className="flex justify-center py-20"><Spinner size="lg" /></div></PageContent>;
  }

  return (
    <PageContent>
      <PageHeader title={t('education.myStudentsTitle')} subtitle={t('education.myStudentsSubtitle')}
        breadcrumbs={[{ label: t('nav.education') }, { label: t('nav.myStudents') }]} />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label={t('education.totalStudentsLabel')} value={String(totalStudents)} icon={<Users className="h-5 w-5" />} />
        <StatCard label={t('education.groupsLabel')} value={String(groups.length)} icon={<Clock className="h-5 w-5" />} />
        <StatCard label={t('education.studentsLabel')} value={String(students.length)} icon={<Star className="h-5 w-5" />} />
      </div>

      <Card title="" className="overflow-hidden">
        <div className="border-b border-border px-4 flex items-center gap-2">
          {groups.map((g, idx) => (
            <button key={g.groupName} onClick={() => { setActiveGroupIdx(idx); setSearch(''); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeGroupIdx === idx ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}>
              {g.groupName}
              <span className="ml-2 text-xs text-slate-400">({g.studentCount})</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('education.searchStudentPlaceholder')}
              className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          </div>
          {activeGroup && <p className="text-xs text-slate-500 mt-1">{t('education.subjectInfo', { subject: activeGroup.subjectName, count: activeGroup.studentCount })}</p>}
        </div>

        {studentsLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{t('education.studentColumn')}</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{t('education.groupColumn')}</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{t('education.avgGradeColumn')}</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{t('education.statusColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st, i) => (
                <tr key={st.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={st.fullName} size="sm" src={st.image ?? undefined} />
                      <span className="text-[13px] font-medium text-slate-900">{st.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-[13px] text-slate-600">{st.group.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[13px] font-semibold ${getAttendanceColor(st.avgGrade)}`}>{st.avgGrade}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      st.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {st.status === 'active' ? t('education.statusStudying') : st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!studentsLoading && students.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">{t('education.studentNotFound')}</div>
        )}
      </Card>
    </PageContent>
  );
}
