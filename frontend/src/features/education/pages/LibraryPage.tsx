import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard, EmptyState } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
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

const PAGE_TABS = [
  { id: 'catalog', label: 'Katalog' },
  { id: 'loans', label: "Ijara ro'yxati" },
  { id: 'queue', label: 'Zayavkalar' },
  { id: 'readers', label: "O'quvchilar" },
];

const BOOK_GRADIENT_FROM = ['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
const BOOK_GRADIENT_TO = ['#1B7A4E', '#1D4ED8', '#B45309', '#6B21A8', '#BE185D', '#0891B2'];

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [bookSearch, setBookSearch] = useState('');
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [loanFormOpen, setLoanFormOpen] = useState(false);
  const [returnLoan, setReturnLoan] = useState<BookLoan | null>(null);

  const { data: booksData } = useBooksList({ search: bookSearch || undefined });
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

  return (
    <PageContent>
      <PageHeader
        title="Kutubxona"
        subtitle="Kitoblar katalogi va ijara boshqaruvi"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Kutubxona' }]}
        actions={
          activeTab === 'catalog' ? (
            <Button variant="primary" size="sm" onClick={() => setBookFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Yangi kitob
            </Button>
          ) : activeTab === 'loans' ? (
            <Button variant="primary" size="sm" onClick={() => setLoanFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Kitob berish
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami kitoblar" value={totalBooks} />
        <StatCard label="Ijarada" value={activeLoans} />
        <StatCard label="Muddati o'tgan" value={overdueLoans} />
        <StatCard label="Jami kitob nusxalari" value={books.reduce((sum, b) => sum + b.totalCopies, 0)} />
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
              placeholder="Nomi, muallif yoki ISBN bo'yicha..."
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
        title="Kitobni qaytarish"
        message={`"${returnLoan?.bookTitle}" kitobini qaytarishni tasdiqlaysizmi?`}
        confirmLabel="Qaytarish"
        variant="warning"
        loading={returnBook.isPending}
      />
    </PageContent>
  );
}

function CatalogTab({ books, onEdit }: { books: Book[]; onEdit: (book: Book) => void }) {
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
                {book.availableCopies > 0 ? `${book.availableCopies} / ${book.totalCopies}` : "Yo'q"}
              </Badge>
              <button
                type="button"
                onClick={() => onEdit(book)}
                className="flex items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Pencil className="h-3 w-3" /> Tahrir
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

const loanColumns = (onReturn: (loan: BookLoan) => void): Column<BookLoan>[] => [
  { key: 'bookTitle', header: 'Kitob', render: (row) => <span className="font-medium text-slate-900">{row.bookTitle}</span> },
  { key: 'studentName', header: 'Talaba', render: (row) => <span className="text-slate-600">{row.studentName}</span> },
  { key: 'issueDate', header: 'Berilgan sana', render: (row) => <span className="tabular-nums text-slate-500">{row.issueDate}</span> },
  {
    key: 'dueDate', header: 'Qaytarish',
    render: (row) => (
      <span className={`tabular-nums ${row.status === 'overdue' ? 'text-red-700 font-medium' : 'text-slate-500'}`}>
        {row.dueDate}
      </span>
    ),
  },
  {
    key: 'status', header: 'Holat',
    render: (row) => {
      const variant = row.status === 'overdue' ? 'error' : row.status === 'returned' ? 'default' : 'success';
      const label = row.status === 'overdue' ? "Muddati o'tgan" : row.status === 'returned' ? 'Qaytarilgan' : 'Faol';
      return <Badge variant={variant} dot>{label}</Badge>;
    },
  },
  {
    key: 'actions', header: '',
    render: (row) =>
      row.status === 'active' || row.status === 'overdue' ? (
        <button type="button" onClick={() => onReturn(row)} className="flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-800">
          <RotateCcw className="h-3.5 w-3.5" /> Qaytarish
        </button>
      ) : null,
  },
];

function LoansTab({ loans, onReturn }: { loans: BookLoan[]; onReturn: (loan: BookLoan) => void }) {
  const { isLoading } = useLoansList();
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  return (
    <Card noPadding>
      <DataTable data={loans} columns={loanColumns(onReturn)} keyField="id" emptyMessage="Berilgan kitoblar topilmadi" />
    </Card>
  );
}

function QueueTab({ books, students }: { books: { id: number; title: string }[]; students: { id: number; fullName: string }[] }) {
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
    { key: 'bookTitle', header: 'Kitob', render: (row) => <span className="font-medium text-slate-900">{row.bookTitle}</span> },
    { key: 'studentName', header: 'Talaba', render: (row) => <span className="text-slate-700">{row.studentName}</span> },
    { key: 'requestDate', header: 'So\'ralgan sana', render: (row) => <span className="tabular-nums text-slate-500">{row.requestDate}</span> },
    {
      key: 'estimatedAvailableDate', header: 'Taxminiy sana',
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
          title="O'chirish"
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
        <h4 className="text-[13px] font-semibold text-slate-900 mb-3">Navbatga qo&apos;shish</h4>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs font-medium text-slate-600">Kitob</label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            >
              <option value="">Kitobni tanlang</option>
              {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs font-medium text-slate-600">Talaba</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary-400"
            >
              <option value="">Talabani tanlang</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            disabled={!bookId || !studentId}
            loading={addToQueue.isPending}
            onClick={handleAdd}
          >
            Qo&apos;shish
          </Button>
        </div>
      </Card>

      {entries.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title="Navbat bo'sh"
          description="Hozirda kutayotgan talabalar yo'q"
        />
      ) : (
        <Card noPadding>
          <DataTable data={entries} columns={queueColumns} keyField="id" emptyMessage="Navbat bo'sh" />
        </Card>
      )}
    </div>
  );
}

function ReadersTab({ loans }: { loans: BookLoan[] }) {
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
      key: 'studentName', header: "O'quvchi",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
            {row.studentName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <p className="text-[13px] font-medium text-slate-900">{row.studentName}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Toifa', render: () => <Badge variant="info">Talaba</Badge> },
    { key: 'currentLoans', header: 'Hozir ijarada', className: 'text-center', render: (row) => <span className="font-medium tabular-nums">{row.currentLoans}</span> },
    { key: 'totalBorrowed', header: 'Jami olingan', className: 'text-center', render: (row) => <span className="tabular-nums">{row.totalBorrowed}</span> },
    {
      key: 'overdueCount', header: "Muddati o'tgan", className: 'text-center',
      render: (row) => (
        <span className={`tabular-nums ${row.overdueCount > 0 ? 'text-red-700 font-medium' : 'text-slate-400'}`}>
          {row.overdueCount}
        </span>
      ),
    },
  ];

  return (
    <Card noPadding>
      <DataTable data={readers} columns={readerColumns} keyField="studentId" emptyMessage="O'quvchilar topilmadi" />
    </Card>
  );
}
