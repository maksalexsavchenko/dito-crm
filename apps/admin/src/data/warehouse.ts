// Конфіги вкладок складу за реальною структурою RoApp.
// Ukrainian-first (RoApp лише українською); en-локалізацію цих розділів — пізніше.

export type WColKind = 'mono' | 'muted' | 'bold' | 'status' | 'sum' | 'image';

export interface WCol {
  key: string;
  header: string;
  align?: 'right';
  kind?: WColKind;
}

export type WRow = Record<string, string>;

export interface WSection {
  description: string;
  createLabel?: string;
  searchKey?: string;
  cols: WCol[];
  rows: WRow[];
  emptyText?: string;
}

// Узагальнені позиції документа («Список товарів») для карток документів.
export const mockDocItems = [
  { name: 'iPhone 14 128 midnight NEW', sn: '353404352056383', cell: 'Комірка 1', price: '21 565', qty: '1', sum: '21 565' },
  { name: 'AirPods Pro 2 USB-C', sn: '', cell: 'Комірка 3', price: '9 499', qty: '2', sum: '18 998' },
];

// Розділи, у яких картка документа має «Список товарів».
export const docHasItems = new Set(['receipt', 'transfer', 'writeoff', 'conversion', 'supplierOrders', 'returns', 'count']);

// Колір бейджа за статусом.
export const statusColor: Record<string, string> = {
  'Готово до відправлення': 'bg-blue-500/15 text-blue-600',
  'В дорозі': 'bg-warning/15 text-warning',
  Завершено: 'bg-success/15 text-success',
  Доставлено: 'bg-success/15 text-success',
  Очікує: 'bg-warning/15 text-warning',
  Скасовано: 'bg-destructive/15 text-destructive',
};

