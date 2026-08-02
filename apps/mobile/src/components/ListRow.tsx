import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface ListRowProps {
  label: string;
  icon?: ReactNode;
  detail?: string;
  onPress?: () => void;
  /** Renders label and icon in the danger colour — sign-out, delete account. */
  destructive?: boolean;
  /** Hides the chevron for rows that aren't navigation. */
  chevron?: boolean;
  /** Replaces the chevron, e.g. with a Switch. */
  accessory?: ReactNode;
  /** Separator between rows inside one group. */
  divider?: boolean;
}

export function ListRow({
  label,
  icon,
  detail,
  onPress,
  destructive = false,
  chevron = true,
  accessory,
  divider = true,
}: ListRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(3),
        paddingVertical: theme.space(4),
        paddingHorizontal: theme.space(4),
        borderBottomWidth: divider ? 1 : 0,
        borderBottomColor: theme.color.border,
        backgroundColor: pressed && onPress ? theme.color.surfaceAlt : 'transparent',
      })}
    >
      {icon ? <View style={{ width: 24, alignItems: 'center' }}>{icon}</View> : null}

      <Text style={{ flex: 1 }} variant="h3" tone={destructive ? 'danger' : 'default'}>
        {label}
      </Text>

      {detail ? (
        <Text variant="body" tone="muted">
          {detail}
        </Text>
      ) : null}

      {accessory ?? (chevron && onPress && !destructive ? (
        <ChevronRight size={18} color={theme.color.textMuted} />
      ) : null)}
    </Pressable>
  );
}

/** Groups rows into one rounded card, iOS settings style. */
export function ListGroup({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.color.surface,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}
