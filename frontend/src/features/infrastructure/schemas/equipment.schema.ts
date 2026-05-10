import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const equipmentSchema = z.object({
  name: requiredString('Nomi kiritilishi shart'),
  inventoryNumber: requiredString('Inventar raqami kiritilishi shart'),
  category: requiredString('Kategoriya kiritilishi shart'),
  location: requiredString('Joylashuv kiritilishi shart'),
  responsiblePerson: requiredString("Mas'ul shaxs kiritilishi shart"),
  purchaseDate: requiredString('Sotib olingan sana kiritilishi shart'),
  cost: z.coerce.number().min(0, "Narx 0 dan kam bo'lishi mumkin emas"),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;
