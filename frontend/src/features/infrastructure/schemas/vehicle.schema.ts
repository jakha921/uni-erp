import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const vehicleSchema = z.object({
  brand: requiredString('Marka kiritilishi shart'),
  model: requiredString('Model kiritilishi shart'),
  plateNumber: requiredString('Davlat raqami kiritilishi shart'),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  driverName: requiredString('Haydovchi ismi kiritilishi shart'),
  route: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
