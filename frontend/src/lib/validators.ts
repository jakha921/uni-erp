import { z } from 'zod';

export const phoneSchema = z
  .string()
  .min(1, 'Telefon raqami kiritilishi shart')
  .regex(/^\+?998\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, "Noto'g'ri telefon formati");

export const pinflSchema = z
  .string()
  .length(14, "PINFL 14 raqamdan iborat bo'lishi kerak")
  .regex(/^\d+$/, 'Faqat raqamlar');

export const passportSchema = z.string().regex(/^[A-Z]{2}\d{7}$/, 'Format: AA1234567');

export const emailSchema = z.string().email("Noto'g'ri email formati").optional().or(z.literal(''));

export const requiredString = (msg = "Maydon to'ldirilishi shart") => z.string().min(1, msg);
