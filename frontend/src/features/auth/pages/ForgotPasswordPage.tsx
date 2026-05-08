import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Phone, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/auth.schema';
import { authService } from '@/api/services/auth.service';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await authService.forgotPassword(data.phone);
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/80 p-6 font-sans">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, #2DB976, #1B7A4E)' }}
          >
            U
          </div>
          <div className="text-sm font-bold tracking-tight text-slate-900">Uni ERP</div>
        </div>

        {sent ? (
          /* Success state */
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">SMS yuborildi</h2>
            <p className="mt-2 text-sm text-slate-500">
              Telefon raqamingizga parolni tiklash uchun SMS kod yuborildi.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kirish sahifasiga qaytish
            </Link>
          </div>
        ) : (
          /* Form state */
          <>
            <h2 className="text-xl font-bold text-slate-900">Parolni tiklash</h2>
            <p className="mt-2 text-sm text-slate-500">
              Telefon raqamingizni kiriting. SMS orqali tiklash kodi yuboriladi.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="forgot-phone" className="text-sm font-medium text-slate-700">
                  Telefon raqami
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="forgot-phone"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl
                  bg-emerald-500 text-sm font-semibold text-white transition-colors
                  hover:bg-emerald-600 active:bg-emerald-700
                  disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'SMS yuborish'
                )}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Kirish sahifasiga qaytish
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
