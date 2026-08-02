import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import type { Location } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from './Card';
import { Text } from './Text';

interface LocationCardProps {
  location: Location;
  onPress: () => void;
}

export function LocationCard({ location, onPress }: LocationCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card bare>
        <View style={{ padding: theme.space(3) }}>
          <Image
            source={{ uri: location.photoUrl }}
            style={{ width: '100%', height: 180, borderRadius: theme.radius.md }}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View style={{ paddingHorizontal: theme.space(4), paddingBottom: theme.space(4), gap: theme.space(2) }}>
          <Text variant="h3" weight="600">
            {location.title}
          </Text>
          <Text variant="body" tone="muted" numberOfLines={1}>
            {location.address}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: location.hours.openNow ? theme.color.primary : theme.color.textMuted,
              }}
            />
            <Text variant="body">{location.hours.label}</Text>
          </View>

          <Text variant="small" tone={location.hours.openNow ? 'success' : 'muted'}>
            {location.hours.openNow ? t('locations.openNow') : t('locations.closed')}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
