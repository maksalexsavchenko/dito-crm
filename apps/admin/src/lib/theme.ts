import type { TenantConfig } from '@dito/config';

/**
 * Застосовує тему tenant-а, перевизначаючи CSS-змінні на :root.
 * Це і є механізм white-label: один codebase, різні бренди.
 */
export function applyTenantTheme(t: TenantConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--primary', t.theme.primary);
  root.style.setProperty('--primary-foreground', t.theme.primaryForeground);
  root.style.setProperty('--ring', t.theme.primary);
}
