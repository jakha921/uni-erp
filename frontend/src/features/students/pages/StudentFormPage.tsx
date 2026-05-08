import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/data-display/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/form/FormField';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import { FormPhoneInput } from '@/components/form/FormPhoneInput';
import {
  createStudentSchema,
  type CreateStudentFormData,
} from '../schemas/student.schema';
import { useStudent, useCreateStudent, useUpdateStudent } from '@/api/hooks/useStudents';
import {
  FACULTIES,
  DEPARTMENTS,
  SPECIALTIES,
  GROUPS,
  EDUCATION_FORMS,
  PAYMENT_FORMS,
} from '@/api/mock/students.mock';

export function StudentFormPage() {
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

  const filteredDepartments = useMemo(
    () =>
      selectedFacultyId
        ? DEPARTMENTS.filter((d) => d.facultyId === Number(selectedFacultyId))
        : DEPARTMENTS,
    [selectedFacultyId],
  );

  const filteredSpecialties = useMemo(
    () =>
      selectedDeptId
        ? SPECIALTIES.filter(
            (s) => s.departmentId === Number(selectedDeptId),
          )
        : SPECIALTIES,
    [selectedDeptId],
  );

  const filteredGroups = useMemo(() => {
    if (selectedFacultyId) {
      const fac = FACULTIES.find((f) => f.id === Number(selectedFacultyId));
      if (fac) {
        return GROUPS.filter((g) => g.name.startsWith(fac.code));
      }
    }
    return GROUPS;
  }, [selectedFacultyId]);

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

  if (isEdit && isLoadingStudent) {
    return <div className="p-6 text-muted">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={isEdit ? 'Talabani tahrirlash' : 'Yangi talaba qo\'shish'}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Talabalar', path: '/students' },
          { label: isEdit ? 'Tahrirlash' : 'Yangi' },
        ]}
        actions={
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal info */}
        <Card title="Shaxsiy ma'lumotlar">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Familiya"
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
              label="Ism"
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
              label="Sharif"
              error={errors.thirdName?.message}
              required
            >
              <FormInput
                {...register('thirdName')}
                placeholder="Bahodirovich"
                error={!!errors.thirdName}
              />
            </FormField>
            <FormField label="Jinsi" error={errors.gender?.message} required>
              <FormSelect
                {...register('gender')}
                options={[
                  { value: '1', label: 'Erkak' },
                  { value: '2', label: 'Ayol' },
                ]}
                placeholder="Tanlang"
                error={!!errors.gender}
              />
            </FormField>
            <FormField
              label="Tug'ilgan sana"
              error={errors.birthDate?.message}
              required
            >
              <FormDatePicker
                {...register('birthDate')}
                error={!!errors.birthDate}
              />
            </FormField>
            <FormField label="Telefon" error={errors.phone?.message} required>
              <FormPhoneInput
                {...register('phone')}
                error={!!errors.phone}
              />
            </FormField>
            <FormField label="Email" error={errors.email?.message}>
              <FormInput
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                error={!!errors.email}
              />
            </FormField>
            <FormField
              label="Pasport"
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
              label="PINFL (JSHSHIR)"
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
              label="Manzil"
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
        <Card title="O'quv ma'lumotlari">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Fakultet"
              error={errors.facultyId?.message}
              required
            >
              <FormSelect
                {...register('facultyId')}
                options={FACULTIES.map((f) => ({
                  value: String(f.id),
                  label: f.name,
                }))}
                placeholder="Tanlang"
                error={!!errors.facultyId}
              />
            </FormField>
            <FormField
              label="Kafedra"
              error={errors.departmentId?.message}
              required
            >
              <FormSelect
                {...register('departmentId')}
                options={filteredDepartments.map((d) => ({
                  value: String(d.id),
                  label: d.name,
                }))}
                placeholder="Tanlang"
                error={!!errors.departmentId}
              />
            </FormField>
            <FormField
              label="Mutaxassislik"
              error={errors.specialtyId?.message}
              required
            >
              <FormSelect
                {...register('specialtyId')}
                options={filteredSpecialties.map((s) => ({
                  value: String(s.id),
                  label: s.name,
                }))}
                placeholder="Tanlang"
                error={!!errors.specialtyId}
              />
            </FormField>
            <FormField
              label="Guruh"
              error={errors.groupId?.message}
              required
            >
              <FormSelect
                {...register('groupId')}
                options={filteredGroups.map((g) => ({
                  value: String(g.id),
                  label: g.name,
                }))}
                placeholder="Tanlang"
                error={!!errors.groupId}
              />
            </FormField>
            <FormField
              label="Ta'lim shakli"
              error={errors.educationForm?.message}
              required
            >
              <FormSelect
                {...register('educationForm')}
                options={EDUCATION_FORMS.map((f) => ({
                  value: f.code,
                  label: f.name,
                }))}
                placeholder="Tanlang"
                error={!!errors.educationForm}
              />
            </FormField>
            <FormField
              label="Ta'lim turi"
              error={errors.educationType?.message}
              required
            >
              <FormSelect
                {...register('educationType')}
                options={[
                  { value: 'bakalavr', label: 'Bakalavriat' },
                  { value: 'magistr', label: 'Magistratura' },
                ]}
                placeholder="Tanlang"
                error={!!errors.educationType}
              />
            </FormField>
            <FormField
              label="To'lov shakli"
              error={errors.paymentForm?.message}
              required
            >
              <FormSelect
                {...register('paymentForm')}
                options={PAYMENT_FORMS.map((p) => ({
                  value: p.code,
                  label: p.name,
                }))}
                placeholder="Tanlang"
                error={!!errors.paymentForm}
              />
            </FormField>
            <FormField
              label="Kurs"
              error={errors.level?.message}
              required
            >
              <FormSelect
                {...register('level')}
                options={[
                  { value: '1', label: '1-kurs' },
                  { value: '2', label: '2-kurs' },
                  { value: '3', label: '3-kurs' },
                  { value: '4', label: '4-kurs' },
                ]}
                placeholder="Tanlang"
                error={!!errors.level}
              />
            </FormField>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            leftIcon={<Save className="h-4 w-4" />}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {isEdit ? 'Saqlash' : 'Qo\'shish'}
          </Button>
        </div>
      </form>
    </div>
  );
}
