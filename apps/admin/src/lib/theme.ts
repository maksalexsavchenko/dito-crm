import type { TenantConfig } from '@dito/config';

/**
 * Applies a tenant's theme by overriding CSS variables on :root.
 * This is the white-label mechanism: one codebase, different brands.
 */
export function applyTenantTheme(t: TenantConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--primary', t.theme.primary);
  root.style.setProperty('--primary-foreground', t.theme.primaryForeground);
  root.style.setProperty('--ring', t.theme.primary);
}
