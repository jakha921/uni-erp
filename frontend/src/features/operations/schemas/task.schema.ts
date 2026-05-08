import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, "Vazifa nomi kamida 3 ta belgidan iborat bo'lishi kerak"),
  description: z.string().optional(),
  assigneeId: z.coerce.number().min(1, 'Mas\'ulni tanlang'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], { message: 'Muhimlik darajasini tanlang' }),
  dueDate: z.string().min(1, 'Muddatni kiriting'),
  tags: z.array(z.string()).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
