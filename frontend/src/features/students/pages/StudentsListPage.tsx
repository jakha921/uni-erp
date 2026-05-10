import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContent } from '@/components/layout/PageContent';
import { Card } from '@/components/data-display/Card';
import { Pagination } from '@/components/table/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/overlays';
import { StudentTable } from '../components/StudentTable';
import { useStudentsList, useDeleteStudent } from '@/api/hooks/useStudents';
import { useAuthStore } from '@/stores/auth.store';
import type { StudentStatus, StudentListParams, StudentListItem } from '@/types/student';

export function StudentsListPage() {
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
  const pageSize = 25;

  const params = useMemo<StudentListParams>(
    () => ({
      page,
      pageSize,
      search: search || undefined,
      facultyId: facultyId ? Number(facultyId) : undefined,
      course: course ? Number(course) : undefined,
      status: (status as StudentStatus) || undefined,
      educationForm: undefined,
      paymentForm: paymentForm || undefined,
      sortBy,
      sortOrder,
    }),
    [page, search, facultyId, course, status, paymentForm, sortBy, sortOrder],
  );

  const { data, isLoading } = useStudentsList(params);
  const deleteStudentMutation = useDeleteStudent();

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

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title={role === 'oqituvchi' ? 'Mening talabalarim' : "Talabalar ro'yxati"}
        subtitle={data ? `Jami: ${data.total} ta` : undefined}
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
                placeholder="F.I.SH, ID raqam yoki guruh bo'yicha qidirish…"
                className="h-10 w-full rounded-lg border border-border pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
          </div>
          {role !== 'dekan' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Fakultet</label>
              <select
                value={facultyId}
                onChange={(e) => handleFilterChange(setFacultyId)(e.target.value)}
                className="h-10 rounded-lg border border-border px-3 text-sm"
              >
                <option value="">Hammasi</option>
                <option value="1">Axborot texnologiyalari</option>
                <option value="2">Iqtisodiyot</option>
                <option value="3">Pedagogika</option>
                <option value="4">Filologiya</option>
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Kurs</label>
            <select
              value={course}
              onChange={(e) => handleFilterChange(setCourse)(e.target.value)}
              className="h-10 rounded-lg border border-border px-3 text-sm"
            >
              <option value="">Hammasi</option>
              <option value="1">1-kurs</option>
              <option value="2">2-kurs</option>
              <option value="3">3-kurs</option>
              <option value="4">4-kurs</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Holat</label>
            <select
              value={status}
              onChange={(e) => handleFilterChange(setStatus)(e.target.value)}
              className="h-10 rounded-lg border border-border px-3 text-sm"
            >
              <option value="">Hammasi</option>
              <option value="active">O&apos;qimoqda</option>
              <option value="academic_leave">Akademik ta&apos;tilda</option>
              <option value="expelled">Chetlatilgan</option>
              <option value="graduated">Bitirgan</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">To&apos;lov</label>
            <select
              value={paymentForm}
              onChange={(e) => handleFilterChange(setPaymentForm)(e.target.value)}
              className="h-10 rounded-lg border border-border px-3 text-sm"
            >
              <option value="">Hammasi</option>
              <option value="grant">Grant</option>
              <option value="contract">Kontrakt</option>
            </select>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={() => {
          if (!deleteStudent) return;
          deleteStudentMutation.mutate(deleteStudent.id, { onSuccess: () => setDeleteStudent(null) });
        }}
        title="Talabani o'chirish"
        message={`"${deleteStudent?.fullName}" talabani o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteStudentMutation.isPending}
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
