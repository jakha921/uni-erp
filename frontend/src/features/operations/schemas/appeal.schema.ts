import { z } from 'zod';

export const appealSchema = z.object({
  title: z.string().min(5, "Murojaat sarlavhasi kamida 5 ta belgidan iborat bo'lishi kerak"),
  description: z.string().min(10, 'Tavsif kamida 10 ta belgidan iborat'),
  category: z.enum(['complaint', 'request', 'suggestion', 'question'], { message: 'Kategoriyani tanlang' }),
});

export type AppealFormData = z.infer<typeof appealSchema>;
