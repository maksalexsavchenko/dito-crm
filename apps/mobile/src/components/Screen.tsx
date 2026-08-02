import type { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

interface ScreenProps {
  children: ReactNode;
  /** Renders a plain View instead of a ScrollView — for screens with a FlatList. */
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Extra bottom padding so content clears the tab bar. */
  tabBarPadding?: boolean;
  /** Lets a parent background (e.g. the brand pattern) show through. */
  transparent?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

const TAB_BAR_CLEARANCE = 24;

export function Screen({
  children,
  scroll = true,
  onRefresh,
  refreshing = false,
  tabBarPadding = false,
  transparent = false,
  contentStyle,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const paddingBottom = (tabBarPadding ? TAB_BAR_CLEARANCE : 0) + Math.max(insets.bottom, 16);
  const backgroundColor = transparent ? 'transparent' : theme.color.background;

  if (!scroll) {
    return <View style={[{ flex: 1, backgroundColor }, contentStyle]}>{children}</View>;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={[{ paddingBottom }, contentStyle]}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.color.textMuted}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}
