import { z } from 'zod';

export const paymentScheduleItemSchema = z.object({
  dueDate: z.string().min(1, "Sana kiritilishi shart"),
  amount: z.coerce.number().positive("Summa 0 dan katta bo'lishi kerak"),
});

export const contractSchema = z.object({
  studentId: z.coerce.number().positive("Talabani tanlash shart"),
  contractType: z.enum(['bazoviy', 'tabaqalashtirilgan', 'grant', 'xorijiy'], {
    message: 'Kontrakt turini tanlang',
  }),
  contractAmount: z.coerce.number().positive("Summa 0 dan katta bo'lishi kerak"),
  contractDate: z.string().min(1, "Sana kiritilishi shart"),
  educationYear: z.string().min(1, "O'quv yilini tanlang"),
  paymentSchedule: z.array(paymentScheduleItemSchema).min(1, "Kamida bitta bo'lib to'lov kiriting"),
});

export type ContractFormData = z.infer<typeof contractSchema>;
