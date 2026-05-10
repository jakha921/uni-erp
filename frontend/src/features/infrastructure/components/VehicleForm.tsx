import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput } from '@/components/form';
import { vehicleSchema, type VehicleFormData } from '../schemas/vehicle.schema';
import type { Vehicle } from '@/types/infrastructure';

interface VehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => void;
  vehicle?: Vehicle | null;
  loading?: boolean;
}

export function VehicleForm({ open, onClose, onSubmit, vehicle, loading }: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema) as unknown as Resolver<VehicleFormData>,
    defaultValues: vehicle
      ? {
          brand: vehicle.brand,
          model: vehicle.model,
          plateNumber: vehicle.plateNumber,
          year: vehicle.year,
          driverName: vehicle.driverName,
          route: vehicle.route,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={vehicle ? 'Transportni tahrirlash' : 'Yangi transport'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {vehicle ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Marka" error={errors.brand?.message} required>
            <FormInput {...register('brand')} placeholder="Toyota" error={!!errors.brand} />
          </FormField>
          <FormField label="Model" error={errors.model?.message} required>
            <FormInput {...register('model')} placeholder="Camry" error={!!errors.model} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Davlat raqami" error={errors.plateNumber?.message} required>
            <FormInput {...register('plateNumber')} placeholder="01 A 123 BC" error={!!errors.plateNumber} />
          </FormField>
          <FormField label="Yil" error={errors.year?.message} required>
            <FormInput {...register('year')} type="number" placeholder="2020" error={!!errors.year} />
          </FormField>
        </div>
        <FormField label="Haydovchi" error={errors.driverName?.message} required>
          <FormInput {...register('driverName')} placeholder="Karimov Ulmas" error={!!errors.driverName} />
        </FormField>
        <FormField label="Marshrut" error={errors.route?.message}>
          <FormInput {...register('route')} placeholder="Shahar → Universitet" error={!!errors.route} />
        </FormField>
      </div>
    </Modal>
  );
}
