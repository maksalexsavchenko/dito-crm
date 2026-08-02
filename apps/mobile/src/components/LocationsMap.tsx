import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { View } from 'react-native';
import type { Location } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface LocationsMapProps {
  locations: Location[];
  onSelect: (location: Location) => void;
}

/** Region that fits every pin, with a little breathing room around the edges. */
function regionFor(locations: Location[]) {
  const lats = locations.map((l) => l.latitude);
  const lngs = locations.map((l) => l.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.02, (maxLat - minLat) * 1.6),
    longitudeDelta: Math.max(0.02, (maxLng - minLng) * 1.6),
  };
}

export function LocationsMap({ locations, onSelect }: LocationsMapProps) {
  const theme = useTheme();
  if (locations.length === 0) return null;

  return (
    <MapView
      // Apple Maps on iOS needs no API key; Android will need one in app.json.
      provider={PROVIDER_DEFAULT}
      style={{ flex: 1 }}
      initialRegion={regionFor(locations)}
      showsUserLocation
      showsMyLocationButton={false}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title={location.title}
          description={location.address}
          onCalloutPress={() => onSelect(location)}
        >
          <View
            style={{
              backgroundColor: theme.color.surface,
              borderColor: theme.color.primary,
              borderWidth: 2,
              borderRadius: theme.radius.pill,
              paddingHorizontal: theme.space(3),
              paddingVertical: theme.space(1.5),
            }}
          >
            <Text variant="tiny" weight="700" tone="primary">
              {location.hours.openNow ? '●' : '○'}
            </Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}
