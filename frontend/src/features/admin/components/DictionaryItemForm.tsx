import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput } from '@/components/form';
import type { DictionaryItem } from '@/types/admin';

const schema = z.object({
  code: z.string().min(1, 'Kod kiritilishi shart'),
  name: z.string().min(1, 'Nom kiritilishi shart'),
  description: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

interface DictionaryItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  item?: DictionaryItem | null;
  loading?: boolean;
}

export function DictionaryItemForm({ open, onClose, onSubmit, item, loading }: DictionaryItemFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
  });

  useEffect(() => {
    if (open && item) {
      reset({ code: item.code, name: item.name, description: item.description ?? '', sortOrder: item.sortOrder });
    } else if (open) {
      reset({ code: '', name: '', description: '', sortOrder: 0 });
    }
  }, [open, item, reset]);

  const isEdit = !!item;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Yozuvni tahrirlash' : 'Yangi yozuv'}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Bekor qilish</Button>
          <Button variant="primary" size="sm" loading={loading} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Saqlash' : "Qo'shish"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Kod" error={errors.code?.message} required>
            <FormInput {...register('code')} placeholder="DIR-001" error={!!errors.code} />
          </FormField>
          <FormField label="Tartib raqami" error={errors.sortOrder?.message}>
            <FormInput {...register('sortOrder')} type="number" placeholder="0" />
          </FormField>
        </div>
        <FormField label="Nomi" error={errors.name?.message} required>
          <FormInput {...register('name')} placeholder="Yozuv nomi" error={!!errors.name} />
        </FormField>
        <FormField label="Tavsif" error={errors.description?.message}>
          <FormInput {...register('description')} placeholder="Ixtiyoriy tavsif" />
        </FormField>
      </form>
    </Modal>
  );
}
