import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlideOver } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect, FormDatePicker } from '@/components/form';
import { employeeSchema, type EmployeeFormData } from '../schemas/employee.schema';
import type { Employee, HrDepartment } from '@/types/hr';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee | null;
  departments: HrDepartment[];
  loading?: boolean;
}

const POSITION_OPTIONS = [
  { value: 'professor', label: 'Professor' },
  { value: 'dotsent', label: 'Dotsent' },
  { value: 'katta-oqituvchi', label: "Katta o'qituvchi" },
  { value: 'oqituvchi', label: "O'qituvchi" },
  { value: 'assistent', label: 'Assistent' },
  { value: 'laborant', label: 'Laborant' },
  { value: 'boshqaruvchi', label: 'Boshqaruvchi' },
];

const DEGREE_OPTIONS = [
  { value: 'dsc', label: 'Fan doktori (DSc)' },
  { value: 'phd', label: 'PhD' },
  { value: 'fan-nomzodi', label: 'Fan nomzodi' },
  { value: 'magistr', label: 'Magistr' },
  { value: 'bakalavr', label: 'Bakalavr' },
  { value: 'no-degree', label: 'Ilmiy darajasiz' },
];

const RANK_OPTIONS = [
  { value: 'professor', label: 'Professor' },
  { value: 'dotsent', label: 'Dotsent' },
  { value: 'no-rank', label: "Yo'q" },
];

const EMPL_TYPE_OPTIONS = [
  { value: 'full', label: 'Asosiy' },
  { value: 'partial', label: "O'rindosh" },
  { value: 'contract', label: 'Soatbay' },
];

const GENDER_OPTIONS = [
  { value: '1', label: 'Erkak' },
  { value: '2', label: 'Ayol' },
];

export function EmployeeForm({
  open,
  onClose,
  onSubmit,
  employee,
  departments,
  loading,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema) as unknown as Resolver<EmployeeFormData>,
    defaultValues: employee
      ? {
          firstName: employee.firstName,
          secondName: employee.secondName,
          thirdName: employee.thirdName,
          gender: employee.gender.code,
          birthDate: employee.birthDate,
          departmentId: employee.department.id,
          positionCode: employee.position.code,
          academicDegree: employee.academicDegree.code,
          academicRank: employee.academicRank.code,
          employmentForm: employee.employmentForm.code,
          hireDate: employee.hireDate,
          phone: employee.phone,
          email: employee.email,
          passport: employee.passport,
          pinfl: employee.pinfl,
          salary: employee.salary,
        }
      : undefined,
  });

  const handleFormSubmit = (data: EmployeeFormData) => {
    onSubmit(data);
    reset();
  };

  const deptOptions = departments.map((d) => ({
    value: String(d.id),
    label: d.name,
  }));

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={employee ? 'Xodimni tahrirlash' : "Yangi xodim qo'shish"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {employee ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Familiya" error={errors.secondName?.message} required>
            <FormInput
              {...register('secondName')}
              placeholder="Karimov"
              error={!!errors.secondName}
            />
          </FormField>
          <FormField label="Ism" error={errors.firstName?.message} required>
            <FormInput
              {...register('firstName')}
              placeholder="Jasur"
              error={!!errors.firstName}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Otasining ismi" error={errors.thirdName?.message} required>
            <FormInput
              {...register('thirdName')}
              placeholder="Sardor o'g'li"
              error={!!errors.thirdName}
            />
          </FormField>
          <FormField label="Jinsi" error={errors.gender?.message} required>
            <FormSelect
              {...register('gender')}
              options={GENDER_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.gender}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tug'ilgan sana" error={errors.birthDate?.message} required>
            <FormDatePicker
              {...register('birthDate')}
              error={!!errors.birthDate}
            />
          </FormField>
          <FormField label="Ishga qabul sanasi" error={errors.hireDate?.message} required>
            <FormDatePicker
              {...register('hireDate')}
              error={!!errors.hireDate}
            />
          </FormField>
        </div>

        <FormField label="Bo'lim" error={errors.departmentId?.message} required>
          <FormSelect
            {...register('departmentId')}
            options={deptOptions}
            placeholder="Tanlang"
            error={!!errors.departmentId}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Lavozimi" error={errors.positionCode?.message} required>
            <FormSelect
              {...register('positionCode')}
              options={POSITION_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.positionCode}
            />
          </FormField>
          <FormField label="Ish turi" error={errors.employmentForm?.message} required>
            <FormSelect
              {...register('employmentForm')}
              options={EMPL_TYPE_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.employmentForm}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ilmiy daraja" error={errors.academicDegree?.message} required>
            <FormSelect
              {...register('academicDegree')}
              options={DEGREE_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.academicDegree}
            />
          </FormField>
          <FormField label="Ilmiy unvon" error={errors.academicRank?.message} required>
            <FormSelect
              {...register('academicRank')}
              options={RANK_OPTIONS}
              placeholder="Tanlang"
              error={!!errors.academicRank}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Telefon" error={errors.phone?.message} required>
            <FormInput
              {...register('phone')}
              placeholder="+998 (90) 123-45-67"
              error={!!errors.phone}
            />
          </FormField>
          <FormField label="Email" error={errors.email?.message} required>
            <FormInput
              {...register('email')}
              type="email"
              placeholder="karimov.j@uni.uz"
              error={!!errors.email}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Pasport" error={errors.passport?.message} required>
            <FormInput
              {...register('passport')}
              placeholder="AB 1234567"
              error={!!errors.passport}
            />
          </FormField>
          <FormField label="JSHSHIR (PINFL)" error={errors.pinfl?.message} required>
            <FormInput
              {...register('pinfl')}
              placeholder="30000000000000"
              error={!!errors.pinfl}
            />
          </FormField>
        </div>

        <FormField label="Maosh (so'm)" error={errors.salary?.message} required>
          <FormInput
            {...register('salary')}
            type="number"
            placeholder="5000000"
            error={!!errors.salary}
          />
        </FormField>
      </form>
    </SlideOver>
  );
}
