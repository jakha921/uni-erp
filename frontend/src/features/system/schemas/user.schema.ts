import { z } from 'zod';

const requiredString = (msg: string) => z.string().min(1, msg);

export const userSchema = z.object({
  firstName: requiredString('Ism kiritilishi shart'),
  secondName: requiredString('Familiya kiritilishi shart'),
  phone: requiredString('Telefon kiritilishi shart'),
  email: z.string().email('Email noto\'g\'ri').optional().or(z.literal('')),
  password: z.string().min(8, 'Parol kamida 8 ta belgi bo\'lishi kerak').optional().or(z.literal('')),
  role: requiredString('Rol tanlanishi shart'),
});

export type UserFormData = z.infer<typeof userSchema>;
