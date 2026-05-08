import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard, EmptyState } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { BookOpen, Inbox, Plus } from 'lucide-react';
import { useBooksList, useLoansList } from '@/api/hooks/useLibrary';
import type { BookLoan } from '@/types/education';

// --- Tab Config ---

const PAGE_TABS = [
  { id: 'catalog', label: 'Katalog' },
  { id: 'loans', label: "Ijara ro'yxati" },
  { id: 'queue', label: 'Zayavkalar' },
  { id: 'readers', label: "O'quvchilar" },
];

const BOOK_GRADIENT_FROM = ['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
const BOOK_GRADIENT_TO = ['#1B7A4E', '#1D4ED8', '#B45309', '#6B21A8', '#BE185D', '#0891B2'];

// --- Columns ---

const loanColumns: Column<BookLoan>[] = [
  { key: 'bookTitle', header: 'Kitob', render: (row) => <span className="font-medium text-slate-900">{row.bookTitle}</span> },
  {
    key: 'studentName', header: 'Talaba',
    render: (row) => <span className="text-slate-600">{row.studentName}</span>,
  },
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
];

// --- Component ---

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState('catalog');

  const { data: booksData } = useBooksList();
  const { data: loansData } = useLoansList();

  const books = booksData?.data ?? [];
  const loans = loansData?.data ?? [];

  const totalBooks = booksData?.total ?? 0;
  const activeLoans = loans.filter((l) => l.status === 'active').length;
  const overdueLoans = loans.filter((l) => l.status === 'overdue').length;

  return (
    <PageContent>
      <PageHeader
        title="Kutubxona"
        subtitle="Kitoblar katalogi va ijara boshqaruvi"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Kutubxona' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami kitoblar" value={totalBooks} />
        <StatCard label="Ijarada" value={activeLoans} />
        <StatCard label="Muddati o'tgan" value={overdueLoans} />
        <StatCard label="Jami kitob nusxalari" value={books.reduce((sum, b) => sum + b.totalCopies, 0)} />
      </div>

      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'catalog' && <CatalogTab />}
        {activeTab === 'loans' && <LoansTab />}
        {activeTab === 'queue' && <QueueTab />}
        {activeTab === 'readers' && <ReadersTab />}
      </div>
    </PageContent>
  );
}

function CatalogTab() {
  const { data, isLoading } = useBooksList();
  const books = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

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
              <button className="rounded-md bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 hover:bg-green-100 transition-colors">
                Band qilish
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function LoansTab() {
  const { data, isLoading } = useLoansList();
  const loans = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card noPadding>
      <DataTable data={loans} columns={loanColumns} keyField="id" emptyMessage="Berilgan kitoblar topilmadi" />
    </Card>
  );
}

function QueueTab() {
  return (
    <EmptyState
      icon={<Inbox className="h-6 w-6" />}
      title="Zayavkalar yo'q"
      description="Kutishda bo'lgan kitob so'rovlari bu yerda paydo bo'ladi"
      action={
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Zayavka qo&apos;shish
        </Button>
      }
    />
  );
}

function ReadersTab() {
  const { data, isLoading } = useLoansList();
  const loans = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Aggregate readers from loan data (no dedicated readers hook)
  const readerMap = new Map<number, { studentId: number; studentName: string; currentLoans: number; totalBorrowed: number; overdueCount: number }>();
  loans.forEach((loan) => {
    const existing = readerMap.get(loan.studentId) ?? {
      studentId: loan.studentId,
      studentName: loan.studentName,
      currentLoans: 0,
      totalBorrowed: 0,
      overdueCount: 0,
    };
    existing.totalBorrowed++;
    if (loan.status === 'active') existing.currentLoans++;
    if (loan.status === 'overdue') {
      existing.currentLoans++;
      existing.overdueCount++;
    }
    readerMap.set(loan.studentId, existing);
  });
  const readers = Array.from(readerMap.values());

  interface ReaderRow {
    studentId: number;
    studentName: string;
    currentLoans: number;
    totalBorrowed: number;
    overdueCount: number;
  }

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