export const warehouseSections: Record<string, WSection> = {
  devices: {
    description:
      'Створюйте вироби, що належать вашим клієнтам або компанії, щоб відстежувати їх рух, обслуговування та місцезнаходження.',
    createLabel: 'Пристрій',
    searchKey: 'name',
    cols: [
      { key: 'imei', header: 'IMEI', kind: 'mono' },
      { key: 'img', header: 'Фото', kind: 'image' },
      { key: 'name', header: 'Найменування', kind: 'bold' },
      { key: 'owner', header: 'Власник' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'doc', header: 'Документ', kind: 'muted' },
    ],
    rows: [
      { imei: '351122574222421', name: 'iPhone 13 Pro 256 graphite', owner: 'Клієнт › Apple', warehouse: 'Київ', doc: '9-0011' },
      { imei: '358611743988943', name: 'iPhone 12 Pro 128 silver', owner: 'Компанія', warehouse: 'Львів', doc: 'B8' },
      { imei: '490154203237518', name: 'Samsung Galaxy S23 256', owner: 'Клієнт › Іванов', warehouse: 'Дніпро', doc: '9-0042' },
      { imei: '353247104783921', name: 'MacBook Air 13" M2', owner: 'Компанія', warehouse: 'Київ', doc: 'B12' },
    ],
  },

  supplierOrders: {
    description: 'Створюйте замовлення постачальнику для поповнення товарів і керування доставками.',
    createLabel: 'Замовлення',
    searchKey: 'supplier',
    cols: [
      { key: 'num', header: '№', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'supplier', header: 'Постачальник' },
      { key: 'status', header: 'Статус', kind: 'status' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'sum', header: 'Сума', kind: 'sum', align: 'right' },
    ],
    rows: [
      { num: 'PO-204', by: 'Аліна Г.', date: '22.06.2026', supplier: 'MobiPhone LV', status: 'Очікує', warehouse: 'Київ', sum: '120 000' },
      { num: 'PO-203', by: 'Аліна Г.', date: '15.06.2026', supplier: 'Ziko', status: 'Доставлено', warehouse: 'Львів', sum: '84 500' },
    ],
  },

  receipt: {
    description: 'Оприбуткуйте товари на склад, щоб вести облік, відстежувати залишки та історію руху.',
    createLabel: 'Оприбуткування',
    searchKey: 'supplier',
    cols: [
      { key: 'num', header: 'Оприбуткування', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'invoice', header: 'Накладна', kind: 'muted' },
      { key: 'supplier', header: 'Постачальник' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'sum', header: 'Сума', kind: 'sum', align: 'right' },
    ],
    rows: [
      { num: 'H190', by: 'Христина Р.', date: '25.06.2026', invoice: 'Б/Н', supplier: 'MobiPhone LV', warehouse: 'Київ', sum: '57 204' },
      { num: 'H189', by: 'Христина Р.', date: '18.06.2026', invoice: 'Б/Н', supplier: 'Ziko', warehouse: 'Львів', sum: '38 280' },
      { num: 'H188', by: 'Аліна Г.', date: '08.06.2026', invoice: 'Trade-in', supplier: 'Trade-in', warehouse: 'Київ', sum: '12 500' },
    ],
  },

  reservation: {
    description: 'Переглядайте та керуйте резервуваннями товарів на всіх складах.',
    searchKey: 'name',
    cols: [
      { key: 'by', header: 'Створено' },
      { key: 'sku', header: 'Артикул', kind: 'mono' },
      { key: 'name', header: 'Найменування', kind: 'bold' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'reserved', header: 'Зарезервовано', align: 'right' },
      { key: 'until', header: 'Зарезервовано до', kind: 'muted' },
      { key: 'client', header: 'Клієнт' },
    ],
    rows: [],
    emptyText: 'Тут поки нічого немає. Резервування із замовлень клієнтів відображатимуться тут.',
  },

  conversion: {
    description: 'Конвертуйте пристрої в товари та навпаки, зберігаючи зв’язок документів.',
    createLabel: 'Конвертація',
    searchKey: 'source',
    cols: [
      { key: 'num', header: 'Конвертація', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'source', header: 'Початковий об’єкт' },
      { key: 'result', header: 'Результат' },
      { key: 'related', header: 'Документи', kind: 'mono' },
    ],
    rows: [
      { num: 'B8', by: 'Христина Р.', date: '20.04.2026', source: 'Пристрій · iPhone 12 Pro', result: 'Товар · iPhone 12 Pro USED', related: '358611743988943' },
      { num: 'B7', by: 'Христина Р.', date: '02.03.2026', source: 'Пристрій · iPhone 13 Pro', result: 'Товар · iPhone 13 Pro USED', related: '357866892431084' },
    ],
  },

  transfer: {
    description: 'Переміщуйте товари між складами та відстежуйте історію переміщень.',
    createLabel: 'Перемістити',
    searchKey: 'num',
    cols: [
      { key: 'num', header: 'Переміщення', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'status', header: 'Статус', kind: 'status' },
      { key: 'from', header: 'Зі складу' },
      { key: 'to', header: 'На склад' },
      { key: 'sum', header: 'Сума', kind: 'sum', align: 'right' },
    ],
    rows: [
      { num: 'D1160', by: 'Христина Р.', date: '25.06.2026', status: 'Готово до відправлення', from: 'Львів', to: 'Київ', sum: '168' },
      { num: 'B41393', by: 'Христина Р.', date: '24.06.2026', status: 'В дорозі', from: 'Дніпро', to: 'Київ', sum: '327' },
      { num: 'D1158', by: 'Аліна Г.', date: '20.06.2026', status: 'Завершено', from: 'Київ', to: 'Харків', sum: '1 240' },
    ],
  },

  count: {
    description: 'Створюйте інвентаризації, щоб перевіряти фактичні залишки та забезпечувати точність обліку.',
    createLabel: 'Інвентаризація',
    searchKey: 'category',
    cols: [
      { key: 'num', header: 'Інвентаризація', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'warehouse', header: 'Склад' },
      { key: 'category', header: 'Категорія' },
      { key: 'comment', header: 'Коментар', kind: 'muted' },
    ],
    rows: [
      { num: 'H149', by: 'Христина Р.', date: '21.06.2026', warehouse: 'Київ (Всі)', category: 'iPhone', comment: '—' },
      { num: 'H148', by: 'Христина Р.', date: '21.06.2026', warehouse: 'Київ (Всі)', category: 'Смартфони', comment: '—' },
    ],
  },

  writeoff: {
    description: 'Списуйте товари, які більше не можна продати чи використати, і відстежуйте всі списання.',
    createLabel: 'Списання',
    searchKey: 'comment',
    cols: [
      { key: 'num', header: 'Списання', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'comment', header: 'Коментар' },
      { key: 'sum', header: 'Сума', kind: 'sum', align: 'right' },
    ],
    rows: [
      { num: 'I5', by: 'Христина Р.', date: '19.06.2026', warehouse: 'Київ', comment: 'Брак', sum: '6 155' },
      { num: 'I4', by: 'Аліна Г.', date: '02.06.2026', warehouse: 'Львів', comment: 'Втрата', sum: '2 300' },
    ],
  },

  returns: {
    description: 'Оформлюйте повернення товарів від клієнтів та постачальникам.',
    createLabel: 'Повернення',
    cols: [
      { key: 'num', header: 'Повернення', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'client', header: 'Клієнт' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'sum', header: 'Сума', kind: 'sum', align: 'right' },
    ],
    rows: [],
    emptyText: 'Повернень поки немає.',
  },
};
