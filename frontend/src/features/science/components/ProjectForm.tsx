import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormTextarea, FormDatePicker } from '@/components/form';
import { projectSchema, type ProjectFormData } from '../schemas/project.schema';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  project?: Partial<ProjectFormData> & { id?: number } | null;
  leaders: { id: number; fullName: string }[];
  loading?: boolean;
}

export function ProjectForm({ open, onClose, onSubmit, project, leaders, loading }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as unknown as Resolver<ProjectFormData>,
    defaultValues: project ?? undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={project ? "Loyihani tahrirlash" : "Yangi loyiha"}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {project ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Loyiha nomi" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Loyiha nomi" error={!!errors.title} />
        </FormField>

        <FormField label="Rahbar" error={errors.leaderId?.message} required>
          <FormSelect
            {...register('leaderId')}
            options={leaders.map((l) => ({ value: String(l.id), label: l.fullName }))}
            placeholder="Rahbarni tanlang"
            error={!!errors.leaderId}
          />
        </FormField>

        <FormField label="Tavsif" error={errors.description?.message} required>
          <FormTextarea
            {...register('description')}
            placeholder="Loyiha tavsifi..."
            rows={3}
            error={!!errors.description}
          />
        </FormField>

        <FormField label="Moliyalashtirish summasi (so'm)" error={errors.fundAmount?.message} required>
          <FormInput {...register('fundAmount')} type="number" placeholder="50000000" error={!!errors.fundAmount} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Boshlanish sanasi" error={errors.startDate?.message} required>
            <FormDatePicker {...register('startDate')} error={!!errors.startDate} />
          </FormField>
          <FormField label="Tugash sanasi" error={errors.endDate?.message} required>
            <FormDatePicker {...register('endDate')} error={!!errors.endDate} />
          </FormField>
        </div>
      </div>
    </SlideOver>
  );
}
