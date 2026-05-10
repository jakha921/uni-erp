// MoliyaPages1.jsx — FinancePanel, Contracts, Debtors

// =================== 1) MOLIYAVIY PANEL ===================
const FinancePanelPage = ({ onNav }) => {
  const { contracts, payments } = useFinance();

  const stats = React.useMemo(() => {
    const total = contracts.reduce((s, c) => s + c.contractAmount, 0);
    const paid = contracts.reduce((s, c) => s + c.paidAmount, 0);
    const debt = total - paid;
    const ratio = total > 0 ? Math.round((paid / total) * 1000) / 10 : 0;
    // Donut: payment status
    let full = 0, partial = 0, none = 0;
    contracts.forEach((c) => {
      if (c.paidAmount >= c.contractAmount) full++;
      else if (c.paidAmount > 0) partial++;
      else none++;
    });
    // By faculty
    const byFac = FACULTIES.map((f) => {
      const facContracts = contracts.filter((c) => c.departmentId === f.id);
      const t = facContracts.reduce((s, c) => s + c.contractAmount, 0);
      const p = facContracts.reduce((s, c) => s + c.paidAmount, 0);
      return { id: f.id, label: f.name.split(' ').slice(0, 2).join(' '), full: f.name, total: t, paid: p, pct: t > 0 ? Math.round(p / t * 100) : 0 };
    });
    // Monthly dynamics (last 6 months from payments)
    const now = new Date(2026, 1, 1); // anchor
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const sum = payments.filter((p) => p.paymentDate.startsWith(key)).reduce((s, p) => s + p.amount, 0);
      months.push({ label: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'][d.getMonth()], value: sum });
    }
    // By course (level)
    const byLevel = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'].map((lvl) => {
      const cs = contracts.filter((c) => c.level === lvl);
      const t = cs.reduce((s, c) => s + c.contractAmount, 0);
      const p = cs.reduce((s, c) => s + c.paidAmount, 0);
      return { label: lvl, paid: p, debt: t - p, total: t };
    });
    // Recent payments
    const recent = [...payments].sort((a, b) => b.paymentDate.localeCompare(a.paymentDate)).slice(0, 10);
    // Top debtors
    const debtors = contracts
      .filter((c) => c.debtAmount > 0 && c.status === 'active')
      .sort((a, b) => b.debtAmount - a.debtAmount)
      .slice(0, 5);
    return { total, paid, debt, ratio, full, partial, none, byFac, months, byLevel, recent, debtors };
  }, [contracts, payments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPIs */}
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KpiCard icon="money" label="Jami kontrakt summasi" value={formatMoney(stats.total)}
          sub={`${contracts.length} ta kontrakt`} iconBg="#2DB976" onClick={() => onNav?.('moliya-contracts')} />
        <KpiCard icon="check" label="To'langan" value={formatMoney(stats.paid)}
          sub={`${stats.ratio}% yig'im`} iconBg="#3B82F6" onClick={() => onNav?.('moliya-payments')} />
        <KpiCard icon="warning" label="Qarzdorlik" value={formatMoney(stats.debt)}
          sub={`${contracts.filter((c) => c.debtAmount > 0).length} ta talaba`} iconBg="#F59E0B" onClick={() => onNav?.('moliya-debtors')} />
        <KpiCard icon="chart" label="Yig'im foizi" value={`${stats.ratio}%`}
          sub="Joriy o'quv yili"
          gradient="linear-gradient(135deg,#2DB976 0%,#0F766E 100%)" onClick={() => onNav?.('finance-report')} />
      </div>

      {/* Charts 2x2 */}
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ChartCard title="To'lov holati">
          <DonutChart
            centerValue={contracts.length} centerLabel="Kontrakt"
            segments={[
              { label: "To'liq to'langan", value: stats.full, color: '#2DB976' },
              { label: 'Qisman', value: stats.partial, color: '#F59E0B' },
              { label: "To'lanmagan", value: stats.none, color: '#EF4444' },
            ]} />
        </ChartCard>

        <ChartCard title="Fakultetlar bo'yicha yig'im">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats.byFac.map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12.5 }}>
                  <span style={{ color: '#334155', fontWeight: 500 }}>{f.label}</span>
                  <span style={{ color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{formatMoney(f.paid).replace(" so'm", '')} / <strong style={{ color: '#0F172A' }}>{f.pct}%</strong></span>
                </div>
                <ProgressMini value={f.paid} max={f.total} height={10} color="#2DB976" />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Oylik to'lovlar dinamikasi">
          <LineChart points={stats.months.map((m) => m.value || 0)} height={140} />
          <div style={{ display: 'flex', marginTop: 8 }}>
            {stats.months.map((m, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#64748B' }}>{m.label}</div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Kurslar bo'yicha">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180, padding: '10px 0' }}>
            {stats.byLevel.map((l, i) => {
              const max = Math.max(...stats.byLevel.map((x) => x.total)) || 1;
              const totalH = (l.total / max) * 100;
              const paidH = (l.paid / max) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', gap: 8 }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                    <div style={{ width: '100%', height: `${totalH}%`, background: '#FEE2E2', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${(l.paid / l.total) * 100}%`, background: '#2DB976', borderRadius: l.paid >= l.total ? '6px 6px 0 0' : 0 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{l.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8, fontSize: 12, color: '#64748B' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#2DB976', borderRadius: 3 }} />To'langan</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#FEE2E2', borderRadius: 3 }} />Qarz</span>
          </div>
        </ChartCard>
      </div>

      {/* Bottom panels */}
      <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>So'nggi to'lovlar</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFB' }}>
                <th style={th}>Sana</th>
                <th style={th}>Talaba</th>
                <th style={{ ...th, textAlign: 'right' }}>Summa</th>
                <th style={th}>Usul</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((p) => (
                <tr key={p.id}>
                  <td style={td}>{formatDate(p.paymentDate)}</td>
                  <td style={td}>{p.studentName}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: '#1B7A4E', fontVariantNumeric: 'tabular-nums' }}>{formatMoney(p.amount)}</td>
                  <td style={td}><PayMethodBadge method={p.paymentMethod} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Top qarzdorlar</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stats.debtors.map((d) => {
              const pct = Math.round((d.debtAmount / d.contractAmount) * 100);
              return (
                <div key={d.id} style={{ padding: 12, background: '#FEF2F2', borderRadius: 10, borderLeft: '3px solid #EF4444' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{d.studentName}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#B91C1C', fontVariantNumeric: 'tabular-nums' }}>{formatMoney(d.debtAmount)}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginBottom: 6 }}>{d.departmentName.split(' ').slice(0, 3).join(' ')} · {d.groupName}</div>
                  <ProgressMini value={d.debtAmount} max={d.contractAmount} color="#EF4444" />
                  <div style={{ fontSize: 11, color: '#B91C1C', marginTop: 4, fontWeight: 600 }}>Qarz: {pct}%</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
const th = { padding: '10px 12px', fontSize: 11, fontWeight: 600, color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' };
const td = { padding: '10px 12px', fontSize: 13, color: '#334155', borderBottom: '1px solid #F8FAFB' };

// =================== 2) KONTRAKTLAR ===================
const MoliyaContractsPage = () => {
  const { contracts, addContract, deleteContract } = useFinance();
  const [search, setSearch] = React.useState('');
  const [fType, setFType] = React.useState('all');
  const [fYear, setFYear] = React.useState('all');
  const [fFac, setFFac] = React.useState('all');
  const [fStatus, setFStatus] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const [createOpen, setCreateOpen] = React.useState(false);
  const [detailsOf, setDetailsOf] = React.useState(null);
  const [confirmDel, setConfirmDel] = React.useState(null);

  const filtered = React.useMemo(() => {
    return contracts.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.contractNumber.toLowerCase().includes(q) && !c.studentName.toLowerCase().includes(q)) return false;
      }
      if (fType !== 'all' && c.contractType !== fType) return false;
      if (fYear !== 'all' && c.educationYear !== fYear) return false;
      if (fFac !== 'all' && String(c.departmentId) !== String(fFac)) return false;
      if (fStatus !== 'all' && c.status !== fStatus) return false;
      return true;
    });
  }, [contracts, search, fType, fYear, fFac, fStatus]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div>
      {/* Toolbar */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 240px', minWidth: 220 }}>
            <Input leftIcon="search" placeholder="Kontrakt №, talaba nomi..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ width: 180 }}>
            <Select value={fType} onChange={setFType} options={[
              { value: 'all', label: 'Barcha turlari' },
              { value: 'bazoviy', label: 'Bazoviy' },
              { value: 'tabaqalashtirilgan', label: 'Tabaqalashtirilgan' },
              { value: 'grant', label: 'Grant' },
              { value: 'xorijiy', label: 'Xorijiy' },
            ]} />
          </div>
          <div style={{ width: 140 }}>
            <Select value={fYear} onChange={setFYear} options={[
              { value: 'all', label: 'Barcha yillar' },
              { value: '2025-2026', label: '2025-2026' },
              { value: '2024-2025', label: '2024-2025' },
              { value: '2023-2024', label: '2023-2024' },
            ]} />
          </div>
          <div style={{ width: 200 }}>
            <Select value={fFac} onChange={setFFac} options={[
              { value: 'all', label: 'Barcha fakultetlar' },
              ...FACULTIES.map((f) => ({ value: f.id, label: f.name.split(' ').slice(0, 3).join(' ') })),
            ]} />
          </div>
          <div style={{ width: 150 }}>
            <Select value={fStatus} onChange={setFStatus} options={[
              { value: 'all', label: 'Barcha holatlar' },
              { value: 'active', label: 'Faol' },
              { value: 'completed', label: 'Yakunlangan' },
              { value: 'cancelled', label: 'Bekor qilingan' },
            ]} />
          </div>
          <div style={{ flex: 1 }} />
          <Button variant="primary" icon="plus" onClick={() => setCreateOpen(true)}>Yangi kontrakt</Button>
        </div>
      </Card>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFB' }}>
              <th style={th}>#</th>
              <th style={th}>Kontrakt №</th>
              <th style={th}>Talaba</th>
              <th style={th}>Fakultet</th>
              <th style={th}>Kurs</th>
              <th style={th}>Turi</th>
              <th style={{ ...th, textAlign: 'right' }}>Summa</th>
              <th style={th}>To'langan</th>
              <th style={{ ...th, textAlign: 'right' }}>Qarz</th>
              <th style={th}>Holat</th>
              <th style={{ ...th, width: 50 }} />
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr><td colSpan={11}><EmptyState icon="doc" title="Kontraktlar topilmadi" hint="Filtrlarni o'zgartiring yoki yangi kontrakt qo'shing." /></td></tr>
            )}
            {pageRows.map((c, i) => {
              const pct = c.contractAmount > 0 ? Math.round((c.paidAmount / c.contractAmount) * 100) : 0;
              return (
                <tr key={c.id} onClick={() => setDetailsOf(c)} style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                  <td style={td}>{(page - 1) * pageSize + i + 1}</td>
                  <td style={{ ...td, fontWeight: 600, color: '#0F172A' }}>{c.contractNumber}</td>
                  <td style={td}>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{c.studentName}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>{c.groupName}</div>
                  </td>
                  <td style={{ ...td, fontSize: 12.5 }}>{c.departmentName.split(' ').slice(0, 2).join(' ')}</td>
                  <td style={td}>{c.level}</td>
                  <td style={td}><ContractTypeBadge type={c.contractType} /></td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(c.contractAmount)}</td>
                  <td style={{ ...td, minWidth: 140 }}>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(c.paidAmount)} ({pct}%)</div>
                    <ProgressMini value={c.paidAmount} max={c.contractAmount} />
                  </td>
                  <td style={{ ...td, textAlign: 'right', color: c.debtAmount > 0 ? '#B91C1C' : '#1B7A4E', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(c.debtAmount)}</td>
                  <td style={td}><ContractStatusBadge status={c.status} /></td>
                  <td style={td} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu trigger={<IconButton icon="more" label="Amallar" />} items={[
                      { icon: 'eye', label: 'Tafsilotlar', onClick: () => setDetailsOf(c) },
                      { icon: 'trash', label: "O'chirish", danger: true, onClick: () => setConfirmDel(c) },
                    ]} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9' }}>
          <Pagination page={page} total={totalPages} onChange={setPage} pageSize={pageSize} totalRows={filtered.length} />
        </div>
      </Card>

      {createOpen && <ContractCreateForm onClose={() => setCreateOpen(false)} onCreate={(data) => { addContract(data); window.showToast?.('Kontrakt yaratildi'); setCreateOpen(false); }} />}
      {detailsOf && <ContractDetailsSlide contract={detailsOf} onClose={() => setDetailsOf(null)} />}
      <ConfirmDialog open={!!confirmDel} title="Kontraktni o'chirish" message={`"${confirmDel?.contractNumber}" kontraktini o'chirishni tasdiqlaysizmi? Barcha bog'liq to'lovlar ham o'chiriladi.`}
        onConfirm={() => { deleteContract(confirmDel.id); window.showToast?.("Kontrakt o'chirildi", 'info'); }}
        onCancel={() => setConfirmDel(null)} />
    </div>
  );
};

// ----- Contract create form (SlideOver) -----
const ContractCreateForm = ({ onClose, onCreate }) => {
  const [student, setStudent] = React.useState(null);
  const [contractDate, setContractDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [contractType, setContractType] = React.useState('bazoviy');
  const [educationYear, setEducationYear] = React.useState('2025-2026');
  const [amount, setAmount] = React.useState('');
  const [schedule, setSchedule] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const { contracts } = useFinance();

  const contractNumber = `SH-2025/${String(contracts.length + 1).padStart(3, '0')}`;

  const generateSchedule = () => {
    const a = parseInt(amount, 10) || 0;
    if (a <= 0) return;
    const parts = 3;
    const part = Math.round(a / parts / 100000) * 100000;
    const rows = [];
    const base = new Date(contractDate);
    for (let i = 0; i < parts; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i * 3, 15);
      rows.push({ dueDate: d.toISOString().slice(0, 10), amount: i === parts - 1 ? a - part * (parts - 1) : part, paid: false });
    }
    setSchedule(rows);
  };

  const validate = () => {
    const e = {};
    if (!student) e.student = "Talabani tanlash shart";
    const a = parseInt(amount, 10);
    if (!amount || !a || a <= 0) e.amount = "Summa 0 dan katta bo'lishi kerak";
    if (!contractType) e.contractType = "Kontrakt turini tanlang";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const a = parseInt(amount, 10);
    onCreate({
      studentId: student.id,
      studentName: student.full_name,
      studentIdNumber: student.student_id_number,
      studentImage: student.image,
      departmentName: student.department?.name || '',
      departmentId: student.department?.id,
      groupName: student.group?.name || '',
      level: student.level?.name || '',
      specialty: student.specialty?.name || '',
      contractNumber, contractDate, contractType, educationYear,
      contractAmount: a,
      paymentSchedule: schedule.length > 0 ? schedule : [{ dueDate: contractDate, amount: a, paid: false }],
    });
  };

  const hasErrors = React.useMemo(() => {
    if (!student) return true;
    const a = parseInt(amount, 10);
    if (!amount || !a || a <= 0) return true;
    if (!contractType) return true;
    return false;
  }, [student, amount, contractType]);

  return (
    <SlideOver open={true} onClose={onClose} title="Yangi kontrakt"
      subtitle="Talabani tanlab, kontrakt ma'lumotlarini kiriting"
      width={620}
      actions={<>
        <Button variant="secondary" onClick={onClose}>Bekor qilish</Button>
        <Button variant="primary" icon="check" onClick={submit} disabled={hasErrors}>Saqlash</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Section title="1. Talabani tanlash">
          {!student && (
            <div>
              <StudentSearchInput onSelect={(s) => { setStudent(s); setErrors((prev) => ({ ...prev, student: undefined })); }} />
              {errors.student && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{errors.student}</div>}
            </div>
          )}
          {student && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#ECFDF5', borderRadius: 10, border: '1px solid #A7F3D0' }}>
              <Avatar initials={student.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('')} size={42} src={student.image} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{student.full_name}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{student.student_id_number} · {student.group?.name} · {student.level?.name}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{student.department?.name}</div>
              </div>
              <IconButton icon="x" onClick={() => setStudent(null)} />
            </div>
          )}
        </Section>

        <Section title="2. Kontrakt ma'lumotlari">
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Kontrakt raqami" value={contractNumber} disabled />
            <Input label="Sana" type="date" value={contractDate} onChange={(e) => setContractDate(e.target.value)} />
            <div>
              <Select label="Turi" value={contractType} onChange={(v) => { setContractType(v); setErrors((prev) => ({ ...prev, contractType: undefined })); }} options={[
                { value: 'bazoviy', label: 'Bazoviy' }, { value: 'tabaqalashtirilgan', label: 'Tabaqalashtirilgan' },
                { value: 'grant', label: 'Grant' }, { value: 'xorijiy', label: 'Xorijiy' },
              ]} />
              {errors.contractType && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.contractType}</div>}
            </div>
            <Select label="O'quv yili" value={educationYear} onChange={setEducationYear} options={['2025-2026', '2024-2025', '2023-2024']} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Kontrakt summasi (so'm)" type="number" placeholder="15 000 000" value={amount} onChange={(e) => { setAmount(e.target.value); setErrors((prev) => ({ ...prev, amount: undefined })); }} />
              {errors.amount && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.amount}</div>}
            </div>
          </div>
        </Section>

        <Section title="3. To'lov jadvali"
          right={<Button size="sm" variant="secondary" icon="plus" onClick={generateSchedule}>Jadval yaratish</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {schedule.length === 0 && <div style={{ fontSize: 13, color: '#64748B', padding: 14, background: '#F8FAFB', borderRadius: 8, textAlign: 'center' }}>Avto-jadval uchun summani kiriting va "Jadval yaratish" bosing</div>}
            {schedule.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="date" value={s.dueDate} onChange={(e) => setSchedule((x) => x.map((r, j) => j === i ? { ...r, dueDate: e.target.value } : r))}
                  style={{ flex: 1, height: 36, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'inherit', fontSize: 13 }} />
                <input type="number" value={s.amount} onChange={(e) => setSchedule((x) => x.map((r, j) => j === i ? { ...r, amount: parseInt(e.target.value, 10) || 0 } : r))}
                  style={{ flex: 1, height: 36, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'inherit', fontSize: 13 }} />
                <IconButton icon="trash" onClick={() => setSchedule((x) => x.filter((_, j) => j !== i))} />
              </div>
            ))}
            <button onClick={() => setSchedule((x) => [...x, { dueDate: new Date().toISOString().slice(0, 10), amount: 0, paid: false }])}
              style={{ marginTop: 4, padding: '8px', border: '1px dashed #CBD5E1', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: '#64748B' }}>
              + Qo'shish
            </button>
          </div>
        </Section>
      </div>
    </SlideOver>
  );
};

// ----- Contract details SlideOver -----
const ContractDetailsSlide = ({ contract, onClose }) => {
  const { payments, addPayment, deleteContract, deletePayment } = useFinance();
  const [payOpen, setPayOpen] = React.useState(false);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const cPayments = payments.filter((p) => p.contractId === contract.id).sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <SlideOver open={true} onClose={onClose} title="Kontrakt tafsiloti" subtitle={contract.contractNumber} width={620}
      actions={<>
        <Button variant="secondary" icon="x" onClick={() => setConfirmCancel(true)}>Bekor qilish</Button>
        <Button variant="primary" icon="plus" onClick={() => setPayOpen(true)}>To'lov qo'shish</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar initials={contract.studentName.split(' ').map((p) => p[0]).slice(0, 2).join('')} size={56} src={contract.studentImage} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{contract.studentName}</div>
            <div style={{ fontSize: 12.5, color: '#64748B' }}>ID: {contract.studentIdNumber}</div>
            <div style={{ fontSize: 12.5, color: '#64748B' }}>{contract.groupName} · {contract.level} · {contract.departmentName.split(' ').slice(0, 3).join(' ')}</div>
          </div>
          <ContractStatusBadge status={contract.status} />
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <SummaryBox label="Summa" value={formatMoney(contract.contractAmount)} />
          <SummaryBox label="To'langan" value={formatMoney(contract.paidAmount)} color="#1B7A4E" />
          <SummaryBox label="Qarz" value={formatMoney(contract.debtAmount)} color={contract.debtAmount > 0 ? '#B91C1C' : '#1B7A4E'} />
        </div>

        {/* Contract block */}
        <Section title="Kontrakt">
          <div style={{ background: '#F8FAFB', borderRadius: 10, padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
            <KV label="Raqami" value={contract.contractNumber} />
            <KV label="Sana" value={formatDate(contract.contractDate)} />
            <KV label="Turi" value={<ContractTypeBadge type={contract.contractType} />} />
            <KV label="O'quv yili" value={contract.educationYear} />
          </div>
        </Section>

        {/* Schedule */}
        <Section title="To'lov jadvali">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {contract.paymentSchedule.map((s, i) => {
              const overdue = !s.paid && s.dueDate < today;
              const status = s.paid ? { label: "To'langan", color: '#1B7A4E', bg: '#ECFDF5' } :
                overdue ? { label: 'Muddati o\'tgan', color: '#B91C1C', bg: '#FEF2F2' } :
                { label: "Kutilmoqda", color: '#B45309', bg: '#FFFBEB' };
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: status.bg, borderRadius: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{formatDate(s.dueDate)}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>{i + 1}-bo'lib</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(s.amount)}</div>
                  <span style={{ fontSize: 11.5, color: status.color, fontWeight: 600 }}>{status.label}</span>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Payment history */}
        <Section title={`To'lov tarixi (${cPayments.length})`}>
          {cPayments.length === 0 && <div style={{ fontSize: 13, color: '#64748B', padding: 14, background: '#F8FAFB', borderRadius: 8, textAlign: 'center' }}>Hali to'lovlar yo'q</div>}
          {cPayments.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: '#ECFDF5', color: '#1B7A4E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="money" size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{formatMoney(p.amount)}</div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>{formatDate(p.paymentDate)} · {p.receiptNumber}</div>
              </div>
              <PayMethodBadge method={p.paymentMethod} />
              <IconButton icon="trash" onClick={() => { deletePayment(p.id); window.showToast?.("To'lov o'chirildi", 'info'); }} />
            </div>
          ))}
        </Section>
      </div>

      {payOpen && <PaymentForm contractId={contract.id} student={contract} onClose={() => setPayOpen(false)}
        onSubmit={(p) => { addPayment(p); window.showToast?.("To'lov qabul qilindi"); setPayOpen(false); }} />}
      <ConfirmDialog open={confirmCancel} title="Kontraktni bekor qilish" message="Tasdiqlashni xohlaysizmi?" confirmLabel="Bekor qilish"
        onConfirm={() => { deleteContract(contract.id); onClose(); window.showToast?.("Kontrakt bekor qilindi", 'info'); }}
        onCancel={() => setConfirmCancel(false)} />
    </SlideOver>
  );
};

// ----- Section/KV helpers -----
const Section = ({ title, right, children }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', flex: 1 }}>{title}</div>
      {right}
    </div>
    {children}
  </div>
);

const KV = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{value}</div>
  </div>
);

const SummaryBox = ({ label, value, color = '#0F172A' }) => (
  <div style={{ background: '#F8FAFB', padding: 12, borderRadius: 10 }}>
    <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
  </div>
);

// =================== 3) QARZDORLAR ===================
const MoliyaDebtorsPage = () => {
  const { contracts, addPayment } = useFinance();
  const [bucket, setBucket] = React.useState('all');
  const [fFac, setFFac] = React.useState('all');
  const [fLevel, setFLevel] = React.useState('all');
  const [selected, setSelected] = React.useState(new Set());
  const [smsOpen, setSmsOpen] = React.useState(null); // contract or {bulk: true}
  const [payOpen, setPayOpen] = React.useState(null);

  const debtorsList = React.useMemo(() => {
    return contracts.filter((c) => c.debtAmount > 0).map((c) => {
      const pct = (c.debtAmount / c.contractAmount) * 100;
      const tier = pct > 70 ? 'critical' : pct >= 30 ? 'medium' : 'light';
      return { ...c, debtPct: pct, tier };
    }).sort((a, b) => b.debtAmount - a.debtAmount);
  }, [contracts]);

  const filtered = debtorsList.filter((d) => {
    if (bucket !== 'all' && d.tier !== bucket) return false;
    if (fFac !== 'all' && String(d.departmentId) !== String(fFac)) return false;
    if (fLevel !== 'all' && d.level !== fLevel) return false;
    return true;
  });

  const totalStudents = contracts.length;
  const debtorCount = debtorsList.length;
  const avgDebt = debtorsList.length > 0 ? debtorsList.reduce((s, d) => s + d.debtAmount, 0) / debtorsList.length : 0;

  return (
    <div>
      {/* KPIs */}
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard icon="users" label="Jami talabalar" value={totalStudents} sub="Kontrakt bo'yicha" iconBg="#3B82F6" />
        <KpiCard icon="warning" label="Qarzdor talabalar" value={debtorCount}
          sub={`${Math.round(debtorCount / totalStudents * 100)}% talabalardan`} iconBg="#F59E0B" />
        <KpiCard icon="money" label="O'rtacha qarzdorlik" value={formatMoney(avgDebt)} iconBg="#EF4444" />
      </div>

      {/* Bucket tabs */}
      <Tabs active={bucket} onChange={setBucket} tabs={[
        { id: 'all', label: 'Barchasi', count: debtorsList.length },
        { id: 'critical', label: 'Kritik', count: debtorsList.filter((d) => d.tier === 'critical').length },
        { id: 'medium', label: "O'rtacha", count: debtorsList.filter((d) => d.tier === 'medium').length },
        { id: 'light', label: 'Yengil', count: debtorsList.filter((d) => d.tier === 'light').length },
      ]} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ width: 220 }}>
          <Select value={fFac} onChange={setFFac} options={[{ value: 'all', label: 'Barcha fakultetlar' }, ...FACULTIES.map((f) => ({ value: f.id, label: f.name.split(' ').slice(0, 3).join(' ') }))]} />
        </div>
        <div style={{ width: 140 }}>
          <Select value={fLevel} onChange={setFLevel} options={[{ value: 'all', label: 'Barcha kurslar' }, '1-kurs', '2-kurs', '3-kurs', '4-kurs']} />
        </div>
        <div style={{ flex: 1 }} />
        {selected.size > 0 && <Button variant="secondary" icon="mail" onClick={() => setSmsOpen({ bulk: true })}>SMS yuborish ({selected.size})</Button>}
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFB' }}>
              <th style={{ ...th, width: 40 }}><Checkbox checked={selected.size === filtered.length && filtered.length > 0}
                onChange={(v) => setSelected(v ? new Set(filtered.map((d) => d.id)) : new Set())} /></th>
              <th style={th}>#</th>
              <th style={th}>Talaba</th>
              <th style={th}>Guruh</th>
              <th style={th}>Fakultet</th>
              <th style={{ ...th, textAlign: 'right' }}>Kontrakt</th>
              <th style={{ ...th, textAlign: 'right' }}>To'langan</th>
              <th style={{ ...th, textAlign: 'right' }}>Qarz</th>
              <th style={th}>%</th>
              <th style={{ ...th, textAlign: 'right', width: 110 }}>Amal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10}><EmptyState icon="check" title="Qarzdorlar yo'q" hint="Tanlangan filtrga mos qarzdorlar topilmadi" /></td></tr>
            )}
            {filtered.map((d, i) => {
              const tierColor = d.tier === 'critical' ? '#EF4444' : d.tier === 'medium' ? '#F59E0B' : '#2DB976';
              const isSelected = selected.has(d.id);
              return (
                <tr key={d.id} style={{ borderLeft: d.tier === 'critical' ? '3px solid #EF4444' : 'none' }}>
                  <td style={td}><Checkbox checked={isSelected} onChange={(v) => {
                    setSelected((s) => { const n = new Set(s); v ? n.add(d.id) : n.delete(d.id); return n; });
                  }} /></td>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>
                    <div style={{ fontWeight: 500, color: '#0F172A' }}>{d.studentName}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>{d.contractNumber}</div>
                  </td>
                  <td style={td}>{d.groupName}</td>
                  <td style={{ ...td, fontSize: 12.5 }}>{d.departmentName.split(' ').slice(0, 2).join(' ')}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatMoney(d.contractAmount)}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#1B7A4E' }}>{formatMoney(d.paidAmount)}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#B91C1C', fontWeight: 700 }}>{formatMoney(d.debtAmount)}</td>
                  <td style={{ ...td, minWidth: 100 }}>
                    <div style={{ fontSize: 12, color: tierColor, fontWeight: 600, marginBottom: 4 }}>{Math.round(d.debtPct)}%</div>
                    <ProgressMini value={d.debtAmount} max={d.contractAmount} color={tierColor} />
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <IconButton icon="money" label="To'lov" onClick={() => setPayOpen(d)} />
                    <IconButton icon="mail" label="SMS" onClick={() => setSmsOpen(d)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {payOpen && <PaymentForm contractId={payOpen.id} student={payOpen} onClose={() => setPayOpen(null)}
        onSubmit={(p) => { addPayment(p); window.showToast?.("To'lov kiritildi"); setPayOpen(null); }} />}
      {smsOpen && <SmsModal target={smsOpen} debtors={debtorsList.filter((d) => selected.has(d.id))} onClose={() => { setSmsOpen(null); setSelected(new Set()); }} />}
    </div>
  );
};

// ----- SMS modal -----
const SmsModal = ({ target, debtors, onClose }) => {
  const isBulk = target.bulk;
  const recipients = isBulk ? debtors : [target];
  const [text, setText] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const sample = recipients[0];
  const tpl = `Hurmatli ${sample?.studentName?.split(' ')[1] || '{name}'}, BITU shartnoma to'lovi bo'yicha ${sample ? formatMoney(sample.debtAmount) : '{debt}'} qarzdorligingiz mavjud. Iltimos, to'lovni amalga oshiring.`;
  React.useEffect(() => { setText(tpl); }, []);

  const handleSend = () => {
    setSent(true);
    window.showToast?.(`${recipients.length} ta SMS yuborildi`);
  };

  if (sent) {
    return (
      <Modal open={true} onClose={onClose} title="SMS yuborildi" width={520}
        footer={<Button variant="primary" onClick={onClose}>Yopish</Button>}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#16A34A' }}>SMS yuborildi</div>
          <div style={{ fontSize: 14, color: '#334155', textAlign: 'center' }}>
            <strong>{recipients.length}</strong> ta qabul qiluvchiga xabar muvaffaqiyatli yuborildi.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxHeight: 80, overflowY: 'auto' }}>
            {recipients.slice(0, 8).map((r) => <Badge key={r.id} variant="success" dot>{r.studentName}</Badge>)}
            {recipients.length > 8 && <Badge variant="neutral">+{recipients.length - 8}</Badge>}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={true} onClose={onClose} title={isBulk ? `SMS yuborish (${recipients.length})` : 'SMS yuborish'} width={520}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Bekor qilish</Button>
        <Button variant="primary" icon="mail" onClick={handleSend}>Yuborish</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Qabul qiluvchilar</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 100, overflowY: 'auto', padding: 8, background: '#F8FAFB', borderRadius: 8 }}>
            {recipients.slice(0, 12).map((r) => <Badge key={r.id} variant="info" dot>{r.studentName}</Badge>)}
            {recipients.length > 12 && <Badge variant="neutral">+{recipients.length - 12}</Badge>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Xabar</div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5}
            style={{ width: '100%', padding: 10, border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{text.length} belgi</div>
        </div>
      </div>
    </Modal>
  );
};

// ----- Payment form (Modal) -----
const PaymentForm = ({ contractId, student, onClose, onSubmit }) => {
  const { contracts } = useFinance();
  const c = contracts.find((x) => x.id === contractId) || student;
  const [amount, setAmount] = React.useState('');
  const [method, setMethod] = React.useState('bank');
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [receipt, setReceipt] = React.useState(`QT-${date.replace(/-/g, '')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`);
  const [note, setNote] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const maxDebt = c.debtAmount != null ? c.debtAmount : (c.contractAmount - c.paidAmount);

  const validate = () => {
    const e = {};
    const a = parseInt(amount, 10);
    if (!amount || !a || a <= 0) e.amount = "Summa 0 dan katta bo'lishi kerak";
    else if (a > maxDebt) e.amount = `Maksimal summa: ${formatMoney(maxDebt)}`;
    if (!method) e.method = "To'lov usulini tanlang";
    if (!date) e.date = "Sanani kiriting";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const a = parseInt(amount, 10);
    onSubmit({ contractId: c.id, studentId: c.studentId, studentName: c.studentName, amount: a, paymentDate: date, paymentMethod: method, receiptNumber: receipt, note });
  };

  const hasErrors = React.useMemo(() => {
    const a = parseInt(amount, 10);
    if (!amount || !a || a <= 0) return true;
    if (a > maxDebt) return true;
    if (!method) return true;
    if (!date) return true;
    return false;
  }, [amount, method, date, maxDebt]);

  return (
    <Modal open={true} onClose={onClose} title="Yangi to'lov" width={520}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Bekor qilish</Button>
        <Button variant="primary" icon="check" onClick={submit} disabled={hasErrors}>Saqlash</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: 12, background: '#F8FAFB', borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{c.studentName}</div>
          <div style={{ fontSize: 11.5, color: '#64748B' }}>{c.contractNumber}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
            <span style={{ color: '#64748B' }}>Summa: <strong style={{ color: '#0F172A' }}>{formatMoney(c.contractAmount)}</strong></span>
            <span style={{ color: '#64748B' }}>To'langan: <strong style={{ color: '#1B7A4E' }}>{formatMoney(c.paidAmount)}</strong></span>
            <span style={{ color: '#64748B' }}>Qoldiq: <strong style={{ color: '#B91C1C' }}>{formatMoney(maxDebt)}</strong></span>
          </div>
        </div>
        <div>
          <Input label="To'lov summasi (so'm)" type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setErrors((prev) => ({ ...prev, amount: undefined })); }} placeholder="5 000 000" />
          {errors.amount && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.amount}</div>}
        </div>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <Select label="Usul" value={method} onChange={(v) => { setMethod(v); setErrors((prev) => ({ ...prev, method: undefined })); }} options={[
              { value: 'bank', label: "Bank o'tkazmasi" }, { value: 'naqd', label: 'Naqd' },
              { value: 'click', label: 'Click' }, { value: 'payme', label: 'Payme' }, { value: 'online', label: 'Online' },
            ]} />
            {errors.method && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.method}</div>}
          </div>
          <div>
            <Input label="Sana" type="date" value={date} onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: undefined })); }} />
            {errors.date && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.date}</div>}
          </div>
        </div>
        <Input label="Kvitansiya raqami" value={receipt} onChange={(e) => setReceipt(e.target.value)} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Izoh (ixtiyoriy)</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
            style={{ width: '100%', padding: 10, border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
      </div>
    </Modal>
  );
};

Object.assign(window, {
  FinancePanelPage, MoliyaContractsPage, MoliyaDebtorsPage,
  PaymentForm, ContractCreateForm, ContractDetailsSlide,
  Section, KV, SummaryBox,
});
