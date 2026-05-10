import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput } from '@/components/form';
import { equipmentSchema, type EquipmentFormData } from '../schemas/equipment.schema';
import type { Equipment } from '@/types/infrastructure';

interface EquipmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EquipmentFormData) => void;
  equipment?: Equipment | null;
  loading?: boolean;
}

export function EquipmentForm({ open, onClose, onSubmit, equipment, loading }: EquipmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema) as unknown as Resolver<EquipmentFormData>,
    defaultValues: equipment
      ? {
          name: equipment.name,
          inventoryNumber: equipment.inventoryNumber,
          category: equipment.category,
          location: equipment.location,
          responsiblePerson: equipment.responsiblePerson,
          purchaseDate: equipment.purchaseDate,
          cost: equipment.cost,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={equipment ? 'Jihozni tahrirlash' : 'Yangi jihoz'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {equipment ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Nomi" error={errors.name?.message} required>
          <FormInput {...register('name')} placeholder="Kompyuter" error={!!errors.name} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Inventar raqami" error={errors.inventoryNumber?.message} required>
            <FormInput {...register('inventoryNumber')} placeholder="INV-001" error={!!errors.inventoryNumber} />
          </FormField>
          <FormField label="Kategoriya" error={errors.category?.message} required>
            <FormInput {...register('category')} placeholder="Texnika" error={!!errors.category} />
          </FormField>
        </div>
        <FormField label="Joylashuv" error={errors.location?.message} required>
          <FormInput {...register('location')} placeholder="Xona 301" error={!!errors.location} />
        </FormField>
        <FormField label="Mas'ul shaxs" error={errors.responsiblePerson?.message} required>
          <FormInput {...register('responsiblePerson')} placeholder="Karimov Ulmas" error={!!errors.responsiblePerson} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Sotib olingan sana" error={errors.purchaseDate?.message} required>
            <FormInput {...register('purchaseDate')} type="date" error={!!errors.purchaseDate} />
          </FormField>
          <FormField label="Narx (so'm)" error={errors.cost?.message} required>
            <FormInput {...register('cost')} type="number" placeholder="500000" error={!!errors.cost} />
          </FormField>
        </div>
      </div>
    </SlideOver>
  );
}
