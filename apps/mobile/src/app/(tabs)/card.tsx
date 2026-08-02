import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Wallet } from 'lucide-react-native';
import { useBrand, useTheme } from '@/theme/ThemeProvider';
import { formatCardNumber, formatMoney } from '@/domain/format';
import { useAuth } from '@/stores/auth';
import { Card } from '@/components/Card';
import { QrPanel } from '@/components/QrPanel';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { TierProgress } from '@/components/TierProgress';

export default function CardScreen() {
  const theme = useTheme();
  const brand = useBrand();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const member = useAuth((s) => s.member);
  const [now, setNow] = useState(() => new Date());

  // A ticking clock next to the code proves to the cashier that the screen is
  // live rather than a screenshot of someone else's card.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      // A plain text action, not a filled pill: this is a secondary link, and a
      // solid button here competes with the card for attention.
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/legal/terms')}
          hitSlop={12}
          // A custom headerRight gets no inset of its own and would sit flush
          // against the screen edge.
          style={{ paddingRight: theme.space(2) }}
        >
          <Text variant="body" tone="primary">
            {t('card.terms')}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, router, t, theme]);

  if (!member) return null;

  const copyNumber = async () => {
    await Clipboard.setStringAsync(member.cardNumber);
    Alert.alert(t('common.copied'), formatCardNumber(member.cardNumber, brand));
  };

  const addToWallet = () => {
    // Real passes need an Apple-signed .pkpass generated server-side.
    Alert.alert(t('card.addWallet'), t('card.walletUnavailable'));
  };

  const walletBackground = theme.scheme === 'dark' ? '#FFFFFF' : '#000000';
  const walletForeground = theme.scheme === 'dark' ? '#000000' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.accentSoft }}>
      <Screen
        tabBarPadding
        transparent
        contentStyle={{ padding: theme.space(4), gap: theme.space(6) }}
      >
        {/* The card itself: code, number and clock read as one object, so they
            sit on one surface with tight spacing. */}
        <Card style={{ alignItems: 'center', gap: theme.space(4), paddingVertical: theme.space(6) }}>
          {/* Keeps its white plate: on a dark card the code still has to scan. */}
          <QrPanel value={member.cardNumber} size={196} />

          <Pressable accessibilityRole="button" onPress={copyNumber} hitSlop={8}>
            <Text
              variant="h3"
              weight="600"
              center
              // Fixed-width digits so the number does not shift as it renders.
              style={{ letterSpacing: 1, fontVariant: ['tabular-nums'] }}
            >
              {formatCardNumber(member.cardNumber, brand)}
            </Text>
          </Pressable>

          <Text
            variant="tiny"
            tone="muted"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {now.toTimeString().slice(0, 8)}
          </Text>
        </Card>

        <View style={{ gap: theme.space(4), alignItems: 'center' }}>
          <Text variant="small" tone="muted" center>
            {t('card.hint')}
          </Text>

          {/* Apple ships the Wallet button in black and white variants; the
              black one disappears on a dark background, so it follows the
              scheme rather than the brand palette. */}
          <Pressable
            accessibilityRole="button"
            onPress={addToWallet}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.space(2),
              alignSelf: 'center',
              backgroundColor: walletBackground,
              borderRadius: theme.radius.pill,
              paddingVertical: theme.space(2.5),
              paddingHorizontal: theme.space(5),
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Wallet size={16} color={walletForeground} />
            <Text variant="body" weight="600" style={{ color: walletForeground }}>
              {t('card.addWallet')}
            </Text>
          </Pressable>
        </View>

        {/* Balance and tier progress are one story — how much you have and how
            far to the next rate — so they share a surface. */}
        <Card style={{ gap: theme.space(5) }}>
          <View style={{ gap: theme.space(1), alignItems: 'center' }}>
            <Text variant="small" tone="muted">
              {t('card.balance')}
            </Text>
            <Text variant="h1" weight="700">
              {formatMoney(member.bonusBalance)}
            </Text>
          </View>

          <TierProgress spendTotal={member.spendTotal} />
        </Card>
      </Screen>
    </View>
  );
}
