import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface CardProps {
  children: ReactNode;
  /** Removes inner padding — for cards whose children own their spacing. */
  bare?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Grouped-list surface: white card, generous radius, no hard border. */
export function Card({ children, bare = false, style }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.color.surface,
          borderRadius: theme.radius.lg,
          padding: bare ? 0 : theme.space(4),
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
