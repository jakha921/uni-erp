import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormSelect, FormDatePicker, FormTextarea } from '@/components/form';
import { leaveSchema, type LeaveFormData } from '../schemas/leave.schema';
import type { EmployeeListItem } from '@/types/hr';

interface LeaveFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveFormData) => void;
  employees: EmployeeListItem[];
  loading?: boolean;
}

const LEAVE_TYPE_OPTIONS = [
  { value: 'annual', label: "Mehnat ta'tili" },
  { value: 'sick', label: 'Kasallik varaqasi' },
  { value: 'maternity', label: "Dekret ta'tili" },
  { value: 'unpaid', label: "Haq to'lanmaydigan ta'til" },
  { value: 'business_trip', label: 'Xizmat safari' },
  { value: 'study', label: "O'quv ta'tili" },
];

export function LeaveForm({
  open,
  onClose,
  onSubmit,
  employees,
  loading,
}: LeaveFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema) as unknown as Resolver<LeaveFormData>,
  });

  const selectedType = watch('type');

  const handleFormSubmit = (data: LeaveFormData) => {
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
      title="Yangi ta'til so'rovi"
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
            Yuborish
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Xodim" error={errors.employeeId?.message} required>
          <FormSelect
            {...register('employeeId')}
            options={employeeOptions}
            placeholder="Xodimni tanlang..."
            error={!!errors.employeeId}
          />
        </FormField>

        <FormField label="Ta'til turi" error={errors.type?.message} required>
          <FormSelect
            {...register('type')}
            options={LEAVE_TYPE_OPTIONS}
            placeholder="Tanlang"
            error={!!errors.type}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Boshlanish sanasi" error={errors.startDate?.message} required>
            <FormDatePicker
              {...register('startDate')}
              error={!!errors.startDate}
            />
          </FormField>

          <FormField label="Tugash sanasi" error={errors.endDate?.message} required>
            <FormDatePicker
              {...register('endDate')}
              error={!!errors.endDate}
            />
          </FormField>
        </div>

        <FormField label="Sabab" error={errors.reason?.message} required>
          <FormTextarea
            {...register('reason')}
            placeholder="Ta'til sababi..."
            rows={3}
            error={!!errors.reason}
          />
        </FormField>

        {selectedType === 'business_trip' && (
          <FormField label="Manzil" error={errors.destination?.message}>
            <FormTextarea
              {...register('destination')}
              placeholder="Safari manzili..."
              rows={2}
              error={!!errors.destination}
            />
          </FormField>
        )}
      </div>
    </Modal>
  );
}
