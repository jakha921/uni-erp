import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { FileUpload } from '@/components/form/FileUpload';
import { documentSchema, type DocumentFormData } from '../schemas/document.schema';
import type { Document } from '@/types/admin';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Past' },
  { value: 'medium', label: "O'rtacha" },
  { value: 'high', label: 'Yuqori' },
  { value: 'urgent', label: 'Shoshilinch' },
];

const CATEGORY_OPTIONS = [
  { value: 'buyruk', label: 'Buyruq' },
  { value: 'hisobot', label: 'Hisobot' },
  { value: 'shartnoma', label: 'Shartnoma' },
  { value: 'ariza', label: 'Ariza' },
  { value: 'boshqa', label: 'Boshqa' },
];

interface DocumentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentFormData) => void;
  document?: Document | null;
  folders: { id: number; name: string }[];
  loading?: boolean;
}

export function DocumentForm({ open, onClose, onSubmit, document, folders, loading }: DocumentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema) as unknown as Resolver<DocumentFormData>,
    defaultValues: document
      ? {
          title: document.title,
          category: document.category,
          folderId: document.folderId,
          priority: document.priority,
          fileUrl: document.fileUrl,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={document ? 'Hujjatni tahrirlash' : 'Yangi hujjat'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {document ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Sarlavha" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Hujjat nomi" error={!!errors.title} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Kategoriya" error={errors.category?.message} required>
            <FormSelect
              {...register('category')}
              options={CATEGORY_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.category}
            />
          </FormField>
          <FormField label="Muhimlik darajasi" error={errors.priority?.message} required>
            <FormSelect
              {...register('priority')}
              options={PRIORITY_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.priority}
            />
          </FormField>
        </div>
        <FormField label="Papka" error={errors.folderId?.message} required>
          <FormSelect
            {...register('folderId')}
            options={folders.map((f) => ({ value: String(f.id), label: f.name }))}
            placeholder="Papkani tanlang"
            error={!!errors.folderId}
          />
        </FormField>
        <FormField label="Fayl yuklash" error={errors.fileUrl?.message}>
          <FileUpload
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png"
            maxSize={20 * 1024 * 1024}
            onUpload={(files) => {
              if (files[0]) setValue('fileUrl', files[0].name);
            }}
          />
          <FormInput
            {...register('fileUrl')}
            placeholder="yoki URL kiriting: https://..."
            error={!!errors.fileUrl}
            className="mt-2"
          />
        </FormField>
      </div>
    </SlideOver>
  );
}
