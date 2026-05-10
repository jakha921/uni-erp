import { z } from 'zod';

const req = (msg: string) => z.string().min(1, msg);

export const roleSchema = z.object({
  name: req("Rol nomi kiritilishi shart"),
  nameUz: req("Rol nomi (uz) kiritilishi shart"),
  description: req("Tavsif kiritilishi shart"),
  color: z.string().min(1, "Rang tanlanishi shart"),
});

export type RoleFormData = z.infer<typeof roleSchema>;
