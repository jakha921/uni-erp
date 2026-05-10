import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormMoneyInput, FormDatePicker, FormTextarea } from '@/components/form';
import { formatMoney } from '@/lib/utils';
import { paymentSchema, type PaymentFormData } from '../schemas/payment.schema';
import type { Contract } from '@/types/finance';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  contract: Contract;
  loading?: boolean;
}

const PAYMENT_METHOD_OPTIONS = [
  { value: 'bank', label: "Bank o'tkazmasi" },
  { value: 'naqd', label: 'Naqd' },
  { value: 'click', label: 'Click' },
  { value: 'payme', label: 'Payme' },
  { value: 'online', label: 'Online' },
];

export function PaymentForm({ open, onClose, onSubmit, contract, loading }: PaymentFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [receiptNum] = useState(() => `QT-${today.replace(/-/g, '')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema) as unknown as Resolver<PaymentFormData>,
    defaultValues: {
      contractId: contract.id,
      amount: 0,
      paymentDate: today,
      paymentMethod: 'bank',
      receiptNumber: receiptNum,
      note: '',
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yangi to'lov"
      size="md"
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
      <div className="flex flex-col gap-4">
        {/* Contract info */}
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">{contract.studentName}</p>
          <p className="text-xs text-slate-500">{contract.contractNumber}</p>
          <div className="mt-2 flex gap-4 text-xs">
            <span className="text-slate-500">
              Summa:{' '}
              <strong className="text-slate-900">{formatMoney(contract.contractAmount)}</strong>
            </span>
            <span className="text-slate-500">
              To&apos;langan:{' '}
              <strong className="text-green-700">{formatMoney(contract.paidAmount)}</strong>
            </span>
            <span className="text-slate-500">
              Qoldiq:{' '}
              <strong className="text-red-700">{formatMoney(contract.debtAmount)}</strong>
            </span>
          </div>
        </div>

        <FormField label="To'lov summasi (so'm)" error={errors.amount?.message} required>
          <FormMoneyInput
            placeholder="5 000 000"
            error={!!errors.amount}
            {...register('amount')}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Usul" error={errors.paymentMethod?.message} required>
            <FormSelect
              options={PAYMENT_METHOD_OPTIONS}
              error={!!errors.paymentMethod}
              {...register('paymentMethod')}
            />
          </FormField>

          <FormField label="Sana" error={errors.paymentDate?.message} required>
            <FormDatePicker error={!!errors.paymentDate} {...register('paymentDate')} />
          </FormField>
        </div>

        <FormField label="Kvitansiya raqami" error={errors.receiptNumber?.message} required>
          <FormInput error={!!errors.receiptNumber} {...register('receiptNumber')} />
        </FormField>

        <FormField label="Izoh (ixtiyoriy)">
          <FormTextarea rows={2} placeholder="Qo'shimcha ma'lumot..." {...register('note')} />
        </FormField>
      </div>
    </Modal>
  );
}
