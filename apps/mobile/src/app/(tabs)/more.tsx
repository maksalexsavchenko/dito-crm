import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  FileText,
  Gift,
  LogOut,
  Pencil,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Star,
  Ticket,
  Trash2,
  UserRound,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { resetMockBackend } from '@/api/auth';
import { useAuth } from '@/stores/auth';
import { selectUnreadCount, useLoyalty } from '@/stores/loyalty';
import { ListGroup, ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';

export default function MoreScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const signOut = useAuth((s) => s.signOut);
  const deleteAccount = useAuth((s) => s.deleteAccount);
  const clear = useLoyalty((s) => s.clear);
  const unread = useLoyalty(selectUnreadCount);

  const iconProps = { size: 20, color: theme.color.textMuted };

  const confirmSignOut = () => {
    Alert.alert(t('more.logoutConfirm'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('more.logout'),
        style: 'destructive',
        onPress: () => {
          clear();
          void signOut();
        },
      },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert(t('more.deleteTitle'), t('more.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          clear();
          void deleteAccount();
        },
      },
    ]);
  };

  const resetDemo = () => {
    Alert.alert(t('more.resetDemo'), t('more.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('more.resetDemo'),
        style: 'destructive',
        onPress: async () => {
          clear();
          await resetMockBackend();
          await signOut();
        },
      },
    ]);
  };

  return (
    <Screen tabBarPadding contentStyle={{ padding: theme.space(4), gap: theme.space(6) }}>
      <ListGroup>
        <ListRow
          label={t('more.editProfile')}
          icon={<Pencil {...iconProps} />}
          onPress={() => router.push('/profile')}
        />
        <ListRow
          label={t('more.transactions')}
          icon={<Receipt {...iconProps} />}
          onPress={() => router.push('/transactions')}
        />
        <ListRow
          label={t('more.notifications')}
          icon={<Bell {...iconProps} />}
          detail={unread > 0 ? String(unread) : undefined}
          onPress={() => router.push('/notifications')}
        />
        <ListRow
          label={t('more.review')}
          icon={<Star {...iconProps} />}
          onPress={() => router.push('/review')}
        />
        <ListRow
          label={t('more.invite')}
          icon={<Gift {...iconProps} />}
          onPress={() => router.push('/invite')}
        />
        <ListRow
          label={t('more.vouchers')}
          icon={<Ticket {...iconProps} />}
          onPress={() => router.push('/vouchers')}
        />
        <ListRow
          label={t('more.about')}
          icon={<UserRound {...iconProps} />}
          onPress={() => router.push('/about')}
          divider={false}
        />
      </ListGroup>

      <ListGroup>
        <ListRow
          label={t('more.terms')}
          icon={<FileText {...iconProps} />}
          onPress={() => router.push('/legal/terms')}
        />
        <ListRow
          label={t('more.privacy')}
          icon={<ShieldCheck {...iconProps} />}
          onPress={() => router.push('/legal/privacy')}
          divider={false}
        />
      </ListGroup>

      <ListGroup>
        <ListRow
          label={t('more.logout')}
          icon={<LogOut size={20} color={theme.color.danger} />}
          onPress={confirmSignOut}
          destructive
        />
        <ListRow
          label={t('more.deleteAccount')}
          icon={<Trash2 size={20} color={theme.color.danger} />}
          onPress={confirmDelete}
          destructive
          divider={false}
        />
      </ListGroup>

      {/* Demo affordance — drop this group once a real backend is wired in. */}
      <View style={{ gap: theme.space(2) }}>
        <ListGroup>
          <ListRow
            label={t('more.resetDemo')}
            icon={<RotateCcw {...iconProps} />}
            onPress={resetDemo}
            chevron={false}
            divider={false}
          />
        </ListGroup>
        <Text variant="tiny" tone="muted" center>
          Демо-режим: дані зберігаються лише на цьому пристрої.
        </Text>
      </View>
    </Screen>
  );
}
