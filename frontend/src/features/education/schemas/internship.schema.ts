import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const createInternshipSchema = z.object({
  studentId: z.coerce.number().min(1, 'Talaba tanlanishi shart'),
  companyName: requiredString('Korxona nomi kiritilishi shart'),
  supervisorName: requiredString('Rahbar ismi kiritilishi shart'),
  startDate: requiredString('Boshlanish sanasi kiritilishi shart'),
  endDate: requiredString('Tugash sanasi kiritilishi shart'),
  type: z.enum(['production', 'pre_diploma'], {
    message: 'Amaliyot turi tanlanishi shart',
  }),
});

export type CreateInternshipFormData = z.infer<typeof createInternshipSchema>;

export const updateInternshipSchema = createInternshipSchema.partial();

export type UpdateInternshipFormData = z.infer<typeof updateInternshipSchema>;
