import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { articleSchema, type ArticleFormData } from '../schemas/article.schema';

interface ArticleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ArticleFormData) => void;
  article?: Partial<ArticleFormData> & { id?: number } | null;
  loading?: boolean;
}

const TYPE_OPTIONS = [
  { value: 'scopus', label: 'Scopus' },
  { value: 'wos', label: 'Web of Science' },
  { value: 'vak', label: 'VAK' },
  { value: 'local', label: "Mahalliy" },
];

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const y = 2025 - i;
  return { value: String(y), label: String(y) };
});

export function ArticleForm({ open, onClose, onSubmit, article, loading }: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema) as unknown as Resolver<ArticleFormData>,
    defaultValues: article ?? undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={article ? "Maqolani tahrirlash" : "Yangi maqola"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {article ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Maqola nomi" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Maqola nomi" error={!!errors.title} />
        </FormField>

        <FormField label="Mualliflar" error={errors.authors?.message} required>
          <FormInput {...register('authors')} placeholder="Karimov A., Toshmatov B." error={!!errors.authors} />
        </FormField>

        <FormField label="Jurnal nomi" error={errors.journal?.message} required>
          <FormInput {...register('journal')} placeholder="Journal of Information Technology" error={!!errors.journal} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nashr yili" error={errors.year?.message} required>
            <FormSelect
              {...register('year')}
              options={YEAR_OPTIONS}
              placeholder="Yil"
              error={!!errors.year}
            />
          </FormField>
          <FormField label="Turi" error={errors.type?.message} required>
            <FormSelect
              {...register('type')}
              options={TYPE_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.type}
            />
          </FormField>
        </div>

        <FormField label="DOI" error={errors.doi?.message}>
          <FormInput {...register('doi')} placeholder="10.1234/example.2024" error={!!errors.doi} />
        </FormField>
      </div>
    </Modal>
  );
}
