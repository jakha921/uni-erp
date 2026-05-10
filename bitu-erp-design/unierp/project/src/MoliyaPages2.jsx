// MoliyaPages2.jsx — Payments, Scholarship, FinanceReport

// =================== 4) TO'LOVLAR ===================
const PaymentsPage = () => {
  const { payments, contracts, addPayment, deletePayment } = useFinance();
  const [period, setPeriod] = React.useState('all');
  const [fFac, setFFac] = React.useState('all');
  const [fMethod, setFMethod] = React.useState('all');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selectedContract, setSelectedContract] = React.useState(null);
  const [selectedStudent, setSelectedStudent] = React.useState(null);

  const today = new Date();
  const filtered = React.useMemo(() => {
    return payments.filter((p) => {
      const d = new Date(p.paymentDate);
      if (period === 'today' && d.toDateString() !== today.toDateString()) return false;
      if (period === 'week') {
        const wkStart = new Date(today); wkStart.setDate(today.getDate() - 7);
        if (d < wkStart) return false;
      }
      if (period === 'month' && (d.getMonth() !== today.getMonth() || d.getFullYear() !== today.getFullYear())) return false;
      if (fMethod !== 'all' && p.paymentMethod !== fMethod) return false;
      if (fFac !== 'all') {
        const c = contracts.find((c) => c.id === p.contractId);
        if (!c || String(c.departmentId) !== String(fFac)) return false;
      }
      return true;
    }).sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
  }, [payments, contracts, period, fFac, fMethod]);

  const total = filtered.reduce((s, p) => s + p.amount, 0);

  // Group by date
  const grouped = React.useMemo(() => {
    const g = {};
    filtered.forEach((p) => { (g[p.paymentDate] = g[p.paymentDate] || []).push(p); });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <KpiCard icon="check" label="To'lovlar soni" value={filtered.length} sub="Tanlangan davr" iconBg="#3B82F6" />
        <KpiCard icon="money" label="Jami summa" value={formatMoney(total)} iconBg="#2DB976" />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: '#F1F5F9', borderRadius: 10 }}>
            {[{ k: 'today', l: 'Bugun' }, { k: 'week', l: 'Bu hafta' }, { k: 'month', l: 'Bu oy' }, { k: 'all', l: 'Barchasi' }].map((p) => (
              <button key={p.k} onClick={() => setPeriod(p.k)}
                style={{ padding: '6px 14px', border: 'none', borderRadius: 6, fontSize: 13, fontFamily: 'inherit',
                  background: period === p.k ? '#fff' : 'transparent', color: period === p.k ? '#0F172A' : '#64748B',
                  fontWeight: period === p.k ? 600 : 500, cursor: 'pointer',
                  boxShadow: period === p.k ? '0 1px 2px rgba(0,0,0,.06)' : 'none' }}>{p.l}</button>
            ))}
          </div>
          <div style={{ width: 220 }}>
            <Select value={fFac} onChange={setFFac} options={[{ value: 'all', label: 'Barcha fakultetlar' }, ...FACULTIES.map((f) => ({ value: f.id, label: f.name.split(' ').slice(0, 3).join(' ') }))]} />
          </div>
          <div style={{ width: 180 }}>
            <Select value={fMethod} onChange={setFMethod} options={[
              { value: 'all', label: "Barcha usullar" }, { value: 'bank', label: 'Bank' },
              { value: 'naqd', label: 'Naqd' }, { value: 'click', label: 'Click' },
              { value: 'payme', label: 'Payme' }, { value: 'online', label: 'Online' },
            ]} />
          </div>
          <div style={{ flex: 1 }} />
          <Button variant="primary" icon="plus" onClick={() => setCreateOpen(true)}>Yangi to'lov</Button>
        </div>
      </Card>

      {grouped.length === 0 && <Card><EmptyState icon="money" title="To'lovlar topilmadi" hint="Boshqa davr yoki filtrni sinab ko'ring" /></Card>}

      {grouped.map(([date, list]) => (
        <div key={date} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 8 }}>
            {formatDate(date)} · {list.length} ta · {formatMoney(list.reduce((s, p) => s + p.amount, 0))}
          </div>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            {list.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                <Avatar initials={p.studentName.split(' ').map((x) => x[0]).slice(0, 2).join('')} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.studentName}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>{p.contractId} · {p.receiptNumber}</div>
                </div>
                <div style={{ minWidth: 110 }}><PayMethodBadge method={p.paymentMethod} /></div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1B7A4E', fontVariantNumeric: 'tabular-nums', minWidth: 140, textAlign: 'right' }}>{formatMoney(p.amount)}</div>
                <IconButton icon="trash" onClick={() => { deletePayment(p.id); window.showToast?.("To'lov o'chirildi", 'info'); }} />
              </div>
            ))}
          </Card>
        </div>
      ))}

      {createOpen && <NewPaymentFlow onClose={() => { setCreateOpen(false); setSelectedContract(null); setSelectedStudent(null); }}
        student={selectedStudent} setStudent={setSelectedStudent}
        contract={selectedContract} setContract={setSelectedContract}
        onSubmit={(p) => { addPayment(p); window.showToast?.("To'lov qabul qilindi"); setCreateOpen(false); setSelectedContract(null); setSelectedStudent(null); }} />}
    </div>
  );
};

