// KadrlarPages2.jsx — HR pages 4-6: Buyruqlar, Davomad, Ta'tillar va safar

const fmtUZSHr2 = (n) => new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0));

// ============ BUYRUQLAR ============
const HrOrdersPage = () => {
  const { orders, employees, addOrder, updateOrder } = useHr();
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showCreate, setShowCreate] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const filtered = orders.filter((o) => {
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.number.includes(search)) return false;
    if (typeFilter !== 'all' && o.type !== typeFilter) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  const orderTypes = [
    { code: 'hire', name: 'Ishga qabul qilish' },
    { code: 'fire', name: 'Ishdan bo\'shatish' },
    { code: 'promote', name: 'Lavozimga ko\'tarish' },
    { code: 'salary', name: 'Maosh o\'zgarishi' },
    { code: 'leave', name: 'Ta\'tilga jo\'natish' },
    { code: 'trip', name: 'Xizmat safari' },
    { code: 'bonus', name: 'Mukofotlash' },
    { code: 'penalty', name: 'Hayfsan e\'lon qilish' },
  ];

  const cols = [
    {
      key: 'num', label: '№ va sana', width: 140,
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.number}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{r.date}</div>
        </div>
      ),
    },
    {
      key: 'type', label: 'Buyruq turi',
      render: (r) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: r.typeColor }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{r.typeLabel}</span>
        </span>
      ),
    },
    { key: 'emp', label: 'Xodim', render: (r) => r.employeeName },
    { key: 'basis', label: 'Asos', render: (r) => <span style={{ fontSize: 13, color: '#64748B' }}>{r.basis}</span> },
    { key: 'status', label: 'Holat', render: (r) => <OrderStatusBadge status={r.status} /> },
    {
      key: 'actions', label: '', width: 60,
      render: (r) => (
        <Button variant="ghost" size="sm" icon="eye" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>Ko'rish</Button>
      ),
    },
  ];

  return (
    <BituPage>
      <PageHeader
        title="Kadrlar buyruqlari"
        subtitle={`Jami: ${filtered.length} ta`}
        actions={
          <Button variant="primary" icon="plus" onClick={() => setShowCreate(true)}>
            Yangi buyruq
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Jami buyruqlar" value={orders.length} icon="doc" />
        <StatCard label="Imzolangan" value={orders.filter((o) => o.status === 'signed').length} icon="check" />
        <StatCard label="Ko'rib chiqishda" value={orders.filter((o) => o.status === 'review').length} icon="warning" />
        <StatCard label="Loyihalar" value={orders.filter((o) => o.status === 'draft').length} icon="edit" />
      </StatGrid>

      <Card padding={16} style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 280px', minWidth: 240 }}>
            <Input placeholder="Buyruq raqami yoki nomi bo'yicha qidirish…" value={search} onChange={setSearch} icon="search" />
          </div>
          <Select
            label="Buyruq turi"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[{ value: 'all', label: 'Hammasi' }, ...orderTypes.map((t) => ({ value: t.code, label: t.name }))]}
          />
          <Select
            label="Holat"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'Hammasi' },
              { value: 'draft', label: 'Loyiha' },
              { value: 'review', label: 'Ko\'rib chiqishda' },
              { value: 'signed', label: 'Imzolangan' },
            ]}
          />
        </div>
      </Card>

      <div style={{ marginTop: 16 }}>
        <DataTable columns={cols} rows={filtered} selectable={false} onRowClick={(r) => setSelected(r)}
          empty={filtered.length === 0 ? { icon: 'inbox', title: 'Buyruqlar topilmadi', message: 'Filtrlarni o\'zgartiring' } : null} />
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Yangi buyruq yaratish" width={600} footer={
        <>
          <Button variant="ghost" onClick={() => setShowCreate(false)}>Bekor qilish</Button>
          <Button variant="primary" icon="check" onClick={() => {
            window.showToast?.('Buyruq loyihasi saqlandi', 'success');
            setShowCreate(false);
          }}>Loyiha sifatida saqlash</Button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select label="Buyruq turi" value="hire" onChange={() => {}} options={orderTypes.map((t) => ({ value: t.code, label: t.name }))} />
          <Input label="Buyruq raqami" placeholder="masalan: 145-K" />
          <Input label="Sana" type="date" />
          <Select label="Xodim" value="" onChange={() => {}} options={[{ value: '', label: 'Tanlang…' }, ...employees.slice(0, 30).map((e) => ({ value: String(e.id), label: e.full_name }))]} />
          <Input label="Asos" placeholder="Mehnat shartnomasi, ariza..." />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Buyruq mazmuni</div>
            <textarea rows={4} style={{ width: '100%', padding: 10, border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical' }} placeholder="Buyruq matni..." />
          </div>
        </div>
      </Modal>

      {/* View modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={`Buyruq № ${selected.number}`} width={640} footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>Yopish</Button>
            {selected.status === 'draft' && (
              <Button variant="secondary" onClick={() => {
                updateOrder(selected.id, { status: 'review' });
                setSelected({ ...selected, status: 'review' });
                window.showToast?.('Ko\'rib chiqishga yuborildi', 'success');
              }}>Ko'rib chiqishga yuborish</Button>
            )}
            {selected.status === 'review' && (
              <Button variant="primary" icon="check" onClick={() => {
                updateOrder(selected.id, { status: 'signed' });
                setSelected({ ...selected, status: 'signed' });
                window.showToast?.('Buyruq imzolandi', 'success');
              }}>Imzolash</Button>
            )}
          </>
        }>
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: selected.typeColor }} />
              <span style={{ fontWeight: 600 }}>{selected.typeLabel}</span>
            </span>
            <div style={{ marginTop: 8 }}><OrderStatusBadge status={selected.status} /></div>
          </div>
          <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
            <div><strong>Sana:</strong> {selected.date}</div>
            <div><strong>Kuchga kirish:</strong> {selected.effectiveDate}</div>
            <div><strong>Asos:</strong> {selected.basis}</div>
            <div><strong>Imzo qo'yuvchi:</strong> {selected.signer}</div>
          </div>
          <div style={{ fontSize: 14 }}>
            <strong>{selected.employeeName}</strong> ga doir <strong>{selected.typeLabel.toLowerCase()}</strong> haqida buyruq.
            {selected.basis} asosida tegishli choralar ko'rilsin va kadrlar bo'limi tomonidan rasmiylashtirilsin.
          </div>
        </Modal>
      )}
    </BituPage>
  );
};

// ============ DAVOMAD (Tabel) ============
const HrAttendancePage = () => {
  const auth = useAuth();
  const { employees, departments, attendance } = useHr();
  const [month, setMonth] = React.useState(attendance.month);
  const [year] = React.useState(attendance.year);
  const [deptFilter, setDeptFilter] = React.useState('all');

  const baseList = React.useMemo(() => {
    if (auth.user?.role === 'dekan') {
      const facDeptIds = departments
        .filter((d) => d.id === auth.user.facultyId || d.parent === auth.user.facultyId)
        .map((d) => d.id);
      return employees.filter((e) => facDeptIds.includes(e.department?.id));
    }
    return employees;
  }, [employees, departments, auth.user]);

  const filtered = baseList.filter((e) => deptFilter === 'all' || e.department?.id === Number(deptFilter)).slice(0, 30);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

  // Read attendance from store state
  const attendOf = (empId, day) => {
    const rec = attendance.records && attendance.records[empId];
    if (rec && rec[day]) return rec[day];
    // Fallback for employees without stored attendance
    const date = new Date(year, month, day);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return 'weekend';
    const v = (empId * 7 + day * 13) % 100;
    if (v < 5) return 'absent';
    if (v < 10) return 'leave';
    if (v < 13) return 'sick';
    return 'present';
  };

  const colorOf = (s) => {
    if (s === 'present') return '#10B981';
    if (s === 'absent') return '#EF4444';
    if (s === 'leave') return '#8B5CF6';
    if (s === 'sick') return '#F59E0B';
    return '#E2E8F0';
  };
  const labelOf = (s) => ({ present: 'I', absent: 'X', leave: 'T', sick: 'K', weekend: '·' }[s] || '·');

  const visibleDepts = auth.user?.role === 'dekan'
    ? departments.filter((d) => d.id === auth.user.facultyId || d.parent === auth.user.facultyId)
    : departments;

  return (
    <BituPage>
      <PageHeader
        title="Xodimlar davomati (Tabel)"
        subtitle={`${monthNames[month]} ${year}`}
        actions={
          <Button variant="secondary" icon="download" onClick={() => {
            const bom = '﻿';
            const header = 'Xodim,' + Array.from({ length: daysInMonth }, (_, i) => i + 1).join(',') + ',Jami kun,Jami soat\n';
            const rows = filtered.map((e) => {
              let pres = 0;
              const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
                const s = attendOf(e.id, i + 1);
                if (s === 'present') pres++;
                return labelOf(s);
              });
              return `"${e.short_name || e.full_name}",${dayCells.join(',')},${pres},${pres * 8}`;
            }).join('\n');
            const blob = new Blob([bom + header + rows], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tabel-${monthNames[month]}-${year}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            window.showToast?.('Tabel CSV formatida yuklandi', 'success');
          }}>
            Excel ga eksport
          </Button>
        }
      />

      <Card padding={16} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Select
            label="Oy"
            value={String(month)}
            onChange={(v) => setMonth(Number(v))}
            options={monthNames.map((m, i) => ({ value: String(i), label: m }))}
          />
          <Select
            label="Bo'lim"
            value={deptFilter}
            onChange={setDeptFilter}
            options={[{ value: 'all', label: 'Hammasi' }, ...visibleDepts.map((d) => ({ value: String(d.id), label: d.name.slice(0, 30) }))]}
          />
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
            <LegendItem color="#10B981" label="I — ishda" />
            <LegendItem color="#EF4444" label="X — kelmadi" />
            <LegendItem color="#F59E0B" label="K — kasallik" />
            <LegendItem color="#8B5CF6" label="T — ta'til" />
          </div>
        </div>
      </Card>

      <Card padding={0} className="table-scroll" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ padding: '12px 8px', textAlign: 'left', position: 'sticky', left: 0, background: '#F8FAFC', minWidth: 220, fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>F.I.SH</th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                const dow = new Date(year, month, d).getDay();
                const weekend = dow === 0 || dow === 6;
                return (
                  <th key={d} style={{
                    padding: '6px 4px', minWidth: 28, fontSize: 11,
                    color: weekend ? '#94A3B8' : '#64748B',
                    background: weekend ? '#F1F5F9' : '#F8FAFC',
                  }}>{d}</th>
                );
              })}
              <th style={{ padding: '12px 10px', minWidth: 50, fontSize: 11, color: '#64748B', fontWeight: 600 }}>I</th>
              <th style={{ padding: '12px 10px', minWidth: 50, fontSize: 11, color: '#64748B', fontWeight: 600 }}>X</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              let pres = 0, abs = 0;
              const cells = Array.from({ length: daysInMonth }, (_, i) => {
                const s = attendOf(e.id, i + 1);
                if (s === 'present') pres++;
                if (s === 'absent') abs++;
                return s;
              });
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 8px', position: 'sticky', left: 0, background: '#fff', borderRight: '1px solid #F1F5F9' }}>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{e.short_name || e.full_name}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>{e.position?.name}</div>
                  </td>
                  {cells.map((s, i) => (
                    <td key={i} style={{ padding: 0, textAlign: 'center', verticalAlign: 'middle' }}>
                      <div style={{
                        width: 22, height: 22, margin: '4px auto',
                        borderRadius: 4, background: s === 'weekend' ? 'transparent' : colorOf(s) + '22',
                        color: colorOf(s), fontSize: 10, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{labelOf(s)}</div>
                    </td>
                  ))}
                  <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 600, color: '#10B981' }}>{pres}</td>
                  <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 600, color: '#EF4444' }}>{abs}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </BituPage>
  );
};

const LegendItem = ({ color, label }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
    <span style={{ color: '#64748B' }}>{label}</span>
  </span>
);

// ============ TA'TILLAR VA SAFAR ============
const HrLeavesPage = () => {
  const auth = useAuth();
  const { leaves, departments, employees, addLeave, updateLeave, deleteLeave } = useHr();
  const [tab, setTab] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [showCreate, setShowCreate] = React.useState(false);
  const [createType, setCreateType] = React.useState('mehnat');
  const [createEmpId, setCreateEmpId] = React.useState('');
  const [createStart, setCreateStart] = React.useState('');
  const [createEnd, setCreateEnd] = React.useState('');
  const [createDest, setCreateDest] = React.useState('');
  const [createReason, setCreateReason] = React.useState('');

  const baseList = React.useMemo(() => {
    if (auth.user?.role === 'dekan') {
      const facDeptIds = departments
        .filter((d) => d.id === auth.user.facultyId || d.parent === auth.user.facultyId)
        .map((d) => d.id);
      const facEmpIds = employees.filter((e) => facDeptIds.includes(e.department?.id)).map((e) => e.id);
      return leaves.filter((l) => facEmpIds.includes(l.employeeId));
    }
    return leaves;
  }, [leaves, departments, employees, auth.user]);

  const filtered = baseList.filter((l) => {
    if (search && !l.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'leaves' && l.type === 'safar') return false;
    if (tab === 'trips' && l.type !== 'safar') return false;
    if (tab === 'pending' && l.status !== 'pending') return false;
    return true;
  });

  const cols = [
    {
      key: 'emp', label: 'Xodim',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.employeeName}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{(r.department || '').slice(0, 32)}</div>
        </div>
      ),
    },
    {
      key: 'type', label: 'Turi',
      render: (r) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <Icon name={r.type === 'safar' ? 'briefcase' : 'calendar'} size={14} />
          {r.typeLabel}
        </span>
      ),
    },
    { key: 'period', label: 'Davri', render: (r) => `${r.startDate} — ${r.endDate}` },
    { key: 'days', label: 'Kun', render: (r) => `${r.days} kun` },
    { key: 'reason', label: 'Sabab/Yo\'nalish', render: (r) => <span style={{ fontSize: 13, color: '#64748B' }}>{r.destination || r.reason}</span> },
    { key: 'status', label: 'Holat', render: (r) => <LeaveStatusBadge status={r.status} /> },
    {
      key: 'actions', label: '', width: 180,
      render: (r) => r.status === 'pending' && auth.user?.role !== 'oqituvchi' ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="primary" size="sm" icon="check" onClick={(e) => {
            e.stopPropagation();
            updateLeave(r.id, { status: 'approved' });
            window.showToast?.('Tasdiqlandi', 'success');
          }}>Tasdiqlash</Button>
          <Button variant="ghost" size="sm" icon="x" onClick={(e) => {
            e.stopPropagation();
            updateLeave(r.id, { status: 'rejected' });
            window.showToast?.('Rad etildi', 'info');
          }}>Rad etish</Button>
        </div>
      ) : null,
    },
  ];

  const tabs = [
    { id: 'all', label: 'Hammasi', count: baseList.length },
    { id: 'leaves', label: "Ta'tillar", count: baseList.filter((l) => l.type !== 'safar').length },
    { id: 'trips', label: 'Xizmat safarlari', count: baseList.filter((l) => l.type === 'safar').length },
    { id: 'pending', label: 'Tasdiqlash kutmoqda', count: baseList.filter((l) => l.status === 'pending').length },
  ];

  return (
    <BituPage>
      <PageHeader
        title="Ta'tillar va xizmat safarlari"
        subtitle={`Jami: ${filtered.length} ta`}
        actions={
          <Button variant="primary" icon="plus" onClick={() => setShowCreate(true)}>
            Yangi ariza
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Hozir ta'tilda" value={baseList.filter((l) => l.status === 'approved' && l.type !== 'safar').length} icon="calendar" />
        <StatCard label="Hozir safarda" value={baseList.filter((l) => l.status === 'approved' && l.type === 'safar').length} icon="briefcase" />
        <StatCard label="Tasdiqlash kutmoqda" value={baseList.filter((l) => l.status === 'pending').length} icon="warning" />
        <StatCard label="Bu oy jami" value={baseList.length} icon="chart" />
      </StatGrid>

      <div style={{ marginTop: 24 }}>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <Card padding={16} style={{ marginBottom: 16 }}>
          <Input placeholder="Xodim ismi bo'yicha qidirish…" value={search} onChange={setSearch} icon="search" />
        </Card>
        <DataTable columns={cols} rows={filtered} selectable={false}
          empty={filtered.length === 0 ? { icon: 'inbox', title: 'Arizalar topilmadi', message: 'Filtrlarni o\'zgartiring' } : null} />
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Yangi ariza" width={560} footer={
        <>
          <Button variant="ghost" onClick={() => setShowCreate(false)}>Bekor qilish</Button>
          <Button variant="primary" icon="check" onClick={() => {
            if (!createEmpId || !createStart || !createEnd) {
              window.showToast?.('Xodim, boshlanish va tugash sanalarini tanlang', 'error');
              return;
            }
            const emp = employees.find((e) => String(e.id) === createEmpId);
            if (!emp) { window.showToast?.('Xodim topilmadi', 'error'); return; }
            const typeLabels = { mehnat: "Mehnat ta'tili", oqish: "O'qish ta'tili", tugruq: "Tug'ruq ta'tili", beh: "Behaq ta'til", safar: 'Xizmat safari' };
            const startD = new Date(createStart);
            const endD = new Date(createEnd);
            const diffDays = Math.max(1, Math.round((endD - startD) / (1000 * 60 * 60 * 24)));
            addLeave({
              employeeId: emp.id,
              employeeName: emp.full_name,
              department: emp.department?.name,
              type: createType,
              typeLabel: typeLabels[createType] || createType,
              startDate: createStart,
              endDate: createEnd,
              days: diffDays,
              destination: createType === 'safar' ? createDest : null,
              reason: createReason || (createType === 'safar' ? 'Xizmat safari' : 'Shaxsiy sabab'),
            });
            window.showToast?.('Ariza yuborildi va buyruq loyihasi yaratildi', 'success');
            setShowCreate(false);
            setCreateEmpId(''); setCreateStart(''); setCreateEnd(''); setCreateDest(''); setCreateReason(''); setCreateType('mehnat');
          }}>Yuborish</Button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select label="Ariza turi" value={createType} onChange={setCreateType} options={[
            { value: 'mehnat', label: "Mehnat ta'tili" },
            { value: 'oqish', label: "O'qish ta'tili" },
            { value: 'tugruq', label: "Tug'ruq ta'tili" },
            { value: 'beh', label: 'Behaq ta\'til' },
            { value: 'safar', label: 'Xizmat safari' },
          ]} />
          <Select label="Xodim" value={createEmpId} onChange={setCreateEmpId} options={[{ value: '', label: 'Tanlang…' }, ...employees.slice(0, 30).map((e) => ({ value: String(e.id), label: e.full_name }))]} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Boshlanish sanasi" type="date" value={createStart} onChange={setCreateStart} />
            <Input label="Tugash sanasi" type="date" value={createEnd} onChange={setCreateEnd} />
          </div>
          {createType === 'safar' && <Input label="Yo'nalish" placeholder="Toshkent sh., Samarqand sh." value={createDest} onChange={setCreateDest} />}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Sabab</div>
            <textarea rows={3} value={createReason} onChange={(e) => setCreateReason(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical' }} placeholder="Ariza sababi..." />
          </div>
        </div>
      </Modal>
    </BituPage>
  );
};

Object.assign(window, {
  HrOrdersPage, HrAttendancePage, HrLeavesPage,
});
