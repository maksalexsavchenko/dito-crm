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
export const docHasItems = new Set([
  'transfer',
  'writeoff',
  'conversion',
  'supplierOrders',
  'clientReturns',
  'purchaseReturns',
  'count',
]);

// Колір бейджа за статусом.
export const statusColor: Record<string, string> = {
  'Готово до відправлення': 'bg-blue-500/15 text-blue-600',
  'В дорозі': 'bg-warning/15 text-warning',
  Завершено: 'bg-success/15 text-success',
  Доставлено: 'bg-success/15 text-success',
  Очікує: 'bg-warning/15 text-warning',
  Скасовано: 'bg-destructive/15 text-destructive',
};

// Пристрої (devices) та оприбуткування (receipt) мають власні сторінки —
// див. components/DevicesSection і components/PostingsSection.
export const warehouseSections: Record<string, WSection> = {
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

  backorders: {
    description: 'Товари, додані до замовлень клієнтів без списання з залишків, за налаштуваннями статусів.',
    searchKey: 'name',
    cols: [
      { key: 'name', header: 'Найменування', kind: 'bold' },
      { key: 'ticket', header: 'Заявка', kind: 'muted' },
      { key: 'ordered', header: 'Замовлено', align: 'right' },
      { key: 'inStock', header: 'В наявності', align: 'right' },
      { key: 'lastPurchase', header: 'Остання закупівля', align: 'right' },
      { key: 'supplier', header: 'Постачальник за замовч.', kind: 'muted' },
    ],
    rows: [],
    emptyText: 'Товари з’являться тут, коли їх додадуть до замовлень клієнтів без списання залишків.',
  },

  reorder: {
    description: 'Товари для закупівлі на основі мінімальних і максимальних залишків, вказаних у картці товару.',
    searchKey: 'name',
    cols: [
      { key: 'name', header: 'Найменування', kind: 'bold' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'toOrder', header: 'До замовлення', align: 'right' },
      { key: 'inStock', header: 'В наявності', align: 'right' },
      { key: 'lastPurchase', header: 'Остання закупівля', align: 'right' },
      { key: 'supplier', header: 'Постачальник за замовч.', kind: 'muted' },
    ],
    rows: [
      {
        name: 'Блок Apple USB-C 20W (оригінал, рік гарантії)',
        warehouse: 'Пирятин › Склад товарів',
        toOrder: '3 шт',
        inStock: '—',
        lastPurchase: '890,22',
        supplier: 'Цифротех',
      },
    ],
    emptyText: 'Тут з’являться товари, залишок яких опустився нижче мінімального.',
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

  clientReturns: {
    description: 'Перегляд усіх товарів, повернутих на склад із замовлень і продажів.',
    createLabel: 'Повернення',
    searchKey: 'client',
    cols: [
      { key: 'num', header: 'Повернення', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'doc', header: 'Документ', kind: 'mono' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'client', header: 'Клієнт' },
      { key: 'sum', header: 'Сума', kind: 'sum', align: 'right' },
    ],
    rows: [
      { num: 'H72', by: 'Аліна Г.', date: '24.07.2026', doc: 'Продаж H2048', warehouse: 'Пирятин', client: '—', sum: '1 200' },
      { num: 'H70', by: 'Аліна Г.', date: '25.05.2026', doc: 'Продаж H1236', warehouse: 'Пирятин', client: 'Олена Вікторівна', sum: '4 300' },
    ],
  },

  purchaseReturns: {
    description: 'Історія повернень постачальнику за документами оприбуткування.',
    searchKey: 'supplier',
    cols: [
      { key: 'num', header: 'Повернення', kind: 'bold' },
      { key: 'by', header: 'Створено' },
      { key: 'date', header: 'Дата', kind: 'muted' },
      { key: 'doc', header: 'Документ', kind: 'mono' },
      { key: 'warehouse', header: 'Склад', kind: 'muted' },
      { key: 'supplier', header: 'Постачальник' },
      { key: 'sum', header: 'Сума', kind: 'sum', align: 'right' },
    ],
    rows: [
      { num: 'H15', by: 'Христина Р.', date: '13.03.2026', doc: 'Оприбуткування H165', warehouse: 'Пирятин', supplier: 'ТТТ', sum: '890' },
      { num: 'H4', by: 'Христина Р.', date: '20.08.2025', doc: 'Оприбуткування H53', warehouse: 'Пирятин', supplier: 'Vodafone', sum: '1 249' },
    ],
    emptyText: 'Повернень постачальнику поки немає.',
  },
};
