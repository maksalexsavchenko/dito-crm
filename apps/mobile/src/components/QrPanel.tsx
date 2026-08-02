import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface QrPanelProps {
  /** Payload the till scans — the card number, until the backend issues tokens. */
  value: string;
  size?: number;
  /** White plate behind the code, so it scans on any background. */
  plate?: boolean;
}

export function QrPanel({ value, size = 200, plate = true }: QrPanelProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: plate ? '#FFFFFF' : 'transparent',
        borderRadius: theme.radius.lg,
        padding: plate ? theme.space(4) : 0,
        alignSelf: 'center',
      }}
    >
      <QRCode value={value} size={size} backgroundColor="#FFFFFF" color="#000000" />
    </View>
  );
}
