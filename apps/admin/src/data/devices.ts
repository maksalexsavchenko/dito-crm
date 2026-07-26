// Пристрої (assets у RoApp) — вироби клієнтів або компанії, які ми відстежуємо
// окремо від товарів: у них є серійний номер/IMEI, власник і історія обслуговування.
// Структура полів повторює /app/warehouse/get-assets.

export type DeviceOwner = 'company' | 'client';
export type DeviceStatus = 'active' | 'written_off';

export interface Device {
  id: string;
  uid: string; // IMEI або серійний номер
  type: string;
  group: string;
  brand: string;
  model: string;
  modification: string;
  color: string;
  state: string;
  description: string;
  owner: DeviceOwner;
  clientName: string;
  clientPhone: string;
  warehouse: string; // склад компанії; для клієнтських — місце зберігання за замовчуванням
  docs: string[];
  status: DeviceStatus;
}

export const deviceTypes = ['За замовчуванням', 'Гарантійний', 'Підмінний'];

export const deviceStates = [
  'Подряпини, потертості',
  'Як новий',
  'Значні пошкодження',
  'Не вмикається',
];

// Каскад Група → Бренд → Модель (у RoApp кожен наступний селект залежить від попереднього).
export const deviceCatalog: Record<string, Record<string, string[]>> = {
  Смартфон: {
    Apple: ['iPhone 15 Pro Max', 'iPhone 14', 'iPhone 13 Pro'],
    Samsung: ['Galaxy S24 Ultra', 'Galaxy A55'],
    Xiaomi: ['14 Pro', 'Redmi Note 13'],
  },
  Ноутбук: {
    Apple: ['MacBook Air 13" M3', 'MacBook Pro 14" M3 Pro'],
    Asus: ['ROG Strix G16', 'Zenbook 14'],
    Lenovo: ['LOQ 15', 'ThinkPad X1'],
  },
  Планшет: {
    Apple: ['iPad Air 11" M2', 'iPad 10.9"'],
    Samsung: ['Galaxy Tab S9'],
  },
  Годинник: {
    Apple: ['Watch Series 9', 'Watch SE'],
    Garmin: ['Fenix 7'],
  },
  Навушники: {
    Apple: ['AirPods Pro 2'],
    Sony: ['WH-1000XM5'],
  },
};

export const deviceGroups = Object.keys(deviceCatalog);

/** Назва пристрою, як її показує RoApp: група + бренд + модель. */
export function deviceTitle(d: Pick<Device, 'group' | 'brand' | 'model'>): string {
  return [d.group, d.brand, d.model].filter(Boolean).join(' ');
}

/** Де лежить пристрій: у клієнта чи на складі компанії. */
export function deviceLocation(d: Pick<Device, 'owner' | 'clientName' | 'warehouse'>): string {
  return d.owner === 'client' ? `Клієнт › ${d.clientName}` : d.warehouse;
}

