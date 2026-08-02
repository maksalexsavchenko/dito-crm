import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { messageOf } from '@/api/client';
import { submitReview } from '@/api/loyalty';
import { useAuth } from '@/stores/auth';
import { useLoyalty } from '@/stores/loyalty';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

export default function ReviewScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const locations = useLoyalty((s) => s.locations);

  const [rating, setRating] = useState(0);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!session) return;
    setBusy(true);
    try {
      await submitReview(session.token, { rating, comment: comment.trim(), locationId });
      Alert.alert(t('review.thanks'));
      router.back();
    } catch (e) {
      Alert.alert(messageOf(e));
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
        <Text variant="body" tone="muted">
          {t('review.subtitle')}
        </Text>

        <View style={{ gap: theme.space(3) }}>
          <Text variant="small" tone="muted">
            {t('review.rating')}
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`${value}`}
                onPress={() => setRating(value)}
                style={{ padding: theme.space(1) }}
              >
                <Star
                  size={34}
                  color={value <= rating ? theme.color.warning : theme.color.border}
                  fill={value <= rating ? theme.color.warning : 'transparent'}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: theme.space(3) }}>
          <Text variant="small" tone="muted">
            {t('review.location')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.space(2) }}>
            {[{ id: null, title: t('review.anyLocation') }, ...locations].map((option) => {
              const active = option.id === locationId;
              return (
                <Pressable
                  key={option.id ?? 'any'}
                  accessibilityRole="button"
                  onPress={() => setLocationId(option.id)}
                  style={{
                    backgroundColor: active ? theme.color.primary : theme.color.surface,
                    borderRadius: theme.radius.pill,
                    paddingHorizontal: theme.space(4),
                    paddingVertical: theme.space(2.5),
                    maxWidth: 240,
                  }}
                >
                  <Text variant="body" numberOfLines={1} tone={active ? 'onPrimary' : 'default'}>
                    {option.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Field
          label={t('review.comment')}
          value={comment}
          onChangeText={setComment}
          placeholder={t('review.placeholder')}
          multiline
        />

        <Button label={t('review.cta')} onPress={submit} loading={busy} disabled={rating === 0} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
