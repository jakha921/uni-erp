import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormMoneyInput, FormDatePicker, FormTextarea } from '@/components/form';
import { scholarshipSchema, type ScholarshipFormData } from '../schemas/scholarship.schema';
import type { Scholarship, ScholarshipType } from '@/types/finance';

interface ScholarshipFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ScholarshipFormData) => void;
  loading?: boolean;
  scholarship?: Scholarship | null;
}

const SCHOLARSHIP_TYPE_OPTIONS = [
  { value: 'davlat', label: 'Davlat' },
  { value: 'prezident', label: 'Prezident' },
  { value: 'fanlar', label: 'Fanlar' },
  { value: 'ijtimoiy', label: 'Ijtimoiy' },
  { value: 'maxsus', label: 'Maxsus' },
];

const DEFAULT_AMOUNTS: Record<ScholarshipType, number> = {
  davlat: 920000,
  prezident: 2500000,
  fanlar: 1500000,
  ijtimoiy: 600000,
  maxsus: 1200000,
};

export function ScholarshipForm({ open, onClose, onSubmit, loading, scholarship }: ScholarshipFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipSchema) as unknown as Resolver<ScholarshipFormData>,
    defaultValues: {
      studentId: 0,
      type: 'davlat',
      amount: 920000,
      startDate: '2025-09-01',
      endDate: '2026-06-30',
      basis: 'GPA 86+ ball',
    },
  });

  useEffect(() => {
    if (open) {
      if (scholarship) {
        reset({
          studentId: scholarship.studentId,
          type: scholarship.type,
          amount: scholarship.amount,
          startDate: scholarship.startDate,
          endDate: scholarship.endDate,
          basis: scholarship.basis,
        });
      } else {
        reset({ studentId: 0, type: 'davlat', amount: 920000, startDate: '2025-09-01', endDate: '2026-06-30', basis: 'GPA 86+ ball' });
      }
    }
  }, [open, scholarship, reset]);

  const scholarshipType = watch('type');

  useEffect(() => {
    if (!scholarship) {
      const amount = DEFAULT_AMOUNTS[scholarshipType as ScholarshipType];
      if (amount) setValue('amount', amount);
    }
  }, [scholarshipType, setValue, scholarship]);

  const isEdit = !!scholarship;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Stipendiyani tahrirlash" : "Stipendiya tayinlash"}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={loading}>
            {isEdit ? 'Saqlash' : 'Tayinlash'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField label="Talaba ID" error={errors.studentId?.message} required>
          <FormInput
            type="number"
            placeholder="Talaba ID"
            error={!!errors.studentId}
            {...register('studentId')}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Turi" error={errors.type?.message} required>
            <FormSelect
              options={SCHOLARSHIP_TYPE_OPTIONS}
              error={!!errors.type}
              {...register('type')}
            />
          </FormField>

          <FormField label="Oylik summa (so'm)" error={errors.amount?.message} required>
            <FormMoneyInput error={!!errors.amount} {...register('amount')} />
          </FormField>

          <FormField label="Boshlanish" error={errors.startDate?.message} required>
            <FormDatePicker error={!!errors.startDate} {...register('startDate')} />
          </FormField>

          <FormField label="Tugash" error={errors.endDate?.message} required>
            <FormDatePicker error={!!errors.endDate} {...register('endDate')} />
          </FormField>
        </div>

        <FormField label="Asos" error={errors.basis?.message} required>
          <FormTextarea
            rows={3}
            placeholder="Stipendiya tayinlash asosi..."
            error={!!errors.basis}
            {...register('basis')}
          />
        </FormField>
      </div>
    </Modal>
  );
}
