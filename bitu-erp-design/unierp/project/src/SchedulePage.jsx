// SchedulePage.jsx — weekly calendar grid

const SchedulePage = () => {
  const [view, setView] = React.useState('week');
  const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const dates = ['21.04', '22.04', '23.04', '24.04', '25.04', '26.04'];
  const hours = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];

  const events = [
    { day: 0, hour: 0, dur: 1, subject: 'Algoritmlar', teacher: 'Karimov U.B.', room: '301', type: 'lecture' },
    { day: 0, hour: 1, dur: 1, subject: 'Ma\'lumotlar bazasi', teacher: 'Nazarova M.', room: '204', type: 'lab' },
    { day: 0, hour: 3, dur: 1, subject: 'Tarmoqlar', teacher: 'Saidov R.', room: 'Lab-2', type: 'lab' },
    { day: 1, hour: 0, dur: 1, subject: 'Veb-dasturlash', teacher: 'Xolmatov A.', room: '112', type: 'lecture' },
    { day: 1, hour: 2, dur: 1, subject: 'Iqtisodiyot nazariyasi', teacher: 'Yusupov J.', room: '301', type: 'seminar' },
    { day: 2, hour: 1, dur: 2, subject: 'Ishlab chiqarish amaliyoti', teacher: 'Rahimov S.', room: 'Lab-A', type: 'practice' },
    { day: 2, hour: 4, dur: 1, subject: 'Algoritmlar', teacher: 'Karimov U.B.', room: '301', type: 'lecture' },
    { day: 3, hour: 0, dur: 1, subject: 'Ma\'lumotlar bazasi', teacher: 'Nazarova M.', room: '204', type: 'lecture' },
    { day: 3, hour: 2, dur: 1, subject: 'Diskret matematika', teacher: 'Tursunova F.', room: 'Lab-3', type: 'lab' },
    { day: 4, hour: 1, dur: 1, subject: 'Operatsion tizimlar', teacher: 'Ergashev B.', room: '208', type: 'seminar' },
    { day: 4, hour: 3, dur: 1, subject: 'Iqtisodiyot nazariyasi', teacher: 'Yusupov J.', room: '301', type: 'lecture' },
    { day: 5, hour: 0, dur: 1, subject: 'Pedagogika', teacher: 'Hasanova D.', room: '115', type: 'lecture' },
  ];

  const typeColor = (t) => ({
    lecture: { bg: '#ECFDF5', fg: '#1B7A4E', border: '#2DB976', label: 'Maʼruza' },
    lab: { bg: '#EFF6FF', fg: '#1D4ED8', border: '#3B82F6', label: 'Labor.' },
    seminar: { bg: '#FFFBEB', fg: '#B45309', border: '#F59E0B', label: 'Seminar' },
    practice: { bg: '#F3E8FF', fg: '#6B21A8', border: '#8B5CF6', label: 'Amaliy' },
  })[t];

  return (
    <>
      <Card padding={14} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" icon="arrowLeft">Oldingi</Button>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', minWidth: 220, textAlign: 'center' }}>
            21 – 26 Aprel, 2026
          </div>
          <Button variant="secondary" size="sm">Keyingi <Icon name="arrowRight" size={14} /></Button>
          <div style={{ flex: 1 }} />
          <select style={{ height: 34, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
            <option>301-A guruhi</option><option>301-B guruhi</option><option>Karimov U.B.</option>
          </select>
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
            {['week','day','month'].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none',
                         background: view === v ? '#fff' : 'transparent',
                         color: view === v ? '#0F172A' : '#64748B',
                         fontSize: 12, fontWeight: view === v ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
                         boxShadow: view === v ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>
                {v === 'week' ? 'Hafta' : v === 'day' ? 'Kun' : 'Oy'}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" icon="plus">Dars qo'shish</Button>
        </div>
      </Card>

      <Card padding={0} className="table-scroll" style={{ overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(6,1fr)', borderBottom: '1px solid #E2E8F0', minWidth: 800 }}>
          <div></div>
          {days.map((d, i) => (
            <div key={i} style={{ padding: '12px 10px', borderLeft: '1px solid #F1F5F9', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: i === 4 ? '#2DB976' : '#0F172A', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{dates[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '80px repeat(6,1fr)', minWidth: 800 }}>
          <div>
            {hours.map((h, i) => (
              <div key={i} style={{ height: 80, padding: '6px 10px', fontSize: 11, color: '#64748B', fontVariantNumeric: 'tabular-nums', borderTop: i === 0 ? 'none' : '1px solid #F1F5F9' }}>{h}</div>
            ))}
          </div>
          {days.map((d, dayIdx) => (
            <div key={dayIdx} style={{ borderLeft: '1px solid #F1F5F9', position: 'relative' }}>
              {hours.map((_, hi) => (
                <div key={hi} style={{ height: 80, borderTop: hi === 0 ? 'none' : '1px solid #F1F5F9' }} />
              ))}
              {events.filter(e => e.day === dayIdx).map((e, i) => {
                const c = typeColor(e.type);
                return (
                  <div key={i} style={{
                    position: 'absolute', top: e.hour * 80 + 3, left: 4, right: 4,
                    height: e.dur * 80 - 6, borderRadius: 8,
                    background: c.bg, borderLeft: `3px solid ${c.border}`,
                    padding: 8, cursor: 'pointer', overflow: 'hidden',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: c.fg, marginBottom: 2 }}>{c.label} · {e.room}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{e.subject}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{e.teacher}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

Object.assign(window, { SchedulePage });
