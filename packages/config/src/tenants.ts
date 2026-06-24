import type { TenantConfig } from './index';

// Демонстраційні tenant-и: показують white-label з одного codebase.
// На проді ці конфіги приходять із tenant config API.
export const tenants: Record<string, TenantConfig> = {
  demo: {
    id: 'demo',
    name: 'Dito Demo',
    shortName: 'DT',
    theme: { primary: '#2563eb', primaryForeground: '#ffffff' },
    features: { inventory: true, sales: true, repair: true, contacts: true, reports: true },
    defaultLocale: 'uk',
    currency: 'UAH',
    mode: 'cloud',
  },
  techno: {
    id: 'techno',
    name: 'ТехноМаркет',
    shortName: 'ТМ',
    theme: { primary: '#16a34a', primaryForeground: '#ffffff' },
    // Магазин без сервісного модуля — repair вимкнено.
    features: { inventory: true, sales: true, repair: false, contacts: true, reports: true },
    defaultLocale: 'uk',
    currency: 'UAH',
    mode: 'cloud',
  },
  fixhub: {
    id: 'fixhub',
    name: 'FixHub Service',
    shortName: 'FH',
    theme: { primary: '#db2777', primaryForeground: '#ffffff' },
    // Сервісний центр — окремий бренд (dedicated інстанс).
    features: { inventory: true, sales: true, repair: true, contacts: true, reports: true },
    defaultLocale: 'uk',
    currency: 'USD',
    mode: 'dedicated',
  },
};

export const defaultTenantId = 'demo';
