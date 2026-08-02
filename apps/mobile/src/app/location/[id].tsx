import { useEffect, useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react-native';
import { getLocation } from '@/api/content';
import { formatPhone } from '@/domain/format';
import type { Location } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Loading } from '@/components/State';
import { Text } from '@/components/Text';

export default function LocationScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    void getLocation(id).then(setLocation).catch(() => setLocation(null));
  }, [id]);

  useEffect(() => {
    if (location) navigation.setOptions({ title: t('locations.title') });
  }, [navigation, location, t]);

  if (!location) return <Loading />;

  const openRoute = () => {
    const { latitude, longitude, title } = location;
    // Apple Maps on iOS, Google Maps everywhere else.
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(title)}`
        : `geo:${latitude},${longitude}?q=${encodeURIComponent(title)}`;
    void Linking.openURL(url);
  };

  const iconProps = { size: 18, color: theme.color.textMuted };

  return (
    <Screen contentStyle={{ gap: theme.space(4) }}>
      <Image
        source={{ uri: location.photoUrl }}
        style={{ width: '100%', height: 240 }}
        contentFit="cover"
        transition={200}
      />

      <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(4) }}>
        <Text variant="h1">{location.title}</Text>

        <Card style={{ gap: theme.space(3) }}>
          <View style={{ flexDirection: 'row', gap: theme.space(3) }}>
            <MapPin {...iconProps} />
            <Text variant="body" style={{ flex: 1 }}>
              {location.address}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: theme.space(3) }}>
            <Clock {...iconProps} />
            <Text variant="body" style={{ flex: 1 }}>
              {location.hours.label}
            </Text>
          </View>

          {location.phone ? (
            <View style={{ flexDirection: 'row', gap: theme.space(3) }}>
              <Phone {...iconProps} />
              <Text variant="body" style={{ flex: 1 }}>
                {formatPhone(location.phone)}
              </Text>
            </View>
          ) : null}
        </Card>

        <Button
          label={t('locations.route')}
          onPress={openRoute}
          leading={<Navigation size={18} color={theme.color.primaryForeground} />}
        />

        {location.phone ? (
          <Button
            label={t('locations.call')}
            variant="secondary"
            onPress={() => void Linking.openURL(`tel:${location.phone}`)}
            leading={<Phone size={18} color={theme.color.text} />}
          />
        ) : null}
      </View>
    </Screen>
  );
}
