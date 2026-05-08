import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().min(1, 'Telefon raqami kiritilishi shart'),
  password: z.string().min(4, 'Parol kamida 4 ta belgi'),
  branch: z.string().optional(),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  phone: z.string().min(1, 'Telefon raqami kiritilishi shart'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
