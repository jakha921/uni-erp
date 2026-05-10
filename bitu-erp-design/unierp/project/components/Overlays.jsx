// Overlays.jsx — Modal, SlideOver, Toast, Skeleton, EmptyState + polish

const Modal = ({ open, onClose, title, children, footer, width = 560 }) => {
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} className="backdrop-blur" style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="scale-in" style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: width,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,.2)',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #F1F5F9',
                      display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0F172A', flex: 1 }}>{title}</h3>
          <IconButton icon="x" label="Yopish" onClick={onClose} size={32} />
        </div>
        <div style={{ padding: 22, overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: '14px 22px', borderTop: '1px solid #F1F5F9',
                                  display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
};

const SlideOver = ({ open, onClose, title, subtitle, children, width = 520, actions }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div onClick={onClose} className="backdrop-blur" style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,.4)' }} />
      <div className="slide-in-right slide-over-panel" style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width,
        background: '#fff', boxShadow: '-10px 0 30px rgba(0,0,0,.12)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#0F172A' }}>{title}</h3>
              {subtitle && <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 3 }}>{subtitle}</div>}
            </div>
            <IconButton icon="x" label="Yopish" onClick={onClose} size={32} />
          </div>
        </div>
        <div style={{ padding: 22, overflowY: 'auto', flex: 1 }}>{children}</div>
        {actions && <div style={{ padding: '14px 22px', borderTop: '1px solid #F1F5F9',
                                    display: 'flex', gap: 10, justifyContent: 'flex-end' }}>{actions}</div>}
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    window.showToast = (msg, variant = 'success') => {
      const id = Date.now() + Math.random();
      setToasts(t => [...t, { id, msg, variant, exiting: false }]);
      setTimeout(() => {
        setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x));
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 250);
      }, 2900);
    };
  }, []);
  const colors = {
    success: { bg: '#ECFDF5', border: '#2DB976', fg: '#1B7A4E', icon: 'check' },
    error: { bg: '#FEF2F2', border: '#EF4444', fg: '#B91C1C', icon: 'x' },
    info: { bg: '#EFF6FF', border: '#3B82F6', fg: '#1D4ED8', icon: 'bell' },
  };
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => {
        const c = colors[t.variant] || colors.success;
        return (
          <div key={t.id} style={{
            background: '#fff', border: `1px solid ${c.border}`, borderLeft: `4px solid ${c.border}`,
            padding: '12px 16px', borderRadius: 10, minWidth: 280, maxWidth: 400,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,.12)',
            animation: t.exiting ? 'slideOutRight 250ms ease forwards' : 'slideInRight 250ms ease',
          }}>
            <div style={{ width: 24, height: 24, borderRadius: 999, background: c.bg, color: c.fg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={c.icon} size={14} stroke={3} />
            </div>
            <div style={{ fontSize: 13, color: '#0F172A', flex: 1 }}>{t.msg}</div>
          </div>
        );
      })}
    </div>
  );
};

const Skeleton = ({ w = '100%', h = 16, radius = 6, style, className = '' }) => (
  <div className={`skeleton ${className}`} style={{ width: w, height: h, borderRadius: radius, ...style }} />
);

const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div style={{ padding: 16 }}>
    <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ flex: i === 0 ? 2 : 1, height: 12 }} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton skeleton-row" style={{ animationDelay: `${i * 60}ms` }} />
    ))}
  </div>
);

const SkeletonCard = ({ height = 120 }) => (
  <div className="skeleton skeleton-card" style={{ height }} />
);

const SkeletonChart = ({ height = 200 }) => (
  <div className="skeleton skeleton-chart" style={{ height }} />
);

