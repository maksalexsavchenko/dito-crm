export type StockStatus = 'in_stock' | 'low' | 'out';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  stock: number;
  price: number; // UAH
  description: string;
  status: StockStatus;
}

function status(stock: number): StockStatus {
  if (stock === 0) return 'out';
  if (stock <= 5) return 'low';
  return 'in_stock';
}

const raw: Omit<Product, 'status'>[] = [
  { id: '1', sku: 'APL-IP15-128', name: 'iPhone 15 128GB', category: 'Смартфони', warehouse: 'Київ', stock: 24, price: 41999, description: 'Флагман Apple з чипом A16 Bionic, OLED-дисплеєм 6.1" та подвійною камерою 48 Мп. Роз’єм USB-C, Dynamic Island.' },
  { id: '2', sku: 'APL-IP15P-256', name: 'iPhone 15 Pro 256GB', category: 'Смартфони', warehouse: 'Київ', stock: 8, price: 57999, description: 'Титановий корпус, чип A17 Pro, телеоб’єктив 3x та налаштовувана кнопка Action.' },
  { id: '3', sku: 'SAM-S24-256', name: 'Samsung Galaxy S24 256GB', category: 'Смартфони', warehouse: 'Львів', stock: 15, price: 36499, description: 'Компактний флагман з AI-функціями Galaxy та яскравим Dynamic AMOLED 2X 120 Гц.' },
  { id: '4', sku: 'SAM-A55-128', name: 'Samsung Galaxy A55 128GB', category: 'Смартфони', warehouse: 'Дніпро', stock: 3, price: 17999, description: 'Середній клас із металевим корпусом, камерою 50 Мп та екраном 120 Гц.' },
  { id: '5', sku: 'XIA-14-512', name: 'Xiaomi 14 512GB', category: 'Смартфони', warehouse: 'Харків', stock: 0, price: 32999, description: 'Камера Leica, Snapdragon 8 Gen 3 та швидка зарядка 90 Вт.' },
  { id: '6', sku: 'APL-MBA-M3', name: 'MacBook Air 13" M3', category: 'Ноутбуки', warehouse: 'Київ', stock: 6, price: 54999, description: 'Тонкий і легкий ноутбук на чипі M3, до 18 годин автономності, безшумне охолодження.' },
  { id: '7', sku: 'APL-MBP-14', name: 'MacBook Pro 14" M3 Pro', category: 'Ноутбуки', warehouse: 'Київ', stock: 4, price: 89999, description: 'Професійний ноутбук M3 Pro з дисплеєм Liquid Retina XDR та портами Thunderbolt 4.' },
  { id: '8', sku: 'ASU-ROG-G16', name: 'Asus ROG Strix G16', category: 'Ноутбуки', warehouse: 'Львів', stock: 5, price: 64999, description: 'Ігровий ноутбук з GeForce RTX 4060 та екраном 165 Гц.' },
  { id: '9', sku: 'LEN-LOQ-15', name: 'Lenovo LOQ 15', category: 'Ноутбуки', warehouse: 'Дніпро', stock: 11, price: 38999, description: 'Доступний ігровий ноутбук з RTX 4050 та продуманим охолодженням.' },
  { id: '10', sku: 'DEL-XPS-13', name: 'Dell XPS 13 Plus', category: 'Ноутбуки', warehouse: 'Харків', stock: 0, price: 71999, description: 'Преміум-ультрабук із безрамковим дисплеєм та сенсорною панеллю функцій.' },
  { id: '11', sku: 'APL-APP2', name: 'AirPods Pro 2', category: 'Навушники', warehouse: 'Київ', stock: 42, price: 9499, description: 'Бездротові навушники з активним шумозаглушенням, адаптивним звуком і USB-C.' },
  { id: '12', sku: 'SON-XM5', name: 'Sony WH-1000XM5', category: 'Навушники', warehouse: 'Львів', stock: 18, price: 13999, description: 'Топові накладні навушники з найкращим у класі шумозаглушенням.' },
  { id: '13', sku: 'JBL-T770', name: 'JBL Tune 770NC', category: 'Навушники', warehouse: 'Дніпро', stock: 2, price: 3299, description: 'Бюджетні навушники з ANC та автономністю до 70 годин.' },
  { id: '14', sku: 'APL-IPAD-A', name: 'iPad Air 11" M2', category: 'Планшети', warehouse: 'Київ', stock: 9, price: 28999, description: 'Планшет на чипі M2 з підтримкою Apple Pencil Pro та екраном Liquid Retina.' },
  { id: '15', sku: 'SAM-TABS9', name: 'Samsung Galaxy Tab S9', category: 'Планшети', warehouse: 'Львів', stock: 7, price: 31499, description: 'AMOLED-планшет із S Pen у комплекті та захистом IP68.' },
  { id: '16', sku: 'APL-IPAD-10', name: 'iPad 10.9" 64GB', category: 'Планшети', warehouse: 'Харків', stock: 0, price: 18999, description: 'Універсальний планшет для навчання, роботи та розваг.' },
  { id: '17', sku: 'ANK-737-PB', name: 'Anker 737 PowerBank', category: 'Аксесуари', warehouse: 'Київ', stock: 33, price: 3899, description: 'Потужний павербанк 24000 мА·год із виходом до 140 Вт та цифровим дисплеєм.' },
  { id: '18', sku: 'BSU-65W-GAN', name: 'Baseus 65W GaN зарядка', category: 'Зарядки', warehouse: 'Дніпро', stock: 56, price: 1299, description: 'Компактна зарядка на нітриді галію для ноутбука та смартфона, 3 порти.' },
  { id: '19', sku: 'APL-USBC-2M', name: 'Apple USB-C кабель 2м', category: 'Аксесуари', warehouse: 'Київ', stock: 120, price: 899, description: 'Оригінальний кабель для швидкої зарядки та передачі даних.' },
  { id: '20', sku: 'SAM-25W-CH', name: 'Samsung 25W зарядка', category: 'Зарядки', warehouse: 'Львів', stock: 4, price: 749, description: 'Адаптер швидкої зарядки Super Fast Charging з USB-C.' },
  { id: '21', sku: 'LOG-MX3S', name: 'Logitech MX Master 3S', category: 'Аксесуари', warehouse: 'Київ', stock: 14, price: 3699, description: 'Ергономічна миша для продуктивності з тихими кліками та точним сенсором 8K.' },
  { id: '22', sku: 'APL-MGK-UA', name: 'Magic Keyboard (UA)', category: 'Аксесуари', warehouse: 'Харків', stock: 1, price: 5499, description: 'Бездротова клавіатура Apple з українським розкладом і вбудованим акумулятором.' },
  { id: '23', sku: 'XIA-BND9', name: 'Xiaomi Smart Band 9', category: 'Аксесуари', warehouse: 'Дніпро', stock: 27, price: 1799, description: 'Фітнес-браслет з AMOLED-екраном, моніторингом сну та пульсу.' },
  { id: '24', sku: 'APL-WATCH-S9', name: 'Apple Watch Series 9', category: 'Аксесуари', warehouse: 'Київ', stock: 10, price: 17999, description: 'Смарт-годинник із жестом Double Tap та яскравим дисплеєм до 2000 ніт.' },
  { id: '25', sku: 'GOO-PIX8', name: 'Google Pixel 8', category: 'Смартфони', warehouse: 'Львів', stock: 5, price: 26999, description: 'Чистий Android, камера з AI-обробкою та 7 років оновлень.' },
  { id: '26', sku: 'NOT-12-PRO', name: 'Redmi Note 13 Pro', category: 'Смартфони', warehouse: 'Дніпро', stock: 22, price: 11999, description: 'Камера 200 Мп та AMOLED-дисплей 120 Гц за доступною ціною.' },
  { id: '27', sku: 'HP-PAV-15', name: 'HP Pavilion 15', category: 'Ноутбуки', warehouse: 'Харків', stock: 8, price: 27999, description: 'Універсальний ноутбук для дому та офісу з екраном Full HD.' },
  { id: '28', sku: 'BEL-MFI-CH', name: 'Belkin MagSafe зарядка', category: 'Зарядки', warehouse: 'Київ', stock: 3, price: 2499, description: 'Магнітна бездротова зарядка 15 Вт для iPhone з сертифікацією MagSafe.' },
];

export const products: Product[] = raw.map((p) => ({ ...p, status: status(p.stock) }));
