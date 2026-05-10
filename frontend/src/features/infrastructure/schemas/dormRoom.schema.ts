import { z } from 'zod';

export const dormRoomSchema = z.object({
  buildingId: z.coerce.number().min(1, 'Bino tanlanishi shart'),
  number: z.coerce.number().min(1, 'Xona raqami kiritilishi shart'),
  floor: z.coerce.number().min(1, 'Qavat kiritilishi shart'),
  capacity: z.coerce.number().min(1, "Sig'im kiritilishi shart"),
  status: z.enum(['available', 'partial', 'full', 'repair'], {
    message: 'Holat tanlanishi shart',
  }),
});

export type DormRoomFormData = z.infer<typeof dormRoomSchema>;
