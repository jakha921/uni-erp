// CrudKit.jsx — universal CRUD pattern uchun yordamchi komponentlar
// FormField, FormSection, FormGrid, FormSelect, FormDate, FormPhone, FormTextarea, FormToggle
// Hammasi controlled va yagona uslubda bo'ladi.

const FormSection = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    {title && <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{title}</div>}
    {children}
  </div>
);

const FormGrid = ({ children, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
    {children}
  </div>
);

const FieldLabel = ({ children, required, error }) => (
  <label style={{ display: 'block', marginBottom: 5 }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: error ? '#DC2626' : '#475569' }}>
      {children}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
    </span>
  </label>
);

const FieldError = ({ msg }) => msg ? (
  <div style={{ fontSize: 11.5, color: '#DC2626', marginTop: 4 }}>{msg}</div>
) : null;

const fieldBase = (error) => ({
  width: '100%', height: 40,
  padding: '0 12px',
  border: `1px solid ${error ? '#FECACA' : '#E2E8F0'}`,
  borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
  color: '#0F172A',
});

const FormField = ({ label, value, onChange, type = 'text', placeholder, required, error, span, ...rest }) => (
  <div style={{ gridColumn: span ? `span ${span}` : 'auto' }}>
    <FieldLabel required={required} error={!!error}>{label}</FieldLabel>
    <input type={type} value={value ?? ''} onChange={e => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
      placeholder={placeholder}
      style={fieldBase(error)}
      onFocus={e => e.target.style.borderColor = '#2DB976'}
      onBlur={e => e.target.style.borderColor = error ? '#FECACA' : '#E2E8F0'}
      {...rest} />
    <FieldError msg={error} />
  </div>
);

const FormSelect = ({ label, value, onChange, options, placeholder = 'Tanlang…', required, error, span }) => (
  <div style={{ gridColumn: span ? `span ${span}` : 'auto' }}>
    <FieldLabel required={required} error={!!error}>{label}</FieldLabel>
    <select value={value ?? ''} onChange={e => {
      const v = e.target.value;
      // try numeric coercion
      const n = Number(v);
      onChange(v !== '' && !isNaN(n) && options.some(o => o.value === n) ? n : v);
    }}
      style={{ ...fieldBase(error), padding: '0 28px 0 12px', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <FieldError msg={error} />
  </div>
);

const FormTextarea = ({ label, value, onChange, placeholder, rows = 3, required, error, span }) => (
  <div style={{ gridColumn: span ? `span ${span}` : 'auto' }}>
    <FieldLabel required={required} error={!!error}>{label}</FieldLabel>
    <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ ...fieldBase(error), height: 'auto', padding: 12, resize: 'vertical', minHeight: rows * 22, fontFamily: 'inherit' }} />
    <FieldError msg={error} />
  </div>
);

const FormToggleRow = ({ label, value, onChange, hint }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: 10, marginBottom: 8 }}>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: '#0F172A' }}>{label}</div>
      {hint && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{hint}</div>}
    </div>
    <Toggle checked={!!value} onChange={onChange} />
  </div>
);

// Phone with +998 prefix mask
const FormPhone = ({ label, value, onChange, required, error, span }) => {
  const display = (value || '').replace(/^\+998/, '');
  return (
    <div style={{ gridColumn: span ? `span ${span}` : 'auto' }}>
      <FieldLabel required={required} error={!!error}>{label}</FieldLabel>
      <div style={{ display: 'flex', alignItems: 'stretch', border: `1px solid ${error ? '#FECACA' : '#E2E8F0'}`, borderRadius: 8, overflow: 'hidden', height: 40, background: '#fff' }}>
        <span style={{ padding: '0 10px', display: 'flex', alignItems: 'center', background: '#F8FAFB', color: '#64748B', fontSize: 13, fontWeight: 500, borderRight: '1px solid #E2E8F0' }}>+998</span>
        <input value={display} onChange={e => {
          const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
          onChange(digits ? '+998' + digits : '');
        }} placeholder="901234567" maxLength={9}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: 14, fontFamily: 'inherit', color: '#0F172A' }} />
      </div>
      <FieldError msg={error} />
    </div>
  );
};

// Detail page row helpers
const DetailRow = ({ label, value, mono }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', gap: 16 }}>
    <span style={{ fontSize: 13, color: '#64748B' }}>{label}</span>
    <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 500, textAlign: 'right', fontVariantNumeric: mono ? 'tabular-nums' : 'normal' }}>{value || '—'}</span>
  </div>
);

// Inline action buttons for table rows
const RowActions = ({ onView, onEdit, onDelete }) => (
  <div style={{ display: 'inline-flex', gap: 4, justifyContent: 'flex-end' }}>
    {onView && <IconButton icon="eye" size={28} onClick={(e) => { e.stopPropagation(); onView(); }} title="Ko'rish" />}
    {onEdit && <IconButton icon="edit" size={28} onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Tahrirlash" />}
    {onDelete && <IconButton icon="trash" size={28} onClick={(e) => { e.stopPropagation(); onDelete(); }} title="O'chirish" />}
  </div>
);

// Validation helpers
const validators = {
  required: (v) => (v == null || v === '' ? 'Majburiy maydon' : null),
  phone: (v) => v && !/^\+998\d{9}$/.test(v) ? "Telefon formati noto'g'ri" : null,
  email: (v) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Email formati noto'g'ri" : null,
  minLen: (n) => (v) => v && v.length < n ? `Kamida ${n} ta belgi` : null,
  positive: (v) => v != null && v !== '' && Number(v) <= 0 ? "Musbat son kerak" : null,
};

const validate = (values, rules) => {
  const errors = {};
  for (const [field, fns] of Object.entries(rules)) {
    const arr = Array.isArray(fns) ? fns : [fns];
    for (const fn of arr) {
      const err = fn(values[field], values);
      if (err) { errors[field] = err; break; }
    }
  }
  return errors;
};

Object.assign(window, {
  FormSection, FormGrid, FormField, FormSelect, FormTextarea, FormToggleRow, FormPhone,
  FieldLabel, FieldError, DetailRow, RowActions,
  validators, validate,
});
