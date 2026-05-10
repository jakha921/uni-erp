// GradingPage.jsx — editable grading table

const GradingPage = () => {
  const [group, setGroup] = React.useState('301-A');
  const [subject, setSubject] = React.useState('Algoritmlar');
  const [grades, setGrades] = React.useState(() => {
    const g = {};
    STUDENTS.slice(0, 14).forEach((s, i) => {
      g[s.id] = {
        a1: rnum(i * 3, 60, 95),
        a2: rnum(i * 5, 55, 92),
        mid: rnum(i * 7, 55, 95),
        final: rnum(i * 11, 55, 95),
      };
    });
    return g;
  });

  const update = (id, k, v) => {
    const n = Math.max(0, Math.min(100, Number(v) || 0));
    setGrades(g => ({ ...g, [id]: { ...g[id], [k]: n } }));
  };

  const total = (g) => g.a1 * 0.1 + g.a2 * 0.1 + g.mid * 0.3 + g.final * 0.5;

  const rows = STUDENTS.slice(0, 14);

  return (
    <>
      <Card padding={16} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Guruh</label>
            <select value={group} onChange={e => setGroup(e.target.value)}
              style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit', minWidth: 140 }}>
              {['301-A','301-B','302-A','205-A'].map(g => <option key={g}>{g}</option>)}
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
              <option>2025-2026 · 2-semester</option>
            </select>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: '#64748B' }}>
            Og'irlik: A1 10% · A2 10% · Oraliq 30% · Yakuniy 50%
          </div>
          <Button variant="primary" size="sm" icon="check">Saqlash</Button>
        </div>
      </Card>

      <Card padding={0} className="table-scroll" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFB' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Talaba</th>
              <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>A1 (10%)</th>
              <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>A2 (10%)</th>
              <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>Oraliq</th>
              <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>Yakuniy</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>Jami</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>Baho</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(s => {
              const g = grades[s.id];
              const t = total(g);
              const mark = t >= 86 ? "A'lo" : t >= 71 ? 'Yaxshi' : t >= 55 ? 'Qoniqarli' : 'Qoniqarsiz';
              const v = t >= 86 ? 'success' : t >= 71 ? 'info' : t >= 55 ? 'warning' : 'error';
              return (
                <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={s.name.initials} size={28} color={s.name.isFemale ? 'amber' : 'blue'} />
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.name.short}</div>
                    </div>
                  </td>
                  {['a1','a2','mid','final'].map(k => (
                    <td key={k} style={{ padding: '6px 8px', textAlign: 'center' }}>
                      <input type="number" value={g[k]} onChange={e => update(s.id, k, e.target.value)} min={0} max={100}
                        style={{ width: 60, height: 32, borderRadius: 6, border: '1px solid #E2E8F0',
                                 textAlign: 'center', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                                 color: g[k] >= 55 ? '#1E293B' : '#B91C1C', background: '#fff', fontVariantNumeric: 'tabular-nums' }} />
                    </td>
                  ))}
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{t.toFixed(1)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}><Badge variant={v}>{mark}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
};

Object.assign(window, { GradingPage });
