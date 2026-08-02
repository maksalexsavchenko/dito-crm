import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { messageOf } from '@/api/client';
import { updateProfile } from '@/api/loyalty';
import { formatBirthDate, formatPhone, parseBirthDate } from '@/domain/format';
import type { Gender } from '@/domain/types';
import { useAuth } from '@/stores/auth';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { ListGroup, ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { Text } from '@/components/Text';

export default function ProfileScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const session = useAuth((s) => s.session);
  const member = useAuth((s) => s.member);
  const setMember = useAuth((s) => s.setMember);

  const [firstName, setFirstName] = useState(member?.firstName ?? '');
  const [lastName, setLastName] = useState(member?.lastName ?? '');
  const [email, setEmail] = useState(member?.email ?? '');
  const [birthDate, setBirthDate] = useState(formatBirthDate(member?.birthDate ?? null));
  const [gender, setGender] = useState<Gender>(member?.gender ?? 'unspecified');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!member || !session) return null;

  const toggle = async (patch: { pushEnabled?: boolean; emailEnabled?: boolean }) => {
    // Notification switches save immediately — no Save button round-trip.
    setMember({ ...member, ...patch });
    try {
      setMember(await updateProfile(session.token, patch));
    } catch (e) {
      setMember(member);
      Alert.alert(messageOf(e));
    }
  };

  const save = async () => {
    if (birthDate && !parseBirthDate(birthDate)) {
      setError('Перевірте дату народження — формат ДД.ММ.РРРР.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const updated = await updateProfile(session.token, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || null,
        birthDate: birthDate ? parseBirthDate(birthDate) : null,
        gender,
      });
      setMember(updated);
      Alert.alert(t('profile.saved'));
      router.back();
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
      <Screen contentStyle={{ padding: theme.space(4), gap: theme.space(6) }}>
        <View style={{ gap: theme.space(4) }}>
          <Text variant="small" tone="muted" weight="600">
            {t('profile.personal').toUpperCase()}
          </Text>

          <Field
            label={t('auth.register.firstName')}
            value={firstName}
            onChangeText={(v) => {
              setFirstName(v);
              setError(null);
            }}
            autoCapitalize="words"
          />
          <Field
            label={t('auth.register.lastName')}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
          <Field
            label={t('auth.register.birthDate')}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="18.04.1992"
            keyboardType="number-pad"
            maxLength={10}
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
        </View>

        <View style={{ gap: theme.space(4) }}>
          <Text variant="small" tone="muted" weight="600">
            {t('profile.contacts').toUpperCase()}
          </Text>

          <Field
            label={t('profile.phone')}
            value={formatPhone(member.phone)}
            onChangeText={() => {}}
            editable={false}
            hint={t('profile.phoneLocked')}
          />
          <Field
            label={t('auth.register.email')}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ gap: theme.space(3) }}>
          <Text variant="small" tone="muted" weight="600">
            {t('profile.notifications').toUpperCase()}
          </Text>

          <ListGroup>
            <ListRow
              label={t('profile.push')}
              chevron={false}
              accessory={
                <Switch
                  value={member.pushEnabled}
                  onValueChange={(v) => void toggle({ pushEnabled: v })}
                  trackColor={{ true: theme.color.primary, false: theme.color.border }}
                />
              }
            />
            <ListRow
              label={t('profile.emailNews')}
              chevron={false}
              divider={false}
              accessory={
                <Switch
                  value={member.emailEnabled}
                  onValueChange={(v) => void toggle({ emailEnabled: v })}
                  trackColor={{ true: theme.color.primary, false: theme.color.border }}
                />
              }
            />
          </ListGroup>
        </View>

        {error ? (
          <Text variant="small" tone="danger">
            {error}
          </Text>
        ) : null}

        <Button label={t('common.save')} onPress={save} loading={busy} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
