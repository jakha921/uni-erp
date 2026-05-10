import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormDatePicker } from '@/components/form';
import { patentSchema, type PatentFormData } from '../schemas/patent.schema';

interface PatentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PatentFormData) => void;
  patent?: Partial<PatentFormData> & { id?: number } | null;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'invention', label: 'Ixtiro' },
  { value: 'utility_model', label: 'Foydali model' },
  { value: 'industrial_design', label: "Sanoat namunasi" },
  { value: 'software', label: 'Dasturiy mahsulot' },
];

export function PatentForm({ open, onClose, onSubmit, patent, loading }: PatentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatentFormData>({
    resolver: zodResolver(patentSchema) as unknown as Resolver<PatentFormData>,
    defaultValues: patent ?? undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={patent ? "Patentni tahrirlash" : "Yangi patent"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {patent ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Patent nomi" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Ixtiro yoki foydali model nomi" error={!!errors.title} />
        </FormField>

        <FormField label="Ixtirochilar" error={errors.inventors?.message} required>
          <FormInput {...register('inventors')} placeholder="Karimov A.B., Toshmatov S.N." error={!!errors.inventors} />
        </FormField>

        <FormField label="Kategoriya" error={errors.category?.message} required>
          <FormSelect
            {...register('category')}
            options={CATEGORY_OPTIONS}
            placeholder="Kategoriyani tanlang"
            error={!!errors.category}
          />
        </FormField>

        <FormField label="Ariza sanasi" error={errors.applicationDate?.message} required>
          <FormDatePicker {...register('applicationDate')} error={!!errors.applicationDate} />
        </FormField>
      </div>
    </Modal>
  );
}
