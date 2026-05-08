import { z } from 'zod';

export const patentSchema = z.object({
  title: z.string().min(5, "Patent nomi kamida 5 ta belgidan iborat bo'lishi kerak"),
  inventors: z.string().min(3, "Ixtirochilar kamida 3 ta belgidan iborat bo'lishi kerak"),
  applicationDate: z.string().min(1, 'Ariza sanasini kiriting'),
  category: z.string().min(1, 'Kategoriyani tanlang'),
});

export type PatentFormData = z.infer<typeof patentSchema>;
