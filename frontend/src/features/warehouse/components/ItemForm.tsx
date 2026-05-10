import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { itemSchema, type ItemFormData } from '../schemas/item.schema';
import type { WarehouseItem } from '@/types/warehouse';

const CATEGORY_OPTIONS = [
  { value: 'office', label: 'Ofis' },
  { value: 'cleaning', label: 'Tozalik' },
  { value: 'technical', label: 'Texnik' },
  { value: 'furniture', label: 'Mebel' },
  { value: 'food', label: 'Oziq-ovqat' },
  { value: 'other', label: 'Boshqa' },
];

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => void;
  item?: WarehouseItem | null;
  loading?: boolean;
}

export function ItemForm({ open, onClose, onSubmit, item, loading }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema) as unknown as Resolver<ItemFormData>,
    defaultValues: item
      ? {
          name: item.name,
          sku: item.sku,
          category: item.category,
          unit: item.unit,
          minQuantity: item.minQuantity,
          price: item.price,
          location: item.location,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={item ? 'Tovarni tahrirlash' : 'Yangi tovar'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {item ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Nomi" error={errors.name?.message} required>
          <FormInput {...register('name')} placeholder="Qog'oz A4" error={!!errors.name} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="SKU" error={errors.sku?.message} required>
            <FormInput {...register('sku')} placeholder="OFF-001" error={!!errors.sku} />
          </FormField>
          <FormField label="Kategoriya" error={errors.category?.message} required>
            <FormSelect
              {...register('category')}
              options={CATEGORY_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.category}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="O'lchov birligi" error={errors.unit?.message} required>
            <FormInput {...register('unit')} placeholder="dona" error={!!errors.unit} />
          </FormField>
          <FormField label="Min. miqdor" error={errors.minQuantity?.message} required>
            <FormInput {...register('minQuantity')} type="number" placeholder="10" error={!!errors.minQuantity} />
          </FormField>
          <FormField label="Narx (so'm)" error={errors.price?.message} required>
            <FormInput {...register('price')} type="number" placeholder="5000" error={!!errors.price} />
          </FormField>
        </div>
        <FormField label="Joylashuv" error={errors.location?.message} required>
          <FormInput {...register('location')} placeholder="Ombor A" error={!!errors.location} />
        </FormField>
      </div>
    </SlideOver>
  );
}
