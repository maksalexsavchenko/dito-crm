import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface PatternBackgroundProps {
  children?: React.ReactNode;
  /** Tile size in points — smaller reads as texture, larger as graphic. */
  tile?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Soft triangular brand texture used behind the guest card. Rendered as an SVG
 * pattern so it tiles at any size without shipping a bitmap.
 */
export function PatternBackground({
  children,
  tile = 28,
  opacity = 0.5,
  style,
}: PatternBackgroundProps) {
  const theme = useTheme();

  return (
    <View style={[{ backgroundColor: theme.color.accentSoft, overflow: 'hidden' }, style]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="brandTiles" width={tile} height={tile} patternUnits="userSpaceOnUse">
            <Path d={`M0 0 L${tile} 0 L0 ${tile} Z`} fill={theme.color.primary} opacity={opacity} />
            <Path
              d={`M${tile} ${tile} L${tile} ${tile / 2} L${tile / 2} ${tile} Z`}
              fill={theme.color.primary}
              opacity={opacity * 0.6}
            />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#brandTiles)" opacity={0.14} />
      </Svg>
      {children}
    </View>
  );
}
