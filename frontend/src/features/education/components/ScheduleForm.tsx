import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { scheduleSchema, type ScheduleFormData } from '../schemas/schedule.schema';
import type { Schedule } from '@/types/education';

const DAY_OPTIONS = [
  { value: '0', label: 'Dushanba' },
  { value: '1', label: 'Seshanba' },
  { value: '2', label: 'Chorshanba' },
  { value: '3', label: 'Payshanba' },
  { value: '4', label: 'Juma' },
  { value: '5', label: 'Shanba' },
];

const PAIR_OPTIONS = [
  { value: '1', label: '1-juft (08:30–10:00)' },
  { value: '2', label: '2-juft (10:15–11:45)' },
  { value: '3', label: '3-juft (12:00–13:30)' },
  { value: '4', label: '4-juft (13:45–15:15)' },
  { value: '5', label: '5-juft (15:30–17:00)' },
  { value: '6', label: '6-juft (17:15–18:45)' },
  { value: '7', label: '7-juft (19:00–20:30)' },
];

const TYPE_OPTIONS = [
  { value: 'lecture', label: "Ma'ruza" },
  { value: 'practice', label: 'Amaliy' },
  { value: 'lab', label: 'Laboratoriya' },
  { value: 'seminar', label: 'Seminar' },
];

interface ScheduleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  schedule?: Schedule | null;
  groups: { id: number; name: string }[];
  subjects: { id: number; name: string }[];
  teachers: { id: number; name: string }[];
  semesters: { id: number; name: string }[];
  loading?: boolean;
}

export function ScheduleForm({ open, onClose, onSubmit, schedule, groups, subjects, teachers, semesters, loading }: ScheduleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema) as unknown as Resolver<ScheduleFormData>,
    defaultValues: schedule
      ? {
          groupId: schedule.groupId,
          subjectId: schedule.subjectId,
          teacherId: schedule.teacherId,
          semesterId: schedule.semesterId,
          dayOfWeek: schedule.dayOfWeek,
          pairNumber: schedule.pairNumber,
          room: schedule.room,
          lessonType: schedule.lessonType,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={schedule ? 'Darsni tahrirlash' : "Yangi dars"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {schedule ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Guruh" error={errors.groupId?.message} required>
            <FormSelect
              {...register('groupId')}
              options={groups.map((g) => ({ value: String(g.id), label: g.name }))}
              placeholder="Guruhni tanlang"
              error={!!errors.groupId}
            />
          </FormField>
          <FormField label="Fan" error={errors.subjectId?.message} required>
            <FormSelect
              {...register('subjectId')}
              options={subjects.map((s) => ({ value: String(s.id), label: s.name }))}
              placeholder="Fanni tanlang"
              error={!!errors.subjectId}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="O'qituvchi" error={errors.teacherId?.message} required>
            <FormSelect
              {...register('teacherId')}
              options={teachers.map((t) => ({ value: String(t.id), label: t.name }))}
              placeholder="O'qituvchini tanlang"
              error={!!errors.teacherId}
            />
          </FormField>
          <FormField label="Semestr" error={errors.semesterId?.message} required>
            <FormSelect
              {...register('semesterId')}
              options={semesters.map((s) => ({ value: String(s.id), label: s.name }))}
              placeholder="Semesterni tanlang"
              error={!!errors.semesterId}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Hafta kuni" error={errors.dayOfWeek?.message} required>
            <FormSelect
              {...register('dayOfWeek')}
              options={DAY_OPTIONS}
              placeholder="Kunni tanlang"
              error={!!errors.dayOfWeek}
            />
          </FormField>
          <FormField label="Juft (vaqt)" error={errors.pairNumber?.message} required>
            <FormSelect
              {...register('pairNumber')}
              options={PAIR_OPTIONS}
              placeholder="Juftni tanlang"
              error={!!errors.pairNumber}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Xona" error={errors.room?.message} required>
            <FormInput {...register('room')} placeholder="301" error={!!errors.room} />
          </FormField>
          <FormField label="Dars turi" error={errors.lessonType?.message} required>
            <FormSelect
              {...register('lessonType')}
              options={TYPE_OPTIONS}
              placeholder="Turni tanlang"
              error={!!errors.lessonType}
            />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}
