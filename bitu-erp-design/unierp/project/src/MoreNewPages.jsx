// MoreNewPages.jsx — Notifications, ContractDetails + payment modal, StudentWizard, MessagesPage

// ========= BILDIRISHNOMALAR =========
const NotificationsPage = () => {
  const [filter, setFilter] = React.useState('all');
  const all = [
    { id: 1, type: 'payment', title: 'Yangi to\'lov qabul qilindi', desc: 'Abdullayev Jasur 4,500,000 so\'m to\'ladi (Kontrakt K-2024-1847)', time: '12 daqiqa oldin', read: false, icon: 'wallet', color: '#2DB976' },
    { id: 2, type: 'alert', title: 'Davomat ogohlantirish', desc: '301-A guruhida 8 ta talaba darsga kelmadi (Algoritmlar)', time: '1 soat oldin', read: false, icon: 'bell', color: '#F59E0B' },
    { id: 3, type: 'task', title: 'Yangi topshiriq tayinlandi', desc: 'Rektor sizga "Bahorgi sessiya hisoboti" topshirig\'ini yubordi', time: '2 soat oldin', read: false, icon: 'check', color: '#3B82F6' },
    { id: 4, type: 'alert', title: 'Kontrakt muddati tugaydi', desc: '14 ta kontraktning muddati 7 kun ichida tugaydi', time: '3 soat oldin', read: false, icon: 'clock', color: '#EF4444' },
    { id: 5, type: 'message', title: 'Karimov U.B. sizga xabar yubordi', desc: '"Ertangi imtihon biletlari bo\'yicha kelishib olsak..."', time: '5 soat oldin', read: true, icon: 'mail', color: '#8B5CF6' },
    { id: 6, type: 'payment', title: 'To\'lov kechiktirildi', desc: 'STU-2024-2145 — muddati 5 kun oldin o\'tgan', time: '8 soat oldin', read: true, icon: 'wallet', color: '#EF4444' },
    { id: 7, type: 'task', title: 'Topshiriq bajarildi', desc: 'Nazarova M. "Algoritmlar dars rejasi" ni yakunladi', time: 'kecha 18:42', read: true, icon: 'check', color: '#2DB976' },
    { id: 8, type: 'alert', title: 'Tizim yangilanishi', desc: 'Ertaga 03:00 — 04:00 oralig\'ida texnik ishlar rejalashtirilgan', time: 'kecha 14:20', read: true, icon: 'settings', color: '#64748B' },
    { id: 9, type: 'message', title: 'Ota-ona xabari', desc: 'Rahimova L. onasi Tursunova F. suhbat so\'radi', time: 'kecha 11:15', read: true, icon: 'users', color: '#8B5CF6' },
    { id: 10, type: 'payment', title: 'Stipendiya to\'landi', desc: '187 ta talabaga aprel stipendiyasi o\'tkazildi (124.6 mln so\'m)', time: '2 kun oldin', read: true, icon: 'wallet', color: '#2DB976' },
  ];

  const filtered = filter === 'all' ? all : filter === 'unread' ? all.filter(n => !n.read) : all.filter(n => n.type === filter);
  const unreadCount = all.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {[
          ['all', 'Barchasi', all.length],
          ['unread', 'O\'qilmagan', unreadCount],
          ['payment', 'To\'lovlar', all.filter(n => n.type === 'payment').length],
          ['alert', 'Ogohlantirishlar', all.filter(n => n.type === 'alert').length],
          ['task', 'Topshiriqlar', all.filter(n => n.type === 'task').length],
          ['message', 'Xabarlar', all.filter(n => n.type === 'message').length],
        ].map(([v, l, c]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: '7px 13px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${filter === v ? '#2DB976' : '#E2E8F0'}`,
            background: filter === v ? '#ECFDF5' : '#fff',
            color: filter === v ? '#1B7A4E' : '#475569',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            {l}
            <span style={{ background: filter === v ? '#2DB976' : '#F1F5F9', color: filter === v ? '#fff' : '#64748B',
                           padding: '1px 7px', borderRadius: 10, fontSize: 10.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{c}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => window.showToast?.('Hammasi o\'qilgan deb belgilandi')} style={{ background: 'none', border: 'none', color: '#2DB976', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Hammasini o'qish
        </button>
      </div>

      <Card padding={0}>
        {filtered.map((n, i) => (
          <div key={n.id} style={{
            display: 'flex', gap: 14, padding: '16px 18px',
            borderTop: i > 0 ? '1px solid #F1F5F9' : 'none',
            background: n.read ? '#fff' : 'linear-gradient(90deg,#F0FDF5 0%,#fff 80%)',
            position: 'relative',
          }}>
            {!n.read && <span style={{ position: 'absolute', left: 6, top: 24, width: 6, height: 6, borderRadius: 999, background: '#2DB976' }} />}
            <div style={{ width: 38, height: 38, borderRadius: 10, background: n.color + '20', color: n.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={n.icon} size={17} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 13.5, fontWeight: n.read ? 500 : 600, color: '#0F172A' }}>{n.title}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginLeft: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</div>
              </div>
              <div style={{ fontSize: 12.5, color: '#475569', marginTop: 3, lineHeight: 1.45 }}>{n.desc}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState icon="bell" title="Bildirishnomalar yo'q" hint="Bu kategoriyada hali hech narsa yo'q" />}
      </Card>
    </div>
  );
};

// ========= XABARLAR =========
const MessagesPage = () => {
  const [selected, setSelected] = React.useState(0);
  const threads = [
    { id: 0, name: 'Karimov Umid Baxtiyorovich', role: 'Professor, Algoritmlar', initials: 'KU', online: true, unread: 2, last: 'Ertangi imtihon biletlari bo\'yicha...', time: '14:32' },
    { id: 1, name: 'Nazarova Madina', role: 'Dotsent, Ma\'lumotlar bazasi', initials: 'NM', online: true, unread: 0, last: 'Rahmat, tushundim', time: '13:15' },
    { id: 2, name: '301-A guruh kuratori', role: 'Guruh chat', initials: '3A', group: true, unread: 5, last: 'Abdullayev J: men kasal bo\'ldim, ertaga kela...', time: '12:48' },
    { id: 3, name: 'Tursunova Farida (ota-ona)', role: 'Rahimova L. onasi', initials: 'TF', unread: 0, last: 'Qizimni bugun erta qo\'yib yuborsangiz...', time: 'kecha' },
    { id: 4, name: 'Rektorat e\'lonlari', role: 'Rasmiy kanal', initials: 'RE', group: true, unread: 1, last: '[Admin] 2026 yil qabul kvotalari...', time: 'kecha' },
    { id: 5, name: 'Saidov Rustam', role: 'Assistent, Tarmoqlar', initials: 'SR', unread: 0, last: 'Labor. jihozlari keldi', time: '2 kun' },
    { id: 6, name: 'HR bo\'lim', role: 'Xodimlar resurslari', initials: 'HR', unread: 0, last: 'Taʼtil arizangiz tasdiqlandi', time: '3 kun' },
  ];
  const current = threads[selected];
  const messages = [
    { from: 'them', text: 'Assalomu alaykum, Admin. Bir masala bor edi.', time: '14:20' },
    { from: 'me', text: 'Vaalaykum assalom, Umid Baxtiyorovich. Eshitaman.', time: '14:22' },
    { from: 'them', text: 'Ertangi algoritmlar imtihoniga biletlarni yangilab qo\'ysak bo\'larmidi? O\'tgan yilgi biletlar ba\'zi talabalarga oldindan tarqalib ketgan.', time: '14:28' },
    { from: 'them', text: 'Yangi 20 ta bilet tayyorladim, sizga yuboraman.', time: '14:29' },
    { from: 'me', text: 'Albatta, yuboring. Men tizimga yuklayman va 22-iyun uchun tayinlayman.', time: '14:30' },
    { from: 'them', text: 'Rahmat! Yana bir savol — imtihon o\'rniga yangi auditoriya beriladimi? 301-xona kichik.', time: '14:32' },
  ];

  return (
    <div style={{ display: 'flex', gap: 0, background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', height: 'calc(100vh - 160px)' }}>
      <div style={{ width: 320, borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 14, borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}><Icon name="search" size={14} /></span>
            <input placeholder="Qidirish..." style={{ width: '100%', height: 34, padding: '0 12px 0 32px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12.5, fontFamily: 'inherit', background: '#F8FAFB', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {threads.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)} style={{
              width: '100%', padding: '12px 14px', display: 'flex', gap: 10, border: 'none',
              background: selected === t.id ? '#F0FDF5' : 'transparent',
              borderLeft: `3px solid ${selected === t.id ? '#2DB976' : 'transparent'}`,
              textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', alignItems: 'center',
              borderBottom: '1px solid #F8FAFB',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar initials={t.initials} size={40} color={t.group ? 'slate' : (t.id % 2 ? 'blue' : 'primary')} />
                {t.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 999, background: '#2DB976', border: '2px solid #fff' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t.name}</div>
                  <div style={{ fontSize: 10.5, color: '#94A3B8', marginLeft: 6, flexShrink: 0 }}>{t.time}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <div style={{ fontSize: 11.5, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t.last}</div>
                  {t.unread > 0 && <span style={{ background: '#2DB976', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{t.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={current.initials} size={38} color={current.group ? 'slate' : 'blue'} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{current.name}</div>
            <div style={{ fontSize: 11.5, color: current.online ? '#2DB976' : '#94A3B8' }}>
              {current.online ? '● Onlayn' : current.role}
            </div>
          </div>
          <IconButton icon="search" label="" />
          <IconButton icon="more" label="" />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#F8FAFB', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%', padding: '9px 14px',
                background: m.from === 'me' ? '#2DB976' : '#fff',
                color: m.from === 'me' ? '#fff' : '#0F172A',
                borderRadius: m.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                boxShadow: '0 1px 2px rgba(0,0,0,.05)',
              }}>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
                <div style={{ fontSize: 10, marginTop: 3, opacity: 0.7, textAlign: 'right' }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center' }}>
          <IconButton icon="plus" label="Fayl biriktirish" />
          <input placeholder="Xabar yozing..." style={{ flex: 1, height: 40, padding: '0 14px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', background: '#F8FAFB', outline: 'none' }} />
          <Button variant="primary" size="sm" icon="mail">Yuborish</Button>
        </div>
      </div>
    </div>
  );
};

// ========= KONTRAKT BATAFSIL + TO'LOV MODALI =========
const ContractDetailsPage = ({ contractId, onBack }) => {
  const [payOpen, setPayOpen] = React.useState(false);
  const [method, setMethod] = React.useState('click');
  const [amount, setAmount] = React.useState('4500000');

  const c = {
    id: contractId || 'K-2024-1847',
    student: STUDENTS[0],
    type: 'Kontrakt',
    faculty: 'Axborot texnologiyalari',
    course: 2,
    year: '2025-2026',
    total: 18000000,
    paid: 13500000,
    currency: 'UZS',
    startDate: '01.09.2024',
    endDate: '30.06.2028',
    status: 'Faol',
    signedBy: 'Abdullayev Jasur (talaba) va Ibragimov O.M. (rektor)',
  };
  const remaining = c.total - c.paid;
  const payments = [
    { id: 1, date: '15.09.2025', amount: 4500000, method: 'Click', status: 'Tasdiqlangan', ref: 'CLK-8472619' },
    { id: 2, date: '10.12.2025', amount: 4500000, method: 'Payme', status: 'Tasdiqlangan', ref: 'PM-4720183' },
    { id: 3, date: '20.02.2026', amount: 4500000, method: 'Bank', status: 'Tasdiqlangan', ref: 'NBU-92184' },
    { id: 4, date: '25.05.2026', amount: 4500000, method: '—', status: 'Kutilmoqda', ref: '—' },
  ];

  return (
    <>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 13, display: 'inline-flex', gap: 6, alignItems: 'center', padding: 0, marginBottom: 14, fontFamily: 'inherit' }}>
        <Icon name="arrowLeft" size={14} /> Kontraktlar ro'yxati
      </button>

      <Card padding={22} style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{ width: 56, height: 70, borderRadius: 8, background: 'linear-gradient(135deg,#2DB976,#1B7A4E)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="doc" size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>№ {c.id}</h2>
              <Badge variant="success" dot>{c.status}</Badge>
              <Badge variant="info">{c.type}</Badge>
            </div>
            <div style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>
              {c.student.name.full} · {c.faculty} · {c.course}-kurs · {c.year}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,auto)', gap: '12px 28px', marginTop: 16 }}>
              <InfoCell label="Imzolangan" value={c.startDate} />
              <InfoCell label="Tugash sanasi" value={c.endDate} />
              <InfoCell label="Umumiy summa" value={c.total.toLocaleString('ru-RU') + ' so\'m'} />
              <InfoCell label="Qolgan" value={remaining.toLocaleString('ru-RU') + ' so\'m'} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button variant="primary" icon="wallet" onClick={() => setPayOpen(true)}>To'lov qilish</Button>
            <Button variant="secondary" size="sm" icon="upload">PDF</Button>
          </div>
        </div>

        <div style={{ marginTop: 22, padding: 16, background: '#F8FAFB', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, color: '#64748B' }}>To'lov holati</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
              {c.paid.toLocaleString('ru-RU')} / {c.total.toLocaleString('ru-RU')} so'm
            </div>
          </div>
          <div style={{ height: 10, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${(c.paid/c.total)*100}%`, height: '100%', background: 'linear-gradient(90deg,#2DB976,#34D399)', borderRadius: 999 }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 11.5, color: '#64748B' }}>
            {((c.paid/c.total)*100).toFixed(1)}% to'langan · Keyingi to'lov: 25.05.2026
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: 18, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>To'lovlar tarixi</div>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" icon="upload">Eksport</Button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFB' }}>{['Sana','Summa','Usul','Tranzaksiya','Status'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{p.date}</td>
                <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{p.amount.toLocaleString('ru-RU')} so'm</td>
                <td style={{ padding: '12px 14px' }}>{p.method !== '—' ? <Badge variant="info">{p.method}</Badge> : <span style={{ color: '#94A3B8' }}>—</span>}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', fontFamily: 'monospace' }}>{p.ref}</td>
                <td style={{ padding: '12px 14px' }}><Badge variant={p.status === 'Tasdiqlangan' ? 'success' : 'warning'} dot>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title="To'lov qabul qilish" width={520}
        footer={<>
          <Button variant="secondary" onClick={() => setPayOpen(false)}>Bekor qilish</Button>
          <Button variant="primary" icon="check" onClick={() => { setPayOpen(false); window.showToast?.(`${Number(amount).toLocaleString('ru-RU')} so'm to'lov qabul qilindi`); }}>Tasdiqlash</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 14, background: '#F0FDF5', borderRadius: 10, borderLeft: '3px solid #2DB976' }}>
            <div style={{ fontSize: 12, color: '#64748B' }}>Talaba</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{c.student.name.full}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Kontrakt: {c.id} · Qolgan: {remaining.toLocaleString('ru-RU')} so'm</div>
          </div>

          <Input label="Summa (so'm)" value={amount} onChange={e => setAmount(e.target.value)} />

          <div>
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 8, fontWeight: 500 }}>To'lov usuli</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[['click','Click','wallet'],['payme','Payme','wallet'],['bank','Bank','building'],['cash','Naqd','money']].map(([v, l, ic]) => (
                <button key={v} onClick={() => setMethod(v)} style={{
                  padding: '12px 8px', borderRadius: 10, border: `1.5px solid ${method === v ? '#2DB976' : '#E2E8F0'}`,
                  background: method === v ? '#F0FDF5' : '#fff', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <Icon name={ic} size={20} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: method === v ? '#1B7A4E' : '#0F172A' }}>{l}</span>
                </button>
              ))}
            </div>
          </div>

          <Input label="Kvitansiya raqami (ixtiyoriy)" placeholder="Tranzaksiya ID yoki chek raqami" />
        </div>
      </Modal>
    </>
  );
};

// ========= TALABA QO'SHISH WIZARD =========
const StudentWizard = ({ onClose, onDone }) => {
  const [step, setStep] = React.useState(0);
  const steps = ['Shaxsiy ma\'lumotlar', 'O\'quv ma\'lumotlari', 'Kontrakt', 'Tasdiqlash'];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#F8FAFB', zIndex: 999, overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 13, display: 'inline-flex', gap: 6, alignItems: 'center', padding: 0, fontFamily: 'inherit' }}>
          <Icon name="x" size={16} /> Chiqish
        </button>
        <div style={{ width: 1, height: 20, background: '#E2E8F0' }} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Yangi talaba qo'shish</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>Qadam {step + 1} / {steps.length}: {steps[step]}</div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '28px auto', padding: '0 20px' }}>
        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: i < step ? '#2DB976' : i === step ? '#fff' : '#E2E8F0',
                  border: i === step ? '2px solid #2DB976' : 'none',
                  color: i < step ? '#fff' : i === step ? '#2DB976' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                }}>
                  {i < step ? <Icon name="check" size={14} stroke={3} /> : i + 1}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: i === step ? 600 : 500, color: i <= step ? '#0F172A' : '#94A3B8' }}>{s}</div>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#2DB976' : '#E2E8F0', borderRadius: 2 }} />}
            </React.Fragment>
          ))}
        </div>

        <Card padding={24}>
          {step === 0 && <WizardStep1 />}
          {step === 1 && <WizardStep2 />}
          {step === 2 && <WizardStep3 />}
          {step === 3 && <WizardStep4 />}
        </Card>

        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'space-between' }}>
          <Button variant="secondary" onClick={() => step === 0 ? onClose() : setStep(step - 1)} icon="arrowLeft">
            {step === 0 ? 'Bekor qilish' : 'Orqaga'}
          </Button>
          {step < steps.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              Keyingi qadam
            </Button>
          ) : (
            <Button variant="primary" icon="check" onClick={() => { window.showToast?.('Talaba muvaffaqiyatli qo\'shildi'); onDone?.(); }}>
              Talabani ro'yxatga olish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const WizardStep1 = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
    <Input label="Familiya *" placeholder="Abdullayev" />
    <Input label="Ism *" placeholder="Jasur" />
    <Input label="Otasining ismi" placeholder="Baxtiyorovich" />
    <Input label="Tug'ilgan sana *" type="date" />
    <Input label="JSHSHIR *" placeholder="3 21 05 11111110 0023" />
    <Input label="Pasport seriya-raqami" placeholder="AB 1234567" />
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Jinsi *</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <label style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}><input type="radio" name="g" defaultChecked /> Erkak</label>
        <label style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}><input type="radio" name="g" /> Ayol</label>
      </div>
    </div>
    <Input label="Millati" placeholder="O'zbek" />
    <Input label="Telefon *" placeholder="+998 90 123-45-67" leftIcon="mail" />
    <Input label="Email" placeholder="jasur@mail.uz" leftIcon="mail" />
    <Input label="Manzil" placeholder="Navoiy sh., Mustaqillik k., 42" style={{ gridColumn: 'span 2' }} />
  </div>
);

const WizardStep2 = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Fakultet *</div>
      <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
        <option>Axborot texnologiyalari</option><option>Iqtisodiyot</option><option>Tog'-kon ishi</option><option>Energetika</option>
      </select>
    </div>
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Yo'nalish *</div>
      <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
        <option>5330500 — Kompyuter injiniringi</option>
      </select>
    </div>
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Kurs *</div>
      <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
        <option>1-kurs</option><option>2-kurs</option><option>3-kurs</option><option>4-kurs</option>
      </select>
    </div>
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Guruh *</div>
      <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
        <option>101-A</option><option>101-B</option><option>102-A</option>
      </select>
    </div>
    <Input label="DTM balli" placeholder="156.4" />
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Ta'lim shakli *</div>
      <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
        <option>Kunduzgi</option><option>Sirtqi</option><option>Kechki</option>
      </select>
    </div>
    <Input label="Qabul sanasi" type="date" />
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Til</div>
      <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
        <option>O'zbek</option><option>Rus</option><option>Ingliz</option>
      </select>
    </div>
  </div>
);

const WizardStep3 = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
    <div style={{ gridColumn: 'span 2', padding: 14, background: '#F0FDF5', borderRadius: 10, borderLeft: '3px solid #2DB976' }}>
      <div style={{ fontSize: 13, color: '#1B7A4E', fontWeight: 600 }}>Ta'lim turi: Kontrakt</div>
      <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>2025-2026 o'quv yili uchun tarif: 18,000,000 so'm (yiliga)</div>
    </div>
    <Input label="Kontrakt raqami *" defaultValue="K-2026-0428" />
    <Input label="Imzolanish sanasi" type="date" />
    <Input label="Umumiy summa (so'm)" defaultValue="18000000" />
    <Input label="Valyuta" defaultValue="UZS" />
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>To'lov grafigi</div>
      <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
        <option>4 ta qism (har chorakda)</option><option>2 ta qism (semestrda)</option><option>Bir martalik</option>
      </select>
    </div>
    <div>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 500 }}>Dastlabki to'lov</div>
      <Input placeholder="4,500,000" />
    </div>
  </div>
);

const WizardStep4 = () => (
  <div>
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: 999, background: '#D1FAE5', color: '#1B7A4E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon name="check" size={28} stroke={3} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Ma'lumotlarni tekshiring</div>
      <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Quyidagi ma'lumotlar to'g'ri bo'lsa, "Ro'yxatga olish" tugmasini bosing</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px 32px' }}>
      <ReviewRow label="F.I.O." value="Abdullayev Jasur Baxtiyorovich" />
      <ReviewRow label="Tug'ilgan sana" value="12.05.2006" />
      <ReviewRow label="JSHSHIR" value="3 21 05 11111110 0023" />
      <ReviewRow label="Jinsi" value="Erkak" />
      <ReviewRow label="Telefon" value="+998 90 123-45-67" />
      <ReviewRow label="Email" value="jasur@mail.uz" />
      <ReviewRow label="Fakultet" value="Axborot texnologiyalari" />
      <ReviewRow label="Guruh" value="101-A · 1-kurs · Kunduzgi" />
      <ReviewRow label="Ta'lim turi" value="Kontrakt · 18,000,000 so'm/yil" />
      <ReviewRow label="Kontrakt raqami" value="K-2026-0428" />
      <ReviewRow label="To'lov grafigi" value="4 ta qism (har chorakda)" />
      <ReviewRow label="Dastlabki to'lov" value="4,500,000 so'm" />
    </div>
  </div>
);

const ReviewRow = ({ label, value }) => (
  <div style={{ paddingBottom: 10, borderBottom: '1px solid #F1F5F9' }}>
    <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    <div style={{ fontSize: 13.5, color: '#0F172A', fontWeight: 500, marginTop: 3 }}>{value}</div>
  </div>
);

Object.assign(window, { NotificationsPage, MessagesPage, ContractDetailsPage, StudentWizard });
