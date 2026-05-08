import { z } from 'zod';
import { requiredString, phoneSchema, emailSchema } from '@/lib/validators';
import type { LeadSource } from '@/types/crm';

const LEAD_SOURCES: [LeadSource, ...LeadSource[]] = [
  'website',
  'telegram',
  'instagram',
  'referral',
  'event',
  'call',
];

export const createLeadSchema = z.object({
  firstName: requiredString('Ism kiritilishi shart'),
  lastName: requiredString('Familiya kiritilishi shart'),
  phone: phoneSchema,
  email: emailSchema,
  direction: requiredString("Yo'nalish tanlanishi shart"),
  source: z.enum(LEAD_SOURCES, { message: 'Manba tanlanishi shart' }),
  notes: z.string().optional(),
  assigneeId: z.coerce.number().optional(),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z
    .enum(['new', 'contacted', 'interested', 'applied', 'enrolled', 'rejected'])
    .optional(),
  nextContactDate: z.string().optional(),
});

export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
