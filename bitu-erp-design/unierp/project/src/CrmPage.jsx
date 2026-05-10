// CrmPage.jsx — CRM list and Kanban

const CrmListPage = () => {
  const [selected, setSelected] = React.useState(new Set());
  const [status, setStatus] = React.useState('Barchasi');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  const filtered = LEADS.filter(l => {
    if (status !== 'Barchasi' && l.status !== status) return false;
    if (search && !l.name.full.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search)) return false;
    return true;
  });

  const statusColor = (s) => ({
    'Yangi': 'info', 'Qo\'ng\'iroq': 'warning', 'Kutilmoqda': 'neutral', 'Qabul': 'success', 'Rad': 'error',
  })[s] || 'neutral';

  const columns = [
    { key: 'id', label: '№', render: (r) => <span style={{ color: '#64748B', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>#{String(r.id).padStart(4,'0')}</span> },
    { key: 'name', label: 'Abituriyent', sortable: true, render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar initials={r.name.initials} size={32} color={r.name.isFemale ? 'amber' : 'blue'} />
        <div>
          <div style={{ fontWeight: 500, color: '#0F172A' }}>{r.name.short}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{r.phone}</div>
        </div>
      </div>
    )},
    { key: 'direction', label: 'Yo\'nalish', render: (r) => <span style={{ fontSize: 13 }}>{r.direction}</span> },
    { key: 'source', label: 'Manba', render: (r) => <Badge variant="neutral">{r.source}</Badge> },
    { key: 'assignee', label: 'Mas\'ul', render: (r) => <span style={{ fontSize: 13 }}>{r.assignee}</span> },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusColor(r.status)} dot>{r.status}</Badge> },
    { key: 'date', label: 'Sana', render: (r) => <span style={{ fontSize: 12, color: '#64748B' }}>{r.date}</span> },
    { key: '_', label: '', align: 'right', render: () => <IconButton icon="more" label="Amallar" size={28} /> },
  ];

  const statuses = ['Barchasi', 'Yangi', 'Qo\'ng\'iroq', 'Kutilmoqda', 'Qabul', 'Rad'];

  return (
    <>
      <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { l: 'Jami arizalar', v: '248', d: '+23 bu hafta', c: '#2DB976' },
          { l: 'Yangi', v: '42', d: 'Ko\'rib chiqilmagan', c: '#3B82F6' },
          { l: 'Konversiya', v: '28%', d: '+4% bu oy', c: '#F59E0B' },
          { l: 'Qabul qilindi', v: '69', d: 'Bu yil', c: '#1B7A4E' },
          { l: 'O\'rtacha vaqt', v: '3.2 kun', d: 'Javob vaqti', c: '#64748B' },
        ].map((k, i) => (
          <Card key={i} padding={18}>
            <div style={{ fontSize: 12, color: '#64748B' }}>{k.l}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: k.c, letterSpacing: '-0.02em' }}>{k.v}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{k.d}</div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 10 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                         background: status === s ? '#fff' : 'transparent',
                         color: status === s ? '#0F172A' : '#64748B',
                         fontSize: 12.5, fontWeight: status === s ? 600 : 500, cursor: 'pointer',
                         fontFamily: 'inherit',
                         boxShadow: status === s ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative', width: 240 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
              <Icon name="search" size={14} />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism yoki telefon…"
              style={{ width: '100%', height: 34, padding: '0 10px 0 30px', border: '1px solid #E2E8F0',
                       borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <Button variant="secondary" size="sm" icon="filter">Filtr</Button>
          <Button variant="primary" size="sm" icon="plus">Yangi ariza</Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFB' }}>
              <th style={{ width: 40, padding: '10px 16px', textAlign: 'left' }}>
                <Checkbox checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={v => setSelected(v ? new Set(filtered.map(l => l.id)) : new Set())} />
              </th>
              {columns.map(c => (
                <th key={c.key} style={{ padding: '10px 16px', textAlign: c.align || 'left',
                                          fontSize: 11, fontWeight: 600, color: '#64748B',
                                          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <CrmRow key={r.id} row={r} columns={columns} checked={selected.has(r.id)}
                onCheck={v => { const s = new Set(selected); v ? s.add(r.id) : s.delete(r.id); setSelected(s); }} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Natija yo'q</div>
        )}
        <div style={{ padding: '10px 16px', borderTop: '1px solid #F1F5F9' }}>
          <Pagination page={page} total={6} onChange={setPage} totalRows={248} />
        </div>
      </Card>
    </>
  );
};

const CrmRow = ({ row, columns, checked, onCheck }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <tr onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: hover ? '#F8FAFB' : '#fff', cursor: 'pointer', transition: 'background 120ms ease' }}>
      <td style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9' }} onClick={e => e.stopPropagation()}>
        <Checkbox checked={checked} onChange={onCheck} />
      </td>
      {columns.map(c => (
        <td key={c.key} style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9',
                                  fontSize: 13, color: '#334155', textAlign: c.align || 'left' }}>
          {c.render ? c.render(row) : row[c.key]}
        </td>
      ))}
    </tr>
  );
};

