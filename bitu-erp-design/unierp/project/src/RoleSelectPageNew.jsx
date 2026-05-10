// RoleSelectPageNew.jsx — demo role picker (5 roles per spec)

const RoleSelectPageNew = ({ onSelect, onLogout }) => {
  const auth = typeof useAuth === 'function' ? useAuth() : null;

  const handlePick = (role) => {
    const user = DEMO_USERS.find((u) => u.role === role);
    if (auth?.login) auth.login(user);
    onSelect?.(user);
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh', background: '#F8FAFB', display: 'flex', flexDirection: 'column',
                  fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ height: 64, padding: '0 32px', display: 'flex', alignItems: 'center',
                    borderBottom: '1px solid #F1F5F9', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#2DB976,#1B7A4E)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 13 }}>BIT</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>BITU ERP</div>
            <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Navoiy innovatsiyalar universiteti</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                       padding: '5px 11px', borderRadius: 999,
                       background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 600,
                       border: '1px solid #FDE68A' }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#F59E0B' }} />
          DEMO REJIM
        </span>
        <button onClick={onLogout} className="btn-press hover-bg"
          style={{ marginLeft: 12, padding: '7px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff',
                   color: '#475569', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                   display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="logout" size={13} /> Chiqish
        </button>
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 1080 }}>
          <div className="slide-up" style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em' }}>
              Demo rejim — rolni tanlang
            </h1>
            <p style={{ margin: '12px auto 0', fontSize: 14.5, color: '#64748B', maxWidth: 580, lineHeight: 1.55 }}>
              Har bir rolda boshqa modullar va ma'lumotlarga kirish mavjud. Tizimni ko'rish uchun rolni tanlang.
            </p>
          </div>

          <div style={{ display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 14 }}>
            {ROLES_LIST.map((roleKey, idx) => {
              const r = ROLES_DEF[roleKey];
              const u = DEMO_USERS.find((d) => d.role === roleKey);
              return (
                <button key={roleKey} onClick={() => handlePick(roleKey)}
                  className={`hover-lift slide-up stagger-${idx + 1}`}
                  style={{ position: 'relative', padding: '22px 18px', borderRadius: 14, cursor: 'pointer',
                           textAlign: 'left', fontFamily: 'inherit',
                           background: '#fff',
                           border: '1px solid #F1F5F9',
                           boxShadow: '0 1px 3px rgba(0,0,0,.05)',
                           display: 'flex', flexDirection: 'column', gap: 12,
                           minHeight: 220 }}>
                  {/* Icon */}
                  <div style={{ width: 48, height: 48, borderRadius: 12,
                                background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}CC 100%)`,
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 4px 14px ${r.color}40` }}>
                    <Icon name={r.icon} size={20} />
                  </div>

                  {/* Title */}
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 1.45 }}>
                      {r.desc}
                    </div>
                  </div>

                  {/* User preview */}
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #F1F5F9',
                                display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar initials={u.initials} size={28} color="primary" />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.name}
                      </div>
                      {u.facultyName && (
                        <div style={{ fontSize: 10.5, color: '#94A3B8',
                                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.facultyName}
                        </div>
                      )}
                    </div>
                    <Icon name="arrowRight" size={14} style={{ color: '#CBD5E1' }} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="fade-in stagger-7" style={{ textAlign: 'center', fontSize: 12.5, color: '#94A3B8', marginTop: 32 }}>
            Demo rejimda barcha rollarni sinab ko'rishingiz mumkin.
            Xodim panelidagi "Profil" tugmasi orqali rolni o'zgartiring.
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { RoleSelectPageNew });
