import { useEffect } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { createCurriculumSchema, type CreateCurriculumFormData } from '../schemas/curriculum.schema';
import type { Curriculum } from '@/types/education';
import { Plus, Trash2 } from 'lucide-react';

interface CurriculumFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCurriculumFormData) => void;
  specialties: { id: number; name: string }[];
  subjects: { id: number; name: string }[];
  curriculum?: Curriculum | null;
  loading?: boolean;
}

const CONTROL_FORM_OPTIONS = [
  { value: 'exam', label: 'Imtihon' },
  { value: 'credit', label: 'Kredit' },
  { value: 'diff_credit', label: 'Differentsial kredit' },
];

const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}-semestr`,
}));

const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  value: String(2025 + i),
  label: String(2025 + i),
}));

export function CurriculumForm({ open, onClose, onSubmit, specialties, subjects, curriculum, loading }: CurriculumFormProps) {
  const isEdit = !!curriculum;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateCurriculumFormData>({
    resolver: zodResolver(createCurriculumSchema) as unknown as Resolver<CreateCurriculumFormData>,
    defaultValues: {
      subjects: [
        { subjectId: 0, semester: 1, credits: 3, hoursLecture: 30, hoursPractice: 15, hoursLab: 0, controlForm: 'exam', isElective: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'subjects' });

  useEffect(() => {
    if (open) {
      if (curriculum) {
        reset({
          specialtyId: curriculum.specialtyId,
          year: curriculum.year,
          subjects: curriculum.subjects.map((s) => ({
            subjectId: s.subjectId,
            semester: s.semester,
            credits: s.credits,
            hoursLecture: s.hoursLecture,
            hoursPractice: s.hoursPractice,
            hoursLab: s.hoursLab,
            controlForm: s.controlForm,
            isElective: s.isElective,
          })),
        });
      } else {
        reset({
          subjects: [{ subjectId: 0, semester: 1, credits: 3, hoursLecture: 30, hoursPractice: 15, hoursLab: 0, controlForm: 'exam', isElective: false }],
        });
      }
    }
  }, [open, curriculum, reset]);

  const handleClose = () => { reset(); onClose(); };

  const subjectOptions = subjects.map((s) => ({ value: String(s.id), label: s.name }));

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={isEdit ? "O'quv rejani tahrirlash" : "Yangi o'quv reja"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {isEdit ? 'Yangilash' : 'Saqlash'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Mutaxassislik" error={errors.specialtyId?.message} required>
            <FormSelect
              {...register('specialtyId')}
              options={specialties.map((s) => ({ value: String(s.id), label: s.name }))}
              placeholder="Tanlang"
              error={!!errors.specialtyId}
            />
          </FormField>
          <FormField label="O'quv yili" error={errors.year?.message} required>
            <FormSelect {...register('year')} options={YEAR_OPTIONS} placeholder="Yil" error={!!errors.year} />
          </FormField>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">Fanlar ro'yxati</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => append({ subjectId: 0, semester: 1, credits: 3, hoursLecture: 30, hoursPractice: 15, hoursLab: 0, controlForm: 'exam', isElective: false })}
            >
              <Plus className="h-4 w-4 mr-1" /> Fan qo'shish
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div key={field.id} className="rounded-lg border border-border p-3 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">{idx + 1}-fan</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <FormField label="Fan" error={errors.subjects?.[idx]?.subjectId?.message} required>
                    <FormSelect
                      {...register(`subjects.${idx}.subjectId`)}
                      options={subjectOptions}
                      placeholder="Fanni tanlang"
                      error={!!errors.subjects?.[idx]?.subjectId}
                    />
                  </FormField>
                  <FormField label="Semestr" error={errors.subjects?.[idx]?.semester?.message} required>
                    <FormSelect
                      {...register(`subjects.${idx}.semester`)}
                      options={SEMESTER_OPTIONS}
                      placeholder="Semestr"
                      error={!!errors.subjects?.[idx]?.semester}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2">
                  <FormField label="Kredit" error={errors.subjects?.[idx]?.credits?.message} required>
                    <FormInput {...register(`subjects.${idx}.credits`)} type="number" placeholder="3" error={!!errors.subjects?.[idx]?.credits} />
                  </FormField>
                  <FormField label="Ma'ruza" error={errors.subjects?.[idx]?.hoursLecture?.message} required>
                    <FormInput {...register(`subjects.${idx}.hoursLecture`)} type="number" placeholder="30" error={!!errors.subjects?.[idx]?.hoursLecture} />
                  </FormField>
                  <FormField label="Amaliy" error={errors.subjects?.[idx]?.hoursPractice?.message} required>
                    <FormInput {...register(`subjects.${idx}.hoursPractice`)} type="number" placeholder="15" error={!!errors.subjects?.[idx]?.hoursPractice} />
                  </FormField>
                  <FormField label="Lab" error={errors.subjects?.[idx]?.hoursLab?.message} required>
                    <FormInput {...register(`subjects.${idx}.hoursLab`)} type="number" placeholder="0" error={!!errors.subjects?.[idx]?.hoursLab} />
                  </FormField>
                </div>

                <FormField label="Nazorat shakli" error={errors.subjects?.[idx]?.controlForm?.message} required>
                  <FormSelect
                    {...register(`subjects.${idx}.controlForm`)}
                    options={CONTROL_FORM_OPTIONS}
                    placeholder="Tanlang"
                    error={!!errors.subjects?.[idx]?.controlForm}
                  />
                </FormField>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
