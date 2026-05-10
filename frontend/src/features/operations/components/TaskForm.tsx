import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormTextarea, FormDatePicker } from '@/components/form';
import { taskSchema, type TaskFormData } from '../schemas/task.schema';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: { id: number; title: string; description?: string; assigneeId: number; priority: string; dueDate: string } | null;
  assignees: { id: number; fullName: string }[];
  loading?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Past' },
  { value: 'medium', label: "O'rta" },
  { value: 'high', label: 'Yuqori' },
  { value: 'urgent', label: 'Shoshilinch' },
];

export function TaskForm({ open, onClose, onSubmit, task, assignees, loading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema) as unknown as Resolver<TaskFormData>,
    defaultValues: task
      ? {
          title: task.title,
          description: task.description ?? '',
          assigneeId: task.assigneeId,
          priority: task.priority as TaskFormData['priority'],
          dueDate: task.dueDate,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={task ? "Vazifani tahrirlash" : "Yangi vazifa"}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {task ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Vazifa nomi" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Vazifa nomini kiriting" error={!!errors.title} />
        </FormField>

        <FormField label="Tavsif" error={errors.description?.message}>
          <FormTextarea {...register('description')} placeholder="Vazifa tavsifi..." rows={3} error={!!errors.description} />
        </FormField>

        <FormField label="Mas'ul shaxs" error={errors.assigneeId?.message} required>
          <FormSelect
            {...register('assigneeId')}
            options={assignees.map((a) => ({ value: String(a.id), label: a.fullName }))}
            placeholder="Tanlang"
            error={!!errors.assigneeId}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Muhimlik darajasi" error={errors.priority?.message} required>
            <FormSelect
              {...register('priority')}
              options={PRIORITY_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.priority}
            />
          </FormField>
          <FormField label="Muddat" error={errors.dueDate?.message} required>
            <FormDatePicker {...register('dueDate')} error={!!errors.dueDate} />
          </FormField>
        </div>
      </div>
    </SlideOver>
  );
}
