import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, Loader2, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import type { Resolver } from 'react-hook-form';
import {
  forgotPasswordSchema, type ForgotPasswordFormData,
  smsCodeSchema, type SmsCodeFormData,
  resetPasswordSchema, type ResetPasswordFormData,
} from '../schemas/auth.schema';
import { authService } from '@/api/services/auth.service';

type Step = 'phone' | 'code' | 'password' | 'done';

const SMS_COUNTDOWN = 60;

function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ['phone', 'code', 'password'];
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          {i > 0 && <div className="h-px w-8 bg-slate-200" />}
          <div
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              s === step ? 'bg-emerald-500 scale-125' : steps.indexOf(step) > i ? 'bg-emerald-300' : 'bg-slate-200'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(SMS_COUNTDOWN);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const phoneForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema) as unknown as Resolver<ForgotPasswordFormData>,
    defaultValues: { phone: '' },
  });

  const codeForm = useForm<SmsCodeFormData>({
    resolver: zodResolver(smsCodeSchema) as unknown as Resolver<SmsCodeFormData>,
    defaultValues: { code: '' },
  });

  const passwordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema) as unknown as Resolver<ResetPasswordFormData>,
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onPhoneSubmit = async (data: ForgotPasswordFormData) => {
    await authService.forgotPassword(data.phone);
    setPhone(data.phone);
    startCountdown();
    setStep('code');
  };

  const onCodeSubmit = async (_data: SmsCodeFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setStep('password');
  };

  const onPasswordSubmit = async (_data: ResetPasswordFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setStep('done');
    setTimeout(() => navigate('/login'), 2000);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await authService.forgotPassword(phone);
    startCountdown();
    codeForm.reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/80 p-6 font-sans">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, #2DB976, #1B7A4E)' }}
          >
            U
          </div>
          <div className="text-sm font-bold tracking-tight text-slate-900">Uni ERP</div>
        </div>

        {step !== 'done' && step !== 'phone' && <StepDots step={step} />}

        {/* Step 1: Phone */}
        {step === 'phone' && (
          <>
            <h2 className="text-xl font-bold text-slate-900">Parolni tiklash</h2>
            <p className="mt-2 text-sm text-slate-500">
              Telefon raqamingizni kiriting. SMS orqali tiklash kodi yuboriladi.
            </p>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="mt-6 flex flex-col gap-4">
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
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${phoneForm.formState.errors.phone ? 'border-red-300' : 'border-slate-200'}`}
                    {...phoneForm.register('phone')}
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="text-xs text-red-500">{phoneForm.formState.errors.phone.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={phoneForm.formState.isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:pointer-events-none"
              >
                {phoneForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SMS yuborish'}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700">
                <ArrowLeft className="h-4 w-4" /> Kirish sahifasiga qaytish
              </Link>
            </form>
          </>
        )}

        {/* Step 2: SMS Code */}
        {step === 'code' && (
          <>
            <h2 className="text-xl font-bold text-slate-900">SMS kodni kiriting</h2>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{phone}</span> raqamiga yuborilgan 6 ta raqamli kodni kiriting.
            </p>
            <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">SMS kod</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  autoFocus
                  className={`h-12 w-full rounded-lg border bg-white px-4 text-center text-xl font-bold tracking-[0.5em] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${codeForm.formState.errors.code ? 'border-red-300' : 'border-slate-200'}`}
                  {...codeForm.register('code')}
                />
                {codeForm.formState.errors.code && (
                  <p className="text-xs text-red-500">{codeForm.formState.errors.code.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={codeForm.formState.isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:pointer-events-none"
              >
                {codeForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tasdiqlash'}
              </button>
              <div className="text-center text-sm text-slate-500">
                {countdown > 0 ? (
                  <span>Qayta yuborish: <strong className="text-emerald-600">{countdown}s</strong></span>
                ) : (
                  <button type="button" onClick={handleResend} className="font-medium text-emerald-600 hover:text-emerald-700">
                    Kodni qayta yuborish
                  </button>
                )}
              </div>
              <button type="button" onClick={() => setStep('phone')} className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700">
                <ArrowLeft className="h-4 w-4" /> Raqamni o&apos;zgartirish
              </button>
            </form>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <>
            <h2 className="text-xl font-bold text-slate-900">Yangi parol o&apos;rnatish</h2>
            <p className="mt-2 text-sm text-slate-500">Yangi parolni kiriting. Kamida 6 ta belgi bo&apos;lishi kerak.</p>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Yangi parol</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${passwordForm.formState.errors.password ? 'border-red-300' : 'border-slate-200'}`}
                    {...passwordForm.register('password')}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="text-xs text-red-500">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Parolni tasdiqlang</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${passwordForm.formState.errors.confirmPassword ? 'border-red-300' : 'border-slate-200'}`}
                    {...passwordForm.register('confirmPassword')}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:pointer-events-none"
              >
                {passwordForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Parolni saqlash'}
              </button>
            </form>
          </>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Parol yangilandi!</h2>
            <p className="mt-2 text-sm text-slate-500">
              Parolingiz muvaffaqiyatli yangilandi. Kirish sahifasiga yo&apos;naltirilmoqda...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