// Kanban board with drag-and-drop
const CrmKanbanPage = () => {
  const stages = [
    { id: 'Yangi', label: 'Yangi', color: '#3B82F6', bg: '#EFF6FF' },
    { id: 'Qo\'ng\'iroq', label: 'Qo\'ng\'iroq', color: '#F59E0B', bg: '#FFFBEB' },
    { id: 'Kutilmoqda', label: 'Hujjat kutilmoqda', color: '#64748B', bg: '#F1F5F9' },
    { id: 'Qabul', label: 'Qabul qilindi', color: '#2DB976', bg: '#ECFDF5' },
    { id: 'Rad', label: 'Rad etildi', color: '#EF4444', bg: '#FEF2F2' },
  ];

  const [cards, setCards] = React.useState(() => LEADS.map(l => ({ ...l })));
  const [draggingId, setDraggingId] = React.useState(null);
  const [overStage, setOverStage] = React.useState(null);

  const byStage = stages.map(s => ({ ...s, cards: cards.filter(c => c.status === s.id) }));

  const onDrop = (stageId) => {
    if (draggingId) {
      setCards(cs => cs.map(c => c.id === draggingId ? { ...c, status: stageId } : c));
    }
    setDraggingId(null);
    setOverStage(null);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', padding: 3, borderRadius: 10, border: '1px solid #E2E8F0' }}>
          <button style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                           background: '#F1F5F9', color: '#475569',
                           fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                           display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="grid" size={14} /> Ro'yxat
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 8, border: 'none',
                           background: '#2DB976', color: '#fff',
                           fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                           display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="chart" size={14} /> Voronka
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="secondary" size="sm" icon="filter">Filtr</Button>
        <Button variant="primary" size="sm" icon="plus">Yangi ariza</Button>
      </div>

      <div className="table-scroll" style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length},1fr)`, gap: 14,
                     overflowX: 'auto', paddingBottom: 20 }}>
        {byStage.map(stage => (
          <div key={stage.id}
            onDragOver={e => { e.preventDefault(); setOverStage(stage.id); }}
            onDrop={() => onDrop(stage.id)}
            style={{
              background: overStage === stage.id ? stage.bg : '#F8FAFB',
              borderRadius: 14, padding: 12, minHeight: 420, transition: 'background 150ms ease',
              border: overStage === stage.id ? `2px dashed ${stage.color}` : '2px dashed transparent',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: stage.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{stage.label}</span>
                <span style={{ fontSize: 11, color: '#64748B', background: '#fff', padding: '2px 7px', borderRadius: 999, fontWeight: 500 }}>
                  {stage.cards.length}
                </span>
              </div>
              <IconButton icon="more" label="Amallar" size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stage.cards.map(c => (
                <KanbanCard key={c.id} card={c} stage={stage}
                  dragging={draggingId === c.id}
                  onDragStart={() => setDraggingId(c.id)}
                  onDragEnd={() => { setDraggingId(null); setOverStage(null); }} />
              ))}
              <button style={{ padding: '10px', borderRadius: 10, border: '1px dashed #CBD5E1',
                               background: 'transparent', color: '#64748B', fontSize: 12,
                               cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center',
                               fontFamily: 'inherit' }}>
                <Icon name="plus" size={14} /> Ariza qo'shish
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const KanbanCard = ({ card, stage, dragging, onDragStart, onDragEnd }) => (
  <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
    style={{
      background: '#fff', borderRadius: 10, padding: 12,
      boxShadow: dragging ? '0 8px 16px rgba(0,0,0,.12)' : '0 1px 2px rgba(0,0,0,.05)',
      border: '1px solid #E2E8F0',
      cursor: 'grab', opacity: dragging ? 0.5 : 1,
      transform: dragging ? 'rotate(-1deg)' : 'none',
      transition: 'box-shadow 150ms ease',
    }}>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials={card.name.initials} size={30} color={card.name.isFemale ? 'amber' : 'blue'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{card.name.short}</div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{card.phone}</div>
      </div>
    </div>
    <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <Badge variant="neutral">{card.direction}</Badge>
      <Badge variant={card.source === 'Telegram' ? 'info' : card.source === 'Website' ? 'success' : 'warning'}>{card.source}</Badge>
    </div>
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: 11, color: '#64748B' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={11} /> {card.date}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="user" size={11} /> {card.assignee}</span>
    </div>
  </div>
);

Object.assign(window, { CrmListPage, CrmKanbanPage });
