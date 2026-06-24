// ── Feature flags ──────────────────────────────────────────────
// Кожен модуль вмикається per-tenant / per-license.
export type FeatureFlag =
  | 'inventory'
  | 'sales'
  | 'repair'
  | 'contacts'
  | 'reports';

export const ALL_FEATURES: FeatureFlag[] = [
  'inventory',
  'sales',
  'repair',
  'contacts',
  'reports',
];

// ── White-label theme ──────────────────────────────────────────
// Мінімальний набір токенів, які перевизначаються на рівні tenant.
export interface TenantTheme {
  primary: string;
  primaryForeground: string;
}

// ── Deployment mode ────────────────────────────────────────────
// Один codebase → два режими (без форку коду).
export type DeploymentMode = 'cloud' | 'dedicated';

// ── Tenant config ──────────────────────────────────────────────
export interface TenantConfig {
  id: string;
  name: string;
  shortName: string;
  theme: TenantTheme;
  features: Record<FeatureFlag, boolean>;
  defaultLocale: 'uk' | 'en';
  currency: 'UAH' | 'USD' | 'EUR';
  mode: DeploymentMode;
}

export function isEnabled(t: TenantConfig, f: FeatureFlag): boolean {
  return t.features[f] === true;
}

export * from './tenants';
