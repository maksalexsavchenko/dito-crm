// ── Feature flags ──────────────────────────────────────────────
// Each module is toggled per tenant / per license.
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
// Minimal token set overridable per tenant.
export interface TenantTheme {
  primary: string;
  primaryForeground: string;
}

// ── Deployment mode ────────────────────────────────────────────
// One codebase → two modes (no code fork).
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
export * from './loyalty';
