import { useState, useCallback, useMemo } from 'react';
import { Check, FileDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Button, Avatar, Spinner } from '@/components/ui';
import { useSubjects, useGrades, useBulkGrades } from '@/api/hooks/useEducation';
import { useGroups } from '@/api/hooks/useCore';
import type { Grade } from '@/types/education';

// --- Types ---

interface GradeInputs {
  a1: number;
  a2: number;
  mid: number;
  final: number;
}

type GradeKey = keyof GradeInputs;

const GRADE_KEYS: GradeKey[] = ['a1', 'a2', 'mid', 'final'];
const WEIGHTS: Record<GradeKey, number> = { a1: 0.1, a2: 0.1, mid: 0.3, final: 0.5 };

function calcTotal(g: GradeInputs): number {
  return GRADE_KEYS.reduce((sum, k) => sum + g[k] * WEIGHTS[k], 0);
}

function gradeColor(value: number): string {
  return value >= 55 ? 'text-slate-800' : 'text-red-700';
}

// Build initial grades from API grade data
function initGradesFromData(grades: Grade[]): { students: { id: number; name: string }[]; gradeMap: Record<number, GradeInputs> } {
  const studentMap = new Map<number, { name: string; scores: Partial<Record<string, number>> }>();

  grades.forEach((g) => {
    const existing = studentMap.get(g.studentId) ?? { name: g.studentName ?? `Talaba #${g.studentId}`, scores: {} };
    // Map gradeType to our keys
    if (g.gradeType === 'midterm') {
      existing.scores['mid'] = g.score;
    } else if (g.gradeType === 'final') {
      existing.scores['final'] = g.score;
    } else if (g.gradeType === 'coursework') {
      existing.scores['a1'] = g.score;
    }
    studentMap.set(g.studentId, existing);
  });

  const students: { id: number; name: string }[] = [];
  const gradeMap: Record<number, GradeInputs> = {};

  studentMap.forEach((value, studentId) => {
    students.push({ id: studentId, name: value.name });
    gradeMap[studentId] = {
      a1: value.scores['a1'] ?? 70,
      a2: value.scores['a2'] ?? 70,
      mid: value.scores['mid'] ?? 70,
      final: value.scores['final'] ?? 70,
    };
  });

  return { students, gradeMap };
}

