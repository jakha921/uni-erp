import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/overlays';
import { Button } from '@/components/ui';
import { FormField, FormInput, FormSelect } from '@/components/form';
import { dormRoomSchema, type DormRoomFormData } from '../schemas/dormRoom.schema';
import type { DormRoom } from '@/types/infrastructure';

const STATUS_OPTIONS = [
  { value: 'available', label: "Bo'sh" },
  { value: 'partial', label: "Qisman band" },
  { value: 'full', label: "To'liq band" },
  { value: 'repair', label: "Ta'mir" },
];

interface DormRoomFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DormRoomFormData) => void;
  room?: DormRoom | null;
  buildings: { id: number; name: string }[];
  loading?: boolean;
}

export function DormRoomForm({ open, onClose, onSubmit, room, buildings, loading }: DormRoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DormRoomFormData>({
    resolver: zodResolver(dormRoomSchema) as unknown as Resolver<DormRoomFormData>,
    defaultValues: room
      ? {
          buildingId: room.buildingId,
          number: room.number,
          floor: room.floor,
          capacity: room.capacity,
          status: room.status,
        }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={room ? 'Xonani tahrirlash' : 'Yangi xona'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit((d) => { onSubmit(d); reset(); })}>
            {room ? 'Saqlash' : "Qo'shish"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Bino" error={errors.buildingId?.message} required>
          <FormSelect
            {...register('buildingId')}
            options={buildings.map((b) => ({ value: String(b.id), label: b.name }))}
            placeholder="Binoni tanlang"
            error={!!errors.buildingId}
          />
        </FormField>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Xona raqami" error={errors.number?.message} required>
            <FormInput {...register('number')} type="number" placeholder="101" error={!!errors.number} />
          </FormField>
          <FormField label="Qavat" error={errors.floor?.message} required>
            <FormInput {...register('floor')} type="number" placeholder="1" error={!!errors.floor} />
          </FormField>
          <FormField label="Sig'im" error={errors.capacity?.message} required>
            <FormInput {...register('capacity')} type="number" placeholder="4" error={!!errors.capacity} />
          </FormField>
        </div>
        <FormField label="Holat" error={errors.status?.message} required>
          <FormSelect
            {...register('status')}
            options={STATUS_OPTIONS}
            placeholder="Holatni tanlang"
            error={!!errors.status}
          />
        </FormField>
      </div>
    </Modal>
  );
}
