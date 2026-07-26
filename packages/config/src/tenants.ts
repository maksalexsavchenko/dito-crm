import type { TenantConfig } from './index';

// Demo tenants: showcase white-label from a single codebase.
// In production these configs come from the tenant config API.
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
    // Retail store without the service module — repair disabled.
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
    // Service center — separate brand (dedicated instance).
    features: { inventory: true, sales: true, repair: true, contacts: true, reports: true },
    defaultLocale: 'uk',
    currency: 'USD',
    mode: 'dedicated',
  },
};

export const defaultTenantId = 'demo';