export function GradingPage() {
  const { t } = useTranslation();

  const GRADE_LABELS: Record<GradeKey, string> = {
    a1: t('education.gradeA1'),
    a2: t('education.gradeA2'),
    mid: t('education.gradeMid'),
    final: t('education.gradeFinal'),
  };

  const getLetterGrade = (total: number): { label: string; variant: 'success' | 'info' | 'warning' | 'error' } => {
    if (total >= 86) return { label: t('education.gradeLabelExcellent'), variant: 'success' };
    if (total >= 71) return { label: t('education.gradeLabelGood'), variant: 'info' };
    if (total >= 55) return { label: t('education.gradeLabelSatisfactory'), variant: 'warning' };
    return { label: t('education.gradeLabelUnsatisfactory'), variant: 'error' };
  };

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');

  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects();
  const { data: gradesData, isLoading: gradesLoading } = useGrades({
    subjectId: selectedSubjectId ? Number(selectedSubjectId) : undefined,
    semesterId: selectedSemesterId ? Number(selectedSemesterId) : undefined,
  });
  const { data: groupsData, isLoading: groupsLoading } = useGroups();

  const subjects = subjectsData?.data ?? [];
  const apiGrades = gradesData?.data ?? [];
  const groups = groupsData ?? [];

  const isLoading = subjectsLoading || gradesLoading || groupsLoading;

  const { students, gradeMap: initialGradeMap } = useMemo(
    () => initGradesFromData(apiGrades),
    [apiGrades],
  );

  const [grades, setGrades] = useState<Record<number, GradeInputs>>({});

  // Merge initial grades with edited grades
  const effectiveGrades = useMemo(() => {
    const result: Record<number, GradeInputs> = { ...initialGradeMap };
    for (const [key, value] of Object.entries(grades)) {
      result[Number(key)] = value;
    }
    return result;
  }, [initialGradeMap, grades]);

  const handleUpdate = useCallback((studentId: number, key: GradeKey, rawValue: string) => {
    const num = Math.max(0, Math.min(100, Number(rawValue) || 0));
    setGrades((prev) => {
      const existing = prev[studentId] ?? initialGradeMap[studentId] ?? { a1: 0, a2: 0, mid: 0, final: 0 };
      return {
        ...prev,
        [studentId]: { ...existing, [key]: num },
      };
    });
  }, [initialGradeMap]);

  const totals = useMemo(() => {
    const result: Record<number, number> = {};
    students.forEach((s) => {
      const g = effectiveGrades[s.id];
      if (g) result[s.id] = calcTotal(g);
    });
    return result;
  }, [effectiveGrades, students]);

  const bulkGrades = useBulkGrades();

  const GRADE_TYPE_MAP: Record<GradeKey, 'coursework' | 'midterm' | 'final'> = {
    a1: 'coursework',
    a2: 'coursework',
    mid: 'midterm',
    final: 'final',
  };

  const handleSave = async () => {
    const subjectId = Number(selectedSubjectId) || 1;
    const semesterId = 1;

    const gradeTypeSets = (['a1', 'a2', 'mid', 'final'] as GradeKey[]).filter(
      (k, idx, arr) => arr.indexOf(k) === idx,
    );

    await Promise.all(
      gradeTypeSets.map((k) =>
        bulkGrades.mutateAsync({
          subjectId,
          semesterId,
          gradeType: GRADE_TYPE_MAP[k],
          maxScore: '100',
          records: students.map((s) => ({
            studentId: s.id,
            score: String(effectiveGrades[s.id]?.[k] ?? 0),
          })),
        }),
      ),
    );
    setGrades({});
  };

  if (isLoading) {
    return (
      <PageContent>
        <PageHeader
          title={t('education.gradingTitle')}
          subtitle={t('education.gradingSubtitle')}
          breadcrumbs={[
            { label: t('nav.education'), path: '/grading' },
            { label: t('education.gradingTitle') },
          ]}
        />
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title={t('education.gradingTitle')}
        subtitle={t('education.gradingSubtitle')}
        breadcrumbs={[
          { label: t('nav.education'), path: '/grading' },
          { label: t('education.gradingTitle') },
        ]}
        actions={
          <Button
            variant="secondary"
            leftIcon={<FileDown className="h-4 w-4" />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = `/api/v1/education/grading/export/?groupId=${selectedGroupId}&subjectId=${selectedSubjectId}`;
              a.download = 'vedomost.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Excel
          </Button>
        }
      />

      {/* Filters toolbar */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted">{t('students.group')}</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="h-9 min-w-[140px] rounded-lg border border-border px-3 text-sm"
            >
              <option value="">{t('education.allGroups')}</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted">{t('education.subject')}</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="h-9 min-w-[180px] rounded-lg border border-border px-3 text-sm"
            >
              <option value="">{t('education.allSubjects')}</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted">{t('education.semester')}</label>
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="h-9 rounded-lg border border-border px-3 text-sm"
            >
              <option value="">{t('education.allSemesters')}</option>
              <option value="1">2025-2026 - 2-semester</option>
              <option value="2">2025-2026 - 1-semester</option>
              <option value="3">2024-2025 - 2-semester</option>
            </select>
          </div>
          <div className="flex-1" />
          <div className="text-xs text-muted">
            {t('education.weightNote')}
          </div>
          <Button
            size="sm"
            leftIcon={<Check className="h-4 w-4" />}
            onClick={() => void handleSave()}
            loading={bulkGrades.isPending}
          >
            {t('common.save')}
          </Button>
        </div>
      </Card>

      {/* Grading table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFB]">
                <th className="px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
                  {t('education.student')}
                </th>
                {GRADE_KEYS.map((k) => (
                  <th
                    key={k}
                    className="px-2 py-2.5 text-center text-[11px] font-semibold text-muted"
                  >
                    {GRADE_LABELS[k]}
                  </th>
                ))}
                <th className="px-3.5 py-2.5 text-center text-[11px] font-semibold text-muted">
                  {t('education.total')}
                </th>
                <th className="px-3.5 py-2.5 text-center text-[11px] font-semibold text-muted">
                  {t('education.letterGrade')}
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={GRADE_KEYS.length + 3} className="px-3.5 py-8 text-center text-sm text-slate-500">
                    {t('education.gradesNotFound')}
                  </td>
                </tr>
              )}
              {students.map((s) => {
                const g = effectiveGrades[s.id];
                if (!g) return null;
                const total = totals[s.id] ?? 0;
                const letterGrade = getLetterGrade(total);

                return (
                  <tr key={s.id} className="border-t border-[#F1F5F9]">
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name ?? 'N/A'} size="sm" />
                        <div className="text-[13px] font-medium text-slate-900">
                          {s.name ?? 'Talaba'}
                        </div>
                      </div>
                    </td>
                    {GRADE_KEYS.map((k) => (
                      <td key={k} className="px-2 py-1.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g[k]}
                          onChange={(e) => handleUpdate(s.id, k, e.target.value)}
                          className={`w-[60px] rounded-md border border-slate-200 py-1.5 text-center text-[13px] font-semibold tabular-nums outline-none transition-colors focus:border-primary-400 focus:ring-1 focus:ring-primary-400 ${gradeColor(g[k])}`}
                        />
                      </td>
                    ))}
                    <td className="px-3.5 py-2.5 text-center text-[15px] font-bold tabular-nums text-slate-900">
                      {total.toFixed(1)}
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      <Badge variant={letterGrade.variant}>{letterGrade.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContent>
  );
}
