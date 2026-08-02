import { useMemo } from 'react';
import { SectionList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ArrowDownLeft, ArrowUpRight, Gift, Hourglass } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { formatBonusDelta, formatDateTime, formatMoney, formatMonth } from '@/domain/format';
import type { LoyaltyTransaction } from '@/domain/types';
import { useLoyalty } from '@/stores/loyalty';
import { Screen } from '@/components/Screen';
import { Empty } from '@/components/State';
import { Text } from '@/components/Text';

interface Section {
  title: string;
  data: LoyaltyTransaction[];
}

/** Groups the ledger into month sections, newest month first. */
function groupByMonth(transactions: LoyaltyTransaction[]): Section[] {
  const sections: Section[] = [];
  for (const transaction of transactions) {
    const title = formatMonth(transaction.createdAt);
    const last = sections[sections.length - 1];
    if (last?.title === title) last.data.push(transaction);
    else sections.push({ title, data: [transaction] });
  }
  return sections;
}

export default function TransactionsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const transactions = useLoyalty((s) => s.transactions);
  const locations = useLoyalty((s) => s.locations);
  const loading = useLoyalty((s) => s.loading);
  const loadTransactions = useLoyalty((s) => s.loadTransactions);

  const sections = useMemo(() => groupByMonth(transactions), [transactions]);

  const iconFor = (transaction: LoyaltyTransaction) => {
    const props = { size: 18, color: theme.color.primary };
    switch (transaction.type) {
      case 'purchase':
        return <ArrowUpRight {...props} />;
      case 'redeem':
        return <ArrowDownLeft size={18} color={theme.color.textMuted} />;
      case 'expire':
        return <Hourglass size={18} color={theme.color.textMuted} />;
      default:
        return <Gift {...props} />;
    }
  };

  return (
    <Screen scroll={false}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={() => void loadTransactions()}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ padding: theme.space(4), paddingBottom: theme.space(10) }}
        ListEmptyComponent={<Empty title={t('transactions.empty')} />}
        renderSectionHeader={({ section }) => (
          <Text
            variant="small"
            tone="muted"
            weight="600"
            style={{ marginTop: theme.space(5), marginBottom: theme.space(2) }}
          >
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => {
          const location = locations.find((l) => l.id === item.locationId);
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.space(3),
                backgroundColor: theme.color.surface,
                borderRadius: theme.radius.md,
                padding: theme.space(4),
                marginBottom: theme.space(2),
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: theme.radius.pill,
                  backgroundColor: theme.color.accentSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {iconFor(item)}
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="h3" weight="600" numberOfLines={1}>
                  {item.note ?? t(`transactions.type.${item.type}`)}
                </Text>
                <Text variant="small" tone="muted" numberOfLines={1}>
                  {formatDateTime(item.createdAt)}
                  {location ? ` · ${location.address}` : ''}
                </Text>
                {item.amount > 0 ? (
                  <Text variant="small" tone="muted">
                    {t('transactions.receipt')}: {formatMoney(item.amount)}
                  </Text>
                ) : null}
              </View>

              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Text
                  variant="h3"
                  weight="700"
                  tone={item.bonusDelta >= 0 ? 'success' : 'default'}
                >
                  {formatBonusDelta(item.bonusDelta)}
                </Text>
                <Text variant="tiny" tone="muted">
                  {t('transactions.balanceAfter', { value: item.balanceAfter })}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}
