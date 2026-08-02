import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { List, Map } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useLoyalty } from '@/stores/loyalty';
import { LocationCard } from '@/components/LocationCard';
import { LocationsMap } from '@/components/LocationsMap';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { Empty } from '@/components/State';

type ViewMode = 'list' | 'map';

export default function LocationsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const locations = useLoyalty((s) => s.locations);
  const loading = useLoyalty((s) => s.loading);
  const load = useLoyalty((s) => s.load);

  const [mode, setMode] = useState<ViewMode>('list');

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ paddingLeft: theme.space(2) }}>
          <Segmented
            compact
            value={mode}
            onChange={setMode}
            options={[
              {
                value: 'list',
                icon: (
                  <List size={18} color={mode === 'list' ? theme.color.primary : theme.color.textMuted} />
                ),
              },
              {
                value: 'map',
                icon: (
                  <Map size={18} color={mode === 'map' ? theme.color.primary : theme.color.textMuted} />
                ),
              },
            ]}
          />
        </View>
      ),
    });
  }, [navigation, mode, theme]);

  if (mode === 'map') {
    return (
      <Screen scroll={false}>
        <LocationsMap
          locations={locations}
          onSelect={(location) => router.push(`/location/${location.id}`)}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={() => void load()}
        contentContainerStyle={{
          padding: theme.space(4),
          paddingBottom: theme.space(12),
          gap: theme.space(4),
        }}
        ListEmptyComponent={loading ? null : <Empty title={t('locations.empty')} />}
        renderItem={({ item }) => (
          <LocationCard location={item} onPress={() => router.push(`/location/${item.id}`)} />
        )}
      />
    </Screen>
  );
}
