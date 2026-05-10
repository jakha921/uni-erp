import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput } from '@/components/form';
import { roleSchema, type RoleFormData } from '../schemas/role.schema';

const COLOR_OPTIONS = [
  { value: '#3B82F6', label: 'Ko\'k' },
  { value: '#2DB976', label: 'Yashil' },
  { value: '#F59E0B', label: 'Sariq' },
  { value: '#8B5CF6', label: 'Binafsha' },
  { value: '#EC4899', label: 'Pushti' },
  { value: '#EF4444', label: 'Qizil' },
  { value: '#06B6D4', label: 'Moviy' },
  { value: '#64748B', label: 'Kulrang' },
];

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
  loading?: boolean;
}

export function RoleForm({ open, onClose, onSubmit, loading }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema) as unknown as Resolver<RoleFormData>,
    defaultValues: { name: '', nameUz: '', description: '', color: '#3B82F6' },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (open) reset({ name: '', nameUz: '', description: '', color: '#3B82F6' });
  }, [open, reset]);

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Yangi rol yaratish"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Bekor qilish</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={loading}>Yaratish</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-6">
        <FormField label="Rol nomi (EN)" error={errors.name?.message} required>
          <FormInput placeholder="Dekan" error={!!errors.name} {...register('name')} />
        </FormField>

        <FormField label="Rol nomi (UZ)" error={errors.nameUz?.message} required>
          <FormInput placeholder="Dekan" error={!!errors.nameUz} {...register('nameUz')} />
        </FormField>

        <FormField label="Tavsif" error={errors.description?.message} required>
          <FormInput placeholder="Fakultet dekani — o'quv jarayonini boshqaradi" error={!!errors.description} {...register('description')} />
        </FormField>

        <FormField label="Rang" error={errors.color?.message} required>
          <div className="flex flex-wrap gap-2 mt-1">
            {COLOR_OPTIONS.map((c) => (
              <label key={c.value} className="cursor-pointer flex items-center gap-1.5">
                <input type="radio" value={c.value} {...register('color')} className="sr-only" />
                <span
                  className="h-7 w-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c.value,
                    borderColor: selectedColor === c.value ? '#334155' : 'transparent',
                    outline: selectedColor === c.value ? `2px solid ${c.value}40` : 'none',
                  }}
                  title={c.label}
                />
              </label>
            ))}
          </div>
        </FormField>
      </div>
    </SlideOver>
  );
}
