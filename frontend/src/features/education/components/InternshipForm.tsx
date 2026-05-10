import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormDatePicker } from '@/components/form';
import { createInternshipSchema, type CreateInternshipFormData } from '../schemas/internship.schema';
import type { Internship } from '@/types/education';

interface InternshipFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInternshipFormData) => void;
  internship?: Internship | null;
  students: { id: number; fullName: string }[];
  loading?: boolean;
}

const TYPE_OPTIONS = [
  { value: 'production', label: 'Ishlab chiqarish amaliyoti' },
  { value: 'pre_diploma', label: 'Diplom oldi amaliyoti' },
];

export function InternshipForm({ open, onClose, onSubmit, internship, students, loading }: InternshipFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateInternshipFormData>({
    resolver: zodResolver(createInternshipSchema) as unknown as Resolver<CreateInternshipFormData>,
    defaultValues: internship
      ? {
          studentId: internship.studentId,
          companyName: internship.companyName,
          supervisorName: internship.supervisorName,
          startDate: internship.startDate,
          endDate: internship.endDate,
          type: internship.type,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={internship ? 'Amaliyotni tahrirlash' : 'Yangi amaliyot'}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {internship ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Talaba" error={errors.studentId?.message} required>
          <FormSelect
            {...register('studentId')}
            options={students.map((s) => ({ value: String(s.id), label: s.fullName }))}
            placeholder="Talabani tanlang"
            error={!!errors.studentId}
          />
        </FormField>

        <FormField label="Amaliyot turi" error={errors.type?.message} required>
          <FormSelect
            {...register('type')}
            options={TYPE_OPTIONS}
            placeholder="Turni tanlang"
            error={!!errors.type}
          />
        </FormField>

        <FormField label="Korxona nomi" error={errors.companyName?.message} required>
          <FormInput {...register('companyName')} placeholder="Korxona nomi" error={!!errors.companyName} />
        </FormField>

        <FormField label="Rahbar ismi" error={errors.supervisorName?.message} required>
          <FormInput {...register('supervisorName')} placeholder="Rahbar F.I.O" error={!!errors.supervisorName} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Boshlanish sanasi" error={errors.startDate?.message} required>
            <FormDatePicker {...register('startDate')} error={!!errors.startDate} />
          </FormField>
          <FormField label="Tugash sanasi" error={errors.endDate?.message} required>
            <FormDatePicker {...register('endDate')} error={!!errors.endDate} />
          </FormField>
        </div>
      </div>
    </SlideOver>
  );
}
