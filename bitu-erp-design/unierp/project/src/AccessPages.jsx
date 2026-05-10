// AccessPages.jsx — Foydalanuvchilar va Rollar (User & Roles management)
// Pages: UsersListPage, UserProfilePage, RolesPage, PermissionMatrixPage, AuditLogPage, RoleSelectPage

// ---------- shared bits ----------
const _accentByRole = (roleId) => (window.ROLES || []).find(r => r.id === roleId)?.color || '#94A3B8';

const RoleChip = ({ roleId, size = 'sm' }) => {
  const r = (window.ROLES || []).find(x => x.id === roleId);
  if (!r) return null;
  const padY = size === 'md' ? 5 : 3;
  const padX = size === 'md' ? 10 : 8;
  const fs = size === 'md' ? 12.5 : 11.5;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: `${padY}px ${padX}px`,
      borderRadius: 999, background: r.color + '15', color: r.color,
      fontSize: fs, fontWeight: 600, whiteSpace: 'nowrap', border: `1px solid ${r.color}30`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: r.color }} />
      {r.name}
    </span>
  );
};

const StatusDot = ({ status }) => {
  const m = {
    'Faol':              { bg: '#ECFDF5', fg: '#047857', dot: '#10B981' },
    'Bloklangan':        { bg: '#FEF2F2', fg: '#B91C1C', dot: '#EF4444' },
    'Taklif yuborilgan': { bg: '#EFF6FF', fg: '#1D4ED8', dot: '#3B82F6' },
    'Pauza':             { bg: '#FFFBEB', fg: '#B45309', dot: '#F59E0B' },
  }[status] || { bg: '#F1F5F9', fg: '#475569', dot: '#94A3B8' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
                   borderRadius: 999, background: m.bg, color: m.fg,
                   fontSize: 12, fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: m.dot }} />
      {status}
    </span>
  );
};

