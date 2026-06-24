import { useTranslation } from 'react-i18next';
import { TrendingUp, ShoppingCart, AlertTriangle, Wrench, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@dito/ui';

interface Stat {
  key: string;
  value: string;
  delta: string;
  icon: LucideIcon;
}

const stats: Stat[] = [
  { key: 'revenue', value: '₴ 248 500', delta: '+12%', icon: TrendingUp },
  { key: 'orders', value: '1 284', delta: '+5%', icon: ShoppingCart },
  { key: 'lowStock', value: '37', delta: '-3', icon: AlertTriangle },
  { key: 'repairs', value: '52', delta: '+8', icon: Wrench },
];

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">{t('dashboard.title')}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ key, value, delta, icon: Icon }) => (
          <Card key={key} className="gap-0 py-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t(`dashboard.${key}`)}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-semibold">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 py-0">
        <CardContent className="p-6 text-sm text-muted-foreground">
          {t('dashboard.placeholder')}
        </CardContent>
      </Card>
    </div>
  );
}
