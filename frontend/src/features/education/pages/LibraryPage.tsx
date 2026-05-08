import { useState } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card, StatCard, EmptyState } from '@/components/data-display';
import { Badge, Button } from '@/components/ui';
import { Tabs } from '@/components/navigation';
import { DataTable, type Column } from '@/components/table';
import { BookOpen, Inbox, Plus } from 'lucide-react';
import { generateName, rnum } from '@/api/mock/shared-data';

// --- Types ---

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  copies: number;
  available: number;
  category: string;
}

interface Loan {
  id: number;
  bookTitle: string;
  reader: string;
  group: string;
  issuedDate: string;
  returnDate: string;
  overdue: boolean;
}

interface Reader {
  id: number;
  name: string;
  initials: string;
  group: string;
  isFemale: boolean;
  currentLoans: number;
  totalBorrowed: number;
  overdueCount: number;
}

// --- Mock Data ---

const BOOKS: Book[] = [
  { id: 1, title: "Algoritmlar va ma'lumotlar tuzilmasi", author: 'Z.M. Sulaymonov', year: 2022, copies: 45, available: 12, category: 'Informatika' },
  { id: 2, title: 'Iqtisodiy tahlil asoslari', author: 'N.R. Orifjonova', year: 2023, copies: 30, available: 8, category: 'Iqtisodiyot' },
  { id: 3, title: "Pedagogika qo'llanmasi", author: 'D.A. Hasanova', year: 2021, copies: 28, available: 0, category: 'Pedagogika' },
  { id: 4, title: "Ma'lumotlar bazasi nazariyasi", author: 'R.S. Saidov', year: 2022, copies: 36, available: 15, category: 'Informatika' },
  { id: 5, title: "Tog'-kon ishi amaliy kursi", author: 'S.B. Rahimov', year: 2023, copies: 22, available: 6, category: "Tog'-kon" },
  { id: 6, title: "Veb-dasturlash: ma'ruzalar kursi", author: 'M.K. Nazarova', year: 2020, copies: 40, available: 18, category: 'Informatika' },
];

const BOOK_GRADIENT_FROM = ['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
const BOOK_GRADIENT_TO = ['#1B7A4E', '#1D4ED8', '#B45309', '#6B21A8', '#BE185D', '#0891B2'];

const GROUPS = ['301-A', '201-B', '402-C', '102-A', '303-B', '204-A', '101-C', '302-A'];

const LOANS: Loan[] = Array.from({ length: 8 }, (_, i) => {
  const name = generateName(i + 200);
  const book = BOOKS[i % BOOKS.length] as Book;
  const overdue = i % 5 === 0;
  return {
    id: i + 1,
    bookTitle: book.title,
    reader: name.short,
    group: GROUPS[i % GROUPS.length] as string,
    issuedDate: `${String(rnum(i + 1, 1, 18)).padStart(2, '0')}.04.2026`,
    returnDate: `${String(rnum(i + 5, 1, 28)).padStart(2, '0')}.05.2026`,
    overdue,
  };
});

const READERS: Reader[] = Array.from({ length: 10 }, (_, i) => {
  const name = generateName(i + 300);
  return {
    id: i + 1,
    name: name.short,
    initials: name.initials,
    group: GROUPS[i % GROUPS.length] as string,
    isFemale: name.isFemale,
    currentLoans: rnum(i + 1, 0, 4),
    totalBorrowed: rnum(i + 3, 8, 42),
    overdueCount: i % 7 === 0 ? 1 : 0,
  };
});

// --- Tab Config ---

const PAGE_TABS = [
  { id: 'catalog', label: 'Katalog' },
  { id: 'loans', label: "Ijara ro'yxati" },
  { id: 'queue', label: 'Zayavkalar' },
  { id: 'readers', label: "O'quvchilar" },
];

// --- Columns ---

const loanColumns: Column<Loan>[] = [
  { key: 'bookTitle', header: 'Kitob', render: (row) => <span className="font-medium text-slate-900">{row.bookTitle}</span> },
  {
    key: 'reader', header: 'Talaba',
    render: (row) => (
      <span className="text-slate-600">
        {row.reader} &middot; {row.group}
      </span>
    ),
  },
  { key: 'issuedDate', header: 'Berilgan sana', render: (row) => <span className="tabular-nums text-slate-500">{row.issuedDate}</span> },
  {
    key: 'returnDate', header: 'Qaytarish',
    render: (row) => (
      <span className={`tabular-nums ${row.overdue ? 'text-red-700 font-medium' : 'text-slate-500'}`}>
        {row.returnDate}
      </span>
    ),
  },
  {
    key: 'status', header: 'Holat',
    render: (row) => (
      <Badge variant={row.overdue ? 'error' : 'success'} dot>
        {row.overdue ? "Muddati o'tgan" : 'Faol'}
      </Badge>
    ),
  },
];

const readerColumns: Column<Reader>[] = [
  {
    key: 'name', header: "O'quvchi",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${row.isFemale ? 'bg-amber-500' : 'bg-blue-500'}`}>
          {row.initials}
        </div>
        <div>
          <p className="text-[13px] font-medium text-slate-900">{row.name}</p>
          <p className="text-[11px] text-slate-500">{row.group}</p>
        </div>
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

// --- Component ---

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <PageContent>
      <PageHeader
        title="Kutubxona"
        subtitle="Kitoblar katalogi va ijara boshqaruvi"
        breadcrumbs={[{ label: "Ta'lim" }, { label: 'Kutubxona' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami kitoblar" value="12,486" />
        <StatCard label="Ijarada" value="3,127" />
        <StatCard label="Muddati o'tgan" value="48" />
        <StatCard label="Faol o'quvchilar" value="2,104" />
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {BOOKS.map((book) => {
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
              <Badge variant={book.available > 0 ? 'success' : 'error'} dot>
                {book.available > 0 ? `${book.available} / ${book.copies}` : "Yo'q"}
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
  return (
    <Card noPadding>
      <DataTable data={LOANS} columns={loanColumns} keyField="id" emptyMessage="Berilgan kitoblar topilmadi" />
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
  return (
    <Card noPadding>
      <DataTable data={READERS} columns={readerColumns} keyField="id" emptyMessage="O'quvchilar topilmadi" />
    </Card>
  );
}
