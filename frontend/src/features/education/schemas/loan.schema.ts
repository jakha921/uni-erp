import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const createLoanSchema = z.object({
  bookId: z.coerce.number().min(1, 'Kitob tanlanishi shart'),
  studentId: z.coerce.number().min(1, 'Talaba tanlanishi shart'),
  dueDate: requiredString('Qaytarish sanasi kiritilishi shart'),
});

export type CreateLoanFormData = z.infer<typeof createLoanSchema>;
