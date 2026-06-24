import { Menu, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@dito/ui';
import { tenants, type TenantConfig } from '@dito/config';
import { useUI } from '../../store';
import { applyTenantTheme } from '../../lib/theme';
import i18n from '../../i18n';

export function Topbar() {
  const { t } = useTranslation();
  const { toggleSidebar, tenantId, setTenant, tenant, dark, toggleDark } = useUI();

  function onTenant(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setTenant(id);
    applyTenantTheme(tenants[id]);
    void i18n.changeLanguage(tenants[id].defaultLocale);
  }

  function onLang(e: React.ChangeEvent<HTMLSelectElement>) {
    void i18n.changeLanguage(e.target.value);
  }

  const selectCls =
    'rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="toggle">
        <Menu className="h-5 w-5" />
      </Button>

      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        {t('common.mode')}: {tenant.mode}
      </span>

      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="theme">
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {t('common.tenant')}
          <select value={tenantId} onChange={onTenant} className={selectCls}>
            {Object.values(tenants).map((tn: TenantConfig) => (
              <option key={tn.id} value={tn.id}>
                {tn.name}
              </option>
            ))}
          </select>
        </label>

        <select value={i18n.language} onChange={onLang} className={selectCls}>
          <option value="uk">UA</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
  );
}
