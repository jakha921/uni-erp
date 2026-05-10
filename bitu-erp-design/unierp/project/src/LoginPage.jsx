// LoginPage.jsx — two variants

const LoginPage = ({ variant = 'split', onEnter }) => {
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [branch, setBranch] = React.useState('navoiy');
  const [loading, setLoading] = React.useState(false);

  const handleEnter = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onEnter?.(); }, 600);
  };

  if (variant === 'centered') return <LoginCentered {...{ phone, setPhone, password, setPassword, showPwd, setShowPwd, remember, setRemember, branch, setBranch, onEnter: handleEnter, loading }} />;
  return <LoginSplit {...{ phone, setPhone, password, setPassword, showPwd, setShowPwd, remember, setRemember, branch, setBranch, onEnter: handleEnter, loading }} />;
};

const LoginSplit = ({ phone, setPhone, password, setPassword, showPwd, setShowPwd, remember, setRemember, branch, setBranch, onEnter, loading }) =>
<div className="login-split" style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: "'Inter',system-ui,sans-serif" }}>
    {/* Left */}
    <div className="login-left" style={{ flex: 1, background: 'linear-gradient(135deg,#2DB976 0%, #1B7A4E 55%, #0F4229 100%)',
    color: '#fff', padding: '48px', display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden' }}>
      {/* Floating circles */}
      <div className="float-circle" style={{ width: 300, height: 300, background: '#fff', top: -80, left: -60 }} />
      <div className="float-circle" style={{ width: 200, height: 200, background: '#fff', bottom: 60, right: -40 }} />
      <div className="float-circle" style={{ width: 150, height: 150, background: '#fff', top: '40%', right: '30%' }} />

      {/* decorative circles */}
      <svg viewBox="0 0 600 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
        <circle cx="120" cy="520" r="180" stroke="#fff" strokeWidth="1" fill="none" />
        <circle cx="120" cy="520" r="240" stroke="#fff" strokeWidth="1" fill="none" />
        <circle cx="500" cy="80" r="140" stroke="#fff" strokeWidth="1" fill="none" />
        <circle cx="500" cy="80" r="200" stroke="#fff" strokeWidth="1" fill="none" />
      </svg>

      <div className="fade-in" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.15)',
        backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 12 }}>NIU</div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>ERP</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 auto' }}>
        {/* university emblem */}
        <div className="scale-in" style={{ width: 112, height: 112, borderRadius: 28, background: 'rgba(255,255,255,.14)',
        backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, overflow: 'hidden' }}>
          <img src="assets/niu-logo-white.png" alt="NIU"
            style={{ width: 96, height: 96, objectFit: 'contain' }} />
        </div>
        <h1 className="slide-up" style={{ margin: 0, fontSize: 40, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#fff' }}>
          Raqamli universitet platformasi
        </h1>
        <div className="slide-up stagger-2" style={{ marginTop: 18, fontSize: 15, opacity: 0.82, lineHeight: 1.55 }}>
          Navoiy innovatsiyalar universiteti —<br />
          yagona axborot tizimi: talabalar, o'qituvchilar, moliya, TTJ.
        </div>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, width: '100%' }}>
          {[
        { v: '3,247', l: 'Talaba' },
        { v: '186', l: 'O\'qituvchi' },
        { v: '8', l: 'Fakultet' }].
        map((s, i) =>
        <div key={i} className={`slide-up stagger-${i + 3}`} style={{ padding: '14px 10px', borderRadius: 12, background: 'rgba(255,255,255,.08)',
          border: '1px solid rgba(255,255,255,.12)' }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
              <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 2 }}>{s.l}</div>
            </div>
        )}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, fontSize: 12, opacity: 0.7 }}>
        © 2026 NIU ERP. Barcha huquqlar himoyalangan.
      </div>
    </div>

    {/* Right form */}
    <div className="fade-in" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#0F172A' }}>Tizimga kirish</h2>
          <div style={{ marginTop: 8, fontSize: 14, color: '#64748B' }}>Telefon raqamingiz va parolingizni kiriting</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Telefon raqami" leftIcon="phone" placeholder="+998 (__) ___-__-__"
        value={phone} onChange={(e) => setPhone(e.target.value)} />

          <div>
            <Input label="Parol" type={showPwd ? 'text' : 'password'} placeholder="•••••���••"
          value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox checked={remember} onChange={setRemember} label="Eslab qolish" />
              <a href="#forgot" style={{ fontSize: 13, color: '#2DB976', fontWeight: 500, textDecoration: 'none' }}>Parolni unutdingizmi?</a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>Filial</label>
            <select value={branch} onChange={(e) => setBranch(e.target.value)}
          style={{ height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8,
            fontSize: 14, background: '#fff', fontFamily: 'inherit', color: '#1E293B' }}>
              <option value="navoiy">Navoiy (bosh filial)</option>
              <option value="zarafshon">Zarafshon filiali</option>
              <option value="uchquduq">Uchquduq filiali</option>
            </select>
          </div>

          <Button variant="primary" size="lg" loading={loading} onClick={onEnter}
            style={{ marginTop: 8, height: 46, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 600 }}>
            Kirish <Icon name="arrowRight" size={16} />
          </Button>

          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 13, color: '#64748B' }}>
            Akkauntingiz yo'qmi?{' '}
            <a href="#" style={{ color: '#2DB976', fontWeight: 500, textDecoration: 'none' }}>Ro'yxatdan o'tish</a>
          </div>
        </div>
      </div>
    </div>
  </div>;


