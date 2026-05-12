import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { Upload, Plus, Trash2, Pencil } from 'lucide-react';
import { useCurriculumList, useCreateCurriculum, useUpdateCurriculum, useDeleteCurriculum } from '@/api/hooks/useCurriculum';
import { useSpecialties, useAcademicYears } from '@/api/hooks/useCore';
import { useSubjects } from '@/api/hooks/useEducation';
import { CurriculumForm } from '../components/CurriculumForm';
import type { Curriculum, CurriculumSubject, ControlForm } from '@/types/education';
import type { CreateCurriculumFormData } from '../schemas/curriculum.schema';

const CONTROL_KEYS: Record<ControlForm, string> = {
  exam: 'education.controlExam',
  credit: 'education.controlCredit',
  diff_credit: 'education.controlDiffCredit',
};

const TYPE_BADGE_MAP: Record<string, 'success' | 'info' | 'warning'> = {
  mandatory: 'success',
  elective: 'info',
  practice: 'warning',
};

// --- Component ---

export function CurriculumPage() {
  const { t } = useTranslation();
  const { data: specialties, isLoading: specialtiesLoading } = useSpecialties();
  const { data: academicYears } = useAcademicYears();
  const { data: subjectsData } = useSubjects();
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editCurriculum, setEditCurriculum] = useState<Curriculum | null>(null);
  const [deleteCurriculumItem, setDeleteCurriculumItem] = useState<Curriculum | null>(null);
  const createCurriculum = useCreateCurriculum();
  const updateCurriculumMutation = useUpdateCurriculum();
  const deleteCurriculumMutation = useDeleteCurriculum();

  // Derive year options from academic years API, fallback to static
  const yearOptions = academicYears && academicYears.length > 0
    ? academicYears.map((y) => y.name)
    : ['2024-2025', '2023-2024', '2022-2023'];

  const effectiveYear = selectedYear || yearOptions[0] || '2024-2025';

  const yearNum = effectiveYear ? parseInt(effectiveYear.split('-')[0]!, 10) : undefined;

  const { data: curriculums, isLoading: curriculumLoading } = useCurriculumList({
    specialtyId: selectedSpecialtyId,
    year: yearNum,
  });

  const isLoading = specialtiesLoading || curriculumLoading;

  // Use first specialty as default when loaded
  const effectiveSpecialtyId = selectedSpecialtyId ?? specialties?.[0]?.id;
  const selectedSpecialtyName = specialties?.find((s) => s.id === effectiveSpecialtyId)?.name ?? '';

  // Get curriculum for selected specialty
  const curriculum = curriculums?.find((c) => !selectedSpecialtyId || c.specialtyId === effectiveSpecialtyId) ?? curriculums?.[0];

  // Group subjects by semester
  const semesterGroups = useMemo(() => {
    if (!curriculum) return [];
    const groups = new Map<number, CurriculumSubject[]>();
    curriculum.subjects.forEach((sub) => {
      const existing = groups.get(sub.semester) ?? [];
      existing.push(sub);
      groups.set(sub.semester, existing);
    });
    return Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([semester, subjects]) => ({
        semester,
        course: Math.ceil(semester / 2),
        subjects,
      }));
  }, [curriculum]);

  const totalSubjects = curriculum?.subjects.length ?? 0;
  const mandatoryCount = curriculum?.subjects.filter((s) => !s.isElective).length ?? 0;
  const electiveCount = curriculum?.subjects.filter((s) => s.isElective).length ?? 0;

  return (
    <PageContent>
      <PageHeader
        title={t('education.curriculumTitle')}
        subtitle={`${selectedSpecialtyName || t('education.directions')} yo'nalishi`}
        breadcrumbs={[{ label: t('nav.education') }, { label: t('nav.curriculum') }]}
      />

      {/* Direction and year selectors + buttons */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <select
            value={effectiveSpecialtyId ?? ''}
            onChange={(e) => setSelectedSpecialtyId(Number(e.target.value) || undefined)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            {(specialties ?? []).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={effectiveYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {curriculum && (
            <>
              <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setEditCurriculum(curriculum)}>
                {t('common.edit')}
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5 text-red-500" />} onClick={() => setDeleteCurriculumItem(curriculum)}>
                {t('common.delete')}
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Upload className="h-3.5 w-3.5" />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = `/api/v1/education/curriculum/export/?specialtyId=${effectiveSpecialtyId ?? ''}&year=${selectedYear}`;
              a.download = 'oquv-reja.pdf';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            {t('education.exportPdf')}
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            {t('education.newPlan')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <StatCard label={t('education.directions')} value={specialties?.length ?? 0} sub={t('education.activeLabel')} />
            <StatCard label={t('education.totalCredits')} value={curriculum?.totalCredits ?? 0} sub={t('education.allSemestersLabel')} />
            <StatCard label={t('education.mandatorySubjects')} value={mandatoryCount} sub={totalSubjects > 0 ? `${Math.round((mandatoryCount / totalSubjects) * 100)}% ${t('education.totalOf')}` : '0%'} />
            <StatCard label={t('education.electiveSubjects')} value={electiveCount} sub={totalSubjects > 0 ? `${Math.round((electiveCount / totalSubjects) * 100)}% ${t('education.totalOf')}` : '0%'} />
          </div>

          {/* Semester sections */}
          <div className="space-y-4">
            {semesterGroups.map((sem) => {
              const totalSemCredits = sem.subjects.reduce((a, b) => a + b.credits, 0);
              const totalSemHours = sem.subjects.reduce((a, b) => a + b.hoursLecture + b.hoursPractice + b.hoursLab, 0);

              return (
                <Card key={sem.semester} noPadding>
                  {/* Semester header */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {t('education.courseLabel', { n: sem.course })}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-slate-900">
                        {t('education.semesterLabel', { n: sem.semester })}
                      </h3>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="text-[11px] text-muted">{t('education.creditsLabel')}</p>
                        <p className="text-lg font-bold text-green-700 tabular-nums">{totalSemCredits}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-muted">{t('education.hoursLabel')}</p>
                        <p className="text-lg font-bold text-slate-900 tabular-nums">{totalSemHours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-muted text-left">
                        <th className="border-b border-[#F1F5F9] px-3 py-2">{t('education.subjectName')}</th>
                        <th className="border-b border-[#F1F5F9] px-3 py-2 w-[100px]">{t('education.subjectType')}</th>
                        <th className="border-b border-[#F1F5F9] px-3 py-2 w-[80px] text-right">{t('education.credit')}</th>
                        <th className="border-b border-[#F1F5F9] px-3 py-2 w-[80px] text-right">{t('education.hour')}</th>
                        <th className="border-b border-[#F1F5F9] px-3 py-2 w-[100px]">{t('education.control')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.subjects.map((sub) => {
                        const typeKey = sub.isElective ? 'elective' : 'mandatory';
                        const typeLabel = sub.isElective ? t('education.elective') : t('education.mandatory');
                        const totalHours = sub.hoursLecture + sub.hoursPractice + sub.hoursLab;

                        return (
                          <tr key={sub.id} className="text-[13.5px]">
                            <td className="border-b border-[#F8FAFC] px-3 py-2.5 font-medium text-slate-900">{sub.subjectName}</td>
                            <td className="border-b border-[#F8FAFC] px-3 py-2.5">
                              <Badge variant={TYPE_BADGE_MAP[typeKey] ?? 'success'}>{typeLabel}</Badge>
                            </td>
                            <td className="border-b border-[#F8FAFC] px-3 py-2.5 text-right tabular-nums">{sub.credits}</td>
                            <td className="border-b border-[#F8FAFC] px-3 py-2.5 text-right tabular-nums text-muted">{totalHours}</td>
                            <td className="border-b border-[#F8FAFC] px-3 py-2.5 text-[12.5px] text-slate-600">{t(CONTROL_KEYS[sub.controlForm])}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              );
            })}
          </div>

          {semesterGroups.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-slate-500">{t('education.curriculumNotFound')}</p>
              <p className="mt-1 text-xs text-slate-400">{t('education.tryOtherFilter')}</p>
            </div>
          )}
        </>
      )}
      <ConfirmDialog
        open={!!deleteCurriculumItem}
        onClose={() => setDeleteCurriculumItem(null)}
        onConfirm={() => {
          if (!deleteCurriculumItem) return;
          deleteCurriculumMutation.mutate(deleteCurriculumItem.id, { onSuccess: () => setDeleteCurriculumItem(null) });
        }}
        title={t('education.deleteCurriculumTitle')}
        message={t('education.deleteCurriculumConfirm', { name: deleteCurriculumItem?.specialtyName })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteCurriculumMutation.isPending}
      />
      <CurriculumForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data: CreateCurriculumFormData) => {
          createCurriculum.mutate(
            {
              specialtyId: Number(data.specialtyId),
              year: Number(data.year),
              subjects: data.subjects.map((s) => ({
                subjectId: Number(s.subjectId),
                semester: Number(s.semester),
                credits: Number(s.credits),
                hoursLecture: Number(s.hoursLecture),
                hoursPractice: Number(s.hoursPractice),
                hoursLab: Number(s.hoursLab),
                controlForm: s.controlForm,
                isElective: s.isElective,
              })),
            },
            { onSuccess: () => setFormOpen(false) },
          );
        }}
        specialties={(specialties ?? []).map((s) => ({ id: s.id, name: s.name }))}
        subjects={(subjectsData?.data ?? []).map((s) => ({ id: s.id, name: s.name }))}
        loading={createCurriculum.isPending}
      />

      <CurriculumForm
        open={!!editCurriculum}
        onClose={() => setEditCurriculum(null)}
        onSubmit={(data: CreateCurriculumFormData) => {
          if (!editCurriculum) return;
          updateCurriculumMutation.mutate(
            {
              id: editCurriculum.id,
              data: {
                specialtyId: Number(data.specialtyId),
                year: Number(data.year),
                subjects: data.subjects.map((s) => ({
                  subjectId: Number(s.subjectId),
                  semester: Number(s.semester),
                  credits: Number(s.credits),
                  hoursLecture: Number(s.hoursLecture),
                  hoursPractice: Number(s.hoursPractice),
                  hoursLab: Number(s.hoursLab),
                  controlForm: s.controlForm,
                  isElective: s.isElective,
                })),
              },
            },
            { onSuccess: () => setEditCurriculum(null) },
          );
        }}
        curriculum={editCurriculum}
        specialties={(specialties ?? []).map((s) => ({ id: s.id, name: s.name }))}
        subjects={(subjectsData?.data ?? []).map((s) => ({ id: s.id, name: s.name }))}
        loading={updateCurriculumMutation.isPending}
      />
    </PageContent>
  );
}
