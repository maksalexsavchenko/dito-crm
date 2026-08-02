import type { TenantConfig } from '@dito/config';

// Design tokens for the mobile app. Colours are the same set the CRM defines as
// CSS variables in apps/admin/src/index.css — keep the two in sync, since a
// customer seeing the app and a manager seeing the CRM should see one brand.
//
//   mobile              admin (index.css)
//   background      ←   --background
//   surface         ←   --card
//   surfaceAlt      ←   --muted
//   text            ←   --foreground
//   textMuted       ←   --muted-foreground
//   border          ←   --border
//   danger          ←   --destructive
//   primary         ←   --primary (per tenant, from tenants[].theme)

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  color: {
    /** Screen background. */
    background: string;
    /** Cards, rows, sheets. */
    surface: string;
    /** Nested surfaces (inputs, chips, segmented controls). */
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    primaryForeground: string;
    /** Tinted brand surface behind the guest card — primary at low opacity. */
    accentSoft: string;
    danger: string;
    success: string;
    warning: string;
    /** Headers and the tab bar. */
    chrome: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number; pill: number };
  space: (steps: number) => number;
  font: {
    h1: number; h2: number; h3: number;
    body: number; small: number; tiny: number;
    display: number;
  };
}

const BASE_UNIT = 4;

const neutrals = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    danger: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
    chrome: '#ffffff',
  },
  dark: {
    background: '#0b1220',
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    border: '#1e293b',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    chrome: '#0f172a',
  },
} as const;

/**
 * Translucent wash of a token colour, for chips and large brand surfaces.
 * Derived rather than configured, so a tenant only declares one brand colour.
 */
export function tint(color: string, scheme: ColorScheme): string {
  const alpha = scheme === 'dark' ? '24' : '14'; // ~14% on dark, ~8% on light
  return `${color}${alpha}`;
}

export function makeTheme(tenant: TenantConfig, scheme: ColorScheme): Theme {
  const base = neutrals[scheme];

  return {
    scheme,
    color: {
      ...base,
      primary: tenant.theme.primary,
      primaryForeground: tenant.theme.primaryForeground,
      accentSoft: tint(tenant.theme.primary, scheme),
    },
    radius: { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 },
    space: (steps: number) => steps * BASE_UNIT,
    font: {
      display: 40,
      h1: 26,
      h2: 20,
      h3: 17,
      body: 15,
      small: 13,
      tiny: 11,
    },
  };
}
