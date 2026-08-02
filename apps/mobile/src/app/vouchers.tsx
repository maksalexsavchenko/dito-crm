import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TicketCheck } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { messageOf } from '@/api/client';
import { redeemVoucher } from '@/api/loyalty';
import { formatDateTime } from '@/domain/format';
import { useAuth } from '@/stores/auth';
import { useLoyalty } from '@/stores/loyalty';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

export default function VouchersScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const session = useAuth((s) => s.session);
  const setMember = useAuth((s) => s.setMember);
  const vouchers = useLoyalty((s) => s.vouchers);
  const load = useLoyalty((s) => s.load);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redeem = async () => {
    if (!session) return;
    setBusy(true);
    setError(null);
    try {
      const result = await redeemVoucher(session.token, code);
      setMember(result.member);
      await load();
      setCode('');
      Alert.alert(result.voucher.title, t('vouchers.success', { amount: result.voucher.bonusValue }));
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const redeemed = vouchers.filter((v) => v.status === 'used');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen contentStyle={{ padding: theme.space(4), gap: theme.space(6) }}>
        <View style={{ gap: theme.space(4) }}>
          <Field
            label={t('vouchers.codeLabel')}
            value={code}
            onChangeText={(v) => {
              setCode(v.toUpperCase());
              setError(null);
            }}
            placeholder={t('vouchers.placeholder')}
            autoCapitalize="characters"
            error={error}
            hint={t('vouchers.hint')}
          />

          <Button
            label={t('vouchers.cta')}
            onPress={redeem}
            loading={busy}
            disabled={code.trim().length === 0}
          />
        </View>

        <View style={{ gap: theme.space(3) }}>
          <Text variant="small" tone="muted" weight="600">
            {t('vouchers.history').toUpperCase()}
          </Text>

          {redeemed.length === 0 ? (
            <Text variant="body" tone="muted">
              {t('vouchers.empty')}
            </Text>
          ) : (
            redeemed.map((voucher) => (
              <Card key={voucher.id} style={{ flexDirection: 'row', gap: theme.space(3) }}>
                <TicketCheck size={22} color={theme.color.success} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="h3" weight="600">
                    {voucher.title}
                  </Text>
                  <Text variant="small" tone="muted">
                    {voucher.description}
                  </Text>
                  {voucher.redeemedAt ? (
                    <Text variant="tiny" tone="muted">
                      {formatDateTime(voucher.redeemedAt)}
                    </Text>
                  ) : null}
                </View>
                <Text variant="h3" weight="700" tone="success">
                  +{voucher.bonusValue}
                </Text>
              </Card>
            ))
          )}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
