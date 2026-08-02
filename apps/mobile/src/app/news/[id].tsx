import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { getNewsPost } from '@/api/content';
import { formatDate } from '@/domain/format';
import type { NewsPost } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/State';
import { Text } from '@/components/Text';

export default function NewsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<NewsPost | null>(null);

  useEffect(() => {
    void getNewsPost(id).then(setPost).catch(() => setPost(null));
  }, [id]);

  if (!post) return <Loading />;

  return (
    <Screen>
      <Image
        source={{ uri: post.coverUrl }}
        style={{ width: '100%', height: 260 }}
        contentFit="cover"
        transition={200}
      />

      <View style={{ padding: theme.space(5), gap: theme.space(3) }}>
        <Text variant="small" tone="muted">
          {formatDate(post.publishedAt)}
        </Text>
        <Text variant="h1">{post.title}</Text>
        <Text variant="body" tone="muted">
          {post.body}
        </Text>
      </View>
    </Screen>
  );
}
