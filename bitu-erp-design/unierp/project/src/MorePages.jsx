// ContractsPage.jsx + DormitoryPage.jsx + TasksPage.jsx + ReportsPage.jsx

const ContractsPage = () => {
  const [tab, setTab] = React.useState('all');
  const fmt = (n) => n.toLocaleString('ru-RU');

  const rows = CONTRACTS.filter(c => {
    if (tab === 'paid') return c.status === 'To\'langan';
    if (tab === 'partial') return c.status === 'Qisman';
    if (tab === 'debt') return c.status === 'Qarzdor';
    return true;
  });

  return (
    <>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { l: 'Jami kontraktlar', v: '1,842', s: '32.8B so\'m jami', c: '#2DB976' },
          { l: 'To\'langan', v: '1,376', s: '24.8B so\'m', c: '#1B7A4E' },
          { l: 'Qisman to\'langan', v: '254', s: '6.1B so\'m qoldiq', c: '#F59E0B' },
          { l: 'Qarzdorlar', v: '212', s: '1.85B so\'m qarz', c: '#EF4444' },
        ].map((k, i) => (
          <Card key={i} hover padding={18}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: k.c, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{k.v}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{k.s}</div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 10 }}>
            {[['all','Barchasi'],['paid','To\'langan'],['partial','Qisman'],['debt','Qarzdorlar']].map(([v,l]) => (
              <button key={v} onClick={() => setTab(v)}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                         background: tab === v ? '#fff' : 'transparent',
                         color: tab === v ? '#0F172A' : '#64748B',
                         fontSize: 12.5, fontWeight: tab === v ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
                         boxShadow: tab === v ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>{l}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" icon="upload">Eksport</Button>
          <Button variant="primary" size="sm" icon="plus">Yangi kontrakt</Button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFB' }}>
              {['№','Talaba','Tur','Summa','To\'langan','Qoldiq','Muddat','Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{c.id}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={c.student.name.initials} size={28} color={c.student.name.isFemale ? 'amber' : 'blue'} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{c.student.name.short}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{c.student.group} · {c.student.faculty}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}><Badge variant={c.type === 'Davlat grant' ? 'info' : c.type === 'Xorijiy' ? 'warning' : 'neutral'}>{c.type}</Badge></td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#0F172A', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{fmt(c.total)}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#1B7A4E', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{fmt(c.paid)}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: c.balance === 0 ? '#94A3B8' : '#B91C1C' }}>{fmt(c.balance)}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: c.overdue ? '#B91C1C' : '#64748B', fontVariantNumeric: 'tabular-nums' }}>{c.deadline}{c.overdue && <Icon name="warning" size={11} style={{ marginLeft: 4, verticalAlign: '-2px' }} />}</td>
                <td style={{ padding: '12px 14px' }}><Badge variant={c.status === 'To\'langan' ? 'success' : c.status === 'Qisman' ? 'warning' : 'error'} dot>{c.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

const DormitoryPage = () => {
  const [tab, setTab] = React.useState('map');
  const rooms = Array.from({ length: 48 }, (_, i) => {
    const cap = 4;
    const occ = rnum(i * 3, 0, 4);
    const type = occ === 0 ? 'empty' : occ === cap ? 'full' : 'partial';
    return { num: 201 + i, cap, occ, type, floor: Math.floor(i / 12) + 2 };
  });

  return (
    <>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { l: 'Jami xonalar', v: '142', c: '#2DB976' },
          { l: 'Bandligi', v: '90%', s: '1,156 joy band', c: '#1B7A4E' },
          { l: 'Bo\'sh joylar', v: '114', c: '#F59E0B' },
          { l: 'Kutish ro\'yxati', v: '38', c: '#EF4444' },
        ].map((k, i) => (
          <Card key={i} hover padding={18}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: k.c, letterSpacing: '-0.02em' }}>{k.v}</div>
            {k.s && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{k.s}</div>}
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 10 }}>
            {[['map','Xonalar kartasi'],['list','Ro\'yxat']].map(([v,l]) => (
              <button key={v} onClick={() => setTab(v)}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                         background: tab === v ? '#fff' : 'transparent', color: tab === v ? '#0F172A' : '#64748B',
                         fontSize: 12.5, fontWeight: tab === v ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
                         boxShadow: tab === v ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>{l}</button>
            ))}
          </div>
          <select style={{ height: 34, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
            <option>TTJ-2 (asosiy)</option><option>TTJ-1</option><option>TTJ-3</option>
          </select>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#64748B', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#ECFDF5', border: '1px solid #A7F3D0' }} /> Bo'sh</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#FFFBEB', border: '1px solid #FCD34D' }} /> Qisman</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#D1FAE5', border: '1px solid #2DB976' }} /> To'liq</span>
          </div>
          <Button variant="primary" size="sm" icon="plus">Joylashtirish</Button>
        </div>

        {tab === 'map' ? (
          <div style={{ padding: 20 }}>
            {[2,3,4,5].map(floor => (
              <div key={floor} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 10 }}>{floor}-qavat</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 8 }}>
                  {rooms.filter(r => r.floor === floor).map(r => {
                    const styles = {
                      empty: { bg: '#ECFDF5', border: '#A7F3D0', fg: '#1B7A4E' },
                      partial: { bg: '#FFFBEB', border: '#FCD34D', fg: '#B45309' },
                      full: { bg: '#D1FAE5', border: '#2DB976', fg: '#065F46' },
                    }[r.type];
                    return (
                      <div key={r.num} style={{
                        aspectRatio: '1.2', border: `1.5px solid ${styles.border}`, background: styles.bg,
                        borderRadius: 8, padding: 6, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: styles.fg, fontVariantNumeric: 'tabular-nums' }}>{r.num}</div>
                        <div style={{ fontSize: 10, color: styles.fg, fontWeight: 500 }}>{r.occ}/{r.cap}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>
              {['Xona','Qavat','Sig\'im','Band','Holat','Nazoratchi',''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rooms.slice(0, 16).map(r => (
                <tr key={r.num} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>№ {r.num}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155' }}>{r.floor}-qavat</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{r.cap} o'rinli</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{r.occ}/{r.cap}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge variant={r.type === 'empty' ? 'neutral' : r.type === 'partial' ? 'warning' : 'success'} dot>
                      {r.type === 'empty' ? 'Bo\'sh' : r.type === 'partial' ? 'Qisman' : 'To\'liq'}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155' }}>{fullName(r.num, 0.4).short}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}><IconButton icon="more" label="Amallar" size={28} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
};

const TasksPage = () => {
  const [view, setView] = React.useState('kanban');
  const cols = [
    { id: 'Yangi', label: 'Yangi', color: '#3B82F6', bg: '#EFF6FF' },
    { id: 'Jarayonda', label: 'Jarayonda', color: '#F59E0B', bg: '#FFFBEB' },
    { id: 'Bajarildi', label: 'Bajarildi', color: '#2DB976', bg: '#ECFDF5' },
    { id: 'Muddati o\'tgan', label: 'Muddati o\'tgan', color: '#EF4444', bg: '#FEF2F2' },
  ];
  const [tasks, setTasks] = React.useState(TASKS);
  const [dragId, setDragId] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const pColor = (p) => p === 'Yuqori' ? 'error' : p === 'O\'rta' ? 'warning' : 'neutral';

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', padding: 3, borderRadius: 10, border: '1px solid #E2E8F0' }}>
          {[['kanban','Kanban','grid'],['list','Ro\'yxat','check']].map(([v,l,i]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                       background: view === v ? '#2DB976' : 'transparent', color: view === v ? '#fff' : '#475569',
                       fontSize: 12.5, fontWeight: view === v ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
                       display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <Icon name={i} size={14} /> {l}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="sm" icon="plus">Topshiriq qo'shish</Button>
      </div>

      {view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length},1fr)`, gap: 14 }}>
          {cols.map(col => (
            <div key={col.id}
              onDragOver={e => { e.preventDefault(); setOver(col.id); }}
              onDrop={() => { if (dragId) setTasks(ts => ts.map(t => t.id === dragId ? {...t, status: col.id} : t)); setDragId(null); setOver(null); }}
              style={{ background: over === col.id ? col.bg : '#F8FAFB', borderRadius: 14, padding: 12, minHeight: 420,
                       border: over === col.id ? `2px dashed ${col.color}` : '2px dashed transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 12px' }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: col.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', flex: 1 }}>{col.label}</span>
                <span style={{ fontSize: 11, color: '#64748B', background: '#fff', padding: '2px 7px', borderRadius: 999, fontWeight: 500 }}>
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.filter(t => t.status === col.id).map(t => (
                  <div key={t.id} draggable
                    onDragStart={() => setDragId(t.id)} onDragEnd={() => { setDragId(null); setOver(null); }}
                    style={{ background: '#fff', borderRadius: 10, padding: 12, cursor: 'grab',
                             boxShadow: dragId === t.id ? '0 8px 16px rgba(0,0,0,.12)' : '0 1px 2px rgba(0,0,0,.05)',
                             border: '1px solid #E2E8F0', opacity: dragId === t.id ? 0.5 : 1 }}>
                    <div style={{ marginBottom: 8 }}><Badge variant={pColor(t.priority)} dot>{t.priority}</Badge></div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', lineHeight: 1.3 }}>{t.title}</div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F5F9',
                                  display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="user" size={11} /> {t.assignee}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={11} /> {t.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFB' }}>
              {['Topshiriq','Muhimlik','Topshiruvchi','Bajaruvchi','Muddat','Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{t.title}</td>
                  <td style={{ padding: '12px 14px' }}><Badge variant={pColor(t.priority)} dot>{t.priority}</Badge></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155' }}>{t.assigner}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#334155' }}>{t.assignee}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{t.deadline}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge variant={t.status === 'Bajarildi' ? 'success' : t.status === 'Jarayonda' ? 'warning' : t.status === 'Muddati o\'tgan' ? 'error' : 'info'} dot>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
};

const ReportsPage = () => {
  const groups = [
    { label: 'Akademika', color: '#2DB976', icon: 'chart', items: [
      'Talabalar reyting ro\'yxati', 'Guruhlar bo\'yicha GPA', 'Davomat tahlili', 'Imtihon natijalari', 'Fakultet bo\'yicha statistika', 'O\'qituvchi yuklamasi',
    ]},
    { label: 'Moliya', color: '#3B82F6', icon: 'briefcase', items: [
      'Kontrakt tushumlari', 'Qarzdorlar ro\'yxati', 'Oylik moliyaviy hisobot', 'Stipendiya to\'lovlari', 'TTJ to\'lovlari',
    ]},
    { label: 'HR', color: '#F59E0B', icon: 'users', items: [
      'O\'qituvchilar ro\'yxati', 'Kadrlar harakati', 'Soatbay hisob-kitob', 'Malaka oshirish',
    ]},
    { label: 'Ma\'muriy', color: '#8B5CF6', icon: 'doc', items: [
      'Yillik universitet hisoboti', 'Filiallararo taqqoslash', 'Buyruqlar reestri',
    ]},
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 320 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}><Icon name="search" size={15} /></span>
          <input placeholder="Hisobot nomini kiriting…"
            style={{ width: '100%', height: 40, padding: '0 12px 0 38px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, background: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="secondary" size="sm" icon="calendar">Rejalashtirilgan</Button>
        <Button variant="primary" size="sm" icon="plus">Maxsus hisobot</Button>
      </div>

      {groups.map(g => (
        <div key={g.label} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: g.color, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={g.icon} size={16} />
            </div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{g.label}</h3>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>{g.items.length} ta hisobot</span>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {g.items.map((it, i) => (
              <Card key={i} padding={16} onClick={() => {}}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 36, height: 44, borderRadius: 6, background: '#F1F5F9', color: g.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="doc" size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{it}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Oxirgi: 22.04.2026</div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                      <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', fontSize: 11, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>PDF</button>
                      <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', fontSize: 11, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>Excel</button>
                      <button style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#ECFDF5', fontSize: 11, color: '#1B7A4E', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Ochish →</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

Object.assign(window, { ContractsPage, DormitoryPage, TasksPage, ReportsPage });
