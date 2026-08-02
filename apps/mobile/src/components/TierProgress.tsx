import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { nextTierFor, tierFor } from '@dito/config';
import { useBrand, useTheme } from '@/theme/ThemeProvider';
import { formatMoney } from '@/domain/format';
import { Text } from './Text';

interface TierProgressProps {
  spendTotal: number;
  /** Compact variant drops the caption — used on the home balance card. */
  compact?: boolean;
}

/** Cashback badge plus the bar towards the next tier. */
export function TierProgress({ spendTotal, compact = false }: TierProgressProps) {
  const theme = useTheme();
  const brand = useBrand();
  const { t } = useTranslation();

  const tier = tierFor(brand, spendTotal);
  const next = nextTierFor(brand, spendTotal);
  const span = next ? next.threshold - tier.threshold : 0;
  const progress = next ? Math.min(1, Math.max(0, (spendTotal - tier.threshold) / span)) : 1;

  const badge = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
      <View
        style={{
          backgroundColor: theme.color.primary,
          borderRadius: theme.radius.pill,
          paddingHorizontal: theme.space(2.5),
          paddingVertical: theme.space(1),
        }}
      >
        <Text variant="small" weight="700" tone="onPrimary">
          {tier.cashbackPercent}%
        </Text>
      </View>
      <Text variant="body" tone="muted">
        {tier.cashbackPercent}% {tier.name}
      </Text>
    </View>
  );

  if (compact) return badge;

  return (
    <View style={{ gap: theme.space(3), alignItems: 'center' }}>
      {badge}

      <View
        style={{
          height: 6,
          width: '100%',
          borderRadius: theme.radius.pill,
          backgroundColor: theme.color.surfaceAlt,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: theme.color.primary,
            borderRadius: theme.radius.pill,
          }}
        />
      </View>

      {next ? (
        <>
          <Text variant="small" tone="primary">
            {formatMoney(Math.max(0, spendTotal - tier.threshold))} / {formatMoney(span)}
          </Text>
          <Text variant="small" tone="muted" center>
            {t('card.toNextTier', {
              tier: next.name,
              amount: formatMoney(next.threshold - spendTotal),
            })}
          </Text>
        </>
      ) : (
        <Text variant="small" tone="muted" center>
          {t('card.maxTier')}
        </Text>
      )}
    </View>
  );
}
