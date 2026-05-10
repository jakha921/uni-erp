// dataStore.jsx — Yagona ma'lumot manbai (FK bilan normalizatsiya qilingan)
// Mavjud data.jsx ni o'zgartirmaydi — yangi modullar shu store orqali ishlaydi.
// Hook: useEntityStore('talabalar') => { items, add, update, remove, get, count }
// Singleton: window.DataStore — bevosita ham o'qish/yozish mumkin.

(function () {
  const LS_KEY = 'unierp.datastore.v1';

  // ------- SCHEMA / SEED -------
  const seed = () => {
    const fakultetlar = [
      { id: 1, nomi: "Tibbiyot fakulteti", dekan: "Rahimov A.S.", talabalar_soni: 820, asos_yili: 1991 },
      { id: 2, nomi: "Iqtisodiyot fakulteti", dekan: "Saidova M.K.", talabalar_soni: 645, asos_yili: 1995 },
      { id: 3, nomi: "Pedagogika fakulteti", dekan: "Yusupov O.R.", talabalar_soni: 580, asos_yili: 1992 },
      { id: 4, nomi: "Filologiya fakulteti", dekan: "Karimova D.B.", talabalar_soni: 420, asos_yili: 1991 },
      { id: 5, nomi: "Tog'-kon fakulteti", dekan: "Aliyev J.K.", talabalar_soni: 480, asos_yili: 1993 },
      { id: 6, nomi: "Axborot texnologiyalari", dekan: "Tursunov B.X.", talabalar_soni: 302, asos_yili: 2010 },
    ];

    const kafedralar = [
      { id: 1, nomi: "Ichki kasalliklar", fakultet_id: 1, mudir: "Aliyev J.K.", oqituvchilar_soni: 12 },
      { id: 2, nomi: "Jarrohlik", fakultet_id: 1, mudir: "Nazarov R.S.", oqituvchilar_soni: 9 },
      { id: 3, nomi: "Iqtisodiy nazariya", fakultet_id: 2, mudir: "Saidova M.K.", oqituvchilar_soni: 8 },
      { id: 4, nomi: "Marketing", fakultet_id: 2, mudir: "Komilov A.T.", oqituvchilar_soni: 6 },
      { id: 5, nomi: "Pedagogika nazariyasi", fakultet_id: 3, mudir: "Yusupov O.R.", oqituvchilar_soni: 7 },
      { id: 6, nomi: "Psixologiya", fakultet_id: 3, mudir: "Rasulova S.N.", oqituvchilar_soni: 5 },
      { id: 7, nomi: "O'zbek adabiyoti", fakultet_id: 4, mudir: "Karimova D.B.", oqituvchilar_soni: 6 },
      { id: 8, nomi: "Tog'-kon mashinalari", fakultet_id: 5, mudir: "Aliyev J.K.", oqituvchilar_soni: 8 },
      { id: 9, nomi: "Geologiya", fakultet_id: 5, mudir: "Sharipov F.M.", oqituvchilar_soni: 6 },
      { id: 10, nomi: "Dasturiy injiniring", fakultet_id: 6, mudir: "Tursunov B.X.", oqituvchilar_soni: 9 },
      { id: 11, nomi: "Ma'lumotlar tahlili", fakultet_id: 6, mudir: "Mirzayev D.I.", oqituvchilar_soni: 5 },
    ];

    const yonalishlar = [
      { id: 1, nomi: "Davolash ishi", fakultet_id: 1, kod: "5A510201" },
      { id: 2, nomi: "Pediatriya", fakultet_id: 1, kod: "5A510202" },
      { id: 3, nomi: "Iqtisodiyot", fakultet_id: 2, kod: "5A230101" },
      { id: 4, nomi: "Marketing", fakultet_id: 2, kod: "5A230401" },
      { id: 5, nomi: "Boshlang'ich ta'lim", fakultet_id: 3, kod: "5A110100" },
      { id: 6, nomi: "Ona tili va adabiyoti", fakultet_id: 4, kod: "5A120100" },
      { id: 7, nomi: "Tog'-kon ishi", fakultet_id: 5, kod: "5A340500" },
      { id: 8, nomi: "Geologiya va razvedka", fakultet_id: 5, kod: "5A340201" },
      { id: 9, nomi: "Dasturiy injiniring", fakultet_id: 6, kod: "5A330200" },
      { id: 10, nomi: "Axborot tizimlari", fakultet_id: 6, kod: "5A330500" },
    ];

    const guruhlar = [
      { id: 1, nomi: "DA-301", yonalish_id: 1, kurs: 3, talabalar_soni: 28 },
      { id: 2, nomi: "DA-302", yonalish_id: 1, kurs: 3, talabalar_soni: 26 },
      { id: 3, nomi: "PE-201", yonalish_id: 2, kurs: 2, talabalar_soni: 24 },
      { id: 4, nomi: "IQ-401", yonalish_id: 3, kurs: 4, talabalar_soni: 30 },
      { id: 5, nomi: "MK-201", yonalish_id: 4, kurs: 2, talabalar_soni: 25 },
      { id: 6, nomi: "BT-101", yonalish_id: 5, kurs: 1, talabalar_soni: 32 },
      { id: 7, nomi: "OT-302", yonalish_id: 6, kurs: 3, talabalar_soni: 22 },
      { id: 8, nomi: "TK-301", yonalish_id: 7, kurs: 3, talabalar_soni: 27 },
      { id: 9, nomi: "GR-401", yonalish_id: 8, kurs: 4, talabalar_soni: 23 },
      { id: 10, nomi: "DI-201", yonalish_id: 9, kurs: 2, talabalar_soni: 30 },
      { id: 11, nomi: "DI-301", yonalish_id: 9, kurs: 3, talabalar_soni: 28 },
      { id: 12, nomi: "AT-101", yonalish_id: 10, kurs: 1, talabalar_soni: 26 },
    ];

    const ISMLAR_M = ['Bekzod', 'Jasur', 'Sardor', 'Otabek', 'Aziz', 'Doniyor', 'Akbar', 'Bobur', 'Murod', 'Shavkat', 'Davron', 'Olim', 'Sherzod', 'Komron', 'Rustam'];
    const ISMLAR_F = ['Nilufar', 'Dilnoza', 'Zarina', 'Madina', 'Gulnoza', 'Sevara', 'Kamola', 'Shahnoza', 'Mavluda', 'Nigora', 'Munisa', 'Lobar'];
    const FAMILIYALAR = ['Karimov', 'Aliyev', 'Tursunov', 'Yusupov', 'Saidov', 'Rahimov', 'Nasriddinov', 'Komilov', 'Sharipov', 'Mirzayev', 'Hakimov', 'Sodiqov', 'Nazarov', 'Rasulov'];
    const OTASI = ['Bahodirovich', 'Akmalovich', 'Sherzodovich', 'Komilovich', 'Rashidovich', 'Anvarovich', 'Olimovich', 'Davronovich'];
    const OTASI_F = ['Bahodirovna', 'Akmalovna', 'Sherzodovna', 'Komilovna', 'Rashidovna', 'Anvarovna', 'Olimovna', 'Davronovna'];

    const r = (n, mod) => Math.floor(Math.abs(Math.sin(n * 12.9898 + 78.233) * 43758.5453) % mod);

    const talabalar = Array.from({ length: 28 }, (_, i) => {
      const isF = r(i + 100, 100) < 45;
      return {
        id: i + 1,
        ism: isF ? ISMLAR_F[r(i + 110, ISMLAR_F.length)] : ISMLAR_M[r(i + 110, ISMLAR_M.length)],
        familiya: FAMILIYALAR[r(i + 120, FAMILIYALAR.length)],
        otasi: isF ? OTASI_F[r(i + 130, OTASI_F.length)] : OTASI[r(i + 130, OTASI.length)],
        jinsi: isF ? 'F' : 'M',
        guruh_id: 1 + r(i + 140, guruhlar.length),
        telefon: `+99890${1000000 + r(i + 150, 9000000)}`,
        email: `talaba${i + 1}@nuni.uz`,
        tugilgan_sana: `${1 + r(i + 160, 28)}.${1 + r(i + 161, 12)}.${2003 + r(i + 162, 4)}`,
        passport: `AA${1000000 + r(i + 170, 9000000)}`,
        manzil: `Navoiy sh., ${pick(['Shifo', 'Ozodlik', 'Mustaqillik', "G'allaaorol"], i + 180)} ko'chasi, ${1 + r(i + 181, 99)}-uy`,
        holat: i % 17 === 0 ? 'akademik_tatil' : i % 23 === 0 ? 'chetlatilgan' : 'faol',
        qabul_sanasi: `01.09.${2022 + r(i + 190, 4)}`,
        kontrakt_summa: [10500000, 12500000, 14000000, 16500000][r(i + 200, 4)],
        tolangan: 0, // populated below from kontraktlar
      };
    });
    function pick(arr, n) { return arr[r(n, arr.length)]; }

    const oqituvchilar = Array.from({ length: 16 }, (_, i) => {
      const isF = i % 3 === 1;
      return {
        id: i + 1,
        ism: isF ? ISMLAR_F[r(i + 300, ISMLAR_F.length)] : ISMLAR_M[r(i + 300, ISMLAR_M.length)],
        familiya: FAMILIYALAR[r(i + 310, FAMILIYALAR.length)],
        otasi: isF ? OTASI_F[r(i + 320, OTASI_F.length)] : OTASI[r(i + 320, OTASI.length)],
        kafedra_id: 1 + r(i + 330, kafedralar.length),
        ilmiy_daraja: ['PhD', 'DSc', null, null, 'PhD'][r(i + 340, 5)],
        unvon: ['Professor', 'Dotsent', "Katta o'qituvchi", "O'qituvchi", 'Assistent'][r(i + 350, 5)],
        telefon: `+99891${1000000 + r(i + 360, 9000000)}`,
        email: `oqituvchi${i + 1}@nuni.uz`,
        ish_staji: 1 + r(i + 370, 30),
        soat_haqi: 280000 + r(i + 380, 120000),
        holat: 'faol',
      };
    });

    const fanlar = [
      { id: 1, kodi: 'MAT-101', nomi: 'Oliy matematika', kafedra_id: 11, kredit: 6, soat: 162, turi: 'majburiy', semestr: 1 },
      { id: 2, kodi: 'IT-204', nomi: 'Algoritmlar', kafedra_id: 10, kredit: 5, soat: 134, turi: 'majburiy', semestr: 3 },
      { id: 3, kodi: 'IT-308', nomi: 'Veb-dasturlash', kafedra_id: 10, kredit: 4, soat: 108, turi: 'tanlov', semestr: 5 },
      { id: 4, kodi: 'EC-101', nomi: 'Iqtisodiy nazariya', kafedra_id: 3, kredit: 5, soat: 134, turi: 'majburiy', semestr: 1 },
      { id: 5, kodi: 'MG-201', nomi: 'Marketing asoslari', kafedra_id: 4, kredit: 4, soat: 108, turi: 'majburiy', semestr: 3 },
      { id: 6, kodi: 'PD-101', nomi: 'Pedagogika asoslari', kafedra_id: 5, kredit: 5, soat: 134, turi: 'majburiy', semestr: 1 },
      { id: 7, kodi: 'TK-301', nomi: "Tog'-kon mashinalari", kafedra_id: 8, kredit: 6, soat: 162, turi: 'majburiy', semestr: 5 },
      { id: 8, kodi: 'IK-201', nomi: 'Ichki kasalliklar', kafedra_id: 1, kredit: 5, soat: 134, turi: 'majburiy', semestr: 3 },
    ];

    const kontraktlar = talabalar.map((t, i) => ({
      id: i + 1,
      raqami: `KO-2025/${String(1000 + i).padStart(4, '0')}`,
      talaba_id: t.id,
      summa: t.kontrakt_summa,
      muddat_yili: '2025-2026',
      sana: `01.09.2025`,
      chegirma_foiz: i % 11 === 0 ? 25 : i % 7 === 0 ? 15 : 0,
      holat: i % 19 === 0 ? 'bekor' : 'faol',
    }));

    const tolovlar = [];
    let tolovId = 1;
    talabalar.forEach((t, i) => {
      const total = t.kontrakt_summa;
      const paidRatio = i % 13 === 0 ? 0.3 : i % 7 === 0 ? 0.6 : i % 5 === 0 ? 0.85 : 1.0;
      const totalPaid = Math.round(total * paidRatio / 1000) * 1000;
      t.tolangan = totalPaid;

      let remaining = totalPaid;
      const months = ['09.2025', '11.2025', '01.2026', '03.2026'];
      months.forEach((m, mi) => {
        if (remaining <= 0) return;
        const amount = mi === months.length - 1 ? remaining : Math.round(totalPaid / months.length / 1000) * 1000;
        tolovlar.push({
          id: tolovId++,
          kontrakt_id: i + 1,
          summa: amount,
          sana: `15.${m}`,
          usul: ['naqd', 'plastik', 'bank_otkazma'][mi % 3],
          izoh: `${mi + 1}-bo'lib to'lov`,
        });
        remaining -= amount;
      });
    });

    const xodimlar = oqituvchilar.slice(0, 12).map((o, i) => ({
      id: i + 1,
      ism: o.ism,
      familiya: o.familiya,
      otasi: o.otasi,
      bolim: ['Buxgalteriya', 'HR bo\'limi', 'IT bo\'limi', "O'quv bo'limi", 'Xo'jalik bo\'limi'][i % 5],
      lavozim: ['Bosh hisobchi', 'HR menejer', 'Tizim administratori', "O'qituvchi", 'Mutaxassis'][i % 5],
      maosh: 5500000 + r(i + 500, 8000000),
      ish_boshlagan: `${1 + r(i + 510, 28)}.${1 + r(i + 511, 12)}.${2015 + r(i + 512, 9)}`,
      telefon: o.telefon,
      holat: 'faol',
    }));

    const buyruqlar = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      raqam: `B-2026/${String(40 + i).padStart(3, '0')}`,
      turi: ['qabul', 'bushatish', 'kuchirish', 'tatil', 'ragbat', 'jarima'][i % 6],
      sarlavha: ['Ishga qabul', "Lavozimdan bo'shatish", 'Boshqa lavozimga o\'tkazish', "Mehnat ta'tili", "Mukofotlash", "Hayfsan e'lon qilish"][i % 6],
      xodim_id: 1 + r(i + 600, 12),
      sana: `${1 + r(i + 601, 28)}.04.2026`,
      holat: i < 8 ? 'tasdiqlangan' : i < 11 ? 'muhokama' : 'qoralama',
      izoh: '',
    }));

    const crm_arizalar = Array.from({ length: 18 }, (_, i) => {
      const isF = r(i + 700, 100) < 50;
      return {
        id: i + 1,
        ism: (isF ? ISMLAR_F : ISMLAR_M)[r(i + 710, 10)],
        familiya: FAMILIYALAR[r(i + 720, FAMILIYALAR.length)],
        telefon: `+99893${1000000 + r(i + 730, 9000000)}`,
        email: `arizachi${i + 1}@gmail.com`,
        yonalish_id: 1 + r(i + 740, yonalishlar.length),
        manba: ['telegram', 'instagram', 'facebook', 'sayt', 'tavsiya', 'reklama'][i % 6],
        holat: i < 4 ? 'yangi' : i < 9 ? 'aloqa' : i < 13 ? 'qiziqdi' : i < 16 ? 'kutilmoqda' : 'qabul_qilindi',
        sana: `${1 + r(i + 750, 25)}.04.2026`,
        izoh: 'Telefonda gaplashildi',
        masul_id: 1 + r(i + 760, 5),
      };
    });

    return {
      fakultetlar, kafedralar, yonalishlar, guruhlar, fanlar,
      talabalar, oqituvchilar, xodimlar,
      kontraktlar, tolovlar,
      buyruqlar, crm_arizalar,
    };
  };

  // ------- LOAD / SAVE -------
  let store;
  try {
    const raw = localStorage.getItem(LS_KEY);
    store = raw ? JSON.parse(raw) : seed();
  } catch (e) {
    store = seed();
  }

  const subscribers = new Set();
  const persist = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) {}
    subscribers.forEach(fn => fn());
  };

  const nextId = (entity) => {
    const arr = store[entity] || [];
    return (arr.reduce((mx, r) => Math.max(mx, r.id || 0), 0)) + 1;
  };

  const api = {
    _store: store,
    _persist: persist,
    _subscribe: (fn) => { subscribers.add(fn); return () => subscribers.delete(fn); },
    _reset: () => { localStorage.removeItem(LS_KEY); Object.assign(store, seed()); persist(); },

    list: (entity) => store[entity] || [],
    get: (entity, id) => (store[entity] || []).find(r => r.id === id),
    add: (entity, data) => {
      if (!store[entity]) store[entity] = [];
      const item = { ...data, id: nextId(entity) };
      store[entity].push(item);
      persist();
      return item;
    },
    update: (entity, id, patch) => {
      const arr = store[entity] || [];
      const idx = arr.findIndex(r => r.id === id);
      if (idx >= 0) {
        arr[idx] = { ...arr[idx], ...patch, id };
        persist();
        return arr[idx];
      }
      return null;
    },
    remove: (entity, id) => {
      const arr = store[entity] || [];
      const idx = arr.findIndex(r => r.id === id);
      if (idx >= 0) {
        arr.splice(idx, 1);
        persist();
        return true;
      }
      return false;
    },
    // FK helpers
    fakultetNomi: (id) => (store.fakultetlar.find(f => f.id === id) || {}).nomi || '',
    kafedraNomi: (id) => (store.kafedralar.find(k => k.id === id) || {}).nomi || '',
    yonalishNomi: (id) => (store.yonalishlar.find(y => y.id === id) || {}).nomi || '',
    guruhNomi: (id) => (store.guruhlar.find(g => g.id === id) || {}).nomi || '',
    talabaFio: (id) => {
      const t = store.talabalar.find(t => t.id === id);
      return t ? `${t.familiya} ${t.ism} ${t.otasi}` : '';
    },
    oqituvchiFio: (id) => {
      const o = store.oqituvchilar.find(o => o.id === id);
      return o ? `${o.familiya} ${o.ism} ${o.otasi}` : '';
    },
  };

  window.DataStore = api;
})();

