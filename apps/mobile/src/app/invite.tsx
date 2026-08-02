import { Alert, Share, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { Copy, Share2 } from 'lucide-react-native';
import { useBrand, useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

export default function InviteScreen() {
  const theme = useTheme();
  const brand = useBrand();
  const { t } = useTranslation();
  const member = useAuth((s) => s.member);

  if (!member) return null;

  const copy = async () => {
    await Clipboard.setStringAsync(member.referralCode);
    Alert.alert(t('common.copied'), member.referralCode);
  };

  const share = async () => {
    await Share.share({
      message: `${t('invite.body', { amount: brand.referralBonus })}\n\n${member.referralCode}\n${brand.website}`,
    });
  };

  return (
    <Screen contentStyle={{ padding: theme.space(4), gap: theme.space(5) }}>
      <Text variant="body" tone="muted">
        {t('invite.body', { amount: brand.referralBonus })}
      </Text>

      <Card style={{ alignItems: 'center', gap: theme.space(3), paddingVertical: theme.space(8) }}>
        <Text variant="small" tone="muted">
          {t('invite.code')}
        </Text>
        <Text variant="h1" weight="700" tone="primary">
          {member.referralCode}
        </Text>
      </Card>

      <View style={{ gap: theme.space(3) }}>
        <Button
          label={t('invite.share')}
          onPress={share}
          leading={<Share2 size={18} color={theme.color.primaryForeground} />}
        />
        <Button
          label={t('invite.copy')}
          onPress={copy}
          variant="secondary"
          leading={<Copy size={18} color={theme.color.text} />}
        />
      </View>
    </Screen>
  );
}
