// Оприбуткування (postings) — прихід товару на склад від постачальника.
// Структура полів повторює /app/warehouse/get-income-transactions.

export interface PostingItem {
  name: string;
  cell: string; // комірка (bin location)
  price: number;
  qty: number;
}

export interface Posting {
  id: string;
  num: string; // id_label, напр. H200
  createdBy: string;
  createdAt: string; // ISO
  updatedBy?: string;
  updatedAt?: string;
  invoice: string; // document_id, напр. «Б/Н»
  invoiceDate: string; // ISO (тільки дата)
  supplier: string;
  warehouse: string;
  comment: string;
  items: PostingItem[];
  isDraft: boolean;
  payFromAccount: boolean;
}

export const postingSuppliers = [
  'MobiPhone LV',
  'Ziko',
  'Trade-in',
  'Vodafone',
  'iConnekt',
  'ТОВ «Дистриб’ютор»',
  'ТОВ «Імпорт Плюс»',
];

export const postingCells = ['Комірка 1', 'Комірка 2', 'Комірка 3'];

export function postingTotal(p: Pick<Posting, 'items'>): number {
  return p.items.reduce((acc, i) => acc + i.price * i.qty, 0);
}

// ── Періоди фільтра «Створено» (як у RoApp) ────────────────────
export type Period =
  | 'all'
  | 'today'
  | 'week'
  | 'month'
  | 'year'
  | 'yesterday'
  | 'lastWeek'
  | 'lastMonth'
  | 'lastYear';

export const periodOptions: { value: Period; label: string }[] = [
  { value: 'all', label: 'Весь час' },
  { value: 'today', label: 'Сьогодні' },
  { value: 'week', label: 'Цей тиждень' },
  { value: 'month', label: 'Цей місяць' },
  { value: 'year', label: 'Цей рік' },
  { value: 'yesterday', label: 'Вчора' },
  { value: 'lastWeek', label: 'Минулий тиждень' },
  { value: 'lastMonth', label: 'Минулий місяць' },
  { value: 'lastYear', label: 'Минулий рік' },
];

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const startOfWeek = (d: Date) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // тиждень з понеділка
  return x;
};
const startOfMonth = (d: Date) => {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
};
const startOfYear = (d: Date) => {
  const x = startOfMonth(d);
  x.setMonth(0);
  return x;
};
const shift = (d: Date, unit: 'day' | 'month' | 'year', n: number) => {
  const x = new Date(d);
  if (unit === 'day') x.setDate(x.getDate() + n);
  if (unit === 'month') x.setMonth(x.getMonth() + n);
  if (unit === 'year') x.setFullYear(x.getFullYear() + n);
  return x;
};

/** Чи потрапляє дата у вибраний період. */
export function inPeriod(iso: string, period: Period, now = new Date()): boolean {
  if (period === 'all') return true;
  const at = new Date(iso);
  const day = startOfDay(now);
  const week = startOfWeek(now);
  const month = startOfMonth(now);
  const year = startOfYear(now);

  const ranges: Record<Exclude<Period, 'all'>, [Date, Date]> = {
    today: [day, shift(day, 'day', 1)],
    yesterday: [shift(day, 'day', -1), day],
    week: [week, shift(week, 'day', 7)],
    lastWeek: [shift(week, 'day', -7), week],
    month: [month, shift(month, 'month', 1)],
    lastMonth: [shift(month, 'month', -1), month],
    year: [year, shift(year, 'year', 1)],
    lastYear: [shift(year, 'year', -1), year],
  };

  const [from, to] = ranges[period];
  return at >= from && at < to;
}

