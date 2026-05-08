import { z } from 'zod';

export const projectSchema = z
  .object({
    title: z.string().min(5, "Loyiha nomi kamida 5 ta belgidan iborat bo'lishi kerak"),
    leaderId: z.coerce.number().min(1, 'Rahbarni tanlang'),
    description: z.string().min(10, 'Tavsif kamida 10 ta belgidan iborat'),
    fundAmount: z.coerce.number().min(0, "Moliyalashtirish summasi manfiy bo'lishi mumkin emas"),
    startDate: z.string().min(1, 'Boshlanish sanasini kiriting'),
    endDate: z.string().min(1, 'Tugash sanasini kiriting'),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak",
    path: ['endDate'],
  });

export type ProjectFormData = z.infer<typeof projectSchema>;
