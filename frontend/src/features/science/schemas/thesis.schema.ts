import { z } from 'zod';

export const thesisSchema = z.object({
  title: z.string().min(10, "Mavzu nomi kamida 10 ta belgidan iborat bo'lishi kerak"),
  studentId: z.coerce.number().min(1, 'Talabani tanlang'),
  supervisorId: z.coerce.number().min(1, 'Ilmiy rahbarni tanlang'),
  type: z.enum(['bakalavr', 'magistr'], { message: "Bitiruv ishi turini tanlang" }),
});

export type ThesisFormData = z.infer<typeof thesisSchema>;
