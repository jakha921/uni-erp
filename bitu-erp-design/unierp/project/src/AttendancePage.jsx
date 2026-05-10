// AttendancePage.jsx — editable attendance grid

const AttendancePage = () => {
  const [group, setGroup] = React.useState('301-A');
  const [subject, setSubject] = React.useState('Algoritmlar');
  const [date, setDate] = React.useState('25.04.2026');
  const [grid, setGrid] = React.useState(() => {
    const rows = {};
    STUDENTS.slice(0, 14).forEach((s, i) => {
      rows[s.id] = Array.from({ length: 8 }, (_, j) => {
        const r = seed(i * 17 + j);
        return r > 0.88 ? 'N' : r > 0.78 ? 'U' : 'P';
      });
    });
    return rows;
  });

  const cycle = (studentId, col) => {
    setGrid(g => {
      const row = [...g[studentId]];
      row[col] = row[col] === 'P' ? 'N' : row[col] === 'N' ? 'U' : 'P';
      return { ...g, [studentId]: row };
    });
  };

  const dates = ['18.04', '19.04', '20.04', '21.04', '22.04', '23.04', '24.04', '25.04'];

  const mark = (v) => {
    if (v === 'P') return { bg: '#ECFDF5', fg: '#1B7A4E', label: '+' };
    if (v === 'N') return { bg: '#FEF2F2', fg: '#B91C1C', label: '—' };
    return { bg: '#FFFBEB', fg: '#B45309', label: 'U' };
  };

  const rows = STUDENTS.slice(0, 14);

  return (
    <>
      <Card padding={16} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Guruh</label>
            <select value={group} onChange={e => setGroup(e.target.value)}
              style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit', minWidth: 140 }}>
              {['301-A','301-B','302-A','205-A','104-B'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Fan</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit', minWidth: 180 }}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Davr</label>
            <select style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
              <option>18.04 — 25.04 (shu hafta)</option><option>11.04 — 17.04</option>
            </select>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748B', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: '#ECFDF5', color: '#1B7A4E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>+</span> Keldi
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: '#FEF2F2', color: '#B91C1C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>—</span> Kelmadi
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: '#FFFBEB', color: '#B45309', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>U</span> Uzrli
            </span>
          </div>
          <Button variant="primary" size="sm" icon="check">Saqlash</Button>
        </div>
      </Card>

      <Card padding={0}>
        <div className="table-scroll" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFB' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'sticky', left: 0, background: '#F8FAFB', minWidth: 220 }}>Talaba</th>
                {dates.map((d, i) => (
                  <th key={i} style={{ padding: '10px 4px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B', minWidth: 52 }}>{d}</th>
                ))}
                <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, ri) => {
                const row = grid[s.id];
                const present = row.filter(v => v === 'P').length;
                const pct = Math.round(present / row.length * 100);
                return (
                  <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', position: 'sticky', left: 0, background: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar initials={s.name.initials} size={28} color={s.name.isFemale ? 'amber' : 'blue'} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.name.short}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{s.id}</div>
                        </div>
                      </div>
                    </td>
                    {row.map((v, ci) => {
                      const m = mark(v);
                      return (
                        <td key={ci} style={{ padding: '6px 4px', textAlign: 'center' }}>
                          <button onClick={() => cycle(s.id, ci)}
                            style={{ width: 36, height: 30, borderRadius: 6, border: 'none',
                                     background: m.bg, color: m.fg, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                     fontFamily: 'inherit', transition: 'transform 100ms ease' }}>
                            {m.label}
                          </button>
                        </td>
                      );
                    })}
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                                  color: pct >= 80 ? '#1B7A4E' : pct >= 60 ? '#B45309' : '#B91C1C' }}>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

Object.assign(window, { AttendancePage });
