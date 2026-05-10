// TeachersPage.jsx

const TeachersListPage = ({ onOpen }) => {
  const [search, setSearch] = React.useState('');
  const [dept, setDept] = React.useState('Barchasi');
  const [mode, setMode] = React.useState('Barchasi');

  const filtered = TEACHERS.filter(t => {
    if (search && !t.name.full.toLowerCase().includes(search.toLowerCase())) return false;
    if (dept !== 'Barchasi' && t.dept !== dept) return false;
    if (mode !== 'Barchasi' && t.mode !== mode) return false;
    return true;
  });

  return (
    <>
      <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { l: 'Jami o\'qituvchilar', v: '186', c: '#2DB976' },
          { l: 'Shtatli', v: '142', c: '#1B7A4E' },
          { l: 'Soatbay', v: '44', c: '#F59E0B' },
          { l: 'PhD / DSc', v: '68', c: '#3B82F6' },
          { l: 'Professor', v: '23', c: '#8B5CF6' },
        ].map((k, i) => (
          <Card key={i} padding={18}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: k.c, letterSpacing: '-0.02em' }}>{k.v}</div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
              <Icon name="search" size={14} />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="F.I.Sh. bo'yicha qidirish…"
              style={{ width: '100%', height: 36, padding: '0 10px 0 32px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <select value={dept} onChange={e => setDept(e.target.value)}
            style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
            <option>Barchasi</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={mode} onChange={e => setMode(e.target.value)}
            style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
            <option>Barchasi</option>
            <option>Shtatli</option>
            <option>Soatbay</option>
          </select>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" icon="upload">Eksport</Button>
          <Button variant="primary" size="sm" icon="plus">Yangi o'qituvchi</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFB' }}>
              {['F.I.Sh.', 'Kafedra', 'Lavozim', 'Daraja', 'Shakl', 'Tajriba', 'Soatlar', 'Aloqa', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B',
                                      textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} style={{ borderTop: '1px solid #F1F5F9', cursor: 'pointer' }}
                onClick={() => onOpen?.(t)}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={t.name.initials} size={32} color="primary" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{t.name.full}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{t.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>{t.dept}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>{t.title}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  {t.degree !== '—' ? <Badge variant="info">{t.degree}</Badge> : <span style={{ color: '#94A3B8' }}>—</span>}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge variant={t.mode === 'Shtatli' ? 'success' : 'warning'} dot>{t.mode}</Badge>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{t.experience} yil</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{t.hours} s.</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>{t.phone}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                  <IconButton icon="more" label="Amallar" size={28} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

Object.assign(window, { TeachersListPage });
