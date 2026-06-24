import { create } from 'zustand';
import { tenants, defaultTenantId, type TenantConfig } from '@dito/config';

interface UIState {
  tenantId: string;
  tenant: TenantConfig;
  sidebarOpen: boolean;
  dark: boolean;
  setTenant: (id: string) => void;
  toggleSidebar: () => void;
  toggleDark: () => void;
}

export const useUI = create<UIState>((set) => ({
  tenantId: defaultTenantId,
  tenant: tenants[defaultTenantId],
  sidebarOpen: true,
  dark: false,
  setTenant: (id) => set({ tenantId: id, tenant: tenants[id] }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDark: () =>
    set((s) => {
      const dark = !s.dark;
      document.documentElement.classList.toggle('dark', dark);
      return { dark };
    }),
}));
