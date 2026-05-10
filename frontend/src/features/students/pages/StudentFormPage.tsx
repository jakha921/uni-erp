import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/form/FormField';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import { FormPhoneInput } from '@/components/form/FormPhoneInput';
import { FileUpload } from '@/components/form/FileUpload';
import {
  createStudentSchema,
  type CreateStudentFormData,
} from '../schemas/student.schema';
import { useStudent, useCreateStudent, useUpdateStudent } from '@/api/hooks/useStudents';
import { useFaculties, useDepartments, useSpecialties, useGroups } from '@/api/hooks/useCore';
import { useTranslation } from 'react-i18next';


export function StudentFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const studentId = Number(id);

  const { data: student, isLoading: isLoadingStudent } = useStudent(
    isEdit ? studentId : 0,
  );

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema) as unknown as Resolver<CreateStudentFormData>,
    defaultValues: {
      firstName: '',
      secondName: '',
      thirdName: '',
      gender: '',
      birthDate: '',
      facultyId: 0,
      departmentId: 0,
      specialtyId: 0,
      groupId: 0,
      level: '',
      educationForm: '',
      educationType: 'bakalavr',
      paymentForm: '',
      phone: '',
      email: '',
      passport: '',
      pinfl: '',
      address: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (student && isEdit) {
      reset({
        firstName: student.firstName,
        secondName: student.secondName,
        thirdName: student.thirdName,
        gender: student.gender.code,
        birthDate: student.birthDate,
        facultyId: student.faculty.id,
        departmentId: student.department.id,
        specialtyId: student.specialty.id,
        groupId: student.group.id,
        level: String(student.course),
        educationForm: student.educationForm.code,
        educationType: student.educationType.code,
        paymentForm: student.paymentForm.code,
        phone: student.phone,
        email: student.email,
        passport: student.passport,
        pinfl: student.pinfl,
        address: student.address,
      });
    }
  }, [student, isEdit, reset]);

  const selectedFacultyId = watch('facultyId');
  const selectedDeptId = watch('departmentId');
  const selectedSpecialtyId = watch('specialtyId');

  const { data: faculties } = useFaculties();
  const { data: departments } = useDepartments(selectedFacultyId ? Number(selectedFacultyId) : undefined);
  const { data: specialties } = useSpecialties(selectedDeptId ? Number(selectedDeptId) : undefined);
  const { data: groups } = useGroups(selectedSpecialtyId ? Number(selectedSpecialtyId) : undefined);

  const onSubmit = (data: CreateStudentFormData) => {
    const dto = data as unknown as import('@/types/student').CreateStudentDto;
    if (isEdit) {
      updateMutation.mutate(
        { id: studentId, data: dto },
        {
          onSuccess: () => navigate(`/students/${studentId}`),
        },
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => navigate('/students'),
      });
    }
  };

  const educationFormOptions = [
    { value: 'kunduzgi', label: t('students.kunduzgi') },
    { value: 'sirtqi', label: t('students.sirtqi') },
    { value: 'kechki', label: t('students.kechki') },
  ];

  const paymentFormOptions = [
    { value: 'grant', label: t('students.grantPayment') },
    { value: 'kontrakt', label: t('students.contractPayment') },
  ];

  if (isEdit && isLoadingStudent) {
    return <PageContent className="text-muted">{t('common.loading')}</PageContent>;
  }

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title={isEdit ? t('students.editTitle') : t('students.addTitle')}
        breadcrumbs={[
          { label: t('nav.dashboard'), path: '/' },
          { label: t('nav.students'), path: '/students' },
          { label: isEdit ? t('common.edit') : t('common.new') },
        ]}
        actions={
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal info */}
        <Card title={t('students.personalInfo')}>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label={t('students.lastName')}
              error={errors.secondName?.message}
              required
            >
              <FormInput
                {...register('secondName')}
                placeholder="Karimov"
                error={!!errors.secondName}
              />
            </FormField>
            <FormField
              label={t('students.firstName')}
              error={errors.firstName?.message}
              required
            >
              <FormInput
                {...register('firstName')}
                placeholder="Jasur"
                error={!!errors.firstName}
              />
            </FormField>
            <FormField
              label={t('students.middleName')}
              error={errors.thirdName?.message}
              required
            >
              <FormInput
                {...register('thirdName')}
                placeholder="Bahodirovich"
                error={!!errors.thirdName}
              />
            </FormField>
            <FormField label={t('students.gender')} error={errors.gender?.message} required>
              <FormSelect
                {...register('gender')}
                options={[
                  { value: '1', label: t('students.male') },
                  { value: '2', label: t('students.female') },
                ]}
                placeholder={t('common.select')}
                error={!!errors.gender}
              />
            </FormField>
            <FormField
              label={t('students.birthDate')}
              error={errors.birthDate?.message}
              required
            >
              <FormDatePicker
                {...register('birthDate')}
                error={!!errors.birthDate}
              />
            </FormField>
            <FormField label={t('common.phone')} error={errors.phone?.message} required>
              <FormPhoneInput
                {...register('phone')}
                error={!!errors.phone}
              />
            </FormField>
            <FormField label={t('common.email')} error={errors.email?.message}>
              <FormInput
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                error={!!errors.email}
              />
            </FormField>
            <FormField
              label={t('students.passport')}
              error={errors.passport?.message}
              required
            >
              <FormInput
                {...register('passport')}
                placeholder="AA1234567"
                error={!!errors.passport}
              />
            </FormField>
            <FormField
              label={t('students.pinfl')}
              error={errors.pinfl?.message}
              required
            >
              <FormInput
                {...register('pinfl')}
                placeholder="31234567890123"
                error={!!errors.pinfl}
              />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField
              label={t('common.address')}
              error={errors.address?.message}
              required
            >
              <FormInput
                {...register('address')}
                placeholder="Toshkent sh., Chilonzor t., 7-mavze"
                error={!!errors.address}
                className="w-full"
              />
            </FormField>
          </div>
        </Card>

        {/* Academic info */}
        <Card title={t('students.academicInfo')}>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label={t('students.faculty')}
              error={errors.facultyId?.message}
              required
            >
              <FormSelect
                {...register('facultyId')}
                options={(faculties ?? []).map((f) => ({ value: String(f.id), label: f.name }))}
                placeholder={t('common.select')}
                error={!!errors.facultyId}
              />
            </FormField>
            <FormField
              label={t('students.department')}
              error={errors.departmentId?.message}
              required
            >
              <FormSelect
                {...register('departmentId')}
                options={(departments ?? []).map((d) => ({ value: String(d.id), label: d.name }))}
                placeholder={t('common.select')}
                error={!!errors.departmentId}
              />
            </FormField>
            <FormField
              label={t('students.specialty')}
              error={errors.specialtyId?.message}
              required
            >
              <FormSelect
                {...register('specialtyId')}
                options={(specialties ?? []).map((s) => ({ value: String(s.id), label: s.name }))}
                placeholder={t('common.select')}
                error={!!errors.specialtyId}
              />
            </FormField>
            <FormField
              label={t('students.group')}
              error={errors.groupId?.message}
              required
            >
              <FormSelect
                {...register('groupId')}
                options={(groups ?? []).map((g) => ({ value: String(g.id), label: g.name }))}
                placeholder={t('common.select')}
                error={!!errors.groupId}
              />
            </FormField>
            <FormField
              label={t('students.educationForm')}
              error={errors.educationForm?.message}
              required
            >
              <FormSelect
                {...register('educationForm')}
                options={educationFormOptions}
                placeholder={t('common.select')}
                error={!!errors.educationForm}
              />
            </FormField>
            <FormField
              label={t('students.educationType')}
              error={errors.educationType?.message}
              required
            >
              <FormSelect
                {...register('educationType')}
                options={[
                  { value: 'bakalavr', label: t('students.bachelor') },
                  { value: 'magistr', label: t('students.master') },
                ]}
                placeholder={t('common.select')}
                error={!!errors.educationType}
              />
            </FormField>
            <FormField
              label={t('students.paymentForm')}
              error={errors.paymentForm?.message}
              required
            >
              <FormSelect
                {...register('paymentForm')}
                options={paymentFormOptions}
                placeholder={t('common.select')}
                error={!!errors.paymentForm}
              />
            </FormField>
            <FormField
              label={t('students.course')}
              error={errors.level?.message}
              required
            >
              <FormSelect
                {...register('level')}
                options={[
                  { value: '1', label: t('students.course1') },
                  { value: '2', label: t('students.course2') },
                  { value: '3', label: t('students.course3') },
                  { value: '4', label: t('students.course4') },
                ]}
                placeholder={t('common.select')}
                error={!!errors.level}
              />
            </FormField>
          </div>
        </Card>

        {/* Photo upload */}
        <Card title={t('students.photo')}>
          <PhotoUploadCard t={t} />
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            leftIcon={<Save className="h-4 w-4" />}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {isEdit ? t('common.save') : t('common.add')}
          </Button>
        </div>
      </form>
    </PageContent>
  );
}

function PhotoUploadCard({ t }: { t: (key: string) => string }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div className="flex items-start gap-6">
      <div className="shrink-0">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-100 border-2 border-dashed border-border flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] text-slate-400 text-center px-2">{t('students.noPhoto')}</span>
          )}
        </div>
      </div>
      <div className="flex-1">
        <FileUpload
          accept="image/jpeg,image/png,image/webp"
          maxSize={5 * 1024 * 1024}
          onUpload={handleFiles}
          preview={false}
        />
        <p className="mt-2 text-xs text-slate-400">{t('students.photoFormats')}</p>
      </div>
    </div>
  );
}
