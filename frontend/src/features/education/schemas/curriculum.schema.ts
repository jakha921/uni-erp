import { z } from 'zod';

export const curriculumSubjectSchema = z.object({
  subjectId: z.coerce.number().min(1, 'Fan tanlanishi shart'),
  semester: z.coerce.number().min(1).max(8, 'Semestr 1-8 orasida'),
  credits: z.coerce.number().min(1, "Kredit soni kamida 1 bo'lishi kerak").max(10),
  hoursLecture: z.coerce.number().min(0, "Soat soni manfiy bo'lishi mumkin emas"),
  hoursPractice: z.coerce.number().min(0, "Soat soni manfiy bo'lishi mumkin emas"),
  hoursLab: z.coerce.number().min(0, "Soat soni manfiy bo'lishi mumkin emas"),
  controlForm: z.enum(['exam', 'credit', 'diff_credit'], {
    message: 'Nazorat shakli tanlanishi shart',
  }),
  isElective: z.boolean(),
});

export const createCurriculumSchema = z.object({
  specialtyId: z.coerce.number().min(1, "Mutaxassislik tanlanishi shart"),
  year: z.coerce
    .number()
    .min(2020, "Yil noto'g'ri")
    .max(2030, "Yil noto'g'ri"),
  subjects: z.array(curriculumSubjectSchema).min(1, "Kamida bitta fan qo'shilishi kerak"),
});

export type CreateCurriculumFormData = z.infer<typeof createCurriculumSchema>;

export const updateCurriculumSchema = createCurriculumSchema.partial();

export type UpdateCurriculumFormData = z.infer<typeof updateCurriculumSchema>;
