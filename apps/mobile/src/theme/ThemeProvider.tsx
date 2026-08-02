import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { loyaltyBrands, defaultLoyaltyBrandId, type LoyaltyBrand } from '@dito/config';
import { makeTheme, type Theme } from './tokens';

interface ThemeContextValue {
  theme: Theme;
  brand: LoyaltyBrand;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme() ?? 'light';
  // In production the brand id comes from the build's tenant, not a constant.
  const brand = loyaltyBrands[defaultLoyaltyBrandId];
  const value = useMemo(
    () => ({ brand, theme: makeTheme(brand, scheme === 'dark' ? 'dark' : 'light') }),
    [brand, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx.theme;
}

export function useBrand(): LoyaltyBrand {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useBrand must be used inside <ThemeProvider>');
  return ctx.brand;
}
