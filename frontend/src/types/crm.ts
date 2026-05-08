import type { PersonName } from './shared';

export type LeadStatus = 'Yangi' | "Qo'ng'iroq" | 'Kutilmoqda' | 'Qabul' | 'Rad';

export type LeadSource = 'Website' | 'Telegram' | 'Instagram' | 'Referral';

export interface Lead {
  id: number;
  name: PersonName;
  phone: string;
  direction: string;
  source: LeadSource;
  status: LeadStatus;
  assignee: string;
  date: string;
}
