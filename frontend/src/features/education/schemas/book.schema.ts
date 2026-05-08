import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const createBookSchema = z.object({
  title: requiredString('Kitob nomi kiritilishi shart'),
  author: requiredString('Muallif kiritilishi shart'),
  isbn: requiredString('ISBN kiritilishi shart').regex(
    /^978-\d{1}-\d{5}-\d{3}-\d{1}$/,
    "Noto'g'ri ISBN formati",
  ),
  year: z.coerce
    .number()
    .min(1900, "Yil noto'g'ri")
    .max(new Date().getFullYear() + 1, "Yil noto'g'ri"),
  category: requiredString('Kategoriya tanlanishi shart'),
  totalCopies: z.coerce.number().min(1, "Nusxalar soni kamida 1 bo'lishi kerak"),
  location: requiredString('Joylashuv kiritilishi shart'),
});

export type CreateBookFormData = z.infer<typeof createBookSchema>;

export const updateBookSchema = createBookSchema.partial();

export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
