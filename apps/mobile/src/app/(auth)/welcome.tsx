import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gift, QrCode, Sparkles } from 'lucide-react-native';
import { useBrand, useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';

export default function WelcomeScreen() {
  const theme = useTheme();
  const brand = useBrand();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const perks = [
    { icon: QrCode, text: t('card.hint') },
    { icon: Sparkles, text: t('auth.welcome.subtitle') },
    {
      icon: Gift,
      text: t('auth.register.welcomeBonus', { amount: brand.welcomeBonus }),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.background }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: theme.color.accentSoft,
        }}
      >
        <View style={{ padding: theme.space(8), gap: theme.space(4) }}>
          <Text variant="h1">{brand.appName}</Text>
          <Text variant="h2" weight="600">
            {t('auth.welcome.title')}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: theme.color.surface,
          borderTopLeftRadius: theme.radius.xl,
          borderTopRightRadius: theme.radius.xl,
          marginTop: -theme.space(6),
          padding: theme.space(6),
          paddingBottom: insets.bottom + theme.space(6),
          gap: theme.space(5),
        }}
      >
        {perks.map(({ icon: Icon, text }) => (
          <View
            key={text}
            style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(3) }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: theme.radius.md,
                backgroundColor: theme.color.accentSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={18} color={theme.color.primary} />
            </View>
            <Text variant="body" tone="muted" style={{ flex: 1 }}>
              {text}
            </Text>
          </View>
        ))}

        <Button label={t('auth.welcome.cta')} onPress={() => router.push('/(auth)/phone')} />

        <Text variant="tiny" tone="muted" center>
          {t('auth.welcome.legal')}
        </Text>
      </View>
    </View>
  );
}
