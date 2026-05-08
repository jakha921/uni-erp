import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RoleCard } from '../components/RoleCard';
import { authService } from '@/api/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { ROLES_DEF, ROLES_LIST } from '@/config/roles';
import type { RoleKey } from '@/types/auth';

export function RoleSelectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loadingRole, setLoadingRole] = useState<RoleKey | null>(null);

  const demoUsers = authService.getDemoUsers();

  const handlePick = async (roleKey: RoleKey) => {
    setLoadingRole(roleKey);
    try {
      const user = demoUsers.find((u) => u.role === roleKey);
      if (!user) return;
      const response = await authService.login({ phone: user.phone, password: 'demo' });
      login(response.user, response.token, response.refresh);
      navigate('/dashboard', { replace: true });
    } catch {
      // Ignore errors in demo mode
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/80 font-sans">
      {/* Top bar */}
      <div className="flex h-16 items-center border-b border-slate-100 bg-white px-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, #2DB976, #1B7A4E)' }}
          >
            U
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900">Uni ERP</div>
            <div className="text-[10.5px] text-slate-400">
              Universitet boshqaruv tizimi
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Demo badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11.5px] font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          DEMO REJIM
        </span>

        {/* Back to login */}
        <Link
          to="/login"
          className="ml-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t('auth.logout')}
        </Link>
      </div>

      {/* Center content */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[1080px]">
          <div className="mb-8 text-center">
            <h1 className="text-[30px] font-bold tracking-tight text-slate-900">
              Demo rejim &mdash; rolni tanlang
            </h1>
            <p className="mx-auto mt-3 max-w-[580px] text-[14.5px] leading-relaxed text-slate-500">
              Har bir rolda boshqa modullar va ma&apos;lumotlarga kirish mavjud.
              Tizimni ko&apos;rish uchun rolni tanlang.
            </p>
          </div>

          {/* Role cards grid */}
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {ROLES_LIST.map((roleKey) => {
              const roleDef = ROLES_DEF[roleKey];
              const user = demoUsers.find((u) => u.role === roleKey);
              if (!user) return null;

              return (
                <div key={roleKey} className="relative">
                  {loadingRole === roleKey && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                    </div>
                  )}
                  <RoleCard
                    roleDef={roleDef}
                    roleKey={roleKey}
                    demoUser={user}
                    onClick={() => handlePick(roleKey)}
                  />
                </div>
              );
            })}
          </div>

          {/* Footer hint */}
          <p className="mt-8 text-center text-[12.5px] text-slate-400">
            Demo rejimda barcha rollarni sinab ko&apos;rishingiz mumkin.
            Xodim panelidagi &laquo;Profil&raquo; tugmasi orqali rolni o&apos;zgartiring.
          </p>
        </div>
      </div>
    </div>
  );
}
