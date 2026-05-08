import type { PersonName } from '@/types/shared';

const UZ_MALE_NAMES = ['Jasur', 'Aziz', 'Bekzod', 'Sardor', 'Otabek', 'Davron', 'Rustam', 'Sherzod', 'Kamoliddin', 'Akmal', 'Javohir', 'Nodir', 'Bobur', 'Oybek', 'Shavkat', 'Dilshod'];
const UZ_FEMALE_NAMES = ['Nilufar', 'Malika', 'Dilnoza', 'Shahnoza', 'Mohira', 'Zarina', 'Gulnora', 'Madina', 'Feruza', 'Sevinch', 'Muhayyo', 'Kamola', 'Nozima', 'Laylo', 'Sanobar', 'Shaxlo'];
const UZ_SURNAMES = ['Aliyev', 'Karimov', 'Yusupov', 'Rahimov', 'Nazarov', 'Tursunov', 'Shodiyev', 'Mirzayev', 'Xolmatov', 'Saidov', 'Ergashev', 'Jalilov', 'Hasanov', 'Qodirov', 'Ismoilov', 'Usmonov'];
const UZ_PATRONYMICS = ['Kamoliddinovich', 'Bahodirovich', 'Rashidovich', 'Sobirovich', 'Mahmudovich', 'Abdullayevich', 'Nematovich', 'Shokirovich'];

export const FACULTIES = [
  'Iqtisodiyot va menejment',
  'Axborot texnologiyalari',
  "Tog'-kon ishi",
  'Energetika',
  'Filologiya',
  'Pedagogika',
  'Qurilish va arxitektura',
  'Ekologiya va tabiiy fanlar',
];

export const DEPARTMENTS = [
  'Dasturiy injiniring kafedrasi',
  'Axborot tizimlari kafedrasi',
  'Iqtisodiyot nazariyasi kafedrasi',
  'Menejment kafedrasi',
  "Tog'-kon texnologiyalari kafedrasi",
  'Energetika kafedrasi',
  "O'zbek tili va adabiyoti kafedrasi",
  'Pedagogika va psixologiya kafedrasi',
];

export const SUBJECTS = ['Matematika', 'Algoritmlar', "Ma'lumotlar bazalari", 'Iqtisodiyot asoslari', 'Menejment', 'Marketing', 'Veb-dasturlash', "Mashina o'rganish", 'Pedagogika', 'Psixologiya'];

export const DIRECTIONS = ['Axborot texnologiyalari', 'Iqtisodiyot', 'Menejment', 'Pedagogika', "Tog'-kon ishi"];

export function seed(i: number): number {
  return ((i * 2654435761) % 2 ** 32) / 2 ** 32;
}

export function pick<T>(arr: T[], i: number): T {
  return arr[Math.floor(seed(i) * arr.length)] as T;
}

export function rnum(i: number, min: number, max: number): number {
  return Math.floor(seed(i) * (max - min + 1)) + min;
}

export function generateName(i: number, femaleChance = 0.5): PersonName {
  const isFemale = seed(i * 3) < femaleChance;
  const first = isFemale ? pick(UZ_FEMALE_NAMES, i) : pick(UZ_MALE_NAMES, i * 2);
  const baseLast = pick(UZ_SURNAMES, i * 7);
  const patr = pick(UZ_PATRONYMICS, i * 11);
  const suffix = isFemale ? 'a' : '';
  const last = baseLast.endsWith('v') ? baseLast + suffix : baseLast;
  const firstInitial = first.charAt(0);
  const lastInitial = last.charAt(0);
  return {
    full: `${last} ${first} ${patr}`,
    short: `${last} ${firstInitial}.`,
    first,
    last,
    isFemale,
    initials: (lastInitial + firstInitial).toUpperCase(),
  };
}

export function generatePhone(i: number): string {
  const codes = ['90', '91', '93', '94', '97', '99'];
  const c = pick(codes, i);
  const n = String(rnum(i * 13, 1000000, 9999999));
  return `+998 ${c} ${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5, 7)}`;
}

export function generateEmail(name: PersonName): string {
  return `${name.last.toLowerCase()}.${name.first.charAt(0).toLowerCase()}@uni.uz`;
}
