import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from './Button';
import { Text } from './Text';

export function Loading() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.color.background,
      }}
    >
      <ActivityIndicator color={theme.color.primary} />
    </View>
  );
}

interface EmptyProps {
  title: string;
  body?: string;
  icon?: ReactNode;
  action?: { label: string; onPress: () => void };
}

export function Empty({ title, body, icon, action }: EmptyProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.space(3),
        paddingVertical: theme.space(16),
        paddingHorizontal: theme.space(8),
      }}
    >
      {icon}
      <Text variant="h3" center>
        {title}
      </Text>
      {body ? (
        <Text variant="body" tone="muted" center>
          {body}
        </Text>
      ) : null}
      {action ? (
        <Button label={action.label} onPress={action.onPress} variant="secondary" />
      ) : null}
    </View>
  );
}

/** Section heading above a group of cards. */
export function SectionTitle({ children }: { children: string }) {
  const theme = useTheme();

  return (
    <Text
      variant="h2"
      style={{ paddingHorizontal: theme.space(4), marginBottom: theme.space(3) }}
    >
      {children}
    </Text>
  );
}
