import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const scheduleSchema = z.object({
  groupId: z.coerce.number().min(1, 'Guruh tanlanishi shart'),
  subjectId: z.coerce.number().min(1, 'Fan tanlanishi shart'),
  teacherId: z.coerce.number().min(1, "O'qituvchi tanlanishi shart"),
  semesterId: z.coerce.number().min(1, 'Semestr tanlanishi shart'),
  dayOfWeek: z.coerce.number().min(0).max(5),
  pairNumber: z.coerce.number().min(1).max(7),
  room: requiredString('Xona kiritilishi shart'),
  lessonType: z.enum(['lecture', 'practice', 'lab', 'seminar']),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
