import { z } from 'zod';

export const employeeSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  secondName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  thirdName: z.string().min(2, "Otasining ismi kamida 2 ta belgidan iborat bo'lishi kerak"),
  gender: z.string().min(1, 'Jinsni tanlang'),
  birthDate: z.string().min(1, "Tug'ilgan sanani kiriting"),
  departmentId: z.coerce.number().min(1, "Bo'limni tanlang"),
  positionCode: z.string().min(1, 'Lavozimni tanlang'),
  academicDegree: z.string().min(1, 'Ilmiy darajani tanlang'),
  academicRank: z.string().min(1, 'Ilmiy unvonni tanlang'),
  employmentForm: z.string().min(1, 'Ish turini tanlang'),
  hireDate: z.string().min(1, 'Ishga qabul sanasini kiriting'),
  phone: z.string().min(9, 'Telefon raqamini kiriting'),
  email: z.string().email("Noto'g'ri email format"),
  passport: z.string().min(5, 'Pasport seriya va raqamini kiriting'),
  pinfl: z.string().length(14, 'JSHSHIR 14 ta raqamdan iborat'),
  salary: z.coerce.number().min(0, "Maosh manfiy bo'lishi mumkin emas"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
