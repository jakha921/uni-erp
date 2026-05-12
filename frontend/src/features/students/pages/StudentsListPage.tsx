import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Download, X, FileDown } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContent } from '@/components/layout/PageContent';
import { Card } from '@/components/data-display/Card';
import { Pagination } from '@/components/table/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/overlays';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { StudentTable } from '../components/StudentTable';
import { useStudentsList, useDeleteStudent } from '@/api/hooks/useStudents';
import { useFaculties } from '@/api/hooks/useCore';
import { useAuthStore } from '@/stores/auth.store';
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { AlertBanner } from '@/components/ui';
import type { StudentStatus, StudentListParams, StudentListItem } from '@/types/student';

export function StudentsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.currentUser?.role);

  const [search, setSearch] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('');
  const [paymentForm, setPaymentForm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteStudent, setDeleteStudent] = useState<StudentListItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const pageSize = 25;

  const debouncedSearch = useDebounce(search);

  const params = useMemo<StudentListParams>(
    () => ({
      page,
      pageSize,
      search: debouncedSearch || undefined,
      facultyId: facultyId ? Number(facultyId) : undefined,
      course: course ? Number(course) : undefined,
      status: (status as StudentStatus) || undefined,
      educationForm: undefined,
      paymentForm: paymentForm || undefined,
      sortBy,
      sortOrder,
    }),
    [page, debouncedSearch, facultyId, course, status, paymentForm, sortBy, sortOrder],
  );

  const { data, isLoading, error } = useStudentsList(params);
  const deleteStudentMutation = useDeleteStudent();
  const { data: faculties } = useFaculties();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (key: string) => {
      if (sortBy === key) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(key);
        setSortOrder('asc');
      }
    },
    [sortBy],
  );

  const handleFilterChange = useCallback(
    (setter: (v: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    },
    [],
  );

  const handleView = useCallback(
    (id: number) => navigate(`/students/${id}`),
    [navigate],
  );

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title={role === 'oqituvchi' ? t('students.myStudents') : t('students.listTitle')}
        subtitle={data ? `${t('common.total')}: ${data.total} ta` : undefined}
        actions={
          role !== 'oqituvchi' && role !== 'talaba' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                leftIcon={<FileDown className="h-4 w-4" />}
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = '/api/v1/students/export/';
                  a.download = 'talabalar.xlsx';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                Excel
              </Button>
              <Button
                variant="secondary"
                leftIcon={<FileDown className="h-4 w-4" />}
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = '/api/v1/students/export-pdf/';
                  a.download = 'talabalar.pdf';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                PDF
              </Button>
              <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/students/new')}>
                {t('students.addStudent')}
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Filters — all in one row like prototype */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('students.searchPlaceholder')}
                className="h-10 w-full rounded-lg border border-border pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
          </div>
          {role !== 'dekan' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">{t('students.faculty')}</label>
              <select
                value={facultyId}
                onChange={(e) => handleFilterChange(setFacultyId)(e.target.value)}
                className="h-10 rounded-lg border border-border px-3 text-sm"
              >
                <option value="">{t('common.all')}</option>
                {(faculties ?? []).map((f) => (
                  <option key={f.id} value={String(f.id)}>{f.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t('students.course')}</label>
            <select
              value={course}
              onChange={(e) => handleFilterChange(setCourse)(e.target.value)}
              className="h-10 rounded-lg border border-border px-3 text-sm"
            >
              <option value="">{t('common.all')}</option>
              <option value="1">{t('students.course1')}</option>
              <option value="2">{t('students.course2')}</option>
              <option value="3">{t('students.course3')}</option>
              <option value="4">{t('students.course4')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t('common.status')}</label>
            <select
              value={status}
              onChange={(e) => handleFilterChange(setStatus)(e.target.value)}
              className="h-10 rounded-lg border border-border px-3 text-sm"
            >
              <option value="">{t('common.all')}</option>
              <option value="active">{t('students.activeLearning')}</option>
              <option value="academic_leave">{t('students.academicLeave')}</option>
              <option value="expelled">{t('students.expelled')}</option>
              <option value="graduated">{t('students.graduated')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t('students.paymentForm')}</label>
            <select
              value={paymentForm}
              onChange={(e) => handleFilterChange(setPaymentForm)(e.target.value)}
              className="h-10 rounded-lg border border-border px-3 text-sm"
            >
              <option value="">{t('common.all')}</option>
              <option value="grant">{t('students.grant')}</option>
              <option value="contract">{t('students.contract')}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">{t('students.enrollmentPeriod')}</label>
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              onChange={(f, t) => { setDateFrom(f); setDateTo(t); setPage(1); }}
              presets={false}
            />
          </div>
        </div>
      </Card>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5">
          <span className="text-sm font-medium text-primary-700">{selectedIds.size} {t('common.selected')}</span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() => { /* export selected */ }}
            >
              {t('common.export')}
            </Button>
            <Button
              size="sm"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => setBulkDeleteOpen(true)}
            >
              {t('common.delete')}
            </Button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-1 rounded p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={() => {
          if (!deleteStudent) return;
          deleteStudentMutation.mutate(deleteStudent.id, { onSuccess: () => setDeleteStudent(null) });
        }}
        title={t('students.deleteStudent')}
        message={t('students.deleteStudentConfirm', { name: deleteStudent?.fullName })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteStudentMutation.isPending}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={() => {
          setBulkDeleteOpen(false);
          setSelectedIds(new Set());
        }}
        title={t('students.deleteStudents')}
        message={t('students.deleteStudentsConfirm', { count: selectedIds.size })}
        confirmLabel={t('common.delete')}
        variant="danger"
      />

      {/* Table */}
      <Card noPadding className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <StudentTable
              data={data?.data ?? []}
              page={page}
              pageSize={pageSize}
              onView={handleView}
              onDelete={setDeleteStudent}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
            {data && (
              <div className="border-t border-[#F1F5F9] px-4 py-3">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                  total={data.total}
                  pageSize={data.pageSize}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </PageContent>
  );
}
