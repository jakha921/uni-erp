import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { subjectSchema, type SubjectFormData } from '../schemas/subject.schema';
import type { Subject } from '@/types/education';

interface SubjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => void;
  subject?: Subject | null;
  departments: { id: number; name: string }[];
  loading?: boolean;
}

export function SubjectForm({ open, onClose, onSubmit, subject, departments, loading }: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema) as unknown as Resolver<SubjectFormData>,
    defaultValues: subject
      ? {
          name: subject.name,
          code: subject.code,
          credits: subject.credits,
          hoursLecture: subject.hoursLecture,
          hoursPractice: subject.hoursPractice,
          departmentId: subject.departmentId,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={subject ? 'Fanni tahrirlash' : "Yangi fan"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {subject ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fan nomi" error={errors.name?.message} required>
            <FormInput {...register('name')} placeholder="Matematika" error={!!errors.name} />
          </FormField>
          <FormField label="Kod" error={errors.code?.message} required>
            <FormInput {...register('code')} placeholder="MATH101" error={!!errors.code} />
          </FormField>
        </div>

        <FormField label="Kafedra" error={errors.departmentId?.message} required>
          <FormSelect
            {...register('departmentId')}
            options={departments.map((d) => ({ value: String(d.id), label: d.name }))}
            placeholder="Kafedrani tanlang"
            error={!!errors.departmentId}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Kreditlar" error={errors.credits?.message} required>
            <FormInput {...register('credits')} type="number" placeholder="3" error={!!errors.credits} />
          </FormField>
          <FormField label="Ma'ruza (soat)" error={errors.hoursLecture?.message} required>
            <FormInput {...register('hoursLecture')} type="number" placeholder="30" error={!!errors.hoursLecture} />
          </FormField>
          <FormField label="Amaliy (soat)" error={errors.hoursPractice?.message} required>
            <FormInput {...register('hoursPractice')} type="number" placeholder="15" error={!!errors.hoursPractice} />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}
