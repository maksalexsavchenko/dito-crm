import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, MapPin, MoreHorizontal, QrCode } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.color.chrome },
        headerTintColor: theme.color.text,
        headerTitleStyle: { fontSize: theme.font.h3, fontWeight: '600' },
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.color.primary,
        tabBarInactiveTintColor: theme.color.textMuted,
        tabBarStyle: {
          backgroundColor: theme.color.chrome,
          borderTopColor: theme.color.border,
        },
        tabBarLabelStyle: { fontSize: theme.font.tiny },
        sceneStyle: { backgroundColor: theme.color.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: t('tabs.card'),
          headerTitle: t('card.title'),
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: t('tabs.locations'),
          headerTitle: t('locations.title'),
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tabs.more'),
          headerTitle: t('more.title'),
          tabBarIcon: ({ color, size }) => <MoreHorizontal size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
