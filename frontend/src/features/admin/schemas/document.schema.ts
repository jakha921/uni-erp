import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const documentSchema = z.object({
  title: requiredString('Sarlavha kiritilishi shart'),
  category: requiredString('Kategoriya kiritilishi shart'),
  folderId: z.coerce.number().min(1, 'Papka tanlanishi shart'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    message: 'Muhimlik darajasi tanlanishi shart',
  }),
  fileUrl: z.string().optional(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;
