import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left side — green gradient brand panel */}
      <div className="relative hidden flex-1 flex-col overflow-hidden p-12 text-white lg:flex"
        style={{ background: 'linear-gradient(135deg, #2DB976 0%, #1B7A4E 55%, #0F4229 100%)' }}
      >
        {/* Decorative floating circles */}
        <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-white/[0.06]" />
        <div className="absolute -right-10 bottom-16 h-52 w-52 rounded-full bg-white/[0.06]" />
        <div className="absolute right-[30%] top-[40%] h-36 w-36 rounded-full bg-white/[0.04]" />

        {/* Decorative SVG circles */}
        <svg
          viewBox="0 0 600 600"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        >
          <circle cx="120" cy="520" r="180" stroke="#fff" strokeWidth="1" fill="none" />
          <circle cx="120" cy="520" r="240" stroke="#fff" strokeWidth="1" fill="none" />
          <circle cx="500" cy="80" r="140" stroke="#fff" strokeWidth="1" fill="none" />
          <circle cx="500" cy="80" r="200" stroke="#fff" strokeWidth="1" fill="none" />
        </svg>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/[0.15] text-xs font-extrabold backdrop-blur-sm">
            UNI
          </div>
          <div className="text-[15px] font-semibold tracking-tight">ERP</div>
        </div>

        {/* Center content */}
        <div className="relative z-10 m-auto flex max-w-[520px] flex-col items-center text-center">
          {/* Emblem */}
          <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/[0.14] backdrop-blur-sm">
            <span className="text-3xl font-extrabold tracking-tight">Uni</span>
          </div>

          <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight">
            Uni ERP
          </h1>
          <p className="mt-2 text-lg font-medium opacity-90">
            Universitet boshqaruv tizimi
          </p>
          <p className="mt-4 text-[15px] leading-relaxed opacity-80">
            Yagona axborot tizimi: talabalar, o&apos;qituvchilar, moliya, TTJ va boshqalar
            &mdash; bitta platformada.
          </p>

          {/* Stats */}
          <div className="mt-12 grid w-full grid-cols-3 gap-5">
            {[
              { value: '3,247', label: 'Talaba' },
              { value: '186', label: "O'qituvchi" },
              { value: '8', label: 'Fakultet' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/[0.12] bg-white/[0.08] px-2.5 py-3.5"
              >
                <div className="text-[22px] font-bold tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-[11.5px] opacity-75">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs opacity-70">
          &copy; 2026 Uni ERP. Barcha huquqlar himoyalangan.
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <LoginForm />
      </div>
    </div>
  );
}
