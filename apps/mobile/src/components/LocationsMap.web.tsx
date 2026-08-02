import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MapPinned } from 'lucide-react-native';
import type { Location } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface LocationsMapProps {
  locations: Location[];
  onSelect: (location: Location) => void;
}

/**
 * react-native-maps has no web implementation, so `expo start --web` gets a
 * placeholder instead of a red screen. Native builds use LocationsMap.tsx.
 */
export function LocationsMap({ locations }: LocationsMapProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.space(3),
        backgroundColor: theme.color.surfaceAlt,
      }}
    >
      <MapPinned size={32} color={theme.color.textMuted} />
      <Text variant="body" tone="muted" center>
        {t('locations.mapUnavailable')}
      </Text>
      <Text variant="small" tone="muted">
        {locations.length}
      </Text>
    </View>
  );
}
