import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { movementSchema, type MovementFormData } from '../schemas/item.schema';
import type { WarehouseItem } from '@/types/warehouse';

const TYPE_OPTIONS = [
  { value: 'incoming', label: 'Kirim' },
  { value: 'outgoing', label: 'Chiqim' },
  { value: 'write_off', label: 'Hisobdan chiqarish' },
  { value: 'transfer', label: "Ko'chirish" },
];

interface MovementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MovementFormData) => void;
  items: WarehouseItem[];
  preselectedItemId?: number;
  loading?: boolean;
}

export function MovementForm({ open, onClose, onSubmit, items, preselectedItemId, loading }: MovementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema) as unknown as Resolver<MovementFormData>,
    defaultValues: preselectedItemId ? { itemId: preselectedItemId } : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Harakat qo'shish"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            Qo&apos;shish
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Tovar" error={errors.itemId?.message} required>
          <FormSelect
            {...register('itemId')}
            options={items.map((i) => ({ value: String(i.id), label: i.name }))}
            placeholder="Tovarni tanlang"
            error={!!errors.itemId}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Harakat turi" error={errors.type?.message} required>
            <FormSelect
              {...register('type')}
              options={TYPE_OPTIONS}
              placeholder="Turni tanlang"
              error={!!errors.type}
            />
          </FormField>
          <FormField label="Miqdor" error={errors.quantity?.message} required>
            <FormInput {...register('quantity')} type="number" placeholder="10" error={!!errors.quantity} />
          </FormField>
        </div>
        <FormField label="Izoh" error={errors.note?.message}>
          <FormInput {...register('note')} placeholder="Izoh kiriting" error={!!errors.note} />
        </FormField>
      </div>
    </Modal>
  );
}
