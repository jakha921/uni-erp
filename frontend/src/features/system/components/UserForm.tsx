import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { userSchema, type UserFormData } from '../schemas/user.schema';
import type { SystemUserListItem } from '@/types/system';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  loading?: boolean;
  user?: SystemUserListItem | null;
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator' },
  { value: 'buxgalter', label: 'Buxgalter' },
  { value: 'dekan', label: 'Dekan' },
  { value: 'oqituvchi', label: "O'qituvchi" },
  { value: 'talaba', label: 'Talaba' },
];

export function UserForm({ open, onClose, onSubmit, loading, user }: UserFormProps) {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema) as unknown as Resolver<UserFormData>,
    defaultValues: { firstName: '', secondName: '', phone: '', email: '', password: '', role: '' },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        const nameParts = user.fullName.split(' ');
        reset({
          firstName: nameParts[1] ?? '',
          secondName: nameParts[0] ?? '',
          phone: user.phone ?? '',
          email: user.email ?? '',
          password: '',
          role: user.roles[0]?.role ?? '',
        });
      } else {
        reset({ firstName: '', secondName: '', phone: '', email: '', password: '', role: '' });
      }
    }
  }, [open, user, reset]);

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={isEdit ? 'Foydalanuvchini tahrirlash' : "Yangi foydalanuvchi qo'shish"}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Bekor qilish</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={loading}>
            {isEdit ? 'Saqlash' : "Qo'shish"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Familiya" error={errors.secondName?.message} required>
            <FormInput placeholder="Karimov" error={!!errors.secondName} {...register('secondName')} />
          </FormField>
          <FormField label="Ism" error={errors.firstName?.message} required>
            <FormInput placeholder="Alisher" error={!!errors.firstName} {...register('firstName')} />
          </FormField>
        </div>

        <FormField label="Telefon" error={errors.phone?.message} required>
          <FormInput placeholder="+998901234567" error={!!errors.phone} {...register('phone')} />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <FormInput type="email" placeholder="user@example.com" error={!!errors.email} {...register('email')} />
        </FormField>

        <FormField label={isEdit ? "Yangi parol (ixtiyoriy)" : "Parol"} error={errors.password?.message} required={!isEdit}>
          <FormInput type="password" placeholder="Kamida 8 ta belgi" error={!!errors.password} {...register('password')} />
        </FormField>

        <FormField label="Rol" error={errors.role?.message} required>
          <FormSelect options={ROLE_OPTIONS} error={!!errors.role} {...register('role')} />
        </FormField>
      </div>
    </SlideOver>
  );
}
