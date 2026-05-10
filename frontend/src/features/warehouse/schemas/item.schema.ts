import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const itemSchema = z.object({
  name: requiredString('Nomi kiritilishi shart'),
  sku: requiredString('SKU kiritilishi shart'),
  category: z.enum(['office', 'cleaning', 'technical', 'furniture', 'food', 'other'], {
    message: 'Kategoriya tanlanishi shart',
  }),
  unit: requiredString("O'lchov birligi kiritilishi shart"),
  minQuantity: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  location: requiredString('Joylashuv kiritilishi shart'),
});

export type ItemFormData = z.infer<typeof itemSchema>;

export const movementSchema = z.object({
  itemId: z.coerce.number().min(1, 'Tovar tanlanishi shart'),
  type: z.enum(['incoming', 'outgoing', 'write_off', 'transfer'], {
    message: 'Harakat turi tanlanishi shart',
  }),
  quantity: z.coerce.number().min(1, "Miqdor 1 dan kam bo'lishi mumkin emas"),
  note: z.string().optional(),
});

export type MovementFormData = z.infer<typeof movementSchema>;
