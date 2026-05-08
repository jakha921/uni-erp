import { z } from 'zod';

export const orderSchema = z.object({
  type: z.enum(
    ['hire', 'fire', 'transfer', 'promotion', 'salary_change', 'leave', 'business_trip', 'bonus', 'penalty'],
    { message: 'Buyruq turini tanlang' },
  ),
  employeeId: z.coerce.number().min(1, 'Xodimni tanlang'),
  effectiveDate: z.string().min(1, 'Kuchga kirish sanasini kiriting'),
  basis: z.string().min(2, 'Asos kamida 2 ta belgidan iborat'),
  title: z.string().min(3, 'Buyruq mazmunini kiriting'),
});

export type OrderFormData = z.infer<typeof orderSchema>;
