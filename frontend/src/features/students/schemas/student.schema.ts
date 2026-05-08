import { z } from 'zod';
import {
  requiredString,
  phoneSchema,
  pinflSchema,
  passportSchema,
  emailSchema,
} from '@/lib/validators';

export const createStudentSchema = z.object({
  firstName: requiredString('Ism kiritilishi shart'),
  secondName: requiredString('Familiya kiritilishi shart'),
  thirdName: requiredString('Sharif kiritilishi shart'),
  gender: requiredString('Jinsi tanlanishi shart'),
  birthDate: requiredString("Tug'ilgan sana kiritilishi shart"),
  facultyId: z.coerce.number().min(1, 'Fakultet tanlanishi shart'),
  departmentId: z.coerce.number().min(1, 'Kafedra tanlanishi shart'),
  specialtyId: z.coerce.number().min(1, "Mutaxassislik tanlanishi shart"),
  groupId: z.coerce.number().min(1, 'Guruh tanlanishi shart'),
  level: requiredString('Kurs tanlanishi shart'),
  educationForm: requiredString("Ta'lim shakli tanlanishi shart"),
  educationType: requiredString("Ta'lim turi tanlanishi shart"),
  paymentForm: requiredString("To'lov shakli tanlanishi shart"),
  phone: phoneSchema,
  email: emailSchema,
  passport: passportSchema,
  pinfl: pinflSchema,
  address: requiredString('Manzil kiritilishi shart'),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = createStudentSchema.partial();

export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;
