import { z } from 'zod';
import { requiredString, phoneSchema, emailSchema } from '@/lib/validators';

export const createAlumniSchema = z.object({
  fullName: requiredString("To'liq ism kiritilishi shart"),
  graduationYear: z.coerce
    .number()
    .min(2000, "Yil noto'g'ri")
    .max(new Date().getFullYear(), "Yil noto'g'ri"),
  faculty: requiredString('Fakultet tanlanishi shart'),
  specialty: requiredString("Mutaxassislik tanlanishi shart"),
  workplace: z.string().optional(),
  position: z.string().optional(),
  phone: phoneSchema,
  email: emailSchema,
});

export type CreateAlumniFormData = z.infer<typeof createAlumniSchema>;

export const updateAlumniSchema = createAlumniSchema.partial();

export type UpdateAlumniFormData = z.infer<typeof updateAlumniSchema>;
