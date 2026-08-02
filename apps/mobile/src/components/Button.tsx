import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  /** Rendered before the label — an icon, usually. */
  leading?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  leading,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const inactive = disabled || loading;

  const background = {
    primary: theme.color.primary,
    secondary: theme.color.surfaceAlt,
    ghost: 'transparent',
    danger: theme.color.danger,
  }[variant];

  const labelTone = variant === 'primary' || variant === 'danger' ? 'onPrimary' : 'default';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        {
          backgroundColor: background,
          borderRadius: theme.radius.pill,
          paddingVertical: theme.space(4),
          paddingHorizontal: theme.space(6),
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: theme.space(2),
          opacity: inactive ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={labelTone === 'onPrimary' ? theme.color.primaryForeground : theme.color.text}
        />
      ) : (
        <>
          {leading ? <View>{leading}</View> : null}
          <Text variant="h3" weight="600" tone={labelTone}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
