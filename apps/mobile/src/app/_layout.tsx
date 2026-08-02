import '@/i18n';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { useLoyalty } from '@/stores/loyalty';
import { Loading } from '@/components/State';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const theme = useTheme();
  const { t } = useTranslation();
  const status = useAuth((s) => s.status);
  const bootstrap = useAuth((s) => s.bootstrap);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  // Loading here rather than in (tabs) means a deep link straight to
  // /transactions or /vouchers has its data too.
  useEffect(() => {
    if (status === 'authenticated') void useLoyalty.getState().load();
  }, [status]);

  // Auth gate: keep anonymous users inside (auth) and signed-in users out of it.
  useEffect(() => {
    if (status === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (status === 'anonymous' && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, segments, router]);

  if (status === 'loading') return <Loading />;

  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.color.chrome },
          headerTintColor: theme.color.text,
          headerTitleStyle: { fontSize: theme.font.h3, fontWeight: '600' },
          headerShadowVisible: false,
          // Chevron only. The default label is the previous screen's title, and
          // for a route group that is its directory name — "(tabs)" on screen.
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: theme.color.background },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: t('profile.title') }} />
        <Stack.Screen name="transactions" options={{ title: t('transactions.title') }} />
        <Stack.Screen name="notifications" options={{ title: t('notifications.title') }} />
        <Stack.Screen name="review" options={{ title: t('review.title') }} />
        <Stack.Screen name="invite" options={{ title: t('invite.title') }} />
        <Stack.Screen name="vouchers" options={{ title: t('vouchers.title') }} />
        <Stack.Screen name="about" options={{ title: t('about.title') }} />
        <Stack.Screen name="legal/[slug]" options={{ title: '' }} />
        <Stack.Screen name="news/[id]" options={{ title: t('news.title') }} />
        <Stack.Screen name="location/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}
