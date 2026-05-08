import { Select } from '@/components/ui/Select';
import {
  FACULTIES,
  EDUCATION_FORMS,
  PAYMENT_FORMS,
} from '@/api/mock/students.mock';
import type { StudentStatus } from '@/types/student';

interface StudentFiltersProps {
  facultyId: string;
  onFacultyChange: (value: string) => void;
  course: string;
  onCourseChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  educationForm: string;
  onEducationFormChange: (value: string) => void;
  paymentForm: string;
  onPaymentFormChange: (value: string) => void;
}

const STATUS_OPTIONS: { value: StudentStatus | ''; label: string }[] = [
  { value: '', label: 'Barchasi' },
  { value: 'active', label: "O'qimoqda" },
  { value: 'academic_leave', label: "Akademik ta'tilda" },
  { value: 'expelled', label: 'Chetlatilgan' },
  { value: 'graduated', label: 'Bitirgan' },
  { value: 'transferred', label: "Ko'chirilgan" },
];

const COURSE_OPTIONS = [
  { value: '', label: 'Barcha kurslar' },
  { value: '1', label: '1-kurs' },
  { value: '2', label: '2-kurs' },
  { value: '3', label: '3-kurs' },
  { value: '4', label: '4-kurs' },
];

export function StudentFilters({
  facultyId,
  onFacultyChange,
  course,
  onCourseChange,
  status,
  onStatusChange,
  educationForm,
  onEducationFormChange,
  paymentForm,
  onPaymentFormChange,
}: StudentFiltersProps) {
  const facultyOptions = [
    { value: '', label: 'Barcha fakultetlar' },
    ...FACULTIES.map((f) => ({ value: String(f.id), label: f.name })),
  ];

  const edFormOptions = [
    { value: '', label: "Barcha shakllar" },
    ...EDUCATION_FORMS.map((f) => ({ value: f.code, label: f.name })),
  ];

  const payFormOptions = [
    { value: '', label: "Barcha to'lovlar" },
    ...PAYMENT_FORMS.map((f) => ({ value: f.code, label: f.name })),
  ];

  return (
    <>
      <Select
        options={facultyOptions}
        value={facultyId}
        onChange={(e) => onFacultyChange(e.target.value)}
        className="w-44"
      />
      <Select
        options={COURSE_OPTIONS}
        value={course}
        onChange={(e) => onCourseChange(e.target.value)}
        className="w-32"
      />
      <Select
        options={STATUS_OPTIONS}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-40"
      />
      <Select
        options={edFormOptions}
        value={educationForm}
        onChange={(e) => onEducationFormChange(e.target.value)}
        className="w-40"
      />
      <Select
        options={payFormOptions}
        value={paymentForm}
        onChange={(e) => onPaymentFormChange(e.target.value)}
        className="w-40"
      />
    </>
  );
}
