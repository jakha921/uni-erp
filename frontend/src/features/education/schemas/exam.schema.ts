import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const createExamSchema = z.object({
  subjectId: z.coerce.number().min(1, 'Fan tanlanishi shart'),
  groupId: z.coerce.number().min(1, 'Guruh tanlanishi shart'),
  examDate: requiredString('Imtihon sanasi kiritilishi shart'),
  room: requiredString('Xona kiritilishi shart'),
  type: z.enum(['midterm', 'final'], {
    message: 'Imtihon turi tanlanishi shart',
  }),
  teacherId: z.coerce.number().min(1, "O'qituvchi tanlanishi shart"),
});

export type CreateExamFormData = z.infer<typeof createExamSchema>;

export const updateExamSchema = createExamSchema.partial();

export type UpdateExamFormData = z.infer<typeof updateExamSchema>;
