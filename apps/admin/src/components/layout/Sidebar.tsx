import { useState } from 'react';
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
  Menu,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react';
import { isEnabled, tenants, type FeatureFlag, type TenantConfig } from '@dito/config';
import { cn, Button } from '@dito/ui';
import { useUI } from '../../store';
import { applyTenantTheme } from '../../lib/theme';
import i18n from '../../i18n';

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

const selectCls = 'w-full rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-sidebar-foreground';

export function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen, toggleSidebar, tenant, tenantId, setTenant, dark, toggleDark } = useUI();
  // Наведення розгортає згорнуту панель тимчасово (як прев'ю, поверх контенту,
  // не зсуваючи його — той бере ширину лише з sidebarOpen). Розгорнута ж
  // панель (по кліку) залишається фіксованою і на hover не реагує.
  const [hovered, setHovered] = useState(false);
  const previewing = hovered && !sidebarOpen;
  const expanded = sidebarOpen || previewing;

  // Ховаємо пункти, вимкнені для цього tenant-а (feature-flags).
  const visible = items.filter((i) => !i.feature || isEnabled(tenant, i.feature));

  function onTenant(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setTenant(id);
    applyTenantTheme(tenants[id]);
    void i18n.changeLanguage(tenants[id].defaultLocale);
  }

  function onLang(e: React.ChangeEvent<HTMLSelectElement>) {
    void i18n.changeLanguage(e.target.value);
  }

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'fixed left-0 top-0 z-20 flex h-screen flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-all duration-200',
        expanded ? 'w-52' : 'w-16',
        previewing && 'shadow-2xl',
      )}
    >
      <div className={cn('flex h-14 shrink-0 items-center font-semibold', expanded ? 'gap-3 px-4' : 'justify-center')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">
          {tenant.shortName.slice(0, 2)}
        </div>
        {expanded && (
          <>
            <span className="truncate text-white">{tenant.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto shrink-0 text-sidebar-foreground/80 hover:bg-white/10 hover:text-white"
              onClick={toggleSidebar}
              aria-label="toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-2">
        {visible.map(({ to, key, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: exact ?? false }}
            className={cn(
              'flex h-10 items-center rounded-lg text-sm text-sidebar-foreground/80 transition-colors hover:bg-white/10',
              expanded ? 'w-full gap-3 px-3' : 'w-10 justify-center',
            )}
            activeProps={{ className: 'bg-white/15 !text-white' }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {expanded && <span className="truncate">{t(`nav.${key}`)}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/10 px-2 py-2">
        <button
          type="button"
          onClick={toggleDark}
          className={cn(
            'flex h-10 items-center rounded-lg text-sm text-sidebar-foreground/80 transition-colors hover:bg-white/10',
            expanded ? 'w-full gap-3 px-3' : 'w-10 justify-center',
          )}
        >
          {dark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {expanded && <span className="truncate">{t('common.theme')}</span>}
        </button>

        {expanded && (
          <div className="space-y-2 px-1 pt-1 pb-1">
            <label className="block space-y-1 text-[11px] text-sidebar-foreground/50">
              {t('common.tenant')}
              <select value={tenantId} onChange={onTenant} className={selectCls}>
                {Object.values(tenants).map((tn: TenantConfig) => (
                  <option key={tn.id} value={tn.id}>
                    {tn.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1 text-[11px] text-sidebar-foreground/50">
              {t('common.language')}
              <select value={i18n.language} onChange={onLang} className={selectCls}>
                <option value="uk">UA</option>
                <option value="en">EN</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}
