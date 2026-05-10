// DataDisplay.jsx — stats, cards, charts

const Card = ({ children, padding = 24, style, onClick, hover, className = '' }) => (
  <div onClick={onClick} className={`${hover ? 'card-depth hover-lift' : ''} ${className}`} style={{
    background: '#fff', borderRadius: 16, padding,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }}>{children}</div>
);

const StatCard = ({ icon, label, value, trend, trendDir = 'up', iconBg = '#2DB976', loading, className = '' }) => {
  if (loading) return <SkeletonCard height={140} />;
  return (
    <Card hover className={className}>
      <div style={{ width: 40, height: 40, borderRadius: 999, background: iconBg,
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
        {value}
      </div>
      {trend && (
        <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 12, fontWeight: 500,
                      color: trendDir === 'up' ? '#1B7A4E' : '#B91C1C' }}>
          <Icon name={trendDir === 'up' ? 'trendUp' : 'trendDown'} size={12} stroke={2.5} />
          {trend}
        </div>
      )}
    </Card>
  );
};

const ChartCard = ({ title, period, right, children, padding = 24, loading }) => {
  if (loading) return <SkeletonChart height={260} />;
  return (
    <Card padding={padding}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1E293B' }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {period && <span style={{ fontSize: 12, color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: 8 }}>{period}</span>}
          {right}
        </div>
      </div>
      {children}
    </Card>
  );
};

const DonutChart = ({ segments, centerValue, centerLabel, size = 180 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const R = 15.9;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg viewBox="0 0 36 36" width={size} height={size}>
          <circle cx="18" cy="18" r={R} fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
          {segments.map((s, i) => {
            const dash = (s.value / total) * 100;
            const el = (
              <circle key={i} cx="18" cy="18" r={R} fill="none" stroke={s.color}
                strokeWidth="3.5"
                strokeDasharray={`${dash} 100`}
                strokeDashoffset={-offset}
                transform="rotate(-90 18 18)"
                strokeLinecap="butt"
                style={{ transition: 'stroke-dasharray 600ms ease, stroke-dashoffset 600ms ease' }} />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{centerValue}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{centerLabel}</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{s.label}</span>
            <span style={{ fontWeight: 600, color: '#0F172A' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, height = 180, max }) => {
  const m = max ?? Math.max(...data.map((d) => d.value));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height, padding: '10px 0' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', height: `${(d.value / m) * 100}%`,
                            background: d.highlight ? '#2DB976' : '#A7F3D0',
                            borderRadius: '4px 4px 0 0', minHeight: 4,
                            transition: 'height 400ms ease' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#64748B' }}>{d.label}</div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ points = [], width = 300, height = 120, color = '#2DB976', id }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 12) - 6;
    return [x, y];
  });
  const path = coords.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
  const area = `${path} L${width},${height} L0,${height} Z`;
  const gradId = `lineGrad_${id || Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="#F1F5F9" strokeDasharray="3 4">
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" y1={height * f} x2={width} y2={height * f} />)}
      </g>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={color} />)}
    </svg>
  );
};

const Heatmap = ({ weeks = 14 }) => {
  const levels = ['#F1F5F9', '#ECFDF5', '#A7F3D0', '#34D399', '#2DB976', '#1B7A4E'];
  const seed = [0, 1, 2, 3, 4, 5, 0, 1, 1, 2, 3, 4, 5, 2, 0, 2, 1, 3, 4, 2, 1, 0, 3, 4, 5, 2, 3, 1];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 2 }}>
        {days.map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: '#94A3B8', width: 14, height: 14, display: 'flex', alignItems: 'center' }}>{d}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 3 }}>
        {Array.from({ length: weeks * 7 }).map((_, i) => {
          const v = (seed[i % seed.length] + ((i * 7) % 5)) % 6;
          return <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: levels[v] }} />;
        })}
      </div>
    </div>
  );
};

const ProgressBar = ({ value, max = 100, showLabel }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
    <div style={{ flex: 1, height: 8, borderRadius: 9999, background: '#E2E8F0', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: '#2DB976', borderRadius: 9999, transition: 'width 400ms ease' }} />
    </div>
    {showLabel && <span style={{ fontSize: 12, color: '#64748B', minWidth: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round((value / max) * 100)}%</span>}
  </div>
);

Object.assign(window, { Card, StatCard, ChartCard, DonutChart, BarChart, LineChart, Heatmap, ProgressBar });
