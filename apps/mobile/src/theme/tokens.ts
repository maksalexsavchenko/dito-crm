import type { LoyaltyBrand } from '@dito/config';

// Design tokens, derived from the brand config at runtime. This is the mobile
// counterpart of the CSS-variable swap the admin app does for white-label.

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  color: {
    /** Screen background — grouped-list grey on iOS. */
    background: string;
    /** Cards, rows, sheets. */
    surface: string;
    /** Nested surfaces (inputs, chips). */
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    primaryForeground: string;
    accentSoft: string;
    danger: string;
    success: string;
    warning: string;
    /** Tab bar / header chrome. */
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

export function makeTheme(brand: LoyaltyBrand, scheme: ColorScheme): Theme {
  const dark = scheme === 'dark';

  return {
    scheme,
    color: {
      background: dark ? '#0E0E11' : '#F4F4F6',
      surface: dark ? '#1A1A1F' : '#FFFFFF',
      surfaceAlt: dark ? '#25252C' : '#F0F0F3',
      text: dark ? '#F5F5F7' : '#16161A',
      textMuted: dark ? '#98989F' : '#8A8A92',
      border: dark ? '#2C2C33' : '#E6E6EA',
      primary: brand.palette.primary,
      primaryForeground: brand.palette.primaryForeground,
      accentSoft: dark ? '#2A1620' : brand.palette.accentSoft,
      danger: '#F0475F',
      success: '#2FB471',
      warning: '#F5A623',
      chrome: dark ? '#141418' : '#FFFFFF',
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
