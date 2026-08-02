import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { requestOtp } from '@/api/auth';
import { messageOf } from '@/api/client';
import { toE164 } from '@/domain/format';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

export default function PhoneScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const phone = toE164(input);
    if (!phone) {
      setError(t('auth.phone.invalid'));
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const challenge = await requestOtp(phone);
      router.push({
        pathname: '/(auth)/otp',
        params: { challengeId: challenge.challengeId, phone: challenge.phone },
      });
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen>
        <View style={{ padding: theme.space(6), gap: theme.space(6) }}>
          <View style={{ gap: theme.space(2) }}>
            <Text variant="h1">{t('auth.phone.title')}</Text>
            <Text variant="body" tone="muted">
              {t('auth.phone.subtitle')}
            </Text>
          </View>

          <Field
            label={t('auth.phone.label')}
            value={input}
            onChangeText={(v) => {
              setInput(v);
              setError(null);
            }}
            placeholder="067 123 45 67"
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={19}
            error={error}
          />

          <Button
            label={t('auth.phone.cta')}
            onPress={submit}
            loading={busy}
            disabled={input.length === 0}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
