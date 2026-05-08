import { delay } from './delay';
import { pick, rnum, generateName } from './shared-data';
import type {
  Book,
  BookLoan,
  BookListParams,
  LoanListParams,
  CreateBookDto,
  UpdateBookDto,
  CreateLoanDto,
  LoanStatus,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import type { ILibraryService } from '../services/library.service';

const BOOK_TITLES = [
  'Algoritmlar va ma\'lumotlar tuzilmasi',
  'Dasturlash asoslari (Python)',
  'Chiziqli algebra',
  'Matematik tahlil I',
  'Matematik tahlil II',
  'Diskret matematika',
  'Ma\'lumotlar bazalari',
  'Operatsion tizimlar',
  'Kompyuter tarmoqlari',
  'Veb-dasturlash asoslari',
  'Iqtisodiyot nazariyasi',
  'Makroiqtisodiyot',
  'Mikroiqtisodiyot',
  'Menejment asoslari',
  'Marketing',
  'Pedagogika asoslari',
  'Umumiy psixologiya',
  'O\'zbek tili va adabiyoti',
  'Ingliz tili grammatikasi',
  'Fizika asoslari',
  'Kimyo asoslari',
  'Tarix asoslari',
  'Falsafa',
  'Huquqshunoslik',
  'Ekologiya asoslari',
  'Sun\'iy intellekt asoslari',
  'Mashinali o\'rganish',
  'Statistika',
  'Ehtimollar nazariyasi',
  'Axborot xavfsizligi',
];

const AUTHORS = [
  'Karimov A.B.', 'Nazarov U.T.', 'Xolmatova S.R.', 'Tursunov J.A.',
  'Yusupova D.K.', 'Hasanov M.I.', 'Mirzayeva N.O.', 'Rahimov B.S.',
  'Ergashev K.M.', 'Saidova L.F.', 'Toshmatov P.G.', 'Qodirov H.N.',
  'Sodiqov R.J.', 'Aliyeva Z.V.', 'Nurmatov G.D.',
];

const CATEGORIES = [
  'Informatika', 'Matematika', 'Iqtisodiyot', 'Pedagogika',
  'Filologiya', 'Tabiiy fanlar', 'Ijtimoiy fanlar', 'Texnika',
];

const LOCATIONS = [
  'A-1 javon', 'A-2 javon', 'A-3 javon', 'B-1 javon', 'B-2 javon',
  'B-3 javon', 'C-1 javon', 'C-2 javon', 'D-1 javon', 'D-2 javon',
];

const LOAN_STATUSES: LoanStatus[] = ['active', 'returned', 'overdue'];

function generateBooks(): Book[] {
  const result: Book[] = [];
  for (let i = 0; i < 30; i++) {
    const total = rnum(i * 7, 3, 20);
    const available = rnum(i * 11, 0, total);
    result.push({
      id: i + 1,
      title: BOOK_TITLES[i % BOOK_TITLES.length]!,
      author: pick(AUTHORS, i * 3),
      isbn: `978-${rnum(i * 5, 1, 9)}-${rnum(i * 9, 10000, 99999)}-${rnum(i * 13, 100, 999)}-${rnum(i * 17, 0, 9)}`,
      year: rnum(i * 19, 2010, 2025),
      category: pick(CATEGORIES, i * 23),
      totalCopies: total,
      availableCopies: available,
      location: pick(LOCATIONS, i * 29),
    });
  }
  return result;
}

function generateLoans(books: Book[]): BookLoan[] {
  const result: BookLoan[] = [];
  for (let i = 0; i < 15; i++) {
    const book = books[i % books.length]!;
    const name = generateName(i + 200);
    const issueMonth = rnum(i * 7, 1, 4);
    const issueDay = rnum(i * 11, 1, 28);
    const dueMonth = Math.min(issueMonth + 1, 12);
    const status = LOAN_STATUSES[i % 3]!;
    const returnDate = status === 'returned'
      ? `2026-${String(dueMonth).padStart(2, '0')}-${String(rnum(i * 13, 1, 28)).padStart(2, '0')}`
      : undefined;

    result.push({
      id: i + 1,
      bookId: book.id,
      bookTitle: book.title,
      studentId: 1000 + i,
      studentName: name.full,
      issueDate: `2026-${String(issueMonth).padStart(2, '0')}-${String(issueDay).padStart(2, '0')}`,
      dueDate: `2026-${String(dueMonth).padStart(2, '0')}-${String(issueDay).padStart(2, '0')}`,
      returnDate,
      status,
    });
  }
  return result;
}

const ALL_BOOKS = generateBooks();
const ALL_LOANS = generateLoans(ALL_BOOKS);

export class LibraryMockService implements ILibraryService {
  private books: Book[] = [...ALL_BOOKS];
  private loans: BookLoan[] = [...ALL_LOANS];

  async getBooks(params?: BookListParams): Promise<PaginatedResponse<Book>> {
    await delay(300);
    let filtered = [...this.books];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q),
      );
    }
    if (params?.category) {
      filtered = filtered.filter((b) => b.category === params.category);
    }
    if (params?.available === true) {
      filtered = filtered.filter((b) => b.availableCopies > 0);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async getBookById(id: number): Promise<Book> {
    await delay(200);
    const book = this.books.find((b) => b.id === id);
    if (!book) throw new Error('Kitob topilmadi');
    return book;
  }

  async createBook(data: CreateBookDto): Promise<Book> {
    await delay(400);
    const maxId = Math.max(...this.books.map((b) => b.id));
    const book: Book = {
      id: maxId + 1,
      ...data,
      availableCopies: data.totalCopies,
    };
    this.books.unshift(book);
    return book;
  }

  async updateBook(id: number, data: UpdateBookDto): Promise<Book> {
    await delay(400);
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Kitob topilmadi');
    this.books[idx] = { ...this.books[idx]!, ...data };
    return this.books[idx]!;
  }

  async getLoans(params?: LoanListParams): Promise<PaginatedResponse<BookLoan>> {
    await delay(300);
    let filtered = [...this.loans];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.bookTitle.toLowerCase().includes(q) ||
          l.studentName.toLowerCase().includes(q),
      );
    }
    if (params?.status) {
      filtered = filtered.filter((l) => l.status === params.status);
    }
    if (params?.studentId) {
      filtered = filtered.filter((l) => l.studentId === params.studentId);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }

  async createLoan(data: CreateLoanDto): Promise<BookLoan> {
    await delay(400);
    const maxId = this.loans.length > 0 ? Math.max(...this.loans.map((l) => l.id)) : 0;
    const book = this.books.find((b) => b.id === data.bookId);
    const name = generateName(data.studentId);
    const loan: BookLoan = {
      id: maxId + 1,
      bookId: data.bookId,
      bookTitle: book?.title ?? 'Noma\'lum kitob',
      studentId: data.studentId,
      studentName: name.full,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: data.dueDate,
      status: 'active',
    };
    this.loans.unshift(loan);
    return loan;
  }

  async returnBook(loanId: number): Promise<BookLoan> {
    await delay(300);
    const idx = this.loans.findIndex((l) => l.id === loanId);
    if (idx === -1) throw new Error('Kitob berish topilmadi');
    this.loans[idx] = {
      ...this.loans[idx]!,
      status: 'returned',
      returnDate: new Date().toISOString().slice(0, 10),
    };
    return this.loans[idx]!;
  }
}