// SVG illustrations for empty states
const EMPTY_ILLUSTRATIONS = {
  search: (color) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="52" cy="52" r="30" stroke={color} strokeWidth="3" strokeDasharray="6 4" opacity="0.3" />
      <circle cx="52" cy="52" r="18" fill={color} opacity="0.08" />
      <line x1="73" y1="73" x2="95" y2="95" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      <circle cx="52" cy="47" r="3" fill={color} opacity="0.3" />
      <path d="M44 58 a8 8 0 0 1 16 0" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  inbox: (color) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="25" y="35" width="70" height="55" rx="8" stroke={color} strokeWidth="2.5" opacity="0.25" />
      <path d="M25 65 L45 55 L60 65 L75 55 L95 65" stroke={color} strokeWidth="2" opacity="0.2" />
      <rect x="42" y="22" width="36" height="8" rx="4" fill={color} opacity="0.1" />
      <circle cx="60" cy="75" r="8" fill={color} opacity="0.08" />
      <line x1="55" y1="75" x2="65" y2="75" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
    </svg>
  ),
  table: (color) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="20" y="30" width="80" height="60" rx="8" stroke={color} strokeWidth="2" opacity="0.2" />
      <line x1="20" y1="48" x2="100" y2="48" stroke={color} strokeWidth="1.5" opacity="0.15" />
      <line x1="20" y1="62" x2="100" y2="62" stroke={color} strokeWidth="1" opacity="0.1" strokeDasharray="3 3" />
      <line x1="20" y1="76" x2="100" y2="76" stroke={color} strokeWidth="1" opacity="0.1" strokeDasharray="3 3" />
      <rect x="28" y="36" width="24" height="6" rx="3" fill={color} opacity="0.15" />
      <rect x="60" y="36" width="16" height="6" rx="3" fill={color} opacity="0.1" />
      <rect x="84" y="36" width="10" height="6" rx="3" fill={color} opacity="0.1" />
      <rect x="28" y="53" width="30" height="4" rx="2" fill={color} opacity="0.08" />
      <rect x="28" y="67" width="22" height="4" rx="2" fill={color} opacity="0.06" />
      <rect x="28" y="81" width="28" height="4" rx="2" fill={color} opacity="0.06" />
    </svg>
  ),
  chart: (color) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="22" y="80" width="14" height="20" rx="4" fill={color} opacity="0.1" />
      <rect x="42" y="55" width="14" height="45" rx="4" fill={color} opacity="0.15" />
      <rect x="62" y="40" width="14" height="60" rx="4" fill={color} opacity="0.12" />
      <rect x="82" y="65" width="14" height="35" rx="4" fill={color} opacity="0.08" />
      <line x1="18" y1="100" x2="102" y2="100" stroke={color} strokeWidth="2" opacity="0.15" />
      <circle cx="68" cy="30" r="10" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.2" />
      <text x="65" y="34" fill={color} opacity="0.25" fontSize="12" fontWeight="600">?</text>
    </svg>
  ),
  students: (color) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="42" cy="46" r="12" fill={color} opacity="0.1" />
      <circle cx="42" cy="42" r="7" stroke={color} strokeWidth="2" opacity="0.2" />
      <path d="M28 70 Q28 58 42 58 Q56 58 56 70" stroke={color} strokeWidth="2" opacity="0.15" />
      <circle cx="72" cy="46" r="12" fill={color} opacity="0.08" />
      <circle cx="72" cy="42" r="7" stroke={color} strokeWidth="2" opacity="0.15" />
      <path d="M58 70 Q58 58 72 58 Q86 58 86 70" stroke={color} strokeWidth="2" opacity="0.1" />
      <rect x="35" y="78" width="50" height="6" rx="3" fill={color} opacity="0.08" />
      <rect x="42" y="88" width="36" height="4" rx="2" fill={color} opacity="0.05" />
    </svg>
  ),
  error: (color) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path d="M60 25 L98 90 H22 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" opacity="0.2" fill={color} fillOpacity="0.04" />
      <line x1="60" y1="50" x2="60" y2="68" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <circle cx="60" cy="78" r="2.5" fill={color} opacity="0.3" />
    </svg>
  ),
};

const EmptyState = ({ icon = 'inbox', illustration, title, hint, action }) => {
  const ilColor = '#94A3B8';
  const renderIllustration = illustration && EMPTY_ILLUSTRATIONS[illustration];

  return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
      {renderIllustration ? (
        <div style={{ marginBottom: 18 }}>{renderIllustration(ilColor)}</div>
      ) : (
        <div style={{ width: 64, height: 64, borderRadius: 999, background: '#F1F5F9', color: '#94A3B8',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon name={icon} size={28} />
        </div>
      )}
      <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{title}</div>
      {hint && <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, maxWidth: 320, margin: '4px auto 0' }}>{hint}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
};

Object.assign(window, {
  Modal, SlideOver, ToastContainer, Skeleton,
  SkeletonTable, SkeletonCard, SkeletonChart,
  EmptyState, EMPTY_ILLUSTRATIONS,
});
