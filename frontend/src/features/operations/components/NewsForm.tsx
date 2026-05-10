import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormTextarea } from '@/components/form';
import { newsSchema, type NewsFormData } from '../schemas/news.schema';

interface NewsFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewsFormData) => void;
  news?: { title: string; content: string; category: string; tags: string[] } | null;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'announcement', label: "E'lon" },
  { value: 'event', label: 'Tadbir' },
  { value: 'achievement', label: "Yutuq" },
  { value: 'academic', label: "Ta'lim" },
  { value: 'general', label: "Umumiy" },
];

export function NewsForm({ open, onClose, onSubmit, news, loading }: NewsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema) as unknown as Resolver<NewsFormData>,
    defaultValues: news
      ? {
          title: news.title,
          content: news.content,
          category: news.category,
          tags: news.tags,
        }
      : { tags: [] },
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={news ? "Yangilikni tahrirlash" : "Yangi yangilik"}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {news ? 'Saqlash' : "E'lon qilish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Sarlavha" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Yangilik sarlavhasi" error={!!errors.title} />
        </FormField>

        <FormField label="Kategoriya" error={errors.category?.message} required>
          <FormSelect
            {...register('category')}
            options={CATEGORY_OPTIONS}
            placeholder="Kategoriyani tanlang"
            error={!!errors.category}
          />
        </FormField>

        <FormField label="Matn" error={errors.content?.message} required>
          <FormTextarea
            {...register('content')}
            placeholder="Yangilik matni..."
            rows={6}
            error={!!errors.content}
          />
        </FormField>

        <FormField label="Teglar (vergul bilan)" error={errors.tags?.message} required>
          <FormInput
            {...register('tags', { setValueAs: (v: string) => typeof v === 'string' ? v.split(',').map((t) => t.trim()).filter(Boolean) : v })}
            placeholder="ta'lim, yangilik, tadbir"
            error={!!errors.tags}
          />
        </FormField>
      </div>
    </SlideOver>
  );
}
