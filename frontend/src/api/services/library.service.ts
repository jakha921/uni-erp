import type {
  Book,
  BookLoan,
  BookListParams,
  LoanListParams,
  CreateBookDto,
  UpdateBookDto,
  CreateLoanDto,
  BookQueueEntry,
  CreateQueueEntryDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { LibraryMockService } from '../mock/library.mock';

export interface ILibraryService {
  getBooks(params?: BookListParams): Promise<PaginatedResponse<Book>>;
  getBookById(id: number): Promise<Book>;
  createBook(data: CreateBookDto): Promise<Book>;
  updateBook(id: number, data: UpdateBookDto): Promise<Book>;
  getLoans(params?: LoanListParams): Promise<PaginatedResponse<BookLoan>>;
  createLoan(data: CreateLoanDto): Promise<BookLoan>;
  returnBook(loanId: number): Promise<BookLoan>;
  getQueue(): Promise<BookQueueEntry[]>;
  addToQueue(data: CreateQueueEntryDto): Promise<BookQueueEntry>;
  removeFromQueue(id: number): Promise<void>;
}

class LibraryApiService implements ILibraryService {
  async getBooks(params?: BookListParams): Promise<PaginatedResponse<Book>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Book[] }>(ENDPOINTS.library.books, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        category: params?.category,
        available: params?.available,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getBookById(id: number): Promise<Book> {
    return apiClient.get<Book>(ENDPOINTS.library.bookDetail(id));
  }

  async createBook(data: CreateBookDto): Promise<Book> {
    return apiClient.post<Book>(ENDPOINTS.library.books, data);
  }

  async updateBook(id: number, data: UpdateBookDto): Promise<Book> {
    return apiClient.patch<Book>(ENDPOINTS.library.bookDetail(id), data);
  }

  async getLoans(params?: LoanListParams): Promise<PaginatedResponse<BookLoan>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: BookLoan[] }>(ENDPOINTS.library.loans, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        status: params?.status,
        student_id: params?.studentId,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async createLoan(data: CreateLoanDto): Promise<BookLoan> {
    return apiClient.post<BookLoan>(ENDPOINTS.library.loans, data);
  }

  async returnBook(loanId: number): Promise<BookLoan> {
    return apiClient.post<BookLoan>(ENDPOINTS.library.returnBook(loanId));
  }

  async getQueue(): Promise<BookQueueEntry[]> {
    return apiClient.get<BookQueueEntry[]>(ENDPOINTS.library.queue);
  }

  async addToQueue(data: CreateQueueEntryDto): Promise<BookQueueEntry> {
    return apiClient.post<BookQueueEntry>(ENDPOINTS.library.queue, data);
  }

  async removeFromQueue(id: number): Promise<void> {
    return apiClient.delete<void>(`${ENDPOINTS.library.queue}/${id}/`);
  }
}

export const libraryService: ILibraryService = USE_MOCK
  ? new LibraryMockService()
  : new LibraryApiService();