export const postings: Posting[] = [
  {
    id: '1',
    num: 'H200',
    createdBy: 'Христина Р.',
    createdAt: '2026-07-26T16:34:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-07-26',
    supplier: 'iConnekt',
    warehouse: 'Київ',
    comment: '',
    items: [
      { name: 'iPhone 15 128GB', cell: 'Комірка 1', price: 33599, qty: 1 },
      { name: 'AirPods Pro 2', cell: 'Комірка 3', price: 7599, qty: 2 },
    ],
    isDraft: false,
    payFromAccount: false,
  },
  {
    id: '2',
    num: 'H199',
    createdBy: 'Христина Р.',
    createdAt: '2026-07-25T16:00:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-07-25',
    supplier: 'Trade-in',
    warehouse: 'Київ',
    comment: 'трейд-ін Аліни 25.07',
    items: [{ name: 'iPhone 13 Pro 256GB', cell: 'Комірка 2', price: 18500, qty: 1 }],
    isDraft: false,
    payFromAccount: false,
  },
  {
    id: '3',
    num: 'H198',
    createdBy: 'Христина Р.',
    createdAt: '2026-07-22T17:51:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-07-22',
    supplier: 'Vodafone',
    warehouse: 'Львів',
    comment: '',
    items: [{ name: 'Baseus 65W GaN зарядка', cell: 'Комірка 1', price: 670, qty: 1 }],
    isDraft: false,
    payFromAccount: true,
  },
  {
    id: '4',
    num: 'H197',
    createdBy: 'Аліна Г.',
    createdAt: '2026-07-20T17:43:00',
    updatedBy: 'Христина Р.',
    updatedAt: '2026-07-21T09:12:00',
    invoice: 'НК-4471',
    invoiceDate: '2026-07-20',
    supplier: 'Ziko',
    warehouse: 'Київ',
    comment: 'трейд-ін Аліни 20.07',
    items: [
      { name: 'Samsung Galaxy A55 128GB', cell: 'Комірка 2', price: 14399, qty: 1 },
      { name: 'Anker 737 PowerBank', cell: 'Комірка 3', price: 3119, qty: 2 },
    ],
    isDraft: false,
    payFromAccount: false,
  },
  {
    id: '5',
    num: 'H196',
    createdBy: 'Христина Р.',
    createdAt: '2026-07-15T10:20:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-07-15',
    supplier: 'MobiPhone LV',
    warehouse: 'Київ',
    comment: '',
    items: [
      { name: 'iPhone 15 Pro 256GB', cell: 'Комірка 1', price: 46399, qty: 1 },
      { name: 'Apple USB-C кабель 2м', cell: 'Комірка 3', price: 719, qty: 5 },
    ],
    isDraft: false,
    payFromAccount: false,
  },
  {
    id: '6',
    num: 'H195',
    createdBy: 'Аліна Г.',
    createdAt: '2026-07-12T15:18:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-07-12',
    supplier: 'Trade-in',
    warehouse: 'Дніпро',
    comment: 'трейд-ін Аліни 12.07',
    items: [{ name: 'MacBook Air 13" M3', cell: 'Комірка 2', price: 43999, qty: 1 }],
    isDraft: true,
    payFromAccount: false,
  },
  {
    id: '7',
    num: 'H194',
    createdBy: 'Христина Р.',
    createdAt: '2026-06-26T10:23:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-06-26',
    supplier: 'iConnekt',
    warehouse: 'Львів',
    comment: '',
    items: [{ name: 'Sony WH-1000XM5', cell: 'Комірка 3', price: 11199, qty: 3 }],
    isDraft: false,
    payFromAccount: false,
  },
  {
    id: '8',
    num: 'H193',
    createdBy: 'Христина Р.',
    createdAt: '2026-06-25T10:34:00',
    invoice: 'НК-4102',
    invoiceDate: '2026-06-25',
    supplier: 'ТОВ «Дистриб’ютор»',
    warehouse: 'Київ',
    comment: '',
    items: [
      { name: 'iPad Air 11" M2', cell: 'Комірка 1', price: 23199, qty: 2 },
      { name: 'Samsung Galaxy Tab S9', cell: 'Комірка 1', price: 25199, qty: 1 },
    ],
    isDraft: false,
    payFromAccount: true,
  },
  {
    id: '9',
    num: 'H192',
    createdBy: 'Аліна Г.',
    createdAt: '2026-05-18T14:15:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-05-18',
    supplier: 'ТОВ «Імпорт Плюс»',
    warehouse: 'Харків',
    comment: 'акційна партія',
    items: [{ name: 'Xiaomi 14 512GB', cell: 'Комірка 2', price: 26399, qty: 4 }],
    isDraft: false,
    payFromAccount: false,
  },
  {
    id: '10',
    num: 'H191',
    createdBy: 'Христина Р.',
    createdAt: '2026-03-13T17:42:00',
    invoice: 'Б/Н',
    invoiceDate: '2026-03-13',
    supplier: 'Ziko',
    warehouse: 'Львів',
    comment: '',
    items: [{ name: 'Lenovo LOQ 15', cell: 'Комірка 2', price: 31199, qty: 2 }],
    isDraft: false,
    payFromAccount: false,
  },
  {
    id: '11',
    num: 'H190',
    createdBy: 'Христина Р.',
    createdAt: '2025-12-20T10:28:00',
    invoice: 'НК-3890',
    invoiceDate: '2025-12-20',
    supplier: 'MobiPhone LV',
    warehouse: 'Київ',
    comment: 'передноворічне поповнення',
    items: [
      { name: 'iPhone 15 128GB', cell: 'Комірка 1', price: 33599, qty: 3 },
      { name: 'Apple Watch Series 9', cell: 'Комірка 3', price: 14399, qty: 2 },
    ],
    isDraft: false,
    payFromAccount: false,
  },
];
