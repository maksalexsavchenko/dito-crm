import { Linking } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { Globe, Mail, Phone } from 'lucide-react-native';
import { useBrand, useTheme } from '@/theme/ThemeProvider';
import { formatPhone } from '@/domain/format';
import { ListGroup, ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

export default function AboutScreen() {
  const theme = useTheme();
  const brand = useBrand();
  const { t } = useTranslation();

  const iconProps = { size: 20, color: theme.color.textMuted };
  const version = Constants.expoConfig?.version ?? '0.0.0';

  return (
    <Screen contentStyle={{ padding: theme.space(4), gap: theme.space(5) }}>
      <Text variant="body" tone="muted">
        {t('about.body')}
      </Text>

      <ListGroup>
        <ListRow
          label={t('about.website')}
          icon={<Globe {...iconProps} />}
          detail={brand.website.replace(/^https?:\/\//, '')}
          onPress={() => void Linking.openURL(brand.website)}
        />
        <ListRow
          label={t('about.email')}
          icon={<Mail {...iconProps} />}
          detail={brand.supportEmail}
          onPress={() => void Linking.openURL(`mailto:${brand.supportEmail}`)}
        />
        <ListRow
          label={t('about.phone')}
          icon={<Phone {...iconProps} />}
          detail={formatPhone(brand.supportPhone.replace(/\s/g, ''))}
          onPress={() => void Linking.openURL(`tel:${brand.supportPhone.replace(/\s/g, '')}`)}
          divider={false}
        />
      </ListGroup>

      <ListGroup>
        <ListRow label={t('about.version')} detail={version} chevron={false} divider={false} />
      </ListGroup>

      <Text variant="tiny" tone="muted" center>
        {brand.legalName}
      </Text>
    </Screen>
  );
}