// React hook — entitiesni reactive qiladi
const useEntityStore = (entity) => {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => window.DataStore._subscribe(force), []);
  return {
    items: window.DataStore.list(entity),
    add: (data) => window.DataStore.add(entity, data),
    update: (id, patch) => window.DataStore.update(entity, id, patch),
    remove: (id) => window.DataStore.remove(entity, id),
    get: (id) => window.DataStore.get(entity, id),
  };
};

// Toast helpers
const toast = {
  success: (msg) => window.showToast && window.showToast(msg, 'success'),
  error: (msg) => window.showToast && window.showToast(msg, 'error'),
  info: (msg) => window.showToast && window.showToast(msg, 'info'),
  warning: (msg) => window.showToast && window.showToast(msg, 'warning'),
};

// ConfirmDialog (Modal asosida)
const ConfirmDialog = ({ open, onClose, onConfirm, title = "Tasdiqlang", message, confirmLabel = "O'chirish", cancelLabel = "Bekor qilish", danger = true }) => {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} width={440}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm && onConfirm(); }}>{confirmLabel}</Button>
        </>
      }>
      <div style={{ padding: '4px 0', fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
        {message || "Haqiqatan ham o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."}
      </div>
    </Modal>
  );
};

Object.assign(window, { useEntityStore, toast, ConfirmDialog });
