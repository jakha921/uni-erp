import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { BranchSelector } from './BranchSelector';
import { authService } from '@/api/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
      branch: 'navoiy',
      remember: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const response = await authService.login({
        phone: data.phone,
        password: data.password,
        branch: data.branch,
      });
      login(response.user, response.token, response.refresh);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setServerError(message);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8">
        <h2 className="text-[28px] font-bold tracking-tight text-slate-900">
          {t('auth.login')}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t('auth.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            {t('auth.phone')}
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="phone"
              type="tel"
              placeholder="+998 (__) ___-__-__"
              autoComplete="tel"
              className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm transition-colors
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                ${errors.phone ? 'border-red-300' : 'border-slate-200'}`}
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            {t('auth.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`h-11 w-full rounded-lg border bg-white px-3 pr-10 text-sm transition-colors
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                ${errors.password ? 'border-red-300' : 'border-slate-200'}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20"
              {...register('remember')}
            />
            <span className="text-sm text-slate-700">{t('auth.remember')}</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-[13px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {t('auth.forgot')}
          </Link>
        </div>

        {/* Branch */}
        <BranchSelector label={t('auth.selectBranch')} {...register('branch')} />

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-[46px] w-full items-center justify-center gap-2 rounded-xl
            bg-emerald-500 text-[15px] font-semibold text-white transition-colors
            hover:bg-emerald-600 active:bg-emerald-700
            disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t('auth.loginBtn')}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Demo link */}
        <div className="mt-2 text-center text-[13px] text-slate-500">
          {t('auth.demoTry')}{' '}
          <Link
            to="/role-select"
            className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {t('auth.selectRoleLink')}
          </Link>
        </div>
      </form>
    </div>
  );
}
