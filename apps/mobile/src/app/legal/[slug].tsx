import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getLegalDoc } from '@/api/content';
import { formatDate } from '@/domain/format';
import type { LegalDoc } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/State';
import { Text } from '@/components/Text';

export default function LegalScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [doc, setDoc] = useState<LegalDoc | null>(null);

  useEffect(() => {
    const key: LegalDoc['slug'] = slug === 'privacy' ? 'privacy' : 'terms';
    void getLegalDoc(key).then(setDoc);
  }, [slug]);

  useEffect(() => {
    if (doc) navigation.setOptions({ title: doc.title });
  }, [navigation, doc]);

  if (!doc) return <Loading />;

  return (
    <Screen contentStyle={{ padding: theme.space(5), gap: theme.space(5) }}>
      <Text variant="small" tone="muted">
        Оновлено {formatDate(doc.updatedAt)}
      </Text>

      {doc.paragraphs.map((paragraph, index) => (
        <View key={index} style={{ gap: theme.space(2) }}>
          {paragraph.heading ? (
            <Text variant="h3" weight="600">
              {paragraph.heading}
            </Text>
          ) : null}
          <Text variant="body" tone="muted">
            {paragraph.text}
          </Text>
        </View>
      ))}
    </Screen>
  );
}
