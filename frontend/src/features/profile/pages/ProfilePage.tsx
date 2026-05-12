import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, Camera } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/overlays';
import { FileUpload } from '@/components/form/FileUpload';
import { useAuthStore } from '@/stores/auth.store';
import { formatDate } from '@/lib/utils';
import { useUpdateProfile } from '@/api/hooks/useProfile';
import { profileSchema, type ProfileFormData } from '../schemas/settings.schema';
import type { Resolver } from 'react-hook-form';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  buxgalter: 'Buxgalter',
  dekan: 'Dekan',
  oqituvchi: "Professor-o'qituvchi",
  talaba: 'Talaba',
};

export function ProfilePage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((s) => s.currentUser);
  const patchCurrentUser = useAuthStore((s) => s.patchCurrentUser);
  const [editOpen, setEditOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const updateProfile = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as unknown as Resolver<ProfileFormData>,
  });

  const handleEdit = () => {
    if (currentUser) {
      reset({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone });
    }
    setEditOpen(true);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: (updated) => {
        patchCurrentUser({ name: updated.name, email: updated.email, phone: updated.phone });
        setEditOpen(false);
      },
    });
  };

  if (!currentUser) return null;

  const roleLabel = ROLE_LABELS[currentUser.role] ?? currentUser.role;

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title={t('profile.title')}
        breadcrumbs={[{ label: t('nav.profile') }]}
        actions={
          <Button leftIcon={<Pencil className="h-4 w-4" />} variant="secondary" onClick={handleEdit}>
            {t('profile.editProfile')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main profile card */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-start gap-5">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
                  {photoPreview ? (
                    <img src={photoPreview} alt="avatar" className="h-full w-full object-cover" />
                  ) : currentUser.initials}
                </div>
                <button
                  onClick={() => setPhotoUploadOpen(true)}
                  className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                  title={t('profile.uploadPhoto')}
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info">{roleLabel}</Badge>
                  {currentUser.facultyName && (
                    <span className="text-sm text-muted">{currentUser.facultyName}</span>
                  )}
                </div>
                {currentUser.position && (
                  <p className="text-sm text-muted mt-1">{currentUser.position}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={currentUser.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefon" value={currentUser.phone} />
              {currentUser.facultyName && (
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Fakultet" value={currentUser.facultyName} />
              )}
              {currentUser.departmentName && (
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Bo'lim" value={currentUser.departmentName} />
              )}
              {currentUser.degree && (
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Ilmiy daraja" value={currentUser.degree} />
              )}
              {currentUser.rank && (
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Ilmiy unvon" value={currentUser.rank} />
              )}
              {currentUser.groupName && (
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Guruh" value={currentUser.groupName} />
              )}
              {currentUser.level && (
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Kurs" value={currentUser.level} />
              )}
            </div>
          </div>
        </Card>

        {/* Quick info */}
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('profile.systemInfo')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">ID</span>
                  <span className="font-mono text-slate-700">{currentUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('profile.roleLabel')}</span>
                  <span className="text-slate-700">{roleLabel}</span>
                </div>
                {currentUser.employeeId && (
                  <div className="flex justify-between">
                    <span className="text-muted">{t('profile.employeeIdLabel')}</span>
                    <span className="font-mono text-slate-700">{currentUser.employeeId}</span>
                  </div>
                )}
                {currentUser.studentId && (
                  <div className="flex justify-between">
                    <span className="text-muted">{t('profile.studentIdLabel')}</span>
                    <span className="font-mono text-slate-700">{currentUser.studentId}</span>
                  </div>
                )}
                {currentUser.studentIdNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted">{t('profile.idNumberLabel')}</span>
                    <span className="font-mono text-slate-700">{currentUser.studentIdNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('profile.security')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted">{t('profile.passwordLabel')}</span>
                  <Button variant="ghost" size="sm">{t('profile.changePassword')}</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">{t('profile.lastLoginLabel')}</span>
                  <span className="text-slate-700">{formatDate(new Date().toISOString())}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t('profile.editProfileTitle')}
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={updateProfile.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {t('common.save')}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('profile.fullNameLabel')}</label>
            <input
              {...register('name')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none"
              placeholder={t('profile.fullNamePlaceholder')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none"
              placeholder="email@niuedu.uz"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Telefon</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none"
              placeholder="+998 90 000-00-00"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
        </form>
      </Modal>

      <Modal open={photoUploadOpen} onClose={() => setPhotoUploadOpen(false)} title={t('profile.uploadPhoto')}>
        <FileUpload
          accept="image/jpeg,image/png,image/webp"
          maxSize={5 * 1024 * 1024}
          onUpload={(files) => {
            const file = files[0];
            if (file) {
              setPhotoPreview(URL.createObjectURL(file));
              setPhotoUploadOpen(false);
            }
          }}
          preview={false}
        />
        <p className="mt-2 text-xs text-slate-400 text-center">{t('profile.photoHint')}</p>
      </Modal>
    </PageContent>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted">{icon}</div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm text-slate-900">{value}</p>
      </div>
    </div>
  );
}