// ============================================================
// 1) USERS LIST
// ============================================================
const UsersListPage = ({ onOpen }) => {
  const users = window.USERS || [];
  const [q, setQ] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(new Set());

  const filtered = users.filter(u => {
    if (q && !`${u.name.full} ${u.login} ${u.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (roleFilter !== 'all' && !u.roles.includes(roleFilter)) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (branchFilter !== 'all' && u.branch !== branchFilter) return false;
    return true;
  });

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const allSelected = filtered.length > 0 && filtered.every(u => selected.has(u.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(u => u.id)));
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Faol').length,
    blocked: users.filter(u => u.status === 'Bloklangan').length,
    twoFa: users.filter(u => u.twoFa).length,
    online: users.filter(u => u.lastLoginDays === 0).length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* KPI strip */}
      <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { l: 'Jami foydalanuvchi', v: stats.total, sub: '+3 oyiga', col: '#2DB976', icon: 'users' },
          { l: 'Faol', v: stats.active, sub: `${stats.online} ta hozir online`, col: '#10B981', icon: 'check' },
          { l: 'Bloklangan', v: stats.blocked, sub: 'Xavfsizlik holati', col: '#EF4444', icon: 'shield' },
          { l: '2FA yoqilgan', v: `${stats.twoFa}/${stats.total}`, sub: `${Math.round(stats.twoFa/stats.total*100)}%`, col: '#8B5CF6', icon: 'shield' },
          { l: 'Ruxsat berishlar', v: '847', sub: 'Bu oyda', col: '#F59E0B', icon: 'doc' },
        ].map((s, i) => (
          <Card key={i} padding={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{s.l}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>{s.sub}</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: s.col + '15', color: s.col,
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.icon === 'shield' ? 'check' : s.icon} size={16} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters + table */}
      <Card padding={0}>
        {/* Filter bar */}
        <div style={{ padding: 16, borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 240 }}>
            <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ism, login yoki email bo'yicha qidirish..."
              style={{ width: '100%', height: 38, padding: '0 12px 0 36px', border: '1px solid #E2E8F0',
                       borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit' }} />
          </div>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}
            style={{ height: 38, padding: '0 28px 0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
            <option value="all">Barcha rollar</option>
            {(window.ROLES || []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
            style={{ height: 38, padding: '0 28px 0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
            <option value="all">Barcha statuslar</option>
            {(window.USER_STATUSES || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={branchFilter} onChange={e=>setBranchFilter(e.target.value)}
            style={{ height: 38, padding: '0 28px 0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
            <option value="all">Barcha filiallar</option>
            {(window.USER_BRANCHES || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="secondary" icon="filter" size="sm">Qo'shimcha</Button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Button variant="secondary" icon="upload" size="sm">CSV import</Button>
            <Button variant="primary" icon="plus" size="sm">Foydalanuvchi qo'shish</Button>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div style={{ padding: '10px 16px', background: '#F0FDF4', borderBottom: '1px solid #DCFCE7',
                        display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>{selected.size} ta tanlandi</div>
            <div style={{ flex: 1 }} />
            <button style={_bulkBtn}><Icon name="mail" size={13} /> Email yuborish</button>
            <button style={_bulkBtn}><Icon name="check" size={13} /> Aktivlashtirish</button>
            <button style={{ ..._bulkBtn, color: '#B91C1C' }}><Icon name="x" size={13} /> Bloklash</button>
            <button style={_bulkBtn}><Icon name="doc" size={13} /> Eksport</button>
            <button onClick={() => setSelected(new Set())}
              style={{ ..._bulkBtn, marginLeft: 4, background: 'transparent' }}>Bekor qilish</button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ ..._th, width: 40, paddingLeft: 16 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll}
                    style={{ accentColor: '#2DB976' }} />
                </th>
                <th style={_th}>Foydalanuvchi</th>
                <th style={_th}>Rollar</th>
                <th style={_th}>Filial / Bo'lim</th>
                <th style={_th}>Status</th>
                <th style={_th}>2FA</th>
                <th style={_th}>So'nggi kirish</th>
                <th style={{ ..._th, width: 90 }}>Sessiya</th>
                <th style={{ ..._th, width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr key={u.id} className="row-hover" style={{ borderTop: '1px solid #F1F5F9',
                                         background: selected.has(u.id) ? '#F0FDF4' : 'transparent',
                                         cursor: 'pointer' }}
                    onClick={() => onOpen?.(u)}>
                  <td style={{ ..._td, paddingLeft: 16 }} onClick={(e) => { e.stopPropagation(); toggle(u.id); }}>
                    <input type="checkbox" checked={selected.has(u.id)} onChange={() => {}}
                      style={{ accentColor: '#2DB976' }} />
                  </td>
                  <td style={_td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar initials={u.name.initials} size={36} color={(idx % 5 === 0) ? 'amber' : (idx % 3 === 0) ? 'blue' : 'primary'} status={u.lastLoginDays === 0 ? 'online' : null} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{u.name.full}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 1, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>@{u.login}</div>
                      </div>
                    </div>
                  </td>
                  <td style={_td}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {u.roles.slice(0, 2).map(rid => <RoleChip key={rid} roleId={rid} />)}
                      {u.roles.length > 2 && (
                        <span style={{ fontSize: 11.5, color: '#64748B', alignSelf: 'center', fontWeight: 500 }}>+{u.roles.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td style={_td}>
                    <div style={{ fontSize: 12.5, color: '#334155' }}>{u.branch}</div>
                    <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 1 }}>{u.department.replace(' kafedrasi','')}</div>
                  </td>
                  <td style={_td}><StatusDot status={u.status} /></td>
                  <td style={_td}>
                    {u.twoFa ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#047857', fontWeight: 600 }}>
                        <Icon name="check" size={14} />Yoqilgan
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>—</div>
                    )}
                  </td>
                  <td style={_td}>
                    <div style={{ fontSize: 12.5, color: u.lastLoginDays === 0 ? '#047857' : '#475569', fontWeight: u.lastLoginDays === 0 ? 600 : 400 }}>
                      {u.lastLogin}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{u.id}</div>
                  </td>
                  <td style={_td}>
                    {u.sessions > 0 ? (
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{u.sessions}</span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#CBD5E1' }}>0</span>
                    )}
                  </td>
                  <td style={_td}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: '#94A3B8' }}
                      onClick={(e) => e.stopPropagation()}>
                      <Icon name="more" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid #F1F5F9',
                      display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#64748B' }}>
          <div>1—{filtered.length} of {users.length} foydalanuvchi</div>
          <div style={{ flex: 1 }} />
          <button style={_pgBtn} disabled><Icon name="arrowLeft" size={14} /></button>
          <button style={{ ..._pgBtn, background: '#2DB976', color: '#fff', border: 'none' }}>1</button>
          <button style={_pgBtn}>2</button>
          <button style={_pgBtn}><Icon name="arrowRight" size={14} /></button>
        </div>
      </Card>
    </div>
  );
};

const _th = { textAlign: 'left', padding: '12px 14px', fontSize: 11.5, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E2E8F0' };
const _td = { padding: '12px 14px', fontSize: 13, color: '#334155', verticalAlign: 'middle' };
const _bulkBtn = { padding: '6px 12px', borderRadius: 6, border: '1px solid #BBF7D0', background: '#fff', color: '#166534', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 };
const _pgBtn = { width: 32, height: 32, borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' };

// ============================================================
// 2) USER PROFILE + role assignment
// ============================================================
const UserProfilePage = ({ user, onBack }) => {
  const u = user || (window.USERS || [])[0];
  const [tab, setTab] = React.useState('roles');
  const [userRoles, setUserRoles] = React.useState(u.roles);
  const [showAssign, setShowAssign] = React.useState(false);

  const removeRole = (rid) => setUserRoles(prev => prev.filter(r => r !== rid));
  const addRole = (rid) => { setUserRoles(prev => prev.includes(rid) ? prev : [...prev, rid]); setShowAssign(false); };

  // sessions mock
  const sessions = [
    { id: 1, device: 'MacBook Pro · Chrome 124', location: 'Navoiy, O\'zbekiston', ip: '10.10.42.18', when: 'Hozir', current: true },
    { id: 2, device: 'iPhone 14 · Safari Mobile', location: 'Navoiy, O\'zbekiston', ip: '213.230.94.211', when: '2 soat oldin', current: false },
    { id: 3, device: 'Windows 11 · Edge 124', location: 'Toshkent, O\'zbekiston', ip: '213.230.142.18', when: '3 kun oldin', current: false },
  ];

  // recent activity
  const activity = (window.AUDIT_LOG || []).slice(0, 8).map((a, i) => ({ ...a, actor: u, when: ['hozir', '5 daqiqa oldin', '32 daqiqa oldin', '1 soat oldin', '3 soat oldin', 'kecha 18:42', 'kecha 14:20', '2 kun oldin'][i] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Back + identity header */}
      <button onClick={onBack}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6,
                 background: 'transparent', border: 'none', color: '#64748B', fontSize: 13,
                 cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        <Icon name="arrowLeft" size={14} /> Foydalanuvchilar ro'yxati
      </button>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        {/* gradient hero */}
        <div style={{ height: 90, background: 'linear-gradient(135deg, #2DB976 0%, #1B7A4E 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, right: 18, display: 'flex', gap: 8 }}>
            <button style={_heroBtn}>
              <Icon name="mail" size={13} /> Email
            </button>
            <button style={_heroBtn}>
              <Icon name="phone" size={13} /> Qo'ng'iroq
            </button>
            <button style={{ ..._heroBtn, color: '#B91C1C' }}>
              <Icon name="x" size={13} /> Bloklash
            </button>
          </div>
        </div>
        <div style={{ padding: '0 32px 24px', marginTop: -36, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <div style={{ width: 92, height: 92, borderRadius: '50%', background: '#D1FAE5', color: '#1B7A4E',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 32, fontWeight: 700, border: '4px solid #fff',
                          boxShadow: '0 4px 14px rgba(0,0,0,.1)' }}>
              {u.name.initials}
            </div>
            <div style={{ flex: 1, marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>{u.name.full}</h2>
                <StatusDot status={u.status} />
                {u.twoFa && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 99, background: '#F3E8FF', color: '#7E22CE', fontSize: 11.5, fontWeight: 600 }}>
                    <Icon name="check" size={11} />2FA
                  </span>
                )}
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#64748B', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>@{u.login}</span>
                <span>·</span>
                <span>{u.email}</span>
                <span>·</span>
                <span>{u.phone}</span>
                <span>·</span>
                <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", color: '#94A3B8' }}>{u.id}</span>
              </div>
            </div>
          </div>

          {/* quick stats row */}
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 22 }}>
            {[
              { l: 'Filial', v: u.branch.replace(' filiali','').replace(' (bosh)','') + (u.branch.includes('bosh') ? ' (bosh)' : '') },
              { l: 'Bo\'lim', v: u.department.replace(' kafedrasi', ' kaf.') },
              { l: 'Yaratilgan', v: u.createdAt },
              { l: 'So\'nggi kirish', v: u.lastLogin },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{s.l}</div>
                <div style={{ fontSize: 13.5, color: '#0F172A', marginTop: 4, fontWeight: 500 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card padding={0}>
        <div style={{ borderBottom: '1px solid #F1F5F9', padding: '0 8px', display: 'flex', gap: 0 }}>
          {[
            { v: 'roles', l: 'Rollar va ruxsatlar', n: userRoles.length, icon: 'shield' },
            { v: 'security', l: 'Xavfsizlik', icon: 'check' },
            { v: 'sessions', l: 'Aktiv sessiyalar', n: sessions.length, icon: 'user' },
            { v: 'activity', l: 'Faollik tarixi', icon: 'chart' },
          ].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 18px',
                       background: 'transparent', border: 'none', cursor: 'pointer',
                       borderBottom: `2px solid ${tab === t.v ? '#2DB976' : 'transparent'}`,
                       marginBottom: -1, fontSize: 13.5, fontFamily: 'inherit',
                       color: tab === t.v ? '#0F172A' : '#64748B',
                       fontWeight: tab === t.v ? 600 : 500 }}>
              <Icon name={t.icon} size={15} /> {t.l}
              {t.n != null && (
                <span style={{ padding: '1px 8px', borderRadius: 99, background: tab === t.v ? '#D1FAE5' : '#F1F5F9',
                               color: tab === t.v ? '#047857' : '#64748B', fontSize: 11, fontWeight: 600 }}>{t.n}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {tab === 'roles' && (
            <UserRolesTab user={u} userRoles={userRoles} removeRole={removeRole} addRole={addRole} showAssign={showAssign} setShowAssign={setShowAssign} />
          )}
          {tab === 'security' && <UserSecurityTab user={u} />}
          {tab === 'sessions' && <UserSessionsTab sessions={sessions} />}
          {tab === 'activity' && <UserActivityTab activity={activity} />}
        </div>
      </Card>
    </div>
  );
};

const _heroBtn = {
  padding: '6px 12px', borderRadius: 6, background: '#fff', color: '#0F172A',
  border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
  fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
  boxShadow: '0 1px 3px rgba(0,0,0,.08)',
};

const UserRolesTab = ({ user, userRoles, removeRole, addRole, showAssign, setShowAssign }) => {
  const ROLES = window.ROLES || [];
  const ALL_MODULES = window.ALL_MODULES || [];
  const PERM_MATRIX = window.PERM_MATRIX || {};
  const PERM_VERBS = window.PERM_VERBS || [];

  // Effective permissions = union of all assigned roles' grants
  const effective = {};
  for (const rid of userRoles) {
    const m = PERM_MATRIX[rid] || {};
    for (const modId of Object.keys(m)) {
      effective[modId] = [...new Set([...(effective[modId] || []), ...m[modId]])];
    }
  }
  const totalPerms = Object.values(effective).flat().length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
      {/* Left: roles + effective perms */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Biriktirilgan rollar</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>{userRoles.length} ta rol · {totalPerms} ta jami ruxsat</div>
          </div>
          <button onClick={() => setShowAssign(!showAssign)}
            style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#2DB976', color: '#fff',
                     fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                     display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="plus" size={14} /> Rol biriktirish
          </button>
        </div>

        {/* Assign popover */}
        {showAssign && (
          <div style={{ padding: 12, background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>QO'SHISH UCHUN ROLNI TANLANG</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ROLES.filter(r => !userRoles.includes(r.id)).map(r => (
                <button key={r.id} onClick={() => addRole(r.id)}
                  style={{ padding: '6px 12px', borderRadius: 99, border: `1px solid ${r.color}40`,
                           background: r.color + '10', color: r.color, fontSize: 12.5, fontWeight: 600,
                           cursor: 'pointer', fontFamily: 'inherit',
                           display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="plus" size={12} /> {r.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Assigned role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {userRoles.map(rid => {
            const r = ROLES.find(x => x.id === rid);
            if (!r) return null;
            const perms = PERM_MATRIX[rid] || {};
            const modCount = Object.keys(perms).length;
            return (
              <div key={rid} style={{ padding: 16, border: `1px solid ${r.color}30`, borderRadius: 12,
                                       background: r.color + '08' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: r.color, color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="check" size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{r.name}</div>
                      {r.system ? (
                        <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 99, background: '#F1F5F9', color: '#64748B', fontWeight: 600 }}>SYSTEM</span>
                      ) : (
                        <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 99, background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>CUSTOM</span>
                      )}
                      {r.scope && (
                        <span style={{ fontSize: 11, color: '#64748B' }}>· Scope: <b>{r.scope}</b></span>
                      )}
                    </div>
                    <div style={{ fontSize: 12.5, color: '#475569', marginTop: 4, lineHeight: 1.45 }}>{r.desc}</div>
                    <div style={{ marginTop: 8, fontSize: 11.5, color: '#64748B', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                      {modCount} ta modul · level {r.level}
                    </div>
                  </div>
                  <button onClick={() => removeRole(rid)}
                    style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #FECACA',
                             background: '#fff', color: '#B91C1C', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                             fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="x" size={12} /> Olib tashlash
                  </button>
                </div>
              </div>
            );
          })}
          {userRoles.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 12, color: '#64748B', fontSize: 13 }}>
              Foydalanuvchiga hech qanday rol biriktirilmagan. Rol biriktirish uchun "+ Rol biriktirish" tugmasini bosing.
            </div>
          )}
        </div>
      </div>

      {/* Right: Effective permissions summary */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Effektiv ruxsatlar</div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>Barcha rollar yig'indisi</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 480, overflowY: 'auto', paddingRight: 4 }}>
          {ALL_MODULES.map(mod => {
            const verbs = effective[mod.id] || [];
            const has = verbs.length > 0;
            return (
              <div key={mod.id} style={{
                padding: '10px 12px', borderRadius: 8,
                background: has ? '#F0FDF4' : '#F8FAFC',
                border: `1px solid ${has ? '#BBF7D0' : '#F1F5F9'}`,
                display: 'flex', alignItems: 'center', gap: 10,
                opacity: has ? 1 : 0.55,
              }}>
                <div style={{ fontSize: 13, color: has ? '#0F172A' : '#94A3B8', fontWeight: has ? 500 : 400, flex: 1, minWidth: 0 }}>
                  {mod.name}
                </div>
                {has ? (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {PERM_VERBS.map(v => (
                      verbs.includes(v.id) ? (
                        <span key={v.id} title={v.label} style={{
                          width: 22, height: 22, borderRadius: 5, fontSize: 10.5, fontWeight: 700,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          background: v.color + '20', color: v.color,
                        }}>{v.short}</span>
                      ) : null
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: '#CBD5E1' }}>—</span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, padding: 12, background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Ruxsat turlari</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PERM_VERBS.map(v => (
              <div key={v.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#475569' }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: v.color + '20', color: v.color }}>{v.short}</span>
                {v.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserSecurityTab = ({ user }) => {
  const u = user;
  const items = [
    { icon: 'check', title: 'Ikki bosqichli autentifikatsiya (2FA)', desc: u.twoFa ? 'Authenticator ilovasi orqali yoqilgan' : 'O\'chiq — yoqishni tavsiya qilamiz', enabled: u.twoFa, action: u.twoFa ? 'O\'chirish' : 'Yoqish' },
    { icon: 'shield', title: 'Parolni majburan o\'zgartirish', desc: 'So\'nggi marta 47 kun oldin o\'zgartirilgan', enabled: false, action: 'Tiklash' },
    { icon: 'mail', title: 'Email tasdiqlash', desc: u.email + ' — tasdiqlangan', enabled: true, action: 'Qayta yuborish' },
    { icon: 'phone', title: 'Telefon raqami', desc: u.phone + ' — tasdiqlangan', enabled: true, action: 'O\'zgartirish' },
    { icon: 'x', title: 'Hisobni bloklash', desc: u.failedAttempts > 0 ? `${u.failedAttempts} ta muvaffaqiyatsiz urinish` : 'Hech qanday muammo yo\'q', enabled: false, danger: true, action: u.status === 'Bloklangan' ? 'Blokdan chiqarish' : 'Bloklash' },
    { icon: 'trash', title: 'Foydalanuvchini o\'chirish', desc: 'Barcha ma\'lumotlar arxivga ko\'chiriladi va 30 kun saqlanadi', danger: true, action: 'O\'chirish' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 760 }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: 16, background: it.danger ? '#FFFBFB' : '#F8FAFC',
                              border: `1px solid ${it.danger ? '#FEE2E2' : '#F1F5F9'}`,
                              borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10,
                        background: it.danger ? '#FEE2E2' : (it.enabled ? '#D1FAE5' : '#F1F5F9'),
                        color: it.danger ? '#B91C1C' : (it.enabled ? '#047857' : '#64748B'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={it.icon} size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{it.title}</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>{it.desc}</div>
          </div>
          <button style={{ padding: '7px 14px', borderRadius: 8,
                           border: it.danger ? '1px solid #FECACA' : '1px solid #E2E8F0',
                           background: '#fff', color: it.danger ? '#B91C1C' : '#334155',
                           fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {it.action}
          </button>
        </div>
      ))}
    </div>
  );
};

const UserSessionsTab = ({ sessions }) => (
  <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <div style={{ fontSize: 13, color: '#64748B' }}>Aktiv qurilmalar va sessiyalar</div>
      <button style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #FECACA', background: '#fff', color: '#B91C1C', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
        Barcha boshqa sessiyalardan chiqish
      </button>
    </div>
    {sessions.map(s => (
      <div key={s.id} style={{ padding: 14, background: s.current ? '#F0FDF4' : '#F8FAFC',
                                border: `1px solid ${s.current ? '#BBF7D0' : '#F1F5F9'}`,
                                borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: s.current ? '#D1FAE5' : '#F1F5F9',
                      color: s.current ? '#047857' : '#64748B',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="user" size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{s.device}</div>
            {s.current && (
              <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 99, background: '#10B981', color: '#fff', fontWeight: 600 }}>JORIY</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
            {s.location} · IP <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{s.ip}</span> · {s.when}
          </div>
        </div>
        {!s.current && (
          <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit' }}>
            Sessiyani tugatish
          </button>
        )}
      </div>
    ))}
  </div>
);

const UserActivityTab = ({ activity }) => (
  <div style={{ maxWidth: 760 }}>
    <div style={{ position: 'relative', paddingLeft: 22 }}>
      <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, background: '#F1F5F9' }} />
      {activity.map((a, i) => (
        <div key={i} style={{ position: 'relative', padding: '10px 0' }}>
          <div style={{ position: 'absolute', left: -20, top: 14, width: 14, height: 14, borderRadius: 99,
                        background: '#fff', border: `2px solid ${a.action.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: a.action.color + '15', color: a.action.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={a.action.icon} size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{a.action.label}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{a.desc}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                {a.when} · IP {a.ip} · {a.ua}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// 3) ROLES MANAGEMENT
// ============================================================
const RolesPage = ({ onOpenMatrix }) => {
  const ROLES = window.ROLES || [];
  const PERM_MATRIX = window.PERM_MATRIX || {};
  const ALL_MODULES = window.ALL_MODULES || [];
  const [filter, setFilter] = React.useState('all'); // all, system, custom
  const [selected, setSelected] = React.useState('rector');

  const list = ROLES.filter(r => filter === 'all' || (filter === 'system' ? r.system : !r.system));
  const sel = ROLES.find(r => r.id === selected) || ROLES[0];
  const selPerms = PERM_MATRIX[sel.id] || {};
  const selPermCount = Object.values(selPerms).flat().length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top bar */}
      <Card padding={16} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>Rollar va ruxsat sxemalari</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{ROLES.length} ta rol · {ROLES.filter(r=>!r.system).length} ta custom · {ROLES.reduce((s,r)=>s+r.users,0).toLocaleString('ru-RU')} ta foydalanuvchi</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
          {[{v:'all',l:'Barchasi'},{v:'system',l:'System'},{v:'custom',l:'Custom'}].map(o=>(
            <button key={o.v} onClick={()=>setFilter(o.v)}
              style={{ padding: '6px 12px', borderRadius: 6, border: 'none',
                       background: filter === o.v ? '#fff' : 'transparent',
                       color: filter === o.v ? '#0F172A' : '#64748B',
                       fontSize: 12.5, fontWeight: filter === o.v ? 600 : 500,
                       cursor: 'pointer', fontFamily: 'inherit',
                       boxShadow: filter === o.v ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>{o.l}</button>
          ))}
        </div>
        <Button variant="secondary" icon="chart" size="sm" onClick={() => onOpenMatrix?.()}>Permission Matrix</Button>
        <Button variant="primary" icon="plus" size="sm">Yangi rol</Button>
      </Card>

      {/* Layout: list + detail */}
      <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 16, alignItems: 'flex-start' }}>
        {/* Role grid */}
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {list.map(r => {
            const perms = PERM_MATRIX[r.id] || {};
            const modCount = Object.keys(perms).length;
            const isSel = r.id === selected;
            return (
              <div key={r.id} className="hover-lift" onClick={() => setSelected(r.id)}
                style={{ padding: 16, borderRadius: 12, cursor: 'pointer',
                         background: '#fff',
                         border: `2px solid ${isSel ? r.color : '#F1F5F9'}`,
                         boxShadow: isSel ? `0 0 0 4px ${r.color}15` : '0 1px 3px rgba(0,0,0,.04)',
                         transition: 'all 150ms ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: r.color + '15', color: r.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="check" size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{r.name}</div>
                      {!r.system && (
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>CUSTOM</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 1.4,
                                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.desc}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="users" size={13} style={{ color: '#94A3B8' }} />
                    <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {r.users.toLocaleString('ru-RU')}
                    </span>
                    <span style={{ fontSize: 11.5, color: '#94A3B8' }}>foyd.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="grid" size={13} style={{ color: '#94A3B8' }} />
                    <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 600 }}>{modCount}</span>
                    <span style={{ fontSize: 11.5, color: '#94A3B8' }}>modul</span>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600 }}>LVL</span>
                    <span style={{ fontSize: 12.5, color: r.color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.level}</span>
                  </div>
                </div>
                {/* mini bar */}
                <div style={{ marginTop: 10, height: 4, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, modCount/ALL_MODULES.length*100)}%`, background: r.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected role detail */}
        <Card padding={0} style={{ position: 'sticky', top: 16 }}>
          <div style={{ padding: 20, borderBottom: '1px solid #F1F5F9',
                        background: `linear-gradient(135deg, ${sel.color}10 0%, transparent 60%)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: sel.color, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                {sel.name.slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{sel.name}</div>
                  <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 99,
                                 background: sel.system ? '#F1F5F9' : '#FEF3C7',
                                 color: sel.system ? '#64748B' : '#92400E', fontWeight: 600 }}>
                    {sel.system ? 'SYSTEM' : 'CUSTOM'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
                  {sel.users.toLocaleString('ru-RU')} ta foydalanuvchi · level {sel.level}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 14, lineHeight: 1.5 }}>{sel.desc}</div>
            {sel.scope && (
              <div style={{ marginTop: 10, padding: '6px 10px', borderRadius: 6, background: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
                <Icon name="filter" size={12} /> Scope: <b>{sel.scope}</b>
              </div>
            )}
            {!sel.system && sel.createdBy && (
              <div style={{ marginTop: 10, fontSize: 11.5, color: '#94A3B8' }}>
                {sel.createdAt} sanasida {sel.createdBy} tomonidan yaratilgan
              </div>
            )}
          </div>

          {/* Permission breakdown by module group */}
          <div style={{ padding: 16, maxHeight: 480, overflowY: 'auto' }}>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
              Modul ruxsatlari ({selPermCount} ta jami)
            </div>
            {(window.MODULE_GROUPS || []).map(group => {
              const items = group.modules.filter(m => selPerms[m.id]);
              if (items.length === 0) return null;
              return (
                <div key={group.label} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {group.label}
                  </div>
                  {items.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px dashed #F1F5F9' }}>
                      <div style={{ flex: 1, fontSize: 13, color: '#0F172A' }}>{m.name}</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {(window.PERM_VERBS || []).map(v => (
                          selPerms[m.id].includes(v.id) ? (
                            <span key={v.id} title={v.label} style={{
                              width: 22, height: 22, borderRadius: 5, fontSize: 10.5, fontWeight: 700,
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              background: v.color + '20', color: v.color }}>{v.short}</span>
                          ) : (
                            <span key={v.id} style={{
                              width: 22, height: 22, borderRadius: 5,
                              background: '#F8FAFC', color: '#CBD5E1' }} />
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ padding: 14, borderTop: '1px solid #F1F5F9', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant="secondary" icon="edit" size="sm" disabled={sel.id === 'super-admin'}>Tahrirlash</Button>
            <Button variant="secondary" icon="plus" size="sm">Klonlash</Button>
            <Button variant="secondary" icon="users" size="sm">Foydalanuvchilar</Button>
            <div style={{ flex: 1 }} />
            {!sel.system && (
              <button style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #FECACA', background: '#fff', color: '#B91C1C', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="trash" size={13} /> O'chirish
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// 4) PERMISSION MATRIX
// ============================================================
const PermissionMatrixPage = () => {
  const ROLES = window.ROLES || [];
  const MODULE_GROUPS = window.MODULE_GROUPS || [];
  const PERM_MATRIX = window.PERM_MATRIX || {};
  const PERM_VERBS = window.PERM_VERBS || [];

  const [activeVerb, setActiveVerb] = React.useState('view'); // active verb to display
  const [highlightRole, setHighlightRole] = React.useState(null);
  const [highlightMod, setHighlightMod] = React.useState(null);

  const visibleRoles = ROLES; // all
  const totalCells = visibleRoles.length * (window.ALL_MODULES || []).length;
  const grantedCells = visibleRoles.reduce((s, r) => {
    const m = PERM_MATRIX[r.id] || {};
    return s + Object.values(m).filter(verbs => verbs.includes(activeVerb)).length;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header bar */}
      <Card padding={16}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>Ruxsatlar matritsasi</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              {visibleRoles.length} rol × {(window.ALL_MODULES || []).length} modul · <b>{grantedCells}</b>/{totalCells} qamrov ({Math.round(grantedCells/totalCells*100)}%) — <span style={{ color: PERM_VERBS.find(v=>v.id===activeVerb)?.color }}>{PERM_VERBS.find(v=>v.id===activeVerb)?.label}</span>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
            {PERM_VERBS.map(v => (
              <button key={v.id} onClick={() => setActiveVerb(v.id)}
                style={{ padding: '6px 12px', borderRadius: 6, border: 'none',
                         background: activeVerb === v.id ? v.color : 'transparent',
                         color: activeVerb === v.id ? '#fff' : '#64748B',
                         fontSize: 12, fontWeight: activeVerb === v.id ? 600 : 500,
                         cursor: 'pointer', fontFamily: 'inherit',
                         display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, height: 16, borderRadius: 3, fontSize: 9.5, fontWeight: 700,
                               display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                               background: activeVerb === v.id ? '#ffffff30' : v.color + '20',
                               color: activeVerb === v.id ? '#fff' : v.color }}>{v.short}</span>
                {v.label}
              </button>
            ))}
          </div>
          <Button variant="secondary" icon="doc" size="sm">Eksport CSV</Button>
        </div>
      </Card>

      {/* Matrix grid */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div className="table-scroll" style={{ overflowX: 'auto', overflowY: 'visible' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: '100%' }}>
            <thead>
              <tr>
                <th style={{ position: 'sticky', left: 0, top: 0, zIndex: 3, background: '#fff',
                             borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0',
                             padding: '14px 18px', textAlign: 'left', minWidth: 280 }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modul \ Rol</div>
                </th>
                {visibleRoles.map(r => (
                  <th key={r.id} onMouseEnter={() => setHighlightRole(r.id)} onMouseLeave={() => setHighlightRole(null)}
                    style={{ padding: '12px 6px', borderBottom: '1px solid #E2E8F0',
                             background: highlightRole === r.id ? r.color + '12' : '#fff',
                             minWidth: 88, transition: 'background 120ms ease' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: r.color, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700 }}>
                        {r.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 600, textAlign: 'center', lineHeight: 1.2,
                                    maxWidth: 84, whiteSpace: 'normal' }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                        {r.users.toLocaleString('ru-RU')}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULE_GROUPS.map((group, gi) => (
                <React.Fragment key={group.label}>
                  <tr>
                    <td colSpan={visibleRoles.length + 1}
                      style={{ padding: '10px 18px', background: '#F8FAFC',
                               borderTop: gi > 0 ? '1px solid #E2E8F0' : 'none',
                               borderBottom: '1px solid #E2E8F0',
                               position: 'sticky', left: 0, zIndex: 2,
                               fontSize: 10.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {group.label}
                    </td>
                  </tr>
                  {group.modules.map((mod, mi) => (
                    <tr key={mod.id}
                      onMouseEnter={() => setHighlightMod(mod.id)} onMouseLeave={() => setHighlightMod(null)}>
                      <td style={{ position: 'sticky', left: 0, zIndex: 1,
                                   background: highlightMod === mod.id ? '#F0FDF4' : '#fff',
                                   borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #F1F5F9',
                                   padding: '12px 18px', minWidth: 280, transition: 'background 120ms ease' }}>
                        <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{mod.name}</div>
                        <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2, lineHeight: 1.35 }}>{mod.desc}</div>
                      </td>
                      {visibleRoles.map(r => {
                        const verbs = (PERM_MATRIX[r.id] || {})[mod.id] || [];
                        const has = verbs.includes(activeVerb);
                        const allVerbCount = verbs.length;
                        const verbObj = PERM_VERBS.find(v => v.id === activeVerb);
                        const isHL = highlightRole === r.id || highlightMod === mod.id;
                        return (
                          <td key={r.id}
                            style={{ padding: '8px 6px', borderBottom: '1px solid #F1F5F9',
                                     textAlign: 'center', position: 'relative',
                                     background: has ? (verbObj.color + (isHL ? '22' : '12')) : (isHL ? '#F8FAFC' : '#fff'),
                                     transition: 'background 120ms ease' }}>
                            {has ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '5px 9px', borderRadius: 99,
                                            background: verbObj.color, color: '#fff' }}>
                                <Icon name="check" size={12} stroke={3} />
                                {allVerbCount > 1 && (
                                  <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.9 }}>+{allVerbCount - 1}</span>
                                )}
                              </div>
                            ) : (
                              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: '#E2E8F0' }} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 8px', flexWrap: 'wrap', fontSize: 12, color: '#64748B' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 99, background: PERM_VERBS.find(v=>v.id===activeVerb)?.color, color: '#fff' }}>
            <Icon name="check" size={11} stroke={3} />
          </span>
          Ruxsat berilgan
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: '#E2E8F0' }} />
          Ruxsat yo'q
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ padding: '1px 5px', borderRadius: 4, background: PERM_VERBS.find(v=>v.id===activeVerb)?.color, color: '#fff', fontSize: 10, fontWeight: 700 }}>+N</span>
          Boshqa N ta verb ham mavjud
        </div>
        <div style={{ marginLeft: 'auto' }}>Verb tanlash uchun yuqoridagi tugmalardan foydalaning</div>
      </div>
    </div>
  );
};

// ============================================================
// 5) AUDIT LOG
// ============================================================
const AuditLogPage = () => {
  const log = window.AUDIT_LOG || [];
  const ACTIONS = window.AUDIT_ACTIONS || [];
  const [sevFilter, setSevFilter] = React.useState('all');
  const [kindFilter, setKindFilter] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [openItem, setOpenItem] = React.useState(null);

  const filtered = log.filter(r => {
    if (sevFilter !== 'all' && r.action.sev !== sevFilter) return false;
    if (kindFilter !== 'all' && r.action.kind !== kindFilter) return false;
    if (q) {
      const haystack = `${r.actor.login} ${r.actor.name.full} ${r.desc} ${r.action.label} ${r.ip}`.toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  // group by date
  const grouped = {};
  for (const r of filtered) {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  }
  const dates = Object.keys(grouped);

  const sevCounts = {
    critical: log.filter(r => r.action.sev === 'critical').length,
    warn: log.filter(r => r.action.sev === 'warn').length,
    info: log.filter(r => r.action.sev === 'info').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPI / sev pills */}
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Jami yozuv (24h)', v: log.length, sub: '+12% kechagi kunga', col: '#3B82F6', icon: 'doc' },
          { l: 'Critical', v: sevCounts.critical, sub: 'Diqqatga loyiq', col: '#EF4444', icon: 'shield' },
          { l: 'Ogohlantirish', v: sevCounts.warn, sub: 'Rol/ruxsat o\'zgarishlari', col: '#F59E0B', icon: 'bell' },
          { l: 'Info', v: sevCounts.info, sub: 'Oddiy faollik', col: '#10B981', icon: 'check' },
        ].map((s, i) => (
          <Card key={i} padding={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{s.l}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>{s.sub}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: s.col + '15', color: s.col,
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.icon} size={16} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <Card padding={14} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 240 }}>
          <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Login, IP, harakat yoki tafsilot..."
            style={{ width: '100%', height: 38, padding: '0 12px 0 36px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
          {[
            {v:'all',l:'Barchasi',c:'#64748B'},
            {v:'critical',l:'Critical',c:'#EF4444'},
            {v:'warn',l:'Warn',c:'#F59E0B'},
            {v:'info',l:'Info',c:'#10B981'},
          ].map(o=>(
            <button key={o.v} onClick={()=>setSevFilter(o.v)}
              style={{ padding: '6px 12px', borderRadius: 6, border: 'none',
                       background: sevFilter === o.v ? '#fff' : 'transparent',
                       color: sevFilter === o.v ? o.c : '#64748B',
                       fontSize: 12.5, fontWeight: sevFilter === o.v ? 600 : 500,
                       cursor: 'pointer', fontFamily: 'inherit',
                       boxShadow: sevFilter === o.v ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
                       display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: o.c }} />
              {o.l}
            </button>
          ))}
        </div>
        <select value={kindFilter} onChange={e=>setKindFilter(e.target.value)}
          style={{ height: 38, padding: '0 28px 0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
          <option value="all">Barcha turdagi harakatlar</option>
          {ACTIONS.map(a => <option key={a.kind} value={a.kind}>{a.label}</option>)}
        </select>
        <Button variant="secondary" icon="filter" size="sm">Sana oraliği</Button>
        <Button variant="secondary" icon="doc" size="sm">CSV eksport</Button>
      </Card>

      {/* Layout: timeline + drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: openItem ? '1fr 420px' : '1fr', gap: 16, alignItems: 'flex-start' }}>
        <Card padding={0}>
          {dates.map((d, di) => (
            <div key={d}>
              <div style={{ padding: '10px 18px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9',
                            borderTop: di > 0 ? '1px solid #F1F5F9' : 'none',
                            fontSize: 11.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                            display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 1 }}>
                <Icon name="calendar" size={13} />
                {d} <span style={{ color: '#94A3B8', fontWeight: 500 }}>· {grouped[d].length} ta yozuv</span>
              </div>
              {grouped[d].map((r, i) => {
                const isOpen = openItem?.id === r.id;
                const sevColor = { critical: '#EF4444', warn: '#F59E0B', info: '#10B981' }[r.action.sev];
                return (
                  <div key={r.id} onClick={() => setOpenItem(isOpen ? null : r)}
                    style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9',
                             cursor: 'pointer', background: isOpen ? '#F0FDF4' : '#fff',
                             display: 'flex', alignItems: 'center', gap: 14,
                             borderLeft: `3px solid ${isOpen ? sevColor : 'transparent'}` }}>
                    {/* time */}
                    <div style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                                  minWidth: 64, fontWeight: 500 }}>
                      {r.timestamp}
                    </div>
                    {/* sev dot */}
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: sevColor, flexShrink: 0 }} />
                    {/* icon */}
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: r.action.color + '15', color: r.action.color,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={r.action.icon} size={14} />
                    </div>
                    {/* desc */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{r.action.label}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.desc}
                      </div>
                    </div>
                    {/* actor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
                      <Avatar initials={r.actor.name.initials} size={28} color={(i % 4 === 0) ? 'amber' : 'primary'} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.actor.name.short}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>@{r.actor.login}</div>
                      </div>
                    </div>
                    {/* ip */}
                    <div style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                                  minWidth: 110, textAlign: 'right' }}>
                      {r.ip}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 60, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
              Mos keluvchi yozuvlar topilmadi
            </div>
          )}
        </Card>

        {/* Drawer */}
        {openItem && <AuditDrawer entry={openItem} onClose={() => setOpenItem(null)} />}
      </div>
    </div>
  );
};

const AuditDrawer = ({ entry: r, onClose }) => {
  const sevColor = { critical: '#EF4444', warn: '#F59E0B', info: '#10B981' }[r.action.sev];
  const sevLabel = { critical: 'CRITICAL', warn: 'WARNING', info: 'INFO' }[r.action.sev];
  return (
    <Card padding={0} style={{ position: 'sticky', top: 16 }}>
      <div style={{ padding: 18, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: r.action.color + '15', color: r.action.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={r.action.icon} size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 99, background: sevColor + '15', color: sevColor, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: sevColor }} />
            {sevLabel}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{r.action.label}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{r.desc}</div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94A3B8' }}>
          <Icon name="x" size={18} />
        </button>
      </div>

      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>METADATA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontSize: 12.5 }}>
          {[
            { k: 'Event ID', v: r.id, mono: true },
            { k: 'Sana', v: r.date },
            { k: 'Vaqt', v: r.timestamp + ' (Asia/Tashkent)' },
            { k: 'Action', v: r.action.kind, mono: true },
            { k: 'IP manzil', v: r.ip, mono: true },
            { k: 'User-Agent', v: r.ua },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px dashed #F1F5F9' }}>
              <div style={{ flex: '0 0 110px', color: '#94A3B8' }}>{row.k}</div>
              <div style={{ flex: 1, color: '#0F172A', fontFamily: row.mono ? "'JetBrains Mono', ui-monospace, monospace" : 'inherit' }}>{row.v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>ACTOR</div>
        <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={r.actor.name.initials} size={36} color="primary" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{r.actor.name.full}</div>
            <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>@{r.actor.login} · {r.actor.id}</div>
          </div>
          <RoleChip roleId={r.actor.primaryRole} />
        </div>

        {r.target && (
          <>
            <div style={{ marginTop: 20, fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>TARGET</div>
            <div style={{ padding: 12, background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials={r.target.name.initials} size={36} color="amber" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{r.target.name.full}</div>
                <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>@{r.target.login} · {r.target.id}</div>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: 20, fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>RAW JSON</div>
        <div style={{ padding: 12, background: '#0F172A', borderRadius: 10, fontSize: 11, color: '#A7F3D0', fontFamily: "'JetBrains Mono', ui-monospace, monospace", lineHeight: 1.55, overflowX: 'auto' }}>
{`{
  "id": "${r.id}",
  "ts": "${r.date} ${r.timestamp}",
  "kind": "${r.action.kind}",
  "sev": "${r.action.sev}",
  "actor": "@${r.actor.login}",${r.target ? `\n  "target": "@${r.target.login}",` : ''}
  "ip": "${r.ip}",
  "ua": "${r.ua}"
}`}
        </div>
      </div>
    </Card>
  );
};

// ============================================================
// 6) ROLE SELECT (after login, when user has multiple roles)
// ============================================================
const RoleSelectPage = ({ onSelect, onLogout }) => {
  const ROLES = window.ROLES || [];
  // simulate: a multi-role user (e.g. dean + teacher + crm-operator)
  const userRoleIds = ['dean', 'teacher', 'crm-operator', 'finance'];
  const userRoles = userRoleIds.map(id => ROLES.find(r => r.id === id)).filter(Boolean);
  const [hover, setHover] = React.useState(null);

  // last-used role bookkeeping
  const lastUsedId = userRoleIds[0]; // dean

  const PERM_MATRIX = window.PERM_MATRIX || {};
  const ALL_MODULES = window.ALL_MODULES || [];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFB', display: 'flex', flexDirection: 'column',
                  fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* top bar */}
      <div style={{ height: 64, padding: '0 32px', display: 'flex', alignItems: 'center',
                    borderBottom: '1px solid #F1F5F9', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#2DB976,#1B7A4E)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 11 }}>NIU</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>NIU ERP</div>
            <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Navoiy innovatsiyalar universiteti</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748B' }}>
          <Avatar initials="AS" size={32} color="primary" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600, whiteSpace: 'nowrap' }}>Aliyev Sardor</div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>@aliyev.s</div>
          </div>
          <button onClick={onLogout}
            style={{ marginLeft: 12, padding: '7px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff',
                     color: '#475569', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                     display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="logout" size={13} /> Chiqish
          </button>
        </div>
      </div>

      {/* center */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 980 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em' }}>
              Qaysi rolda ishlamoqchisiz?
            </h1>
            <p style={{ margin: '12px 0 0', fontSize: 15, color: '#64748B', maxWidth: 520, marginInline: 'auto', lineHeight: 1.55 }}>
              Sizga {userRoles.length} ta rol biriktirilgan. Bittasini tanlang — har birida boshqacha modullar va imkoniyatlar mavjud.
            </p>
          </div>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
            {userRoles.map(r => {
              const perms = PERM_MATRIX[r.id] || {};
              const modCount = Object.keys(perms).length;
              const isHover = hover === r.id;
              const isLast = r.id === lastUsedId;
              return (
                <button key={r.id} onClick={() => onSelect?.(r)}
                  onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}
                  style={{ position: 'relative', padding: 24, borderRadius: 16, cursor: 'pointer',
                           textAlign: 'left', fontFamily: 'inherit',
                           background: '#fff',
                           border: `1px solid ${isHover ? r.color : '#F1F5F9'}`,
                           boxShadow: isHover ? `0 12px 32px ${r.color}25` : '0 1px 3px rgba(0,0,0,.05)',
                           transform: isHover ? 'translateY(-2px)' : 'translateY(0)',
                           transition: 'all 200ms ease' }}>
                  {isLast && (
                    <div style={{ position: 'absolute', top: 12, right: 12,
                                  fontSize: 10, padding: '3px 9px', borderRadius: 99,
                                  background: '#0F172A', color: '#fff', fontWeight: 600,
                                  letterSpacing: '0.05em' }}>
                      OXIRGI MARTA
                    </div>
                  )}
                  {/* icon */}
                  <div style={{ width: 56, height: 56, borderRadius: 14,
                                background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}CC 100%)`,
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16, fontSize: 18, fontWeight: 700,
                                boxShadow: `0 6px 20px ${r.color}40` }}>
                    {r.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 19, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>{r.name}</div>
                    {!r.system && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>CUSTOM</span>
                    )}
                  </div>

                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.55, minHeight: 40 }}>{r.desc}</div>

                  {/* meta row */}
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #F1F5F9',
                                display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Modullar</div>
                      <div style={{ fontSize: 14, color: '#0F172A', fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                        {modCount}<span style={{ color: '#CBD5E1', fontWeight: 500 }}>/{ALL_MODULES.length}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Scope</div>
                      <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>{r.scope || 'Universitet'}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                                  padding: '8px 14px', borderRadius: 8,
                                  background: isHover ? r.color : '#F8FAFC',
                                  color: isHover ? '#fff' : r.color,
                                  fontSize: 13, fontWeight: 600, transition: 'all 200ms ease' }}>
                      Kirish <Icon name="arrowRight" size={14} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* footer */}
          <div style={{ textAlign: 'center', fontSize: 12.5, color: '#94A3B8' }}>
            Rollarni keyinroq yuqori panelda almashtirishingiz mumkin · Yordam kerakmi? <a href="#" style={{ color: '#2DB976', textDecoration: 'none', fontWeight: 500 }}>IT bo'limiga murojaat</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Expose
Object.assign(window, {
  UsersListPage, UserProfilePage, RolesPage, PermissionMatrixPage, AuditLogPage, RoleSelectPage,
  RoleChip, StatusDot,
});
