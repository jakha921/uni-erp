import type {
  Book,
  BookLoan,
  BookListParams,
  LoanListParams,
  CreateBookDto,
  UpdateBookDto,
  CreateLoanDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { LibraryMockService } from '../mock/library.mock';

export interface ILibraryService {
  getBooks(params?: BookListParams): Promise<PaginatedResponse<Book>>;
  getBookById(id: number): Promise<Book>;
  createBook(data: CreateBookDto): Promise<Book>;
  updateBook(id: number, data: UpdateBookDto): Promise<Book>;
  getLoans(params?: LoanListParams): Promise<PaginatedResponse<BookLoan>>;
  createLoan(data: CreateLoanDto): Promise<BookLoan>;
  returnBook(loanId: number): Promise<BookLoan>;
}

class LibraryApiService implements ILibraryService {
  async getBooks(params?: BookListParams): Promise<PaginatedResponse<Book>> {
    return apiClient.get<PaginatedResponse<Book>>(ENDPOINTS.library.books, {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        category: params?.category,
        available: params?.available,
      },
    });
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
    return apiClient.get<PaginatedResponse<BookLoan>>(ENDPOINTS.library.loans, {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        status: params?.status,
        student_id: params?.studentId,
      },
    });
  }

  async createLoan(data: CreateLoanDto): Promise<BookLoan> {
    return apiClient.post<BookLoan>(ENDPOINTS.library.loans, data);
  }

  async returnBook(loanId: number): Promise<BookLoan> {
    return apiClient.post<BookLoan>(ENDPOINTS.library.returnBook(loanId));
  }
}

export const libraryService: ILibraryService = USE_MOCK
  ? new LibraryMockService()
  : new LibraryApiService();
