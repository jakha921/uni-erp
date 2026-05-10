// TablePieces.jsx — tables, pagination, filters, tabs

const DataTable = ({ columns, rows, selectable = true, onRowClick, selected, onSelect, loading, empty, emptyIllustration = 'table', emptyTitle, emptyHint, emptyAction }) => {
  const [sortKey, setSortKey] = React.useState(null);

  if (loading) return <Card padding={0}><SkeletonTable rows={6} cols={columns.length} /></Card>;

  if (empty || (rows && rows.length === 0)) {
    return (
      <Card padding={0}>
        <EmptyState
          illustration={emptyIllustration}
          title={emptyTitle || "Ma'lumot topilmadi"}
          hint={emptyHint || "Hozircha bu yerda hech narsa yo'q"}
          action={emptyAction}
        />
      </Card>
    );
  }

  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <div className="table-scroll">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F1F5F9' }}>
              {selectable && (
                <th style={{ width: 48, padding: '12px 16px', textAlign: 'left' }}>
                  <Checkbox checked={selected?.size === rows.length && rows.length > 0}
                    onChange={(v) => onSelect?.(v ? new Set(rows.map((_, i) => i)) : new Set())} />
                </th>
              )}
              {columns.map((c) => (
                <th key={c.key} style={{
                  padding: '12px 16px', textAlign: c.align || 'left',
                  fontSize: 11, fontWeight: 600, color: '#64748B',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  cursor: c.sortable ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                }} onClick={() => c.sortable && setSortKey(c.key)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {c.label}
                    {c.sortable && <Icon name="chevronDown" size={12} style={{ color: sortKey === c.key ? '#2DB976' : '#94A3B8' }} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <TableRow key={i} row={row} columns={columns} selectable={selectable}
                checked={selected?.has(i)}
                onCheck={(v) => {
                  const s = new Set(selected);
                  v ? s.add(i) : s.delete(i);
                  onSelect?.(s);
                }}
                onClick={() => onRowClick?.(row, i)} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const TableRow = ({ row, columns, selectable, checked, onCheck, onClick }) => (
  <tr
    className="row-hover"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}>
    {selectable && (
      <td style={{ padding: '14px 16px', borderTop: '1px solid #F1F5F9' }} onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={checked} onChange={onCheck} />
      </td>
    )}
    {columns.map((c) => (
      <td key={c.key} style={{
        padding: '14px 16px', borderTop: '1px solid #F1F5F9',
        fontSize: 14, color: '#334155', textAlign: c.align || 'left',
        fontVariantNumeric: c.align === 'right' ? 'tabular-nums' : 'normal',
      }}>
        {c.render ? c.render(row) : row[c.key]}
      </td>
    ))}
  </tr>
);

const Pagination = ({ page = 1, total = 16, onChange, pageSize = 10, totalRows = 650 }) => {
  const pages = [];
  for (let i = 1; i <= Math.min(total, 5); i++) pages.push(i);
  if (total > 5) { pages.push('…'); pages.push(total); }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 4px', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748B' }}>
        <span>Show</span>
        <select defaultValue={pageSize} style={{ height: 32, padding: '0 28px 0 10px', appearance: 'none', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
          <option>10</option><option>25</option><option>50</option>
        </select>
        <span>of {totalRows.toLocaleString()} results</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <PageBtn onClick={() => onChange?.(Math.max(1, page - 1))}><Icon name="arrowLeft" size={14} /></PageBtn>
        <span className="page-numbers" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {pages.map((p, i) =>
            p === '…'
              ? <span key={i} style={{ color: '#94A3B8', padding: '0 4px' }}>…</span>
              : <PageBtn key={i} active={p === page} onClick={() => onChange?.(p)}>{p}</PageBtn>
          )}
        </span>
        <PageBtn onClick={() => onChange?.(Math.min(total, page + 1))}><Icon name="arrowRight" size={14} /></PageBtn>
      </div>
    </div>
  );
};

const PageBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} className="icon-btn-hover"
    style={{ width: 32, height: 32, borderRadius: 8, border: 'none',
             background: active ? '#2DB976' : 'transparent',
             color: active ? '#fff' : '#475569', fontSize: 13, fontWeight: active ? 600 : 400,
             cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </button>
);

const FilterBar = ({ chips = [], onRemoveChip, sort, onSortChange, right, left }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
    {left}
    <Button variant="secondary" icon="filter" size="md">Filter</Button>
    {chips.map((c, i) => (
      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '6px 10px', borderRadius: 9999,
                              background: '#D1FAE5', color: '#1B7A4E',
                              fontSize: 12, fontWeight: 500 }}>
        {c}
        <button onClick={() => onRemoveChip?.(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1B7A4E', padding: 0, display: 'inline-flex' }}>
          <Icon name="x" size={12} />
        </button>
      </span>
    ))}
    <div style={{ flex: 1 }} />
    {sort && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B' }}>
        <span>Sort by:</span>
        <select value={sort} onChange={(e) => onSortChange?.(e.target.value)}
          style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit' }}>
          <option>Name A–Z</option><option>Recent</option><option>Department</option>
        </select>
      </div>
    )}
    {right}
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div className="tabs-scroll" style={{ display: 'flex', gap: 24, borderBottom: '1px solid #E2E8F0', marginBottom: 24 }}>
    {tabs.map((t) => {
      const isActive = t.id === active;
      return (
        <button key={t.id} onClick={() => onChange?.(t.id)}
          style={{ padding: '12px 2px', background: 'transparent', border: 'none',
                   borderBottom: `2px solid ${isActive ? '#2DB976' : 'transparent'}`,
                   marginBottom: -1, fontSize: 14, fontFamily: 'inherit',
                   color: isActive ? '#2DB976' : '#64748B',
                   fontWeight: isActive ? 600 : 400, cursor: 'pointer',
                   display: 'inline-flex', alignItems: 'center', gap: 8,
                   whiteSpace: 'nowrap', flexShrink: 0 }}>
          {t.label}
          {t.count != null && (
            <span style={{ background: isActive ? '#D1FAE5' : '#F1F5F9',
                           color: isActive ? '#1B7A4E' : '#475569',
                           padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 500 }}>
              {t.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

Object.assign(window, { DataTable, TableRow, Pagination, PageBtn, FilterBar, Tabs });
