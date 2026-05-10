import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { createAlumniSchema, type CreateAlumniFormData } from '../schemas/alumni.schema';
import type { Alumni } from '@/types/education';

interface AlumniFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAlumniFormData) => void;
  alumni?: Alumni | null;
  loading?: boolean;
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const y = currentYear - i;
  return { value: String(y), label: String(y) };
});

export function AlumniForm({ open, onClose, onSubmit, alumni, loading }: AlumniFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAlumniFormData>({
    resolver: zodResolver(createAlumniSchema) as unknown as Resolver<CreateAlumniFormData>,
    defaultValues: alumni
      ? {
          fullName: alumni.fullName,
          graduationYear: alumni.graduationYear,
          faculty: alumni.faculty,
          specialty: alumni.specialty,
          workplace: alumni.workplace ?? '',
          position: alumni.position ?? '',
          phone: alumni.phone,
          email: alumni.email,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={alumni ? 'Bitiruvchini tahrirlash' : 'Yangi bitiruvchi'}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {alumni ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="To'liq ismi" error={errors.fullName?.message} required>
          <FormInput {...register('fullName')} placeholder="Karimov Alisher Bekovich" error={!!errors.fullName} />
        </FormField>

        <FormField label="Bitirgan yili" error={errors.graduationYear?.message} required>
          <FormSelect
            {...register('graduationYear')}
            options={YEAR_OPTIONS}
            placeholder="Yilni tanlang"
            error={!!errors.graduationYear}
          />
        </FormField>

        <FormField label="Fakultet" error={errors.faculty?.message} required>
          <FormInput {...register('faculty')} placeholder="IT fakulteti" error={!!errors.faculty} />
        </FormField>

        <FormField label="Mutaxassislik" error={errors.specialty?.message} required>
          <FormInput {...register('specialty')} placeholder="Dasturiy injiniring" error={!!errors.specialty} />
        </FormField>

        <FormField label="Ish joyi" error={errors.workplace?.message}>
          <FormInput {...register('workplace')} placeholder="IT компания" error={!!errors.workplace} />
        </FormField>

        <FormField label="Lavozimi" error={errors.position?.message}>
          <FormInput {...register('position')} placeholder="Senior Developer" error={!!errors.position} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Telefon" error={errors.phone?.message} required>
            <FormInput {...register('phone')} placeholder="+998 90 123-45-67" error={!!errors.phone} />
          </FormField>
          <FormField label="Email" error={errors.email?.message} required>
            <FormInput {...register('email')} type="email" placeholder="karimov@example.com" error={!!errors.email} />
          </FormField>
        </div>
      </div>
    </SlideOver>
  );
}
