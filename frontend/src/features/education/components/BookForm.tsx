import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { createBookSchema, type CreateBookFormData } from '../schemas/book.schema';
import type { Book } from '@/types/education';

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookFormData) => void;
  book?: Book | null;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'textbook', label: "Darslik" },
  { value: 'reference', label: "Ma'lumotnoma" },
  { value: 'monograph', label: 'Monografiya' },
  { value: 'fiction', label: "Badiiy adabiyot" },
  { value: 'science', label: 'Ilmiy adabiyot' },
  { value: 'periodical', label: 'Davriy nashr' },
];

export function BookForm({ open, onClose, onSubmit, book, loading }: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema) as unknown as Resolver<CreateBookFormData>,
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          year: book.year,
          category: book.category,
          totalCopies: book.totalCopies,
          location: book.location,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={book ? "Kitobni tahrirlash" : "Yangi kitob"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {book ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Kitob nomi" error={errors.title?.message} required>
          <FormInput {...register('title')} placeholder="Kitob nomi" error={!!errors.title} />
        </FormField>

        <FormField label="Muallif" error={errors.author?.message} required>
          <FormInput {...register('author')} placeholder="Muallif ismi" error={!!errors.author} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="ISBN" error={errors.isbn?.message} required>
            <FormInput {...register('isbn')} placeholder="978-X-XXXXX-XXX-X" error={!!errors.isbn} />
          </FormField>
          <FormField label="Nashr yili" error={errors.year?.message} required>
            <FormInput {...register('year')} type="number" placeholder="2024" error={!!errors.year} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Kategoriya" error={errors.category?.message} required>
            <FormSelect
              {...register('category')}
              options={CATEGORY_OPTIONS}
              placeholder="Kategoriya tanlang"
              error={!!errors.category}
            />
          </FormField>
          <FormField label="Nusxalar soni" error={errors.totalCopies?.message} required>
            <FormInput {...register('totalCopies')} type="number" placeholder="5" error={!!errors.totalCopies} />
          </FormField>
        </div>

        <FormField label="Joylashuv (shelf)" error={errors.location?.message} required>
          <FormInput {...register('location')} placeholder="A-12-3" error={!!errors.location} />
        </FormField>
      </div>
    </Modal>
  );
}
