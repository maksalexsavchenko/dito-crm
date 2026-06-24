import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  Users,
  BarChart3,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import { isEnabled, type FeatureFlag } from '@dito/config';
import { useUI } from '../../store';

interface NavItem {
  to: string;
  key: string;
  icon: LucideIcon;
  feature?: FeatureFlag;
  exact?: boolean;
}

const items: NavItem[] = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard, exact: true },
  { to: '/inventory', key: 'inventory', icon: Package, feature: 'inventory' },
  { to: '/sales', key: 'sales', icon: ShoppingCart, feature: 'sales' },
  { to: '/repair', key: 'repair', icon: Wrench, feature: 'repair' },
  { to: '/contacts', key: 'contacts', icon: Users, feature: 'contacts' },
  { to: '/reports', key: 'reports', icon: BarChart3, feature: 'reports' },
  { to: '/kit', key: 'kit', icon: Palette },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen, tenant } = useUI();

  // Ховаємо пункти, вимкнені для цього tenant-а (feature-flags).
  const visible = items.filter((i) => !i.feature || isEnabled(tenant, i.feature));

  return (
    <aside
      className={`fixed left-0 top-0 z-20 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-200 ${
        sidebarOpen ? 'w-60' : 'w-16'
      }`}
    >
      <div className="flex h-14 items-center gap-3 px-4 font-semibold">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">
          {tenant.shortName.slice(0, 2)}
        </div>
        {sidebarOpen && <span className="truncate text-white">{tenant.name}</span>}
      </div>

      <nav className="mt-2 space-y-1 px-2">
        {visible.map(({ to, key, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: exact ?? false }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-white/10"
            activeProps={{ className: 'bg-white/15 !text-white' }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>{t(`nav.${key}`)}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
