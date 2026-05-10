// StubPages.jsx — placeholders for menu items that don't have full pages yet

const StubPage = ({ title, desc, icon = 'box', items = [], color = '#605BFF' }) => (
  <div style={{ maxWidth: 1100 }}>
    <div style={{
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16,
      padding: '32px 28px', display: 'flex', gap: 20, alignItems: 'flex-start',
      marginBottom: 18,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: `${color}15`, color, display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <Icon name={icon} size={28} />
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{title}</h2>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#64748B', lineHeight: 1.55 }}>{desc}</p>
      </div>
      <Badge variant="warning">Tez orada</Badge>
    </div>

    {items.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
            padding: '18px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${color}12`, color, display: 'grid', placeItems: 'center',
              }}>
                <Icon name={it.icon || 'check'} size={18} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{it.title}</div>
            </div>
            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{it.desc}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ============== STAFFING (Shtatlash jadvali) ==============
const StaffingPage = () => (
  <StubPage
    title="Shtatlash jadvali"
    desc="Tashkilotning shtat birliklari, lavozimlar va bo'sh ish o'rinlari moduli. Hozirda yangi Kadrlar bo'limidan foydalaning."
    icon="layers"
    color="#605BFF"
    items={[
      { icon: 'users', title: 'Shtat birliklari', desc: 'Lavozimlar va ularning soni bo\'yicha to\'liq ro\'yxat' },
      { icon: 'briefcase', title: 'Bo\'sh o\'rinlar', desc: 'Vakansiyalar va ularni to\'ldirish jarayoni' },
      { icon: 'chart', title: 'Statistika', desc: 'Bo\'limlar bo\'yicha shtat to\'ldiruvchanlik darajasi' },
    ]}
  />
);

// ============== CRM REPORT ==============
const CrmReportPage = () => (
  <StubPage
    title="CRM Hisobot"
    desc="Qabul jarayoni bo'yicha analitik hisobotlar — manbalar, konversiya, mas'ul xodimlar samaradorligi."
    icon="chart"
    color="#3B82F6"
    items={[
      { icon: 'inbox', title: 'Manbalar bo\'yicha', desc: 'Qaysi kanallardan ko\'proq arizalar kelgan' },
      { icon: 'chart', title: 'Konversiya', desc: 'Voronka bosqichlari bo\'yicha o\'tish foizlari' },
      { icon: 'users', title: 'Xodimlar', desc: 'Mas\'ul xodimlar samaradorligi' },
      { icon: 'calendar', title: 'Vaqt bo\'yicha', desc: 'Oylik va haftalik dinamika' },
    ]}
  />
);

// ============== TRANSPORT ==============
const TransportPage = () => (
  <StubPage
    title="Transport"
    desc="Universitet transport vositalarini boshqarish: avtomobillar, haydovchilar, yo'nalishlar, yoqilg'i hisobi."
    icon="truck"
    color="#F59E0B"
    items={[
      { icon: 'truck', title: 'Avtopark', desc: 'Barcha transport vositalari ro\'yxati va texnik holati' },
      { icon: 'user', title: 'Haydovchilar', desc: 'Shtatdagi haydovchilar va smenalar' },
      { icon: 'calendar', title: 'Buyurtmalar', desc: 'Transport buyurtmalari va marshrutlar' },
      { icon: 'wallet', title: 'Yoqilg\'i', desc: 'Yoqilg\'i sarfi va xarajatlar' },
    ]}
  />
);

// ============== CONFERENCES ==============
const ConferencesPage = () => (
  <StubPage
    title="Konferensiyalar"
    desc="Universitet tomonidan tashkil qilingan va xodimlar ishtirok etgan ilmiy konferensiyalar."
    icon="megaphone"
    color="#10B981"
    items={[
      { icon: 'calendar', title: 'Rejalashtirilgan', desc: 'Yaqin oylarda bo\'ladigan konferensiyalar' },
      { icon: 'check', title: 'O\'tkazilgan', desc: 'Arxiv: o\'tkazilgan tadbirlar va materiallar' },
      { icon: 'users', title: 'Ishtirokchilar', desc: 'Xodimlarning ishtiroki bo\'yicha statistika' },
      { icon: 'doc', title: 'Maqolalar', desc: 'Konferensiya to\'plamlariga taqdim etilgan ishlar' },
    ]}
  />
);

// ============== PATENTS ==============
const PatentsPage = () => (
  <StubPage
    title="Patentlar"
    desc="Universitet xodimlari tomonidan olingan patentlar, mualliflik guvohnomalari va intellektual mulk."
    icon="star"
    color="#EF4444"
    items={[
      { icon: 'star', title: 'Faol patentlar', desc: 'Kuchda bo\'lgan patentlar ro\'yxati' },
      { icon: 'doc', title: 'Arizalar', desc: 'Patent olish uchun topshirilgan arizalar' },
      { icon: 'users', title: 'Mualliflar', desc: 'Patent egalari va mualliflik ulushi' },
      { icon: 'wallet', title: 'Royalty', desc: 'Litsenziya va daromad hisoboti' },
    ]}
  />
);

// ============== EQUIPMENT (alternative if not present) ==============
// JihozlarPage already exists in MorePages — skip

// ============== SUBJECTS (alternative) ==============
// FanlarPage already exists — skip
