import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormTextarea } from '@/components/form';
import { appealSchema, type AppealFormData } from '../schemas/appeal.schema';

interface AppealFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppealFormData) => void;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'complaint', label: 'Shikoyat' },
  { value: 'request', label: "So'rov" },
  { value: 'suggestion', label: 'Taklif' },
  { value: 'question', label: 'Savol' },
];

export function AppealForm({ open, onClose, onSubmit, loading }: AppealFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppealFormData>({
    resolver: zodResolver(appealSchema) as unknown as Resolver<AppealFormData>,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Yangi murojaat"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            Yuborish
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Sarlavha" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Murojaat sarlavhasi" error={!!errors.title} />
        </FormField>

        <FormField label="Kategoriya" error={errors.category?.message} required>
          <FormSelect
            {...register('category')}
            options={CATEGORY_OPTIONS}
            placeholder="Kategoriyani tanlang"
            error={!!errors.category}
          />
        </FormField>

        <FormField label="Tavsif" error={errors.description?.message} required>
          <FormTextarea
            {...register('description')}
            placeholder="Murojaat matnini kiriting..."
            rows={5}
            error={!!errors.description}
          />
        </FormField>
      </div>
    </Modal>
  );
}
