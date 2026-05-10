// Primitives.jsx — atomic UI components for TeamHub

const Icon = ({ name, size = 18, stroke = 2, className = '', style }) => {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    className, style,
  };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
    more: <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
    chevron: <polyline points="9 18 15 12 9 6"/>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    trendUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    trendDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    help: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
    crown: <path d="M2 18h20l-3-9-4 5-3-7-3 7-4-5-3 9z"/>,
    wallet: <><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="17" cy="15" r="1.5" fill="currentColor"/></>,
    archive: <><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></>,
    warehouse: <><path d="M22 8.35V20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8.35a1 1 0 0 1 .59-.91l9-3.6a1 1 0 0 1 .82 0l9 3.6a1 1 0 0 1 .59.91Z"/><path d="M6 18h12"/><path d="M6 14h12"/><path d="M6 10h12"/></>,
    money: <><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></>,
    graduation: <><path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 3.13 3 6 3s6-1.34 6-3v-5"/></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></>,
    truck: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    clipboard: <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    warning: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    barcode: <><rect x="3" y="5" width="2" height="14"/><rect x="7" y="5" width="1" height="14"/><rect x="10" y="5" width="2" height="14"/><rect x="14" y="5" width="1" height="14"/><rect x="17" y="5" width="2" height="14"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    scale: <><path d="M12 3v18"/><path d="M3 7h18"/><path d="M3 7l3 7a3 3 0 0 0 6 0l3-7"/><path d="M21 7l-3 7"/></>,
    megaphone: <><path d="M3 11l18-8v18l-18-8z"/><path d="M3 11v6"/><path d="M11 6.5v11"/></>,
    menu: <><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></>,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

const Button = ({ variant = 'primary', size = 'md', children, icon, onClick, disabled, loading, style }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'inherit', fontWeight: 500, borderRadius: 8, border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { height: 32, padding: '0 12px', fontSize: 13 },
    md: { height: 40, padding: '0 16px', fontSize: 14 },
    lg: { height: 48, padding: '0 24px', fontSize: 16 },
  };
  const variants = {
    primary:   { background: '#2DB976', color: '#fff' },
    secondary: { background: 'transparent', color: '#334155', border: '1px solid #E2E8F0' },
    ghost:     { background: 'transparent', color: '#475569' },
    danger:    { background: '#EF4444', color: '#fff' },
  };
  const cls = `btn-press ${variant === 'ghost' || variant === 'secondary' ? 'hover-bg' : ''}`;
  return (
    <button
      onClick={onClick} disabled={disabled || loading}
      className={cls}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {loading ? (
        <span className="spinner" style={{ width: size === 'sm' ? 14 : 16, height: size === 'sm' ? 14 : 16 }} />
      ) : icon ? (
        <Icon name={icon} size={size === 'sm' ? 14 : 16} />
      ) : null}
      {children}
    </button>
  );
};

