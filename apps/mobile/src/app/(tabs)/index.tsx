import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Star } from 'lucide-react-native';
import { useBrand, useTheme } from '@/theme/ThemeProvider';
import { formatMoney } from '@/domain/format';
import { useAuth } from '@/stores/auth';
import { selectUnreadCount, useLoyalty } from '@/stores/loyalty';
import { Card } from '@/components/Card';
import { PatternBackground } from '@/components/PatternBackground';
import { QrPanel } from '@/components/QrPanel';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/State';
import { Text } from '@/components/Text';
import { TierProgress } from '@/components/TierProgress';

export default function HomeScreen() {
  const theme = useTheme();
  const brand = useBrand();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const member = useAuth((s) => s.member);
  const news = useLoyalty((s) => s.news);
  const loading = useLoyalty((s) => s.loading);
  const load = useLoyalty((s) => s.load);
  const unread = useLoyalty(selectUnreadCount);

  if (!member) return null;

  return (
    <Screen tabBarPadding onRefresh={() => void load()} refreshing={loading}>
      <View
        style={{
          paddingTop: insets.top + theme.space(3),
          paddingHorizontal: theme.space(4),
          paddingBottom: theme.space(4),
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(3),
          backgroundColor: theme.color.chrome,
        }}
      >
        <Text variant="h2" style={{ flex: 1 }}>
          {t('home.greeting', { name: member.firstName })}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('notifications.title')}
          onPress={() => router.push('/notifications')}
          style={{ padding: theme.space(1) }}
        >
          <Bell size={24} color={theme.color.primary} />
          {unread > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                minWidth: 16,
                height: 16,
                paddingHorizontal: 4,
                borderRadius: theme.radius.pill,
                backgroundColor: theme.color.danger,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text variant="tiny" weight="700" tone="onPrimary">
                {unread}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={{ padding: theme.space(4), gap: theme.space(4) }}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/card')}>
          <PatternBackground style={{ borderRadius: theme.radius.lg }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: theme.space(5),
                gap: theme.space(4),
              }}
            >
              <View style={{ flex: 1, gap: theme.space(2) }}>
                <Text variant="display" weight="700">
                  {formatMoney(member.bonusBalance)}
                </Text>
                <Text variant="body" tone="muted">
                  {t('home.balance')}
                </Text>
                <View style={{ marginTop: theme.space(4) }}>
                  <TierProgress spendTotal={member.spendTotal} compact />
                </View>
              </View>

              <QrPanel value={member.cardNumber} size={92} />
            </View>
          </PatternBackground>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => router.push('/review')}>
          <Card style={{ gap: theme.space(3) }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.radius.md,
                backgroundColor: '#FFF4D6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Star size={20} color={theme.color.warning} fill={theme.color.warning} />
            </View>
            <Text variant="h3" weight="600">
              {t('home.reviewTitle')}
            </Text>
            <Text variant="body" tone="muted">
              {t('home.reviewBody')}
            </Text>
          </Card>
        </Pressable>
      </View>

      <View style={{ gap: theme.space(3) }}>
        <SectionTitle>{t('home.news')}</SectionTitle>

        {news.length === 0 ? (
          <Text
            variant="body"
            tone="muted"
            style={{ paddingHorizontal: theme.space(4) }}
          >
            {t('home.newsEmpty')}
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.space(4),
              gap: theme.space(3),
            }}
          >
            {news.map((post) => (
              <Pressable
                key={post.id}
                accessibilityRole="button"
                onPress={() => router.push(`/news/${post.id}`)}
                style={{ width: 260 }}
              >
                <Card bare>
                  <Image
                    source={{ uri: post.coverUrl }}
                    style={{ width: '100%', height: 190 }}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={{ padding: theme.space(4), gap: theme.space(2) }}>
                    <Text variant="h3" weight="600" numberOfLines={2}>
                      {post.title}
                    </Text>
                    <Text variant="small" tone="muted" numberOfLines={2}>
                      {post.excerpt}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <Text
        variant="tiny"
        tone="muted"
        center
        style={{ paddingTop: theme.space(8), paddingHorizontal: theme.space(8) }}
      >
        {brand.legalName}
      </Text>
    </Screen>
  );
}
