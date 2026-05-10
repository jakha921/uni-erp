import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgi bo\'lishi kerak'),
  email: z.string().email('Email noto\'g\'ri formatda'),
  phone: z.string().min(9, 'Telefon raqami noto\'g\'ri'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Joriy parol kiritilishi shart'),
    newPassword: z.string().min(8, 'Yangi parol kamida 8 ta belgi bo\'lishi kerak'),
    confirmPassword: z.string().min(1, 'Parolni tasdiqlash kiritilishi shart'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Parollar mos kelmadi',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
