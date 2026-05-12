import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard, EmptyState } from '@/components/data-display';
import { Badge, Button, Spinner, AlertBanner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { BookOpen, Inbox, Plus, Pencil, RotateCcw, Search, Trash2, Clock } from 'lucide-react';
import { useBooksList, useLoansList, useCreateBook, useUpdateBook, useCreateLoan, useReturnBook, useBookQueue, useAddToQueue, useRemoveFromQueue } from '@/api/hooks/useLibrary';
import { useStudentsList } from '@/api/hooks/useStudents';
import { BookForm } from '../components/BookForm';
import { LoanForm } from '../components/LoanForm';
import type { Book, BookLoan, BookQueueEntry } from '@/types/education';
import type { CreateBookFormData } from '../schemas/book.schema';
import type { CreateLoanFormData } from '../schemas/loan.schema';

function usePageTabs() {
  const { t } = useTranslation();
  return [
    { id: 'catalog', label: t('education.tabCatalog') },
    { id: 'loans', label: t('education.tabLoans') },
    { id: 'queue', label: t('education.tabQueue') },
    { id: 'readers', label: t('education.tabReaders') },
  ];
}

const BOOK_GRADIENT_FROM = ['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
const BOOK_GRADIENT_TO = ['#1B7A4E', '#1D4ED8', '#B45309', '#6B21A8', '#BE185D', '#0891B2'];

export function LibraryPage() {
  const { t } = useTranslation();
  const PAGE_TABS = usePageTabs();
  const [activeTab, setActiveTab] = useState('catalog');
  const [bookSearch, setBookSearch] = useState('');
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [loanFormOpen, setLoanFormOpen] = useState(false);
  const [returnLoan, setReturnLoan] = useState<BookLoan | null>(null);

  const { data: booksData, error: booksError } = useBooksList({ search: bookSearch || undefined });
  const { data: loansData } = useLoansList();
  const { data: studentsData } = useStudentsList({ page: 1, pageSize: 200 });
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const createLoan = useCreateLoan();
  const returnBook = useReturnBook();

  const books = booksData?.data ?? [];
  const loans = loansData?.data ?? [];
  const totalBooks = booksData?.total ?? 0;
  const activeLoans = loans.filter((l) => l.status === 'active').length;
  const overdueLoans = loans.filter((l) => l.status === 'overdue').length;
  const students = (studentsData?.data ?? []).map((s) => ({ id: s.id, fullName: s.fullName }));
  const bookOptions = books.map((b) => ({ id: b.id, title: b.title }));

  const handleCreateBook = (formData: CreateBookFormData) => {
    createBook.mutate(
      { ...formData, year: Number(formData.year), totalCopies: Number(formData.totalCopies) },
      { onSuccess: () => setBookFormOpen(false) },
    );
  };

  const handleEditBook = (formData: CreateBookFormData) => {
    if (!editBook) return;
    updateBook.mutate(
      { id: editBook.id, data: { ...formData, year: Number(formData.year), totalCopies: Number(formData.totalCopies) } },
      { onSuccess: () => setEditBook(null) },
    );
  };

  const handleCreateLoan = (formData: CreateLoanFormData) => {
    createLoan.mutate(
      { bookId: Number(formData.bookId), studentId: Number(formData.studentId), dueDate: formData.dueDate },
      { onSuccess: () => setLoanFormOpen(false) },
    );
  };

  if (booksError) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(booksError as Error).message} />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title={t('education.libraryTitle')}
        subtitle={t('education.librarySubtitle')}
        breadcrumbs={[{ label: t('nav.education') }, { label: t('nav.library') }]}
        actions={
          activeTab === 'catalog' ? (
            <Button variant="primary" size="sm" onClick={() => setBookFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> {t('education.newBook')}
            </Button>
          ) : activeTab === 'loans' ? (
            <Button variant="primary" size="sm" onClick={() => setLoanFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> {t('education.lendBook')}
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label={t('education.libraryTitle')} value={totalBooks} />
        <StatCard label={t('education.onLoan')} value={activeLoans} />
        <StatCard label={t('education.overdue')} value={overdueLoans} />
        <StatCard label={t('education.totalBookCopies')} value={books.reduce((sum, b) => sum + b.totalCopies, 0)} />
      </div>

      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'catalog' && (
        <div className="mt-3 mb-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              placeholder={t('education.searchBookPlaceholder')}
              className="h-9 w-full rounded-lg border border-border pl-8 pr-3 text-[13px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
          </div>
        </div>
      )}

      <div className="mt-0">
        {activeTab === 'catalog' && (
          <CatalogTab books={books} onEdit={(book) => setEditBook(book)} />
        )}
        {activeTab === 'loans' && (
          <LoansTab loans={loans} onReturn={(loan) => setReturnLoan(loan)} />
        )}
        {activeTab === 'queue' && <QueueTab books={bookOptions} students={students} />}
        {activeTab === 'readers' && <ReadersTab loans={loans} />}
      </div>

      <BookForm
        open={bookFormOpen}
        onClose={() => setBookFormOpen(false)}
        onSubmit={handleCreateBook}
        loading={createBook.isPending}
      />

      <BookForm
        open={!!editBook}
        onClose={() => setEditBook(null)}
        onSubmit={handleEditBook}
        book={editBook}
        loading={updateBook.isPending}
      />

      <LoanForm
        open={loanFormOpen}
        onClose={() => setLoanFormOpen(false)}
        onSubmit={handleCreateLoan}
        books={bookOptions}
        students={students}
        loading={createLoan.isPending}
      />

      <ConfirmDialog
        open={!!returnLoan}
        onClose={() => setReturnLoan(null)}
        onConfirm={() => {
          if (!returnLoan) return;
          returnBook.mutate(returnLoan.id, { onSuccess: () => setReturnLoan(null) });
        }}
        title={t('education.returnBookTitle')}
        message={t('education.returnBookConfirm', { title: returnLoan?.bookTitle })}
        confirmLabel={t('education.returnBtn')}
        variant="warning"
        loading={returnBook.isPending}
      />
    </PageContent>
  );
}

function CatalogTab({ books, onEdit }: { books: Book[]; onEdit: (book: Book) => void }) {
  const { t } = useTranslation();
  const { isLoading } = useBooksList();

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {books.map((book) => {
        const gradientFrom = BOOK_GRADIENT_FROM[book.id % BOOK_GRADIENT_FROM.length];
        const gradientTo = BOOK_GRADIENT_TO[book.id % BOOK_GRADIENT_TO.length];
        return (
          <Card key={book.id}>
            <div
              className="flex h-36 items-end rounded-lg p-3 mb-3"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
            >
              <BookOpen className="h-5 w-5 text-white/80" />
            </div>
            <h4 className="text-[13px] font-semibold text-slate-900 leading-snug min-h-[36px]">
              {book.title}
            </h4>
            <p className="mt-1 text-[11px] text-slate-500">
              {book.author} &middot; {book.year}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <Badge variant={book.availableCopies > 0 ? 'success' : 'error'} dot>
                {book.availableCopies > 0 ? `${book.availableCopies} / ${book.totalCopies}` : t('education.notAvailable')}
              </Badge>
              <button
                type="button"
                onClick={() => onEdit(book)}
                className="flex items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Pencil className="h-3 w-3" /> {t('education.editBtn')}
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function useLoanColumns(onReturn: (loan: BookLoan) => void): Column<BookLoan>[] {
  const { t } = useTranslation();
  return [
    { key: 'bookTitle', header: t('education.bookTitle'), render: (row) => <span className="font-medium text-slate-900">{row.bookTitle}</span> },
    { key: 'studentName', header: t('education.student'), render: (row) => <span className="text-slate-600">{row.studentName}</span> },
    { key: 'issueDate', header: t('education.issuedDate'), render: (row) => <span className="tabular-nums text-slate-500">{row.issueDate}</span> },
    {
      key: 'dueDate', header: t('education.returnDate'),
      render: (row) => (
        <span className={`tabular-nums ${row.status === 'overdue' ? 'text-red-700 font-medium' : 'text-slate-500'}`}>
          {row.dueDate}
        </span>
      ),
    },
    {
      key: 'status', header: t('common.status'),
      render: (row) => {
        const variant = row.status === 'overdue' ? 'error' : row.status === 'returned' ? 'default' : 'success';
        const label = row.status === 'overdue' ? t('education.loanStatusOverdue') : row.status === 'returned' ? t('education.loanStatusReturned') : t('education.loanStatusActive');
        return <Badge variant={variant} dot>{label}</Badge>;
      },
    },
    {
      key: 'actions', header: '',
      render: (row) =>
        row.status === 'active' || row.status === 'overdue' ? (
          <button type="button" onClick={() => onReturn(row)} className="flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-800">
            <RotateCcw className="h-3.5 w-3.5" /> {t('education.returnBtn')}
          </button>
        ) : null,
    },
  ];
}

function LoansTab({ loans, onReturn }: { loans: BookLoan[]; onReturn: (loan: BookLoan) => void }) {
  const { t } = useTranslation();
  const columns = useLoanColumns(onReturn);
  const { isLoading } = useLoansList();
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  return (
    <Card noPadding>
      <DataTable data={loans} columns={columns} keyField="id" emptyMessage={t('education.loansNotFound')} />
    </Card>
  );
}

function QueueTab({ books, students }: { books: { id: number; title: string }[]; students: { id: number; fullName: string }[] }) {
  const { t } = useTranslation();
  const { data: queue, isLoading } = useBookQueue();
  const addToQueue = useAddToQueue();
  const removeFromQueue = useRemoveFromQueue();
  const [bookId, setBookId] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleAdd = () => {
    if (!bookId || !studentId) return;
    addToQueue.mutate({ bookId: Number(bookId), studentId: Number(studentId) }, {
      onSuccess: () => { setBookId(''); setStudentId(''); },
    });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const entries = queue ?? [];

  const queueColumns: Column<BookQueueEntry>[] = [
    {
      key: 'position', header: '#',
      render: (row) => (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-700">
          {row.position}
        </span>
      ),
    },
    { key: 'bookTitle', header: t('education.bookTitle'), render: (row) => <span className="font-medium text-slate-900">{row.bookTitle}</span> },
    { key: 'studentName', header: t('education.student'), render: (row) => <span className="text-slate-700">{row.studentName}</span> },
    { key: 'requestDate', header: t('education.requestDate'), render: (row) => <span className="tabular-nums text-slate-500">{row.requestDate}</span> },
    {
      key: 'estimatedAvailableDate', header: t('education.estimatedDate'),
      render: (row) => row.estimatedAvailableDate ? (
        <span className="flex items-center gap-1.5 text-slate-500 tabular-nums">
          <Clock className="h-3 w-3 text-amber-500" />{row.estimatedAvailableDate}
        </span>
      ) : <span className="text-slate-400">—</span>,
    },
    {
      key: 'id', header: '', width: '48px',
      render: (row) => (
        <button
          onClick={() => removeFromQueue.mutate(row.id)}
          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
          title={t('common.delete')}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Add to queue form */}
      <Card>
        <h4 className="text-[13px] font-semibold text-slate-900 mb-3">{t('education.addToQueue')}</h4>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs font-medium text-slate-600">{t('education.bookTitle')}</label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            >
              <option value="">{t('education.selectBook')}</option>
              {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs font-medium text-slate-600">{t('education.student')}</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            >
              <option value="">{t('education.selectStudent')}</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            disabled={!bookId || !studentId}
            loading={addToQueue.isPending}
            onClick={handleAdd}
          >
            {t('common.add')}
          </Button>
        </div>
      </Card>

      {entries.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title={t('education.queueEmpty')}
          description={t('education.queueEmptyDesc')}
        />
      ) : (
        <Card noPadding>
          <DataTable data={entries} columns={queueColumns} keyField="id" emptyMessage={t('education.queueEmpty')} />
        </Card>
      )}
    </div>
  );
}

function ReadersTab({ loans }: { loans: BookLoan[] }) {
  const { t } = useTranslation();
  const { isLoading } = useLoansList();
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const readerMap = new Map<number, { studentId: number; studentName: string; currentLoans: number; totalBorrowed: number; overdueCount: number }>();
  loans.forEach((loan) => {
    const existing = readerMap.get(loan.studentId) ?? { studentId: loan.studentId, studentName: loan.studentName, currentLoans: 0, totalBorrowed: 0, overdueCount: 0 };
    existing.totalBorrowed++;
    if (loan.status === 'active') existing.currentLoans++;
    if (loan.status === 'overdue') { existing.currentLoans++; existing.overdueCount++; }
    readerMap.set(loan.studentId, existing);
  });
  const readers = Array.from(readerMap.values());

  interface ReaderRow { studentId: number; studentName: string; currentLoans: number; totalBorrowed: number; overdueCount: number; }

  const readerColumns: Column<ReaderRow>[] = [
    {
      key: 'studentName', header: t('education.student'),
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
            {row.studentName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <p className="text-[13px] font-medium text-slate-900">{row.studentName}</p>
        </div>
      ),
    },
    { key: 'type', header: t('education.readerCategory'), render: () => <Badge variant="info">{t('education.studentLabel')}</Badge> },
    { key: 'currentLoans', header: t('education.currentLoans'), className: 'text-center', render: (row) => <span className="font-medium tabular-nums">{row.currentLoans}</span> },
    { key: 'totalBorrowed', header: t('education.totalBorrowed'), className: 'text-center', render: (row) => <span className="tabular-nums">{row.totalBorrowed}</span> },
    {
      key: 'overdueCount', header: t('education.overdue'), className: 'text-center',
      render: (row) => (
        <span className={`tabular-nums ${row.overdueCount > 0 ? 'text-red-700 font-medium' : 'text-slate-400'}`}>
          {row.overdueCount}
        </span>
      ),
    },
  ];

  return (
    <Card noPadding>
      <DataTable data={readers} columns={readerColumns} keyField="studentId" emptyMessage={t('education.readersNotFound')} />
    </Card>
  );
}
