import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import {
  defaultLoyaltyBrandId,
  defaultTenantId,
  loyaltyBrands,
  tenants,
  type LoyaltyBrand,
  type TenantConfig,
} from '@dito/config';
import { makeTheme, type Theme } from './tokens';

interface ThemeContextValue {
  theme: Theme;
  brand: LoyaltyBrand;
  tenant: TenantConfig;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme() ?? 'light';
  // In production the brand id comes from the build's tenant, not a constant.
  const brand = loyaltyBrands[defaultLoyaltyBrandId];
  // Brand colours live on the tenant, shared with the CRM — see tokens.ts.
  const tenant = tenants[brand.tenantId] ?? tenants[defaultTenantId];

  const value = useMemo(
    () => ({
      brand,
      tenant,
      theme: makeTheme(tenant, scheme === 'dark' ? 'dark' : 'light'),
    }),
    [brand, tenant, scheme],
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

export function useTenant(): TenantConfig {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTenant must be used inside <ThemeProvider>');
  return ctx.tenant;
}
