import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'tiny';
export type TextTone = 'default' | 'muted' | 'primary' | 'danger' | 'success' | 'onPrimary';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextStyle['fontWeight'];
  center?: boolean;
}

/** Single place where typography meets the theme, so screens stay declarative. */
export function Text({
  variant = 'body',
  tone = 'default',
  weight,
  center,
  style,
  ...rest
}: AppTextProps) {
  const theme = useTheme();

  const color = {
    default: theme.color.text,
    muted: theme.color.textMuted,
    primary: theme.color.primary,
    danger: theme.color.danger,
    success: theme.color.success,
    onPrimary: theme.color.primaryForeground,
  }[tone];

  const defaultWeight: TextStyle['fontWeight'] =
    variant === 'display' || variant === 'h1' || variant === 'h2' ? '700' : '400';

  return (
    <RNText
      style={[
        {
          color,
          fontSize: theme.font[variant],
          lineHeight: Math.round(theme.font[variant] * (variant === 'body' ? 1.45 : 1.25)),
          fontWeight: weight ?? defaultWeight,
          textAlign: center ? 'center' : 'auto',
        },
        style,
      ]}
      {...rest}
    />
  );
}
