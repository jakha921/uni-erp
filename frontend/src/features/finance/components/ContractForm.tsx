import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormMoneyInput, FormDatePicker } from '@/components/form';
import { contractSchema, type ContractFormData } from '../schemas/contract.schema';

interface ContractFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContractFormData) => void;
  loading?: boolean;
}

const CONTRACT_TYPE_OPTIONS = [
  { value: 'bazoviy', label: 'Bazoviy' },
  { value: 'tabaqalashtirilgan', label: 'Tabaqalashtirilgan' },
  { value: 'grant', label: 'Grant' },
  { value: 'xorijiy', label: 'Xorijiy' },
];

const EDUCATION_YEAR_OPTIONS = [
  { value: '2025-2026', label: '2025-2026' },
  { value: '2024-2025', label: '2024-2025' },
  { value: '2023-2024', label: '2023-2024' },
];

export function ContractForm({ open, onClose, onSubmit, loading }: ContractFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema) as unknown as Resolver<ContractFormData>,
    defaultValues: {
      studentId: 0,
      contractType: 'bazoviy',
      contractAmount: 0,
      contractDate: new Date().toISOString().slice(0, 10),
      educationYear: '2025-2026',
      paymentSchedule: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paymentSchedule',
  });

  const contractAmount = watch('contractAmount');
  const contractDate = watch('contractDate');

  const generateSchedule = () => {
    const amount = Number(contractAmount) || 0;
    if (amount <= 0) return;
    const parts = 3;
    const part = Math.round(amount / parts / 100000) * 100000;
    const rows: { dueDate: string; amount: number }[] = [];
    const base = new Date(contractDate || Date.now());
    for (let i = 0; i < parts; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i * 3, 15);
      rows.push({
        dueDate: d.toISOString().slice(0, 10),
        amount: i === parts - 1 ? amount - part * (parts - 1) : part,
      });
    }
    setValue('paymentSchedule', rows);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yangi kontrakt"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={loading}>
            Saqlash
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Kontrakt ma&apos;lumotlari
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Talaba ID" error={errors.studentId?.message} required>
            <FormInput
              type="number"
              placeholder="Talaba ID"
              error={!!errors.studentId}
              {...register('studentId')}
            />
          </FormField>

          <FormField label="Sana" error={errors.contractDate?.message} required>
            <FormDatePicker error={!!errors.contractDate} {...register('contractDate')} />
          </FormField>

          <FormField label="Turi" error={errors.contractType?.message} required>
            <FormSelect
              options={CONTRACT_TYPE_OPTIONS}
              error={!!errors.contractType}
              {...register('contractType')}
            />
          </FormField>

          <FormField label="O'quv yili" error={errors.educationYear?.message} required>
            <FormSelect
              options={EDUCATION_YEAR_OPTIONS}
              error={!!errors.educationYear}
              {...register('educationYear')}
            />
          </FormField>

          <div className="col-span-2">
            <FormField
              label="Kontrakt summasi (so'm)"
              error={errors.contractAmount?.message}
              required
            >
              <FormMoneyInput
                placeholder="15 000 000"
                error={!!errors.contractAmount}
                {...register('contractAmount')}
              />
            </FormField>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              To&apos;lov jadvali
            </h3>
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={generateSchedule}>
              Jadval yaratish
            </Button>
          </div>
          {errors.paymentSchedule?.message && (
            <p className="mb-2 text-xs text-red-500">{errors.paymentSchedule.message}</p>
          )}
          {fields.length === 0 && (
            <div className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              Summani kiriting va &quot;Jadval yaratish&quot; bosing
            </div>
          )}
          <div className="flex flex-col gap-2">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3">
                <FormDatePicker
                  className="flex-1"
                  error={!!errors.paymentSchedule?.[idx]?.dueDate}
                  {...register(`paymentSchedule.${idx}.dueDate`)}
                />
                <FormMoneyInput
                  className="flex-1"
                  error={!!errors.paymentSchedule?.[idx]?.amount}
                  {...register(`paymentSchedule.${idx}.amount`)}
                />
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {fields.length > 0 && (
            <button
              type="button"
              onClick={() => append({ dueDate: new Date().toISOString().slice(0, 10), amount: 0 })}
              className="mt-2 w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
            >
              + Qo&apos;shish
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
