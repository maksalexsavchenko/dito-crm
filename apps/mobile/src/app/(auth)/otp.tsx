import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { DEV_OTP_CODE } from '@/api/mockDb';
import { requestOtp, verifyOtp } from '@/api/auth';
import { messageOf } from '@/api/client';
import { formatPhone } from '@/domain/format';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

const RESEND_SECONDS = 60;

export default function OtpScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ challengeId: string; phone: string }>();
  const signIn = useAuth((s) => s.signIn);

  const [challengeId, setChallengeId] = useState(params.challengeId);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const { session, member } = await verifyOtp(challengeId, code);
      if (member) {
        // Known phone → straight into the app.
        await signIn(session, member);
      } else {
        router.replace({
          pathname: '/(auth)/register',
          params: { challengeId, phone: params.phone },
        });
      }
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    const challenge = await requestOtp(params.phone);
    setChallengeId(challenge.challengeId);
    setSecondsLeft(RESEND_SECONDS);
    setCode('');
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen>
        <View style={{ padding: theme.space(6), gap: theme.space(6) }}>
          <View style={{ gap: theme.space(2) }}>
            <Text variant="h1">{t('auth.otp.title')}</Text>
            <Text variant="body" tone="muted">
              {t('auth.otp.subtitle', { phone: formatPhone(params.phone) })}
            </Text>
          </View>

          <Field
            label={t('auth.otp.title')}
            value={code}
            onChangeText={(v) => {
              setCode(v.replace(/\D/g, ''));
              setError(null);
            }}
            placeholder="••••"
            keyboardType="number-pad"
            autoComplete="sms-otp"
            maxLength={4}
            error={error}
            hint={t('auth.otp.devHint', { code: DEV_OTP_CODE })}
          />

          <Button
            label={t('auth.otp.cta')}
            onPress={submit}
            loading={busy}
            disabled={code.length < 4}
          />

          {secondsLeft > 0 ? (
            <Text variant="small" tone="muted" center>
              {t('auth.otp.resendIn', { seconds: secondsLeft })}
            </Text>
          ) : (
            <Pressable onPress={resend} accessibilityRole="button">
              <Text variant="small" tone="primary" center>
                {t('auth.otp.resend')}
              </Text>
            </Pressable>
          )}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
