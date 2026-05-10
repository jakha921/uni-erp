import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormSelect, FormDatePicker } from '@/components/form';
import { createLoanSchema, type CreateLoanFormData } from '../schemas/loan.schema';

interface LoanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLoanFormData) => void;
  books: { id: number; title: string }[];
  students: { id: number; fullName: string }[];
  loading?: boolean;
}

export function LoanForm({ open, onClose, onSubmit, books, students, loading }: LoanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLoanFormData>({
    resolver: zodResolver(createLoanSchema) as unknown as Resolver<CreateLoanFormData>,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Kitob berish"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            Berish
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Kitob" error={errors.bookId?.message} required>
          <FormSelect
            {...register('bookId')}
            options={books.map((b) => ({ value: String(b.id), label: b.title }))}
            placeholder="Kitobni tanlang"
            error={!!errors.bookId}
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

        <FormField label="Qaytarish sanasi" error={errors.dueDate?.message} required>
          <FormDatePicker {...register('dueDate')} error={!!errors.dueDate} />
        </FormField>
      </div>
    </Modal>
  );
}