const LoginCentered = ({ phone, setPhone, password, setPassword, showPwd, setShowPwd, remember, setRemember, branch, setBranch, onEnter, loading }) =>
<div style={{ minHeight: '100vh', background: '#F8FAFB',
  backgroundImage: 'radial-gradient(circle at 20% 0%, #ECFDF5 0, transparent 40%), radial-gradient(circle at 100% 100%, #D1FAE5 0, transparent 45%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  fontFamily: "'Inter',system-ui,sans-serif" }}>
    <div className="scale-in" style={{ width: '100%', maxWidth: 920, display: 'grid', gridTemplateColumns: '1.1fr 1fr',
    background: '#fff', borderRadius: 20, overflow: 'hidden',
    boxShadow: '0 20px 50px -12px rgba(15,66,41,.25), 0 8px 20px -8px rgba(0,0,0,.08)' }}>
      <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#2DB976,#1B7A4E)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 11 }}>NIU</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>ERP</div>
            <div style={{ fontSize: 10.5, color: '#64748B' }}>Raqamli universitet</div>
          </div>
        </div>

        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#0F172A' }}>Xush kelibsiz</h2>
        <div style={{ marginTop: 6, fontSize: 14, color: '#64748B', marginBottom: 28 }}>Akkauntingizga kiring</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Telefon raqami" leftIcon="phone" placeholder="+998 (__) ___-__-__"
        value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Parol" type="password" placeholder="••••••••"
        value={password} onChange={(e) => setPassword(e.target.value)} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Checkbox checked={remember} onChange={setRemember} label="Eslab qolish" />
            <a href="#forgot" style={{ fontSize: 13, color: '#2DB976', fontWeight: 500, textDecoration: 'none' }}>Parolni unutdingizmi?</a>
          </div>

          <Button variant="primary" size="md" loading={loading} onClick={onEnter}
            style={{ marginTop: 8, height: 44, borderRadius: 10, width: '100%', fontSize: 14, fontWeight: 600 }}>
            Kirish
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: 11, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>yoki</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          <button className="btn-press hover-bg" style={{ height: 42, borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#334155' }}>
            <Icon name="doc" size={16} /> OneID orqali kirish
          </button>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(150deg,#1B7A4E 0%, #0F4229 100%)', color: '#fff',
      padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 400 400" style={{ position: 'absolute', right: -80, top: -80, width: 400, height: 400, opacity: 0.15 }}>
          <path d="M200 20 L380 120 L380 280 L200 380 L20 280 L20 120 Z" stroke="#fff" strokeWidth="1" fill="none" />
          <path d="M200 60 L340 140 L340 260 L200 340 L60 260 L60 140 Z" stroke="#fff" strokeWidth="1" fill="none" />
          <path d="M200 100 L300 160 L300 240 L200 300 L100 240 L100 160 Z" stroke="#fff" strokeWidth="1" fill="none" />
        </svg>

        <div style={{ position: 'relative' }}>
          <div className="fade-in" style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 999,
          background: 'rgba(255,255,255,.15)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>
            NAVOIY · 2026
          </div>
          <div className="slide-up stagger-1" style={{ marginTop: 20, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Navoiy innovatsiyalar universiteti
          </div>
          <div className="slide-up stagger-2" style={{ marginTop: 12, fontSize: 13, opacity: 0.78, lineHeight: 1.55 }}>
            Yagona platforma — talabalar, moliya, dars jadvali va TTJ boshqaruvi bitta tizimda.
          </div>
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{ v: '3.2k', l: 'Talaba' }, { v: '186', l: 'O\'qituvchi' }, { v: '8', l: 'Fakultet' }, { v: '24', l: 'Kafedra' }].map((s, i) =>
        <div key={i} className={`slide-up stagger-${i + 3}`} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,.08)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>{s.v}</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{s.l}</div>
            </div>
        )}
        </div>
      </div>
    </div>
  </div>;


Object.assign(window, { LoginPage });
