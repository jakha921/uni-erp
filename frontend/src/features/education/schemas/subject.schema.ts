import { z } from 'zod';
import { requiredString } from '@/lib/validators';

export const subjectSchema = z.object({
  name: requiredString('Fan nomi kiritilishi shart'),
  code: requiredString('Fan kodi kiritilishi shart'),
  credits: z.coerce.number().min(1, 'Kredit soni 1 dan kam bo\'lmasligi kerak').max(10),
  hoursLecture: z.coerce.number().min(0),
  hoursPractice: z.coerce.number().min(0),
  departmentId: z.coerce.number().min(1, 'Kafedra tanlanishi shart'),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;