const IconButton = ({ icon, onClick, label, size = 36 }) => (
  <button aria-label={label} onClick={onClick}
    className="icon-btn-hover"
    style={{ width: size, height: size, borderRadius: 8, border: 'none',
             background: 'transparent', color: '#475569',
             cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <Icon name={icon} size={18} />
  </button>
);

const Input = ({ label, error, success, help, leftIcon, rightIcon, disabled, ...props }) => {
  const [focus, setFocus] = React.useState(false);
  const borderColor = error ? '#EF4444' : success ? '#2DB976' : focus ? '#2DB976' : '#E2E8F0';
  const shadowColor = error ? 'rgba(239,68,68,.2)' : 'rgba(45,185,118,.25)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {leftIcon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}><Icon name={leftIcon} size={16} /></span>}
        <input {...props} disabled={disabled}
          onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
          className={disabled ? 'input-disabled' : ''}
          style={{
            width: '100%', height: 40, padding: leftIcon ? '0 12px 0 36px' : '0 12px',
            border: `1px solid ${borderColor}`,
            borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: '#1E293B',
            background: disabled ? '#F1F5F9' : error ? '#FEF2F2' : success ? '#ECFDF5' : '#fff',
            outline: 'none',
            boxShadow: focus ? `0 0 0 3px ${shadowColor}` : 'none',
            boxSizing: 'border-box',
            transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
          }} />
        {success && !error && (
          <span className="field-success-icon" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon name="check" size={16} stroke={2.5} style={{ color: '#2DB976' }} />
          </span>
        )}
      </div>
      {error && <div className="field-error-msg">{error}</div>}
      {!error && help && <div style={{ fontSize: 12, color: '#64748B' }}>{help}</div>}
    </div>
  );
};

const Select = ({ label, error, success, options = [], value, onChange, disabled }) => {
  const [focus, setFocus] = React.useState(false);
  const borderColor = error ? '#EF4444' : success ? '#2DB976' : focus ? '#2DB976' : '#E2E8F0';
  const shadowColor = error ? 'rgba(239,68,68,.2)' : 'rgba(45,185,118,.25)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          className={disabled ? 'input-disabled' : ''}
          style={{ width: '100%', height: 40, padding: '0 36px 0 12px', appearance: 'none',
                   border: `1px solid ${borderColor}`, borderRadius: 8,
                   fontSize: 14, fontFamily: 'inherit', color: '#1E293B',
                   background: disabled ? '#F1F5F9' : error ? '#FEF2F2' : success ? '#ECFDF5' : '#fff',
                   outline: 'none',
                   boxShadow: focus ? `0 0 0 3px ${shadowColor}` : 'none',
                   transition: 'border-color 150ms ease, box-shadow 150ms ease' }}>
          {options.map((o) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}><Icon name="chevronDown" size={16} /></span>
      </div>
      {error && <div className="field-error-msg">{error}</div>}
    </div>
  );
};

const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#334155', cursor: 'pointer', userSelect: 'none' }}>
    <span style={{
      width: 16, height: 16, borderRadius: 4,
      border: `1px solid ${checked ? '#2DB976' : '#CBD5E1'}`,
      background: checked ? '#2DB976' : '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 150ms ease',
    }}>
      {checked && <Icon name="check" size={11} stroke={3} style={{ color: '#fff' }} />}
    </span>
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} style={{ display: 'none' }} />
    {label && <span>{label}</span>}
  </label>
);

const Toggle = ({ on, onChange }) => (
  <button onClick={() => onChange?.(!on)}
    style={{ width: 36, height: 20, borderRadius: 9999, background: on ? '#2DB976' : '#CBD5E1',
             border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 150ms ease', padding: 0 }}>
    <span style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: 999,
                   background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.15)', transition: 'left 150ms ease' }} />
  </button>
);

const Badge = ({ variant = 'neutral', dot, children }) => {
  const styles = {
    success: { bg: '#ECFDF5', fg: '#1B7A4E', dot: '#2DB976' },
    warning: { bg: '#FFFBEB', fg: '#B45309', dot: '#F59E0B' },
    error:   { bg: '#FEF2F2', fg: '#B91C1C', dot: '#EF4444' },
    info:    { bg: '#EFF6FF', fg: '#1D4ED8', dot: '#3B82F6' },
    neutral: { bg: '#F1F5F9', fg: '#475569', dot: '#94A3B8' },
  }[variant];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
                   borderRadius: 9999, background: styles.bg, color: styles.fg,
                   fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: styles.dot }} />}
      {children}
    </span>
  );
};

const Avatar = ({ initials, size = 40, color = 'primary', status, src }) => {
  const colors = {
    primary: { bg: '#D1FAE5', fg: '#1B7A4E' },
    amber:   { bg: '#FFFBEB', fg: '#B45309' },
    blue:    { bg: '#EFF6FF', fg: '#1D4ED8' },
    slate:   { bg: '#F1F5F9', fg: '#475569' },
    solid:   { bg: '#2DB976', fg: '#fff' },
  }[color] || { bg: '#D1FAE5', fg: '#1B7A4E' };
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size,
                   borderRadius: 999, background: colors.bg, color: colors.fg,
                   alignItems: 'center', justifyContent: 'center',
                   fontSize: size * 0.34, fontWeight: 600, flexShrink: 0 }}>
      {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', borderRadius: 999, objectFit: 'cover' }} /> : initials}
      {status && <span style={{ position: 'absolute', bottom: 0, right: 0, width: size * 0.24, height: size * 0.24,
                                borderRadius: 999, background: status === 'online' ? '#2DB976' : '#94A3B8',
                                border: '2px solid #fff' }} />}
    </span>
  );
};

Object.assign(window, { Icon, Button, IconButton, Input, Select, Checkbox, Toggle, Badge, Avatar });
