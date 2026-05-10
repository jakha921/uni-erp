import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormTextarea, FormDatePicker } from '@/components/form';
import { conferenceSchema, type ConferenceFormData } from '../schemas/conference.schema';

interface ConferenceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ConferenceFormData) => void;
  conference?: Partial<ConferenceFormData> & { id?: number } | null;
  loading?: boolean;
}

const TYPE_OPTIONS = [
  { value: 'international', label: 'Xalqaro' },
  { value: 'national', label: 'Respublika' },
  { value: 'university', label: 'Universitet' },
];

export function ConferenceForm({ open, onClose, onSubmit, conference, loading }: ConferenceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConferenceFormData>({
    resolver: zodResolver(conferenceSchema) as unknown as Resolver<ConferenceFormData>,
    defaultValues: conference ?? undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={conference ? "Konferensiyani tahrirlash" : "Yangi konferensiya"}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {conference ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Konferensiya nomi" error={errors.name?.message} required>
          <FormInput {...register('name')} placeholder="Konferensiya nomi" error={!!errors.name} />
        </FormField>

        <FormField label="Turi" error={errors.type?.message} required>
          <FormSelect
            {...register('type')}
            options={TYPE_OPTIONS}
            placeholder="Turni tanlang"
            error={!!errors.type}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Boshlanish sanasi" error={errors.date?.message} required>
            <FormDatePicker {...register('date')} error={!!errors.date} />
          </FormField>
          <FormField label="Tugash sanasi" error={errors.endDate?.message}>
            <FormDatePicker {...register('endDate')} error={!!errors.endDate} />
          </FormField>
        </div>

        <FormField label="Joylashuv" error={errors.location?.message} required>
          <FormInput {...register('location')} placeholder="Shahar, Muassasa" error={!!errors.location} />
        </FormField>

        <FormField label="Tavsif" error={errors.description?.message} required>
          <FormTextarea
            {...register('description')}
            placeholder="Konferensiya haqida qisqacha..."
            rows={3}
            error={!!errors.description}
          />
        </FormField>
      </div>
    </SlideOver>
  );
}
