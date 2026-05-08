import { z } from 'zod';

export const paymentSchema = z.object({
  contractId: z.string().min(1, 'Kontraktni tanlash shart'),
  amount: z.coerce.number().positive("Summa 0 dan katta bo'lishi kerak"),
  paymentDate: z.string().min(1, "Sana kiritilishi shart"),
  paymentMethod: z.enum(['bank', 'naqd', 'online', 'click', 'payme'], {
    message: "To'lov usulini tanlang",
  }),
  receiptNumber: z.string().min(1, "Kvitansiya raqami kiritilishi shart"),
  note: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