const NewPaymentFlow = ({ onClose, student, setStudent, contract, setContract, onSubmit }) => {
  const { contracts } = useFinance();
  const studentContracts = student ? contracts.filter((c) => c.studentId === student.id || c.studentName === student.full_name) : [];

  if (!student) {
    return (
      <Modal open={true} onClose={onClose} title="Yangi to'lov — Talaba" width={560}>
        <div style={{ marginBottom: 12, fontSize: 13, color: '#64748B' }}>Talabani qidiring (kamida 3 belgi)</div>
        <StudentSearchInput onSelect={setStudent} />
      </Modal>
    );
  }
  if (!contract) {
    return (
      <Modal open={true} onClose={onClose} title="Kontraktni tanlang" width={560}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#ECFDF5', borderRadius: 10, marginBottom: 14 }}>
          <Avatar initials={student.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('')} size={36} src={student.image} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{student.full_name}</div><div style={{ fontSize: 11.5, color: '#64748B' }}>{student.group?.name}</div></div>
          <IconButton icon="x" onClick={() => setStudent(null)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {studentContracts.length === 0 && <div style={{ padding: 14, fontSize: 13, color: '#64748B', textAlign: 'center', background: '#F8FAFB', borderRadius: 8 }}>Bu talabaga kontrakt topilmadi</div>}
          {studentContracts.map((c) => (
            <button key={c.id} onClick={() => setContract(c)}
              style={{ padding: 12, border: '1px solid #E2E8F0', borderRadius: 10, background: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{c.contractNumber}</span>
                <ContractStatusBadge status={c.status} />
              </div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{formatMoney(c.contractAmount)} · qoldiq: <strong style={{ color: '#B91C1C' }}>{formatMoney(c.debtAmount)}</strong></div>
            </button>
          ))}
        </div>
      </Modal>
    );
  }
  return <PaymentForm contractId={contract.id} student={contract} onClose={onClose} onSubmit={onSubmit} />;
};

// =================== 5) STIPENDIYA ===================
const MoliyaScholarshipPage = () => {
  const { scholarships, addScholarship, updateScholarship, deleteScholarship } = useFinance();
  const [tab, setTab] = React.useState('list');
  const [fType, setFType] = React.useState('all');
  const [fStatus, setFStatus] = React.useState('all');

  const filtered = scholarships.filter((s) => {
    if (fType !== 'all' && s.type !== fType) return false;
    if (fStatus !== 'all' && s.status !== fStatus) return false;
    return true;
  });

  const typeBadge = (t) => {
    const map = {
      davlat: { v: 'info', l: 'Davlat' }, prezident: { v: 'warning', l: 'Prezident' },
      rektor: { v: 'success', l: 'Rektor' }, ijtimoiy: { v: 'neutral', l: 'Ijtimoiy' },
      maxsus: { v: 'info', l: 'Maxsus' },
    };
    return <Badge variant={map[t]?.v || 'neutral'} dot>{map[t]?.l || t}</Badge>;
  };
  const statusBadge = (s) => {
    const m = { active: { v: 'success', l: 'Faol' }, paused: { v: 'warning', l: "To'xtatilgan" }, completed: { v: 'neutral', l: 'Yakunlangan' } };
    return <Badge variant={m[s]?.v} dot>{m[s]?.l}</Badge>;
  };

  return (
    <div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'list', label: "Stipendiya oluvchilar", count: scholarships.length },
        { id: 'assign', label: 'Tayinlash' },
      ]} />

      {tab === 'list' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 200 }}>
              <Select value={fType} onChange={setFType} options={[
                { value: 'all', label: 'Barcha turlari' },
                { value: 'davlat', label: 'Davlat' }, { value: 'prezident', label: 'Prezident' },
                { value: 'rektor', label: 'Rektor' }, { value: 'ijtimoiy', label: 'Ijtimoiy' }, { value: 'maxsus', label: 'Maxsus' },
              ]} />
            </div>
            <div style={{ width: 180 }}>
              <Select value={fStatus} onChange={setFStatus} options={[
                { value: 'all', label: 'Barcha holatlar' },
                { value: 'active', label: 'Faol' }, { value: 'paused', label: "To'xtatilgan" }, { value: 'completed', label: 'Yakunlangan' },
              ]} />
            </div>
          </div>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFB' }}>
                  <th style={th}>#</th>
                  <th style={th}>Talaba</th>
                  <th style={th}>Guruh</th>
                  <th style={th}>Fakultet</th>
                  <th style={th}>Turi</th>
                  <th style={{ ...th, textAlign: 'right' }}>Summa/oy</th>
                  <th style={th}>Davr</th>
                  <th style={th}>Holat</th>
                  <th style={th} />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={9}><EmptyState icon="award" title="Stipendiyalar topilmadi" /></td></tr>}
                {filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}><div style={{ fontWeight: 500 }}>{s.studentName}</div><div style={{ fontSize: 11.5, color: '#64748B' }}>{s.basis}</div></td>
                    <td style={td}>{s.groupName}</td>
                    <td style={{ ...td, fontSize: 12.5 }}>{s.departmentName?.split(' ').slice(0, 2).join(' ')}</td>
                    <td style={td}>{typeBadge(s.type)}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(s.amount)}</td>
                    <td style={{ ...td, fontSize: 12 }}>{formatDate(s.startDate)} — {formatDate(s.endDate)}</td>
                    <td style={td}>{statusBadge(s.status)}</td>
                    <td style={td}>
                      <DropdownMenu trigger={<IconButton icon="more" />} items={[
                        { icon: 'check', label: 'Faol qilish', onClick: () => updateScholarship(s.id, { status: 'active' }) },
                        { icon: 'x', label: "To'xtatish", onClick: () => updateScholarship(s.id, { status: 'paused' }) },
                        { icon: 'trash', label: "O'chirish", danger: true, onClick: () => { deleteScholarship(s.id); window.showToast?.("Stipendiya o'chirildi", 'info'); } },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === 'assign' && <ScholarshipAssignForm onCreate={(s) => { addScholarship(s); window.showToast?.('Stipendiya tayinlandi'); setTab('list'); }} />}
    </div>
  );
};

