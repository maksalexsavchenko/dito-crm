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
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/legal/terms')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: theme.color.primary,
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.space(3),
            paddingVertical: theme.space(1.5),
          }}
        >
          <Text variant="small" weight="600" tone="onPrimary">
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.accentSoft }}>
      <Screen
        tabBarPadding
        transparent
        contentStyle={{ padding: theme.space(4), gap: theme.space(5) }}
      >
        <Text variant="h3" tone="muted" center>
          {now.toTimeString().slice(0, 8)}
        </Text>

        <QrPanel value={member.cardNumber} size={220} />

        <Pressable accessibilityRole="button" onPress={copyNumber}>
          <Text variant="h3" weight="600" center>
            {formatCardNumber(member.cardNumber, brand)}
          </Text>
        </Pressable>

        {/* Apple's guidelines fix the Wallet button as black with white content,
            so it deliberately ignores the theme. */}
        <Pressable
          accessibilityRole="button"
          onPress={addToWallet}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.space(2),
            alignSelf: 'center',
            backgroundColor: '#000000',
            borderRadius: theme.radius.pill,
            paddingVertical: theme.space(3.5),
            paddingHorizontal: theme.space(8),
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Wallet size={20} color="#FFFFFF" />
          <Text variant="h3" weight="600" style={{ color: '#FFFFFF' }}>
            {t('card.addWallet')}
          </Text>
        </Pressable>

        <View style={{ gap: theme.space(1), alignItems: 'center' }}>
          <Text variant="body" tone="muted">
            {t('card.balance')}
          </Text>
          <Text variant="h1" weight="700">
            {formatMoney(member.bonusBalance)}
          </Text>
        </View>

        <Text variant="small" tone="muted" center>
          {t('card.hint')}
        </Text>

        <Card>
          <TierProgress spendTotal={member.spendTotal} />
        </Card>
      </Screen>
    </View>
  );
}
