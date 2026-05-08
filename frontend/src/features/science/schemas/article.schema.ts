import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(5, "Maqola nomi kamida 5 ta belgidan iborat bo'lishi kerak"),
  authors: z.string().min(3, "Mualliflar kamida 3 ta belgidan iborat bo'lishi kerak"),
  journal: z.string().min(3, "Jurnal nomi kamida 3 ta belgidan iborat bo'lishi kerak"),
  year: z.coerce.number().min(2000, "Yil 2000 dan kichik bo'lishi mumkin emas").max(2030, "Yil 2030 dan katta bo'lishi mumkin emas"),
  type: z.enum(['scopus', 'wos', 'vak', 'local'], { message: 'Maqola turini tanlang' }),
  doi: z.string().optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
