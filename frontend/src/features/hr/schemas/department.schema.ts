import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const departmentSchema = z.object({
  name: requiredString("Bo'lim nomi kiritilishi shart"),
  code: requiredString('Kod kiritilishi shart'),
  type: z.enum(['rektorat', 'fakultet', 'kafedra', 'bolim'], {
    message: "Tur tanlanishi shart",
  }),
  parentId: z.coerce.number().nullable().optional(),
  headId: z.coerce.number().nullable().optional(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
