import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Moon, Sun, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { useAppStore } from '@/stores/app.store';
import { useTranslation } from 'react-i18next';
import { useChangePassword } from '@/api/hooks/useProfile';
import { changePasswordSchema, type ChangePasswordFormData } from '../schemas/settings.schema';
import type { Resolver } from 'react-hook-form';

export function SettingsPage() {
  const { i18n } = useTranslation();
  const { lang, setLang, theme, setTheme } = useAppStore();

  const LANGUAGES = [
    { code: 'uz' as const, label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const handleLangChange = (code: 'uz' | 'ru' | 'en') => {
    setLang(code);
    void i18n.changeLanguage(code);
  };

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title="Sozlamalar"
        breadcrumbs={[{ label: 'Sozlamalar' }]}
      />

      <div className="max-w-2xl space-y-4">
        {/* Language */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Til</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLangChange(l.code)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    lang === l.code
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-border text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Theme */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Mavzu</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'light' as const, label: 'Yorug\'', icon: Sun },
                { key: 'dark' as const, label: 'Qorong\'i', icon: Moon },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    theme === t.key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-border text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Bildirishnomalar</h3>
            </div>
            <div className="space-y-3">
              <SettingRow
                label="Email bildirishnomalar"
                description="Muhim o'zgarishlar haqida email orqali xabardor bo'ling"
                initialChecked
              />
              <SettingRow
                label="To'lov eslatmalari"
                description="Kontrakt to'lov muddatlari yaqinlashganda eslatma"
                initialChecked
              />
              <SettingRow
                label="Tizim yangilanishlari"
                description="Yangi funksiyalar va o'zgarishlar haqida"
              />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Xavfsizlik</h3>
            </div>
            <ChangePasswordForm />
            <div className="border-t border-border mt-4 pt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">Ikki bosqichli autentifikatsiya</p>
                  <p className="text-xs text-muted">Qo&apos;shimcha xavfsizlik uchun 2FA yoqing</p>
                </div>
                <Button variant="secondary" size="sm">Yoqish</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageContent>
  );
}

function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema) as unknown as Resolver<ChangePasswordFormData>,
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          reset();
          setExpanded(false);
          setSuccessMsg('Parol muvaffaqiyatli o\'zgartirildi');
          setTimeout(() => setSuccessMsg(''), 3000);
        },
      },
    );
  };

  if (!expanded) {
    return (
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-slate-900">Parolni o&apos;zgartirish</p>
          <p className="text-xs text-muted">
            {successMsg ? (
              <span className="text-emerald-600">{successMsg}</span>
            ) : (
              "Oxirgi o'zgartirilgan: 30 kun oldin"
            )}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setExpanded(true)}>
          O&apos;zgartirish
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <p className="text-sm font-medium text-slate-900 mb-2">Parolni o&apos;zgartirish</p>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Joriy parol</label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            {...register('currentPassword')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Yangi parol</label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            {...register('newPassword')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none pr-10"
            placeholder="Kamida 8 ta belgi"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Parolni tasdiqlash</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none pr-10"
            placeholder="Yangi parolni takrorlang"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" variant="primary" loading={changePassword.isPending}>
          Saqlash
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => { setExpanded(false); reset(); }}
        >
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}

function SettingRow({
  label,
  description,
  initialChecked = false,
}: {
  label: string;
  description: string;
  initialChecked?: boolean;
}) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <Toggle checked={checked} onChange={setChecked} />
    </div>
  );
}
