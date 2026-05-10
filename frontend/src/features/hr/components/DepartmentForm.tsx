import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { departmentSchema, type DepartmentFormData } from '../schemas/department.schema';
import type { HrDepartment } from '@/types/hr';

const TYPE_OPTIONS = [
  { value: 'rektorat', label: 'Rektorat' },
  { value: 'fakultet', label: 'Fakultet' },
  { value: 'kafedra', label: 'Kafedra' },
  { value: 'bolim', label: "Bo'lim" },
];

interface DepartmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData) => void;
  department?: HrDepartment | null;
  departments: { id: number; name: string }[];
  employees: { id: number; name: string }[];
  loading?: boolean;
}

export function DepartmentForm({ open, onClose, onSubmit, department, departments, employees, loading }: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema) as unknown as Resolver<DepartmentFormData>,
    defaultValues: department
      ? {
          name: department.name,
          code: department.code,
          type: department.type,
          parentId: department.parentId ?? undefined,
          headId: department.headId ?? undefined,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  const parentOptions = [
    { value: '', label: "(Ota bo'lim yo'q)" },
    ...departments.map((d) => ({ value: String(d.id), label: d.name })),
  ];

  const headOptions = [
    { value: '', label: "(Rahbar yo'q)" },
    ...employees.map((e) => ({ value: String(e.id), label: e.name })),
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={department ? "Bo'limni tahrirlash" : "Yangi bo'lim"}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {department ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nomi" error={errors.name?.message} required>
            <FormInput {...register('name')} placeholder="Axborot texnologiyalari" error={!!errors.name} />
          </FormField>
          <FormField label="Kod" error={errors.code?.message} required>
            <FormInput {...register('code')} placeholder="AT-01" error={!!errors.code} />
          </FormField>
        </div>

        <FormField label="Turi" error={errors.type?.message} required>
          <FormSelect
            {...register('type')}
            options={TYPE_OPTIONS}
            placeholder="Turni tanlang"
            error={!!errors.type}
          />
        </FormField>

        <FormField label="Ota bo'lim" error={errors.parentId?.message}>
          <FormSelect
            {...register('parentId')}
            options={parentOptions}
            error={!!errors.parentId}
          />
        </FormField>

        <FormField label="Rahbar" error={errors.headId?.message}>
          <FormSelect
            {...register('headId')}
            options={headOptions}
            error={!!errors.headId}
          />
        </FormField>
      </div>
    </Modal>
  );
}
