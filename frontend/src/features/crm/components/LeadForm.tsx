import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormTextarea } from '@/components/form';
import { createLeadSchema, type CreateLeadFormData } from '../schemas/lead.schema';
import type { Lead } from '@/types/crm';

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadFormData) => void;
  lead?: Lead | null;
  loading?: boolean;
}

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Veb-sayt' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: "Do'stlar tavsiyasi" },
  { value: 'event', label: 'Tadbir / Ko\'rgazma' },
  { value: 'call', label: 'Telefon qo\'ng\'irog\'i' },
];

const DIRECTION_OPTIONS = [
  { value: 'it', label: 'Axborot texnologiyalari' },
  { value: 'cs', label: 'Kiberxavfsizlik' },
  { value: 'ds', label: "Ma'lumotlar fanlari" },
  { value: 'ai', label: "Sun'iy intellekt" },
  { value: 'econ', label: 'Iqtisodiyot' },
  { value: 'mgmt', label: 'Menejment' },
];

export function LeadForm({ open, onClose, onSubmit, lead, loading }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema) as unknown as Resolver<CreateLeadFormData>,
    defaultValues: lead
      ? {
          firstName: lead.firstName,
          lastName: lead.lastName,
          phone: lead.phone,
          email: lead.email ?? '',
          direction: lead.direction,
          source: lead.source,
          notes: lead.notes ?? '',
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={lead ? "Murojaatni tahrirlash" : "Yangi murojaat"}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {lead ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ismi" error={errors.firstName?.message} required>
            <FormInput {...register('firstName')} placeholder="Alisher" error={!!errors.firstName} />
          </FormField>
          <FormField label="Familiyasi" error={errors.lastName?.message} required>
            <FormInput {...register('lastName')} placeholder="Karimov" error={!!errors.lastName} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Telefon" error={errors.phone?.message} required>
            <FormInput {...register('phone')} placeholder="+998 90 123-45-67" error={!!errors.phone} />
          </FormField>
          <FormField label="Email" error={errors.email?.message} required>
            <FormInput {...register('email')} type="email" placeholder="email@example.com" error={!!errors.email} />
          </FormField>
        </div>

        <FormField label="Yo'nalish" error={errors.direction?.message} required>
          <FormSelect
            {...register('direction')}
            options={DIRECTION_OPTIONS}
            placeholder="Yo'nalishni tanlang"
            error={!!errors.direction}
          />
        </FormField>

        <FormField label="Murojaat manbasi" error={errors.source?.message} required>
          <FormSelect
            {...register('source')}
            options={SOURCE_OPTIONS}
            placeholder="Manbani tanlang"
            error={!!errors.source}
          />
        </FormField>

        <FormField label="Izoh" error={errors.notes?.message}>
          <FormTextarea {...register('notes')} placeholder="Qo'shimcha ma'lumot..." rows={3} error={!!errors.notes} />
        </FormField>
      </div>
    </SlideOver>
  );
}
