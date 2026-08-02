import { useEffect } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BellOff } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { formatDateTime } from '@/domain/format';
import { useLoyalty } from '@/stores/loyalty';
import { Screen } from '@/components/Screen';
import { Empty } from '@/components/State';
import { Text } from '@/components/Text';

export default function NotificationsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const notifications = useLoyalty((s) => s.notifications);
  const loadNotifications = useLoyalty((s) => s.loadNotifications);
  const markRead = useLoyalty((s) => s.markNotificationsRead);
  const hasUnread = notifications.some((n) => !n.read);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        hasUnread ? (
          <Pressable accessibilityRole="button" onPress={() => void markRead()}>
            <Text variant="small" tone="primary" weight="600">
              {t('notifications.markRead')}
            </Text>
          </Pressable>
        ) : null,
    });
  }, [navigation, hasUnread, markRead, t]);

  return (
    <Screen scroll={false}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        onRefresh={() => void loadNotifications()}
        refreshing={false}
        contentContainerStyle={{
          padding: theme.space(4),
          paddingBottom: theme.space(10),
          gap: theme.space(2),
        }}
        ListEmptyComponent={
          <Empty title={t('notifications.empty')} icon={<BellOff size={28} color={theme.color.textMuted} />} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: theme.color.surface,
              borderRadius: theme.radius.md,
              padding: theme.space(4),
              gap: theme.space(2),
              borderLeftWidth: 3,
              borderLeftColor: item.read ? 'transparent' : theme.color.primary,
            }}
          >
            <Text variant="h3" weight={item.read ? '500' : '700'}>
              {item.title}
            </Text>
            <Text variant="body" tone="muted">
              {item.body}
            </Text>
            <Text variant="tiny" tone="muted">
              {formatDateTime(item.createdAt)}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}
