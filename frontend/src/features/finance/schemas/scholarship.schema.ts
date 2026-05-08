import { z } from 'zod';

export const scholarshipSchema = z.object({
  studentId: z.coerce.number().positive("Talabani tanlash shart"),
  type: z.enum(['davlat', 'prezident', 'fanlar', 'ijtimoiy', 'maxsus'], {
    message: 'Stipendiya turini tanlang',
  }),
  amount: z.coerce.number().positive("Summa 0 dan katta bo'lishi kerak"),
  startDate: z.string().min(1, "Boshlanish sanasi kiritilishi shart"),
  endDate: z.string().min(1, "Tugash sanasi kiritilishi shart"),
  basis: z.string().min(1, "Asosni kiriting"),
});

export type ScholarshipFormData = z.infer<typeof scholarshipSchema>;
