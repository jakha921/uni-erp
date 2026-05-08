import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  BookListParams,
  LoanListParams,
  CreateBookDto,
  UpdateBookDto,
  CreateLoanDto,
} from '@/types/education';
import { libraryService } from '../services/library.service';

const KEYS = {
  all: ['library'] as const,
  books: () => [...KEYS.all, 'books'] as const,
  bookList: (params?: BookListParams) => [...KEYS.books(), 'list', params] as const,
  bookDetail: (id: number) => [...KEYS.books(), 'detail', id] as const,
  loans: () => [...KEYS.all, 'loans'] as const,
  loanList: (params?: LoanListParams) => [...KEYS.loans(), 'list', params] as const,
};

export function useBooksList(params?: BookListParams) {
  return useQuery({
    queryKey: KEYS.bookList(params),
    queryFn: () => libraryService.getBooks(params),
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: KEYS.bookDetail(id),
    queryFn: () => libraryService.getBookById(id),
    enabled: id > 0,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookDto) => libraryService.createBook(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.books() });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookDto }) =>
      libraryService.updateBook(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: KEYS.books() });
      void queryClient.invalidateQueries({
        queryKey: KEYS.bookDetail(variables.id),
      });
    },
  });
}

export function useLoansList(params?: LoanListParams) {
  return useQuery({
    queryKey: KEYS.loanList(params),
    queryFn: () => libraryService.getLoans(params),
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLoanDto) => libraryService.createLoan(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.loans() });
      void queryClient.invalidateQueries({ queryKey: KEYS.books() });
    },
  });
}

export function useReturnBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: number) => libraryService.returnBook(loanId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.loans() });
      void queryClient.invalidateQueries({ queryKey: KEYS.books() });
    },
  });
}