export const devices: Device[] = [
  {
    id: '1',
    uid: '351122574222421',
    type: 'За замовчуванням',
    group: 'Смартфон',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    modification: '256GB',
    color: 'Graphite',
    state: 'Подряпини, потертості',
    description: 'Не тримає заряд, потрібна заміна акумулятора.',
    owner: 'client',
    clientName: 'Валерій Кудін',
    clientPhone: '+380 (96) 775 92 99',
    warehouse: 'Київ',
    docs: ['Заявка C1006'],
    status: 'active',
  },
  {
    id: '2',
    uid: '9-0253',
    type: 'За замовчуванням',
    group: 'Ноутбук',
    brand: 'Apple',
    model: 'MacBook Air 13" M3',
    modification: '512GB',
    color: 'Silver',
    state: 'Подряпини, потертості',
    description: 'Скол на кришці, решта без зауважень.',
    owner: 'client',
    clientName: 'Діана Пишна',
    clientPhone: '+380 (66) 706 65 45',
    warehouse: 'Київ',
    docs: [],
    status: 'active',
  },
  {
    id: '3',
    uid: '357641778265769',
    type: 'Гарантійний',
    group: 'Смартфон',
    brand: 'Apple',
    model: 'iPhone 14',
    modification: '128GB',
    color: 'Midnight',
    state: 'Не вмикається',
    description: 'Після потрапляння вологи не вмикається.',
    owner: 'client',
    clientName: 'Віталій Юричка',
    clientPhone: '+380 (63) 705 43 07',
    warehouse: 'Львів',
    docs: ['Заявка C1014'],
    status: 'active',
  },
  {
    id: '4',
    uid: '9-0250',
    type: 'За замовчуванням',
    group: 'Смартфон',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    modification: '256GB',
    color: 'Синій',
    state: 'Значні пошкодження',
    description: 'Екран світиться зеленим після занурення у воду.',
    owner: 'client',
    clientName: 'Цуп Олег',
    clientPhone: '+380 (96) 087 37 97',
    warehouse: 'Київ',
    docs: [],
    status: 'active',
  },
  {
    id: '5',
    uid: 'XPWNJVPVK4',
    type: 'За замовчуванням',
    group: 'Планшет',
    brand: 'Apple',
    model: 'iPad Air 11" M2',
    modification: '64GB',
    color: 'Space Gray',
    state: 'Подряпини, потертості',
    description: 'Заміна тачскрину.',
    owner: 'client',
    clientName: 'Олена Чернець',
    clientPhone: '+380 (96) 410 84 21',
    warehouse: 'Дніпро',
    docs: ['Заявка C0998'],
    status: 'active',
  },
  {
    id: '6',
    uid: 'D64H92T43V',
    type: 'За замовчуванням',
    group: 'Годинник',
    brand: 'Apple',
    model: 'Watch SE',
    modification: '44mm',
    color: 'Starlight',
    state: 'Як новий',
    description: 'Не тримає з’єднання з телефоном.',
    owner: 'client',
    clientName: 'Яна Басараб',
    clientPhone: '+380 (67) 532 66 64',
    warehouse: 'Київ',
    docs: ['Заявка C0977'],
    status: 'active',
  },
  {
    id: '7',
    uid: '358611743988943',
    type: 'Підмінний',
    group: 'Смартфон',
    brand: 'Samsung',
    model: 'Galaxy A55',
    modification: '128GB',
    color: 'Black',
    state: 'Як новий',
    description: 'Підмінний апарат на час ремонту.',
    owner: 'company',
    clientName: '',
    clientPhone: '',
    warehouse: 'Київ',
    docs: [],
    status: 'active',
  },
  {
    id: '8',
    uid: '490154203237518',
    type: 'Підмінний',
    group: 'Ноутбук',
    brand: 'Lenovo',
    model: 'ThinkPad X1',
    modification: '512GB',
    color: 'Black',
    state: 'Подряпини, потертості',
    description: 'Службовий ноутбук сервісного центру.',
    owner: 'company',
    clientName: '',
    clientPhone: '',
    warehouse: 'Львів',
    docs: [],
    status: 'active',
  },
  {
    id: '9',
    uid: '353247104783921',
    type: 'За замовчуванням',
    group: 'Навушники',
    brand: 'Sony',
    model: 'WH-1000XM5',
    modification: '',
    color: 'Black',
    state: 'Значні пошкодження',
    description: 'Не працює праве вухо.',
    owner: 'client',
    clientName: 'Дмитро Євченко',
    clientPhone: '+380 (68) 374 46 28',
    warehouse: 'Харків',
    docs: [],
    status: 'active',
  },
  {
    id: '10',
    uid: '353888102875201',
    type: 'За замовчуванням',
    group: 'Смартфон',
    brand: 'Xiaomi',
    model: 'Redmi Note 13',
    modification: '256GB',
    color: 'Blue',
    state: 'Подряпини, потертості',
    description: 'Заміна екрана.',
    owner: 'client',
    clientName: 'Надія Гулак',
    clientPhone: '+380 (98) 886 62 59',
    warehouse: 'Дніпро',
    docs: [],
    status: 'active',
  },
  {
    id: '11',
    uid: '352561337869726',
    type: 'За замовчуванням',
    group: 'Планшет',
    brand: 'Samsung',
    model: 'Galaxy Tab S9',
    modification: '128GB',
    color: 'Graphite',
    state: 'Не вмикається',
    description: 'Списано після висновку майстра — ремонт недоцільний.',
    owner: 'client',
    clientName: 'Михайло Міщенко',
    clientPhone: '+380 (99) 070 13 69',
    warehouse: 'Київ',
    docs: [],
    status: 'written_off',
  },
  {
    id: '12',
    uid: '860123045678901',
    type: 'Гарантійний',
    group: 'Ноутбук',
    brand: 'Asus',
    model: 'ROG Strix G16',
    modification: '1TB',
    color: 'Black',
    state: 'Значні пошкодження',
    description: 'Залито рідиною, списано.',
    owner: 'company',
    clientName: '',
    clientPhone: '',
    warehouse: 'Харків',
    docs: [],
    status: 'written_off',
  },
];
