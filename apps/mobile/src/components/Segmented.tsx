import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export interface SegmentedOption<T extends string> {
  value: T;
  label?: string;
  icon?: ReactNode;
}

/** Icon size in points; the wrapper pins it so a tight parent can't shrink it. */
const ICON_BOX = 18;

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Shrinks to content instead of filling the row — used for icon toggles. */
  compact?: boolean;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  compact = false,
}: SegmentedProps<T>) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.color.surfaceAlt,
        borderRadius: theme.radius.md,
        padding: 3,
        alignSelf: compact ? 'flex-start' : 'stretch',
        gap: 3,
      }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={{
              flex: compact ? 0 : 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.space(2),
              paddingVertical: theme.space(2),
              paddingHorizontal: theme.space(compact ? 4 : 3),
              borderRadius: theme.radius.sm,
              backgroundColor: active ? theme.color.surface : 'transparent',
            }}
          >
            {option.icon ? (
              <View
                style={{
                  width: ICON_BOX,
                  height: ICON_BOX,
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {option.icon}
              </View>
            ) : null}
            {option.label ? (
              <Text variant="body" weight={active ? '600' : '400'} tone={active ? 'default' : 'muted'}>
                {option.label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
