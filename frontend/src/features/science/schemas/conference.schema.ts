import { z } from 'zod';

export const conferenceSchema = z.object({
  name: z.string().min(5, "Konferensiya nomi kamida 5 ta belgidan iborat bo'lishi kerak"),
  date: z.string().min(1, 'Boshlanish sanasini kiriting'),
  endDate: z.string().optional(),
  location: z.string().min(3, "Joy nomi kamida 3 ta belgidan iborat bo'lishi kerak"),
  type: z.enum(['international', 'national', 'university'], { message: 'Konferensiya turini tanlang' }),
  description: z.string().min(10, 'Tavsif kamida 10 ta belgidan iborat'),
});

export type ConferenceFormData = z.infer<typeof conferenceSchema>;
