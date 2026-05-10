import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { thesisSchema, type ThesisFormData } from '../schemas/thesis.schema';

interface ThesisFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ThesisFormData) => void;
  thesis?: Partial<ThesisFormData> & { id?: number } | null;
  students: { id: number; fullName: string }[];
  supervisors: { id: number; fullName: string }[];
  loading?: boolean;
}

const TYPE_OPTIONS = [
  { value: 'bakalavr', label: 'Bakalavr bitiruv ishi' },
  { value: 'magistr', label: 'Magistr dissertatsiyasi' },
];

export function ThesisForm({ open, onClose, onSubmit, thesis, students, supervisors, loading }: ThesisFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ThesisFormData>({
    resolver: zodResolver(thesisSchema) as unknown as Resolver<ThesisFormData>,
    defaultValues: thesis ?? undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={thesis ? "Bitiruv ishini tahrirlash" : "Yangi bitiruv ishi"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {thesis ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Mavzu nomi" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Bitiruv ishi mavzusi" error={!!errors.title} />
        </FormField>

        <FormField label="Turi" error={errors.type?.message} required>
          <FormSelect
            {...register('type')}
            options={TYPE_OPTIONS}
            placeholder="Turni tanlang"
            error={!!errors.type}
          />
        </FormField>

        <FormField label="Talaba" error={errors.studentId?.message} required>
          <FormSelect
            {...register('studentId')}
            options={students.map((s) => ({ value: String(s.id), label: s.fullName }))}
            placeholder="Talabani tanlang"
            error={!!errors.studentId}
          />
        </FormField>

        <FormField label="Ilmiy rahbar" error={errors.supervisorId?.message} required>
          <FormSelect
            {...register('supervisorId')}
            options={supervisors.map((s) => ({ value: String(s.id), label: s.fullName }))}
            placeholder="Rahbarni tanlang"
            error={!!errors.supervisorId}
          />
        </FormField>
      </div>
    </Modal>
  );
}
