import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormSelect, FormMoneyInput } from '@/components/form';
import { contractEditSchema, type ContractEditFormData } from '../schemas/contract.schema';
import type { Contract } from '@/types/finance';

interface ContractEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContractEditFormData) => void;
  contract: Contract | null;
  loading?: boolean;
}

const CONTRACT_TYPE_OPTIONS = [
  { value: 'bazoviy', label: 'Bazoviy' },
  { value: 'tabaqalashtirilgan', label: 'Tabaqalashtirilgan' },
  { value: 'grant', label: 'Grant' },
  { value: 'xorijiy', label: 'Xorijiy' },
];

export function ContractEditModal({ open, onClose, onSubmit, contract, loading }: ContractEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractEditFormData>({
    resolver: zodResolver(contractEditSchema) as unknown as Resolver<ContractEditFormData>,
  });

  useEffect(() => {
    if (open && contract) {
      reset({
        contractType: contract.contractType,
        contractAmount: contract.contractAmount,
      });
    }
  }, [open, contract, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Kontraktni tahrirlash"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit(onSubmit)}>
            Saqlash
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Kontrakt turi" error={errors.contractType?.message} required>
          <FormSelect
            {...register('contractType')}
            options={CONTRACT_TYPE_OPTIONS}
            placeholder="Turini tanlang"
            error={!!errors.contractType}
          />
        </FormField>
        <FormField label="Kontrakt summasi" error={errors.contractAmount?.message} required>
          <FormMoneyInput
            {...register('contractAmount')}
            placeholder="0"
            error={!!errors.contractAmount}
          />
        </FormField>
      </div>
    </Modal>
  );
}
