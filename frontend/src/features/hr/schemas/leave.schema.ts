import { z } from 'zod';

export const leaveSchema = z
  .object({
    employeeId: z.coerce.number().min(1, 'Xodimni tanlang'),
    type: z.enum(
      ['annual', 'sick', 'maternity', 'unpaid', 'business_trip', 'study'],
      { message: "Ta'til turini tanlang" },
    ),
    startDate: z.string().min(1, 'Boshlanish sanasini kiriting'),
    endDate: z.string().min(1, 'Tugash sanasini kiriting'),
    reason: z.string().min(2, 'Sabab kamida 2 ta belgidan iborat'),
    destination: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak",
    path: ['endDate'],
  });

export type LeaveFormData = z.infer<typeof leaveSchema>;
