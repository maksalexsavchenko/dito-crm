import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useBrand, useTheme } from '@/theme/ThemeProvider';
import { register } from '@/api/auth';
import { messageOf } from '@/api/client';
import { formatPhone, parseBirthDate } from '@/domain/format';
import type { Gender } from '@/domain/types';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { Text } from '@/components/Text';

export default function RegisterScreen() {
  const theme = useTheme();
  const brand = useBrand();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ challengeId: string; phone: string }>();
  const signIn = useAuth((s) => s.signIn);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('unspecified');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (firstName.trim().length < 2) {
      setError("Ім'я має містити щонайменше 2 символи.");
      return;
    }
    if (birthDate && !parseBirthDate(birthDate)) {
      setError('Перевірте дату народження — формат ДД.ММ.РРРР.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const { session, member } = await register({
        challengeId: params.challengeId,
        phone: params.phone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || null,
        birthDate: birthDate ? parseBirthDate(birthDate) : null,
        gender,
      });
      await signIn(session, member);
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
        <View style={{ padding: theme.space(6), gap: theme.space(5) }}>
          <View style={{ gap: theme.space(2) }}>
            <Text variant="h1">{t('auth.register.title')}</Text>
            <Text variant="body" tone="muted">
              {t('auth.register.subtitle')}
            </Text>
          </View>

          <Field
            label={t('auth.register.firstName')}
            value={firstName}
            onChangeText={(v) => {
              setFirstName(v);
              setError(null);
            }}
            autoCapitalize="words"
            autoComplete="given-name"
          />

          <Field
            label={t('auth.register.lastName')}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoComplete="family-name"
          />

          <Field
            label={`${t('auth.register.email')} (${t('common.optional')})`}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Field
            label={`${t('auth.register.birthDate')} (${t('common.optional')})`}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="18.04.1992"
            keyboardType="number-pad"
            maxLength={10}
            hint={t('auth.register.birthDateHint')}
          />

          <View style={{ gap: theme.space(2) }}>
            <Text variant="small" tone="muted">
              {t('auth.register.gender')}
            </Text>
            <Segmented
              value={gender}
              onChange={setGender}
              options={[
                { value: 'female', label: t('auth.register.female') },
                { value: 'male', label: t('auth.register.male') },
                { value: 'unspecified', label: t('auth.register.unspecified') },
              ]}
            />
          </View>

          <View style={{ gap: theme.space(2) }}>
            <Text variant="small" tone="muted">
              {t('profile.phone')}: {formatPhone(params.phone)}
            </Text>
            <Text variant="small" tone="primary">
              {t('auth.register.welcomeBonus', { amount: brand.welcomeBonus })}
            </Text>
          </View>

          {error ? (
            <Text variant="small" tone="danger">
              {error}
            </Text>
          ) : null}

          <Button label={t('auth.register.cta')} onPress={submit} loading={busy} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