const ScholarshipAssignForm = ({ onCreate }) => {
  const [student, setStudent] = React.useState(null);
  const [type, setType] = React.useState('davlat');
  const [amount, setAmount] = React.useState('920000');
  const [start, setStart] = React.useState('2025-09-01');
  const [end, setEnd] = React.useState('2026-06-30');
  const [basis, setBasis] = React.useState('GPA 86+ ball');

  React.useEffect(() => {
    const a = { davlat: 920000, prezident: 2500000, rektor: 1500000, ijtimoiy: 600000, maxsus: 1200000 };
    setAmount(String(a[type]));
  }, [type]);

  const submit = () => {
    if (!student) { window.showToast?.('Talaba tanlang', 'error'); return; }
    const a = parseInt(amount, 10);
    if (!a) { window.showToast?.("Summa kiriting", 'error'); return; }
    onCreate({
      studentId: student.id, studentName: student.full_name,
      departmentName: student.department?.name, groupName: student.group?.name,
      type, amount: a, startDate: start, endDate: end, basis,
    });
  };

  return (
    <Card>
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Section title="1. Talabani tanlash">
          {!student && <StudentSearchInput onSelect={setStudent} />}
          {student && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#ECFDF5', borderRadius: 10 }}>
              <Avatar initials={student.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('')} size={42} src={student.image} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{student.full_name}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{student.group?.name} · {student.department?.name}</div>
              </div>
              <IconButton icon="x" onClick={() => setStudent(null)} />
            </div>
          )}
        </Section>

        <Section title="2. Stipendiya ma'lumotlari">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select label="Turi" value={type} onChange={setType} options={[
              { value: 'davlat', label: 'Davlat' }, { value: 'prezident', label: 'Prezident' },
              { value: 'rektor', label: 'Rektor' }, { value: 'ijtimoiy', label: 'Ijtimoiy' }, { value: 'maxsus', label: 'Maxsus' },
            ]} />
            <Input label="Oylik summa (so'm)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input label="Boshlanish" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <Input label="Tugash" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </Section>

        <Section title="3. Asos">
          <textarea value={basis} onChange={(e) => setBasis(e.target.value)} rows={3}
            style={{ width: '100%', padding: 10, border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
        </Section>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" icon="check" onClick={submit}>Tayinlash</Button>
        </div>
      </div>
    </Card>
  );
};

// =================== 6) MOLIYAVIY HISOBOT ===================
const FinanceReportPage = () => {
  const { contracts, payments } = useFinance();
  const [from, setFrom] = React.useState('2025-09-01');
  const [to, setTo] = React.useState('2026-06-30');
  const [reportType, setReportType] = React.useState('faculty');
  const [generated, setGenerated] = React.useState(false);

  const data = React.useMemo(() => {
    if (!generated) return null;

    // Filter contracts by date range (contractDate)
    const filteredContracts = contracts.filter((c) => {
      if (from && c.contractDate < from) return false;
      if (to && c.contractDate > to) return false;
      return true;
    });

    // Filter payments by date range (paymentDate)
    const filteredPayments = payments.filter((p) => {
      if (from && p.paymentDate < from) return false;
      if (to && p.paymentDate > to) return false;
      return true;
    });

    let groups = [];
    if (reportType === 'faculty') {
      groups = FACULTIES.map((f) => {
        const cs = filteredContracts.filter((c) => c.departmentId === f.id);
        return { key: f.name.split(' ').slice(0, 3).join(' '), contracts: cs };
      });
    } else if (reportType === 'level') {
      groups = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'].map((l) => ({ key: l, contracts: filteredContracts.filter((c) => c.level === l) }));
    } else if (reportType === 'type') {
      groups = ['bazoviy', 'tabaqalashtirilgan', 'grant', 'xorijiy'].map((t) => ({ key: t, contracts: filteredContracts.filter((c) => c.contractType === t) }));
    } else if (reportType === 'method') {
      return { byMethod: PAY_METHODS.map((m) => {
        const list = filteredPayments.filter((p) => p.paymentMethod === m);
        return { key: m, count: list.length, sum: list.reduce((s, p) => s + p.amount, 0) };
      }) };
    } else {
      groups = [{ key: 'JAMI', contracts: filteredContracts }];
    }
    return groups.map((g) => {
      const total = g.contracts.reduce((s, c) => s + c.contractAmount, 0);
      const paid = g.contracts.reduce((s, c) => s + c.paidAmount, 0);
      return { key: g.key, count: g.contracts.length, total, paid, debt: total - paid, pct: total > 0 ? Math.round(paid / total * 100) : 0 };
    });
  }, [generated, reportType, contracts, payments, from, to]);

  const totals = React.useMemo(() => {
    if (!Array.isArray(data)) return null;
    return data.reduce((acc, r) => ({
      count: acc.count + r.count, total: acc.total + r.total,
      paid: acc.paid + r.paid, debt: acc.debt + r.debt,
    }), { count: 0, total: 0, paid: 0, debt: 0 });
  }, [data]);

  const exportCSV = () => {
    if (!Array.isArray(data)) return;
    const rows = [['Kategoriya', 'Kontraktlar', 'Jami', "To'langan", 'Qarz', "Yig'im %"]];
    data.forEach((r) => rows.push([r.key, r.count, r.total, r.paid, r.debt, r.pct + '%']));
    if (totals) rows.push(['JAMI', totals.count, totals.total, totals.paid, totals.debt, Math.round(totals.paid / totals.total * 100) + '%']);
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `moliyaviy-hisobot-${reportType}.csv`; a.click();
    URL.revokeObjectURL(url);
    window.showToast?.('CSV yuklab olindi');
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
          <Input label="Davr (dan)" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="Davr (gacha)" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Hisobot turi" value={reportType} onChange={setReportType} options={[
              { value: 'general', label: 'Umumiy' }, { value: 'faculty', label: "Fakultet bo'yicha" },
              { value: 'level', label: "Kurs bo'yicha" }, { value: 'type', label: "Kontrakt turi bo'yicha" },
              { value: 'method', label: "To'lov usuli bo'yicha" },
            ]} />
          </div>
          <Button variant="primary" icon="chart" onClick={() => setGenerated(true)}>Hisobot yaratish</Button>
        </div>
      </Card>

      {!generated && <Card><EmptyState icon="chart" title="Hisobot yaratilmagan" hint="Davr va turini tanlang, so'ngra tugmani bosing." /></Card>}

      {generated && data && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'flex-end' }}>
            <Button variant="secondary" icon="doc" onClick={() => window.print()}>Chop etish</Button>
            <Button variant="secondary" icon="download" onClick={exportCSV}>Excel yuklash</Button>
            <Button variant="secondary" icon="doc" onClick={() => window.showToast?.('PDF eksport tez orada qo\'shiladi', 'info')}>PDF</Button>
          </div>

          {reportType === 'method' && data.byMethod && (
            <Card padding={0} style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F8FAFB' }}>
                  <th style={th}>To'lov usuli</th>
                  <th style={{ ...th, textAlign: 'right' }}>To'lovlar soni</th>
                  <th style={{ ...th, textAlign: 'right' }}>Jami summa</th>
                </tr></thead>
                <tbody>
                  {data.byMethod.map((r) => (
                    <tr key={r.key}>
                      <td style={td}><PayMethodBadge method={r.key} /></td>
                      <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.count}</td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(r.sum)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {Array.isArray(data) && (
            <>
              <Card padding={0} style={{ overflow: 'hidden', marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#F8FAFB' }}>
                    <th style={th}>Kategoriya</th>
                    <th style={{ ...th, textAlign: 'right' }}>Kontraktlar</th>
                    <th style={{ ...th, textAlign: 'right' }}>Jami summa</th>
                    <th style={{ ...th, textAlign: 'right' }}>To'langan</th>
                    <th style={{ ...th, textAlign: 'right' }}>Qarz</th>
                    <th style={{ ...th, textAlign: 'right' }}>Yig'im %</th>
                  </tr></thead>
                  <tbody>
                    {data.map((r) => (
                      <tr key={r.key}>
                        <td style={{ ...td, fontWeight: 500, color: '#0F172A' }}>{r.key}</td>
                        <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.count}</td>
                        <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatMoney(r.total)}</td>
                        <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#1B7A4E' }}>{formatMoney(r.paid)}</td>
                        <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#B91C1C' }}>{formatMoney(r.debt)}</td>
                        <td style={{ ...td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.pct}%</td>
                      </tr>
                    ))}
                    {totals && (
                      <tr style={{ background: '#F1F5F9', fontWeight: 700 }}>
                        <td style={{ ...td, fontWeight: 700 }}>JAMI</td>
                        <td style={{ ...td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{totals.count}</td>
                        <td style={{ ...td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(totals.total)}</td>
                        <td style={{ ...td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#1B7A4E' }}>{formatMoney(totals.paid)}</td>
                        <td style={{ ...td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#B91C1C' }}>{formatMoney(totals.debt)}</td>
                        <td style={{ ...td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{totals.total > 0 ? Math.round(totals.paid / totals.total * 100) : 0}%</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
                <ChartCard title="Kategoriya bo'yicha yig'im">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {data.map((r, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12.5 }}>
                          <span style={{ color: '#334155', fontWeight: 500 }}>{r.key}</span>
                          <span style={{ color: '#0F172A', fontWeight: 600 }}>{r.pct}%</span>
                        </div>
                        <ProgressMini value={r.paid} max={r.total} height={10} color="#2DB976" />
                      </div>
                    ))}
                  </div>
                </ChartCard>
                <ChartCard title="To'langan / Qarz">
                  <DonutChart centerValue={totals ? Math.round(totals.paid / totals.total * 100) + '%' : '—'} centerLabel="Yig'im"
                    segments={[
                      { label: "To'langan", value: totals?.paid || 0, color: '#2DB976' },
                      { label: 'Qarz', value: totals?.debt || 0, color: '#EF4444' },
                    ]} />
                </ChartCard>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

Object.assign(window, {
  PaymentsPage, MoliyaScholarshipPage, FinanceReportPage,
});
