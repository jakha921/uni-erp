import { z } from 'zod';

export const newsSchema = z.object({
  title: z.string().min(5, "Sarlavha kamida 5 ta belgidan iborat bo'lishi kerak"),
  content: z.string().min(20, 'Matn kamida 20 ta belgidan iborat'),
  category: z.string().min(1, 'Kategoriyani tanlang'),
  tags: z.array(z.string()).min(1, 'Kamida bitta teg kiriting'),
});

export type NewsFormData = z.infer<typeof newsSchema>;
