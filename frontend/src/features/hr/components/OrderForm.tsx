import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormDatePicker, FormTextarea } from '@/components/form';
import { orderSchema, type OrderFormData } from '../schemas/order.schema';
import type { EmployeeListItem } from '@/types/hr';

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
  employees: EmployeeListItem[];
  loading?: boolean;
}

const ORDER_TYPE_OPTIONS = [
  { value: 'hire', label: 'Ishga qabul qilish' },
  { value: 'fire', label: "Ishdan bo'shatish" },
  { value: 'transfer', label: "Bo'limga ko'chirish" },
  { value: 'promotion', label: "Lavozimga ko'tarish" },
  { value: 'salary_change', label: "Maosh o'zgarishi" },
  { value: 'leave', label: "Ta'tilga jo'natish" },
  { value: 'business_trip', label: 'Xizmat safari' },
  { value: 'bonus', label: 'Mukofotlash' },
  { value: 'penalty', label: "Hayfsan e'lon qilish" },
];

export function OrderForm({
  open,
  onClose,
  onSubmit,
  employees,
  loading,
}: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema) as unknown as Resolver<OrderFormData>,
  });

  const handleFormSubmit = (data: OrderFormData) => {
    onSubmit(data);
    reset();
  };

  const employeeOptions = employees.slice(0, 50).map((e) => ({
    value: String(e.id),
    label: e.fullName,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yangi buyruq yaratish"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            Loyiha sifatida saqlash
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Buyruq turi" error={errors.type?.message} required>
          <FormSelect
            {...register('type')}
            options={ORDER_TYPE_OPTIONS}
            placeholder="Tanlang"
            error={!!errors.type}
          />
        </FormField>

        <FormField label="Xodim" error={errors.employeeId?.message} required>
          <FormSelect
            {...register('employeeId')}
            options={employeeOptions}
            placeholder="Xodimni tanlang..."
            error={!!errors.employeeId}
          />
        </FormField>

        <FormField label="Kuchga kirish sanasi" error={errors.effectiveDate?.message} required>
          <FormDatePicker
            {...register('effectiveDate')}
            error={!!errors.effectiveDate}
          />
        </FormField>

        <FormField label="Asos" error={errors.basis?.message} required>
          <FormInput
            {...register('basis')}
            placeholder="Mehnat shartnomasi, ariza..."
            error={!!errors.basis}
          />
        </FormField>

        <FormField label="Buyruq mazmuni" error={errors.title?.message} required>
          <FormTextarea
            {...register('title')}
            placeholder="Buyruq matni..."
            rows={4}
            error={!!errors.title}
          />
        </FormField>
      </div>
    </Modal>
  );
}
