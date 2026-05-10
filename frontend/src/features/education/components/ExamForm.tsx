import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormDatePicker } from '@/components/form';
import { createExamSchema, type CreateExamFormData } from '../schemas/exam.schema';
import type { Exam } from '@/types/education';

interface ExamFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExamFormData) => void;
  exam?: Exam | null;
  subjects: { id: number; name: string }[];
  groups: { id: number; name: string }[];
  teachers: { id: number; fullName: string }[];
  loading?: boolean;
}

const TYPE_OPTIONS = [
  { value: 'midterm', label: 'Oraliq imtihon' },
  { value: 'final', label: 'Yakuniy imtihon' },
];

export function ExamForm({
  open,
  onClose,
  onSubmit,
  exam,
  subjects,
  groups,
  teachers,
  loading,
}: ExamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateExamFormData>({
    resolver: zodResolver(createExamSchema) as unknown as Resolver<CreateExamFormData>,
    defaultValues: exam
      ? {
          subjectId: exam.subjectId,
          groupId: exam.groupId,
          examDate: exam.examDate,
          room: exam.room,
          type: exam.type,
          teacherId: exam.teacherId,
        }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={exam ? "Imtihonni tahrirlash" : "Yangi imtihon"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {exam ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fan" error={errors.subjectId?.message} required>
            <FormSelect
              {...register('subjectId')}
              options={subjects.map((s) => ({ value: String(s.id), label: s.name }))}
              placeholder="Fanni tanlang"
              error={!!errors.subjectId}
            />
          </FormField>
          <FormField label="Guruh" error={errors.groupId?.message} required>
            <FormSelect
              {...register('groupId')}
              options={groups.map((g) => ({ value: String(g.id), label: g.name }))}
              placeholder="Guruhni tanlang"
              error={!!errors.groupId}
            />
          </FormField>
        </div>

        <FormField label="O'qituvchi" error={errors.teacherId?.message} required>
          <FormSelect
            {...register('teacherId')}
            options={teachers.map((t) => ({ value: String(t.id), label: t.fullName }))}
            placeholder="O'qituvchini tanlang"
            error={!!errors.teacherId}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Imtihon sanasi" error={errors.examDate?.message} required>
            <FormDatePicker {...register('examDate')} error={!!errors.examDate} />
          </FormField>
          <FormField label="Xona" error={errors.room?.message} required>
            <FormInput {...register('room')} placeholder="101-xona" error={!!errors.room} />
          </FormField>
        </div>

        <FormField label="Imtihon turi" error={errors.type?.message} required>
          <FormSelect
            {...register('type')}
            options={TYPE_OPTIONS}
            placeholder="Turni tanlang"
            error={!!errors.type}
          />
        </FormField>
      </div>
    </Modal>
  );
}
