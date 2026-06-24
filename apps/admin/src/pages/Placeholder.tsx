import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@dito/ui';

export function Placeholder({ pageKey }: { pageKey: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">{t(`nav.${pageKey}`)}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t('common.comingSoon')}</p>
      <Card>
        <CardContent className="flex h-48 items-center justify-center p-6 text-sm text-muted-foreground">
          {t(`nav.${pageKey}`)} — {t('common.comingSoon')}
        </CardContent>
      </Card>
    </div>
  );
}
