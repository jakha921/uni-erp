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

export const smsCodeSchema = z.object({
  code: z.string().length(6, 'SMS kod 6 ta raqamdan iborat'),
});

export type SmsCodeFormData = z.infer<typeof smsCodeSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
  confirmPassword: z.string().min(6, 'Parolni tasdiqlang'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Parollar mos kelmadi',
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
